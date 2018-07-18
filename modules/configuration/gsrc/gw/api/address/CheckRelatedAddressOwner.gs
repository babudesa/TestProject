package gw.api.address
uses gw.entity.IEntityPropertyInfo
uses java.util.*

abstract class CheckRelatedAddressOwner extends CCAddressOwnerBase {
  
  private var _check : Check
  
  construct(prop : IEntityPropertyInfo, associatedCheck : Check) {
    super(prop)
    _check = associatedCheck
  }
  
  override property get Owner() : KeyableBean {
    return _check
  }
  
  override property get RequiredFields() : Set<AddressOwnerFieldId> {
    switch(InputSetMode){
      case "US":
        return CCAddressOwnerFieldId.US_REQUIREDFIELDS
      case "CA":
        return CCAddressOwnerFieldId.CA_REQUIREDFIELDS
      default:
        return CCAddressOwnerFieldId.DEFAULT_REQUIREDFIELDS
    }
  }
  
  override property get HiddenFields() : Set<AddressOwnerFieldId> {
    var fieldsToHide : Set<AddressOwnerFieldId> = new HashSet<AddressOwnerFieldId>()
    fieldsToHide.add(CCAddressOwnerFieldId.COUNTY)
    fieldsToHide.add(CCAddressOwnerFieldId.ADDRESSTYPE)
    fieldsToHide.add(CCAddressOwnerFieldId.LATITUDE)
    fieldsToHide.add(CCAddressOwnerFieldId.LONGTITUDE)
    
    //Checking for an empty string display name is the one way to detect a "New..." address.
    //Note that the New property just means new in the bundle (publicID is null), which isn't always reliable
    if(this.Address.DisplayName == "" or this.Address.New){
      fieldsToHide.remove(CCAddressOwnerFieldId.ADDRESSTYPE) 
    }
    
    return fieldsToHide
  }
  
  override property get SelectedCountry() : Country {
    return (this.CoreAddress.Country != null) ? this.CoreAddress.Country : null
  }
  
  property get UnavailableFields() : Set<AddressOwnerFieldId> {    
    if(Address == null or isAddressInAddresses()){
      return {CCAddressOwnerFieldId.COUNTRY, CCAddressOwnerFieldId.ADDRESSTYPE,
         CCAddressOwnerFieldId.ADDRESSLINE1, CCAddressOwnerFieldId.ADDRESSLINE2,
         CCAddressOwnerFieldId.CITY, CCAddressOwnerFieldId.STATE, CCAddressOwnerFieldId.POSTALCODE}
    }
      return Collections.emptySet<AddressOwnerFieldId>()
  }
  
  function isAddressInAddresses() : boolean {
    for(addy in this.Addresses){
      if(addy == this.Address and !addy.New){
        return true
      }
    }
    return false
  }

}
