package gw.api.address
uses java.util.Set
uses java.lang.UnsupportedOperationException
uses gw.api.admin.BaseAdminUtil

/**
 * A very basic address owner used to wrap an already existing address so that
 * it conforms to the CCAddressOwner interface. This implementation does not
 * support picking from a range of addresses and always shows all the address
 * fields (so ShowAddressSummary always returns false)
 */
@Export
class AddressAddressOwner implements CCAddressOwner {

      var _address : Address
      var _contact : Contact
  
      construct(inAddress : Address) {  
        _address = inAddress
      }
  
      construct(inAddress : Address,contact : Contact) {  
        _address = inAddress
        _contact = contact
      }

      override property get Address() : Address {
        return _address
      }

      override property set Address(value : Address) {
        if(_address != value) {
          throw new UnsupportedOperationException("Address reference cannot be changed.")
        }
      }

   override property get RequiredFields() : Set<AddressOwnerFieldId> {
            switch(InputSetMode){
                case "US":
                  if(Address.AddressType == null)
                     return {CCAddressOwnerFieldId.ADDRESSTYPE}
                  else 
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

      override property get Addresses() : Address[] {
        return null
      }

      override function getOrCreateNewAddress() : Address {
        return CCAddressOwnerUtil.createNewNonPersistentAddress(_address.Bundle)
      }

      override property get NonEditableAddresses() : Set<Address> {
        return {}
      }

      override property get Claim() : Claim {
        return null
      }

      override property get DefaultCountry() : Country {
        return BaseAdminUtil.getDefaultCountry()
      }

      override property get SelectedCountry() : Country {
        return _address.Country
      }

      override property set SelectedCountry(value : Country) {
        _address.Country = value
      }

      override property get InputSetMode() : Country {
        return SelectedCountry
      }

      override property get ShowAddressSummary() : boolean {
        return false
      }

      override property get ConfirmCountryChange() : boolean {
        return true
      }

      override property get AddressNameLabel() : String {
        return null
      }
  
     function addressOwnerContact() : Contact {    
              return _contact
     }



}
