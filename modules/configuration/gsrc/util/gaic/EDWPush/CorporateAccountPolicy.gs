package util.gaic.EDWPush
uses gw.processes.BatchProcessBase
uses gw.api.database.Query
uses gw.api.util.Logger

class CorporateAccountPolicy extends BatchProcessBase {
  var logger = Logger.forCategory("EDWConversionLog")
  private var _loadCommandID : int
  
  construct() {
    super(BatchProcessType.TC_CORPORATEACCOUNTPOLICY)
    logger.info("Corporate account policy implementation Starts" )
    _loadCommandID = Query.make(Claim).select().orderByDescending(\ c -> c.LoadCommandID ).FirstResult.LoadCommandID
    logger.info("Maximum loadcommandid is " + _loadCommandID)
  }  
  
  public override function checkInitialConditions():boolean {
    return true
  }
  
  
  override function doWork() {
    var claimKeys = Query.make(Claim).compare("LoadCommandID", Equals, _loadCommandID).select().keyIterator().toList()  //store list of claimKeys, instead of actual claims to reduce memory issues
    OperationsExpected = claimKeys.Count
    logger.info("Number of claims to process: " + claimKeys.Count)
    
    for(key in claimKeys){
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
        try{
          logger.info("Processing " + key.Value)
          var claim = bundle.loadByKey(key) as Claim
          util.admin.SecurityUtil.updateClaim(claim)
          claim.rebuildClaimACL()
          incrementOperationsCompleted()
        }catch(e){
          logger.info("Exception while processing " + key + ": " + e.Message)
          logger.error(e.StackTraceAsString)
          incrementOperationsFailed()
        }
      }, "su")
      logger.info("Finished " + key.Value)      
    } 
  }
}
