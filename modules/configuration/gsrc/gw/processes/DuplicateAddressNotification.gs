package gw.processes

uses gw.api.database.Query
uses gw.api.util.DateUtil
uses java.util.ArrayList
uses java.lang.Throwable

class DuplicateAddressNotification  extends BatchProcessBase{
  
  private var dupAddContact = new ArrayList<Contact>()
  private var _env = gw.api.system.server.ServerUtil.getEnv()

  construct() {
    super(BatchProcessType.TC_DUPLICATEADDRESSNOTIFICATION)
  }
  
  construct(batchProcessType:BatchProcessBase) {    
    this(batchProcessType)
  }

  override function doWork(){
    
    var contact = Query.make(Contact).compare("PrimaryAddress", NotEquals, null)
                                     .subselect("PrimaryAddress", CompareIn, ContactAddress, "Address").select().keyIterator().toList()
  

    
    var con : Contact
    for(id in contact){
     if(!this.TerminateRequested){
            gw.transaction.Transaction.runWithNewBundle(\ b ->  {
              try{
                  con = b.loadByKey(id) as Contact
                  if(con.AllAddresses.where(\ a -> a.ID == con.PrimaryAddress.ID ).Count > 1 and con typeis LawFirm){
                    if(dupAddContact.where(\ c -> c.AddressBookUID == con.AddressBookUID ).Count == 0){
                      gw.api.util.Logger.logInfo("Contact Added to Duplicate Address Notification: " + con.ID)
                      dupAddContact.add(con)
                      incrementOperationsCompleted()
                    }
                  }
              }catch(e){
                  incrementOperationsFailed()
              }
            }, "su")
          } else{
              gw.api.util.Logger.logError("Duplicate Address Notification Stopped: Termination Requested...")
              break
          }
    }
    
    if(dupAddContact.Count > 0){
      try{
        var body = templates.email.DuplicateAddressNotification.renderToString(dupAddContact)
        var emailAddys:String[] = ScriptParameters.DuplicateAddressNotificationEmail.toString().split(",")
        for(cont in emailAddys){
          gw.api.email.EmailUtil.sendEmailWithBody(null, cont, null, "ClaimCenterSupport@gaig.com", null, this.EmailSubject, body)
        }
      }catch(e){
        throw e 
      }
    }
  }
  
    private property get EmailSubject() : String{
    return "ClaimCenter Duplicate Address Notification" + (_env == "prod" ? "" : (" - " + _env))
  }
}
