package libraries.CheckGroup_Entity
uses java.math.BigDecimal

enhancement CheckGroupDeductionsEnhancement : entity.CheckGroup {
  
  
  /**
 * Property gets the GrossAmount ofthe CheckGroup including any Line Item Deductions.
 * This property is used in place of the OOB "GrossAmount" due to our 
 * customization of the Deductions functionality.
 * 
 * @returns the gross amount of the check before deductions
 */
  property get GrossAmountExt() : BigDecimal {
     
     var grossAmount = new BigDecimal("0.00")
     grossAmount = new BigDecimal(this.NetAmount.Amount.toString()).add(this.LineItemDeductionsTotal)
     
     return grossAmount 
  }
  
  
  /**
  * Property gets line item deductions total for the check group
  * 
  * @returns the total of all line item deductions on the check
  */
   property get LineItemDeductionsTotal() : BigDecimal {
     var lineItemDeductions = this.Checks*.Payments.where(\ p -> p.Status != TransactionStatus.TC_VOIDED && 
                                                           p.Status != TransactionStatus.TC_TRANSFERRED &&
                                                           p.Status != TransactionStatus.TC_RECODED &&
                                                           !p.OffsetPayment)*.LineItems*.LineItemDeductions
     var dedTotal = new BigDecimal("0.00")
   
     for(item in lineItemDeductions){
         dedTotal = new BigDecimal(dedTotal.toString()).add(item.Amount)
     }     
     return dedTotal
   }
  
}//End CheckGroupDeductionsEnhancement
