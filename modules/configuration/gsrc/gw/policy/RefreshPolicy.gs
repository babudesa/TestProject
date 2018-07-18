package gw.policy
uses gw.api.database.Query
uses gw.api.policy.ClaimPolicySetPolicyUtil
uses gw.policy.RetiredPolicyGraphDisconnecterExample
uses com.guidewire.commons.entity.Key
uses java.lang.System
//uses com.guidewire.pl.web.util.WebFileUtil
uses java.io.File
uses java.io.FileReader
uses java.io.BufferedReader
uses java.text.DecimalFormat
uses java.util.Map
uses java.util.HashMap
uses java.lang.Integer
uses java.util.ArrayList

/**
 * RefreshPolicy is invoked from the batch process RefreshPolicyProcess.gs
 * It takes a list of claim numbers from a file, and refreshes the policy for each of the
 * claims.
 * The average run time of the claims is shown in the log file
 */
class RefreshPolicy {

 private static var rlogger = com.guidewire.cc.system.logging.CCLoggerCategory.SERVER_BATCHPROCESS.Logger
// errorCount stores the number of claims that could not be processed properly 
static var errorCount:int = 0
// claimCount stores the number of claims processed
static var claimCount: int =0
static var dFormat :DecimalFormat = new DecimalFormat("#.##")

 // claimToBeRefreshed is used to control ISO sendings
 // refreshing a converted claim should not cause an ISO, EDW message
 private static var claimsToBeRefreshed: Map<Key,Integer>
 
  construct() {

  }

