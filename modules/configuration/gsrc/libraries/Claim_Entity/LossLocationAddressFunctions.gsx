package libraries.Claim_Entity
uses java.util.ArrayList;

enhancement LossLocationAddressFunctions : entity.Claim {
  function storeFormerLossLocation(currentLossLocation: Address): boolean{
    var lossLocation:LossLocationExt;
    var storedAddress:boolean = false;
  
    if(currentLossLocation != null and 
    !(exists (addy in this.FormerLossLocationsExt where addy.Address.DisplayName == currentLossLocation.DisplayName))){
      lossLocation = new LossLocationExt(this);
      lossLocation.Address.AddressLine1 = currentLossLocation.AddressLine1;
      lossLocation.Address.AddressLine2 = currentLossLocation.AddressLine2;
      lossLocation.Address.City = currentLossLocation.City;
      lossLocation.Address.State = currentLossLocation.State;
      lossLocation.Address.PostalCode = currentLossLocation.PostalCode;
      lossLocation.Address.Country = currentLossLocation.Country;
      lossLocation.Address.County = currentLossLocation.County
      lossLocation.Address.Description = "Former Loss Location Address";
      lossLocation.Address.AddressType = "other";

      this.addToFormerLossLocationsExt(lossLocation);
    
      storedAddress = true;
    }
  
    return storedAddress;
  }


  function getLossLocationAddresses(): Address[]{
    var addressList : List = new ArrayList();
   
    // 3/6/2008 - zthomas - Defect 867, Add current loss location first so it will be in the address drop down.
    // 3/6/2008 - zthomas - Defect 867, Prevent blank line from appearing in Loss Location list.
    if(this.LossLocation != null and this.LossLocation.DisplayName != ""){
      addressList.add( this.LossLocation );
    }
  
    for(address in this.Addresses)
    {
  // 2/12/2008 - zthomas - Defect 867, Prevent duplicate addresses from appearing in the Loss Location list.
  // 7/27/12 erawe - for PIM only we only want to display the addresses from LocationBasedRU that do have coverages.
  	  if(address.DisplayName != "" and !exists(addy in addressList where (addy as Address).DisplayName == address.DisplayName)){
           if(this.LossType=="PIMINMARINE"){
           var propaddy  = this.Policy.Properties.where(\ prop -> prop.Coverages.length < 1 )*.PolicyLocation*.Address
           if(!propaddy.contains(address)){
           addressList.add(address);
           }
           }else
           addressList.add(address);
        } 
    }
  
    for(lossLocation in this.FormerLossLocationsExt)
    {
      if(lossLocation.Address.DisplayName != this.LossLocation.DisplayName and
      !(exists(addy in this.Addresses where addy.DisplayName == lossLocation.Address.DisplayName))){
        addressList.add(lossLocation.Address);
      }
    }
   /*Below logic is added as part of defect : 8385 - cprakash - 3/9/2016, except the if(state!=null) condition. Erawe added 
   that so AC foreign address would show in the loss location screen. erawe - 10/4/16
   */  
    if(!this.Addresses.where(\ a -> a.State!=null).IsEmpty){
      var sortedAddressList = gw.util.AddressUtil.sortAddresses(addressList)
      return sortedAddressList
    }else
    return (addressList.toArray() as Address[]);
  }

}
