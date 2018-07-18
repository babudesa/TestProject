package gw.api.exposure.metric

uses java.lang.Comparable

@ReadOnly
class PercentExposureMetricLimitMethodsImpl extends ExposureMetricLimitMethodsImpl {

  construct(exposureMetricLimit : PercentExposureMetricLimit) {
    super(ExposureMetricLimit)    
  }
  
  override property get MetricLimit() : PercentExposureMetricLimit {
    return super.MetricLimit as PercentExposureMetricLimit
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
