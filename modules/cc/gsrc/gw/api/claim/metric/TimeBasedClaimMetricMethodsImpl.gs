package gw.api.claim.metric
uses java.lang.Integer
uses java.lang.Comparable
uses java.util.Date
uses gw.api.metric.DateCalculator
uses gw.api.metric.DateCalculators
uses gw.api.metric.TimeBasedMetricMethods

/**
 * Common superclass for time based claim metrics. Most of the implementation
 * is delegated to GWTimeBasedMetricDelegateEnhancement
 */
@ReadOnly
class TimeBasedClaimMetricMethodsImpl extends ClaimMetricMethodsImpl implements TimeBasedMetricMethods {
 
  construct(timeBasedClaimMetric : TimeBasedClaimMetric, category : ClaimMetricCategory) {
    super(timeBasedClaimMetric, category)
  }
  
  construct(timeBasedClaimMetric : TimeBasedClaimMetric) {
    this(timeBasedClaimMetric, "OverallClaimMetrics")
  }

  override public function updateMetricLimitReachedTimes() {
    Metric.updateMetricLimitReachedTimes(this)
  }

  override property get Metric() : TimeBasedClaimMetric {
    return super.Metric as TimeBasedClaimMetric
  }
    
  override property get Value() : Integer {
    return Metric.getValue(this)
  }
  
  override property get AscendingLimitOrder() : boolean {
    return true  
  }
  
  override property get ApplicableDisplayValue() : String {
    return Metric.getApplicableDisplayValue(Value)
  }

  override property get IsNegative() : boolean {
    return Value < 0
  }

  override function formatTargetValue(targetValue : Comparable) : String {
    return Metric.getApplicableDisplayValue(targetValue as Integer)
  }
  
  override property get Unit() : MetricUnit {
    return "days"
  }

  protected function close(finalTime : Date) {
    Metric.close(this, finalTime)
  }
  
  protected function handleClaimStateChange() {
    Metric.handleOwnerStateChange(this, Metric.Claim.State == ClaimState.TC_OPEN, Metric.Claim.CloseDate)
  }

  /**
   * Returns the calculator used by the metric for date calculations.
   * Default is BUSINESS.
   */
  override property get DateCalculator() : DateCalculator {
    return DateCalculators.BUSINESS
  }
  
  override property get BusinessCalendarAddress() : Address {
    return Metric.Claim.LossLocation
  }

  /**
   * Most claim time based metrics rely on the ReportedDate as their start date
   * and need to be updated if it changes
   */
  property get ReportedDateChanged() : boolean {
    return Metric.Claim.isFieldChanged("ReportedDate")
  }
}
