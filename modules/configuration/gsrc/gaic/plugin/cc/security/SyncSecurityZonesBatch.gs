package gaic.plugin.cc.security
uses gaic.plugin.cc.abstract.AbstractCustomBatch
uses gw.api.database.Query
uses java.util.ArrayList
uses util.admin.SecurityUtil
uses java.lang.StringBuilder

class SyncSecurityZonesBatch extends AbstractCustomBatch {

var user = "batchsu";
    
  construct() {
    super(BatchProcessType.TC_SYNCSECURITYZONES);
  }
  
  override function doIt() {
    var q = Query.make(SecurityBatchItemExt)
    var r = q.select().orderBy(\ item ->item.Claim).thenBy(\ item ->item.ID )
    var itemsForClaim = new ArrayList<SecurityBatchItemExt>();
    var previousClaim:Claim = null;
    var errors = new ArrayList();
    
    OperationsExpected = r.Count
    
    for (item in r) {
      var currentClaim:Claim = item.Claim;
         
      if (previousClaim != null && previousClaim != currentClaim) {
        //we've started a different claim, so lets finally process the previous one
        var error = processItems(itemsForClaim);
        if (error !=null) errors.add(error)
        itemsForClaim.clear();
      }
    //queue the current claim
    itemsForClaim.add(item);
    previousClaim = currentClaim;
    java.lang.Thread.sleep(10)
    }
  
    if (!itemsForClaim.isEmpty()) {
      var error = processItems(itemsForClaim);
      if (error !=null) errors.add(error)
    }
    printSummary()
    
    var sb = new StringBuilder()
    if (!errors.Empty) {
      for (var error in errors){
        sb.append("\r\n")
        sb.append(error)
      }
    sendEmail("Sync Security Zones - errors", sb.toString(), null);
    }
          
  } 

  function processItems(items:java.util.List<SecurityBatchItemExt>):String {
    try {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      for (item in items) {
        item = bundle.add(item);
        var claim = bundle.add(item.Claim);
          if (item.BatchOperation == BatchOperationExt.TC_ADD){
            SecurityUtil.addUserToClaimNow(claim,item.GenericUser,item.GenericGroup,item.UserRole)
          }else if (item.BatchOperation == BatchOperationExt.TC_REMOVE){
            SecurityUtil.removeUserFromClaimNow(claim,item.GenericUser,item.GenericGroup,item.UserRole)
          }
          item.remove();
        //}
          
        //inc operations completed and then failures in a catch block
          
        }
        },user);
        }catch(e){
        incrementOperationsFailed()
        var claimnumber = items.get(0).Claim.ClaimNumber
        var errormessage = "SyncSecurityZoneBatch - Failed to update claim: " + claimnumber
        gw.api.util.Logger.logError(errormessage, e)
        return errormessage;
        }
          
      incrementOperationsCompleted() 
            
      return null;
  } 

  
  override property get Progress() : String {
     return ("Processed " + this.OperationsCompleted + " of " + OperationsExpected)
  }
  
  private function printSummary(){
    gw.api.util.Logger.logInfo("Sync Security Batch Process is Complete.")
    gw.api.util.Logger.logInfo(OperationsCompleted + " of " + OperationsExpected + " operations completed successfully.")
    gw.api.util.Logger.logInfo(OperationsFailed + " of " + OperationsExpected + " operations failed.")
  }
  

  
}