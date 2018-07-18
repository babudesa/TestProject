package util.gaic.EDWPayloadGen
uses entity.Note
uses java.lang.String
uses templates.messaging.edw.NoteDataEDW
uses java.lang.Exception

/* This class is responsible for creating the Notes 
   payload using the template NoteDataEDW*/
class EDWPayloadGenNoteFunctions {
  construct() {
  }
 static function getInstance() : EDWPayloadGenNoteFunctions {
    return new EDWPayloadGenNoteFunctions();
  }
 /**
   * Generates the payload for the Note
   * @param note
   *           Note for which the payload has to be generated
   * @return
   *           returns the payload
   */    
  protected function sendNoteAdded( note : Note):String {
     var payload=""
    try{
      payload=createNotePayload(note, "A");
    }catch(e:Exception){
      throw new Exception("Error while generating Note payload " + e.Message)
    }
    return payload
  }
  
 /**
   * Generates the payload for the Note
   * @param note
   *           Note for which the payload has to be generated
   * @param status
   *           Status of the Note
   * @param eventName
   *           Eventname of the Note
   * @return
   *       returns the payload
   */    
   protected function sendNoteAdded( note : Note,status:String,eventName:String):String {
     var payload=""
    try{
      payload=createNotePayload(note,status,eventName);
    }catch(e:Exception){
      throw new Exception("Error while generating Note payload " + e.Message)
    }
    return payload
  }

/**
   * Creates the payload for the Note based on NoteDataEDW template
   * @param note
   *           Note for which the payload has to be generated
   * @param objStatus
   *            Object status of the Note
   * @return payload
   */  
  protected function createNotePayload(nte : Note, objStatus : String):String {
      var templateData=""
    if (nte.Subject == null or (nte.Subject != null and nte.Subject != "Claim Flag Change")) {
      templateData = NoteDataEDW.renderToString(nte, objStatus, "NoteAdded");
    }
    return templateData
  }
  
/**
   * Creates the payload for the Note based on NoteDataEDW template
   * @param note
   *           Note for which the payload has to be generated
   * @param objStatus
   *            Object status of the Note
   * @param eventName
   *           Eventname of the Note
   * @return payload
   */ 
   protected function createNotePayload(nte : Note, objStatus : String,eventName:String):String {
      var templateData=""
    if (nte.Subject == null or (nte.Subject != null and nte.Subject != "Claim Flag Change")) {
      templateData = NoteDataEDW.renderToString(nte, objStatus, eventName);
    }
    return templateData
  }
}
