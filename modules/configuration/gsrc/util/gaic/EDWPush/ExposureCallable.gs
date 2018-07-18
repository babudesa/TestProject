package util.gaic.EDWPush
uses java.util.concurrent.Callable
uses java.lang.Exception

class ExposureCallable implements Callable<ExposureThreadExecutor> {
  
var r: ExposureThreadExecutor;
  construct(r1:ExposureThreadExecutor) {
    this.r=r1
  }

  override function call() : ExposureThreadExecutor {
    try {
    r.run()
    }catch (e:Exception ) {
      throw e
    }
    return this.r
    
  }


  
}
