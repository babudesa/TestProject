package gw.processes
uses gw.api.util.Logger
uses gw.api.database.Query
uses java.lang.StringBuilder
uses java.sql.Connection
uses java.lang.Runtime
uses com.gaic.claims.util.db.DatabaseUtil
uses java.text.DecimalFormat
uses java.lang.System
uses java.lang.Exception
uses java.util.concurrent.ExecutorService


class ManualSync extends BatchProcessBase {
    
  //Important Starting Variables/Constructors
  var env = gw.api.system.server.ServerUtil.getEnv()
  private var con:Connection = null
  private var _logger = com.guidewire.cc.system.logging.CCLoggerCategory.SERVER_BATCHPROCESS.Logger
  static var errorCount:int = 0
  static var contactCount: int =0  // contactCount stores the number of contacts processed
  static var dFormat :DecimalFormat = new DecimalFormat("#.##")
  var emailErrorLog = new StringBuilder()
  var emailBody = new StringBuilder()
  var startTime= System.currentTimeMillis()
  
  construct(batchProcessType:BatchProcessBase){
    this(batchProcessType)
  }
  
  construct(){
    super(BatchProcessType.TC_MANUALSYNC)
    con = DatabaseUtil.openConnectionToClaimCenterWithDefaultProperties()
    con.setAutoCommit(false)
  }
     
