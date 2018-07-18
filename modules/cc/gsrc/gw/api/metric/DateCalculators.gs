package gw.api.metric
uses java.lang.Integer
uses java.util.Date

/**
 * Singleton date calculators used by time based metrics
 */
@Export
class DateCalculators {

  /** Calculator that uses the business calandar indicated by location arguments */
  public static var BUSINESS : DateCalculator = new DateCalculator() {

    override function addDays(startDate : Date, days : Integer, location : Address) : Date {
      return startDate.addBusinessDays(days, location).trimToMidnight()
    }

    override function daysBetween(fromDate : Date, toDate : Date, location : Address) : Integer {
      return fromDate.businessDaysBetween(toDate, location)
    }

  }

  /** Simple calculator using normal, non business calandar, location arguments are ignored */
  public static var CALENDAR : DateCalculator = new DateCalculator() {

    override function addDays(startDate : Date, days : Integer, location : Address) : Date {
      return startDate.addDays(days).trimToMidnight()
    }

    override function daysBetween(fromDate : Date, toDate : Date, location : Address) : Integer {
      return fromDate.daysBetween(toDate)
    }

  }

  private construct() {
  }
}
