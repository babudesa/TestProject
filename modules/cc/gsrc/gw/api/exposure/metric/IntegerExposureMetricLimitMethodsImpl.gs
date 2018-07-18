package gw.api.exposure.metric

uses java.lang.Comparable

@ReadOnly
class IntegerExposureMetricLimitMethodsImpl extends ExposureMetricLimitMethodsImpl {

  construct(exposureMetricLimit : IntegerExposureMetricLimit) {
    super(exposureMetricLimit)    
  }
  
  override property get MetricLimit() : IntegerExposureMetricLimit {
    return super.MetricLimit as IntegerExposureMetricLimit
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
