package gw.entity
uses gw.api.address.VehicleIncidentAddressOwner
uses gw.api.address.CCAddressOwner

enhancement GWVehicleIncidentAddressOwnerEnhancement : VehicleIncident {
  property get RecoveryAddressOwner() : CCAddressOwner {
    return new VehicleIncidentAddressOwner(this)  
  }
}
