package libraries.ClaimRpt_Entity

enhancement Totals : entity.ClaimRpt {
  // 1/18/2010 - zjthomas - Defect 2872, this function has been depricated.  It's functionality has been moved to the Claim entity.
  function getClaimcostTotals():java.math.BigDecimal {
    var claimcosttotal : java.math.BigDecimal = 0
    for (paymentiterator  in this.Claim.PaymentsQuery.iterator()){
      var pv = paymentiterator as PaymentView
      if (pv.CostType=="claimcost"){
        claimcosttotal = claimcosttotal + pv.Amount.Amount
        }
    
      }
     return claimcosttotal 
  
    }
 
   // 1/18/2010 - zjthomas - Defect 2872, this function has been depricated.  It's functionality has been moved to the Claim entity. 
   function getExpenseTotals():java.math.BigDecimal {
   var expensetotal : java.math.BigDecimal = 0
   for (paymentiterator  in this.Claim.PaymentsQuery.iterator()){
     var pv = paymentiterator as PaymentView
     if (pv.CostType=="expense"){
       expensetotal = expensetotal + pv.Amount.Amount
     }
  
    }
    return expensetotal 
  
  }
}
