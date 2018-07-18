package util.gaic.groupuserexport
uses util.gaic.groupuserexport.gaiggroupuserexport.enums.RecordTypeEnum

class GroupUserExportContactFunctions {

 private construct() {}
 
  @Returns("a new instance of GroupUserExportContactFunctions class")
  static function getInstance() : GroupUserExportContactFunctions {
    return new GroupUserExportContactFunctions();
  }
  
  
  /**
  * Builds contact changed messages and sends to CC external
  */
  @Param("messageContext", "the context of the message")
  @Param("contact","the contact to check for changes")
  @Param("recordType", "the record type associated with this message")
  function sendContactChanges(messageContext : MessageContext, contact : UserContact, recordType : RecordTypeEnum) {
    var user = find(userC in User where userC.Contact == contact).AtMostOneRow       
    if(this.contactChanged(contact) || GroupUserExportUtil.userAddressChanged(contact)) {
      var userMessage = GroupUserExportUtil.buildContactMessage(user, contact, recordType)

      if(userMessage != null && userMessage != ""){
          GroupUserExportUtil.sendMessage(messageContext, userMessage)
      }
    }
    
    var userGroup = find(g in Group where g.Supervisor == user).FirstResult
    if(GroupUserExportUtil.userAddressChanged(contact) && userGroup != null) {
      var groupMessage = GroupUserExportUtil.buildContactGroupMessage(userGroup, contact, recordType)
      if(groupMessage != null && groupMessage != ""){
          GroupUserExportUtil.sendMessage(messageContext, groupMessage)
      }
    }
  }


  /**
  * Returns true if the contact has changed.
  */
  @Param("contact", "the claim to check for changes")
  @Returns("the changed status of the contact")
  protected function contactChanged(contact : UserContact) : boolean {
    
    if(this.contactFieldChanged(contact)){
        return true;
    }else{
        return false
    }     
  }
  
  
  /**
  * Checks to see if specific fields have changed on the contact.
  */
  @Param("contact", "the contact to check for field changes")
  @Returns("the changed field status of the contact")
  private function contactFieldChanged(contact : UserContact) : boolean {
    var fields = new String[] {"EmailAddress1","FaxPhone","FirstName","LastName","MiddleName"}
        
    if (util.gaic.CommonFunctions.fieldFromListChanged(contact, fields)) {
      return true
    }if((contact.OriginalVersion as UserContact).PrimaryPhoneValue != contact.PrimaryPhoneValue) {
      return true
    }else{
      return false
    }
  }

}
