package gw.claim.metric.general
uses gw.api.claim.metric.TimeBasedClaimMetricMethodsImpl
uses java.util.Date
uses gw.api.metric.MetricUpdateHelper
uses gw.api.metric.FilteredArray
uses gw.api.database.Relop

@Export
class DaysInitialContactWithInsuredClaimMetricMethodsImpl extends TimeBasedClaimMetricMethodsImpl{
  
  private var _contactInsuredPattern : ActivityPattern
  
  construct(daysInitialContactWithInsuredClaimMetric : DaysInitialContactWithInsuredClaimMetric ) {
    super(daysInitialContactWithInsuredClaimMetric, "OverallClaimMetrics")
  }

  override property get Metric() : DaysInitialContactWithInsuredClaimMetric {
    return super.Metric as DaysInitialContactWithInsuredClaimMetric
  }

  override function updateMetricValue(helper : MetricUpdateHelper) : Date {
    if (Metric.New or helper.updateContainsChangesOfType(Activity) or ReportedDateChanged) {
      var activities = findFirstContactWithInsuredActivities()
      if (activities.HasElements) {
        Metric.StartTime = Metric.Claim.ReportedDate
        var firstCompleted = getFirstActivityInListWithClosedStatus(activities, "complete")
        if (firstCompleted != null) {
          close(firstCompleted.CloseDate)
          Metric.ActivitySkipped = false
        } else {
          var firstSkipped = getFirstActivityInListWithClosedStatus(activities, "skipped")
          if (firstSkipped != null) {
            close(firstSkipped.CloseDate)
            Metric.ActivitySkipped = true
          }
        }
      } else {
        Metric.StartTime = null
      }
    }
    handleClaimStateChange()
    return null
  }

  override property get ApplicableDisplayValue() : String {
    return Metric.IsOpen or Metric.Skipped or Metric.ActivitySkipped
            ? displaykey.Web.Claim.InitialContactWithInsuredClaimMetric.NoContactMade
            : super.ApplicableDisplayValue
  }
  
  private function findFirstContactWithInsuredActivities() : List<Activity> {
    return new FilteredArray<Activity>(Metric.Claim, "Activities")
        .and("Matter", Relop.Equals, null)
        .and("Exposure", Relop.Equals, null)
        .and("ClaimContact", Relop.Equals, null)
        .and("ActivityPattern", Relop.Equals, ContactInsuredPattern)
        .orderedByAscending("CreateTime")
        .Contents
  }
  
  private function getFirstActivityInListWithClosedStatus(activities : List<Activity>, activityStatus : ActivityStatus) : Activity {
    return activities.where(\ a -> a.Status == activityStatus and a.CloseDate != null)
            .orderBy(\ a -> a.CloseDate)
            .first()
  }

  private property get ContactInsuredPattern() : ActivityPattern {
    if (_contactInsuredPattern == null ) {
      _contactInsuredPattern = ActivityPattern.finder.getActivityPatternByCode("contact_insured") 
    }
    return _contactInsuredPattern
  }
}
