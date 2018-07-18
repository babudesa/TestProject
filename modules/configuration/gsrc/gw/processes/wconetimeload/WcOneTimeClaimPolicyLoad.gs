package gw.processes.wconetimeload
uses gw.processes.BatchProcessBase
uses java.sql.Connection
uses com.gaic.claims.util.db.DatabaseUtil
uses java.util.ArrayList
uses java.sql.Statement
uses java.sql.ResultSet
uses com.gaic.claims.env.Environment

/**
 * This Process is for generating forcing the export of (1) policy messages to mitchell
 * (2) claims data to Mitchell, OCCM, and HCS
 */
class WcOneTimeClaimPolicyLoad extends BatchProcessBase {

  construct(batchProcessType:BatchProcessBase) {    
    this(batchProcessType)
  }
  
  construct() {
    super(BatchProcessType.TC_WCONETIMECLAIMPOLICYLOAD)
    con = DatabaseUtil.openConnectionToClaimCenterWithDefaultProperties()
    con.setAutoCommit(false);
  }
 
 
  var _iter : java.util.Iterator<String>
  private var con:Connection = null
  var _emailRecipient = (Environment.getInstance() == Environment.PROD) ? "ClaimCenterSupport@gaic.com" : "ClaimCenterTesting@gaic.com";
  var batchLoadCommandID : int = ScriptParameters.WcOneTimeClaimPolicy_LoadCommandID
    
  private var GET_CLAIM_IDS_TO_EXPORT = "select c.PublicID from cc_claim c" +
                                              " inner join cctl_claimstate cs" +
                                              " on c.State = cs.ID" +
                                              " inner join cc_group gr" +
                                              " on c.AssignedGroupID = gr.ID" +
                                              " inner join ccx_DivisionName dn" +
                                              " on gr.DivisionNameExt = dn.ID" +
                                              " inner join cctl_losstype lt" +
                                              " on c.LossType = lt.ID" +
                                              " where" +
                                              " (cs.TYPECODE = 'open'  or" +
                                              " cs.TYPECODE = 'closed') and" +
                                              " c.LoadCommandID is not null" +
                                              " and c.LoadCommandID = "+ batchLoadCommandID +
                                              " and (dn.DivisionNameValue like 'Alt%'or dn.DivisionNameValue like 'Strat%')" +
                                              " and" +
                                              " (lt.TYPECODE = 'AGRIEL' or"+
                                              " lt.TYPECODE = 'AGRIWC' or" +
                                              " lt.TYPECODE = 'ALTMARKETSEL' or" +
                                              " lt.TYPECODE = 'ALTMARKETSWC' or" +
                                              " lt.TYPECODE = 'ECUEL' or" +
                                              " lt.TYPECODE = 'ECUWC' or" +
                                              " lt.TYPECODE = 'OMEL' or" +
                                              " lt.TYPECODE = 'OMWC' or" +
                                              " lt.TYPECODE = 'PIMINMARINEEL' or" +
                                              " lt.TYPECODE = 'PIMINMARINEWC' or" +
                                              " lt.TYPECODE = 'SPECIALTYESEL' or" +
                                              " lt.TYPECODE = 'SPECIALTYESWC' or" +
                                              " lt.TYPECODE = 'STRATEGICCOMPEL' or" +
                                              " lt.TYPECODE = 'STRATEGICCOMPWC' or" +
                                              " lt.TYPECODE = 'TRUCKINGEL' or" +
                                              " lt.TYPECODE = 'TRUCKINGWC')" 

   
  override function doWork() {
    var list = new ArrayList<String>()
    list = this.getSetOfClaimPublicIdForExport()
    OperationsExpected = list.Count
    gw.api.util.Logger.logInfo("WcOneTimeClaimPolicyLoad.doWork() - Job has " + OperationsExpected + " records to process...")    
    _iter = list.iterator()    
    var item : String
    
    //generate custom claim and policy export event
      while(_iter.hasNext()){
        item = _iter.next()
        //find the claim in claimcenter
        var claim : Claim = find(c in Claim where c.PublicID == item).AtMostOneRow
        
        if(!this.TerminateRequested){
            try {
            //add custom event to claim and policy
            gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
                bundle.add(claim)
                claim.addEvent("ClaimExportTrigger")
                claim.Policy.addEvent("PolicyExportTrigger");
                 }, "su")
            gw.api.util.Logger.logInfo("Claim & Policy Exported: " + claim.ClaimNumber)
            incrementOperationsCompleted()
       
          } catch (ex) {
              //send email with error so we know it's erroring and can fix issue/retry later
              gw.api.util.Logger.logInfo("Claim / Policy export failed for " + claim.ClaimNumber + " " + ex.Message)
                                
              _iter.remove()     
              incrementOperationsFailed()                        
          }
        }
      }
      //print job results
      printSummary()   
  }
    
  

  private function getSetOfClaimPublicIdForExport() : ArrayList<String> {
     
    var sql:String
    sql = GET_CLAIM_IDS_TO_EXPORT;
    
    var st:Statement = null
    var rs:ResultSet = null
    
     try {
      var list = new ArrayList<String>()

      st = con.createStatement()
      rs = st.executeQuery(sql)
      
      while (rs.next()) {
        list.add(new String(rs.getString(1)))
      }
      
      return list
    } finally {
      DatabaseUtil.closeDatabaseResources(null, st, rs)
    }
  }
  
  
    override property get Progress() : String {
     return ("Processed " + this.OperationsCompleted + " of " + OperationsExpected)
  }
  
  
  
  private function printSummary(){
    gw.api.util.Logger.logInfo("WC one time Claim / Policy export Process is Complete.")
    gw.api.util.Logger.logInfo(OperationsCompleted + " of " + OperationsExpected + " operations completed successfully.")
    gw.api.util.Logger.logInfo(OperationsFailed + " of " + OperationsExpected + " operations failed.")  
    
    if(OperationsFailed > 0) {
      util.Email.sendMail(_emailRecipient, 
                                "WC one time Claim / Policy export Failed Operations", 
                                OperationsFailed + " operations failed to generate claim /policy export messages.  Check logs for details.")
    }
  } 

}
