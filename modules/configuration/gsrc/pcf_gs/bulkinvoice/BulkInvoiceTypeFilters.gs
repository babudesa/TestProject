package pcf_gs.bulkinvoice

enum BulkInvoiceTypeFilters{
  
  ALL("All BIN Types", BulkInvoiceType.getTypeKeys(false)),
  OTHER("Other (Manual)", {BulkInvoiceType.TC_OTHER}),
  LIT_ADVISOR("Lit Advisor", {BulkInvoiceType.TC_LIT_ADVISOR}),
  MITCHELL("Mitchell", {BulkInvoiceType.TC_MITCHELL}),
  HEALTHCARE_SOLUTIONS("Healthcare Solutions", {BulkInvoiceType.TC_HEALTHSOLUTION}),
  ONE_CALL_CARE("One Call Care", {BulkInvoiceType.TC_ONECALLCARE})
  
  private var _displayVal : String as readonly DisplayValue
  private var _typeCodes : List<BulkInvoiceType> as readonly TypeCodeList
  
  private construct(displayVal : String, typeCodes : List<BulkInvoiceType>){
    _displayVal = displayVal
    _typeCodes = typeCodes
  }
}
