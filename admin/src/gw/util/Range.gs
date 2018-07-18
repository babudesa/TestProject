package gw.util
uses java.util.Iterator

abstract class Range<T> implements Iterator<T>
{
  protected var _start : T as start
  protected var _end : T as end
  protected var _current : T as current

  construct(startRange : T, endRange : T)
  {
    _start = startRange
    _end = endRange
    _current = startRange
  }
  
  abstract function contains( what : T) : boolean
}
