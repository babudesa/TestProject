package gw.xml.xsd.types

uses java.util.Calendar

class XSDGYear extends AbstractXSDDateType
{

  public var _year : int as Year

  private construct()
  {
    super( true, false, false, false )
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

