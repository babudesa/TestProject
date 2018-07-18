package gw.xml.xsd.types

uses java.util.Calendar

class XSDDate extends AbstractXSDDateType
{

  public var _year : int as Year
  public var _month : int as Month
  public var _day : int as Day

  private construct()
  {
    super( true, true, true, false )
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

