package gw.api.exposure.metric

uses java.lang.Comparable

@ReadOnly
class MoneyExposureMetricLimitMethodsImpl extends ExposureMetricLimitMethodsImpl {

  construct(exposureMetricLimit : MoneyExposureMetricLimit) {
    super(exposureMetricLimit)
  }

  override property get MetricLimit() : MoneyExposureMetricLimit {
    return super.MetricLimit as MoneyExposureMetricLimit
  }
  
  override property get TargetValue() : Comparable {
    return MetricLimit.MoneyTargetValue
  }

  override property get YellowValue() : Comparable {
    return MetricLimit.MoneyYellowValue
  }

  override property get RedValue() : Comparable {
    return MetricLimit.MoneyRedValue
  }
  
}
