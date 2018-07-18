
package util;

/*
 * Utilities for checking new exposures against the InvalidCoverageForCause, 
 * IncompatibleNewExposure, and InvalidCoverageForFaultRating reference tables.
 */
@Export
class CoverageValidation {

  construct() {}

  /**
   * Would a new exposure with the given coverage type be appropriate for the given claim? Checks if
   * the coverage type is appropriate given the claim's loss type, LOB code, policy type and loss cause.
   * Returns true if the coverage type would not be appropriate, false otherwise
   */
  public static function invalidCoverageForCause(claim : Claim, coverageType : CoverageType) : boolean {
    return find (icfc in InvalidCoverageForCause
      where icfc.LossType == claim.LossType
        and icfc.LOBCode == claim.LOBCode
        and icfc.PolicyType == claim.Policy.PolicyType
        and icfc.LossCause == claim.LossCause
        and icfc.PrimaryCoverage == coverageType).getCount() > 0
  }  

  /**
   * Would a new exposure with the given coverage type conflict with an existing
   * exposure on the claim? If so return the first exposure (as ordered by
   * the ClaimOrder field) that is incompatible. If not return null.
   */
  public static function incompatibleNewExposure(claim:Claim, covType:CoverageType) : Exposure  {
    return claim.OrderedExposures.firstWhere(\ e -> isRelevant(e) and isIncompatible(e, covType))
  }

  /**
   * Return true if the given exposure is relevant for the purpose of checking
   * for incompatible new exposures, false otherwise. For example exposures that
   * have been closed because of fraud are not considered when looking for
   * incompatible exposures.
   */ 
  private static function isRelevant(exposure : Exposure) : boolean {
    return exposure.ClosedOutcome != "duplicate"
      and exposure.ClosedOutcome != "mistake"
      and exposure.ClosedOutcome != "unnecessary"
      and exposure.ClosedOutcome != "fraud" 
  }

  /**
   * Return true if a new exposure with the given coverage type would be
   * incompatible with the given existing exposure. Returns false otherwise.
   */ 
  private static function isIncompatible(exposure : Exposure, coverageType : CoverageType) : boolean {
    return find(ine in IncompatibleNewExposure
      where ine.PolicyType == exposure.Claim.Policy.PolicyType
      and ine.NewExposureCoverage == coverageType
      and ine.ExistingExposures == exposure.PrimaryCoverage).getCount() > 0
  }

  /**
   * If a new exposure with the given coverage type would not be appropriate for the given claims policy type
   * and fault rating, then return an error message explaining the problem. If the exposure is appropriate
   * return null.
   */
  public static function invalidCoverageForFaultRatingMessage(claim:Claim, covType:CoverageType) : String {
    if (invalidCoverageForFaultRating(claim, covType)) {
      if (claim.FaultRating != null) {
        return displaykey.JSP.NewExposure.ClaimMenu.NewExposure.CoverageAndFaultConflict(claim.FaultRating.Description)
      } else {
        return displaykey.JSP.NewExposure.ClaimMenu.NewExposure.CoverageAndNullFaultConflict
      }
    } else {
      return null
    }
  }

  /**
   * Would a new exposure with the given coverage type be appropriate for the given claim? Checks if
   * the coverage type is appropriate given the claim's policy type and fault rating.
   * Returns true if the coverage type would not be appropriate, false otherwise
   */
  public static function invalidCoverageForFaultRating(claim : Claim, coverageType : CoverageType) : boolean {
    var claimFaultRating = claim.FaultRating != null ? claim.FaultRating : FaultRating.TC_0
    return find(icffr in InvalidCoverageForFault
      where icffr.PolicyType==claim.Policy.PolicyType
        and icffr.PrimaryCoverage==coverageType
        and icffr.FaultRating==claimFaultRating).getCount() > 0
  }
}
