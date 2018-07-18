package gw.lang.enhancements
uses java.util.*
uses gw.config.CommonServices

enhancement CoreDateEnhancement : Date
{
    
  static property get Today() : Date
  { 
    var cal = CommonServices.getEntityAccess().CurrentTime.toCalendar()
    cal.CalendarMillisecond = 0
    cal.CalendarSecond = 0
    cal.CalendarMinute = 0
    cal.CalendarHourOfDay = 0
    return cal.Time
  }

  static property get Yesterday() : Date
  {
    var cal = Today.toCalendar()
    cal.add( Calendar.DATE, -1 )
    return cal.getTime()
  }

  static property get Tomorrow() : Date
  {
    var cal = Today.toCalendar()
    cal.add( Calendar.DATE, 1 )
    return cal.getTime()
  }

  /**
   * Returns a new Calendar representing this Date in the system TimeZone and Locale.
   */
  function toCalendar() : Calendar {
    var cal = Calendar.getInstance()
    cal.setTime( this )
    return cal
  }

  /**
   * Returns a new Calendar representing this Date in the specified TimeZone and the system Locale.
   */
  function toCalendar(tz : TimeZone) : Calendar {
    var cal = Calendar.getInstance(tz)
    cal.setTime( this )
    return cal
  }

  /**
   * Returns a new Calendar representing this Date in the specified Locale and the system TimeZone.
   */
  function toCalendar(locale : Locale) : Calendar {
    var cal = Calendar.getInstance(locale)
    cal.setTime( this )
    return cal
  }

  /**
   * Returns a new Calendar representing this Date in the specified TimeZone and Locale.
   */
  function toCalendar(tz : TimeZone, locale : Locale) : Calendar {
    var cal = Calendar.getInstance(tz, locale)
    cal.setTime( this )
    return cal
  }

}