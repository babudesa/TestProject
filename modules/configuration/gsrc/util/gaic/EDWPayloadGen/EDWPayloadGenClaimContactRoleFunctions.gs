package util.gaic.EDWPayloadGen
uses entity.UserRoleAssignment
uses typekey.UserRole
uses java.lang.String
uses templates.messaging.edw.PartyRoleUserDataEDW
uses java.lang.Exception

/* This class is responsible for creating the Claim Contact Role 
   payload using the template PartyRoleUserDataEDW*/
class EDWPayloadGenClaimContactRoleFunctions {

  construct() {
  }

static function getInstance() : EDWPayloadGenClaimContactRoleFunctions {
    return new EDWPayloadGenClaimContactRoleFunctions();
  }
  
/**
   * Generates the payload for the UserRole
   * @param usrRole
   *           UserRole for which the payload has to be generated
   * @param objStatus
   *           Object Status of the payload
   * @return
   *           returns the payload
   */ 
  function sendUserRoleChange(usrRole : UserRoleAssignment, objStatus : String):String {
    var partyrole = "";
    var payload = "";
    partyrole = "<Role><Code>"+usrRole.Role.Code+"</Code><Description>"+usrRole.Role.Description+"</Description><ListName>"+usrRole.Role.ListName+"</ListName></Role>";
    try{
      payload=createUserRolePayload(usrRole, partyrole, objStatus);
    }catch(e:Exception){
        throw new Exception("<UserRoleAdded><PublicId>"+usrRole.PublicID+"</PublicId><TransationName>UserRole</TransationName><ErrorMessage>Error while generating UserRoleAssignment payload</ErrorMessage></UserRoleAdded>")
     }
    return payload
  }

/**
   * Creates the payload for the userroleassignment based on PartyRoleUserDataEDW template
   * @param usrRole
   *           user role for which the payload has to be generated
   * @param partyrole
   *             Role of the contact
   * @param roleobjStatus
   *            Object status of the role
   * @return payload
   */  
  protected function createUserRolePayload( usrRole : UserRoleAssignment, partyrole : String, roleobjstatus : String):String {
    return PartyRoleUserDataEDW.renderToString( usrRole, partyrole, roleobjstatus);
  }
}
