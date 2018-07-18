package libraries.BulkInvoiceItem_Entity
uses gw.api.financials.BulkPayHelper
uses libraries.BulkInvoiceUI.BulkInvoiceItemUIValidator
uses java.util.ArrayList

enhancement BulkInvoiceItemUI : entity.BulkInvoiceItem {

/**
  * Fitlers the reserve lines for the BulkInvoiceItemsLV.pcf
  *
  * @param reserveLineWrappers the payable Reserve Lines on the Claim
  * @return the filtered list of Reserve Lines
  */
  @Param("reserveLineWrappers", "the payable Reserve Lines on the Claim")
  @Param("claim", "the claim associated with the invoice item & reserve line")
  @Returns("filtered list of ReserveLineWrappers")
  public function filterReserveLines(reserveLineWrappers : List <Object>) : List <ReserveLineWrapper> {

    var payableReserveLineWrappers : List <ReserveLineWrapper>  = reserveLineWrappers as List <ReserveLineWrapper>
    var payableReserveLines = payableReserveLineWrappers*.ReserveLine
    var filteredReserveLines : List <ReserveLine>  = new ArrayList <ReserveLine>()
    var filteredReserveLineWrappers : List <ReserveLineWrapper>  = new ArrayList <ReserveLineWrapper>()
    var validCostTypes : List <CostType>  = this.getValidCostTypeValues()
    //get filtered list of reserve lines
    filteredReserveLines = payableReserveLines.where( \ r->exists(costType in validCostTypes where r.CostType == costType)) as java.util.List<entity.ReserveLine>
    

    //add the "New.." reserve line back into the filtered list
    if (!exists(rl in filteredReserveLines where rl == payableReserveLines.last())) {
      filteredReserveLines.add(payableReserveLines.last())
    }
    
    //create the filtered reserve line wrapper list
    filteredReserveLineWrappers
    .addAll(payableReserveLineWrappers
      .where( \ r->exists(reserveLine in filteredReserveLines where r.ReserveLine == reserveLine)))
      
    return filteredReserveLineWrappers
  }  
  
  /**
  * 
  */
  @Returns("valid list of Cost Types for this BIN line item")
  public function getValidCostTypeValues() : List<CostType> {
    var validCostTypes : List <CostType>  = new ArrayList <CostType> ()
    var claim = this.Claim

    
    if ((claim.LossType == LossType.TC_SPECIALTYES) && 
        (this.BulkInvoice.PaymentMethod == PaymentMethod.TC_MANUAL || this.BulkInvoice.PaymentMethod == null)) {
       
       if(this.BulkInvoice.BankAccountExt == BankAccount.TC_TOMIC) {
         validCostTypes.addAll(typekey.CostType.TF_GAI_TPA_TYPES.TypeKeys)
       }else if(this.BulkInvoice.InvoiceItems.Count > 1 && this.IsGAITPABulkInvoice) {
         validCostTypes.addAll(typekey.CostType.TF_GAI_TPA_TYPES.TypeKeys)
       }else if(this.BulkInvoice.InvoiceItems.Count > 1 && !this.IsGAITPABulkInvoice) {
         validCostTypes.addAll(typekey.CostType.TF_STANDARD_TYPES.TypeKeys)
       }else {
         validCostTypes = typekey.CostType.getTypeKeys(false)
       }
    }else if(this.BulkInvoice.BankAccountExt == BankAccount.TC_TOMIC && claim.LossType != LossType.TC_SPECIALTYES) {
      validCostTypes = null
    }else {
      validCostTypes = typekey.CostType.TF_STANDARD_TYPES.TypeKeys
    }
    
    return validCostTypes
  }
  
  /**
  * Handles the Claim Number OnChange event for this line item. Used on BulkInvoiceItemsLV.pcf
  */
  public function ClaimNumber_OnChange() {  

    var validator = new BulkInvoiceItemUIValidator(this)
    validator.validateLineItem()

    if(this.ClaimNumber != null && validator.IsLineItemValid) {
      this.cleanUpClaim()
    }  
  }
  
  /**
  * Handles the ReserveLine OnChange event for this line item. Used on BulkInvoiceItemsLV.pcf
  */
  public function ReserveLine_OnChange() {
    var validator = new BulkInvoiceItemUIValidator(this)
    validator.validateLineItem()    

    if(this.ClaimNumber != null && validator.IsLineItemValid) {
      this.cleanUpClaim()
    } 
  }
  
  /**
  * Handles the CostType OnChange event for this line item. Used on BulkInvoiceItemsLV.pcf
  */
  public function CostType_OnChange() {
    var validator = new BulkInvoiceItemUIValidator(this)
    validator.validateLineItem()

    if(this.ClaimNumber != null && validator.IsLineItemValid) {
      this.cleanUpClaim()
    } 
  }
    
  /**
  * Uses the guidewire function to clean up the claim associated with the line item
  */  
  protected function cleanUpClaim() {
    var helper = new BulkPayHelper()
    helper.cleanupClaim(this) 
  }   
  
  /**
  * Checks the cost type of the first line item & bank account and determines if it is a
  * GAI as TPA BIN
  */
  public property get IsGAITPABulkInvoice() : boolean {

    var isGAITPA : boolean
    var firstLineItemCostType = this.BulkInvoice.InvoiceItems[0].CostType
    
    if(this.BulkInvoice.BankAccountExt == BankAccount.TC_TOMIC){
      isGAITPA = true
    } else if (firstLineItemCostType == CostType.TC_GAIASTPAEXPENSE || firstLineItemCostType == CostType.TC_GAIASTPALOSS) {
      isGAITPA = true
    } else {
      isGAITPA = false
    }
    return isGAITPA
  }

  
}//End BulkInvoiceUI Enhancement
