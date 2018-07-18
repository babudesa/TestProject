package libraries
uses java.util.Date

@Export
class SetSIULifeCycleState {

  private construct() {
    // Enforces static only access
  }

  static function settingSIULifeCycleState(claim : Claim) {
    if (claim.SIULifeCycleState == null and claim.State !="draft")  {
      claim.SIULifeCycleState = "step1"
    }
    if (claim.CreateTime != null and claim.SIULifeCycleState != null) {
      var daysSinceCreated = claim.CreateTime.differenceInDays(Date.CurrentDate)
      if (daysSinceCreated > 5 and daysSinceCreated < 20) {
        claim.SIULifeCycleState = "step2"
      } else if (daysSinceCreated >= 20) {
        claim.SIULifeCycleState="step3"
      }
    }
  }

}
