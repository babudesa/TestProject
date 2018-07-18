package gw.processes

uses gw.api.database.Query
uses gw.api.util.DateUtil
uses util.gaic.checkstatusreport.SuspectCheck
uses java.util.ArrayList
uses util.gaic.checkstatusreport.SuspectCheckCondition
uses util.gaic.checkstatusreport.CheckStatusReportItem
uses util.gaic.checkstatusreport.BulkInvoiceStatusReportItem
uses java.lang.Throwable

/**
 * 
 */
class CheckStatusReportProcess extends BatchProcessBase {
  
  private var _confirmedCheckSuspects = new ArrayList<SuspectCheck>()  
  private var _confirmedBulkSuspects = new ArrayList<SuspectCheck>()
  private var _env = gw.api.system.server.ServerUtil.getEnv()
  private var _cincinnati = Query.make(Zone).compare("CodeDenorm", Equals, "oh:cincinnati").select().AtMostOneRow
  private var _log = gw.api.util.Logger


  construct() {
    super(BatchProcessType.TC_CHECKSTATUSREPORT)
  }                                                                                        
                          
  override function doWork(){
    try{
      _log.logInfo("CheckStatusReportProcess.doWork()")
      //query for each condition
      pendingApproval()
      awaitingSubmission()
      requesting()
      issued()
      pendingStop()
      pendingVoid()
      bulkInvalidInvoiceItems()
      bulkPendingApprovalInvoiceItems()
      bulkRequestingInvoiceItems()
      
      _log.logInfo("CheckStatusReportProcess - finished identifying candidates. Creating report...")
      //email the report
      report()    
    }catch(e){
      _log.logInfo("Exception generating CheckStatusReport")
      e.printStackTrace()
      emailError(e)
    }
  }
  
  
  /**
   * 
   */
  private function pendingApproval(){
    var pendingApprovalChecks = Query.make(Check)
                                     .compare("Status", Equals, SuspectCheckCondition.PENDING_APPROVAL.Status)
                                     .compare("CheckNumber", NotEquals, null)
                                     .compare("RecurringCheck", Equals, null)
                                     .compare("StatusChangeDateExt", NotEquals, null)
                                     .compare("PaymentMethod", NotEquals, PaymentMethod.TC_MANUAL)
                                     .select(\ check -> new SuspectCheck(check.PublicID, SuspectCheckCondition.PENDING_APPROVAL, check.StatusChangeDateExt, null))
                                     
    for(suspect in pendingApprovalChecks.iterator()){
      if(DateUtil.businessDaysBetween(suspect.StatusChangeDate, DateUtil.currentDate(), _cincinnati) > SuspectCheckCondition.PENDING_APPROVAL.TriggerDays){
        _confirmedCheckSuspects.add(suspect)
      }
    }
  }
  
  
  /**
   * 
   */
  private function awaitingSubmission(){
                                    
    var awaitingSubmissionChecks = Query.make(Check)
                                        .compare("Status", Equals, SuspectCheckCondition.AWAITING_SUBMISSION.Status)
                                        .compare("CheckNumber", NotEquals, null)
                                        .compare("RecurringCheck", Equals, null)                                        
                                        .compare("StatusChangeDateExt", NotEquals, null)
                                        .compare("PaymentMethod", NotEquals, PaymentMethod.TC_MANUAL)
                                        .compare("ScheduledSendDate", NotEquals, null)
                                        .select(\ check -> new SuspectCheck(check.PublicID, SuspectCheckCondition.AWAITING_SUBMISSION, check.StatusChangeDateExt, check.ScheduledSendDate))
                                       
    for(suspect in awaitingSubmissionChecks.iterator()){
      if(DateUtil.minutesSince(suspect.StatusChangeDate) > (SuspectCheckCondition.AWAITING_SUBMISSION.TriggerHours * 60) and suspect.ScheduledSendDate < DateUtil.currentDate()){
        _confirmedCheckSuspects.add(suspect)
      }
    }                                         
  }
  
  
  /**
   * 
   */
  private function requesting(){
    var requestingChecks = Query.make(Check)
                                .compare("Status", Equals, SuspectCheckCondition.REQUESTING.Status)
                                .compare("CheckNumber", NotEquals, null)
                                .compare("RecurringCheck", Equals, null)                                
                                .compare("StatusChangeDateExt", NotEquals, null)
                                .compare("PaymentMethod", NotEquals, PaymentMethod.TC_MANUAL)
                                .select(\ check -> new SuspectCheck(check.PublicID, SuspectCheckCondition.REQUESTING, check.StatusChangeDateExt, null)) 
                               
    for(suspect in requestingChecks.iterator()){
      if(DateUtil.minutesSince(suspect.StatusChangeDate) > (SuspectCheckCondition.REQUESTING.TriggerHours * 60)){
        _confirmedCheckSuspects.add(suspect)
      }
    }                               
  }
  
  
  /**
   * This function handles two scenarios for issued checks.
   *   1) Check in issued status but without a print date
   *   2) Check in issued status but without an issue date (or a print date)
   */
  private function issued(){
    var issuedChecks = Query.make(Check)
                            .compare("Status", Equals, SuspectCheckCondition.ISSUED_NO_PRINT_DATE.Status)
                            .compare("CheckNumber", NotEquals, null)
                            .compare("RecurringCheck", Equals, null)
                            .compare("ex_DatePrinted", Equals, null)
                            .compare("PaymentMethod", NotEquals, PaymentMethod.TC_MANUAL)
                            .select(\ check -> new SuspectCheck(check.PublicID, null, check.IssueDate,null))    
                            
    for(suspect in issuedChecks.iterator()){
      if(suspect.StatusChangeDate != null){ //issue date but no print date
        suspect.Condition = SuspectCheckCondition.ISSUED_NO_PRINT_DATE
        if(DateUtil.minutesSince(suspect.StatusChangeDate) > (SuspectCheckCondition.ISSUED_NO_PRINT_DATE.TriggerHours * 60)){
          _confirmedCheckSuspects.add(suspect)
        }
      }else{  //no issue date and no print date
        suspect.Condition = SuspectCheckCondition.ISSUED_NO_ISSUE_DATE
        _confirmedCheckSuspects.add(suspect)
      }
    }       
  }
  
  
  /**
   * 
   */
  private function pendingStop(){
    var pendingStopChecks = Query.make(Check)
                           .compare("Status", Equals, SuspectCheckCondition.PENDING_STOP.Status)
                           .compare("CheckNumber", NotEquals, null)
                           .compare("RecurringCheck", Equals, null)
                           .compare("StatusChangeDateExt", NotEquals, null)
                           .compare("PaymentMethod", NotEquals, PaymentMethod.TC_MANUAL)
                           .select(\ check -> new SuspectCheck(check.PublicID, SuspectCheckCondition.PENDING_STOP, check.StatusChangeDateExt, null))
                           
    for(suspect in pendingStopChecks.iterator()){
      if(DateUtil.businessDaysBetween(suspect.StatusChangeDate, DateUtil.currentDate(), _cincinnati) > SuspectCheckCondition.PENDING_STOP.TriggerDays){
        _confirmedCheckSuspects.add(suspect)
      }
    }                           
  }
  
  
  /**
   * 
   */
  private function pendingVoid(){
    var pendingVoidChecks = Query.make(Check)
                           .compare("Status", Equals, SuspectCheckCondition.PENDING_VOID.Status)
                           .compare("CheckNumber", NotEquals, null)
                           .compare("RecurringCheck", Equals, null)
                           .compare("StatusChangeDateExt", NotEquals, null)
                           .compare("PaymentMethod", NotEquals, PaymentMethod.TC_MANUAL)
                           .select(\ check -> new SuspectCheck(check.PublicID, SuspectCheckCondition.PENDING_VOID, check.StatusChangeDateExt, null))
                           
    for(suspect in pendingVoidChecks.iterator()){
      if(DateUtil.businessDaysBetween(suspect.StatusChangeDate, DateUtil.currentDate(), _cincinnati) > SuspectCheckCondition.PENDING_VOID.TriggerDays){
        _confirmedCheckSuspects.add(suspect)
      }
    }                                                     
  }
  
  
  /**
   * 
   */  
  private function bulkInvalidInvoiceItems(){
    var bulkInvalidChecks = Query.make(BulkInvoice)
                               .compare("Status", Equals, SuspectCheckCondition.INVALID_INVOICE_ITEMS.BulkStatus)                       
                               .select(\ check -> new SuspectCheck(check.PublicID, SuspectCheckCondition.INVALID_INVOICE_ITEMS, check.StatusChangeDateExt, null))
                               
    for(suspect in bulkInvalidChecks.iterator()){
        _confirmedBulkSuspects.add(suspect)
    }                                     
  }
  Private function bulkPendingApprovalInvoiceItems(){
    var bulkPendingApprovalChecks=Query.make(BulkInvoice)
                                      .compare("Status",Equals,SuspectCheckCondition.PENDING_APPROVAL_INVOICE_ITEMS.BulkStatus)
                                      .select(\ check -> new SuspectCheck(check.PublicID, SuspectCheckCondition.PENDING_APPROVAL_INVOICE_ITEMS, check.StatusChangeDateExt, null))
  for(suspect in bulkPendingApprovalChecks.iterator()){
    if(Suspect.StatusChangeDate!=null)
    {
      if(DateUtil.businessDaysBetween(suspect.StatusChangeDate, DateUtil.currentDate(), _cincinnati) > SuspectCheckCondition.PENDING_APPROVAL_INVOICE_ITEMS.TriggerDays){
        _confirmedBulkSuspects.add(suspect)
     
      }
      }
    }
  }
  
