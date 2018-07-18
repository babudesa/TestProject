package util.custom_Ext

class MatterActivator {

  construct() {

  }
  
    
   
    /*
    * Function checks to see if LOB has matters module activated 
    */
    function  DisableForMatters(lossType : LossType): boolean {
      
      var isDisabled = true           
      var rule = find (a in LSSAdminExt where a.LossTypeExt != null && a.LossTypeExt == lossType)
            
      if(rule == null){
          isDisabled = true
      }else{          
          if(rule.FirstResult.MatterModuleExt == false){
              isDisabled = true
          }else if(rule.FirstResult.MatterModuleExt == true){          
             isDisabled = false
          }
      }
      return isDisabled
    }
    
    
    
    /**
     * Gets indicator for if the LOB associated with the claim loss type 
     * 
     * @param lossType The loss type on the claim.
     * @returns Indicator for is LOB using LSS.
     */
    function isLOBUsingLSS(lossType : LossType): boolean {
    
        var rule = find (a in LSSAdminExt where a.LossTypeExt != null && a.LossTypeExt == lossType)
        
        if(rule != null){
           return rule.FirstResult.EnableLSSExt           
        }else{
            return false
        }    
    }
    
    
    
    
    
    
      
}
