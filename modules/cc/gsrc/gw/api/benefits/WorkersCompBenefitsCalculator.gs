package gw.api.benefits
uses java.math.BigDecimal
uses java.util.Date
uses gw.api.util.DateUtil
uses java.lang.Integer

/**
 * Abstract superclass for workers compensation benefits calculators. These
 * calculators combine information from the claim (such as the wage amount or
 * loss date) with data and limits from a reference table and use it to
 * determine a compensation rate.
 */
@ReadOnly
abstract class WorkersCompBenefitsCalculator {

  protected var _claim : Claim
  protected var _calculationTime : Date
  protected var _ref : WCBenefitParameterSet
  
  construct(claim : Claim, calculationTime : Date, ref : WCBenefitParameterSet) {
    _calculationTime = calculationTime != null ? calculationTime : DateUtil.currentDate()
    _claim = claim
    _ref = ref
  }

  /**
   * The calculated compensation rate for the benefit, taking into account limits
   * and local variations.
   */
  property get CompRate() : BigDecimal {
    if (not IsValid) {
      return null
    }
    var result = BaseRate
    if (result <= 0) {
      result = 0
    } else if (not HasLimits) {
      result = null
    } else if (not (MinAwwAdjustment and result < MinCompRate)) {
      result = PercentOfWages * result
      result = result.min(MaxCompRate).max(MinCompRate)
    }
    return result
  }

  /**
   * True if the calculator is valid and can compute a CompRate; an invalid
   * calculator always returns a null CompRate. The base implementation checks
   * that the _ref instance variable is set and that BaseRate is non null.
   */
  property get IsValid() : boolean {
    return _ref != null and BaseRate != null
  }
  
  /**
   * True if the calculator has a minimum and maximum CompRate. Calculators
   * with no such limits return a CompRate unless the base rate is zero or less, 
   * in which case they return zero.
   */
  property get HasLimits() : boolean {
    return MinCompRate != null and MaxCompRate != null
  }

  /** The weekly rate of pay for the worker; aka the Average Weekly Wage */
  abstract property get BaseRate() : BigDecimal

  /** The percentage of the BaseRate that is paid to injured workers as their benefit */
  abstract property get PercentOfWages() : BigDecimal
  
  /** The jurisdictional maximum to pay the injured worked each week; may or may not be dependent on the BaseRate */
  abstract property get MaxCompRate() : BigDecimal

  /** The jurisdictional minimum to pay the injured worked each week; may or may not be dependent on the BaseRate */
  abstract property get MinCompRate() : BigDecimal

  /**
   * A common exception to lower the jurisdictional minimum comp rate.
   * If the BaseRate is lower that the mandated minimum, states with this exception will lower the
   * jurisdictional minimum to the BaseRate
   */
  abstract property get MinAwwAdjustment() : Boolean

  /** the maximum number of weeks to pay this benefit; only implemented for PPD */
  abstract property get MaxWeeksToPay() : Integer
}