  private function bulkRequestingInvoiceItems(){
    var bulkPendingApprovalChecks=Query.make(BulkInvoice)
                                      .compare("Status",Equals,SuspectCheckCondition.REQUESTING_INVOICE_ITEMS.BulkStatus)
                                      .select(\ check -> new SuspectCheck(check.PublicID, SuspectCheckCondition.REQUESTING_INVOICE_ITEMS, check.StatusChangeDateExt, null))
    for(suspect in bulkPendingApprovalChecks.iterator()){
      _confirmedBulkSuspects.add(suspect)
    }
  }
                                      
  
  /**
   * convert the confirmed suspects into CheckStatusReportItems, then generate the email
   */
  private function report() {
    try{
      var body = templates.email.CheckStatusReport.renderToString(sortCheckStatusReportItems(createCheckReportItems()), sortBulkStatusReportItems(createBulkReportItems()))
      var emailAddys:String[] = ScriptParameters.CheckStatusReportEmail.toString().split(",")
      gw.api.email.EmailUtil.sendEmailWithBody(null, emailAddys[0], null, "ClaimCenterSupport@gaig.com", null, this.EmailSubject, body)
    }catch(e){
      throw e 
    }
  }
  
  
  private property get EmailSubject() : String{
    return "ClaimCenter Check Status Report" + (_env == "prod" ? "" : (" - " + _env))
  }
  
  
  private function emailError(e : Throwable){
    var body = "Exception occurred while generating Check Status Report. Check logs for full stack trace: " + e.Message
    var emailAddy = (_env == "prod" ? "ClaimCenterSupport@gaig.com" : "ClaimCenterTesting@gaig.com")
    gw.api.email.EmailUtil.sendEmailWithBody(null, emailAddy, null, "ClaimCenterSupport@gaig.com", null, "Check Status Report Exception" + _env, body)    
  }
  
