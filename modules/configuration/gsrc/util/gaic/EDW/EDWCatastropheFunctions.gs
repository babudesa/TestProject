package util.gaic.EDW;
uses templates.messaging.edw.CatastropheTemplate

class EDWCatastropheFunctions {

  private construct() {
  }

  static function getInstance() : EDWCatastropheFunctions {
    return new EDWCatastropheFunctions();
  }

  function sendCatastropheAdded(messageContext : MessageContext, catastrophe : Catastrophe) {
    createCatastrophePayload(messageContext, catastrophe, "A", null, null)
  }

  function sendCatastropheChanged(messageContext : MessageContext, catastrophe : Catastrophe) {
    if (catastropheFieldChanged(catastrophe)) {
      createCatastrophePayload(messageContext, catastrophe, "C", null, null)
    }
  }

  function sendCatastropheChangedOccur(messageContext : MessageContext, catastrophe : Catastrophe, earliestdate : DateTime, latestdate : DateTime) {
    createCatastrophePayload(messageContext, catastrophe, "C", earliestdate, latestdate)
  }

  // Helper for anyFieldChanged; returns true if any claim/policy/risk/coverage fields of interest to EDW have changed
  protected function catastropheFieldChanged(catastrophe : Catastrophe) : boolean {
    var fields = new String[] { "BusinessCatNameExt", "CatastropheNumber", "Description", "Ex_EarliestStartDate",
    "Ex_ISOCatNumber", "Ex_LatestEndDate", "Ex_Name", "Ex_Year", "Type" };
    
    if (util.gaic.CommonFunctions.fieldFromListChanged(catastrophe, fields)) {
      return true;
    }
    
    return false;
  }

  function createCatastrophePayload(messageContext : MessageContext, catastrophe : Catastrophe, objStatus : String, earliestdate : DateTime, latestdate : DateTime) {
    var templateData = CatastropheTemplate.renderToString(catastrophe, objStatus, earliestdate, latestdate);
    util.gaic.CommonFunctions.sendTemplateMessage( messageContext, templateData );
  }
}
