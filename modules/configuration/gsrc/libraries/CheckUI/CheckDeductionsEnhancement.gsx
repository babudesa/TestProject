package libraries.CheckUI
uses java.math.BigDecimal


/**
 * Enhancement for Check Deductions
 */
enhancement CheckDeductionsEnhancement : entity.Check {
  
  
  /**
  * Property gets the Gross Check amount including Line Item Deductions.
  * This property is used in place of the OOB "GrossAmount" due to our 
  * customization of the Deductions functionality.
  * 
  * @returns the gross amount of the check before deductions
  */
  property get GrossAmountExt() : BigDecimal {

    var grossAmount = this.NetAmount.Amount.add(this.LineItemDeductionsTotal)
    return grossAmount 
  }
    
  /**
  * Property gets line item deductions total
  * 
  * @returns the total of all line item deductions on the check
  */
   property get LineItemDeductionsTotal() : BigDecimal {
     
     var lineItemDeductions = this.Payments.where(\ p -> p.Status != TransactionStatus.TC_VOIDED && 
                                                         p.Status != TransactionStatus.TC_TRANSFERRED &&
                                                         p.Status != TransactionStatus.TC_RECODED &&
                                                         !p.OffsetPayment)*.LineItems*.LineItemDeductions.where(\ l -> l.Amount != null)
     var dedTotal = new BigDecimal("0.00")
 
     for(item in lineItemDeductions){
       dedTotal = dedTotal.add(item.Amount)
     }     
     return dedTotal
   }
 
  
  
}//End CheckDeductionsEnhancement