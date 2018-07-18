package libraries.Reserve_Entity
uses java.text.DecimalFormat

enhancement Reserve : entity.Reserve {
  function edwSkip() : boolean{ 
    var reserveLines session : List
    for(line in reserveLines){
      if(line.equals(this.ReserveLine)){
        reserveLines.remove(line);
        return true;
      }
    }
    return false;
  }

  function testForOffset():boolean { 
    return this.ZeroingOffset ;
  }
  
  /**
   * akubatur
   * Defect# : 4797
   * Claim history update on reserve change
   */
  function createHistory(res: Reserve, workingTransactionSet : TransactionSet){
    if(res!=null){
      var openres  = gw.api.financials.FinancialsCalculationUtil.getOpenReserves().getAmount(res.Exposure, res.CostType)+
      gw.api.financials.FinancialsCalculationUtil.getPendingReservesForCostCategory(res)
      var amount =(new DecimalFormat("$#########0.00;($-#########0.00)")).format(openres.Amount)
      if(res.Status =="rejected"|| res.Status =="submitted" || res.Status =="pendingapproval"){
        var transaction = res.Claim.createCustomHistoryEvent(CustomHistoryType.TC_CHECKEDIT, User.util.CurrentUser+" issued a Reserve for "+amount+" on Feature "+res.Exposure.DisplayName);
        // transaction.TransactionSet = res.TransactionSet
          /* The above code threw exceptions when reserve wasn't in Bundle, such as when editing awaiting approval reserve
           * from Reserve Details
           */
          transaction.TransactionSet = workingTransactionSet
      }
    }
  }
}