package gaic.import.bill.multi
uses java.text.SimpleDateFormat

class OccmMultiBillImporter extends MultiBillImporter {

  private static final var OCCM_MCO_ROLE = "OneCallMCORole"
  private static final var OCCM_DOC_ROLE = "OneCallDocRole"
  
  construct(bills : BillImportRecordExt[]) {
    super(bills)
  }

  override property get ThisBulkInvoiceType() : BulkInvoiceType {
    return typekey.BulkInvoiceType.TC_ONECALLCARE
  }

  override property get VendorMCONamespace() : String {
    return OCCM_MCO_ROLE
  }

  override property get VendorDocNamespace() : String {
    return OCCM_DOC_ROLE
  }


  override function getMemo(sourceSys : SourceSystemExt) : String {
    var currDate = gw.api.util.DateUtil.currentDate()
    var sdf = new SimpleDateFormat("MM/dd/yyyy")    
        
    return "One Call Care Reimbursement " + sdf.format(currDate)
  }

}
