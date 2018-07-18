package gw.claim.metric.activity
uses gw.api.claim.metric.IntegerClaimMetricMethodsImpl
uses java.util.Date
uses gw.api.metric.MetricUpdateHelper
uses gw.api.metric.FilteredArray
uses gw.api.database.Relop

@Export
class AllEscalatedActivitiesClaimMetricMethodsImpl extends IntegerClaimMetricMethodsImpl {
  construct(allEscalatedActivitiesClaimMetric : AllEscalatedActivitiesClaimMetric ) {
    super(allEscalatedActivitiesClaimMetric, "ClaimActivityMetrics")
  }

  override function updateMetricValue(helper : MetricUpdateHelper) : Date {
    if (helper.updateContainsChangesOfType(Activity) or Metric.New) {
      Metric.IntegerValue = new FilteredArray<Activity>(Metric.Claim, "Activities")
        .where("Escalated", Relop.Equals, true)
        .Count
    }
    return null
  }
}
