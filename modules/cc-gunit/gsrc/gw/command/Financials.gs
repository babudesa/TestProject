package gw.command
uses gw.util.financials.FinancialsTestUtil
uses gw.api.database.Query

class Financials extends BaseCommand {

  function denyCheckByCheckNumber() {
    var checkResult = find( c in Check where c.CheckNumber==Argument)
    if( checkResult.getCount() == 0 ) {
      displayMessageAndExit("check not found")
    }
    if( checkResult.getCount() > 1 ) {
      displayMessageAndExit("multiple checks found with CheckNumber '"+Argument+"' found")
    }
    var check = checkResult.getFirstResult()
    Bundle.add( check )
    check.denyCheck()
    Bundle.commit()
  }

  function denyCheckByPublicID() {
    var checkResult = find( c in Check where c.PublicID==Argument)
    if( checkResult.getCount() == 0 ) {
      displayMessageAndExit("check with PublicID '"+Argument+"' not found")
    }
    // should be impossible for there to be multiple results
    var check = checkResult.getFirstResult()
    Bundle.add( check )
    check.denyCheck()
    Bundle.commit()
  }
  
  function ackAll() {
    FinancialsTestUtil.ackAll()
  }
  
  function ackTxnByPID() {
    var txn = Query.make(Transaction).compare("PublicID", Equals, Argument).select().single()
    FinancialsTestUtil.ackTransaction(txn)
  }
  
  function ackCheckByPID() {
    var check = Query.make(Check).compare("PublicID", Equals, Argument).select().single()
    FinancialsTestUtil.ackCheck(check)
  }
  
  function ackInvoiceByPID() {
    var invoice = Query.make(BulkInvoice).compare("PublicID", Equals, Argument).select().single()
    FinancialsTestUtil.ackInvoice(invoice)
  }

}
