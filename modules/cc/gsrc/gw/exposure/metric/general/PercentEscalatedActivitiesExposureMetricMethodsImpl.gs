package gw.exposure.metric.general
uses java.util.Date
uses gw.api.exposure.metric.PercentExposureMetricMethodsImpl
uses gw.api.metric.MetricUpdateHelper

@Export
class PercentEscalatedActivitiesExposureMetricMethodsImpl extends PercentExposureMetricMethodsImpl {
  
  construct(percentageEscalatedActivitiesExposureMetric : PercentEscalatedActivitiesExposureMetric ) {
    super(percentageEscalatedActivitiesExposureMetric)
  }

  override function updateMetricValue(helper : MetricUpdateHelper) : Date {
    if (helper.updateContainsChangesOfType(Activity)
        or Metric.New) {
      var exposureActivities = Metric.Exposure.Claim.LossType == "WC" 
                                ? Metric.Exposure.Claim.Activities.where(\ a -> a.Exposure == Metric.Exposure) 
                                : Metric.Exposure.Claim.Activities.where(\ a -> (a.Exposure == Metric.Exposure or a.Claimant == Metric.Exposure.Claimant))
      if (exposureActivities.Count > 0) {
        setValueToRatio(exposureActivities.countWhere(\ a -> a.Escalated), exposureActivities.Count)
      }
    }
    return null
  }
}
