package libraries

@Export
enhancement PolicySummary : entity.PolicySummary
{
  /**this method provides the equivalence of "equals" method function to check if two PolicySummary are the same
    *For the FNOL Wizard, the find policy page needs to store the policySummary to display the results table
    *correctly.  This equality is customizable and defaults to having PolicyType, PolicyNumber, EffecitveDate,
    *and ExpirationDate equal.
    */
  function isSamePolicySummary(summary : PolicySummary) : boolean
  {
    if (summary == null) {
      return false;
    }

    //this array contains the list of database fields that need to checked for equality, add/remove
    //the properties to customize the database fields to check for equality.
    var properties : String[] = {"PolicyType", "PolicyNumber", "EffectiveDate", "ExpirationDate"};
    
    for (policySummaryProperty in properties) {
      if (this.getFieldValue(policySummaryProperty) != summary.getFieldValue( policySummaryProperty )) {
        return false;
      }
    }
    return true;
  }    

  /**this method provides the equivalence of "equals" method function to check if a policySummary is referring to the same
    *policy. For the FNOL Wizard, the set policy method in NewClaimPolicy needs to know if the existing policy is the same
    *one as selected currently on the UI.  This equality is customizable and defaults to having PolicyType, PolicyNumber,
    *EffecitveDate, and ExpirationDate equal.
    *This method is required because it is called from NewClaimPolicy.java
    */
  function isSamePolicy(policy : Policy) : boolean
  {
    if (policy == null) {
      return false;
    }

    //this array contains the list of database fields that need to checked for equality, add/remove
    //the properties to customize the database fields to check for equality.
    var properties : String[] = {"PolicyType", "PolicyNumber", "EffectiveDate", "ExpirationDate"};

    for (policySummaryProperty in properties) {
      if (this.getFieldValue(policySummaryProperty) != policy.getFieldValue( policySummaryProperty )) {
        return false;
      }
    }

    // check the RiskUnits match (if the user selected a limited set of RiskUnits and that set differs
    // from the ones on the downloaded Policy, the policy is considered to differ
    if (CanSelectRiskUnits) {
      return hasSameRiskUnits(policy)
    }

    return true
  }
  
  /**
   * Compares the selected riskunits with the ones on the policy.  Returns true if the 
   * RUNumbers and types match.  Does not check if the policy otherwise
   * matches this summary.
   */
  function hasSameRiskUnits(policy : Policy) : boolean {
    var selectedVehicles = this.Vehicles.where( \ v -> v.Selected )
    var selectedProperties = this.Properties.where( \ p -> p.Selected )
    
    // easy case -- totals don't match
    if (selectedVehicles.Count != policy.Vehicles.Count or
       selectedProperties.Count != policy.Properties.Count) {
      return false
    }
    
    for (selectedVehicle in selectedVehicles) {
      if (!policy.Vehicles.hasMatch(\ v -> v.RUNumber == selectedVehicle.VehicleNumber)) {
        return false
      }
    }
    
    for (selectedProperty in selectedProperties) {
      if (!policy.Properties.hasMatch(\ p -> p.RUNumber == selectedProperty.PropertyNumber)) {
        return false
      }
    }
    
    return true
  }

  property get CanSelectRiskUnits() : boolean {
    return
        // Commercial Auto + vehicle type policy + has vehicle risk units
        (this.PolicyType == "auto_comm" and this.VehiclePolicyType and this.Vehicles.length > 0)
          or
        // Property Auto + property type policy + has property risk units
        (this.PolicyType == "prop_comm" and this.PropertyPolicyType and this.Properties.length > 0)
  }
}