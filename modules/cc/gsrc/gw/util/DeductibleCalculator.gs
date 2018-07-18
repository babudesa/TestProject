package gw.util
uses java.math.BigDecimal

@Export
class DeductibleCalculator {  
  /** 
   * Computes the deductible amount that should be applied based on the given coverage.
   * By defualt this simply returns the coverage's policy deductible amount.
   * This may be configured to return a value based on more factors, such as fault rating,
   * if necessary.
   */
  public static function calculateDeductibleAmountForCoverage(coverage : Coverage) : BigDecimal {
    return coverage.Deductible
  }
}