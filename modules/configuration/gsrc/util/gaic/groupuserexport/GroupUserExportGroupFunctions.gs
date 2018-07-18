package util.gaic.groupuserexport
uses util.gaic.groupuserexport.gaiggroupuserexport.enums.RecordTypeEnum


class GroupUserExportGroupFunctions {

  private construct() {}
  
  private static final var CUSTOM_SEND_EVENT_NAME : String = "GroupUserExportTrigger"
  
  @Returns("a new instance of GroupUserExportUserFunctions class")
  static function getInstance() : GroupUserExportGroupFunctions {
    return new GroupUserExportGroupFunctions();
  }
  
  /**
  * Builds group changed messages and sends to CC external
  */
  @Param("messageContext", "the context of the message")
  @Param("group","the contact to check for changes")
  @Param("recordType", "the record type associated with this message")
  function sendGroupChanges(messageContext : MessageContext, group : Group, recordType : RecordTypeEnum) {

    var message :String = null
    
    //If this is a custom group/user export trigger then send without checking changes.
    if(messageContext.EventName.equalsIgnoreCase(CUSTOM_SEND_EVENT_NAME)) {
      message = GroupUserExportUtil.buildGroupMessage(group, recordType)   
    }else{    
      if(this.groupChanged(group) || GroupUserExportUtil.userAddressChanged(group.Supervisor.Contact)) {
        message = GroupUserExportUtil.buildGroupMessage(group, recordType)
      }  
    }
    
    //if message isn't null or empty then send it
    if(message != null && message != ""){
        GroupUserExportUtil.sendMessage(messageContext, message)
    }     
  }


  /**
  * Returns true if the group has changed.
  */
  @Param("group", "the claim to check for changes")
  @Returns("the changed status of the group")
  protected function groupChanged(group : Group) : boolean {
    
    if(this.groupFieldChanged(group)){
        return true;
    }else{
        return false
    }     
  }
  
  
  /**
  * Checks to see if specific fields have changed on the group.
  */
  @Param("group", "the group to check for field changes")
  @Returns("the changed field status of the group")
  private function groupFieldChanged(group : Group) : boolean {
    var fields = new String[] {"DivisionNameExt", "Name", "Supervisor"}

    if (util.gaic.CommonFunctions.fieldFromListChanged(group, fields)) {
      return true
    }else{
      return false
    }
  }

}
