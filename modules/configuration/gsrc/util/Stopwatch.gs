package util
uses java.lang.System
uses java.util.Map
uses java.lang.Double
uses java.lang.StringBuilder
uses java.util.LinkedHashMap

class Stopwatch {
  private var _start : long
  private var _splits : Map<String, Double> as Splits
  private var _subject : String
  
  construct(subject : String) {
    _start = System.currentTimeMillis()
    _splits = new LinkedHashMap<String, Double>(10)
    _subject = subject
  }
  
  property get ElapsedTime() : double {
    var rightNow = System.currentTimeMillis()
    return (rightNow - _start) / 1000.0
  }
  
  function addToSplits(eventName : String){
    _splits.put(eventName, ElapsedTime) 
  }
  
  override function toString() : String {
    var sb = new StringBuilder()
    sb.append("Stopwatch results for " + _subject + "\r\n")
    for(split in _splits.entrySet()){
      sb.append(split.Key + ": " + split.Value + "\r\n")
    }
    
    return sb.toString()
  }
}
