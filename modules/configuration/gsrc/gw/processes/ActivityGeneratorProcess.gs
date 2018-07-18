package gw.processes
uses gw.transaction.Transaction
uses gw.api.util.Logger
uses gw.api.database.Query

class ActivityGeneratorProcess extends BatchProcessBase {
  
  var _iter : java.util.Iterator<Key>
  var completedOps : int

  construct(batchProcessType:BatchProcessBase) {    
    this(batchProcessType)
  }
  
  construct() {
    super(BatchProcessType.TC_ACTIVITYGENERATOR)
  }
  
  private static var USER = "sys"
    
 /**
  * Property stores the claims to be checked in the batch process. The
  * claims must be open, assigned, not be an incident report, not be a
  * draft, and not have a null LoadCommandID in order to be eligible for activity generation.
  * Returns part of the List with claims where the last digit of ClaimNumber = _batchCounter to resolve cache issue
  * 
  * @return List of claims eligible for activities
  */
  private property get ClaimsToCheck(): List<Key>{
    var qryClaim = Query.make(Claim)
    qryClaim.compareNotIn("State", {ClaimState.TC_DRAFT, ClaimState.TC_CLOSED})
    qryClaim.compare("IncidentReport", Equals, false)
    qryClaim.compare("AssignmentStatus", Equals, AssignmentStatus.TC_ASSIGNED)
    qryClaim.compare("LoadCommandID", Equals, null)
    
    var qryExp = qryClaim.subselect("ID", CompareNotIn, Exposure, "Claim")
    qryExp.compare("ReconnectFailExt", Equals, true)
    qryExp.compare("Claim", Equals, qryClaim.getColumnRef("ID"))
    
    return qryClaim.select().keyIterator().toList()
  }  
  
 /**
  * Runs each eligible claim through the ActivityGeneratorBatchRules 
  */ 
  override function doWork(){
    OperationsExpected = this.ClaimsToCheck.Count
    gw.api.util.Logger.logInfo("ActivityGeneratorProcess.doWork() - Job has " + OperationsExpected + " records to process...")
    _iter = ClaimsToCheck.iterator()
    var claim : Claim    
    
    while(_iter.hasNext()){
      completedOps = 0
      try{
          if(!this.TerminateRequested){        
              gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
                claim = bundle.loadByKey(_iter.next()) as Claim
                generateActivities(claim)
              }, USER)
        
              for(op in completedOps){
                incrementOperationsCompleted()
              } 
        
          }else{
              gw.api.util.Logger.logError("ActivityGeneratorProcess - Terminate Requested...")
              break
          }            
               
      }catch(e){
        incrementOperationsFailed()
        gw.api.util.Logger.logError("ActivityGeneratorProcess - Failed to generate activities for claim: " + claim.ClaimNumber)
        gw.api.util.Logger.logError("Error: " + e)
      }
      _iter.remove()
    }
    
    printSummary()
  }  
    
  private function generateActivities(claim : Claim){
  
      //var bundle = Transaction.getCurrent()
      //bundle.add(claim)
      
      //run the claim through the activity rule set
      rules.ActivityGeneratorBatch.ActivityGeneratorBatchRules.invoke(claim)
      completedOps++       
  }
  

  override property get Progress() : String {
     return ("Processed " + this.OperationsCompleted + " of " + OperationsExpected)
  }
  
  private function printSummary(){
    gw.api.util.Logger.logInfo("Activity Generator Batch Process is Complete.")
    gw.api.util.Logger.logInfo(OperationsCompleted + " of " + OperationsExpected + " operations completed successfully.")
    gw.api.util.Logger.logInfo(OperationsFailed + " of " + OperationsExpected + " operations failed.")
  }
}// End ActivityGeneratorProcess
