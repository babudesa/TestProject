package gw.lang.enhancements

uses java.lang.Integer
uses gw.util.IntegerRange

enhancement CoreIntegerEnhancement : Integer
{
  /**
  * Get a range of integers [start,end] 
  */
  static function range( start : Integer, end : Integer ) : IntegerRange
  {
    return new IntegerRange(start, end)
  }
  
  /**
  * Get a range of integers [start,end] with increments between of size step
  * Start is inclusive, end is not.
  * Note that start is guaranteed to be in the range, but because of step, end might not be
  */
  static function range( start : Integer, end : Integer, step : Integer) : IntegerRange
  {
    return new IntegerRange(start, end, step)
  }

  property get Even() : boolean {
    return this % 2 == 0
  }
  
  property get Odd() : boolean {
    return not Even
  }

}
