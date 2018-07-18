package gw.command

@Export
class Clock extends BaseCommand {

  construct() {
    super();
  }
  
  function addDays() : String  {
    return addDays(Argument as int) 
  }

  function addWeeks() : String  {
    return addWeeks(Argument as int)
  }

  function addMonths() : String {
    return addMonths(Argument as int)
  }
  
  function withDefault() : String {
    return "Today is: " + CurrentDate
  }
    
  function withOneMoreMonth(): String {
    return addMonths(1)
  }
  
  function withOneMoreDay(): String {
    return addDays(1)
  }
  
  function withOneMoreWeek(): String {
    return addDays(7)
  }
}
