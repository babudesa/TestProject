package gw.api.exposure.metric

uses gw.api.metric.MetricLimitMethods
uses java.math.BigDecimal
uses java.lang.Comparable

@ReadOnly
class DecimalExposureMetricMethodsImpl extends ExposureMetricMethodsImpl {

  var _displayScale : int as readonly DisplayScale
  var _calculationScale : int as readonly CalculationScale

  construct(decimalExposureMetric : DecimalExposureMetric, dispScale : int) {
    super(decimalExposureMetric)
    _displayScale = dispScale
    _calculationScale = 4
  }
  
  construct(decimalExposureMetric : DecimalExposureMetric) {
    this(decimalExposureMetric, 2)
  }
  
  override property get Metric() : DecimalExposureMetric {
    return super.Metric as DecimalExposureMetric
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
    return new DecimalExposureMetricLimit() {
      :ExposureMetricType = Metric.Subtype,
      :MetricUnit = Unit,
      :AscendingLimitOrder = AscendingLimitOrder
    }
  }
  
}
