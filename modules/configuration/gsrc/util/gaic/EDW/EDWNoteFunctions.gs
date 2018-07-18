package util.gaic.EDW;
uses templates.messaging.edw.NoteDataEDW

class EDWNoteFunctions {

  private construct() {
  }

  static function getInstance() : EDWNoteFunctions {
    return new EDWNoteFunctions();
  }

  function sendNoteChanges(messageContext : MessageContext, note : Note) {
    if (messageContext.EventName == "NoteAdded" or messageContext.EventName == "ISOExposureCreated") {
      sendNoteAdded(messageContext, note);
    } else if (messageContext.EventName == "NoteChanged") {
      sendNoteChanged(messageContext, note);
    }
  }

  function sendNewNote(messageContext : MessageContext, note : Note) {
    sendNoteAdded(messageContext, note);
  }

  protected function sendNoteAdded(messageContext : MessageContext, note : Note) {
    createNotePayload(messageContext, note, "A");
  }

  protected function sendNoteChanged(messageContext : MessageContext, note : Note) {
    createNotePayload(messageContext, note, "C");
  }

  protected function sendNoteRemoved(messageContext : MessageContext, note : Note) {
    createNotePayload(messageContext, note, "D");
  }

  protected function createNotePayload(messageContext : MessageContext, nte : Note, objStatus : String) {
    if (nte.Subject == null or (nte.Subject != null and nte.Subject != "Claim Flag Change")) {
      var templateData = NoteDataEDW.renderToString(nte, objStatus, "");
      util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
    }
  }
}
