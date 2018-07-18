package gaic.conversion.util

class ConversionStatusChecker {

  construct() {}
  
 
  /**
  * If the script parameter CurrentConversionLoadCommandID equals the given
  * load command ID, then the item is part of the Batch of claims being currently
  * converted.
  * 
  * The load command ID on the claim is unique per convertion batch.
  */
  static public function isCurrentlyConverting(loadCommandID : int) : boolean {    
    return isLoadCommandIdFromCurrentlyConvertingBatch(loadCommandID)
  } 
  
  
  /**
  * If the script parameter CurrentConversionLoadCommandID equals the given
  * load command ID, then the item is part of the Batch of claims being currently
  * converted.
  * 
  * The load command ID on the claim is unique per convertion batch.
  */
  static public function isCurrentlyConverting(loadCommandID : int, createUser : User, updateUser : User) : boolean {    
    var isCurrentlyConverting : boolean
    
    if(isLoadCommandIdFromCurrentlyConvertingBatch(loadCommandID))
    {
      isCurrentlyConverting = true
    }else { 
      isCurrentlyConverting = false
    }
    return isCurrentlyConverting
  } 
  
  
  
  
  static public function isLoadCommandIdFromCurrentlyConvertingBatch(loadCommandID : int) : boolean { 
   var isLoadCommandIdFromCurrentlyConvertingBatch : boolean

    if(loadCommandID == ScriptParameters.CurrentConversionLoadCommandID || 
       loadCommandID == ScriptParameters.GOSULoadCommandID) 
    {
      isLoadCommandIdFromCurrentlyConvertingBatch = true
    }
    else 
    {
      isLoadCommandIdFromCurrentlyConvertingBatch = false
    }    
    return isLoadCommandIdFromCurrentlyConvertingBatch     
  }
  
  /**
  * If the script parameter ManualSyncLCID equals the given load command ID,
  * and the update user of the Batch Manual sync process equals the script parameter 
  * ManualSyncUsername, then the item was generated from the conversion manual sync process
  * 
  * The load command ID on the claim is unique per convertion batch.
  */
  static public function isCurrentlyinManualSync(loadCommandID : int, updateUser : User) : boolean {    
    var isCurrentlyinManualSync : boolean
    
    if(isLoadCommandIdFromManualSyncBatch(loadCommandID) && isManualSyncUser(updateUser)){
      isCurrentlyinManualSync = true
    }else { 
      isCurrentlyinManualSync = false
    }
    return isCurrentlyinManualSync
  }   
  
  static public function isLoadCommandIdFromManualSyncBatch(loadCommandID : int) : boolean { 
   var isLoadCommandIdFromManualSyncBatch : boolean

   if(loadCommandID == ScriptParameters.ManualSyncLCID) {
     isLoadCommandIdFromManualSyncBatch = true
   }else {
     isLoadCommandIdFromManualSyncBatch = false
   }    
     return isLoadCommandIdFromManualSyncBatch     
  }
  
  
  static public function isManualSyncUser(theUser : User) : boolean {
    var isManualSyncUser : boolean
    
    if(theUser != null && theUser.Credential.UserName.equals(ScriptParameters.ManualSyncUsername)) {
      isManualSyncUser = true
    }else {
      isManualSyncUser = false
    }
    return isManualSyncUser
  }
  
}
