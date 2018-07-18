package util.gaic.EDWPayloadGen
uses entity.Payment
uses entity.Reserve
uses entity.RecoveryReserve
uses entity.Check
uses java.lang.String
uses entity.Payment
uses templates.messaging.edw.RecoveryReserveDataEDW
uses templates.messaging.edw.RecoveryDataEDW
uses templates.messaging.edw.CheckPaymentDataEDW
uses templates.messaging.edw.ReserveDataEDW

/* This class is responsible for creating the Financial Related 
   payloads using the below templates
   Checks - CheckPaymentDataEDW
   Reserves - ReserveDataEDW
   Recovery - RecoveryDataEDW
   RecoveryReserve - RecoveryReserveDataEDW
   */
class EDWPayloadGenFinancialFunctions {

  construct() {

  }
 static function getInstance() : EDWPayloadGenFinancialFunctions {
    return new EDWPayloadGenFinancialFunctions();
  }
  
//Generates the Check Payload  
  function sendCheckChanges(msgCheck : Check):String {
   return createCheckPayload(msgCheck, "C","CheckAdded");
  }

//Generates the Check payload
  function sendPaymentChanges(msgCheck : Check):String {
    return createCheckPayload(msgCheck, "C","CheckChanged")
  }
  
//Genmerates the Reserve Payload 
  function sendReserveChanges(msgReserve : Reserve):String {
   return createReservePayload(msgReserve, "C","ReserveAdded");
  }
  
//Generates the Recovery payload
  function sendRecoveryChanges(msgRecovery : Recovery):String {
    return createRecoveryPayload( msgRecovery, "C","RecoveryAdded");

  }
  
//Generates the RecoveryReserver payload
  function sendRecoveryReserveChanges( msgRecoveryReserve : RecoveryReserve):String {
        return createRecoveryReservePayload( msgRecoveryReserve, "C","RecoveryReserveAdded");
  }
  
/**
   * Creates the payload for the Check based on CheckPaymentDataEDW template
   * @param theCheck
   *           Check for which the payload has to be generated
   * @param objStatus
   *            Object status of the Check
   * @param eventName
   *             Eventname of the Check
   * @return payload
   */ 
  protected function createCheckPayload(theCheck : Check, objStatus : String, eventName:String):String {
    var aPayment = theCheck.Payments != null ? theCheck.Payments[0] : null;
    return CheckPaymentDataEDW.renderToString(theCheck, aPayment, objStatus, eventName);
  }

/**
   * Creates the payload for the Reserve based on ReserveDataEDW template
   * @param thereserve
   *           Reserve for which the payload has to be generated
   * @param objStatus
   *            Object status of the Reserve
   * @param eventName
   *             Eventname of the Reserve
   * @return payload
   */ 
  protected function createReservePayload( thereserve : Reserve, objStatus : String,eventName:String) :String {
    return  ReserveDataEDW.renderToString(thereserve, objStatus, eventName);
  }

/**
   * Creates the payload for the Recovery based on RecoveryDataEDW template
   * @param therecovery
   *           Recovery for which the payload has to be generated
   * @param objStatus
   *            Object status of the Recovery
   * @param eventName
   *             Eventname of the Recovery
   * @return payload
   */ 
  protected function createRecoveryPayload(therecovery : Recovery, objStatus : String,eventName:String):String  {
    return RecoveryDataEDW.renderToString(therecovery, objStatus, eventName);
  }
 
/**
   * Creates the payload for the RecoveryReserve based on RecoveryReserveDataEDW template
   * @param therecoveryreserve
   *           Recoveryreserve for which the payload has to be generated
   * @param objStatus
   *            Object status of the Recoveryreserve
   * @param eventName
   *             Eventname of the Recoveryreserve
   * @return payload
   */  
  protected function createRecoveryReservePayload(therecoveryreserve : RecoveryReserve, objStatus : String,eventName:String):String {
    return  RecoveryReserveDataEDW.renderToString(therecoveryreserve, objStatus, eventName);
  }
 

}
