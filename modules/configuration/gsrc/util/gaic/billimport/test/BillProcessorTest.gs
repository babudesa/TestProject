package util.gaic.billimport.test
uses gw.api.util.DateUtil
uses gaic.webservice.cc.BillImportAPI
uses gw.api.database.Query
uses java.text.SimpleDateFormat

class BillProcessorTest {

  var _bill : BillImportRecordExt
  var _importResult : BillImportResultExt as ImportResult
  var _testResult : boolean as TestResult
  var _check : Check
  
  construct() {
    initBillImportRecordExt()
  }
  
  private function initBillImportRecordExt(){
    _bill = new BillImportRecordExt()
    _bill.ClaimNumber = "A10000033"
    _bill.VendorTaxID = "789996654"
    _bill.InvoiceNumber = "12072"
    _bill.ServiceFromDate = DateUtil.currentDate().addDays(-30)
    _bill.ServiceToDate = DateUtil.currentDate()
    _bill.OriginalAmount = 400
    _bill.FinalAmount = 200
    _bill.ExpenseCode = "504"
    _bill.VendorBillID = "VBillID2"
    _bill.OriginalInvoiceDate = DateUtil.currentDate().addDays(-90)
    _bill.GAIReceivedDate = DateUtil.currentDate().addDays(-15)
    _bill.SourceSystem = SourceSystemExt.TC_MITCHELL_SA
    _bill.ExternalLinkID = "ExtLinkID002"
  }
  
  
  public function test(){
    var api = new BillImportAPI()
    _importResult = api.processBill(_bill)
    _testResult = validateCheckAndResult()
  }
  
  
  private function validateCheckAndResult() : boolean{
    var checkResult = false
    var claim = Query.make(Claim).compare("ClaimNumber", Equals, "A10000033").select().AtMostOneRow
    //get the most recently created check, then verify each field of interest is populated with the correct value
    _check = (claim.ChecksQuery.toList() as List<Check>).maxBy(\ c -> c.CreateTime)
    
    checkResult = PayToAppearingOnCheck &&
                  PayToAddress &&
                  Memo &&
                  GrossAmountExt &&
                  Reportability &&
                  LineItemDeductionsTotal &&
                  CheckNumber &&
                  BankAccount &&
                  InvoiceNumber &&
                  BulkInvoiceNumber &&
                  ClaimantName &&
                  MailTo &&
                  AttentionMailToExt &&
                  MailToAddress &&
                  PmtMethod &&
                  ProducerCopy &&
                  CheckBatching &&
                  DeliveryMethod &&
                  CheckInstructions &&
                  CheckStatus &&
                  IssueDate &&
                  DatePrinted &&
                  EscheatStatus &&
                  DateEndorsed &&
                  ScheduledSendDate &&
                  CreateUser &&
                  CheckCategoryExt &&
                  RecurringCheck &&
                  PayeeName &&
                  PayeeType &&
                  Amount &&
                  CostType &&
                  CostCategory &&
                  LineCategory                     
                  
    
    return checkResult && validateResult()
  }

  private function validateResult() : boolean{
    return _importResult.Status == BillImportStatusExt.TC_PROCESSED &&
           _importResult.ExternalLinkID == "ExtLinkID002" &&
           _importResult.ErrorMessage == null
  }
  
  private function log(fieldName : String, value : boolean) : boolean{
    if(!value)
      print(fieldName + ": " + value)
      
    return value
  }
  
  property get PayToAppearingOnCheck() : boolean{
    return log("PayToAppearingOnCheck", _check.getPayToAppearingOnCheck() == "DOCTOR JAY\n")
  }
  
  property get PayToAddress() : boolean{
    return log("PayToAddress", _check.ex_PayToAddress.DisplayName == "12 Main Street, Cincinnati, OH 45102")  
  }
  
  property get Memo() : boolean{
    return log("Memo", _check.Memo == "Invoice Number 12072, Date(s) of Service 05/24/2015 - 06/23/2015") 
  }
  
  property get GrossAmountExt() : boolean{
    return log("GrossAmountExt", _check.Payments[0].LineItems[0].GrossAmountExt == _bill.FinalAmount) 
  }
  
  property get Reportability() : boolean{
    return log("Reportability", _check.Reportability == ReportabilityType.TC_REPORTABLE)
  }
  
  property get LineItemDeductionsTotal() : boolean{
    return log("LineItemDeductionsTotal", _check.LineItemDeductionsTotal == 0)
  }
  
