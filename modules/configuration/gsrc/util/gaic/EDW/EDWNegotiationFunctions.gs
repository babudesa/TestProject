package util.gaic.EDW;
uses templates.messaging.edw.NegotiationTemplate

class EDWNegotiationFunctions {

  private construct() {
  }

  static function getInstance() : EDWNegotiationFunctions {
    return new EDWNegotiationFunctions();
  }

  function sendNegotiationAdded(messageContext : MessageContext, negotiation : Negotiation) {
    createNegotiationPayload(messageContext, negotiation, "A")
  }

  function sendNegotiationChanged(messageContext : MessageContext, negotiation : Negotiation) {
    createNegotiationPayload(messageContext, negotiation, "C")
  }

  function sendNegotiationRemoved(messageContext : MessageContext, negotiation : Negotiation) {
    createNegotiationPayload(messageContext, negotiation, "D")
  }

  // Helper for anyFieldChanged; returns true if any claim/policy/risk/coverage fields of interest to EDW have changed
  protected function negotiationFieldChanged(negotiation : Negotiation) : boolean {
    var fields = new String[] { "ex_InitialDemand", "TargetOffer", "Name", "ex_InitialOffer", "MaxOffer" };
    if (util.gaic.CommonFunctions.fieldFromListChanged(negotiation, fields)) {
      return true;
    }
    return false;
  }

  function createNegotiationPayload(messageContext : MessageContext, negotiation : Negotiation, objStatus : String) {
    var templateData = NegotiationTemplate.renderToString(negotiation, objStatus);
    util.gaic.CommonFunctions.sendTemplateMessage( messageContext, templateData );
  }
}
