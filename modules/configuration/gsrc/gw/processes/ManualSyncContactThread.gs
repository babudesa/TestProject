package gw.processes

uses java.lang.Thread
uses java.lang.Exception
uses java.lang.System
uses java.text.DecimalFormat

class ManualSyncContactThread extends Thread{
  
   private static var rlogger = com.guidewire.cc.system.logging.CCLoggerCategory.SERVER_BATCHPROCESS.Logger
   private static var threadCount: int =1	
   private static var errorCount: int=0
   static var dFormat :DecimalFormat = new DecimalFormat("#.##")

   private var _contactID: Key
   private var _contactIndex: int =0
   private static var _contactCount: String=""
   private var _currentUser: User

  construct( contactID: Key, contactIndex: int,contactCountIn: int, currentUser: User) {
	super("ManualSyncParallelThread" + threadCount); // Store the thread name
	threadCount++
	_contactID=contactID
	_contactIndex=contactIndex
	_contactCount=""+contactCountIn
	_currentUser=currentUser
  }
  
  override public function toString() : String {
    return "#" + getName() +" "
  }

  override public function run() {	
    try {
      //rlogger.info("************** "+_contact);
        manuallySyncContacts(_contactID,_contactIndex)
    } catch (e: Exception){
      rlogger.error("ManualSyncThread: "+e.getClass()+" "+e.getMessage())
      rlogger.error ("ManualSyncThread: "+e.getMessage())
      //e.printStackTrace()
    } finally {
      // decrease threadcount in controller
      ManualSyncThreadHelper.decrThreadInUse()
    }
  }
  
  private function manuallySyncContacts(contactID : Key, contactIndex:int) {
    //var claimNumber: String=""
    var showIndex: String =""+contactIndex+"/"+ _contactCount
    try{
      
      //com.guidewire.pl.system.transaction.CommitOptions.getThreadCommitOptions().setIgnoreVersionConflicts(false)
      
      gw.transaction.Transaction.runWithNewBundle(\ innerBundle -> {
        var contact = innerBundle.loadByKey(contactID) as Contact
        
        try{
	  var startTimeContact=System.currentTimeMillis()
	   
	  // DO SYNC ACTION HERE
          gw.api.contact.ContactAutoSyncUtil.autoSyncContact(contact.AddressBookUID, contact.ID, contact.ID)
           
	  var elapsedTime=showTime(startTimeContact,0)
	  rlogger.info("ManualSync -> "+ showIndex+" Contact: " + contactID +" synced in "+ elapsedTime+ " seconds")
	    
	
        }catch(e){
          if(e.Message.contains("Database bean version conflict")){
            var retryError = true
          
            while(retryError){
              try{
                var startTimeContact=System.currentTimeMillis()
	   
        	// DO SYNC ACTION HERE
                gw.api.contact.ContactAutoSyncUtil.autoSyncContact(contact.AddressBookUID, contact.ID, contact.ID)
           
        	var elapsedTime=showTime(startTimeContact,0)
        	rlogger.info("ManualSync -> "+ showIndex+" Contact: " + contactID +" synced in "+ elapsedTime+ " seconds")
        	retryError = false
	    
    	      }catch(ex){
    	        retryError = true
    	      }
            }
          } else {
            rlogger.error("ManualSync -> "+ showIndex+" Contact: " + contactID +" -> " + e.Message)
            errorCount++
          }
        }
       }, _currentUser)
       
    }catch(e){
     rlogger.error("ManualSync -> Contact: "+ contactID +" -> Exception committing bundle " + e.Message) 
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
