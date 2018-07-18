package gw.policy
uses gw.api.database.Query
uses gw.policy.RefreshPolicyThreadHelper
uses gw.policy.RefreshPolicyClaimThread
uses com.guidewire.commons.entity.Key
uses gw.api.policy.ClaimPolicySetPolicyUtil
uses java.lang.System
uses java.io.File
uses java.io.FileReader
uses java.io.BufferedReader
uses java.text.DecimalFormat
uses java.util.Map
uses java.util.HashMap
uses java.lang.Integer
uses java.util.ArrayList
uses java.util.concurrent.ExecutorService
uses java.lang.Exception

/**
 * RefreshPolicy is invoked from the batch process RefreshPolicyProcess.gs
 * It takes a list of claim numbers from a file, and refreshes the policy for each of the
 * claims.
 * The average run time of the claims is shown in the log file
 * Threaded execution - all the available processors will be used
 */
class RefreshPolicyParallel {

 private static var rlogger = com.guidewire.cc.system.logging.CCLoggerCategory.SERVER_BATCHPROCESS.Logger
// errorCount stores the number of claims that could not be processed properly 
static var errorCount:int = 0
// claimCount stores the number of claims processed
static var claimCount: int =0
static var dFormat :DecimalFormat = new DecimalFormat("#.##")

 // claimToBeRefreshed is used to control ISO sendings
 // refreshing a converted claim should not cause an ISO message
// private static var claimsToBeRefreshed: Map<String,Integer>
 private static var claimsToBeRefreshed: Map<Key,Integer>
  construct() {

  }

  /**
   * Refresh the policy for the claims (represented by Claim.ClaimNumber)
   * in a file that is supposed to be on the server under the tmp directory as cc_refresh_policy.txt
   * this method is invoked from the Refresh Policy batch process
   * do not generate ISO message
   * do not generate EDW message
   */
static function refreshClaimPolicy(fileName:String){
    var claimNumberList=loadListFromFile(fileName)
    refreshClaimPolicy(claimNumberList)
}
  /**
   * Refresh the policy for the claims (represented by Claim.ClaimNumber)
   * with loadCommandID given in ScriptParameters.xml as RefreshPolicy_LoadCommandID
   * this method is invoked from the Refresh Policy batch process
   * do not generate ISO message
   * do not generate EDW message
   */
static function refreshClaimPolicy(){
    var keyList = loadListByLoadCommandID()
    refreshClaimPolicy(keyList)
}

/**
 * Refresh the policy for the claims in the list (represented by Claim.ClaimNumber)
 * This is the equivalent of pushing the Refresh Policy button in ClaimCenter/Policy page
 * The current policy gets retired
 */
static function refreshClaimPolicy(claimNumberList: List<String>){
 var claimKeys = Query.make(Claim)
  .compareIn("ClaimNumber", claimNumberList as java.lang.Object[])
  .select()
  .keyIterator()
  .toList()
   refreshClaimPolicy(claimKeys)
 }
 
 static function refreshClaimPolicy(claimKeys: List<Key>){
   var startTime= System.currentTimeMillis()
   initClaimsToBeRefreshed()
   rlogger.info ("RefreshPolicy: " + claimKeys.Count + " claims are processed. ")
   claimCount=claimKeys.Count   
   var claimIndex: int=0
 try {
     // initialize the threaded execution
     RefreshPolicyThreadHelper.initThreaded(RefreshPolicyThreadHelper.THREADED);
     RefreshPolicyThreadHelper.setThreadInUse(claimCount);
     var currentUser = User.util.CurrentUser
   for(ID in claimKeys){
       claimIndex++
       initClaimToBeRefreshed(ID)
    var claimThread: RefreshPolicyClaimThread = new RefreshPolicyClaimThread(ID,claimIndex,claimCount,currentUser)
    //refreshPolicyForClaim(ID,claimIndex)
   // get an available thread from the thread pool
   var executorService: ExecutorService = RefreshPolicyThreadHelper.getExecutorService()
   executorService.execute(claimThread)
     }
     // wait till all the threads complete
     RefreshPolicyThreadHelper.await()
   }
   catch (e: Exception) {
   
   } finally {
     //shut down the threadpool
			try {
       RefreshPolicyThreadHelper.closeThreadPool();
     }
			catch (e: Exception){
				System.out.println("RefreshPolicy -> ThreadPool could not close normally "+e.getMessage());
     }
   }
  
  var averageTimeClaim=showTime(startTime,claimCount)
  var allTimeClaim=showTime(startTime)
  errorCount=RefreshPolicyClaimThread.getErrorCount() 
  rlogger.info("RefreshPolicy -> average time / Claim: "+averageTimeClaim+" seconds for "+claimCount+" claims. All time used: "+allTimeClaim+". Errors: "+errorCount)
  initClaimsToBeRefreshed()
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
 * load the claim numbers to be processed as a comma separated list
 */
public static function loadListFromString(listString: String): List<String> {
   var claimNumberList = new ArrayList<String>()
   var split =listString.split(",")
   for (claimNumber in split){
     if (claimNumber!=null&& claimNumber.length()>0){
     claimNumberList.add(claimNumber.trim())
     }
   }
   return claimNumberList
   }

/**
 * load the claim numbers to be processed from the tmp directory on the server
 */
 public static function loadListFromFile(fileName: String) : List<String> {
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
 /**
 * Load the claim numbers from a query
 * retrieving claims with med only and LoadCommandID
 * that do not have reinsurance
 */
 public static function loadListFromQuery(): List<Key>{
  var claimKeys = Query.make(Claim)
 // .compareIn("ClaimNumber", )
  .select()
  .keyIterator()
  .toList()
   return claimKeys
 
 }
 /**
  * collect the claim numbers based on the LoadCommandID
  * in ScriptParameters.RefreshPolicy_LoadCommandID
  * use only the claims that were uploaded as part of this load process (e.g. today)
  */
   public static function loadListByLoadCommandID(): List<Key>{
      var loadCommandID=ScriptParameters.RefreshPolicy_LoadCommandID
      return loadListByLoadCommandID(loadCommandID)
}
  public static function loadListByLoadCommandID(loadCommandID : int): List<Key>{
  var claimKeys = Query.make(Claim)
  .compare("LoadCommandID", Equals, loadCommandID)
  .compare("PolicyRefreshedExt", Equals, false)
  .select()
  .keyIterator()
  .toList()
  return claimKeys
 
 }

static function showPolicyResult(claim: Claim){
  rlogger.info("RefreshPolicy -> Claim: "+claim.ClaimNumber+" policy ID: "+claim.Policy.ID+" reins: "+claim.Policy.ex_Reinsurances)
  rlogger.info("RefreshPolicy -> Claim refresh failed "+claim.Policy.isPolicyRefreshFailed(1))
}

  // claimToBeRefreshed is used to control ISO and EDW sendings
  // refreshing a converted claim should cause anneither an ISO, nor an EDW message
  
  private static function initClaimsToBeRefreshed(){
    claimsToBeRefreshed=new HashMap<Key,Integer>()
  }
  private static function initClaimToBeRefreshed(claimID: Key){
    claimsToBeRefreshed.put(claimID,1)
  }
  
  public static function initClaimsToBeRefreshed(claimList: List<Key>){
    claimsToBeRefreshed=new HashMap<Key,Integer>()
    for (claimID in claimList){
       claimsToBeRefreshed.put(claimID,1)
    }
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