package util.gaic.groupuserexport
uses util.gaic.groupuserexport.gaiggroupuserexport.enums.RecordTypeEnum

class GroupUserExportUserFunctions {

  private construct() {}
  
  private static final var CUSTOM_SEND_EVENT_NAME : String = "GroupUserExportTrigger"
  
  @Returns("a new instance of GroupUserExportUserFunctions class")
  static function getInstance() : GroupUserExportUserFunctions {
    return new GroupUserExportUserFunctions();
  }

  /**
  * Builds user changed messages and sends to CC external
  */
  @Param("messageContext", "the context of the message")
  @Param("user","the contact to check for changes")
  @Param("recordType", "the record type associated with this message")
  function sendUserChanges(messageContext : MessageContext, user : User, recordType : RecordTypeEnum) {
    var message :String = null
    
    //If this is a custom group/user export trigger then send without checking changes.
    if(messageContext.EventName.equalsIgnoreCase(CUSTOM_SEND_EVENT_NAME)) {
      message = GroupUserExportUtil.buildUserMessage(user, recordType)   
    }else{    
      if(this.userChanged(user)) {
        message = GroupUserExportUtil.buildUserMessage(user, recordType)
      }  
    }
    
    //if message isn't null or empty then send it
    if(message != null && message != ""){
        GroupUserExportUtil.sendMessage(messageContext, message)
    }           
  }
  

  /**
  * Returns true if the user has changed.
  */
  @Param("user", "the user to check for changes")
  @Returns("the changed status of the user")
  protected function userChanged(user : User) : boolean {
    
    if(this.userFieldChanged(user) || GroupUserExportUtil.userAddressChanged(user.Contact)||
        this.userContactFieldChanged(user)){
        return true;
    }else{
        return false
    }     
  }
  
    
  /**
  * Checks to see if specific fields have changed on the group.
  */
  @Param("user", "user to check for field changes")
  @Returns("the changed field status of the user")
  private function userFieldChanged(user : User) : boolean {
    var fields = new String[] {"Contact","JobTitle"}

    if (util.gaic.CommonFunctions.fieldFromListChanged(user, fields)) {
      return true
    }else{
      return false
    }
  }
  
  
  /**
  * Checks to see if specific fields have changed on the user.
  */
  @Param("user", "the user to check for field changes")
  @Returns("the changed field status of the user")
  private function userContactFieldChanged(user : User) : boolean {
    var fields = new String[] {"EmailAddress1","FaxPhone","FirstName","LastName","MiddleName"}

    if (util.gaic.CommonFunctions.fieldFromListChanged(user.Contact, fields)) {
      return true
    }if((user.Contact.OriginalVersion as Contact).PrimaryPhoneValue != user.Contact.PrimaryPhoneValue) {
      return true
    }else{
      return false
    }
  }
  

}
