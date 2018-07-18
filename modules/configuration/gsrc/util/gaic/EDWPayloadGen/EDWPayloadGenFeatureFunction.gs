
package util.gaic.EDWPayloadGen
uses typekey.ExposureState
uses entity.Exposure
uses entity.Claim
uses java.lang.String

uses templates.messaging.edw.ExposureDataEDW
uses java.lang.Exception
uses gw.api.util.Logger

/* This class is responsible for creating the Exposure 
   payload using the template ExposureDataEDW*/
class EDWPayloadGenFeatureFunction {

  construct() {

  }
  var logger = Logger.forCategory("EDWConversionLog") 
 static function getInstance() : EDWPayloadGenFeatureFunction {
    return new EDWPayloadGenFeatureFunction();
  }
  function sendExposureChanges(exposure : Exposure) {
    if (exposure.State != "draft") {
      sendExposureAdd(exposure)
    } 
  }

/**
   * Generates the payload for the Exposure
   * @param exposure
   *           Exposure for which the payload has to be generated
   * @return
   *           returns the payload
   */ 
  protected function sendExposureAdd(exposure : Exposure):String {
    var payload:String=""
    try{
    payload=createExposurePayload(exposure, "A", "open","ExposureAdded")
    
    if(payload==null){
      logger.info(" %%%%%%%%%%%%%%%%%%%%%% payload is null and not returned from  the template")
    }else {
      logger.info(" %%%%%%%%%%%%%%%%%%%%%% payload length ======" + payload.length)
    }
    
    }catch(e:Exception){
      throw new Exception("Error while generating Exposure payload in sendExposureAdd " + e.Message)
    }
    return payload
  }
  
 /**
   * Generates the payload for the Exposure
   * @param exposure
   *           Exposure for which the payload has to be generated
   * @return
   *           returns the payload
   */ 
   protected function sendExposureChange(exposure : Exposure):String {
    logger.info(" starts sendExposureChange for  Exposure" + exposure + " publicid==="+ exposure.PublicID + " claimnumber :" + exposure.Claim.ClaimNumber)
    var payload:String=""
    try{
       payload=createExposurePayload(exposure, "C", "Actual","ExposureChanged");

    if(payload==null){
      logger.info(" %%%%%%%%%%%%%%%%%%%%%% payload is null and it didn't generate from ExposureDataEDW.gst")
    }else {
      logger.info(" %%%%%%%%%%%%%%%%%%%%%% Payload is not null and the length  is :" + payload.length)
    }
    }catch(e:Exception){
      e.printStackTrace()
      throw new Exception("Error while generating Exposure payload in sendExposureChange " + e.Message)
    }
        logger.info(" ends sendExposureChange for  Exposure" + exposure + " publicid==="+ exposure.PublicID + " claimnumber :" + exposure.Claim.ClaimNumber)
    return payload
  }

/**
   * Generates the payload for the Exposure
   * @param exposure
   *           Exposure for which the payload has to be generated
   * @return
   *           returns the payload
   */   
  protected function sendExposureChanged(exposure : Exposure):String {
    var payload:String=""
    try{
       payload=createExposurePayload(exposure, "A", "open","ExposureAdded");
    }catch(e:Exception){
      throw new Exception("Error while generating Exposure payload in sendExposureChange " + e.Message)
    }
    return payload
  }

/**
   * Creates the payload for the Exposure based on ExposureDataEDW template
   * @param exposure
   *           Exposure for which the payload has to be generated
   * @param objStatus
   *            Object status of the exposure
   * @param openstatus
   *             status of the exposure
   * @param eventName
   *             Eventname of the exposure
   * @return payload
   */  
  protected function createExposurePayload(exposure : Exposure, objStatus : String, openstatus : String,eventName:String):String {
    logger.info("calling  inside createExposurePayload payload render method exposure publicid : " + exposure.PublicID +" claimnumber :" + exposure.Claim.ClaimNumber)
    return ExposureDataEDW.renderToString(exposure, openstatus, objStatus,eventName );
  } 
}



