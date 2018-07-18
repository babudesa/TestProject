package gw.entity
uses java.util.Set
uses java.util.ArrayList

enhancement GWFixedPropertyIncidentEnhancement : entity.FixedPropertyIncident {
  
  /**
   * Used to decide which property addresses to show in the dropdown list when selecting
   * a property in the AddressInputSet
   */
  property get PropertyAddressValueRange() : PolicyLocation[] {
    // Auto, travel and homeowners only use fixed property for third party incidents
    // and third party incidents shouldn't select from the policy's policy locations
    var thirdParty : Set<PolicyType> = {
      "auto_per", "auto_comm", "travel_per", "homeowners"
    }
    var usePolicyLocations =
            this.Claim.Exposures.hasMatch(\ e -> e.Incident == this and e.LossParty == "insured")
            or not thirdParty.contains(this.Claim.Policy.PolicyType)
    var originalValue : PolicyLocation = null
    if (this.isFieldChanged("Property")) {
      var originalId : Key = this.getOriginalValue("Property") as Key
      originalValue = originalId != null ? PolicyLocation(originalId) : null
    }
    var result = usePolicyLocations
            ? this.AvailableProperties.toList()
            : new ArrayList<PolicyLocation>()
    if (originalValue != null and not result.contains(originalValue)) {
      result.add(originalValue)
    }
    return result.toTypedArray()
  }

}
