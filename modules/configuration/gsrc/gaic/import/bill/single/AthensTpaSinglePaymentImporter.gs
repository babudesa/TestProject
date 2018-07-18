package gaic.import.bill.single

/**
 * Single Payment Importer for the Athens TPA Payment integration
 * There may be a need to customize for Athens in the future
 * this class will facilitate that. * 
 */
class AthensTpaSinglePaymentImporter extends TpaSinglePaymentImporter {

  construct(payment : BillImportRecordExt) {
    super(payment)
  }  
  
  
  override property get CheckCategory() : CheckCategoryExt {
    return CheckCategoryExt.TC_ATHENS
  }

}
