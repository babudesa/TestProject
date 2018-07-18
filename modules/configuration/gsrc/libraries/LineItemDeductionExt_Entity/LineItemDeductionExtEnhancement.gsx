package libraries.LineItemDeductionExt_Entity


enhancement LineItemDeductionExtEnhancement : entity.LineItemDeductionExt {  
  
  
  /**
   * Property gets the claim currency for the claim associated with
   * this Line Item Deduction
   * 
   * @returns the Claim Currency
   */
   property get ClaimCurrency() : Currency {
      return this.TransactionLineItem.Transaction.Claim.Currency
   }
   
  
}//End LineItemDeductionsEnhancement
