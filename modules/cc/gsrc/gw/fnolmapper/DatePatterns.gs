package gw.fnolmapper

/**
 * Constants for Date string patterns.
 */
@ReadOnly
class DatePatterns {

  public static final var XSD_DATE:String = "[0-9]{4}-[0-9]{2}-[0-9]{2}"
  public static final var XSD_YEAR:String = "[0-9]{4}"
  public static final var XSD_YEAR_MONTH:String = "[0-9]{4}-[0-9]{2}"
  
  private construct() {}

}
