package gw.util
uses java.lang.Integer

class IntegerRange extends SteppedRange<Integer>
{
  construct(startRange : Integer, endRange : Integer)
  {
    this(startRange, endRange, 1)
  }

  construct(startRange : Integer, endRange : Integer, stepSize : Integer)
  {
    super(startRange, endRange, stepSize)
    if (_start > _end and _step >= 0) {
      _step = -_step //have to step backwards, but allows specification of the step size in the constructor as the absolute value
    }
    _current = _start - _step
  }

  override function hasNext() : boolean
  {
    return current != end
  }

  override function next() : Integer
  {
    if (current == end) {
      throw "Next passed end of range ( " + end + " )"
    }
    current = current + step
    return current
  }

  override function remove() : void
  {
    throw "Remove not supported by Range"
  }


  override function contains( what: Integer ) : boolean
  {
    if (step < 0) {
      return what <= start and what >= end and (((what-start) % step) == 0)
    } else {
      return what >= start and what <= end and (((what-start) % step) == 0)
    }
  }
}
