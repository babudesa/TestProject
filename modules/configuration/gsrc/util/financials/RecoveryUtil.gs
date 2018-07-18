package util.financials

uses gw.api.database.Query
uses gw.api.database.Relop

class RecoveryUtil {

  construct() {

  }
  
  
  public static function getRecovery(cashReceiptNumber : String) : Recovery {    
    return (new Query(Recovery).compare("ex_CashReceiptNumber", Relop.Equals, cashReceiptNumber).select().FirstResult as Recovery)
  }
  
  

}// End RecoveryUtil
