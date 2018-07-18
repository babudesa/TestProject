package gw.claim.metric.activity
uses java.util.Date
uses gw.api.claim.metric.PercentClaimMetricMethodsImpl
uses gw.api.metric.MetricUpdateHelper
uses gw.api.metric.FilteredArray
uses gw.api.database.Relop

@Export
class PercentEscalatedActivitiesClaimMetricMethodsImpl extends PercentClaimMetricMethodsImpl {

  construct(percentageOfEscalatedActivitiesClaimMetric: PercentEscalatedActivitiesClaimMetric ) {
    super(percentageOfEscalatedActivitiesClaimMetric, "ClaimActivityMetrics")
  }
  
  override function updateMetricValue(helper : MetricUpdateHelper) : Date {
    if (helper.updateContainsChangesOfType(Activity) or Metric.New) {
      var totalActivitiesCount = new FilteredArray<Activity>(Metric.Claim, "Activities").Count
      if(totalActivitiesCount != 0) {
        var escalatedActivitiesCount = new FilteredArray<Activity>(Metric.Claim, "Activities")
          .where("Escalated", Relop.Equals, true)
          .Count
        setValueToRatio(escalatedActivitiesCount, totalActivitiesCount)
      }
    }
    return null
  }
  
}
