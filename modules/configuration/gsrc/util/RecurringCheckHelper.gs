package util

class RecurringCheckHelper {

  construct(){
  }
  
  /* Defect 8479 - 5/13/16 dnmiller - added function to validate the total amount for recurring checks  
   * does not exceed the available reserves. Need to do on the screen instead of in a validation rule. 
   */
  static function validateRecurringAmount(check: Check): String {
    var availableReserves = gw.api.financials.FinancialsCalculationUtil.getAvailableReserves().getAmount(check.CheckSet.PrimaryCheck.Payments.first().ReserveLine)
    if (availableReserves < 0) {
      return displaykey.Validation.NewCheckWizard.RecurringTotal
    } else {
      //util.RecurringCheckHelper.updateGrossAmount(check); 
      return null
    }
  }
  
    /* Defect 8551 - 5/13/16 dnmiller - MOVED TO EM85
     * added function to update the GrossAmountExt for recurring checks when the amount 
     * is changed on the Change Recurrence Schedule screen.
   
  static function updateGrossAmount(check : Check) {
    for (trans in check.Payments.first().TransactionSet.AllTransactions){
      var lines = trans.LineItems.first()
      lines.GrossAmountExt = lines.TransactionAmount
    }
  }
  */


}
