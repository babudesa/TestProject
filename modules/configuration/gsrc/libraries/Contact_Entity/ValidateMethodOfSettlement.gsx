package libraries.Contact_Entity

enhancement ValidateMethodOfSettlement : entity.Contact {
  function validateMOS(c : Claim) : boolean {
    var needMsg = false
    if(exists(exp in c.Exposures where exp.InsuranceCoExt==this and 
       (exists(trans in exp.TransactionsQuery.iterator() where (trans as TransactionDefaultView).Transaction.Subtype=="Payment" 
       	 and (trans as TransactionDefaultView).Transaction.CostType=="claimcost" and ((exp.Closed || exp.ReOpenDate!=null) OR
           (((trans as TransactionDefaultView).Transaction as Payment).PaymentType=="final" || 
       	  ((trans as TransactionDefaultView).Transaction as Payment).PaymentType=="supplement")))))){
      if(this.WorkPhone==null and this.FaxPhone==null and this.TollFreeNumberExt==null){
        needMsg = true;
      }
    }
    return needMsg;
  }

  function needMOSAddress(c : Claim) : boolean {
    var needMOS = false
    if(exists(exp in c.Exposures where exp.InsuranceCoExt==this and 
       (exists(trans in exp.TransactionsQuery.iterator() where (trans as TransactionDefaultView).Transaction.Subtype=="Payment" 
       	 and (trans as TransactionDefaultView).Transaction.CostType=="claimcost" and ((exp.Closed || exp.ReOpenDate!=null) OR
           (((trans as TransactionDefaultView).Transaction as Payment).PaymentType=="final" || 
       	  ((trans as TransactionDefaultView).Transaction as Payment).PaymentType=="supplement")))))){
      needMOS=true;
    }
    return needMOS;
  }
}
