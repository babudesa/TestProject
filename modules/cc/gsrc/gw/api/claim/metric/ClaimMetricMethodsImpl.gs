package gw.api.claim.metric
uses gw.api.metric.MetricLimitMatchQuality
uses java.lang.UnsupportedOperationException
uses gw.api.metric.MetricMethodsImpl
uses gw.api.metric.MetricLimitMethods

/**
 * Superclass for ClaimMetricMethods implementations
 */
@ReadOnly
class ClaimMetricMethodsImpl extends MetricMethodsImpl {

  var _claimMetric : ClaimMetric as readonly Metric
  
  construct(claimMetric : ClaimMetric, category : ClaimMetricCategory) {
    _claimMetric = claimMetric
    if (claimMetric.New) {
      claimMetric.ClaimMetricCategory = category
    }
  }
  
  construct(claimMetric : ClaimMetric) {
    this(claimMetric, "OverallClaimMetrics")
  }

  override property get Limit() : MetricLimitMethods {
    return Metric.MetricLimitDenorm 
  }

  override function findLimit() : ClaimMetricLimit {
    var policyType = Metric.Claim.Policy.PolicyType
    var limits = PolicyTypeMetricLimits.cache.limitsForPolicyType(policyType)
    var result : ClaimMetricLimit = null
    if (limits != null) {
      var claimLimits = limits.getClaimLimitsAsOfGeneration(Metric.Claim.ClaimMetricRecalculationTime.MetricLimitGeneration)
      var possible = claimLimits.maxBy(\ l -> qualityOfLimitMatch(l))
      if (qualityOfLimitMatch(possible) != NoMatch) {
        result = possible
      }
    }
    return result;
  }
  
  function qualityOfLimitMatch(claimLimit : ClaimMetricLimit) : MetricLimitMatchQuality {
    var result = MetricLimitMatchQuality.NoMatch
    if (claimLimit.ClaimMetricType == Metric.Subtype) {
      if (claimLimit.ClaimTier == Metric.Claim.ClaimTier) {
        result = ExactMatch
      } else if (claimLimit.ClaimTier == null) {
        result = DefaultMatch
      }
    }
    return result
  }
  
  override function createDefaultLimit() : MetricLimitMethods {
    return new IntegerClaimMetricLimit() {
      :ClaimMetricType = Metric.Subtype,
      :ClaimMetricCategory = Metric.ClaimMetricCategory,
      :MetricUnit = Unit,
      :AscendingLimitOrder = AscendingLimitOrder
    }
  }

  override property get MetricAsMetricLimitTimeDelegate() : MetricLimitTimeDelegate {
    return _claimMetric
  }

  override function notSupported() : UnsupportedOperationException {
    return new UnsupportedOperationException("No Metric defined. Please define " + Metric.Subtype + " in the package gw.claim.metric.<category>")
  }
}
