package gw.api.metric
uses java.util.Date
uses java.lang.Comparable
uses java.lang.UnsupportedOperationException

/**
 * Implementation of methods/properties common to all metrics. Unfortunately
 * we cannot use an abstract class as an entity delegate implementation even if
 * the corresponding entity is abstract so, for example, the delegate for 
 * ClaimMetric has to be non abstract even though nobody will ever create a
 * raw ClaimMetric (they'll always create a subclass). So many methods/properties
 * in this class have default implementations that throw "notSupported" rather
 * than being pure abstract methods.
 */
@ReadOnly
abstract class MetricMethodsImpl implements MetricMethods {

  construct() {
  }

  /**
   * Update method, called to update the metric. The standard implementation
   * calls the updateMetricValue method, which will be overridden by subclasses,
   * followed by the standard updateMetricLimitReachedTimes() method which will
   * take care of maintaining the limit reached time values used for reporting.
   */
  override function update(helper : MetricUpdateHelper) : Date {
    var result = updateMetricValue( helper )
    updateMetricLimitReachedTimes()
    return result
  }

  /**
   * The value of the metric
   */
  override property get Value() : Comparable {
    throw notSupported()
  }
  
  /**
   * Whether the limits are defined in ascending order, defaults to true.
   */
  override property get AscendingLimitOrder() : boolean {
    return true
  }

  /**
   * The limit value of the metric, defaults to just being the value
   */
  override property get LimitValue() : Comparable {
    return Value
  }

  /**
   * The limit for this metric
   */
  override property get Limit() : MetricLimitMethods {
    return null 
  }

  /**
   * Is the value applicable? An applicable value is displayed normally, a
   * non applicable value is typically displayed as some special string
   * such as N/A
   */
  property get Applicable() : boolean {
    return Value != null
  }
  
  /**
   * Default implementation of DisplayValue, calls ApplicableDisplayValue or
   * NotApplicableDisplayValue depending on whether the value is Applicable
   */
  override property get DisplayValue() : String {
    return Applicable ? ApplicableDisplayValue : NotApplicableDisplayValue
  }

  /**
   * Should be overridden by subclassers to display applicable values
   * appropriately
   */
  property get ApplicableDisplayValue() : String {
    throw notSupported()
  }

  /**
   * Display value for non applicable metrics, default implementation uses
   * a display key to display N/A
   */
  property get NotApplicableDisplayValue() : String {
    return displaykey.Web.NA
  }

  /**
   * Color in which to display metric value; default implementation calls
   * the overridable IsNegative property and uses red for negative values,
   * black for non negative
   */
  override property get DisplayColor() : String {
    return IsNegative ? "red" : "black"
  }

  /**
   * Displayable version of the target value for the metric. Default
   * implementation fetches the target value from the limit and formats
   * it using the overridable formatTargetValue method. Returns an empty
   * string if the limit or target value are null
   */
  override property get DisplayTargetValue() : String {
    var targetValue = Limit.TargetValue
    return targetValue != null ? formatTargetValue(targetValue) : ""
  }
  
  /**
   * Subclassers should override to indicate whether the metric value is
   * negative; used to determine the DisplayColor
   */
  property get IsNegative() : boolean {
    throw notSupported()
  }

  /**
   * Creates a default limit of the correct type for this metric. Used by the metric
   * limit infrastructure to create the list of default limits needed for the limits
   * administration UI
   */
  override function createDefaultLimit() : MetricLimitMethods {
    throw notSupported()
  }
  
  /**
   * Unit type used for this metric's limit; defaults to "numeric"
   */
  property get Unit() : MetricUnit {
    return "numeric"
  }

  /**
   * The current status of the metric - green, red, yellow etc. Default
   * implementation calculates status by comparing LimitValue with the
   * yellow and red values on the Limit
   */
  override property get Status() : MetricLimitStatus {
    var result = MetricLimitStatus.NONE
    if (Limit != null and (Limit.YellowValue != null or Limit.RedValue != null)) {
      var metricValue = LimitValue
      if (metricValue != null) {
        if(AscendingLimitOrder) {
          if (Limit.RedValue != null and metricValue >= Limit.RedValue) {
            result = RED
          } else if (Limit.YellowValue != null and metricValue >= Limit.YellowValue) {
            result = YELLOW
          } else {
            result = GREEN
          }
        } else {
          if (Limit.RedValue != null and metricValue <= Limit.RedValue) {
            result = RED
          } else if (Limit.YellowValue != null and metricValue <= Limit.YellowValue) {
            result = YELLOW
          } else {
            result = GREEN
          }
        }
      } else {
        result = INACTIVE
      }
    }
    return result
  }
  
  /**
   * Format the given target value for display to the user, used by
   * DisplayTargetValue
   */
  function formatTargetValue(targetValue : Comparable) : String {
    throw notSupported()
  }
  
  /**
   * Update the value of the metric; called by update to do subclass specific
   * update logic
   */
  function updateMetricValue(helper : MetricUpdateHelper) : Date {
    throw notSupported()
  }
  
  /**
   * Utility method for accessing the reach times via the MetricLimitTimeDelegate
   */
  abstract property get MetricAsMetricLimitTimeDelegate() : MetricLimitTimeDelegate

  /**
   * Checks the metric's current status against the status implied by the
   * metric limit reached times (ReachYellowTime and ReachRedTime) and then
   * update the limit reached times if they are inconsistent with the status
   */
  function updateMetricLimitReachedTimes() {
    var originalStatus = StatusImpliedByReachTimes
    if (originalStatus != Status) {
      var currentTime = Date.CurrentDate
      if (originalStatus != YELLOW and Status == RED) {
        setMetricLimitTimeValue(currentTime, currentTime)
      } else if (Status == RED) {
        MetricAsMetricLimitTimeDelegate.ReachRedTime = currentTime
      } else if (Status == YELLOW ) {
        setMetricLimitTimeValue(currentTime, null)
      } else {
        setMetricLimitTimeValue(null, null)
      }
    }
  }
  
  /**
   * Checks the current reach times on the metric and returns the status
   * implied by those time - for example if the red reach time is non null
   * assumes the status is red. This is not a reliable calculation - it cannot
   * tell if the status should be NONE, for example. But it is useful when
   * updating the reach times to correspond to the actual current status
   */
  property get StatusImpliedByReachTimes() : MetricLimitStatus {
    var result = MetricLimitStatus.GREEN
    if (MetricAsMetricLimitTimeDelegate.ReachRedTime != null) {
      result = RED
    } else if (MetricAsMetricLimitTimeDelegate.ReachYellowTime != null) {
      result = YELLOW
    }
    return result
  }

  /**
   * Utility for setting reach times
   */  
  function setMetricLimitTimeValue(yellowTime : Date, redTime : Date) {
    MetricAsMetricLimitTimeDelegate.ReachYellowTime = yellowTime
    MetricAsMetricLimitTimeDelegate.ReachRedTime = redTime
  }
  
  /**
   * Throws an UnsupportedOperationException; subclassers can override to
   * throw an exception with a more detailed message.
   */
  function notSupported() : UnsupportedOperationException {
    return new UnsupportedOperationException("Not Supported")
  }
}
