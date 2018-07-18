package gw.entity

@Export
enhancement GWInjuryIncidentISOEnhancement : entity.InjuryIncident {
  
  property get ISONormalizedICDCodes() : List<String> {
    return normalizeICDCodesForISO(this.InjuryDiagnoses) 
  }
  
  property get ISOOriginalNormalizedICDCodes() : List<String> {
    return normalizeICDCodesForISO(this.getOriginalValue("InjuryDiagnoses") as InjuryDiagnosis[])
  }
  
  private function normalizeICDCodesForISO(diagnoses : InjuryDiagnosis[]) : List<String> {
    return diagnoses
            .map(\ d -> d.ICDCode.Code)
            .map(\ s -> normalizeICDCodeForISO(s))
            .where(\ s -> s != null)
            .toSet().toList().sort()
  }

  private function normalizeICDCodeForISO(code : String) : String {
    var result = code
    if (result.HasContent) {
      var firstDot = result.indexOf(".")
      if (firstDot >= 0) {
        result = result.substring(0, firstDot)
      }
    } else {
      result = null
    }
    return result
  }

}
