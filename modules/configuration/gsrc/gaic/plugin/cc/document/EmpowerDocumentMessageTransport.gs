package gaic.plugin.cc.document
uses gw.plugin.messaging.MessageTransport
uses gw.api.util.Logger
uses java.lang.Exception


class EmpowerDocumentMessageTransport implements MessageTransport {
  construct() {
  }


  override function resume() {
  }

  override function setDestinationID(p0 : int) {
  }

  override function shutdown() {
  }

  override function suspend() {
  }

  override function send(msg : Message, payload : String) {
    try{
      var doc = msg.MessageRoot as Document
      var finalizeResult = gaic.plugin.cc.document.EmpowerDocumentUtil.finalizeEmpowerDocument(doc);
      if(finalizeResult=="Success"){
        doc.MimeType = EmpowerDocumentUtil.FINALIZED_MIME_TYPE;
        msg.reportAck()  
      } else {
        throw new Exception("Finalize Empower Document process failed!"+ finalizeResult)
      }
    } catch(e){
        Logger.logError(this.IntrinsicType.RelativeName+": send", e);
        if(e.Message != null && !e.Message.equals("")) {
          msg.safeSetErrorDescription(e.Message);
        } else {
          msg.safeSetErrorDescription(e.StackTraceAsString)
        }
        msg.reportError();
    }
  }
} // End EmpowerDocumentMessageTransport
