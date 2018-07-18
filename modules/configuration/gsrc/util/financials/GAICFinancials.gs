package util.financials;

uses gw.api.financials.TransactionWizardHelper;
uses com.guidewire.pl.web.controller.UserDisplayableException

class GAICFinancials
{
  construct()
  {
  }
  
  public static function reservesBeforeCommit(helper:TransactionWizardHelper) {
    var wrappers = helper.getTransactionWrappers();
    for (w in wrappers) {
      if (w.Transaction.CostCategory == null) {
        w.Transaction.CostCategory = "unspecified";
      }
    }
  }

 /*  5.22.15 - cmullin - Function added for WC Config to alert the user that the Injury Type cannot be changed on the 
  *  New Reserve screen unless the Reserve Amount is also changed. The function searches for the most recent reserve
  *  transaction on the claim that matches the Exposure / CostType of the wrapper. If the Injury Type on the wrapper
  *  is different from the most recent reserve, but the Reserve Amount hasn't changed, then the error is thrown. 
  */
  public static function checkInjuryTypeBeforeCommit(helper:TransactionWizardHelper) {
    var wrappers = helper.getTransactionWrappers();
    for(wrap in wrappers){
      var mostRecent = wrap.Transaction.Claim.Transactions.sortBy(\ t -> t.CreateTime).lastWhere(\ a -> a.Subtype == "reserve" && wrap.Transaction.Exposure == a.Exposure && wrap.Transaction.CostType == a.CostType)
      if(mostRecent.WCInjuryTypeExt != wrap.Transaction.WCInjuryTypeExt && wrap.NewAmountInClaimCurrency.Amount == gw.api.financials.FinancialsCalculationUtil.getAvailableReserves().getAmount(wrap.Transaction.Exposure, wrap.Transaction.CostType))
        throw new UserDisplayableException("New Available Reserves must also be updated.")
    }
  }
} // End GAICFinancials
