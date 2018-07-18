package gw.api.exposure.metric

uses java.math.BigDecimal
uses gw.api.metric.MetricLimitMethods
uses java.lang.Comparable

@ReadOnly
class PercentExposureMetricMethodsImpl extends ExposureMetricMethodsImpl  {

  construct(percentExposureMetric : PercentExposureMetric) {
    super(percentExposureMetric)
  }
  
  override property get Metric() : PercentExposureMetric {
    return super.Metric as PercentExposureMetric
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
    return new PercentExposureMetricLimit() {
      :ExposureMetricType = Metric.Subtype,
      :MetricUnit = Unit,
      :AscendingLimitOrder = AscendingLimitOrder
    }
  }

  override property get Unit() : MetricUnit {
    return "percent"
  }

  function setValueToRatio(numerator : BigDecimal, denominator : BigDecimal) {
    Metric.PercentValue = Metric.fractionToPercentage(numerator, denominator)
  }

}
