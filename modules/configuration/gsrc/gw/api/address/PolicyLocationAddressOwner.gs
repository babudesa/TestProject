package gw.api.address
uses java.util.Set
uses gw.api.util.LocationUtil
uses gw.entity.IEntityPropertyInfo
uses gw.util.concurrent.LazyVar
uses java.util.HashSet

/**
 * A rather complex CCAddressOwner that allows the AddressInputSet to be used
 * to pick the policy location for a FixedPropertyIncident. It presents all
 * addresses belonging to the available policy locations and, when the user
 * picks an address, it finds the corresponding policy location and sets that
 * on the FixedPropertyIncident.
 * <p>
 * In this address owner, only the actual address name field is required i.e.
 * you have to set an address but it can be empty. This is for backwards
 * compatibility with previous versions of ClaimCenter. Customers may prefer
 * to use the standard claim file required fields
 */
@Export
class PolicyLocationAddressOwner implements CCAddressOwner {

  var _fixedPropertyIncident : FixedPropertyIncident
  var _newPolicyLocation : PolicyLocation
  var _propertyAddressValueRange = LazyVar.make(\ -> _fixedPropertyIncident.PropertyAddressValueRange)
  var _nonEditableAddresses = LazyVar.make(\ -> findNonEditableAddresses())
  
  construct(fixedPropertyIncident : FixedPropertyIncident, newPolicyLocation : PolicyLocation) {
    _fixedPropertyIncident = fixedPropertyIncident
    _newPolicyLocation = newPolicyLocation
  }

  override property get Address() : Address {
    return _fixedPropertyIncident.Property.Address
  }

  override property set Address(value : Address) {
    if (value != Address) {
      setPolicyLocationFromAddress(value)
    }
  }
  
  override property get RequiredFields() : Set<AddressOwnerFieldId> {
    if(Address.Country=="US" or Address.Country=="CA"){
      return {CCAddressOwnerFieldId.STATE}
    }
    return java.util.Collections.emptySet<AddressOwnerFieldId>()
    }


  override property get HiddenFields() : Set<AddressOwnerFieldId> {
    return CCAddressOwnerFieldId.INJURED_ANIMAL_HIDDEN
  }

  override property get Addresses() : Address[] {
    return _propertyAddressValueRange.get().map(\ p -> p.Address)
  }
  
  /*
    returns this.Address if it is not null, otherwise returns the result of getOrCreateNewBeanFor(...)
  */
  override function getOrCreateNewAddress() : Address {
    
    if(this.Address != null){
      return this.Address 
    } else {
      var prop = entity.PolicyLocation.Type.TypeInfo.getProperty("Address") as IEntityPropertyInfo
    
      return CCAddressOwnerUtil.getOrCreateNewBeanFor(
        _newPolicyLocation, prop, \ -> {
          var result = new Address()
          result.Country = DefaultCountry
          _newPolicyLocation.Address = result
          return result
      })
    }
  }

  override property get NonEditableAddresses() : Set<Address> {
    return _nonEditableAddresses.get()
  }

  override property get Claim() : Claim {
    return null
  }

  override property get DefaultCountry() : Country {
    return null
    /*
    var incidentClaim = _fixedPropertyIncident.Claim
    return (incidentClaim.Policy.insured.PrimaryAddress.Country != null)
             ? incidentClaim.Policy.insured.PrimaryAddress.Country
             : BaseAdminUtil.getDefaultCountry()\
    */
  }

  override property get SelectedCountry() : Country {
    var addressCountry = Address.Country
    return addressCountry != null ? addressCountry : DefaultCountry
  }

  override property set SelectedCountry(newValue : Country) {
    var normalizedNewValue = newValue != null ? newValue : DefaultCountry
    if (this.Address != null or normalizedNewValue != DefaultCountry) {
      this.Address.Country = normalizedNewValue
    }
  }

  override property get InputSetMode() : Country {
    return SelectedCountry
  }

  override property get ShowAddressSummary() : boolean {
    return not LocationUtil.isCurrentLocationEditable()
  }

  override property get ConfirmCountryChange() : boolean {
    return true
  }

  /**
   * Override the address name to make it clear the user is picking a property
   * (policy location) not just an address.
   */
  override property get AddressNameLabel() : String {
    return displaykey.Web.FixedPropertyIncident.Property.LocationPicker
  }

  property get UnavailableFields() : Set<AddressOwnerFieldId> {
    if(SelectedCountry == null) {
      return {CCAddressOwnerFieldId.ADDRESSLINE1, CCAddressOwnerFieldId.ADDRESSLINE2,
              CCAddressOwnerFieldId.CITY, CCAddressOwnerFieldId.STATE, CCAddressOwnerFieldId.COUNTY,
              CCAddressOwnerFieldId.POSTALCODE}
    } else {
      return CCAddressOwnerFieldId.NO_FIELDS 
    }
  }
  
  /**
   * Look up the existing policy location with the given address and, if found,
   * set it to be the incident's current location. If the address corresponds to
   * the new policy location then set incident's location to be the new policy
   * location. If the address is null set the incident's policy location to null.
   */
  private function setPolicyLocationFromAddress(newValue : Address) {
    if (newValue != null) {
      var policyLocationMatch = findExistingPolicyLocationForAddress(newValue)
      if (policyLocationMatch != null) {
        _fixedPropertyIncident.Property = policyLocationMatch
      } else if (_newPolicyLocation.Address == newValue) {
        _fixedPropertyIncident.Property = _newPolicyLocation
      } else {
        //throw new IllegalArgumentException("Address must be new or belong to a PolicyLocation.")
        _newPolicyLocation.Address = newValue
        _fixedPropertyIncident.Property = _newPolicyLocation
      }
    } else {
      _fixedPropertyIncident.Property = null
    }
  }

  /**
   * Any addresses that come from a verified policy property must not be edited
   */  
  private function findNonEditableAddresses() : Set<Address> {
    var incidentClaim = _fixedPropertyIncident.Claim
    //var readOnlyProperties = incidentClaim.Policy.Verified
    var readOnlyProperties = (_fixedPropertyIncident.Property != null && !_fixedPropertyIncident.Property.New && _fixedPropertyIncident.Property.Policy.Verified)
            ? incidentClaim.PolicyProperties.toSet().intersect(_propertyAddressValueRange.get().toSet())
            : new HashSet<PolicyLocation>()
    var readOnlyAddresses = readOnlyProperties.map(\ p -> p.Address).toSet()
    if (_fixedPropertyIncident.Property == null || _fixedPropertyIncident.Property.Address.Country != null) {
      readOnlyAddresses.add(null)
    }
    return readOnlyAddresses
  }

  private function findExistingPolicyLocationForAddress(policyLocationAddress : Address) : PolicyLocation {
    return _propertyAddressValueRange.get()
            .firstWhere(\ p -> p.Address == policyLocationAddress)
  }
  
}