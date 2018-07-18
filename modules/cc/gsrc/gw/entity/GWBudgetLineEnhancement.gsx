package gw.entity
uses gw.api.financials.CurrencyAmount
uses gw.datatype.annotation.DataType
uses gw.datatype.annotation.Parameter

@ReadOnly
enhancement GWBudgetLineEnhancement : entity.BudgetLine
{
  /**
   * OriginalEstimate minus TotalPaid
   */
  @DataType("currencyamount", {
    new Parameter("currencyProperty", "ClaimCurrency")
  })   
  property get difference() : CurrencyAmount {
    return (this.OriginalEstimate == null ? 0 : this.OriginalEstimate ) - 
        this.Matter.getTotalPaidForMatterCostCategory(this.BudgetLineType)
  }
}
