package gw.api.exposure.metric

uses java.lang.Integer
uses java.lang.Comparable

@ReadOnly
class IntegerExposureMetricMethodsImpl extends ExposureMetricMethodsImpl {

  construct(integerExposureMetric : IntegerExposureMetric) {
    super(integerExposureMetric)
  }
  
  override property get Metric() : IntegerExposureMetric {
    return super.Metric as IntegerExposureMetric
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
