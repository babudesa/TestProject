package gw.claim.metric.activity
uses gw.api.claim.metric.TimeBasedClaimMetricMethodsImpl
uses java.util.Date
uses gw.api.metric.MetricUpdateHelper
uses gw.api.metric.FilteredArray

@Export
class DaysLastViewedByAdjusterClaimMetricMethodsImpl extends TimeBasedClaimMetricMethodsImpl {

  construct(daysLastViewedByAdjusterClaimMetric : DaysLastViewedByAdjusterClaimMetric) {
    super(daysLastViewedByAdjusterClaimMetric, "ClaimActivityMetrics")
  }
  
  override function updateMetricValue(helper : MetricUpdateHelper) : Date {
    var assignedUserChanged = Metric.Claim.isFieldChanged("AssignedUser")
    if (assignedUserChanged) {
      Metric.IntegerValue = null
      Metric.StartTime = null
    }
    if (Metric.New or assignedUserChanged or helper.updateContainsChangesOfType(History)) {
      Metric.StartTime = getLastViewedDate()
    }
    handleClaimStateChange()
    return null
  }
  
  private function getLastViewedDate() : Date {
    var filteredHistoryArray = new FilteredArray<History>(Metric.Claim, "History")
            .where("Type", Equals, HistoryType.TC_VIEWING)
            .and("User", Equals, Metric.Claim.AssignedUser)
            .orderedByDescending("EventTimestamp")
    
    if(Metric.Claim.CloseDate != null) {
      filteredHistoryArray.and("EventTimestamp", LessThan, Metric.Claim.CloseDate)
    }

    var mostRecent = filteredHistoryArray.first()
    if (mostRecent != null) {
      return mostRecent.EventTimestamp
    }
    return null
  }
}

