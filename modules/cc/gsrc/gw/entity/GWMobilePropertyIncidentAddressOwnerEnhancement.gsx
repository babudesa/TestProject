package gw.entity
uses gw.api.address.MobilePropertyIncidentAddressOwner
uses gw.api.address.CCAddressOwner

enhancement GWMobilePropertyIncidentAddressOwnerEnhancement : MobilePropertyIncident {
  property get AddressOwner() : CCAddressOwner { 
    return new MobilePropertyIncidentAddressOwner(this)
  }
}
