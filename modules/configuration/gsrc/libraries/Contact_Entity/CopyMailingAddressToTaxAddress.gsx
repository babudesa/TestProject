package libraries.Contact_Entity

enhancement CopyMailingAddressToTaxAddress : entity.Contact {
  function copyMailingAddress(){
  
    var taxAddress:Address;
  
    if(this.New and exists(addy in this.AllAddresses where addy.AddressType == "mailing") and
      !exists(addy in this.AllAddresses where addy.AddressType == "Tax")){
  
      for(addr in this.AllAddresses){
        if(addr.AddressType == "Mailing"){
        
          taxAddress = new Address(addr)
          taxAddress.AddressLine1 = addr.AddressLine1
          taxAddress.AddressLine2 = addr.AddressLine2
          taxAddress.City = addr.City
          taxAddress.State = addr.State
          taxAddress.PostalCode = addr.PostalCode
          taxAddress.Country = addr.Country
          taxAddress.County = addr.County
          taxAddress.Description = addr.Description
          taxAddress.AddressType = "Tax"
            
          this.addAddress( taxAddress )
          break;
        }
      }
    }
  }
}
