package util.gaic.EDW;
uses templates.messaging.edw.ActivityDataEDW
uses gw.policy.RefreshPolicyParallel

class EDWActivityFunctions {
  private construct() {
  }
  
  static function getInstance() : EDWActivityFunctions {
    return new EDWActivityFunctions();
  }
  
  function sendFeatureActivityAdded(messageContext : MessageContext, claim : Claim) {
    if (messageContext.EventName == "FeatureActivityAdded"
    && (messageContext.Root as Claim).State != "draft"
    && (messageContext.Root as Claim).OriginalVersion.DisplayName.startsWith("T") == false) {
      for ( activity in claim.Activities ) {
        if ( isActivityValid(activity) ) {
          sendActivityAdded(messageContext, activity);
        }
      }
    }
  }
  
  function sendActivityChanges(messageContext : MessageContext, activity : Activity) {
    // do not send EDW messages if policy is refreshed from batch process - not in EM83
    var claim=activity.Claim
    if (claim != null and RefreshPolicyParallel.wasClaimRefreshedFromBatchRefreshPolicy(claim.ID)) {
      return
    } 
    var sendMsg = true;
    if ( isActivityValid(activity) ) {
      sendMsg = false;
    }
    if (messageContext.EventName == "ActivityAdded" && sendMsg) {
      sendActivityAdded( messageContext, activity );
    } else if (messageContext.EventName == "ActivityChanged" && sendMsg) {
      sendActivityChanged( messageContext, activity );
    }
  }
  
  private function isActivityValid(activity : Activity) : boolean {
    return ( activity.Exposure != null
    && activity.Exposure.New
    || (activity.ActivityPattern == util.custom_Ext.finders.findActivityPattern( "general_reminder" )
    && activity.Subject.equalsIgnoreCase( "Suspended Claim" )));
  }
  
  protected function sendActivityAdded(messageContext : MessageContext, activity : Activity) {
    createActivityPayload(messageContext, activity, "A");
  }
  
  protected function sendActivityChanged(messageContext : MessageContext, activity : Activity) {
    createActivityPayload(messageContext, activity, "C");
  }
  
  protected function sendActivityRemoved(messageContext : MessageContext, activity : Activity) {
    createActivityPayload(messageContext, activity, "D");
  }
  
  protected function createActivityPayload(messageContext : MessageContext, theactivity : Activity, objStatus : String) {
    if (theactivity.ActivityPattern == null
    || (theactivity.ActivityPattern != null && theactivity.ActivityPattern.Code != "assignment_review")) {
      var templateData = ActivityDataEDW.renderToString(theactivity, objStatus, "");
      util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
    }
  }
}
