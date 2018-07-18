package libraries.Check_Entity
uses java.util.ArrayList;

enhancement AdditionalPayees : entity.Check {
  function getUnpaidPayableClaimContacts():List{
    var payeeList = new ArrayList(); 
  
    //for(claimCont in this.Claim.Contacts){// Loop through claim contacts
    for(contact in this.Claim.getRelatedContacts()){// Loop through related contacts
      var claimContQuery = find(cont in ClaimContact where cont.Contact == contact)// Find matching ClaimContact
      var claimCont : ClaimContact = claimContQuery.getAtMostOneRow()
      // Prevent blank claimcontact
      if(claimCont != null){
        // Don't allow agency in payee list.
        if(!claimCont.hasRole( "agency" ) and claimCont.Contact.Subtype!="LegacyVendorCompanyExt"
        and (claimCont.CompanyVendor == null or (claimCont.CompanyVendor.PayableExt==true and claimCont.CompanyVendor.gaic_LinkedAndSynced()))  
        and (claimCont.PersonVendor == null  or (claimCont.PersonVendor.PayableExt==true and claimCont.PersonVendor.gaic_LinkedAndSynced()))){
          if(exists(payee in this.Payees where payee.Payee==claimCont.Contact)){
            continue;
          } else {
          // Add payee to list if suggested payee type is a vendor
            if(this.getSuggestedPayeeType( claimCont.Contact )=="vendor"){
              payeeList.add( claimCont.Contact )
            }
          }
        }
      }// End Contact Loop
    }  
    return payeeList;
  }
}
