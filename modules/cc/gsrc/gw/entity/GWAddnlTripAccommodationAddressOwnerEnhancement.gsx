package gw.entity
uses gw.api.address.AddnlTripAccommodationAddressOwner
uses gw.api.address.CCAddressOwner

enhancement GWAddnlTripAccommodationAddressOwnerEnhancement : AddnlTripAccommodation {

  property get AddressOwner() : CCAddressOwner {
    return new AddnlTripAccommodationAddressOwner(this)
  }

}
