package gw.xml.xsd.types

uses java.util.Calendar
uses java.math.BigDecimal

class XSDTime extends AbstractXSDDateType
{

  public var _hour : int as Hour
  public var _minute : int as Minute
  public var _second : BigDecimal as Second

  private construct()
  {
    super( false, false, false, true )
  }

  construct( s : String )
  {
    this()
    parseString( s )
  }

  construct( cal : Calendar, useTimeZone : boolean )
  {
    this()
    getCalendarFields( cal, useTimeZone )
  }

}