  property get CheckNumber() : boolean{
    return log("CheckNumber", _check.CheckNumber != null)
  }
  
  property get BankAccount() : boolean{
    return log("BankAccount", _check.BankAccount == typekey.BankAccount.TC_NATIONAL_CITY)
  }
  
  property get InvoiceNumber() : boolean{
    return log("InvoiceNumber", _check.InvoiceNumber == "12072")
  }
  
  property get BulkInvoiceNumber() : boolean{
    return log("BulkInvoiceNumber", _check.BulkInvoiceNumber == "<none>")
  }
  
  property get ClaimantName() : boolean{
    return log("ClaimantName", _check.Claimant.DisplayName == "Injured Worker1")
  }
  
  property get MailTo() : boolean{
    return log("MailTo", _check.MailTo == "Doctor Jay")
  }
  
  property get AttentionMailToExt() : boolean{
    return log("AttentionMailToExt", _check.AttentionMailToExt == null)
  }
  
  property get MailToAddress() : boolean{
    return log("MailToAddress", _check.MailToAddress == "Tax|12 Main Street|null|US|Cincinnati|OH|45102|cclu:8205|null|null")
  }
  
  property get PmtMethod() : boolean{
    return log("PaymentMethod", _check.PaymentMethod == PaymentMethod.TC_CHECK)
  }
  
  property get ProducerCopy() : boolean{
    return log("ProducerCopy", _check.ex_ProducerCopy == YesNo.TC_NO)
  }
  
  property get CheckBatching() : boolean{
    return log("CheckBatching", _check.CheckBatching == typekey.CheckBatching.TC_APDEFAULT)
  }
  
  property get DeliveryMethod() : boolean{
    return log("DeliveryMethod", _check.DeliveryMethod == typekey.DeliveryMethod.TC_SEND)
  }
  
  property get CheckInstructions() : boolean{
    return log("CheckInstructions", _check.CheckInstructions == CheckHandlingInstructions.TC_DEFAULT)
  }
  
  property get CheckStatus() : boolean{
    return log("CheckStatus", _check.Status == TransactionStatus.TC_AWAITINGSUBMISSION)
  }
  
  property get IssueDate() : boolean{
    return log("IssueDate", _check.IssueDate == null)
  }
  
  property get DatePrinted() : boolean{
    return log("DatePrinted", _check.ex_DatePrinted == null)
  }
  
  property get EscheatStatus() : boolean{
    return log("EscheatStatus", _check.EscheatStatusExt == CheckEscheatStatusExt.TC_ESCHEATABLE)
  }
  
  property get DateEscheated() : boolean{
    return log("DateEscheated", _check.DateEscheatedExt == null)
  }
  
  property get DateEndorsed() : boolean{
    return log("DateEndorsed", _check.ex_DateEndorsed == null)
  }
  
  property get ScheduledSendDate() : boolean{
    var sdf = new SimpleDateFormat("MM/dd/yyyy")
    return log("ScheduledSendDate", sdf.format(_check.ScheduledSendDate) == sdf.format(DateUtil.currentDate()))
  }
  
  property get CreateUser() : boolean{
    return log("CreateUser", _check.CreateUser.DisplayName == "Batch Superuser")
  }
  
  property get CheckCategoryExt() : boolean{
    return log("CheckCategoryExt", _check.CheckCategoryExt == typekey.CheckCategoryExt.TC_MITCHELL)
  }
  
  property get RecurringCheck() : boolean{
    return log("RecurringCheck", _check.RecurringCheck == null)
  }
  
  property get PayeeName() : boolean{
    return log("PayeeName", _check.Payees[0].ClaimContact.DisplayName == "Doctor Jay")
  }
  
  property get PayeeType() : boolean{
    return log("PayeeType", _check.Payees[0].PayeeType == ContactRole.TC_VENDOR)
  }
  
  property get Amount() : boolean{
    return log("Amount", _check.Payments[0].Amount == 200)
  }
  
  property get CostType() : boolean{
    return log("CostType", _check.Payments[0].ReserveLine.CostType == typekey.CostType.TC_CLAIMCOST)
  }
  
  property get CostCategory() : boolean{
    return log("CostCategory", _check.Payments[0].ReserveLine.CostCategory == typekey.CostCategory.TC_UNSPECIFIED)
  }
  
  property get LineCategory() : boolean{
    return log("LineCategory", _check.Payments[0].LineItems[0].LineCategory == typekey.LineCategory.TC_ANESTHESIOLOGIST)
  } 
}
