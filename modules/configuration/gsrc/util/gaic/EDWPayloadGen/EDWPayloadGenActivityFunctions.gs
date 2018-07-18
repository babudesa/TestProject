package util.gaic.EDWPayloadGen
uses entity.ActivityPattern
uses entity.Activity
uses java.lang.String
uses entity.Exposure
uses templates.messaging.edw.ActivityDataEDW
uses java.lang.Exception
uses gw.api.util.Logger

/* This class is responsible for creating the Activity 
   payload using the template ActivityDataEDW*/
class EDWPayloadGenActivityFunctions {

  construct() {
  }
 private static var logger = Logger.forCategory("EDWConversionLog") 
static function getInstance() : EDWPayloadGenActivityFunctions {
    return new EDWPayloadGenActivityFunctions();
  }
/**
   * Generates the payload for the activity
   * @param eventname
   *           EventName of the payload
   * @param activity
   *           activity for which the payload has to be generated
   */
  function sendActivityChanges(eventName:String, activity : Activity) {
    logger.info(" Started calling sendActivityChanges Batch " ) 
    var sendMsg = true;
    
    if ( isActivityValid(activity) ) {
      sendMsg = false;
    }
    if (eventName == "ActivityAdded" && sendMsg) {
      sendActivityAdded(activity );
    } else if (eventName == "ActivityChanged" && sendMsg) {
      sendActivityChanged(activity);
    }
   
  }
  
//Checks whether the activity is valid or not and returns the boolean value
private function isActivityValid(activity : Activity) : boolean {
    return ( activity.Exposure != null
    //&& activity.Exposure.New
    || (activity.ActivityPattern == util.custom_Ext.finders.findActivityPattern( "general_reminder" )
    && activity.Subject.equalsIgnoreCase( "Suspended Claim" )));
  }
  
// This function will be called if the eventname is ActivityAdded  
protected function sendActivityAdded( activity : Activity) {
    createActivityPayload( activity, "A");
  }
  
  
// This function will be called if the eventname is ActivityChanged    
protected function sendActivityChanged( activity : Activity) {
    createActivityPayload( activity, "C");
  }
  
/**
   * Creates the payload for the activity based on ActivityDataEDW template
   * @param activity
   *           activity for which the payload has to be generated
   * @param objStatus
   *            Object status of the payload
   * @return payload
   */  
protected function createActivityPayload(theactivity : Activity, objStatus : String):String {
    var payload:String
    if (theactivity.ActivityPattern == null
    || (theactivity.ActivityPattern != null && theactivity.ActivityPattern.Code != "assignment_review")) {
      try{
       payload = ActivityDataEDW.renderToString(theactivity, objStatus, "ActivityAdded");
      }catch(e:Exception){
        throw new Exception("Error while generating Activity payload " + e.Message)
      }
    }
    return payload
  }
  
/**
   * Creates the payload for the activity based on ActivityDataEDW template
   * @param activity
   *           activity for which the payload has to be generated
   * @param objStatus
   *            Object status of the payload
   * @param eventName
   *             eventname of the payload
   * @return payload
   */ 
protected function createActivityPayload(theactivity : Activity, objStatus : String, eventName:String):String {
    var payload:String
    if (theactivity.ActivityPattern == null
    || (theactivity.ActivityPattern != null && theactivity.ActivityPattern.Code != "assignment_review")) {
      try{
       payload = ActivityDataEDW.renderToString(theactivity, objStatus, eventName);
      }catch(e:Exception){
        throw new Exception("Error while generating Activity payload " + e.Message)
      }
    }
    return payload
  }
}
