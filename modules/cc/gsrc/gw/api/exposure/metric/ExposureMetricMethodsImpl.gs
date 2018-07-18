package gw.api.exposure.metric

uses java.lang.UnsupportedOperationException
uses gw.api.metric.MetricMethodsImpl
uses gw.api.metric.MetricLimitMethods
uses gw.api.metric.MetricLimitMatchQuality

/**
 * Superclass for ExposureMetricMethods implementations
 */
@ReadOnly
class ExposureMetricMethodsImpl extends MetricMethodsImpl {

  var _exposureMetric : ExposureMetric as readonly Metric
  
  construct(exposureMetric : ExposureMetric) {
    _exposureMetric = exposureMetric
  }

  override property get Limit() : MetricLimitMethods {
    return Metric.MetricLimitDenorm 
  }

  override function findLimit() : ExposureMetricLimit {
    var policyType = Metric.Exposure.Claim.Policy.PolicyType
    var limits = PolicyTypeMetricLimits.cache.limitsForPolicyType(policyType)
    var result : ExposureMetricLimit = null
    if (limits != null) {
      var exposureLimits = limits.ExposureMetricLimits
      var possible = exposureLimits.maxBy(\ l -> qualityOfLimitMatch(l))
      if (qualityOfLimitMatch(possible) != NoMatch) {
        result = possible
      }
    }
    return result;
  }
  
  function qualityOfLimitMatch(expLimit : ExposureMetricLimit) : MetricLimitMatchQuality {
    var result = MetricLimitMatchQuality.NoMatch
    if (expLimit.ExposureMetricType == Metric.Subtype) {
      if (expLimit.ExposureTier == Metric.Exposure.ExposureTier) {
        result = ExactMatch
      } else if (expLimit.ExposureTier == null) {
        result = DefaultMatch
      }
    }
    return result
  }
  
  override function createDefaultLimit() : MetricLimitMethods {
    return new IntegerExposureMetricLimit() {
      :ExposureMetricType = Metric.Subtype,
      :MetricUnit = Unit,
      :AscendingLimitOrder = AscendingLimitOrder
    }
  }

  override property get MetricAsMetricLimitTimeDelegate() : MetricLimitTimeDelegate {
    return _exposureMetric
  }

  override function notSupported() : UnsupportedOperationException {
    return new UnsupportedOperationException("No Metric defined. Please define " + Metric.Subtype + " in the package gw.exposure.metric.<category>")
  }

}
