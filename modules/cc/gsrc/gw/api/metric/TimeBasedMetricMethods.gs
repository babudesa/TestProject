package gw.api.metric

/**
 * Interface implemented by both claim and exposure time based metrics. This
 * interface allows the GWTimeBasedMetricDelegateEnhancement to implement
 * common code shared between both claim and exposure time based metrics, by
 * exposing the fields they have in common. Unfortunately we cannot use simple
 * subclassing to share this information because TimeBasedClaimMetricMethodsImpl
 * and TimeBasedExposureMetricMethodsImpl do not have a common superclass which
 * exposes their time related fields.
 */
@ReadOnly
interface TimeBasedMetricMethods extends MetricMethods {

  /**
   * The date calculator used to add and find the difference between dates
   */
  property get DateCalculator() : DateCalculator
  
  /**
   * Accessor for the delegate containing the metric limit reach times
   */
  property get MetricAsMetricLimitTimeDelegate() : MetricLimitTimeDelegate
  
  /**
   * Address to use for business calendar calculations
   */
   property get BusinessCalendarAddress() : Address
}
