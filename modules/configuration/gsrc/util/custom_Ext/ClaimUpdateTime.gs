package util.custom_Ext

uses gw.transaction.Transaction

class ClaimUpdateTime {

  construct() {
  }
  
  public function setClaimUpdateTime(theClaim:String, theDate:DateTime){
    
    if(theClaim != null and !theClaim.contains("T") and 
      gw.plugin.util.CurrentUserUtil.getCurrentUser().User != util.custom_Ext.finders.getUserOb("batchsu")and
      gw.plugin.util.CurrentUserUtil.getCurrentUser().User != util.custom_Ext.finders.getUserOb("sys")and
      gw.plugin.util.CurrentUserUtil.getCurrentUser().User != util.custom_Ext.finders.getUserOb("sys1") and
      gw.plugin.util.CurrentUserUtil.getCurrentUser().User != util.custom_Ext.finders.getUserOb("su")){
        
        insertUpdatedTime(theClaim, theDate)

    }
  }
  
  public function setClaimUpdateTimeFromBatch(theClaim:String, theDate:DateTime){
    
    if(theClaim != null and !theClaim.contains("T")){
        
        insertUpdatedTime(theClaim, theDate)

    }
  }
  
  private function insertUpdatedTime(theClaim:String, theDate:DateTime){
    
    var claimUpdated:ClaimUpdateTimeExt
    
    var claimUpdateTimeQuery = gw.api.database.Query.make(ClaimUpdateTimeExt)
    claimUpdateTimeQuery.compare("ClaimNumberUpdated", Equals, theClaim);
    var claimUpdateTimeRS = claimUpdateTimeQuery.select()
  
    if(!claimUpdateTimeRS.Empty){
      claimUpdated=claimUpdateTimeRS.FirstResult
      if(claimUpdated != null){
        Transaction.getCurrent().add(claimUpdated).LastUpdateTime = theDate
      }
    }else{
      if(!exists(bean in Transaction.getCurrent().InsertedBeans where bean typeis ClaimUpdateTimeExt and bean.ClaimNumberUpdated == theClaim) and
         !exists(bean in Transaction.getCurrent().UpdatedBeans where bean typeis ClaimUpdateTimeExt and bean.ClaimNumberUpdated == theClaim) ){
        claimUpdated = new ClaimUpdateTimeExt()
      
        claimUpdated.ClaimNumberUpdated = theClaim
        claimUpdated.LastUpdateTime = theDate
      
      }
    }
  }
  
  public function getClaimUpdateTime(theClaim:String):ClaimUpdateTimeExt{
    
    var claimUpdateTimeQuery = gw.api.database.Query.make(ClaimUpdateTimeExt)
    claimUpdateTimeQuery.compare("ClaimNumberUpdated", Equals, theClaim);
    var claimUpdateTimeRS = claimUpdateTimeQuery.select()
    
    if(!claimUpdateTimeRS.Empty){
      return claimUpdateTimeRS.getAtMostOneRow()
    }else{
      return null
    }
  }

}
