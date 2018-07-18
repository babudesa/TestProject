package gw.api.metric
uses java.util.Date
uses java.lang.Comparable

/**
 * Interface implemented by all claim and exposure metrics. This interface will be implemented by
 * a Gosu delegate of the appropriate class for the particular claim or exposure metric subtype.
 */
@ReadOnly
interface MetricMethods {

  /**
   * This function is called to update the metric when something on the related Claim or Exposure
   * changes. The implementation should check if the change affects the value of the metric and,
   * if so, should update the metric values accordingly. This method will be called frequently so
   * it should try to do as little work as possible, particularly if nothing relevant has changed.
   * When creating a new metric, subclassers typically override updateMetricValue rather than
   * overriding update directly. The MetricMethodsImpl base class implements update by calling
   * updateMetricValue and then doing some standard housekeeping that is required by all metrics.
   * <p>
   * The updateMetricValue implementation, in the Gosu delegate, will have access to the owning
   * Claim or *Exposure via the metric object, which is passed to the delegate when it is created.
   * <p>
   * The helper object passed as an argument provides a quick way to determine of any objects
   * of a particular type have changed as part of the current update. For example, a
   * metric that tracks activities might not need to do anything in its update method if
   * no activities have changed. Such a metric could use helper.updateContainsChangesOfType(Activity)
   * to decide whether to do anything.
   * <p>
   * The return value of update is usually null. It is non null for metrics which need to be
   * recalculated at intervals, even if nothing changes. Such metrics should implement the
   * gw.api.claim.metric.RecalculateMetric interface, which has a recalculate() method that is
   * called to recalculate the metric. The return value of update should be the time at which
   * the metric will next be recalculated. The recalculation is done by a batch process, so it
   * will not happen at exactly the returned time. But the value does help the batch process
   * decide which claims have metrics (whether claim or exposure metrics) that could be out of date.
   */
  function update(helper : MetricUpdateHelper) : Date

  /**
   * The value of the metric. The type of the value varies according to the metric subtype. It
   * may return null - usually this means that the metric is not applicable at the moment.
   */
  property get Value() : Comparable
  
  /**
   * Whether the limit values are defined in ascending or descending order. If the yellow value 
   * can be less than the red value, this should be set to true. If the yellow value can be greater than 
   * the red value, this should be set to false.
   */
  property get AscendingLimitOrder() : boolean 

  /**
   * The limit value of the metric that determines what status icon is shown. The type of the 
   * value varies according to the metric subtype. It may return null - usually this means that 
   * the metric is not applicable at the moment. The LimitValue is usually equal to the Value
   * but a few metrics behave differently - for example the days to first contact metric. This
   * is 
   */
  property get LimitValue() : Comparable

  /**
   * A string containing the metric value, formatted for display to the user. For example a money
   * metric would format its value using the appropriate currency and decimal format.
   */
  property get DisplayValue() : String
  
  /*
   * A string containing the font display color for the metric. For example a negative value should
   * be displayed in red, while all other values should be displayed in black. 
   */
  property get DisplayColor() : String
  
  /**
   * A string containing the target value for the metric, formatted for display to the user
   */
  property get DisplayTargetValue() : String
  
  /**
   * The current status of the metric - green, red, yellow etc.
   */
  property get Status() : MetricLimitStatus

  /**
   * The limit for the metric, used to calculate the status of the metric
   */
  property get Limit() : MetricLimitMethods

  /**
   * Creates a default limit of the correct type for this metric. Used by the metric
   * limit infrastructure to create the list of default limits needed for the limits
   * administration UI
   */
  function createDefaultLimit() : MetricLimitMethods

  /**
   * Look up the limit for this metric - used to initialize the Limit property. Looks
   * up the PolicyTypeMetricLimits entity and finds the appropriate metric limit by
   * policy type. May return null if no appropriate limit is found.
   */
  function findLimit() : MetricLimitMethods
}
