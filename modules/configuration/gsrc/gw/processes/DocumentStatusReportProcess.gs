package gw.processes

uses java.util.ArrayList
uses java.lang.Throwable
uses util.gaic.documentstatusreport.DocumentStatusReportItem

class DocumentStatusReportProcess extends BatchProcessBase {
  private var _documentSuspects = new ArrayList<Document>()
  private var _env = gw.api.system.server.ServerUtil.getEnv()
  private var _log = gw.api.util.Logger
  private var _limit = 50 

  construct() {
    super(BatchProcessType.TC_DOCUMENTSTATUSREPORT)
  }                                                                                        
                          
  override function doWork(){
    try{
      _log.logInfo("DocumentStatusReportProcess.doWork()")
      //query for each condition
      notProcessedDocumentsList()
      //email the report
      report()    
    }catch(e){
      _log.logInfo("Exception generating DocumentStatusReport")
      e.printStackTrace()
      emailError(e)
    }
  } // end doWork
  
  
  /** Selecting unprocessed documents - regular and Empower
   *  which were not updated with ECF IDs
   */
  private function notProcessedDocumentsList(){
    // tracking start date = yesterday and today
    //var trackingStartDate = DateUtil.currentDate().addDays(-1)
    // Empower documents' PendingDocID stores Empower IDs; it's NULL for regular ClaimCenter documents
    var notProcessedDocs = find (doc in Document where ((doc.ECFIDExt contains "ID-" || doc.PendingDocUID!=NULL) //&& doc.CreateTime>=trackingStartDate
                            && doc.Obsolete==false))
    for(doc in notProcessedDocs.iterator()){
      // Empower IDs in ECFIDExt column should change to ECF IDs when documents are successfully processed
      if((doc.PendingDocUID==NULL && doc.ECFIDExt.containsIgnoreCase("ID-")) || doc.PendingDocUID == doc.ECFIDExt){
        var nowDateTime = now() as DateTime
        // not showing documents created the last 35 minutes of the report - could not yet be processed 
        if(doc.CreateTime<nowDateTime.addMinutes(-35)){
          _documentSuspects.add(doc)
        }
      }
    }
  }  // end notProcessedDocuments
  
  /**
   * convert the confirmed suspects into CheckStatusReportItems, then generate the email
   */
  private function report() {
    try{
      var body = templates.email.DocumentStatusReport.renderToString(createDocumentReportItems())
      if(_env == "prod"){
        var emailAddys:String[] = ScriptParameters.DocumentStatusReportEmail.toString().split(",")
        for(contact in emailAddys){
          gw.api.email.EmailUtil.sendEmailWithBody(null, contact, null, "ClaimCenterSupport@gaig.com", null, this.EmailSubject, body)
        }
      }
      else{
        gw.api.email.EmailUtil.sendEmailWithBody(null, "ClaimCenterTesting@gaig.com", null, "ClaimCenterSupport@gaig.com", null, this.EmailSubject, body)
      }
      
    }catch(e){
      throw e 
    }
  } //end report
  
  
  private property get EmailSubject() : String{
    return "ClaimCenter Document Status Report" + (_env == "prod" ? "" : (" - " + _env))
  }
  
  
  private function emailError(e : Throwable){
    var body = "Exception occurred while generating Document Status Report. Document logs for full stack trace: " + e.Message
    var emailAddy = (_env == "prod" ? "ClaimCenterSupport@gaig.com" : "ClaimCenterTesting@gaig.com")
    gw.api.email.EmailUtil.sendEmailWithBody(null, emailAddy, null, "ClaimCenterSupport@gaig.com", null, "Document Status Report Exception" + _env, body)    
  }
  
  /**
   * 
   */
  private function createDocumentReportItems() : List<DocumentStatusReportItem>{
    var documentReportItems = new ArrayList<DocumentStatusReportItem>(_documentSuspects.size)

    for(doc in _documentSuspects){
      // generating readable Central Print(CP)/CP Canceled/CP Successful values 
      var cpFlag:String
      var cpCanceled:String
      var cpSuccessful:String
      if(doc.ex_CentralPrint==false || doc.ex_CentralPrint==NULL)
        cpFlag = "No"
      else
        cpFlag = "Yes"
        
      if(doc.ex_CentralPrintCancelled==false || doc.ex_CentralPrintCancelled==NULL)
        cpCanceled = "No"
      else
        cpCanceled = "Yes"
        
      if(doc.ex_CentralPrintSuccessfull==false || doc.ex_CentralPrintSuccessfull==NULL)
        cpSuccessful = "No"
      else
        cpSuccessful = "Yes"
        
      var docReportItem = new DocumentStatusReportItem(doc, _documentSuspects.Count, cpFlag, cpCanceled, cpSuccessful)
      documentReportItems.add(docReportItem)
    }
    // Maximum number of documents to show in the status report email
                        
    if(!documentReportItems.Empty && documentReportItems.Count > _limit){
      return (documentReportItems.orderByDescending(\ d -> d.CreateTime).subList(0, _limit))
    }else{
      return documentReportItems.orderByDescending(\ d -> d.CreateTime)
    }
  }
}