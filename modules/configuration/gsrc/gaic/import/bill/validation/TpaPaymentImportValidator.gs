package gaic.import.bill.validation
uses gaic.import.TpaPaymentImportCommon
uses java.util.ArrayList
uses util.gaic.billimport.BillImportCommon
uses util.gaic.claimexport.ClaimExportUtil
uses java.util.Date
uses util.WCHelper


class TpaPaymentImportValidator extends BillImportValidator {

  protected static final var WC_EXPENSE_CODE : String = "WCExpenseCode"
  protected static final var TPA_GENERAL_CODES : String = "TpaGeneralExpCode"
  protected static final var CSC_CODES : String = "CSC"
  protected static final var DEFAULT_EXP_LOSS_CODE : String = "000"
  protected static final var WC_MEDICAL_FEATURE_TYPE : String = ExposureType.TC_WC_MEDICAL_DETAILS.Code
  protected static final var CHECK_TYPE_ISSUED : String = "issued"
  

  construct(paymentImportRecord : BillImportRecordExt) {
    super(paymentImportRecord)
  }

  
  override function validateAll() : BillImportResultExt {
    try{  
      var validationStatus : BillImportStatusExt = validateClaim()
      
      if(validationStatus != BillImportStatusExt.TC_CLAIMNOTFOUND) {
        getExtraClaimsData()
      }else if(validationStatus == BillImportStatusExt.TC_CLAIMNOTFOUND) {
        super.Result.LineCategoryDesc = TpaPaymentImportCommon.getLineCategoryDesc(super.Bill)
      }
      
      if(validationStatus != BillImportStatusExt.TC_VALID) {
        super.Result.Status = validationStatus
      } else {
        super.Result.Status = validateVendor()
      }         
         

    }catch(e){
      gw.api.util.Logger.logInfo("Unexpected error during bill validation for [InvoiceNumber:ExpenseCode]: " + "[" + super.Bill.InvoiceNumber + ":" + super.Bill.ExpenseCode + "]")
      super.Result.Status = BillImportStatusExt.TC_EXCEPTION
      if(e.Message.length > 4000) {
        super.Result.ErrorMessage = e.Message.substring(0, 4000)   
      } else {
        super.Result.ErrorMessage = e.Message
      }
    }
   
    return super.Result
  }


  /**
   * Validates the claim
   */
  protected override function validateClaim() : BillImportStatusExt {
    if(Claim == null){
      return BillImportStatusExt.TC_CLAIMNOTFOUND
    }else if(!isExpenseCodeValid()){
      return BillImportStatusExt.TC_INVALIDEXPENSECODE
    }else if(!this.isExpenseTypeValid()){
      return BillImportStatusExt.TC_MISSINGEXPENSETYPE
    }else if(!this.isCostTypeValid()){
      return BillImportStatusExt.TC_INVALIDCOSTTYPE
    }else if(this.isInjuryTypeMissing()){
      return BillImportStatusExt.TC_MISSINGINJURYTYPE}
    else if(this.isPaymentMethodMissing()){
      return BillImportStatusExt.TC_MISSINGPAYMENTMETHOD
    }else if(Claim.checkDisconnectedFeatures()){
      return BillImportStatusExt.TC_FEATUREDISCONNECT
    }else if(!this.doesClaimHaveATPFeature()){
      return BillImportStatusExt.TC_FEATURENOTATP
    }else if(this.doesClaimHavePaymentsPendingApproval()){
      return BillImportStatusExt.TC_FINALPAYMENTPENDING
    }else {
      return BillImportStatusExt.TC_VALID
    }    
  }



  /**
  * Determines if the injury type is missing if the 
  * claim is WC.
  */
  protected function isInjuryTypeMissing() : boolean {
    var isTypeMissing : boolean = false  
    
    if(WCHelper.isWCorELLossType(super.Claim)){
      var type : WCInjuryTypeExt =  TpaPaymentImportCommon.getInjuryTypeFromImportRecord(super.Bill)
      if(type == null) {
        isTypeMissing = true
      }      
    }
    
    return isTypeMissing;  
  }
  
  
  /**
  * Determines if the payment method is missing if the check
  * type is "issued".
  */
  protected function isPaymentMethodMissing() : boolean {
    var isMissing : boolean = false
    
    if(super.Bill.CheckType != null && super.Bill.CheckType.equals(CHECK_TYPE_ISSUED)){
      if(super.Bill.PaymentMethod == null) {
        isMissing = true
      }
    }
    
    return isMissing  
  }
  
  
  /**
  * Determines if the cost type is valid for the given expense
  * cose.
  */
  protected function isCostTypeValid() : boolean {
    var isValid : boolean = true
    var type : CostType = TpaPaymentImportCommon.getCostTypeFromImportRecord(super.Bill)
    
    if(super.Bill.ExpenseCode != DEFAULT_EXP_LOSS_CODE) {    
      var lineCategory : LineCategory = TpaPaymentImportCommon.getLineCategory(super.Bill)    
      var costTypes = lineCategory.Categories.where(\ t -> typeof t == CostType && t == type)
    
      if(costTypes == null or (costTypes != null && costTypes.IsEmpty)) {
        isValid = false
      }
    }
    
    return isValid  
  }
  

