package gw.entity
uses gw.api.financials.FinancialsCalculationUtil
uses java.math.BigDecimal
uses gw.api.financials.CurrencyAmount

@Export
enhancement GWSubroReserveLineEnhancement : entity.ReserveLine
{
  function getNetPaidExcludingSubroRecovery() : CurrencyAmount{
    var TotalPaidForLossCosts = FinancialsCalculationUtil.getTotalPayments().getAmount( this )
    var AllRecovery = FinancialsCalculationUtil.getTotalRecoveries().getAmount( this )

    // var SubroRecovery = this.getRecoveryforRecCatSubro()
    var SubroRecovery = FinancialsCalculationUtil.getTotalRecoveries().getAmount( this, "subro" )
    
    if (TotalPaidForLossCosts == Null ){TotalPaidForLossCosts = CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency )}
    if (AllRecovery == Null ){AllRecovery = CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency )}
    if (SubroRecovery == Null ){SubroRecovery = CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency )}
   
    return (TotalPaidForLossCosts - AllRecovery + SubroRecovery)   
  }

  function getSubroRecovery() : CurrencyAmount {
    var subroRecovery = FinancialsCalculationUtil.getTotalRecoveries().getAmount( this, "subro" )
    return (subroRecovery == null ) ? CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency ) : subroRecovery
  }

}