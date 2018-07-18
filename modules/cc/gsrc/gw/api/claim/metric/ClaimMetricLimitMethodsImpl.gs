package gw.api.claim.metric
uses java.lang.UnsupportedOperationException
uses gw.api.metric.MetricLimitMethods
uses java.lang.Comparable
uses gw.entity.IEntityType

/**
 * Superclass for ClaimMetricLimitMethods implementations
 */
@ReadOnly
class ClaimMetricLimitMethodsImpl implements MetricLimitMethods {

  var _claimMetricLimit : ClaimMetricLimit as readonly MetricLimit
  
  construct(claimMetricLimit : ClaimMetricLimit) {
    _claimMetricLimit = claimMetricLimit
  }
  
  override property get TargetValue() : Comparable {
    throw notSupported()
  }

  override property get YellowValue() : Comparable {
    throw notSupported()
  }

  override property get RedValue() : Comparable {
    throw notSupported()
  }
  
  override property get DefaultLimit() : boolean {
    return MetricLimit.ClaimTier == null
  }
  
  override property get Unit() : MetricUnit {
    return MetricLimit.MetricUnit
  }
  
  override property get BaseType() : IEntityType {
    return ClaimMetricLimit
  }

  function notSupported() : UnsupportedOperationException {
    return new UnsupportedOperationException("No metric limit defined. Please define implementation methods for " + MetricLimit.Subtype + " in the package gw.claim.metric")
  }

}
