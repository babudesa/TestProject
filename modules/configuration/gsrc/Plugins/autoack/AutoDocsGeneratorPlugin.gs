package Plugins.autoack

uses util.document.AutoACKLetter

class AutoDocsGeneratorPlugin implements gw.plugin.messaging.MessageTransport {
  construct(){}
  override function resume(){}
  override function setDestinationID(p0 : int){}
  override function shutdown(){}
  override function suspend(){}
  
  override function send(p0 : Message, p1 : String) {
    try{
      //******************************************
      // sending AutoAck message
      //******************************************
       if(p0.Description=="AutoAck"){
         var msg = p0.MessageRoot
         if(msg typeis Claim){
            if(!msg.Policy.Verified){
                AutoACKLetter.unverifiedPolicy(msg)
            }
            else{
              AutoACKLetter.claimLevel(msg)
              AutoACKLetter.incidentOnly(msg)
            }
         }
         if(msg typeis Exposure){
           AutoACKLetter.featureLevel(msg)
         }
       }
      //******************************************
      // sending AutoMedicare message
      //******************************************
       if(p0.Description=="AutoMedicare"){
         util.document.AutoMedLetter.saveMedLetter(p0.MessageRoot as Claim)
       }
       p0.reportAck()
    }
    catch(e){
      gw.api.util.Logger.logError(e+"\n"+e.StackTraceAsString)
    }
  } // ends send
}// ends AutoDocsGeneratorPlugin