package gw.command

uses com.guidewire.pl.web.navigation.Location;
uses java.util.Date;
uses gw.api.util.DisplayableException
uses gw.transaction.Bundle
uses gw.api.tools.TestingClock

class BaseCommand {

  var _location : Location;
  var _argument : String;
  protected var randomNumber : String;
  
  construct() {
    randomNumber = CurrentDate.Time as java.lang.String
  }
  
  public property set TopLocation(location : Location) {
    _location = location;
  }

  public property get Bundle() : Bundle {
    return TopLocation.UnsafeBundle
  }
  
  public property get TopLocation() : Location {
    return _location;
  }
  
  public property set Argument(arg : String) {
    _argument = arg;
  }
  
  public property get Argument() : String {
    return _argument;
  }
  
  property get CurrentDate() : Date {
    return Date.CurrentDate;
  }
  
  function nextID() : String{
    return CurrentDate.Time as java.lang.String
  }

  function displayMessageAndExit(message : String) {
    throw new DisplayableException(message)
  }
  
  function addMonths(count : Number) : String {
    return setDate(CurrentDate.addMonths(count as int))
  }
  
  function addDays(count : Number) : String {
    return setDate(CurrentDate.addDays(count as int))
  }
  
  function addWeeks(count : Number) : String {
    return setDate(CurrentDate.addWeeks(count as int))
  }
  
  function setDate(newDate : Date) : String {
    TestingClock.setDateTime( newDate )
    return "Today is: " + CurrentDate
  }
  
  function gotoEndOfMonth() {
    var lastDay = new org.joda.time.DateTime().dayOfMonth().MaximumValue
    if(CurrentDate.DayOfMonth != lastDay) {
      var fromDate = new org.joda.time.DateTime(CurrentDate)
      var fromDay = fromDate.getDayOfMonth()
      if (fromDay >= lastDay) {
        fromDate = fromDate.plusMonths(1)
      }
      var maxDay = fromDate.dayOfMonth().getMaximumValue()
      fromDate = fromDate.withDayOfMonth(maxDay > lastDay ? lastDay : maxDay)
      setDate(fromDate.toDate())
    }
  }  
}
