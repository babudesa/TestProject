package gaic.import.bill.multi
uses java.text.SimpleDateFormat

class HcsMultiBillImporter extends MultiBillImporter {
  
  private static final var HCS_MCO_ROLE = "HealthcareMCORole"
  private static final var HCS_DOC_ROLE = "HealthcareDocRole" 
  
  construct(bills : BillImportRecordExt[]) {
    super(bills)
  }


  override property get ThisBulkInvoiceType() : BulkInvoiceType {
    return typekey.BulkInvoiceType.TC_HEALTHSOLUTION
  }

  override property get VendorMCONamespace() : String {
    return HCS_MCO_ROLE
  }

  override property get VendorDocNamespace() : String {
    return HCS_DOC_ROLE
  }


  override function getMemo(sourceSys : SourceSystemExt) : String {
    var currDate = gw.api.util.DateUtil.currentDate()
    var sdf = new SimpleDateFormat("MM/dd/yyyy")    
    
    return "HCS Reimbursement " + sdf.format(currDate)
  }

}
