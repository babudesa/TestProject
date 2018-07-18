package gw.entity

uses gw.api.address.CCAddressOwner
uses gw.api.address.CheckPayToAddressOwner
uses gw.api.address.CheckMailToAddressOwner

enhancement CheckAddressOwnerEnhancement : entity.Check {

  property get PayToAddressOwner() : CCAddressOwner {
    return new CheckPayToAddressOwner(this) 
  }
  property get MailToAddressOwner() : CCAddressOwner { 
   // return new CheckMailToAddressOwner(this)
   
    
    var addyOwner = new CheckMailToAddressOwner(this)
    
    if(exists(payee in this.Payees where payee.Payee.Ex_TaxStatusCode.Code ==  "B" or payee.Payee.Ex_TaxStatusCode.Code == "T") and (this.DeliveryMethod != "agent")){
      var cAccounting : Company = null;
      
      for(clmCont in this.Claim.Contacts){
        if(clmCont.Contact typeis Company && clmCont.Contact.Name == "Great American Insurance Company"){
          cAccounting = clmCont.Contact;
          break;
        }
      }
      
      if(cAccounting == null){
        cAccounting = new Company()
      }

      cAccounting.Name = "Great American Insurance Company";
  
      addyOwner.Address.AddressType = "mailing";
      addyOwner.Address.AddressLine1 = "Compliance Accounting Department";
      addyOwner.Address.AddressLine2 = "301 East Fourth Street, 16th Floor";
      addyOwner.Address.City = "Cincinnati";
      addyOwner.Address.State = "OH";
      addyOwner.Address.Country = "US";
      addyOwner.Address.PostalCode = "45202";
      
      this.ex_MailTo = cAccounting;
    }
    
    return addyOwner

  }
  
}
