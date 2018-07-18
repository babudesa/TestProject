package util.gaic.checkstatusreport

enum SuspectCheckCondition {
  
  PENDING_APPROVAL(5, TransactionStatus.TC_PENDINGAPPROVAL, null, "Pending Approval"),
  AWAITING_SUBMISSION(1, TransactionStatus.TC_AWAITINGSUBMISSION, null, "Awaiting Submission"),
  REQUESTING(1, TransactionStatus.TC_REQUESTING, null, "Requesting"),
  ISSUED_NO_PRINT_DATE(1, TransactionStatus.TC_ISSUED, null, "Issued without print date"),
  ISSUED_NO_ISSUE_DATE(1, TransactionStatus.TC_ISSUED, null, "Issued without issue date"),
  PENDING_STOP(5, TransactionStatus.TC_PENDINGSTOP, null, "Pending Stop"),
  PENDING_VOID(5, TransactionStatus.TC_PENDINGVOID, null, "Pending Void"),
  INVALID_INVOICE_ITEMS(1, null, BulkInvoiceStatus.TC_INVALIDITEMS, "Invalid Invoice Items"),
  PENDING_APPROVAL_INVOICE_ITEMS(5, null, BulkInvoiceStatus.TC_INREVIEW, "Pending Approval Invoice Items"),
  REQUESTING_INVOICE_ITEMS(1, null, BulkInvoiceStatus.TC_REQUESTING, "Requesting Invoice Items")
  
  
  
  private var _triggerDays : int as TriggerDays
  private var _status  : TransactionStatus as Status
  private var _bulkStatus : BulkInvoiceStatus as BulkStatus
  private var _reason : String
  
  property get Reason() : String{
    var dayVariant = _triggerDays == 1 ? " day" : " days"
    return _reason + " for more than " + _triggerDays + dayVariant
  }
  
  property get TriggerHours() : int{
    return _triggerDays * 24 
  }
  
  private construct(numTriggerDays : int, transactionStatus : TransactionStatus, bulkInvoiceStatus : BulkInvoiceStatus, triggerReason : String){
    _triggerDays = numTriggerDays
    _status = transactionStatus
    _bulkStatus = bulkInvoiceStatus
    _reason = triggerReason
  }
  
}
