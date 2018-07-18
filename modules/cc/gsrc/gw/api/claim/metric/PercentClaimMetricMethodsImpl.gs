package gw.api.claim.metric
uses java.math.BigDecimal
uses gw.api.metric.MetricLimitMethods
uses java.lang.Comparable
uses gw.datatype.DataTypes

@ReadOnly
class PercentClaimMetricMethodsImpl extends ClaimMetricMethodsImpl {

  construct(percentClaimMetric : PercentClaimMetric, category : ClaimMetricCategory) {
    super(percentClaimMetric, category)
  }
  
  construct(percentClaimMetric : PercentClaimMetric) {
    this(percentClaimMetric, "OverallClaimMetrics")
  }
  
  override property get Metric() : PercentClaimMetric {
    return super.Metric as PercentClaimMetric
  }
    
  override property get Value() : BigDecimal {
    return Metric.PercentValue
  }

  override property get ApplicableDisplayValue() : String {
    return Metric.getApplicableDisplayValue(Value)
  }
  
  override property get IsNegative() : boolean {
    return Value < 0
  }

  override function formatTargetValue(targetValue : Comparable) : String {
    return Metric.getApplicableDisplayValue(targetValue as BigDecimal)
  }
  
  override function createDefaultLimit() : MetricLimitMethods {
    return new PercentClaimMetricLimit() {
      :ClaimMetricType = Metric.Subtype,
      :ClaimMetricCategory = Metric.ClaimMetricCategory,
      :MetricUnit = Unit,
      :AscendingLimitOrder = AscendingLimitOrder
    }
  }

  override property get Unit() : MetricUnit {
    return "percent"
  }

  function setValueToRatio(numerator : BigDecimal, denominator : BigDecimal) {
    Metric.PercentValue = ensureFitsPrecision(Metric.fractionToPercentage(numerator, denominator))
  }

  private function ensureFitsPrecision(val : BigDecimal) : BigDecimal {
    var propertyInfo = PercentClaimMetric.Type.EntityProperties.toList().firstWhere(\ i -> i.Name.equals("PercentValue"))
    var dataType = DataTypes.get(propertyInfo)
    var maxPrecision = dataType.asConstrainedDataType().getPrecision(this, propertyInfo)
    while (val.precision() > maxPrecision and val > 1) {
      var scale = val.scale()
      val = val.divide(10)
      val.setScale(scale)
    }
    return val
  }
}
