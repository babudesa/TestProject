package gw.entity
uses gw.api.financials.CurrencyAmount
uses gw.datatype.annotation.Parameter
uses gw.datatype.annotation.DataType

@ReadOnly
enhancement GWLivingExpensesIncidentEnhancementForHomeowners : entity.LivingExpensesIncident
{
  @DataType("currencyamount", {
    new Parameter("currencyProperty", "ClaimCurrency")
  })
  property get TotalLodgingEstimate() : CurrencyAmount
  {
    return this.LodgingProviders.toList().sumCurrencyAmount( \ lp -> lp.LodgingTotal )
  }

  property get ExpectedDurationEstimate() : String
  {
    var lodgingDuration = this.LodgingProviders.sum( \ lodgingProvider -> lodgingProvider.Days )
    if ( lodgingDuration > 0 )
      return displaykey.Web.LivingExpensesIncident.ExpectedDuration.Days(lodgingDuration)
    else 
      return null
  }

  @DataType("currencyamount", {
    new Parameter("currencyProperty", "ClaimCurrency")
  })
  property get TotalMealsEstimate() : CurrencyAmount
  {
    if( this.MealsDays > 0 and this.MealsPeople > 0 and this.MealsRate > 0)
      return this.MealsDays * this.MealsPeople * this.MealsRate
    else 
      return null
  }
}
