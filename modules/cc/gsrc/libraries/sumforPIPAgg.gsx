package libraries
uses gw.api.financials.CurrencyAmount

@Export
enhancement sumforPIPAgg : entity.Claim {

  function sumForPIPClaimAgg() : CurrencyAmount {
    var total = CurrencyAmount.getStrict(0, this.Claim.Currency)
    for (expo in this.Exposures) {
      if (expo.Coverage.Type == "PIPMED"
              or expo.Coverage.Type == "PIPRHB"
              or expo.Coverage.Type == "PIPIL"
              or expo.Coverage.Type == "PIPFUN"
              or expo.Coverage.Type == "PIPDTH"
              or expo.Coverage.Type == "PIPEXMED") {
        total += expo.totalForCoverageType(expo.Coverage.Type)
      }     
    }
    return total;
  }

  function sumForPIPNonmedAgg(claimant : Contact) : CurrencyAmount {
    var total = CurrencyAmount.getStrict(0, this.Claim.Currency)
    for (expo in this.Exposures) {
      if (expo.Coverage.Type == "PIPRHB"
              or expo.Coverage.Type == "PIPIL"
              or expo.Coverage.Type == "PIPFUN"
              or expo.Coverage.Type == "PIPDTH") {
        total += expo.totalForCoverageTypeAndClaimant(expo.Coverage.Type, claimant)
      }     
    }
    return total;
  }

  function sumForPIPPersonAgg(claimant : Contact) : CurrencyAmount {
    var total = CurrencyAmount.getStrict(0, this.Claim.Currency)
    for (expo in this.Exposures) {
      if (expo.Coverage.Type == "PIPMED"
              or expo.Coverage.Type == "PIPRHB" 
              or expo.Coverage.Type == "PIPIL"
              or expo.Coverage.Type == "PIPFUN"
              or expo.Coverage.Type == "PIPDTH"
              or expo.Coverage.Type == "PIPEXMED") {
        total += expo.totalForCoverageTypeAndClaimant(expo.Coverage.Type, claimant)
      }     
    }
    return total;
  }

  function sumForPIPReplaceAgg(claimant : Contact) : CurrencyAmount {
    var total = CurrencyAmount.getStrict(0, this.Claim.Currency)
    for (expo in this.Exposures) {
      if (expo.Coverage.Type == "PIPIL") {
        total += expo.totalForCoverageTypeAndClaimant(expo.Coverage.Type, claimant)
      }     
    }
    return total;
  }

}