package libraries;
uses gw.api.financials.CurrencyAmount
uses gw.api.financials.FinancialsCalculationUtil

@Export
enhancement totalForCoverageTypeExt : entity.Exposure {

  function totalForCoverageType(coverageType : CoverageType) : CurrencyAmount {
     var total : CurrencyAmount = null
     if (this.Coverage.Type == coverageType) {
       // By the time they reach Validation rules, the new payments will be included in this calculation
       total = FinancialsCalculationUtil.getTotalPaymentsIncludingPending().getAmount(this, CostType.TC_CLAIMCOST)
     }
     return total != null ? total : CurrencyAmount.getStrict(0, this.Claim.Currency);
  }

  function totalForCoverageTypeAndClaimant(coverageType : CoverageType, claimant : Contact) : CurrencyAmount {
    return this.Claimant == claimant
            ? totalForCoverageType(coverageType)
            : CurrencyAmount.getStrict(0, this.Claim.Currency)
  }

  function totalForCoverageTypeEx(coverageType : String) : Number {
     var total : Number = 0;
   
     for(each in this.TransactionsQuery.iterator()){
       var trans = (each as TransactionDefaultView).Transaction
       if(trans.Subtype == "payment" and trans.CostType == "claimcost" and this.Coverage.Type.Code == coverageType){
         total = total +  trans.Amount as java.lang.Double;
       }
     }
     return total;
  }
  
  function totalForCoverageTypeandClaimantExt(coverageType : String, Claimant : String) : Number {
     var total : Number = 0;
   
     for(each in this.TransactionsQuery.iterator()) {
       var trans = (each as TransactionDefaultView).Transaction
       if(trans.Exposure.Claimant.PublicID == Claimant and 
          trans.Subtype == "payment" and trans.CostType == "claimcost" and this.Coverage.Type.Code == coverageType){
         total = total + trans.Amount as java.lang.Double;
       }
     }
     return total;
  }
}