package gw.xml.xsd.types

uses java.util.Calendar

class XSDGDay extends AbstractXSDDateType
{

  public var _day : int as Day

  private construct()
  {
    super( false, false, true, false )
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

