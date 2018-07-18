package gw.claim.indicator
uses gw.api.claim.indicator.ClaimIndicatorMethodsImpl

/**
 * Claim indicator that turns on if the claim's coverage is in question
 */
@Export
class CoverageInQuestionClaimIndicatorMethodsImpl extends ClaimIndicatorMethodsImpl {

  /**
   * Constructor, called when an indicator is created or read from the database
   */
  construct(inIndicator : CoverageInQuestionClaimIndicator) {
    super(inIndicator, "indicator_icon_covInQuestion.gif")
  }

  /**
   * Update, sets indicator on if the claim's CoverageInQuestion field is true
   */
  override function update() {
    setOn(Indicator.Claim.CoverageInQuestion)
  }
  
  /**
   * Text label, just has two values depending on whether indicator is on or off
   */
  override property get Text() : String {
    return Indicator.IsOn ? displaykey.Web.Claim.CoverageInQuestionClaimIndicator.CoverageInQuestion.OnText
            : displaykey.Web.Claim.CoverageInQuestionClaimIndicator.CoverageInQuestion.OffText
  }
  
  /**
   * This indicator does not have any hover text
   */
  override property get HoverText() : String {
    return null
  }
}
