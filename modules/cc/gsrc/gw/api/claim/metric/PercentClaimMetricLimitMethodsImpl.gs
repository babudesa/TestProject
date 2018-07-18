package gw.api.claim.metric
uses java.lang.Comparable

@ReadOnly
class PercentClaimMetricLimitMethodsImpl extends ClaimMetricLimitMethodsImpl {

  construct(claimMetricLimit : PercentClaimMetricLimit) {
    super(claimMetricLimit)
  }

  override property get MetricLimit() : PercentClaimMetricLimit {
    return super.MetricLimit as PercentClaimMetricLimit
  }
  
  override property get TargetValue() : Comparable {
    return MetricLimit.PercentTargetValue
  }

  override property get YellowValue() : Comparable {
    return MetricLimit.PercentYellowValue
  }

  override property get RedValue() : Comparable {
    return MetricLimit.PercentRedValue
  }

}
