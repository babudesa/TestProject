package gw.xml.xsd.types

uses java.util.Calendar

class XSDGYearMonth extends AbstractXSDDateType
{

  public var _year : int as Year
  public var _month : int as Month

  private construct()
  {
    super( true, true, false, false )
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

