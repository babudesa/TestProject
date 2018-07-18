package gw.policy

uses java.util.concurrent.CountDownLatch
uses java.util.concurrent.ExecutorService
uses java.util.concurrent.Executors
uses java.lang.Runtime

/**
 * RefreshPolicyParallelThreadHelper helps with parallel execution if there are more than one processors
 * Threaded execution - all the available processors will be used
 * One processor handles one claim at a time
 */
class RefreshPolicyThreadHelper {

 private static var rlogger = com.guidewire.cc.system.logging.CCLoggerCategory.SERVER_BATCHPROCESS.Logger
 
 // do not use threaded execution
public static var NON_THREADED: String ="n";
// make execution parallel where it is possible.
public static var THREADED: String ="y";
	
private static var isThreaded : boolean =false
	
// gatekeeper for the threads - waits till all are finished
private static var latch: CountDownLatch =null
	
// for controlling thread pool
private static var executorService: ExecutorService=null
	
public static function getExecutorService() : ExecutorService {
	return executorService
}

public static function setExecutorService(executorServiceIn : ExecutorService) {
	RefreshPolicyThreadHelper.executorService = executorServiceIn
}

public static function initThreaded(userParameter: String){
	if (userParameter.equals(NON_THREADED)){
		 setThreaded(false)
	 }
	else {
		var processorNumber: int = Runtime.getRuntime().availableProcessors()
		if (processorNumber>1){
			rlogger.info("RefreshPolicy -> Concurrent execution with "+processorNumber+" processors initiated...")
			executorService=Executors.newFixedThreadPool(processorNumber)
			setThreaded(true)
		}
	}
}

public static function setThreaded(isThreadedIn: boolean) {
	RefreshPolicyThreadHelper.isThreaded = isThreadedIn
}

	/**
	 * Initiate the lock for the concurrent threads.
	 * When the latch reaches 0, all concurrent threads are completed
	 * and the non-concurrent execution can continue
	 * @param threadInUse
	 */
public static function setThreadInUse(threadInUse:int) {
	latch= new CountDownLatch(threadInUse)
}
	
	/**
	 * When one of the concurrent threads is completed, the latch is decreased.
	 */
public static function decrThreadInUse() {
	latch.countDown()
}
    
    /**
     * Wait till all concurrent threads are completed.
     * @throws InterruptedException
     */
public static function await() {
    	latch.await()
 }
    
public static function closeThreadPool() {
	if (executorService!=null){
	 executorService.shutdown()
	 rlogger.info("RefreshPolicy -> ThreadPool is closed.")
	}
   }
}