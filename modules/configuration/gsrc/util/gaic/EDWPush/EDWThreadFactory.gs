package util.gaic.EDWPush
uses java.util.concurrent.ThreadFactory
uses java.lang.Runnable
uses java.lang.Thread
uses java.util.concurrent.atomic.AtomicInteger

class EDWThreadFactory implements ThreadFactory {

var name =""
var threadNo = new AtomicInteger(0);
var counter=0

  construct(namee:String) {
    this.name= namee

  }

  override function newThread(p0 : Runnable) : Thread {
    //var threadName = name+":"+threadNo.incrementAndGet();
    counter=counter+1
    var threadName = name+":"+counter
    
     print("threadName:"+threadName);
     return new Thread(p0,threadName );
  }
  
  


}
