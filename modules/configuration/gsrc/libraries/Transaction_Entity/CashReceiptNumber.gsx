package libraries.Transaction_Entity

enhancement CashReceiptNumber : entity.Transaction {
  function setCashReceiptNumber(recovery:Recovery) {
    if (!recovery.RecodeExt) {
      recovery.ex_CashReceiptNumber = null 
    }
  }
}
