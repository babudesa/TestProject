package gw.claim.metric.activity
uses gw.api.claim.metric.TimeBasedClaimMetricMethodsImpl
uses java.util.Date
uses gw.api.metric.MetricUpdateHelper
uses gw.api.metric.FilteredArray

@Export
class DaysLastViewedBySupervisorClaimMetricMethodsImpl extends TimeBasedClaimMetricMethodsImpl {

  construct(daysLastViewedBySupervisorClaimMetric : DaysLastViewedBySupervisorClaimMetric) {
    super(daysLastViewedBySupervisorClaimMetric, "ClaimActivityMetrics")
  }
 
  override function updateMetricValue(helper : MetricUpdateHelper) : Date {
    // checks if the assigned group on the claim has been changed
    var supervisorChanged = getOriginalGroup().Supervisor != Metric.Claim.AssignedGroup.Supervisor
    if (supervisorChanged) {
      Metric.IntegerValue = null
      Metric.StartTime = null
    }
    if ((Metric.New or supervisorChanged or helper.updateContainsChangesOfType(History))
        and Metric.Claim.AssignedGroup != null) {
      Metric.StartTime = getLastViewedDate()
    }
    handleClaimStateChange()
    return null
  }

  private function getLastViewedDate() : Date {
    var filteredHistoryArray = new FilteredArray<History>(Metric.Claim, "History")
      .where("Type", Equals, HistoryType.TC_VIEWING)
      .and("User", Equals, Metric.Claim.AssignedGroup.Supervisor)
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

  private function getOriginalGroup() : Group {
    var groupID = Metric.Claim.getOriginalValue("AssignedGroup")
    if(groupID != null) {
      return find (g in Group where g.ID == groupID).getFirstResult()      
    }
    return null
  }
}
