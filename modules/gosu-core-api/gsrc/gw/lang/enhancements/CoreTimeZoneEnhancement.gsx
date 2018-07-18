package gw.lang.enhancements

uses java.util.TimeZone

enhancement CoreTimeZoneEnhancement : TimeZone
{

  static property get GMT() : TimeZone
  {
    return TimeZone.getTimeZone( "GMT" ) 
  }
  
}
