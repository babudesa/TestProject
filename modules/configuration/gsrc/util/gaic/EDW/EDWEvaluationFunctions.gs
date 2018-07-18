package util.gaic.EDW;
uses templates.messaging.edw.EvaluationTemplate

class EDWEvaluationFunctions {

  private construct() {
  }

  static function getInstance() : EDWEvaluationFunctions {
    return new EDWEvaluationFunctions();
  }

  function sendEvaluationAdded(messageContext : MessageContext, claim : Claim) {
    if (!util.WCHelper.isWCorELLossType(claim)){
      for ( evaluation in claim.Evaluations) {
        if (evaluation.Changed) {  
          createEvaluationPayload(messageContext, evaluation, "A")
        }
      }
    }
  }

  function sendEvaluationChanged(messageContext : MessageContext, claim : Claim) {
    if (!util.WCHelper.isWCorELLossType(claim)){
      for ( evaluation in claim.Evaluations) {
        if (evaluation.Changed) {     
          createEvaluationPayload(messageContext, evaluation, "C")
        }
      }
    }
  }

  function createEvaluationPayload(messageContext : MessageContext, evaluation : Evaluation, objStatus : String) {
    var templateData = EvaluationTemplate.renderToString(evaluation, objStatus);
    util.gaic.CommonFunctions.sendTemplateMessage( messageContext, templateData );
  }
}
