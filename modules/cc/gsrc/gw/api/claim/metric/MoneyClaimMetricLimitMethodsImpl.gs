package gw.api.claim.metric
uses java.lang.Comparable

@ReadOnly
class MoneyClaimMetricLimitMethodsImpl extends ClaimMetricLimitMethodsImpl {

  construct(claimMetricLimit : MoneyClaimMetricLimit) {
    super(claimMetricLimit)
  }

  override property get MetricLimit() : MoneyClaimMetricLimit {
    return super.MetricLimit as MoneyClaimMetricLimit
  }
  
  override property get TargetValue() : Comparable {
    return MetricLimit.MoneyTargetValue
  }

  override property get YellowValue() : Comparable {
    return MetricLimit.MoneyYellowValue
  }

  override property get RedValue() : Comparable {
    return MetricLimit.MoneyRedValue
  }

  property get Currency() : Currency {
    return MetricLimit.Currency
  }
}
