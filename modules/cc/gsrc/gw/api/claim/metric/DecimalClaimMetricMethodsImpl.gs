package gw.api.claim.metric
uses java.math.BigDecimal
uses gw.api.metric.MetricLimitMethods
uses java.lang.Comparable

@ReadOnly
class DecimalClaimMetricMethodsImpl extends ClaimMetricMethodsImpl {  
  
  var _displayScale : int as readonly DisplayScale
  var _calculationScale : int as readonly CalculationScale
  
  construct(decimalClaimMetric : DecimalClaimMetric, category : ClaimMetricCategory, inDisplayScale : int) {
    super(decimalClaimMetric, category)
    _displayScale = inDisplayScale
    _calculationScale = 4 
  }
  
  construct(decimalClaimMetric : DecimalClaimMetric, category : ClaimMetricCategory) {
    this(decimalClaimMetric, category, 2)
  }
  
  construct(decimalClaimMetric : DecimalClaimMetric) {
    this(decimalClaimMetric, "OverallClaimMetrics")
  }
  
  override property get Metric() : DecimalClaimMetric {
    return super.Metric as DecimalClaimMetric
  }
    
  override property get Value() : BigDecimal {
    return Metric.DecimalValue
  }

  override property get ApplicableDisplayValue() : String {
    return Metric.getApplicableDisplayValue(Value, DisplayScale)
  }
  
  override property get IsNegative() : boolean {
    return Value < 0
  }

  override function formatTargetValue(targetValue : Comparable) : String {
    return Metric.getApplicableDisplayValue(targetValue as BigDecimal, DisplayScale)
  }
  
  override function createDefaultLimit() : MetricLimitMethods {
    return new DecimalClaimMetricLimit() {
      :ClaimMetricType = Metric.Subtype,
      :ClaimMetricCategory = Metric.ClaimMetricCategory,
      :MetricUnit = Unit,
      :AscendingLimitOrder = AscendingLimitOrder
    }
  }

}
