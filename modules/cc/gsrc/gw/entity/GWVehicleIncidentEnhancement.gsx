package gw.entity
uses gw.api.financials.CurrencyAmount
uses gw.api.financials.IMoney
uses gw.api.util.CurrencyUtil
uses java.math.RoundingMode
uses java.math.BigDecimal

@Export
enhancement GWVehicleIncidentEnhancement : entity.VehicleIncident {
  
  function calculateNetRecoveryValue(salvageProceeds : IMoney, salvageTow : IMoney, salvageStorage : IMoney, salvageTitle : IMoney, salvagePrep : IMoney) : CurrencyAmount {
    var netRecovery : BigDecimal = 0
    if (salvageProceeds.Amount != null) {
      netRecovery = salvageProceeds.Amount
    }
    if (salvageTow.Amount != null) {
      netRecovery = netRecovery.subtract(salvageTow.Amount)
    }
    if (salvageStorage.Amount != null) {
      netRecovery = netRecovery.subtract(salvageStorage.Amount)
    }
    if (salvageTitle.Amount != null) {
      netRecovery = netRecovery.subtract(salvageTitle.Amount)
    }
    if (salvagePrep.Amount != null) {
      netRecovery = netRecovery.subtract(salvagePrep.Amount)
    }
    var roundedValue = roundForCurrency( netRecovery )
    this.SalvageNet = roundForCurrency(CurrencyAmount.getStrict(roundedValue, ClaimOrDefaultCurrency))
    return this.SalvageNet
  }
  
  /**
   * Round the BigDecimal amount to the proper number of decimal places for a currency value.  The currency
   * is either the Claim's currency if set or the system default currency.
   */
  public function roundForCurrency(value : CurrencyAmount) : CurrencyAmount {
    return CurrencyUtil.roundToCurrencyScale( value, ClaimOrDefaultCurrency, RoundingMode.HALF_UP )
  }
  
  /**
   * Gets the ClaimCurrency or, if it is null, the DefaultCurrency.
   */
  public property get ClaimOrDefaultCurrency() : Currency {
    var c = this.ClaimCurrency
    if( c != null ) {
      return c
    } else {
      return CurrencyUtil.getDefaultCurrency()
    }
  }  
}
