package util.gaic.EDW;
uses templates.messaging.edw.AssociationDataEDW

class EDWAssociationFunctions {

  private construct() {
  }

  static function getInstance() : EDWAssociationFunctions {
    return new EDWAssociationFunctions();
  }

  function sendAssociationAdded(messageContext : MessageContext, association : ClaimAssociation) {
    createAssociationPayload(messageContext, association, "A")
  }
  //
  function sendAssociationChanged(messageContext : MessageContext, association : ClaimAssociation) {
    createAssociationPayload(messageContext, association, "C")
  }

  function createAssociationPayload(messageContext : MessageContext, association : ClaimAssociation, objStatus : String) {
    var templateData = AssociationDataEDW.renderToString(association, objStatus, "");
    util.gaic.CommonFunctions.sendTemplateMessage( messageContext, templateData );
  }
}
