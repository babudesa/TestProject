package gw.api.benefits
uses java.util.Date
uses java.math.BigDecimal
uses java.lang.Integer

/**
 * Benefits calculator for permanent partial disability (PPD) in California
 */
@Export
class PPDBenefitsCalculatorForCA extends PPDBenefitsCalculator {

  var _statePDRates : ref_WC_PD_benefits = null
  var _pdWeeksAndLimits : ref_WC_PD_WeeksAndLimits = null
              
  construct(claim : Claim, calculationTime : Date) {
    super(claim, calculationTime)
  
    var dayOfLoss = claim.LossDate.trimToMidnight()
    var impairment = claim.getLossTimeExposure().InjuryIncident.Impairment
    if (impairment != null) {
  
      _statePDRates = find (var StatePDRateInfo in ref_WC_PD_benefits
        where StatePDRateInfo.JurisdictionState == claim.JurisdictionState 
          and StatePDRateInfo.PD_BenefitStartDate <= dayOfLoss
          and StatePDRateInfo.PD_BenefitEndDate >= dayOfLoss
          and StatePDRateInfo.Min_DisabilityPercent <= impairment 
          and StatePDRateInfo.Max_DisabilityPercent >= impairment.intValue() 
  	).getAtMostOneRow()
      _pdWeeksAndLimits = find (var StatePDWeekLimit in ref_WC_PD_WeeksAndLimits
        where StatePDWeekLimit.JurisdictionState == claim.JurisdictionState
          and StatePDWeekLimit.PD_BenefitStartDate <= dayOfLoss
          and StatePDWeekLimit.PD_BenefitEndDate >= dayOfLoss
          and StatePDWeekLimit.DisabilityPercent == gw.api.util.Math.roundDown(impairment as double)).getAtMostOneRow()
    }
  }
  
  /** Should be removed in production implementation - see superclass */
  override property get CompRateImplementationComplete() : boolean {
    return true
  }

  override property get MinCompRate() : BigDecimal {
    return _statePDRates.PD_MinBenefit
  }

  override property get MaxCompRate() : BigDecimal {
    return _statePDRates.PD_MaxBenefit
  }

  override property get MaxWeeksToPay() : Integer {
    return _pdWeeksAndLimits.PD_NumWeeks as java.lang.Integer;
  }  

}
