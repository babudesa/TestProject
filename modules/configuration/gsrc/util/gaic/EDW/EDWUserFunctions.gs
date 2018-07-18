package util.gaic.EDW;
uses templates.messaging.edw.GroupData
uses templates.messaging.edw.GroupUserTemplate
uses templates.messaging.edw.UserDataTemplate

class EDWUserFunctions {
  
  private construct() {
  }
  
  static function getInstance() : EDWUserFunctions {
    return new EDWUserFunctions();
  }
  
  function sendGroupDataChanges(mc : MessageContext, grp : Group) {
    var objStatus = "C";
    var date = "<EffectiveDate>" + java.util.GregorianCalendar.getInstance().getTime() + "</EffectiveDate>";
    
    if (mc.EventName == "GroupAdded") {
      objStatus = "A";
    } else if (mc.EventName == "GroupRemoved") {
      objStatus = "D";
      date = "<ExpirationDate>" + java.util.GregorianCalendar.getInstance().getTime() + "</ExpirationDate>";
    }

    createGroupDataPayload(mc, grp, objStatus, date);
  }

  function sendGroupUserChanges(mc : MessageContext, grpUser : GroupUser) {
    var objStatus = "C";
    
    var date = "<EffectiveDate>" + java.util.GregorianCalendar.getInstance().getTime() + "</EffectiveDate>";
    
    if (mc.EventName == "GroupUserAdded") {
      objStatus = "A";
    } else if (mc.EventName == "GroupUserRemoved") {
      objStatus = "D";
      date = "<ExpirationDate>" + java.util.GregorianCalendar.getInstance().getTime() + "</ExpirationDate>";
    }

    if (mc.EventName == "GroupUserChanged" and (grpUser.OriginalVersion as GroupUser).Group.PublicID != grpUser.PublicID) {
      objStatus = "A";
      createGroupUserPayload(mc, grpUser, objStatus, date);
      
      objStatus = "D";
      date = "<ExpirationDate>" + java.util.GregorianCalendar.getInstance().getTime() + "</ExpirationDate>";
      createGroupUserPayload(mc, grpUser.OriginalVersion as GroupUser, objStatus, date);
    } else {
      createGroupUserPayload(mc, grpUser, objStatus, date);
    }
  }

  function sendUserDataChanges(mc : MessageContext, u : User) {
    var objStatus = "C";
    var date = "<EffectiveDate>" + java.util.GregorianCalendar.getInstance().getTime() + "</EffectiveDate>";
    
    if (mc.EventName == "UserAdded") {
      objStatus = "A";
    } else if (mc.EventName == "UserChanged") {
      objStatus = "C";
    }

    createUserDataPayload(mc, u, objStatus, date);
  }

  protected function createGroupDataPayload(mc : MessageContext, grp : Group, objStatus : String, date : String) {
    var data = GroupData.renderToString(objStatus, grp, date);
    util.gaic.CommonFunctions.sendTemplateMessage(mc, data);
  }

  protected function createGroupUserPayload(mc : MessageContext, grpUser : GroupUser, objStatus : String, date : String) {
    var data = GroupUserTemplate.renderToString(grpUser, objStatus, date);
    util.gaic.CommonFunctions.sendTemplateMessage(mc, data);
  }

  protected function createUserDataPayload(mc : MessageContext, u : User, objStatus : String, date : String) {
    var role = "<Role><Code>claimorg</Code><Description>Claim Organization</Description><ListName>ClaimOrg</ListName></Role>";
    var data = "<Transaction>"+ UserDataTemplate.renderToString(u, objStatus, date, role) + "</Transaction>";
    util.gaic.CommonFunctions.sendTemplateMessage(mc, data);
  }
}
