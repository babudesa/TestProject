package gw.api.claim
uses gw.lang.reflect.TypeSystem
uses gw.api.exposure.ExposureHealthUpdater
uses java.util.Date
uses gw.api.metric.MetricUpdateHelper
uses gw.api.profiler.ProfilerTag

@ReadOnly
class ClaimHealthUpdater extends HealthUpdaterBase {
  
  static final var HEALTH_UPDATER = new ProfilerTag("ClaimHealthUpdater", "Updates indicators and metrics on claim")
  static final var CLAIM_INDICATOR_UPDATE = new ProfilerTag("ClaimIndicatorUpdate", "Update of an individual claim indicator")
  static final var CLAIM_METRIC_UPDATE = new ProfilerTag("ClaimMetricUpdate", "Update of an individual claim metric")

  var _claim : Claim
  var _limits : PolicyTypeMetricLimits
  var _exposureUpdaters : List<ExposureHealthUpdater>
  
  construct(claim : Claim) {
    _claim = claim
    _limits = PolicyTypeMetricLimits.cache.limitsForPolicyType(claim.Policy.PolicyType)
    _exposureUpdaters = claim.OrderedExposures
            .map(\ e -> new ExposureHealthUpdater(e)).toList()
  }
  
  /**
   * This is the entry point by which the metrics for a claim and its exposures
   * are updated. Calling claim.scheduleHealthUpdate will cause
   * this updateClaim method to be called late in the bundle commit, after the
   * pre-update rules and entity callbacks have already been called
   */
  static function updateClaim(claim : Claim) {
    new ClaimHealthUpdater(claim).update()
  }

  /**
   * Updates the indicators and metrics, in the following order
   * <ul>
   * <li>Updates claim indicators
   * <li>Updates tiers and cached limits for exposures
   * <li>Updates tier and cached limits for claim
   * <li>Updates exposure metrics
   * <li>Updates claim metrics
   * </ul>
   */
  private function update() {
    if (_claim.State != "draft") {
      using (HEALTH_UPDATER) {
        ensureMetricsLoaded()
        updateClaimIndicators()
        prepareTiersAndLimits()
        var earliestTime = updateMetrics()
        _claim.ClaimMetricRecalculationTime.NextRecalculationTime = earliestTime
        _claim.ClaimMetricRecalculationTime.ForceRecalculate = false
      }
    }
  }
  
  /**
   * Ensure the metrics and indicators are created and are refreshed with the
   * latest copies from the database.
   */
  private function ensureMetricsLoaded() {
    if (_claim.ClaimMetricRecalculationTime == null or _claim.ClaimMetricRecalculationTime.ForceRecalculate) {
      createIndicators()
      createMetrics()
      if(_claim.ClaimMetricRecalculationTime == null) {
        _claim.ClaimMetricRecalculationTime = new ClaimMetricRecalculationTime()
      }
    } else {
      _claim.ClaimMetricRecalculationTime.ensureMetricsUpToDate()
    }
  }

  /**
   * Create indicator objects for the claim, one for each non abstract
   * subtype of ClaimIndicator
   */
  private function createIndicators() {
    for (subtypeKey in typekey.ClaimIndicator.getTypeKeys(false)) {
      var subtype = TypeSystem.getByFullName("entity." + subtypeKey.Code)
      if (!subtype.Abstract){
        if(!_claim.ClaimIndicators.hasMatch(\ c -> (typeof c) == subtype)) {
          var instance = subtype.TypeInfo.getConstructor({}).Constructor.newInstance({}) as ClaimIndicator
          _claim.addToClaimIndicators(instance)
        }
      }
    }
  }

  /**
   * Create metric objects for the claim, one for each non abstract
   * subtype of ClaimMetric
   */
  private function createMetrics() {
    for (subtypeKey in typekey.ClaimMetric.getTypeKeys(false)) {
      var subtype = TypeSystem.getByFullName("entity." + subtypeKey.Code)
      if (!subtype.Abstract){
        if(!_claim.ClaimMetrics.hasMatch(\ c -> (typeof c) == subtype)) {
          var instance = subtype.TypeInfo.getConstructor({}).Constructor.newInstance({}) as ClaimMetric
          _claim.addToClaimMetrics(instance)
        }
      }
    }
  }

  private function updateClaimIndicators() {
    for (indicator in _claim.ClaimIndicators) {
      using (CLAIM_INDICATOR_UPDATE) {
        CLAIM_INDICATOR_UPDATE.setProperty(indicator.Subtype.DisplayName)
        indicator.update()
      }
    }
  }

  private function prepareTiersAndLimits() {
    for (exposureUpdater in _exposureUpdaters) {
      exposureUpdater.prepareTierAndLimits(_limits, _claim.ClaimMetricRecalculationTime.ForceRecalculate)
    }
    _claim.setClaimTier()
    updateCachedMetricLimits()
  }

  private function updateMetrics() : Date {
    var helper = new MetricUpdateHelper(_claim.Bundle)
    var earliestTime : Date = null
    for (exposureUpdater in _exposureUpdaters) {
      earliestTime = getEarliest(earliestTime, exposureUpdater.update(helper))
    }
    earliestTime = getEarliest(earliestTime, updateClaimMetrics(helper, earliestTime))
    return earliestTime
  }

  private function updateClaimMetrics(helper : MetricUpdateHelper, earliestTime : Date) : Date {
    var result = earliestTime
    for (metric in _claim.ClaimMetrics) {
      using (CLAIM_METRIC_UPDATE) {
        CLAIM_METRIC_UPDATE.setProperty(metric.Subtype.DisplayName)
        result = getEarliest(result, metric.update(helper))
      }
    }
    return result
  }

  /**
   * Update the limits that apply to the claim metrics.
   */
  private function updateCachedMetricLimits() {
    var newMetrics = _claim.ClaimMetricRecalculationTime.New
    var claimTierChanged = _claim.isFieldChanged("ClaimTier")
    var currencyChanged = _claim.isFieldChanged("Currency")
    if (newMetrics or claimTierChanged) {
      _claim.ClaimMetricRecalculationTime.MetricLimitGeneration
              = _limits != null ? _limits.Generation : 0
    }
    if (newMetrics or claimTierChanged or currencyChanged or _claim.ClaimMetricRecalculationTime.ForceRecalculate) {
      refreshDenormLimitsOnClaimMetrics()
    }
  }

  private function refreshDenormLimitsOnClaimMetrics() {
    for (metric in _claim.ClaimMetrics) {
      metric.MetricLimitDenorm = metric.findLimit() as ClaimMetricLimit
    }
  }
}