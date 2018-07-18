package gw.api.address
uses java.util.Set
uses gw.api.util.LocationUtil

/**
 * CCAddressOwner object for the LocationBasedRU entity.
 * See AddressOwner and CCAddressOwner for details of what an
 * AddressOwner object does.
 */
@Export
class LocationBasedRUAddressOwner extends PolicyRelatedAddressOwner {

  var _riskUnit : LocationBasedRU
  
  construct(riskUnit : LocationBasedRU) {
    super(getAddressProperty(entity.PolicyLocation, "Address"), riskUnit.Policy)
    _riskUnit = riskUnit
  }
  
  override property get Owner() : KeyableBean {
    return _riskUnit.PolicyLocation
  }

  override property get RequiredFields() : Set<AddressOwnerFieldId> {
    if(_riskUnit != null && _riskUnit.Policy.Claim.LossType == LossType.TC_EQUINE) {
      if (SelectedCountry != null) {
        return {CCAddressOwnerFieldId.STATE}.freeze()
      } else {
        return CCAddressOwnerFieldId.NO_FIELDS.freeze()
      }
    } else {
      if(SelectedCountry == null) {
        return {CCAddressOwnerFieldId.COUNTRY}.freeze()
      } else {
        return {CCAddressOwnerFieldId.COUNTRY, CCAddressOwnerFieldId.STATE}.freeze()
      }
    }
  }
  
  override property get HiddenFields() : Set<AddressOwnerFieldId> {
    //Hide Address Type for all lines of business
    var hideTheseFields : Set<AddressOwnerFieldId> = new java.util.HashSet<AddressOwnerFieldId>({CCAddressOwnerFieldId.ADDRESSTYPE})
    
    //Hide Latitude and Longitude on Policy Properties screen for Equine
    if(this._riskUnit.Policy.Claim.LossType == LossType.TC_EQUINE)
    {
      hideTheseFields.add(CCAddressOwnerFieldId.LATITUDE)
      hideTheseFields.add(CCAddressOwnerFieldId.LONGTITUDE)
    }
    return hideTheseFields
  }

  override property get SelectedCountry() : Country {
    return CoreAddress.Country == null ? null : CoreAddress.Country
  }

  property get UnavailableFields() : Set<AddressOwnerFieldId> {
    if(SelectedCountry == null) {
      return {CCAddressOwnerFieldId.ADDRESSLINE1, CCAddressOwnerFieldId.ADDRESSLINE2,
              CCAddressOwnerFieldId.CITY, CCAddressOwnerFieldId.STATE, CCAddressOwnerFieldId.COUNTY,
              CCAddressOwnerFieldId.POSTALCODE, CCAddressOwnerFieldId.LATITUDE, CCAddressOwnerFieldId.LONGTITUDE}
    } else {
      return CCAddressOwnerFieldId.NO_FIELDS 
    }
  }
  
  override property get ShowAddressSummary() : boolean {
    return false
  }

}
