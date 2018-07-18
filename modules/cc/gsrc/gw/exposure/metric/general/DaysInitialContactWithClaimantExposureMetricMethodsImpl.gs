package gw.exposure.metric.general
uses gw.api.exposure.metric.TimeBasedExposureMetricMethodsImpl
uses java.util.Date
uses gw.api.metric.MetricUpdateHelper
uses gw.api.database.Relop
uses gw.api.metric.FilteredArray

@Export
class DaysInitialContactWithClaimantExposureMetricMethodsImpl extends TimeBasedExposureMetricMethodsImpl {
  
  private var _contactClaimantPattern : ActivityPattern
  
  construct(DaysInitialContactWithClaimantExposureMetric : DaysInitialContactWithClaimantExposureMetric ) {
    super(DaysInitialContactWithClaimantExposureMetric)
  }

  override property get Metric() : DaysInitialContactWithClaimantExposureMetric {
    return super.Metric as DaysInitialContactWithClaimantExposureMetric
  }

  override function updateMetricValue(helper : MetricUpdateHelper) : Date {
    if (Metric.New or helper.updateContainsChangesOfType(Activity)) {
      var activities = findFirstContactWithClaimantActivities()
      if (activities.HasElements) {
        Metric.StartTime = Metric.getCreateTime(Metric.Exposure)
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
    handleExposureStateChange()
    return null
  }

  override property get ApplicableDisplayValue() : String {
    return Metric.IsOpen or Metric.Skipped or Metric.ActivitySkipped
            ? displaykey.Web.Claim.InitialContactWithClaimantExposureMetric.NoContactMade
            : super.ApplicableDisplayValue
  }
  
  private function findFirstContactWithClaimantActivities() : List<Activity> {
    return new FilteredArray<Activity>(Metric.Exposure.Claim, "Activities")
        .where("Claim", Relop.Equals, Metric.Exposure.Claim)
        .and("Exposure", Relop.Equals, Metric.Exposure)
        .and("ActivityPattern", Relop.Equals, ContactClaimantPattern)
        .orderedByAscending("CreateTime")
        .Contents
  }
  
  private function getFirstActivityInListWithClosedStatus(activities : List<Activity>, activityStatus : ActivityStatus) : Activity {
    return activities.where(\ a -> a.Status == activityStatus and a.CloseDate != null)
            .orderBy(\ a -> a.CloseDate)
            .first()
  }
  
  private property get ContactClaimantPattern() : ActivityPattern {
    if (_contactClaimantPattern == null ) {
      _contactClaimantPattern = ActivityPattern.finder.getActivityPatternByCode("contact_claimant") 
    }
    return _contactClaimantPattern
  }
}
