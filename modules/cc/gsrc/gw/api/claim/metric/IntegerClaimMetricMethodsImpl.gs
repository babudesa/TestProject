package gw.api.claim.metric
uses java.lang.Integer
uses java.lang.Comparable

@ReadOnly
class IntegerClaimMetricMethodsImpl extends ClaimMetricMethodsImpl {

  construct(integerClaimMetric : IntegerClaimMetric, category : ClaimMetricCategory) {
    super(integerClaimMetric, category)
  }
  
  construct(integerClaimMetric : IntegerClaimMetric) {
    this(integerClaimMetric, "OverallClaimMetrics")
  }
  
  override property get Metric() : IntegerClaimMetric {
    return super.Metric as IntegerClaimMetric
  }
    
  override property get Value() : Integer {
    return Metric.IntegerValue
  }

  override property get ApplicableDisplayValue() : String {
    return Metric.getApplicableDisplayValue(Value)
  }

  override property get IsNegative() : boolean {
    return Value < 0
  }

  override function formatTargetValue(targetValue : Comparable) : String {
    return Metric.getApplicableDisplayValue(targetValue as Integer)
  }
  
}
