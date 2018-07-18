package libraries.Exposure_Entity
uses java.util.ArrayList

enhancement MethodOfSettlement : entity.Exposure {
  function needMOSInformation() : boolean {
    var needMOS = false
    if(exists(trans in this.TransactionsQuery.iterator() where (trans as TransactionDefaultView).Transaction.Subtype=="Payment" 
       	 and (trans as TransactionDefaultView).Transaction.CostType=="claimcost" and ((this.Closed || this.ReOpenDate!=null) OR
           (((trans as TransactionDefaultView).Transaction as Payment).PaymentType=="final" || 
       	  ((trans as TransactionDefaultView).Transaction as Payment).PaymentType=="supplement")))){
      needMOS=true;
    }
    return needMOS;
  }

  // Defect 8006 - 12.9.15 - This function duplicates the logic in needMOSInformation() except for the test
  // for CostType=="claimcost" because Settlement Type is required for both Loss and Expense payments.
  function needSettlementTypeInformation() : boolean {
    var needST = false
    if(exists(trans in this.TransactionsQuery.iterator() where (trans as TransactionDefaultView).Transaction.Subtype=="Payment" and 
    ((this.Closed || this.ReOpenDate!=null) OR (((trans as TransactionDefaultView).Transaction as Payment).PaymentType=="final" || 
    ((trans as TransactionDefaultView).Transaction as Payment).PaymentType=="supplement")))){
      needST=true;
    }
    return needST;
  }

  function getCompanies():List{
    var companies:List = new ArrayList()
    var contacts:ClaimContact[] = this.Claim.Contacts
    
    for(contact in contacts){
      if(contact.Contact.Subtype=="Company" and contact.Contact.Subtype!="CompanyVendor"){
        companies.add( contact.Contact )
      }
    }

    return companies 
  }
}
