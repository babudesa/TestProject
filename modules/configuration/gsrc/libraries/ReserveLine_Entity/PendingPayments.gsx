package libraries.ReserveLine_Entity

enhancement PendingPayments : entity.ReserveLine {
  public function hasPendingPayments(trans : Transaction[]):Boolean{
    for(payment in this.Claim.PaymentsQuery.iterator()){
      if((payment as PaymentView).Status == "pendingapproval" and (payment as PaymentView).Transaction.ReserveLine == this 
        and !exists(newPayment in trans where (payment as PaymentView).Transaction == newPayment and newPayment.Status != "pendingapproval")){
        return true;  
      }
    }
    return false;
  }  
}
