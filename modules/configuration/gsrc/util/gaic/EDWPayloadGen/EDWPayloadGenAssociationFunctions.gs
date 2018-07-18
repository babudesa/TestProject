package util.gaic.EDWPayloadGen
uses entity.ClaimAssociation
uses java.lang.String
uses templates.messaging.edw.AssociationDataEDW
uses java.lang.Exception

/* This class is responsible for creating the Association 
   payload using the template AssociationDataEDW*/
class EDWPayloadGenAssociationFunctions {

  construct() {

  }
static function getInstance() : EDWPayloadGenAssociationFunctions {
    return new EDWPayloadGenAssociationFunctions();
  }
  
/**
   * Generates the payload for the Association
   * @param association
   *           association for which the payload has to be generated
   * @return
   *           returns the payload
   */
  function sendAssociationAdded(association : ClaimAssociation):String {
    var payload=""
    try{
     payload=createAssociationPayload(association, "A")
    }catch(e:Exception){
      throw new Exception("Error while generating Association payload " + e.Message)
    }
    return payload
  }

/**
   * Generates the payload for the Association
   * @param association
   *           association for which the payload has to be generated
   * @return
   *           returns the payload
   */
  function sendAssociationChanged(association : ClaimAssociation):String  {
     var payload=""
    try{
    payload=createAssociationPayload(association, "A")
    }catch(e:Exception){
      throw new Exception("Error while generating Association payload " + e.Message)
    }
    return payload
  }

/**
   * Creates the payload for the association based on AssociationDataEDW template
   * @param association
   *           association for which the payload has to be generated
   * @param objStatus
   *            Object status of the payload
   * @return payload
   */ 
  function createAssociationPayload( association : ClaimAssociation, objStatus : String):String{
    return AssociationDataEDW.renderToString(association, objStatus, "");
  }
}
