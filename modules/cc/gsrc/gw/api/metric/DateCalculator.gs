package gw.api.metric
uses java.lang.Integer
uses java.util.Date

/**
 * Used by time based metrics to calculate date values according to a business
 * calendar or a simple calendar
 */
@ReadOnly
interface DateCalculator {

  /**
   * Add the given number of days to the start date, taking into account the
   * given location (which may be used to select an appropriate business calendar)
   */
  function addDays(startDate : Date, days : Integer, location : Address) : Date

  /**
   * Days between the given fromDate and toDate, taking into account the
   * given location (which may be used to select an appropriate business calendar)
   */
  function daysBetween(fromDate : Date, toDate : Date, location : Address) : Integer
}
