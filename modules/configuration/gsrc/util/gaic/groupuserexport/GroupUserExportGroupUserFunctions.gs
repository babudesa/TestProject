package util.gaic.groupuserexport
uses util.gaic.groupuserexport.gaiggroupuserexport.enums.RecordTypeEnum

class GroupUserExportGroupUserFunctions {

  private construct() {}
  
  @Returns("a new instance of GroupUserExportGroupUserFunctions class")
  static function getInstance() : GroupUserExportGroupUserFunctions {
    return new GroupUserExportGroupUserFunctions();
  }
  
  
  /**
  * Builds groupUser changed messages and sends to CC external
  */
  @Param("messageContext", "the context of the message")
  @Param("groupUser","the contact to check for changes")
  @Param("recordType", "the record type associated with this message")
  function sendGroupUserChanges(messageContext : MessageContext, groupUser : GroupUser, recordType : RecordTypeEnum) {
           
    if(this.groupUserChanged(groupUser)) {
      var message = GroupUserExportUtil.buildGroupUserMessage(groupUser, recordType)

      if(message != null && message != ""){
          GroupUserExportUtil.sendMessage(messageContext, message)
      }
    }       
  }


  /**
  * Returns true if the group has changed.
  */
  @Param("groupUser", "the groupUser to check for changes")
  @Returns("the changed status of the groupUser")
  protected function groupUserChanged(groupUser : GroupUser) : boolean {
    
    if(this.groupUserFieldChanged(groupUser)){
        return true;
    }else{
        return false
    }     
  }
  
  
  /**
  * Checks to see if specific fields have changed on the group.
  */
  @Param("groupUser", "the groupUser to check for field changes")
  @Returns("the changed field status of the groupUser")
  private function groupUserFieldChanged(groupUser : GroupUser) : boolean {
    var fields = new String[] {"Group", "User"}

    if (util.gaic.CommonFunctions.fieldFromListChanged(groupUser, fields)) {
      return true
    }else{
      return false
    }
  }
}
