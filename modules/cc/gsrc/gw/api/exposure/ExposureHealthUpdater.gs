package gw.api.exposure
uses gw.lang.reflect.TypeSystem
uses gw.api.claim.HealthUpdaterBase
uses java.util.Date
uses gw.api.metric.MetricUpdateHelper
uses gw.api.profiler.ProfilerTag

@ReadOnly
class ExposureHealthUpdater extends HealthUpdaterBase {
  
  static final var EXPOSURE_METRIC_UPDATE = new ProfilerTag("ExposureMetricUpdate", "Update of an individual exposure metric")

  private var _exposure : Exposure
  
  construct(exposure : Exposure) {
    _exposure = exposure
  }
  
  function prepareTierAndLimits(limits : PolicyTypeMetricLimits, forceRecalculate : boolean) {
    if (_exposure.State != "draft") {
      if (_exposure.ExposureMetrics.length == 0 or forceRecalculate) {
        initializeMetrics()
      }
      _exposure.setExposureTier()
      updateCachedMetricLimits(limits, forceRecalculate)
    }
  }
  
  function update(helper : MetricUpdateHelper) : Date {
    var earliestTime : Date = null
    if (_exposure.State != "draft") {
      for (metric in _exposure.ExposureMetrics) {
        using (EXPOSURE_METRIC_UPDATE) {
          EXPOSURE_METRIC_UPDATE.setProperty(metric.Subtype.DisplayName)
          earliestTime = getEarliest(earliestTime, metric.update(helper))
        }
      }
    }
    return earliestTime
  }
  
  private function initializeMetrics() {
    for (subtypeKey in typekey.ExposureMetric.getTypeKeys(false)) {
      var subtype = TypeSystem.getByFullName("entity." + subtypeKey.Code)
      if (!subtype.Abstract){
        if(!_exposure.ExposureMetrics.hasMatch(\ e -> (typeof e) == subtype)) {
          var instance = subtype.TypeInfo.getConstructor({}).Constructor.newInstance({}) as ExposureMetric
          _exposure.addToExposureMetrics(instance)
        }
      }
    }
  }  

  private function updateCachedMetricLimits(limits : PolicyTypeMetricLimits, forceRecalculate : boolean) {
    var newMetrics = _exposure.MetricLimitGeneration == null
    var exposureTierChanged = _exposure.isFieldChanged("ExposureTier")
    var currencyChanged = _exposure.Claim.isFieldChanged("Currency")
    if (newMetrics or exposureTierChanged) {
      _exposure.MetricLimitGeneration = limits != null ? limits.Generation : 0
    }
    if (newMetrics or exposureTierChanged or currencyChanged or forceRecalculate) {
      refreshDenormLimitsOnExposureMetrics()
    }
  }
  
  private function refreshDenormLimitsOnExposureMetrics() {
    for (metric in _exposure.ExposureMetrics) {
      metric.MetricLimitDenorm = metric.findLimit() as ExposureMetricLimit
    }
  }
}