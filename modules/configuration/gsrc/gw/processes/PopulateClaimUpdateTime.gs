package gw.processes
uses gw.processes.BatchProcessBase
uses gw.api.database.*

class PopulateClaimUpdateTime extends BatchProcessBase {
  
  var _iter : java.util.Iterator<Claim>
  var updateClaim : util.custom_Ext.ClaimUpdateTime = new util.custom_Ext.ClaimUpdateTime()
  
  construct(batchProcessType : BatchProcessBase) {
    this(batchProcessType)
  }
  
  construct() {
    super(BatchProcessType.TC_POPULATECLAIMUPDATETIME)
  }
  
  /*
    Find Claims with the following conditions:    
      1. claim doesn't have a temporary claim number
  */
  override function checkInitialConditions() : boolean {
    gw.api.util.Logger.logInfo("PopulateClaimUpdateTime.checkInitialConditions()...")
    //get initial candidate claims
    //var claims = find(c in Claim).toList()
    var claimQuery = Query.make(Claim)
    claimQuery.contains("ClaimNumber", "A", true)
    var claims = claimQuery.select().toList()
    
    //pare down to only claims that have not already been inserted into the table
    claims = claims.where(\ c -> updateClaim.getClaimUpdateTime(c.ClaimNumber) == null)    
    
    this.OperationsExpected = claims.Count
    
    _iter = claims.iterator()
    
    return true                                       
  }

  /*
    Finds the most recent user change to the claim or an claim array and inserts that time along with the ClaimNumber 
    into the ClaimUpdateTimeExt table.
  */   
  Override function doWork(): void {
    gw.api.util.Logger.logInfo("PopulateClaimUpdateTime.doWork()...\r\nJob has " + OperationsExpected + " records to process...")
    var clm : Claim
    var mostCurrentTime:DateTime
    
    while(_iter.hasNext()){
      clm = _iter.next()
      try{
        gw.transaction.Transaction.runWithNewBundle(\ bundle -> 
        {
          bundle.add(clm)
          
          if(!updatedBySystem(clm.UpdateUser)){
            mostCurrentTime = clm.UpdateTime
          }

          for(item in clm.getAllTransactions()){
            if((mostCurrentTime == null or item.UpdateTime > mostCurrentTime) and !updatedBySystem(item.UpdateUser)){
              mostCurrentTime = item.UpdateTime
            }
          }
          for(item in clm.Contacts){
            if((mostCurrentTime == null or item.UpdateTime > mostCurrentTime) and !updatedBySystem(item.UpdateUser)){
              mostCurrentTime = item.UpdateTime
            }
          }
          for(item in clm.Notes){
            if((mostCurrentTime == null or item.UpdateTime > mostCurrentTime) and !updatedBySystem(item.UpdateUser)){
              mostCurrentTime = item.UpdateTime
            }
          }
          for(item in clm.Documents){
            if((mostCurrentTime == null or item.UpdateTime > mostCurrentTime) and !updatedBySystem(item.UpdateUser)){
              mostCurrentTime = item.UpdateTime
            }
          }
          for(item in clm.Activities){
            if((mostCurrentTime == null or item.UpdateTime > mostCurrentTime) and !updatedBySystem(item.UpdateUser)){
              mostCurrentTime = item.UpdateTime
            }
          }
          for(item in clm.Exposures){
            if((mostCurrentTime == null or item.UpdateTime > mostCurrentTime) and !updatedBySystem(item.UpdateUser)){
              mostCurrentTime = item.UpdateTime
            }
          }
          for(item in clm.Evaluations){
            if((mostCurrentTime == null or item.UpdateTime > mostCurrentTime) and !updatedBySystem(item.UpdateUser)){
              mostCurrentTime = item.UpdateTime
            }
          }
          for(item in clm.Negotiations){
            if((mostCurrentTime == null or item.UpdateTime > mostCurrentTime) and !updatedBySystem(item.UpdateUser)){
              mostCurrentTime = item.UpdateTime
            }
          }
          for(item in clm.SIUInvestigationsExt){
            if((mostCurrentTime == null or item.UpdateTime > mostCurrentTime) and !updatedBySystem(item.UpdateUser)){
              mostCurrentTime = item.UpdateTime
            }
          }
          for(item in clm.Matters){
            if((mostCurrentTime == null or item.UpdateTime > mostCurrentTime) and !updatedBySystem(item.UpdateUser)){
              mostCurrentTime = item.UpdateTime
            }
          }
          for(item in clm.IndepAdjustersExt){
            if((mostCurrentTime == null or item.UpdateTime > mostCurrentTime) and !updatedBySystem(item.UpdateUser)){
              mostCurrentTime = item.UpdateTime
            }
          }
        
          if(mostCurrentTime == null){
            mostCurrentTime = clm.UpdateTime
          }
        
          updateClaim.setClaimUpdateTimeFromBatch(clm.ClaimNumber, mostCurrentTime)
        })
    
        incrementOperationsCompleted()
        
      }catch(e){
        incrementOperationsFailed()
        gw.api.util.Logger.logError("Failed to update the ClaimUpdateTimeExt table for claim: " + clm.ClaimNumber)
        gw.api.util.Logger.logError("Error: " + e)
      }
      mostCurrentTime = null
      _iter.remove()
    }
    gw.api.util.Logger.logInfo("PopulateClaimUpdateTime.doWork()...\r\nJob has processed " + OperationsCompleted + " records...")
  }
  
  private function updatedBySystem(updateUser:User):Boolean{
  
    var batchsuUser:User = util.custom_Ext.finders.getUserOb("batchsu")
    var sysUser:User = util.custom_Ext.finders.getUserOb("sys")
    var sys1User:User = util.custom_Ext.finders.getUserOb("sys1")
    var suUser:User = util.custom_Ext.finders.getUserOb("su")
    
    if(updateUser == batchsuUser or updateUser == sysUser or updateUser == sys1User or updateUser == suUser){
      return true
    }else{
      return false
    }
  }
}
