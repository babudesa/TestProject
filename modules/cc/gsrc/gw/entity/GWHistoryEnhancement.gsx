package gw.entity
uses gw.api.util.DisplayableException

@ReadOnly
enhancement GWHistoryEnhancement : entity.History {
  /**
   * Returns the first Transaction on this history event, or throws a DisplayableException if there are 
   * no transactions.
   */
  property get FirstTransaction() : Transaction {
    var transactionSet = this.TransactionSet
    var transactions = transactionSet typeis CheckSet ? transactionSet.PrimaryCheck.Payments : transactionSet.Transactions
    if (transactions == null or transactions.length == 0) {
      throw new DisplayableException(displaykey.History.NoTransactions)
    }
    return transactions[0]
  }
  
  /**
   * Returns the first Payment on this history event's checkset's primary check, or throws a 
   * DisplayableException if no such payment exists.
   */
  property get FirstPayment() : Payment {
    var transactionSet = this.TransactionSet
    if (transactionSet typeis CheckSet) {
      var payments = transactionSet.PrimaryCheck.Payments
      if (payments != null and payments.length > 0) {
        return payments[0]
      }
    }
    throw new DisplayableException(displaykey.History.NoPayments)
  }
}
