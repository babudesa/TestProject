package gw.util

abstract class SteppedRange<T> extends Range<T>
{
  protected var _step : T as step

  construct(startRange : T, endRange : T, stepIncrement : T)
  {
    super(startRange, endRange)
    _step = stepIncrement
  }
}
