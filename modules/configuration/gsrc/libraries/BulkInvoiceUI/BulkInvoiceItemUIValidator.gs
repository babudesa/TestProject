package libraries.BulkInvoiceUI

uses pcf.GeneralErrorWorksheet
uses java.util.ArrayList

/**
 * Handles UI validation for Bulk Invoice screens
 */
class BulkInvoiceItemUIValidator {

  private var _isLineItemValid : boolean
  private var _invoiceItem : BulkInvoiceItem
  private var _errorMessages : List <String>

  construct() {}

  construct(invoiceItem : BulkInvoiceItem) {
    this._isLineItemValid = false
    this._invoiceItem = invoiceItem
    this._errorMessages = new ArrayList <String>()
  }

  /**
  * Validates the line item
  */
  public function validateLineItem() {

    if (this._invoiceItem.ClaimNumber != null) {
      this.validateExposures()
      this.validatePolicyCurrency()
      this.validateReserveLineCostTypes()
      this.validateTomicBIN()
      this.validateCostTypes()
      this.setIsLineItemValid()
      this.displayAllErrorsToUser()
    }
  }

  /**
  * Indicator as to whether or not the line item is valid
  */
  public property get IsLineItemValid() : boolean {
    return this._isLineItemValid
  }

  /**
  * Validates the given bulk invoice items.
  * 1. Claims on invoice items all have to have the same policy curreny type
  */
  @Param("invoiceItems", "list of bulk invoice line items to validate")
  @Returns("error message if invalid")
  public function validatePolicyCurrency(invoiceItems : List <BulkInvoiceItem> ) : String {
    var error : String
    //check for mixed policy currency
    if (exists(currencyType in invoiceItems*.Claim*.Policy*.CurrencyTypeExt
        where currencyType != invoiceItems[0].Claim.Policy.CurrencyTypeExt)) {
      error = displaykey.Web.Financials.BulkPay.Invoice.Error.MixedCurrency
    }

    return error
  }
  
  /**
  * Validates the given bulk invoice items for use with the TOMIC bank account type.
  * 1. TOMIC is only valid for Specialty E&S Claims.  If TOMIC is the bank account
  * no other LOBs Claims will be on the BIN
  */
  @Param("invoiceItems", "BIN line items to validate for use with TOMIC bank account")
  @Returns("error message if invalid")
  public function validateTomicBIN(invoiceItems : List<BulkInvoiceItem>) : String {
    var error : String
    var errorClaims : List<String> = new ArrayList<String>()
    //check for claims on the BIN that are not valid for use with TOMIC bank account
    if(exists(account in invoiceItems*.BulkInvoice*.BankAccountExt where account == BankAccount.TC_TOMIC &&
        exists(claim in invoiceItems*.Claim where claim.LossType != LossType.TC_SPECIALTYES))){
        
        errorClaims.addAll(invoiceItems*.Claim.where(\ c -> c.LossType != LossType.TC_SPECIALTYES)*.ClaimNumber.toList())
        error = displaykey.Web.Financials.BulkPay.Invoice.Error.InvalidClaimForTOMIC(errorClaims)
    }
    return error
  }

  /**
  * Validates the given bulk invoice items for cost type business rule violations.
  * 1. Cost types on invoice items do not mix GAI as TPA with non GAI as TPA
  */
  @Param("invoiceItems", "list of bulk invoice line items to validate")
  @Returns("error message if invalid")
  public function validateCostTypes(costTypesList : List <CostType> ) : String {

    var error : String

    if (exists(costType in costTypesList where costType != null && util.financials.CheckFunctions.is1099ReportableCostType(costType) == false) &&
      exists(costType in costTypesList where costType != null && util.financials.CheckFunctions.is1099ReportableCostType(costType) == true)) {

      error = displaykey.Web.Financials.BulkPay.Invoice.Error.MixedReportablityError
    }

    return error
  }