  /**
   * Refresh the policy for the claims (represented by Claim.ClaimNumber)
   * in a file that is supposed to be on the server under the tmp directory as cc_refresh_policy.txt
   * this method is invoked from the Refresh Policy batch process
   * do not generate ISO sending
   */
static function refreshClaimPolicy(fileName:String){
    var claimNumberList=loadListFromFile(fileName)
    refreshClaimPolicy(claimNumberList)
}

// Refresh policy by claim number  -- for local testing
static function refreshClaimPolicy(){
   var claimNumberList={"A10000021"}
   refreshClaimPolicy(claimNumberList)
}

/**
 * Refresh the policy for the claims in the list (represented by Claim.ClaimNumber)
 * This is the equivalent of pushing the Refresh Policy button in ClaimCenter/Policy page
 * The current policy gets retired
 */
static function refreshClaimPolicy(claimNumberList: List){
 var startTime= System.currentTimeMillis()
 initClaimsToBeRefreshed()
 var claimKeys = Query.make(Claim)
  .compareIn("ClaimNumber", claimNumberList as java.lang.Object[])
  .select()
  .keyIterator()
  .toList()
 
 rlogger.info ("RefreshPolicy: " + claimKeys.Count + " claims are processed. ")
 claimCount=claimKeys.Count
 var claimIndex: int=0
 for(ID in claimKeys){
    claimIndex++
    refreshPolicyForClaim(ID,claimIndex)
  }
  var averageTimeClaim=showTime(startTime,claimCount)
  var allTimeClaim=showTime(startTime)
  
  rlogger.info("RefreshPolicy -> average time / Claim: "+averageTimeClaim+" seconds for "+claimCount+" claims. All time used: "+allTimeClaim+". Errrors: "+errorCount)
  initClaimsToBeRefreshed()
}

/**
 * Refresh policy for one claim
 * claimIndex : the index of the claim in the list of claims to be converted
 *              shown for logging
 */
static function refreshPolicyForClaim(claimID : Key, claimIndex:int) {
    var claimNumber: String=""
     var showIndex=""+claimIndex+"/"+claimCount
    try{
    gw.transaction.Transaction.runWithNewBundle(\ innerBundle -> {
      var claim = innerBundle.loadByKey(claimID) as Claim
      initClaimToBeRefreshed(claimID)
      try{
	    var policy=claim.Policy
	    var startTimeClaim=System.currentTimeMillis()
	    claim.setPolicyInRefresh()
            ClaimPolicySetPolicyUtil.refreshClaimPolicy(claim)
            //showPolicyResult(claim)
	    var endTimeClaim= System.currentTimeMillis()
	    var elapsedTime=showTime(startTimeClaim)
	    rlogger.info("RefreshPolicy -> "+ showIndex+" Claim: " + claimNumber + " policy refreshed in "+ elapsedTime+ " seconds")
	    // clean out leftover links to the old policy
	    RetiredPolicyGraphDisconnecterExample.runForPolicy(policy.ID)
	    var cleanUpTime=showTime(endTimeClaim)
	    rlogger.info("RefreshPolicy -> "+ showIndex+" Claim: " + claimNumber + " retired policy links are cleaned in "+cleanUpTime+" seconds")
      }catch(e){
       rlogger.error("RefreshPolicy -> "+ showIndex+" Claim: " + claimNumber +" -> " + e.Message)
	   errorCount++
      }
    })
    
  }catch(e){
     rlogger.error("RefreshPolicy -> Claim: "+ claimNumber +" -> Exception committing bundle " + e.Message) 
     errorCount++
  }
}
// return the elapsed time as seconds with 2 decimal digits
static function showTime(startTime: long) :String {
  return showTime(startTime,0)
}
/**
 * return the average elapsed time as seconds with 2 decimal digits
 */
static function showTime(startTime: long,count: int) :String {
  var showTimeString: String
  var showTime: double
  showTime=(System.currentTimeMillis() - startTime) as double
  if (count!=0) showTime=showTime/count
  showTimeString=dFormat.format(showTime/1000)
  return showTimeString 
}
 

/**
 * load the claim numbers to be processed from the tmp directory on the server
 */
 static function loadListFromFile(fileName: String) : List<String> {
   var claimNumberList = new ArrayList<String>()
   //var tempDir: String= WebFileUtil.getSessionTempDir()
   // session tempdir is different for each run of the server, so cannot be used
   var tempDir: String= "/tmp"
   var fullFileName=tempDir+"/"+fileName
   //_logger.info ("RefreshPolicy file: "+fullFileName)
   var file: File= new File(fullFileName)
   var fileReader: FileReader
   var buffer: BufferedReader
   if (file.exists()){
     try {
     fileReader = new FileReader(file)
     buffer = new BufferedReader(fileReader)
     var line:String=buffer.readLine()
     while(line!=null&&line.length()>0){
       claimNumberList.add(line)
       line=buffer.readLine()
       }
     }
     catch (e){
       rlogger.error("RefreshPolicy -> read error: "+fullFileName+" "+e.Message)
     }
    finally {
      try {
      if (buffer!=null) {
        buffer.close()
      }
      if (fileReader!=null){
        fileReader.close()
      }
      }
      catch (e){
         rlogger.error("RefreshPolicy -> file close error: "+fullFileName+" "+e.Message)
      }
    }
   }
   else {
     rlogger.error("RefreshPolicy -> "+fullFileName +" does not exist ")
   }
   return claimNumberList
 }

static function showPolicyResult(claim: Claim){
  rlogger.info("RefreshPolicy -> Claim: "+claim.ClaimNumber+" policy ID: "+claim.Policy.ID+" reins: "+claim.Policy.ex_Reinsurances)
  rlogger.info("RefreshPolicy -> Claim refresh failed "+Claim.Policy.isPolicyRefreshFailed(1))
}

  // claimToBeRefreshed is used to control ISO sendings
  // refreshing a converted claim should not cause an ISO message
  
  private static function initClaimsToBeRefreshed(){
    claimsToBeRefreshed=new HashMap<Key,Integer>()
  }
  private static function initClaimToBeRefreshed(claimID: Key){
    claimsToBeRefreshed.put(claimID,1)
  }

  /**
   * if claim was refreshed from the batch process then do not send to ISO
   */
  public static function wasClaimRefreshedFromBatchRefreshPolicy(claimID: Key) : boolean {
     var result: boolean = false
     if (claimsToBeRefreshed==null || claimsToBeRefreshed.isEmpty()){
      result=false;
      }
     else {
       result=claimsToBeRefreshed.containsKey(claimID)
     }
     return result
  }
}