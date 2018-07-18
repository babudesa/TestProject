package gw.policy

uses com.guidewire.commons.entity.Key
uses gw.api.policy.ClaimPolicySetPolicyUtil
uses gw.policy.RetiredPolicyGraphDisconnecterExample

uses java.lang.Thread
uses java.lang.Exception
uses java.lang.System
uses java.text.DecimalFormat


/**
 * RefreshPolicyParallelThreadHelper helps with parallel execution if there are more than one processors
 * Threaded execution - all the available processors will be used
 * One processor handles one claim at a time
 */
class RefreshPolicyClaimThread extends Thread {

 private static var rlogger = com.guidewire.cc.system.logging.CCLoggerCategory.SERVER_BATCHPROCESS.Logger
 private static var threadCount: int =1	
 private static var errorCount: int=0
 static var dFormat :DecimalFormat = new DecimalFormat("#.##")

 private var _claimID: Key
 private var _claimIndex: int =0
 private static var _claimCount: String=""
 private var _currentUser: User
/**
 * claimID is the key to the claim with the policy to be refreshed
 * claimCount is needed for allowing to follow the progress of the processing in the log file
 * currentUser is needed for the bundle
 */	
protected construct( claimID: Key, claimIndex: int,claimCountIn: int, currentUser: User) {
	super("RefreshPolicyParallelThread" + threadCount); // Store the thread name
	threadCount++
	_claimID=claimID
	_claimIndex=claimIndex
	_claimCount=""+claimCountIn
	_currentUser=currentUser
	}

override public function toString() : String {
		return "#" + getName() +" "//+_claimNumber
	}

override public function run() {
		
	try {
		//rlogger.info("************** "+_claimNumber);
		refreshPolicyForClaim(_claimID,_claimIndex)
	}
	catch (e: Exception){
		rlogger.error("RefreshPolicyThread: "+e.getClass()+" "+e.getMessage())
		rlogger.error ("RefreshPolicyThread: "+e.getMessage())
		//e.printStackTrace()
		}
	finally {
		// decrease threadcount in controller
		RefreshPolicyThreadHelper.decrThreadInUse()
	}
}

/**
 * Refresh policy for one claim
  * claimID is the key to the claim with the policy to be refreshed
  * claimIndex : the index of the claim in the list of claims to be converted
  *              for allowing to follow the progress of the processing in the log file
  */
private function refreshPolicyForClaim(claimID : Key, claimIndex:int) {
    var claimNumber: String=""
     var showIndex: String =""+claimIndex+"/"+ _claimCount
    try{
    gw.transaction.Transaction.runWithNewBundle(\ innerBundle -> {
      var claim = innerBundle.loadByKey(claimID) as Claim
      claimNumber=claim.ClaimNumber
      //rlogger.info("RefreshPolicy -> inside bundle claim: "+claimNumber)
      try{
	    var policy=claim.Policy
	    var startTimeClaim=System.currentTimeMillis()
	    claim.setPolicyInRefresh()
	    // perform the refresh as if it was invoked from the Refresh Policy button
            ClaimPolicySetPolicyUtil.refreshClaimPolicy(claim)
           //showPolicyResult(claim)
	    var endTimeClaim= System.currentTimeMillis()
	    var elapsedTime=showTime(startTimeClaim,0)
	    rlogger.info("RefreshPolicy -> "+ showIndex+" Claim: " + claimNumber + " policy "+
	                  policy.PolicyNumber+" refreshed in "+ elapsedTime+ " seconds")
	    // clean out leftover links to the old policy
	    RetiredPolicyGraphDisconnecterExample.runForPolicy(policy.ID)
	    var cleanUpTime=showTime(endTimeClaim,0)
	    rlogger.info("RefreshPolicy -> "+ showIndex+" Claim: " + claimNumber + " retired policy links are cleaned in "+cleanUpTime+" seconds")
      }catch(e){
       rlogger.error("RefreshPolicy -> "+ showIndex+" Claim: " + claimNumber +" -> " + e.Message)
	   errorCount++
      }
    }, _currentUser)
    
  }catch(e){
     rlogger.error("RefreshPolicy -> Claim: "+ claimNumber +" -> Exception committing bundle " + e.Message) 
     errorCount++
  }
}

/**
 * show the elapsed time in seconds, with 2 decimal digits
 * count: if not 0, it calculates the average time
 */	
static function showTime(startTime: long,count: int) :String {
  var showTimeString: String
  var showTime: double
  showTime=(System.currentTimeMillis() - startTime) as double
  if (count!=0) showTime=showTime/count
  showTimeString=dFormat.format(showTime/1000)
  return showTimeString 
}

public static function getErrorCount() : int {
   return errorCount
}
}