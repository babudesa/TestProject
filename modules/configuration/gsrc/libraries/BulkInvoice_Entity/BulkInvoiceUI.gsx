package libraries.BulkInvoice_Entity
uses java.util.ArrayList
uses com.guidewire.pl.web.controller.UserDisplayableException
uses libraries.BulkInvoiceUI.BulkInvoiceItemUIValidator
uses java.math.RoundingMode
uses util.financials.CheckFunctions

enhancement BulkInvoiceUI : entity.BulkInvoice {

  /**
  * Sets the escheat status whenever the payment method changes
  */
  protected function setEscheatStatus() {

    if (this.PaymentMethod == PaymentMethod.TC_MANUAL) {
      this.EscheatStatusExt = CheckEscheatStatusExt.TC_NOTAPPLICABLE
    } else {
      this.EscheatStatusExt = CheckEscheatStatusExt.TC_ESCHEATABLE
    }
  }

  /**
  * Performs actions when the PaymentMethod is changed
  * on the Bulk Invoices UI.
  */
  function PaymentMethod_OnChange() {

    this.ManualPaymentMethodExt = null
    this.IssueDate = null
    this.CheckNumber = null
    this.PrefixExt = null
    this.DraftRegionExt = null
    this.setEscheatStatus()
    this.setBankAccount()
  }

  /**
  * Handles additional tasks required when
  * the bulk invoice is updated on the UI and the
  * Update button is pressed
  */
  function BulkInvoice_OnUpdate() {
    this.validateAddresses()
    this.validateAllLineItems()
    this.syncPayeeAddresses()
    if(this.PaymentMethod == PaymentMethod.TC_CHECK){
      this.generateCheckNumber()
    }
    this.resetBulkInvoiceToDraft()
    this.resetLineItemsToDraft()
  }
  
  /**
  * Handles additional tasks required when
  * the bulk invoice "Submit" button is pressed
  */
  function BulkInvoice_OnSubmit() {
    if(this.Status == BulkInvoiceStatus.TC_REJECTED) {
      this.Status = BulkInvoiceStatus.TC_DRAFT
      this.InvoiceItems.each(\ item -> {
       item.Status = BulkInvoiceItemStatus.TC_DRAFT
     })
    }
  }
  
  /**
   * Reset BIN to draft on any edit of the BIN
   */
   public function resetBulkInvoiceToDraft() {
     if(!this.ChangedFields.Empty && 
       (this.Status == BulkInvoiceStatus.TC_REJECTED || this.Status == BulkInvoiceStatus.TC_AWAITINGSUBMISSION)) {
         this.Status = BulkInvoiceStatus.TC_DRAFT
     }
   }  
  
  /**
  * Handles resetting the line items to draft state after the BIN has
  * been edited or resubmitted for approval after already being rejected.
  */
  public function resetLineItemsToDraft() {
        
    if(this.Status == BulkInvoiceStatus.TC_DRAFT) {
      
      this.InvoiceItems.each(\ item -> {
             item.Status = BulkInvoiceItemStatus.TC_DRAFT
           })       
    }    
  }  
  
  /**
  * Sets the Bulk Invoice Reportability
  */
  public function setBulkInvoiceReportability() {
    
    if(this.BankAccountExt == BankAccount.TC_TOMIC){      
      this.Reportability = typekey.ReportabilityType.TC_NOTREPORTABLE     
    
    } else if(this.InvoiceItems.Count > 0 && exists(costType in this.InvoiceItems*.CostType 
                                             where CheckFunctions.is1099ReportableCostType(costType)) == false) {        
        
        this.Reportability = typekey.ReportabilityType.TC_NOTREPORTABLE    
   
    } else if (this.InvoiceItems.Count == 0 && this.BankAccountExt != BankAccount.TC_TOMIC && (!(this.Payee typeis NonVendorPayeeCompanyExt)) && (!(this.Payee typeis NonVendorPayeePersonExt))) {
      
      this.Reportability = typekey.ReportabilityType.TC_REPORTABLE
    }
    
    if(this.Payee typeis NonVendorPayeeCompanyExt || this.Payee typeis NonVendorPayeePersonExt){
      
      this.Reportability = typekey.ReportabilityType.TC_NOTREPORTABLE
    }
  }

  /**
  * Validates all bulk invoice line items when BIN is saved
  */
  protected function validateAllLineItems() {
    var errors = new ArrayList <String> ()

      if (this.validatePolicyCurrency() != null) {
        errors.add(this.validatePolicyCurrency())
      }
      if (this.validateCostTypes() != null) {
        errors.add(this.validateCostTypes())
      }
      if(this.BankAccountExt == BankAccount.TC_TOMIC && this.validateForTOMIC() != null){
        errors.add(this.validateForTOMIC())
      }

      if (errors.HasElements) {
        throw new UserDisplayableException(errors.toTypedArray())
      }
  }

  /**
  * Syncs the payees address to the address book if it is new
  */
  public function syncPayeeAddresses() {
 
 if(this.PayTo == this.ex_MailTo as java.lang.String){
     if (this.PayToAddressExt != null && this.PayToAddressExt.New 
         && this.PayToAddressExt==this.MailToAddressExt) {
        //add address to addresses array on contact
             this.Payee.addAddress(this.PayToAddressExt)
            //sync the contact with AB if it was pulled from AB
                if (this.Payee.AddressBookUID != null) {
                      this.Payee.updateAddressBook(true)
                 }else if(this.MailToAddressExt != null && this.MailToAddressExt.New){
                   //add address to addresses array on contact
             this.Payee.addAddress(this.PayToAddressExt)
            //sync the contact with AB if it was pulled from AB
                if (this.Payee.AddressBookUID != null) {
                      this.Payee.updateAddressBook(true)
                 }
                 }
     }else if(this.PayToAddressExt.New && this.MailToAddressExt.New && 
              this.PayToAddressExt!=this.MailToAddressExt){
                      this.Payee.addAddress(this.PayToAddressExt)
                      this.Payee.addAddress(this.MailToAddressExt)
                        if(this.Payee.AddressBookUID != null){
                          this.Payee.updateAddressBook(true) 
                         }
    } 
    }else{
           if (this.PayToAddressExt != null && this.PayToAddressExt.New) {
        //add address to addresses array on contact
             this.Payee.addAddress(this.PayToAddressExt)
            //sync the contact with AB if it was pulled from AB
                if (this.Payee.AddressBookUID != null) {
                      this.Payee.updateAddressBook(true)
                 }
           }
      
    }

    }

  /**
  * Performs the policy currency validation on the line items
  */
  @Returns("Any validation error messages")
  public function validatePolicyCurrency() : String {
    var validator = new BulkInvoiceItemUIValidator()
      var error : String
      error = validator.validatePolicyCurrency(this.InvoiceItems.toList())
      return error
  }

  /**
  * Validates the Cost Types on the bulk invoice
  */
  @Returns("Any validation error messages")
  public function validateCostTypes() : String {
    var validator = new BulkInvoiceItemUIValidator()
      var error : String
      error = validator.validateCostTypes(this.InvoiceItems*.CostType.toList())
      return error
  }
  
  /**
  * Validates the Cost Types on the bulk invoice
  */
  @Returns("Any validation error messages")
  public function validateForTOMIC() : String {
    var validator = new BulkInvoiceItemUIValidator()
      var error : String
      error = validator.validateTomicBIN(this.InvoiceItems.toList())
      return error
  }
  
  
  /**
  * Sets the Bank Account
  */
  public function setBankAccount() {

    if (this.ManualPaymentMethodExt == ManualPaymentMethod.TC_TOMIC) {
      this.BankAccountExt = BankAccount.TC_TOMIC

    } else if (this.InvoiceItems.HasElements && this.InvoiceItems[0].Claim.Policy.CurrencyTypeExt == CurrencyTypeExt.TC_CAD) {

      this.BankAccountExt = BankAccount.TC_ROYAL_BANK_OF_CANADA

    } else {
      this.BankAccountExt = BankAccount.TC_NATIONAL_CITY
    }
  }

  /**
  * Validates the CheckNumber field on the Check for a Manual Check
  */
  @Returns("The Validation Message for the Check Number")
  function validateManualCheckNumber() : String {

    var paymentMethod = this.ManualPaymentMethodExt
      var validationMessage : String = null
      var checkNumberRegEx : String = null

      if (paymentMethod == ManualPaymentMethod.TC_TOMIC) {

        checkNumberRegEx = "\\d{10}"
          validationMessage = "Must be 10 digits for a manual TOMIC check."
      } else {

        checkNumberRegEx = "\\d{6}"
          validationMessage = "Must be 6 digits for a manual check."
      }

      return this.isManualCheckNumberValid(checkNumberRegEx) ? null : validationMessage
  }

  /**
  * Given a regular expression, checks the validity of a this Checks Check Number
  */
  @Param("checkNumberRegEx", "the regular expression to validate the check number with")
  @Returns("Is the check number valid")
  function isManualCheckNumberValid(checkNumberRegEx : String) : boolean {

    var isValid = false

      if (this.CheckNumber == null || !this.CheckNumber.matches(checkNumberRegEx)) {
        isValid = false
      } else {
        isValid = true
      }
      return isValid
  }

  /**
  * Checks to see if the Check Prefix field should be visibleN
  */
  property get isCheckPrefixVisible() : boolean {

    var manPaymentMethod = this.ManualPaymentMethodExt
      var isVisible = false

      if (this.PaymentMethod != PaymentMethod.TC_MANUAL) {
        isVisible = false
      } else if (manPaymentMethod == ManualPaymentMethod.TC_MANUAL || manPaymentMethod == ManualPaymentMethod.TC_TOMIC) {
        isVisible = false
      } else {
        isVisible = true
      }
      return isVisible
  }

  /**
  * Checks to see if the Draft Region field should be visible
  */
  property get isDraftRegionVisible() : boolean {

    var manPaymentMethod = this.ManualPaymentMethodExt
      var isVisible = false

      if (this.PaymentMethod != PaymentMethod.TC_MANUAL) {
        isVisible = false
      } else if (manPaymentMethod == ManualPaymentMethod.TC_MANUAL) {
        isVisible = true
      } else {
        isVisible = false
      }
      return isVisible
  }

  /**
  * Performs actions when the ManualPaymentMethod is changed
  * on the Bulk Invoices UI.
  */
  function ManualPaymentMethod_OnChange() {

    var manPayMethod = this.ManualPaymentMethodExt

      this.DraftRegionExt = null
      this.PrefixExt = null

      if (manPayMethod == ManualPaymentMethod.TC_EFT || manPayMethod == ManualPaymentMethod.TC_VOUCHER) {
        this.PrefixExt = CheckPrefixExt.TC_991
      }
      this.setBankAccount()
  }

  /**
  * Splits the BIN total amount between line items evenly
  */
  public function splitBulkInvoiceItems() {

    var invoiceTotal = this.BulkInvoiceTotal.Amount.setScale(2)
    var totalInvoiceItems = this.InvoiceItems.Count

    if (this.SplitEqually == true && totalInvoiceItems > 0) {

      var itemIterator = this.InvoiceItems.toList().iterator()
      var eachItemTotal = invoiceTotal.divide(totalInvoiceItems, RoundingMode.HALF_UP)
      var remainder = this.BulkInvoiceTotal.Amount - eachItemTotal.multiply(totalInvoiceItems)
      var item : BulkInvoiceItem = null 
      while (itemIterator.hasNext()) {
        item = itemIterator.next()
        if (itemIterator.hasNext()) {
          item.Amount = eachItemTotal
        } else {
          item.Amount = eachItemTotal + remainder
        }    
      }
    }  
  }

  /**
  * 
  */
  public function getPaymentMethods() : List {
    var results : List = new ArrayList()

    for (method in PaymentMethod.getTypeKeys(false)) {
      if (method.Code != "eft") {
        results.add(method)
      }
    }
    return results
  }
  
  
  /**
  * Generate the BIN check number based on the current bank account
  */ 
  protected function generateCheckNumber() {
    var checkNumber : String = null
        
    if (this.Status == BulkInvoiceStatus.TC_DRAFT) {
      if(this.BankAccountExt == BankAccount.TC_NATIONAL_CITY){
        checkNumber = util.UniqueNumberGenerators.generateNationalBankCheckNumber(); 
      }
      else if(this.BankAccountExt ==  BankAccount.TC_ROYAL_BANK_OF_CANADA){
        checkNumber = util.UniqueNumberGenerators.genetateRBCCheckNumber();
      }
      this.CheckNumber = checkNumber
    }
  }
  function checkAddress(){
    
   if(this.DeliveryMethod == "hold"){
        this.ex_MailTo = User.util.CurrentUser.Contact
        this.MailTo=User.util.CurrentUser.Contact.DisplayName
        this.MailToAddressExt = User.util.CurrentUser.Contact.PrimaryAddress 
        /*Commented for Defect #8527*/
      /*for(each in User.util.CurrentUser.Contact.AllAddresses){
        if(each.AddressType ==  "business"){
          this.ex_MailTo = User.util.CurrentUser.Contact
          this.MailTo=User.util.CurrentUser.Contact.DisplayName
          this.MailToAddressExt = each
        }
      }*/
    }
    else if( this.DeliveryMethod == "send"){ //make sure to clear out agency or agent mail to if mail to recipient is chosen
    if(this.ex_MailTo == User.util.CurrentUser.Contact){
        this.ex_MailTo = this.Payee
        this.MailTo=this.Payee.DisplayName
        this.MailToAddressExt=null
      }
    /*Added for Defect #8527*/
    else{
        this.ex_MailTo = this.Payee
        this.MailTo=this.Payee.DisplayName
        this.MailToAddressExt=this.PayToAddressExt
      }  
    }
  }
  function setAttention()
  {
    if(this.DeliveryMethod=="hold")
    {
      this.AttentionMailToExt=User.util.CurrentUser.DisplayName
    }
    else
    {
      this.AttentionMailToExt="";
    }
  }
  
function defaultUserCompany():String {
    var addy:String = ""
    if(this.DeliveryMethod == "hold"){
       
        addy = displaykey.GAIC.Check.ReturnToOffice.DefaultCompany
    }
    return addy;
  }
  
  /*
  Author:Ndasari
  Defect #7133
  Currently, the Mailing Address does not identify Great American or the Business Unit.  
  It only identifies the Creator's Name, then the Attn: line repeats the name.  This is not correct.
  */
  
   function getMailtoAddressAttn():String {
        var mailToString=""
        var attentionMailToString=(this.AttentionMailToExt!=null)?"Attn: "+this.AttentionMailToExt+", ":""
        var divisionName : String =(this.CreateUser.GroupUsers[0].Group.DivisionNameExt.DivisionNameValue==null?"":this.CreateUser.GroupUsers[0].Group.DivisionNameExt.DivisionNameValue+", ")
           if(this.DeliveryMethod == "hold"){
                mailToString=displaykey.GAIC.Check.ReturnToOffice.DefaultCompany + ", "+divisionName+attentionMailToString+this.MailToAddressExt
           }else{
               mailToString = attentionMailToString+this.MailToAddressExt
           }
           return mailToString;
  }
  
  function validateAddresses() {
    if(((!this.Payee.AllAddresses.contains(this.PayToAddressExt) and this.PayToAddressExt.AddressType == AddressType.TC_MAILING) 
        or (!this.Payee.AllAddresses.contains(this.MailToAddressExt) and this.MailToAddressExt.AddressType == AddressType.TC_MAILING)) 
        and this.Payee.AllAddresses.where(\ a -> a.AddressType == AddressType.TC_MAILING ).length >= 20){
      throw new UserDisplayableException("The number of mailing addresses exceeds 20. Additional mailing addresses may be added to the contact on the Related Contacts tab in Address Book.")
    }
  }
  /**
   * temporarily hide the new TPA related values from this Sprint
   * as TPA is not going to production yet as of June 21, 2017  --kmolnar2
   * the invokation of this filter should be taken out when TPA - Athens is going to production
   */
     public function filterManualPaymentMethodExternal(value : ManualPaymentMethod) : boolean {
        
        var showValue : boolean = null
        var env = gw.api.system.server.ServerUtil.getEnv();
        
        if(value == ManualPaymentMethod.TC_TPA and (env=="uat" or env=="cert" or env=="prod") ){

         // do not enable yet in production
                showValue = false
            }else {
                showValue = true
            }
        return showValue
    }  

} //End BulkInvoiceUI
