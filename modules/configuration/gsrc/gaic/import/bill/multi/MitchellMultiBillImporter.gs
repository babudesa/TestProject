package gaic.import.bill.multi
uses java.text.SimpleDateFormat
uses util.gaic.billimport.injurytype.InjuryTypeUtil
uses java.lang.Exception


class MitchellMultiBillImporter extends MultiBillImporter {

  private static final var MITCHELL_MCO_ROLE = "MitchellMCORole" 
  private static final var MITCHELL_DOC_ROLE = "MitchellDocRole"
  
  construct(bills : BillImportRecordExt[]) {
    super(bills)
  }

  override property get ThisBulkInvoiceType() : BulkInvoiceType {
    return typekey.BulkInvoiceType.TC_MITCHELL
  }

  override property get VendorMCONamespace() : String {
    return MITCHELL_MCO_ROLE
  }

  override property get VendorDocNamespace() : String {
    return MITCHELL_DOC_ROLE
  }


  override function getMemo(sourceSys : SourceSystemExt) : String {
    var memo = ""
    
    switch(sourceSys){
      case SourceSystemExt.TC_MITCHELL_SA_HDL_FEE: memo = "Mitchell Handling Fees GAIG 536665"; break
      case SourceSystemExt.TC_MITCHELL_DATACARE_UR: 
        var currDate = gw.api.util.DateUtil.currentDate()
        var sdf = new SimpleDateFormat("MM/yyyy")            
        memo = "Mitchell UR Fees " + sdf.format(currDate)+ " GAIG 536665"; break
    }
    
    return memo
  }

  /**
   * Overidden so that the original amount and date fields can be excluded for Mitchell Datacare UR
   */
  protected override function buildHolder(bill : BillImportRecordExt, item : BulkInvoiceItem, claim : Claim){
    var holder = new BillHolderExt()
    holder.VendorBillIDExt = bill.VendorBillID
    //original fields are not applicable for Mitchell UR fees
    if(bill.SourceSystem != SourceSystemExt.TC_MITCHELL_DATACARE_UR){
      holder.OrigBillAmtExt = bill.OriginalAmount
      holder.OrigInvoiceDateExt = bill.OriginalInvoiceDate
    }
    holder.GAIInvoiceRecDateExt = bill.GAIReceivedDate
    holder.InvoiceItem = item
    holder.SourceSystem = bill.SourceSystem
    holder.AdditionalRole = getAdditionalRole(bill)      
    holder.WCInjuryType = InjuryTypeUtil.getInjuryType(claim)    
  }

}
