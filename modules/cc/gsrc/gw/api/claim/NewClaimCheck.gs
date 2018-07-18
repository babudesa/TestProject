package gw.api.claim
uses gw.api.financials.AbstractMutablePairedMoney
uses java.math.BigDecimal
uses gw.api.financials.IMoney

@Export
class NewClaimCheck extends NewClaimCheckBase {

  private var _EFTData : EFTData as EFTData = null 
  private var _bankName : String as BankName = null 
  private var _bankAccountType : BankAccountType as BankAccountType = null
  private var _bankAccountNumber : String as BankAccountNumber = null 
  private var _bankRoutingNumber : String as BankRoutingNumber = null 
  private var _paymentMethod : PaymentMethod as PaymentMethod = typekey.PaymentMethod.TC_CHECK
  
  /**
   * @param claim   Claim the check belongs to
   */
  construct(claim : Claim) {
    super(claim)
  }

  /**
   * This method is used to set additional fields during NewClaimCheckBase.create().
   * After check is created, this method is called to set some additional fields.
   * In this method, check's EFT related fields are set to the values stored.
   * @param check  Check to set fields on
   */
  override function populateAdditionalCheckFields(check : Check) {
    if (_paymentMethod == typekey.PaymentMethod.TC_EFT) {
      check.EFTData = _EFTData
      check.BankAccountNumber = _bankAccountNumber
      check.BankName = _bankName
      check.BankAccountType = _bankAccountType
      check.PaymentMethod = _paymentMethod
      check.BankRoutingNumber = _bankRoutingNumber
      check.PayTo = PayTo
      check.MailToAddress = null
      check.MailTo = null
      check.DeliveryMethod = null
    } 
  }
}
