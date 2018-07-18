package util

class PolicyUI
{
  construct()
  {
  }
  
  public static function handleDeductibleUpdate(coverage : Coverage) : String {
    if (coverage.ClaimDeductible!=null && coverage.isFieldChanged("Deductible")) {
      var deductible = coverage.ClaimDeductible
      if (deductible.Paid) {
        gw.api.util.LocationUtil.addRequestScopedInfoMessage(displaykey.Deductible.PaidDeductibleUpdated)
      } else if (deductible.Overridden) {
        gw.api.util.LocationUtil.addRequestScopedInfoMessage(displaykey.Deductible.OverriddenDeductibleUpdated)
      } else {
        gw.api.util.LocationUtil.addRequestScopedInfoMessage(displaykey.Deductible.UnpaidDeductibleUpdated)
      }
    }
    return null
  }
}
