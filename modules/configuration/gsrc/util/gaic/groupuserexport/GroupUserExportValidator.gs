package util.gaic.groupuserexport

class GroupUserExportValidator {

  construct() {

  }
  
  /**
  * Check all conditions for the group.  If a false condition is triggered
  * the check will stop and return the export status.
  */
  static public function isGroupReadyForExport(group : Group) : boolean {

    if(group.DivisionNameExt == null){
      return false
    }
    if(group.DivisionNameExt.DivisionNameValue == null){
      return false
    }
    if(group.Name == null){
      return null
    }
    if(group.Supervisor == null){
      return false
    }
    var businessAddress = GroupUserExportUtil.getBusinessAddress(group.Supervisor.Contact)        
    if(businessAddress == null){
      return false
    }
    if(isAddressReadyForExport(businessAddress) == false){
      return false
    }
    var mailingAddress = GroupUserExportUtil.getMailingAddress(group.Supervisor.Contact)
    if(mailingAddress == null){
      return false
    }
    if(isAddressReadyForExport(mailingAddress) == false){
      return false
    }   
    //group is valid
    return true
  }
  
  
  /**
  * Check all conditions for the user.  If a false condition is triggered
  * the check will stop and return the export status.
  */
  static public function isUserReadyForExport(user : User) : boolean {
    return isContactReadyForExport(user.Contact)
  }
  
  
  /**
  * Check all conditions for the contact.  If a false condition is triggered
  * the check will stop and return the export status.
  */
  static public function isContactReadyForExport(contact : UserContact) : boolean {
    
    //start validation
    if(contact.FirstName == null) {
      return false
    }
    if(contact.FirstName == null){
      return false
    }    
    if(contact.LastName == null){
      return false
    }
    if(contact.PrimaryPhoneValue == null){
      return false
    }
    if(contact.PrimaryPhoneValue == null){
      return false
    }      
    var businessAddress = GroupUserExportUtil.getBusinessAddress(contact)        
    if(businessAddress == null) {
      return false
    }
    if(isAddressReadyForExport(businessAddress) == false) {
      return false
    }
    var mailingAddress = GroupUserExportUtil.getMailingAddress(contact)
    if(mailingAddress == null) {
      return false
    }
    if(isAddressReadyForExport(mailingAddress)== false){
      return false
    }
    //validation finished with no failures, contact is valid
    return true  
  }
  
  
  /**
  * Check all conditions for the address.  If a false condition is triggered
  * the check will stop and return the export status.
  */
  private static function isAddressReadyForExport(address : util.gaic.groupuserexport.gaiggroupuserexport.Address) : boolean {
    
    if(address.AddressLine1 == null){
      return false
    }
    if(address.City == null){
      return false
    }
    if(address.State == null){
      return false
    }
    if(address.Zip == null){
      return false
    }
    
    //address is valid
    return true
  }

}
