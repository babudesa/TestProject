package util.gaic.EDWPayloadGen
uses typekey.ClaimState
uses entity.Claim
uses java.lang.String
uses templates.messaging.edw.ClaimDataEDW
uses java.lang.Exception

/* This class is responsible for creating the Claim 
   payload using the template ClaimDataEDW*/
   
class EDWPayloadGenClaimFunctions {

   construct() {
   }
   
  static function getInstance() : EDWPayloadGenClaimFunctions {
    return new EDWPayloadGenClaimFunctions();
  }
  /**
   * Generates the payload for the new claim
   * @param eventname
   *           EventName of the payload
   * @param claim
   *           claim for which the payload has to be generated
   * @return payload
   */
  function sendNewClaim(eventName:String, claim : Claim):String {
    var payload=""
    var incidentStatus = "";
    if (claim.IncidentReport) {
        if (claim.State == "closed") {
          incidentStatus = "open" ; 
        } else {
          incidentStatus = "Actual" ; 
        }
      } else {
        incidentStatus = "Actual" ;
      }
     try{
     if(claim.State != "closed"){  
     payload=createClaimPayload(eventName, claim, "A", incidentStatus)
     }else{
        payload=createClaimPayload(eventName, claim, "C", incidentStatus)
     }
      }catch(e:Exception){
        throw new Exception("Error while creating claim payload")
      }
      return payload
  }
  /**
   * Generates the payload for the closed claim
   * @param eventname
   *           EventName of the payload
   * @param claim
   *           claim for which the payload has to be generated
   * @return payload
   */
   function sendChangedClaim(eventName:String, claim : Claim):String {
    var payload=""
    
     try{
       if(claim.State == "closed"){ 
         
         payload=createClaimPayload(eventName, claim, "A", "open")
       }
      }catch(e:Exception){
        throw new Exception("Error while creating claim payload")
      }
      return payload
  }
  
    // NOTE: don't send claims in draft state into these functions
 /**
   * Creates the payload for the claim based on ClaimDataEDW template
   * @param eventname
   *           EventName of the payload
   * @param claim
   *           claim for which the payload has to be generated
   * @param objStatus
   *            Object status of the payload
   * @param incidentStatus
   *             Incident Status of the payload
   * @return payload
   */
    protected function createClaimPayload(evtName:String, claim : Claim, objStatus : String, incidentStatus : String):String {
      var payload = ClaimDataEDW.renderToString(claim, objStatus, incidentStatus, evtName);
      return payload
  
    }
  /**
   * Creates the payload for the claim based on ClaimDataEDW template
   * @param claim
   *           claim for which the payload has to be generated
   * @param objStatus
   *            Object status of the payload
   * @param incidentStatus
   *             Incident Status of the payload
   * @param eventname
   *           EventName of the payload
   * @return payload
   */
     protected function createClaimPayload(claim : Claim, objStatus : String, incidentStatus : String,eventName:String):String {
        var templateData = ClaimDataEDW.renderToString(claim, objStatus, incidentStatus, eventName);
        return templateData
     }
     
  

}
