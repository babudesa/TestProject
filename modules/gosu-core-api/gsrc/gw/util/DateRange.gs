package gw.util
uses java.util.Date
uses java.util.Iterator
uses java.util.Calendar

class DateRange extends Range<Date>
{
  var _incr : block(current:Date):Date
  var _incrAmt : int
  
  construct( startDate : Date, endDate : Date )
  {
    super(startDate, endDate)
    _incrAmt = startDate < endDate ? 1 : -1
    _start = startDate
    _current = startDate
    _end = endDate
    byDay() //default to incrementing by day
  }

  override function hasNext() : boolean
  {
    if( _incrAmt == 1 ) {
      return current <= end
    } else {
      return current >= end
    }
  }

  override function next() : Date
  {
    var returnVal = current
    current = _incr( current ) 
    return returnVal
  }

  override function remove() : void
  {
    throw "Not implemented"
  }

  function byYear() : Iterator<Date>
  {
    _incr = \ d -> incrDate( d, Calendar.YEAR, _incrAmt )
    return this
  }
  
  function byMonth() : Iterator<Date>
  {
    _incr = \ d -> incrDate( d, Calendar.MONTH, _incrAmt )
    return this
  }
  
  function byWeek() : Iterator<Date>
  {
    _incr = \ d -> incrDate( d, Calendar.WEEK_OF_YEAR, _incrAmt )
    return this
  }
  
  final function byDay() : Iterator<Date>
  {
    _incr = \ d -> incrDate( d, Calendar.DATE, _incrAmt )
    return this
  }
  
  function byHour() : Iterator<Date>
  {
    _incr = \ d -> incrDate( d, Calendar.HOUR, _incrAmt )
    return this
  }
  
  function byMinute() : Iterator<Date>
  {
    _incr = \ d -> incrDate( d, Calendar.MINUTE, _incrAmt )
    return this
  }  
  
  protected function setIncr( b : block(Date):Date ) {
    _incr = b
  }
  
  protected property get IncrementAmount() : int {
    return _incrAmt
  }
  
  private function incrDate( d : Date, field : int, amt : int ) : Date {
    var cal = Calendar.getInstance()
    cal.setTime( d )
    cal.add( field, amt )
    return cal.Time
  }
  
  override function contains( d : Date ) : boolean
  {
    return (start <= d and d <= end) or
           (end <= d and d <= start)
  }
  
}