  //Workhorse of the Batch Process
  override function doWork() {
    // Check for multithreading before running single thread process
    _logger.info("ManualSync called")
    var cores: int=Runtime.getRuntime().availableProcessors()
    _logger.info("Number of processors: "+cores)
    
    // If there is more then one processor use multi-threading
    if (cores > 1) {
      _logger.info("ManualSyncParallel started")
      
      // initialize variables
      var contactKeys = loadListByLoadCommandID() //Get the contacts to process
      var conID = ""
      var contactIndex: int=0
      contactCount=contactKeys.Count
      OperationsExpected = contactCount
      _logger.info ("ManualSync: " + contactCount + " contacts are processed. ")
      
      try {
        // initialize the threaded execution
        ManualSyncThreadHelper.initThreaded(ManualSyncThreadHelper.THREADED);
        ManualSyncThreadHelper.setThreadInUse(contactCount);
        var currentUser = User.util.CurrentUser
        for(ID in contactKeys){
          conID = ID as String
          if(!this.TerminateRequested){
            try{
              contactIndex++
              incrementOperationsCompleted()
              var contactThread: ManualSyncContactThread = new ManualSyncContactThread(ID,contactIndex,contactCount,currentUser)
              
            
              // get an available thread from the thread pool
              var executorService: ExecutorService = ManualSyncThreadHelper.getExecutorService()
              executorService.execute(contactThread)
            } catch (e: Exception) {
              incrementOperationsFailed()
              emailErrorLog.append("<tr><td>"+conID+"</td><td>"+e+"</td></tr>")
            }
           } else{
              gw.api.util.Logger.logError("Manual Sync Job Stopped: Termination Requested...")
              try {
                ManualSyncThreadHelper.closeThreadPool();
              } catch (e: Exception){
            	  System.out.println("ManualSync -> ThreadPool could not close normally " + e.getMessage());
              }
              break
          }
        }
        // wait till all the threads complete
        ManualSyncThreadHelper.await()
      } catch (e: Exception) {
        
      } finally {
        // shut down the threadpool
        try {
          ManualSyncThreadHelper.closeThreadPool();
        } catch (e: Exception){
      	  System.out.println("ManualSync -> ThreadPool could not close normally " + e.getMessage());
        }
      }
  
      var averageTimeContact = showTime(startTime,contactCount)
      var allTimeContact = showTime(startTime)
      errorCount = ManualSyncContactThread.getErrorCount() 
      _logger.info("ManualSync -> average time / Contact: "+averageTimeContact + " seconds for " + contactCount+" contacts. All time used: " + allTimeContact + ". Errors: " + errorCount)
      _logger.info("ManualSync completed")      
    
    } else { // If only one processor, run the normal manual sync

      //Builds Contacts to Sync
      var contactKeys = loadListByLoadCommandID() //Get the contacts to process
      OperationsExpected = contactKeys.Count
      gw.api.util.Logger.logInfo("Manual Sync Job Started: " + OperationsExpected + " records to process...")

      //Syncs Contacts
      var contact : Contact
      for(key in contactKeys){
          if(!this.TerminateRequested){
            gw.transaction.Transaction.runWithNewBundle(\ b ->  {
              try{
                  contact = b.loadByKey(key) as Contact
                  gw.api.contact.ContactAutoSyncUtil.autoSyncContact(contact.AddressBookUID, contact.ID, contact.ID)
                  incrementOperationsCompleted()
              }catch(e){
                  incrementOperationsFailed()
                  emailErrorLog.append("<tr><td>"+contact.ID+"</td><td>"+contact.Name+"</td><td>"+e+"</td></tr>")}
            })
          } else{
              gw.api.util.Logger.logError("Manual Sync Job Stopped: Termination Requested...")
              break
          }
      }
    }
      try{        
          //Build Email Body
          emailBody.append("<body bgcolor=\"#F0F0F0\">")
          emailBody.append("<h2>Manual Sync Log</h2>")
          emailBody.append("<table border=0>")
          emailBody.append("<tr><td>Contacts Synced:</td><td>"+OperationsCompleted+"</td></tr>")
          emailBody.append("<tr><td>Contact Errors:</td><td>"+OperationsFailed+"</td></tr>")
          emailBody.append("<tr><td>Start Time:</td><td>"+showTime(startTime)+"</td></tr>")
          emailBody.append("<tr><td>End Time:</td><td>"+now()+"</td></tr>")
          emailBody.append("</table>")
          emailBody.append("<br><table border=1 bgcolor=\"#FFFF99\" bordercolor=\"#707070\" cellspacing=\"0\">")
          if(TerminateRequested){
            emailBody.append("<tr><td>BATCH PROCESS TERMINATED!  If another email does not arrive shortly, please forward to ClaimCenter Leads.  This can wait until morning.</td></tr>")
          } else if(OperationsFailed > 0){
            emailBody.append("<tr><td>Errors have been identified, please forward to ClaimCenter Leads.  This can wait until morning.</td></tr>")
          } else{
            emailBody.append("<tr><td>Manual Sync has finished without Error, you can delete this email.</td></tr>")
          }
          emailBody.append("</table>")
          emailBody.append("<br>")
          if(OperationsFailed > 0){
              emailBody.append("Errors:")
              emailBody.append("<table border=1 bgcolor=\"#FFFFFF\" bordercolor=\"#707070\" cellspacing=\"0\">")
              emailBody.append("<tr><th>Contact ID</th><th>Contact Name</th><th>Error Message</th></tr>")
              emailBody.append(emailErrorLog.toString())
              emailBody.append("</table>")
          }
          emailBody.append("</body>")
        
          //Send Email based on Environment
          if(env == "prod") {
              gw.api.email.EmailUtil.sendEmailWithBody(null, 
              "ClaimCenterSupport@GAIG.com", "ClaimCenter Support", 
              "ClaimCenterSupport@GAIG.com", "ClaimCenter Support", 
              "Manual Sync Log", emailBody.toString())
          }else{
              gw.api.email.EmailUtil.sendEmailWithBody(null, 
              "ClaimCenterTesting@GAIG.com", "ClaimCenter Testing", 
              "ClaimCenterTesting@GAIG.com", "ClaimCenter Testing", 
              "Manual Sync Log ("+env+")", emailBody.toString())
          }
      }catch(e){
          gw.api.util.Logger.logError("Manual Sync Job Error: Could not generate E-Mail...")
          gw.api.util.Logger.logError(e.StackTrace.toString())
          gw.api.util.Logger.logError(emailBody.toString())
      }
    
  }

  //Makes the Progress Bar Work
  override property get Progress() : String {
       return ("Processed " + this.OperationsCompleted + " of " + OperationsExpected)
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
    showTime = (System.currentTimeMillis() - startTime) as double
    if (count != 0) showTime=showTime/count
    showTimeString = dFormat.format(showTime/1000)
    return showTimeString 
  } 
  
  public static function loadListByLoadCommandID(): List<Key>{
    var ContactsToCheck = Query.make(Contact).compare("AddressBookUID", NotEquals, null).compare("LoadCommandID", Equals, ScriptParameters.ManualSyncLCID).compare("AutoSync", Equals, AutoSync.TC_ALLOW).select().keyIterator().toList()
    return ContactsToCheck
 
 }
  
}//Class is Over!
