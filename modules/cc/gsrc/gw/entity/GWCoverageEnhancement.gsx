package gw.entity

uses java.lang.StringBuilder
uses gw.api.util.CurrencyUtil

@Export
enhancement GWCoverageEnhancement : Coverage {
  
  /**
   * Used to display a brief summary of the coverage details in the UI: the deductible and the exposure and incident
   * limits. Typically used in conjunction with a label that gives the coverage type
   */
  property get DetailsSummary() : String {
    var result = new StringBuilder()
    if (this.Deductible != null) {
      result.append(CurrencyUtil.renderAsCurrency(this.Deductible))
      result.append(" ").append(displaykey.Web.BasicInfoScreen.VehiclePanelIterator.CoverageLV.Deductible).append("; ")
    }
    if (this.ExposureLimit != null) {
      result.append(CurrencyUtil.renderAsCurrency(this.ExposureLimit)).append("/")
    }
    if (this.IncidentLimit != null) {
      result.append(CurrencyUtil.renderAsCurrency(this.IncidentLimit)).append(" ").append(displaykey.Web.BasicInfoScreen.VehiclePanelIterator.CoverageLV.Limit)
    }
    return result.toString();
  }

}
