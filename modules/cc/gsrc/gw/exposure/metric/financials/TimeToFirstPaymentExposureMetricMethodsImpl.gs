package gw.exposure.metric.financials
uses gw.api.exposure.metric.TimeBasedExposureMetricMethodsImpl
uses java.util.Date
uses gw.api.metric.MetricUpdateHelper
uses gw.api.database.Query

@Export
class TimeToFirstPaymentExposureMetricMethodsImpl extends TimeBasedExposureMetricMethodsImpl {

  construct(timeToFirstPaymentExposureMetric : TimeToFirstPaymentExposureMetric) {
    super(timeToFirstPaymentExposureMetric)
  }
  
  override function updateMetricValue(helper : MetricUpdateHelper) : Date {
    var exposure = Metric.Exposure
    if (Metric.StartTime == null) {
      Metric.StartTime = Metric.getCreateTime(exposure)
    }
    
    if (Metric.New) {
      var earliestSubmitTime = getEarliestSubmitTime()
      if (earliestSubmitTime != null) {
        close(earliestSubmitTime)
      }
    } else if (helper.updateContainsChangesOfType(Payment) and Metric.IsOpen) {
      //get all the escalated claim cost payments sorted by createtime
      //use the first created payment's createtime as the eventime
      //mark metric as inactive
      var newSubmitTime = getEarliestSubmitTimeFromBundle()
      if (newSubmitTime != null) {
        close(newSubmitTime)
      }
    }
    
    handleExposureStateChange()
    return null
  }
  
  override property get ApplicableDisplayValue() : String {
    return Metric.IsOpen or Metric.Skipped
            ? displaykey.Web.Claim.TimeToFirstPaymentExposureMetric.NoPaymentMade
            : super.ApplicableDisplayValue
  }
  
  private function getEarliestSubmitTime() : Date {
    var payment = Query.make(Payment).compareIn("Payment.Status", {TransactionStatus.TC_SUBMITTING, TransactionStatus.TC_SUBMITTED})
                                                 .compare("CostType", Equals, CostType.TC_CLAIMCOST)
                                                 .compare("Exposure", Equals, Metric.Exposure)
                                                 .join("Payment.Check").compare("Check.ScheduledSendDate", NotEquals, null)
                                                 .select().orderBy(\ p -> p.Check.ScheduledSendDate)
                                                 .FirstResult
    var date : Date
    if (payment != null) {
      date = payment.Check.ScheduledSendDate
    }
    var dateFromBundle = getEarliestSubmitTimeFromBundle()
    if (date == null  or dateFromBundle < date) {
      date = dateFromBundle
    }
    return date
  }

  private function getEarliestSubmitTimeFromBundle() : Date { 
    var payments = Metric.Exposure.Bundle.getInsertedAndUpdatedBeansOfType( Payment )
                        .where( \ p -> (p.Status == TransactionStatus.TC_SUBMITTING or p.Status == TransactionStatus.TC_SUBMITTED)
                                       and p.CostType == CostType.TC_CLAIMCOST 
                                       and p.Check.ScheduledSendDate != null
                                       and p.Exposure == Metric.Exposure)
                        .orderBy( \ p -> p.Check.ScheduledSendDate)
    if (payments.Count > 0) {
      return payments.first().Check.ScheduledSendDate
    } else { 
      return null
    }
  }
}
