package gw.api.iso

uses gw.plugin.iso.ISOBadReplyException

@Export
class ISOSend {
  
  construct() {}
  
  @Throws(ISOBadReplyException, "If response does not contain valid status code.")
  @Throws(ISOCommunicationException, "if communication with the ISO server fails")
  public function send(messageId : int, xml : String, properties : ISOProperties) {
    properties.getMessageLogger().logRequest(messageId, xml)
    if (properties.shouldSendMessages()) {
        var receiptXML = sendToISO(xml, properties)
        parseReceipt(messageId, receiptXML, properties)
    }
  }
  
  @Throws(ISOCommunicationException,  "if communication with the ISO server fails")
  private function sendToISO(xml : String, properties : ISOProperties) : String { 
    return ISOPayloadHelper.sendToISO(xml, properties)
  }

 
  private function parseReceipt(messageId : int, receiptXML : String, properties : ISOProperties) {
    properties.getMessageLogger().logReceipt(messageId, receiptXML)
    var receipt = new ISOReceipt(receiptXML)
    receipt.ensureAccepted()
  }
}
