package gw.api.address
uses java.util.Set

class CustomAddressAddressOwner extends AddressAddressOwner {

  construct(inAddress : Address) {
    super(inAddress)
  }
  
  construct(inAddress: Address, contact : Contact){
    super(inAddress, contact)
  }
  
  override property get RequiredFields(): Set<AddressOwnerFieldId>{
      switch(InputSetMode){
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
  
  override property get HiddenFields() : Set<AddressOwnerFieldId> {
    return{CCAddressOwnerFieldId.LATITUDE, CCAddressOwnerFieldId.LONGTITUDE} 
  }
  
  property get UnavailableFields() : Set<AddressOwnerFieldId> {
    return CCAddressOwnerFieldId.NO_FIELDS 
  }
}
