package util.gaic.EDW;
uses templates.messaging.edw.OccuranceTemplate

class EDWCatOccurrenceFunctions {
  
  private var catF = EDWFunctionsFactory.getCatastropheFunctions();

  private construct() {
  }

  static function getInstance() : EDWCatOccurrenceFunctions {
    return new EDWCatOccurrenceFunctions();
  }

  function sendCatOccurrenceAdded(messageContext : MessageContext, occurrence : Ex_CatOccurance) {
    createCatOccurrencePayload(messageContext, occurrence, "A")
    var datearr : DateTime[] = determineCatStartAndEndDates( occurrence.Catastrophe);  
    if  (datearr[0] != occurrence.Catastrophe.Ex_EarliestStartDate
    || datearr[1] != occurrence.Catastrophe.Ex_LatestEndDate)   {
      catF.sendCatastropheChangedOccur( messageContext, occurrence.Catastrophe, datearr[0], datearr[1] )   
    }   
  }

  function sendCatOccurrenceChanged(messageContext : MessageContext, occurrence : Ex_CatOccurance) {
    if (catOccurrenceFieldChanged(occurrence))  {
      createCatOccurrencePayload(messageContext, occurrence, "C")
    }
    var datearr : DateTime[] = determineCatStartAndEndDates( occurrence.Catastrophe);  
    if  (datearr[0] != occurrence.Catastrophe.Ex_EarliestStartDate
    || datearr[1] != occurrence.Catastrophe.Ex_LatestEndDate) {
      catF.sendCatastropheChangedOccur( messageContext, occurrence.Catastrophe, datearr[0], datearr[1] )   
    }   
  }

  function sendCatOccurrenceRemoved(messageContext : MessageContext, occurrence : Ex_CatOccurance) {
    createCatOccurrencePayload(messageContext, occurrence, "D")
    var datearr : DateTime[] = determineCatStartAndEndDates( occurrence.Catastrophe );  
    if (datearr[0] != occurrence.Catastrophe.Ex_EarliestStartDate
    || datearr[1] != occurrence.Catastrophe.Ex_LatestEndDate)   {
      catF.sendCatastropheChangedOccur( messageContext, occurrence.Catastrophe, datearr[0], datearr[1] )   
    }   
  }

  // Helper for anyFieldChanged; returns true if any claim/policy/risk/coverage fields of interest to EDW have changed
  protected function catOccurrenceFieldChanged(occurrence : Ex_CatOccurance) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(occurrence, new String[] { "EndDate", "StartDate", "State" })) {
      return true;
    }
    return false;
  }

  function determineCatStartAndEndDates(cat : Catastrophe) : DateTime[] {
    var savestartdate : DateTime;
    var saveenddate : DateTime;
    savestartdate = null;
    saveenddate = null;

    for (var occ in cat.Ex_CatOccurances) {
      if (savestartdate == null) {
        savestartdate = occ.StartDate
      }
      if (saveenddate == null) {
        saveenddate = occ.EndDate
      }
      if (savestartdate > occ.StartDate) {
        savestartdate = occ.StartDate
      }
      if (saveenddate < occ.EndDate) {
        saveenddate = occ.EndDate
      }
    }
    
    var datearr = new DateTime[2];
    datearr[0] = savestartdate;
    datearr[1] = saveenddate;

    return datearr;
  }

  protected function createCatOccurrencePayload(messageContext : MessageContext, occurrence : Ex_CatOccurance,
  objStatus : String) {
    var templateData = OccuranceTemplate.renderToString(occurrence, objStatus);
    util.gaic.CommonFunctions.sendTemplateMessage( messageContext, templateData );
  }
}
