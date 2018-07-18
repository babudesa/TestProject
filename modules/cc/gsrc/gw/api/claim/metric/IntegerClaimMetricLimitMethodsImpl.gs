package gw.api.claim.metric
uses java.lang.Comparable

@ReadOnly
class IntegerClaimMetricLimitMethodsImpl extends ClaimMetricLimitMethodsImpl {

  construct(claimMetricLimit : IntegerClaimMetricLimit) {
    super(claimMetricLimit)
  }
  
  override property get MetricLimit() : IntegerClaimMetricLimit {
    return super.MetricLimit as IntegerClaimMetricLimit
  }
  
  override property get TargetValue() : Comparable {
    return MetricLimit.IntegerTargetValue
  }

  override property get YellowValue() : Comparable {
    return MetricLimit.IntegerYellowValue
  }

  override property get RedValue() : Comparable {
    return MetricLimit.IntegerRedValue
  }

}
