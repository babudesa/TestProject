package gw.api.claim.metric
uses java.lang.Comparable

@ReadOnly
class DecimalClaimMetricLimitMethodsImpl extends ClaimMetricLimitMethodsImpl {

  construct(claimMetricLimit : DecimalClaimMetricLimit) {
    super(claimMetricLimit)
  }

  override property get MetricLimit() : DecimalClaimMetricLimit {
    return super.MetricLimit as DecimalClaimMetricLimit
  }
  
  override property get TargetValue() : Comparable {
    return MetricLimit.DecimalTargetValue
  }

  override property get YellowValue() : Comparable {
    return MetricLimit.DecimalYellowValue
  }

  override property get RedValue() : Comparable {
    return MetricLimit.DecimalRedValue
  }

}
