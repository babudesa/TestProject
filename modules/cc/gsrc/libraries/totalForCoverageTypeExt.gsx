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
}