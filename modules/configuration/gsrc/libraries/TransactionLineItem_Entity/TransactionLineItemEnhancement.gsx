package libraries.TransactionLineItem_Entity
uses java.math.BigDecimal

enhancement TransactionLineItemEnhancement : entity.TransactionLineItem {

  /**
   * Calculates and sets the Net Amount of the TransactionLineItem
   */
  function calculateNetAmount() {

    if (this.GrossAmountExt != null) {
      var newTransactionAmount = new BigDecimal(this.GrossAmountExt.toString()).subtract(new BigDecimal(this.DeductionsTotal.toString()))
      this.setTransactionAmountAndUpdate(newTransactionAmount)
    }
  }

  /**
   * Property gets line item deducitons total
   *
   * @returns the total of all line item deductions on the check
   */
  property get DeductionsTotal() : BigDecimal {
    
    var deductionTotal = new BigDecimal("0.00")
    
    for (deduction in this.LineItemDeductions) {
      if (deduction.Amount != null) {
       deductionTotal = deductionTotal.add(deduction.Amount)
      }
    }
    return deductionTotal
  }

}//End TransactionLineItemEnhancement