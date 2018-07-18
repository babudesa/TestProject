package gw.xml.xsd.types

uses java.util.Calendar

class XSDGMonth extends AbstractXSDDateType
{

  public var _month : int as Month

  private construct()
  {
    super( false, true, false, false )
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
