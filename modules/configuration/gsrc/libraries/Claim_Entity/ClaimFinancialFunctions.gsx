package libraries.Claim_Entity

enhancement ClaimFinancialFunctions : entity.Claim {
  // 1/18/2010 - zjthomas - Defect 2872, This function replaces duplicate function on ClaimRpt entity.
  function getClaimcostTotals():java.math.BigDecimal {
    var claimcosttotal : java.math.BigDecimal = 0
    for (paymentiterator  in this.PaymentsQuery.iterator()){
      var pv = paymentiterator as PaymentView
      if (pv.CostType=="claimcost"&& pv.Status!="rejected"){
        claimcosttotal = claimcosttotal + pv.Amount.Amount
        }
    
      }
     return claimcosttotal 
  
    }

  // 1/18/2010 - zjthomas - Defect 2872, This function replaces duplicate function on ClaimRpt entity.
  function getExpenseTotals():java.math.BigDecimal {
   var expensetotal : java.math.BigDecimal = 0
   for (paymentiterator  in this.PaymentsQuery.iterator()){
     var pv = paymentiterator as PaymentView
     if (pv.CostType=="expense"){
       expensetotal = expensetotal + pv.Amount.Amount
     }
  
    }
    return expensetotal 
  
  }

  //4/5/11 - erawe - defect 3791 Estimated Damage requested to be whole dollars only.
  //4/12/12 - mbendure - defect 5303 removed zero from being a valid option
  function validateAmount(value : java.math.BigDecimal) : Boolean{
    var result : Boolean = true;
    //if(value != null &amp;&amp; (value.intValue() != value || (value.intValue() || (value.intValue()&lt; 0 as java.lang.Integer).toString()))){
    if(value != null && (value.intValue() != value || (value.intValue() <= 0 ))){
      result = false;
    }
    return result;
  }
  
  // 6/29/2015 - ivorobyeva - Formatting financial values to $###.##0.00 format
  // if = 0 - sets to the ifZero value (0 or NULL, depending on the need)
  function formatFinancialValue(finValue:java.math.BigDecimal, ifZero:java.math.BigDecimal):String{
    if(finValue!=null and finValue!=0){
      return gw.api.util.StringUtil.formatNumber( finValue , "###,##0.00")
    }
    if(ifZero==null)
      return null
    return gw.api.util.StringUtil.formatNumber( ifZero , "###,##0.00")
  }
}
