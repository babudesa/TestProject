package pcf_gs.bulkinvoice

enum BulkInvoiceStatusFilters{
  
  ALL("All Status Types", BulkInvoiceStatus.getTypeKeys(false)),
  DRAFT("Draft", {BulkInvoiceStatus.TC_DRAFT}),
  PENDING_APPROVAL("Pending Approval", {BulkInvoiceStatus.TC_INREVIEW}),
  PENDING_ITEM_VALIDATION("Pending Bulk Invoice Item Validation", {BulkInvoiceStatus.TC_PENDINGITEMVALIDATION}),
  INVALID_ITEMS("Invalid Items", {BulkInvoiceStatus.TC_INVALIDITEMS}),
  AWAITING_SUBMISSION("Awaiting Submission", {BulkInvoiceStatus.TC_AWAITINGSUBMISSION}),
  REQUESTING("Requesting", {BulkInvoiceStatus.TC_REQUESTING}),
  REQUESTED("Requested", {BulkInvoiceStatus.TC_REQUESTED}),
  CLEARED("Cleared", {BulkInvoiceStatus.TC_CLEARED}),
  ISSUED("Issued", {BulkInvoiceStatus.TC_ISSUED}),
  REJECTED("Rejected", {BulkInvoiceStatus.TC_REJECTED}),
  PENDING_VOID("Pending Void", {BulkInvoiceStatus.TC_PENDINGVOID}),
  PENDING_STOP("Pending Stop", {BulkInvoiceStatus.TC_PENDINGSTOP}),
  VOIDED("Voided", {BulkInvoiceStatus.TC_VOIDED}),
  STOPPED("Stopped", {BulkInvoiceStatus.TC_STOPPED}),
  ON_HOLD("On Hold", {BulkInvoiceStatus.TC_ONHOLD})
  
  private var _displayVal : String as readonly DisplayValue
  private var _typeCodes : List<BulkInvoiceStatus> as readonly TypeCodeList
  
  private construct(displayVal : String, typeCodes : List<BulkInvoiceStatus>){
    _displayVal = displayVal
    _typeCodes = typeCodes
  }
}
