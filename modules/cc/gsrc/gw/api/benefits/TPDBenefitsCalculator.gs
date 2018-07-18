package gw.api.benefits
uses java.math.BigDecimal
uses java.util.Date
uses java.lang.Integer
uses gw.api.util.DateUtil

/**
 * Benefits calculator for temporary partial disability (TPD). This example
 * implementation has customized calculators for Florida (FL), Pennsylvania (PA)
 * and New Jersey (NJ)
 */
@Export
class TPDBenefitsCalculator extends WorkersCompBenefitsCalculator {
  
  public static function create(claim : Claim, calculationTime : Date) : TPDBenefitsCalculator {
    switch (claim.JurisdictionState) {
      case "FL":
        return new TPDBenefitsCalculator(claim, calculationTime) {
          override property get CompRate() : BigDecimal {
            return getFLTTDCompRate(claim);
          }
        }
      case "PA":
        return new TPDBenefitsCalculator(claim, calculationTime) {
          override property get MinCompRate() : BigDecimal {
            return WorkersCompBenefitsExceptions.getPAMinCompRate(MaxCompRate, BaseRate);
          }
        }
      case "NJ":  // No TPD in NJ
        return new TPDBenefitsCalculator(claim, calculationTime) {
          override property get CompRate() : BigDecimal {
            return null;
          } 
          override property get MinCompRate() : BigDecimal {
            return null;
          }
          override property get MaxCompRate() : BigDecimal {
            return null;
          }
        }
      default:
        return new TPDBenefitsCalculator(claim, calculationTime); 
    }
  }
  
  private construct(claim : Claim, calculationTime : Date) {
    super(claim, calculationTime, claim.findWCBeneCalcRef())
  }
      
  override property get BaseRate() : BigDecimal {
    return _claim.EmploymentData.WageAmount - _claim.EmploymentData.WageAmountPostInjury
  }

  override property get MinCompRate() : BigDecimal {
    return _ref.TPDMin
  }

  override property get MaxCompRate() : BigDecimal {
    return _ref.TPDMax;
  }

  override property get MinAwwAdjustment() : Boolean {
    return _ref.TPDMinAdjToAWW // Should return value from ref table
  }

  override property get PercentOfWages() : BigDecimal {
    return (_ref.TPDPercentOfWages / 100)
  }

  override property get MaxWeeksToPay() : Integer {
    return null
  }

  private static function getFLTTDCompRate(claim : Claim) : BigDecimal {
     //  TTD Rate Exception:  80% of the 80%  
    var flCompRate : BigDecimal = null;
    if ((claim.LossDate >= ("2008-01-01" as java.util.Date)) and (claim.LossDate < ("2009-01-01" as java.util.Date))) {    
      flCompRate = 0.80 * ((0.80 * claim.EmploymentData.WageAmount) - claim.EmploymentData.WageAmountPostInjury)
      if (flCompRate != null) {
        flCompRate = flCompRate.max(0).min(746)
      }
    }
    return flCompRate
  }
}