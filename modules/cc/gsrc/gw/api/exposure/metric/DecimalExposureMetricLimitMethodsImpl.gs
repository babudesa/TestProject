package gw.api.exposure.metric

uses java.lang.Comparable

@ReadOnly
class DecimalExposureMetricLimitMethodsImpl extends ExposureMetricLimitMethodsImpl {
  
  construct(exposureMetricLimit : DecimalExposureMetricLimit) {
    super(exposureMetricLimit)
  }

  override property get MetricLimit() : DecimalExposureMetricLimit {
    return super.MetricLimit as DecimalExposureMetricLimit
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
