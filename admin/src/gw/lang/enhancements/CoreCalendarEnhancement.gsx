package gw.lang.enhancements

uses java.util.Calendar

enhancement CoreCalendarEnhancement : java.util.Calendar
{
  property get CalendarEra() : int
  {
    return this.get(Calendar.ERA)
  }

  property set CalendarEra(value : int)
  {
    this.set( Calendar.ERA, value )
  }

  property get CalendarYear() : int
  {
    return this.get(Calendar.YEAR)
  }

  property set CalendarYear(value : int)
  {
    this.set( Calendar.YEAR, value )
  }

  property get CalendarMonth() : int
  {
    return this.get(Calendar.MONTH)
  }

  property set CalendarMonth(value : int)
  {
    this.set( Calendar.MONTH, value )
  }

  property get CalendarDay() : int
  {
    return this.get(Calendar.DAY_OF_MONTH)
  }

  property set CalendarDay(value : int)
  {
    this.set( Calendar.DAY_OF_MONTH, value )
  }

  property get CalendarHourOfDay() : int
  {
    return this.get(Calendar.HOUR_OF_DAY)
  }

  property set CalendarHourOfDay(value : int)
  {
    this.set( Calendar.HOUR_OF_DAY, value )
  }

  property get CalendarMinute() : int
  {
    return this.get(Calendar.MINUTE)
  }

  property set CalendarMinute(value : int)
  {
    this.set( Calendar.MINUTE, value )
  }

  property get CalendarSecond() : int
  {
    return this.get(Calendar.SECOND)
  }

  property set CalendarSecond(value : int)
  {
    this.set( Calendar.SECOND, value )
  }

  property get CalendarMillisecond() : int
  {
    return this.get(Calendar.MILLISECOND)
  }

  property set CalendarMillisecond(value : int)
  {
    this.set( Calendar.MILLISECOND, value )
  }
}