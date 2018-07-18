package gw.api.exposure.metric

uses java.lang.Integer
uses java.lang.Comparable
uses java.util.Date
uses gw.api.metric.DateCalculator
uses gw.api.metric.DateCalculators
uses gw.api.metric.TimeBasedMetricMethods

/**
 * Common superclass for time based exposure metrics. Most of the implementation
 * is delegated to GWTimeBasedMetricDelegateEnhancement
 */
@ReadOnly
class TimeBasedExposureMetricMethodsImpl extends ExposureMetricMethodsImpl implements TimeBasedMetricMethods {
  
  construct(timeBasedExposureMetric : TimeBasedExposureMetric) {
    super(timeBasedExposureMetric)
  }

  override public function updateMetricLimitReachedTimes() {
    Metric.updateMetricLimitReachedTimes(this)
  }

  override property get Metric() : TimeBasedExposureMetric {
    return super.Metric as TimeBasedExposureMetric
  }
    
  override property get Value() : Integer {
    return Metric.getValue(this)
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
  
  protected function handleExposureStateChange() {
    Metric.handleOwnerStateChange(this, Metric.Exposure.State == ExposureState.TC_OPEN, Metric.Exposure.CloseDate)
  }

  /**
   * Returns the calculator used by the metric for date calculations.
   * Default is BUSINESS.
   */
  override property get DateCalculator() : DateCalculator {
    return DateCalculators.BUSINESS
  }
  
  override property get BusinessCalendarAddress() : Address {
    return Metric.Exposure.Claim.LossLocation
  }
}