  /**
  * Sets the validity of the line item based on the existance of 
  * error messages
  */
  private function setIsLineItemValid() {
    if (this._errorMessages.HasElements) {
      this._isLineItemValid = false
    } else {
      this._isLineItemValid = true
    }
  }

  /**
  * Validates that line items existing on the same Bulk Invoice are
  * not related to claims with policies having different currency types
  */
  private function validatePolicyCurrency() {
    if (this.validatePolicyCurrency(this._invoiceItem.BulkInvoice.InvoiceItems.toList()) != null) {
      this.addErrorMessage(displaykey.Web.Financials.BulkPay.InvoiceItem.Error.MixedCurrency)
    }
  }

  /**
  * Handles the validation of the exposures on the Line Item's Claim
  */
  private function validateExposures() {

    if (!exists(exp in this._invoiceItem.Claim.Exposures where exp.ValidationLevel == ValidationLevel.TC_PAYMENT)) {
      this.addErrorMessage(displaykey.Web.Financials.BulkPay.InvoiceItem.Error.NoExposures)
    }
  }

  /**
  * Validates the Cost Types on Bulk Invoice Items
  */
  private function validateReserveLineCostTypes() {
    var costTypes = this._invoiceItem.BulkInvoice.InvoiceItems*.ReserveLine*.CostType.toList()
    var defaultError = displaykey.Web.Financials.BulkPay.InvoiceItem.Error.MixedReportability
      if (this.validateCostTypes(costTypes) != null && !this.errorAlreadyAdded(defaultError)) {
        this.addErrorMessage(defaultError)
      }
  }
  
  /**
  * Validates the Cost Types on Bulk Invoice Items
  */
  private function validateCostTypes() {
    var costTypes = this._invoiceItem.BulkInvoice.InvoiceItems*.CostType.toList()
    var defaultError = displaykey.Web.Financials.BulkPay.InvoiceItem.Error.MixedReportability
      if (this.validateCostTypes(costTypes) != null && !this.errorAlreadyAdded(defaultError)) {
        this.addErrorMessage(defaultError)
      }
  }
  
  /**
  * Validates the given bulk invoice items for use with the TOMIC bank account type.
  * 1. TOMIC is only valid for Specialty E&S Claims.  If TOMIC is the bank account
  * no other LOBs Claims will be on the BIN
  */
  private function validateTomicBIN() {
    var invoiceItems = this._invoiceItem.BulkInvoice.InvoiceItems.toList()
    var defaultError = displaykey.Web.Financials.BulkPay.InvoiceItem.Error.InvalidClaimForTOMIC
    if(this.validateTomicBIN(invoiceItems) != null && !this.errorAlreadyAdded(defaultError)){
      this.addErrorMessage(defaultError)
    }
  }

  /**
  * Adds an error message to the error messages list
  */
  @Param("errorMessage", "the error message to add")
  private function addErrorMessage(errorMessage : String) {
    this._errorMessages.add(errorMessage)
  }

  /**
  * Builds the error message display and displays all errors to the user interface
  */
  private function displayAllErrorsToUser() {

    if (this._errorMessages.HasElements) {

      var errors = new java.lang.StringBuilder()
        var errorCount = 0

        errors.append(displaykey.Web.Financials.BulkPay.InvoiceItem.Error.ItemCantBeAdded(this._invoiceItem.Claim.ClaimNumber))
        errors.append(java.lang.System.getProperty("line.separator"))
        errors.append(java.lang.System.getProperty("line.separator"))

        this._errorMessages.each( \ s->{
          errorCount++
          errors.append(errorCount + " . ")
          errors.append(s)
          errors.append(java.lang.System.getProperty("line.separator"))
          errors.append(java.lang.System.getProperty("line.separator"))
        })
        GeneralErrorWorksheet.goInWorkspace(errors.toString())
    }
  }
  
  /**
  * 
  */
  private function errorAlreadyAdded(errorMessage : String) : boolean {
    return exists (message in this._errorMessages where message == errorMessage)
  }

} //End BulkInvoiceItemValidator Class