  /**
   * Determines if loss / expense code is valid
   */
  protected function isExpenseCodeValid() : boolean {    
    var lineCategory : LineCategory
    var isValid : boolean = false
    
    
    if(Bill.ExpenseCode == null or(Bill.ExpenseCode != null and Bill.ExpenseCode.equalsIgnoreCase(DEFAULT_EXP_LOSS_CODE))){
      if(TpaPaymentImportCommon.getCostTypeFromImportRecord(Bill) == CostType.TC_EXPENSE or
        (Bill.FeatureType != null and Bill.FeatureType.equalsIgnoreCase(WC_MEDICAL_FEATURE_TYPE))) {
            isValid = false          
         } else {
           isValid = true
         }
    } else {
      lineCategory = TpaPaymentImportCommon.getLineCategory(Bill)

      if(lineCategory != null) {
        isValid = true
      }
    }
    return isValid
  }
  
  
  /**
  * TPA payment integrations will have the feature type and the logic
  * is different to determine matching feature to validate / pay on
  */
  override function doesClaimHaveATPFeature() : boolean {
    return TpaPaymentImportCommon.isFeatureAtATP(super.Bill, super.Claim)
  }
  
  
  /**
   * Validates the expense type is correct if the cost type is 
   * an expense on the import record.
   */
  protected function isExpenseTypeValid() : boolean {
    var isValid : boolean
    var expenseType : TransactionQualifierExt = TpaPaymentImportCommon.getExpenseTypeFromImportRecord(super.Bill)
    if(TpaPaymentImportCommon.getCostTypeFromImportRecord(super.Bill) == CostType.TC_EXPENSE) {
      if(expenseType == null) {
        isValid = false
      }else {
        isValid = true
      }
    }else {
      isValid = true
    }
    
    return isValid
  }
  

  /**
   * Overrides the default validation and includes non-vendor
   * validation.
   */
  protected override function validateVendor() : BillImportStatusExt {

    var validationResult : BillImportStatusExt
    
    //If the payee is foreign return error else continue the validation.
    if(this.isForeignPayee()) {
      validationResult = BillImportStatusExt.TC_FOREIGNPAYEEADDRESS
    }else {
    
      if(TpaPaymentImportCommon.getContactRoleFromPayeeType(super.Bill) == ContactRole.TC_VENDOR){
        validationResult = super.validateVendor()
      }else {
        validationResult = TpaPaymentImportCommon.validateNonVendorPayee(super.Claim, super.Bill)
      }
    
      //if the above validation passes then continue with mail to validation
      //if mail to contact data doesn't match payee data on the import record and
      //then we need to also validate that the mail to contact is on claim
      if(validationResult == BillImportStatusExt.TC_VALID and !TpaPaymentImportCommon.isPayeeSameAsMailTo(super.Bill)) {
        validationResult = this.validateMailToContact()
      }
    }
    
    return validationResult
  }
  
  
  /**
   * Checks to see if the payee is foreign
   */
  protected function isForeignPayee() : boolean {
    var stateCode : State =  State.get(super.Bill.PayToState)

    var isForeign : boolean = false
    
    if(!stateCode.Categories.contains(Country.TC_US)) {
      isForeign = true
    }
    
    return isForeign
  }
  
  
  /**
   * Validates that the mail to contact on the import record 
   * is on the claim already.
   */
  protected function validateMailToContact() : BillImportStatusExt {
    var validationResult : BillImportStatusExt
    var contactsToSearch : ArrayList<ClaimContact> = new ArrayList<ClaimContact>()
    var contact : ClaimContact
    
    //add claim contacts
    contactsToSearch.addAll(super.Claim.ClaimContactsForAllRoles as java.util.ArrayList<entity.ClaimContact>)
    //add policy contacts
    contactsToSearch.addAll(super.Claim.Policy.ClaimContactsForAllRoles as java.util.Collection<entity.ClaimContact>)
    
    contact = TpaPaymentImportCommon.getMailToContactMatch(contactsToSearch, super.Bill)
    
    if(contact == null) {
      validationResult = BillImportStatusExt.TC_MAILTONOTAVAILABLE
    }else {
      validationResult = BillImportStatusExt.TC_VALID
    }
    
    return validationResult
  }
  
  
  /**
  * Get the extra claims data needed for the reports (BusinessUnit, Claimant Name, Line Category description)
  */
  protected function getExtraClaimsData(){
    var businessUnit : BusinessUnitExt = null
    var lineCategoryDescription : String = null
    var claimantName : String = null
    var lossDate : Date = null
    
    businessUnit = BillImportCommon.getClaimBusinessUnit(super.Claim)
    lineCategoryDescription = TpaPaymentImportCommon.getLineCategoryDesc(super.Bill)
    claimantName = BillImportCommon.getClaimantFullName(super.Claim)
    lossDate = BillImportCommon.getLossDate(super.Claim)
    
    super.Result.BusinessUnitCode = ClaimExportUtil.getWCBusinessUnitCode(super.Claim).Code
    super.Result.BusinessUnitName = ClaimExportUtil.getWCBusinessUnitCode(super.Claim).DisplayName
    super.Result.LineCategoryDesc = lineCategoryDescription
    super.Result.ClaimantName = claimantName
    super.Result.DateOfLoss = lossDate
  }
  
}
