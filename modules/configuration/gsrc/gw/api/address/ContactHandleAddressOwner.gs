package gw.api.address
uses gw.api.contact.ContactHandle
uses java.util.Set

/**
 * CCAddressOwner object for ContactHandles; ContactHandles are
 * used to refer to contacts that may be replaced by a sync
 * operation with the address book.
 * <p>
 * See AddressOwner and CCAddressOwner for details of what an
 * AddressOwner object does.
 */
@Export
class ContactHandleAddressOwner extends ContactAddressOwnerBase {

  private var _contactHandle : ContactHandle
    
  construct(conHandle : ContactHandle) {
     super(getAddressProperty(entity.Contact, "PrimaryAddress"))
    _contactHandle = conHandle
  }
  
  override property get Owner() : Contact {
    return _contactHandle.Contact
  }
  
  override property get DefaultCountry() : Country {
    return null 
  }
  
  property get UnavailableFields() : Set<AddressOwnerFieldId> {
    if(CoreAddress.Country == null){
      return {CCAddressOwnerFieldId.ADDRESSTYPE, CCAddressOwnerFieldId.ADDRESSLINE1, CCAddressOwnerFieldId.ADDRESSLINE2,
              CCAddressOwnerFieldId.CITY, CCAddressOwnerFieldId.COUNTY, CCAddressOwnerFieldId.STATE, CCAddressOwnerFieldId.POSTALCODE}
    }
    else{
      return CCAddressOwnerFieldId.NO_FIELDS 
    }
  }
  
  override property get ShowAddressSummary() : boolean {
    return false 
  }
  
  override property get RequiredFields() : Set<AddressOwnerFieldId> {
    switch(CoreAddress.Country){
      case null:
        return CCAddressOwnerFieldId.NO_FIELDS
      case "US":
          return CCAddressOwnerFieldId.US_REQUIREDFIELDS
      case "CA":
        return CCAddressOwnerFieldId.CA_REQUIREDFIELDS
      default:
        return CCAddressOwnerFieldId.DEFAULT_REQUIREDFIELDS
    }
  }
  
  override property get SelectedCountry() : Country {
    if(Address.New and Address.DisplayName == ""){
      return DefaultCountry
    } else{
      return CoreAddress.Country
    }
  }
  
  override property get InputSetMode() : Country {
    return CoreAddress.Country 
  }

  /* Cannot override because superclass marked this property as final
  
  override property get RequiredFields() : Set<AddressOwnerFieldId> {
    return Collections.emptySet<AddressOwnerFieldId>()
  }
  */

}
