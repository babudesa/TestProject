package gaic.import.bill.validation



/**
 * Record import validator for the Athens TPA payment
 * import integration.  
 * There may be a need to customize for Athens in the future
 * this class will facilitate that 
 * 
 */
class AthensTpaPaymentImportValidator extends TpaPaymentImportValidator {

  construct(paymentImportRecord : BillImportRecordExt) {
    super(paymentImportRecord)
  }
}