  /**
   * 
   */
  private function createCheckReportItems() : List<CheckStatusReportItem>{
    var checkReportItems = new ArrayList<CheckStatusReportItem>(_confirmedCheckSuspects.size)

    for(suspect in _confirmedCheckSuspects){
      var checkReportItem = Query.make(Check).compare("PublicID", Equals, suspect.PublicID)
                                             .select(\ c -> new CheckStatusReportItem(c.Claim.PublicID, 
                                                                                      c.Claim.AssignedGroup.Name,
                                                                                      c.Claim.ClaimNumber,
                                                                                      c.CheckNumber,
                                                                                      c.Claim.AssignedUser.PublicID,
                                                                                      c.PublicID,
                                                                                      suspect.Condition,
                                                                                      c.CreateTime)).FirstResult
                                                    
      checkReportItems.add(checkReportItem)
    }       
    
    var nonProdLimit = 2000                     
    if(_env != "prod" && !checkReportItems.Empty && checkReportItems.Count > nonProdLimit){
      return checkReportItems.subList(0, nonProdLimit)
    }else{
      return checkReportItems
    }
  }
  
  private function createBulkReportItems() : List<BulkInvoiceStatusReportItem>{
    var bulkReportItems = new ArrayList<BulkInvoiceStatusReportItem>(_confirmedBulkSuspects.size)    

    for(suspect in _confirmedBulkSuspects){
      var bulkReportItem = Query.make(BulkInvoice).compare("PublicID", Equals, suspect.PublicID)
                                                  .select(\ b -> new BulkInvoiceStatusReportItem(suspect.Condition,
                                                                                                 b.BulkInvoiceIDExt,
                                                                                                 b.BulkInvoiceTypeExt,
                                                                                                 b.CheckNumber,
                                                                                                 b.BulkInvoiceTotal,
                                                                                                 b.CreateUser.PublicID,
                                                                                                 b.CreateTime,
                                                                                                 b.Payee.PublicID)).FirstResult
      bulkReportItems.add(bulkReportItem)                                                                                                 
    }
    
    var nonProdLimit = 2000                     
    if(_env != "prod" && !bulkReportItems.Empty && bulkReportItems.Count > nonProdLimit){
      return bulkReportItems.subList(0, nonProdLimit)
    }else{
      return bulkReportItems
    }
  }
  
  private function sortCheckStatusReportItems(checkReportItems : List<CheckStatusReportItem>) : List<CheckStatusReportItem>{
    return checkReportItems.orderBy(\ c -> c.ClaimNumber).thenBy(\ c -> c.CheckNumber)
  }
  
  private function sortBulkStatusReportItems(bulkReportItems : List<BulkInvoiceStatusReportItem>) : List<BulkInvoiceStatusReportItem>{
    return bulkReportItems.orderBy(\ b -> b.InvoiceNumber).thenBy(\ b -> b.CheckNumber)
  }  
}
