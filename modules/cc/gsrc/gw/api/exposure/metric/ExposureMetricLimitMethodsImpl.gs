package gw.api.exposure.metric

uses gw.api.metric.MetricLimitMethods
uses gw.entity.IEntityType
uses java.lang.Comparable
uses java.lang.UnsupportedOperationException

@ReadOnly
abstract class ExposureMetricLimitMethodsImpl implements MetricLimitMethods {
  
  var _exposureMetricLimit : ExposureMetricLimit as readonly MetricLimit
  
  construct(exposureMetricLimit : ExposureMetricLimit) {
    _exposureMetricLimit = exposureMetricLimit
  }

  override property get DefaultLimit() : boolean {
    return MetricLimit.ExposureTier == null
  }

  override property get RedValue() : Comparable {
    throw notSupported()
  }

  override property get TargetValue() : Comparable {
    throw notSupported()
  }

  override property get Unit() : MetricUnit {
    return MetricLimit.MetricUnit
  }

  override property get YellowValue() : Comparable {
    throw notSupported()
  }
  
  override property get BaseType() : IEntityType {
    return ExposureMetricLimit.Type
  }
  
  protected function notSupported() : UnsupportedOperationException {
    return new UnsupportedOperationException("No metric limit defined. Please define implementation methods for " 
      + MetricLimit.Subtype + " in the package gw.exposure.metric")
  }

}
