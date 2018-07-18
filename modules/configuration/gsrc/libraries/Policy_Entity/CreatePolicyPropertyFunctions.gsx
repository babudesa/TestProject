package libraries.Policy_Entity
uses java.lang.Integer

enhancement CreatePolicyPropertyFunctions : entity.Policy {
  
  function createPolicyProperty(): PropertyRU {
    var aPhysicalProperty = new PolicyLocation();
    var aPolicyProperty = new PropertyRU();
    var aBuilding = new Building();
    aBuilding.PolicyLocation = aPhysicalProperty;
    aPolicyProperty.Building = aBuilding;
    aPhysicalProperty.Policy = this
    aPhysicalProperty.PhyPropEffDateExt = this.EffectiveDate
    aPhysicalProperty.PhyPropExpDateExt = this.ExpirationDate
    aPhysicalProperty.Policy = this
    aPolicyProperty.Property = aPhysicalProperty;
    aPolicyProperty.Policy = this
    var maxPropNumber : int = 0
    var maxRUNumber: int = 0
    for (p in this.Properties) {
      if (p typeis PropertyRU) {
        if (p.PropertyNumberExt != null && p.PropertyNumberExt > maxPropNumber) {
          maxPropNumber = p.PropertyNumberExt;
        }        
        if(p.RUNumber != null && p.RUNumber > maxRUNumber){
          maxRUNumber = p.RUNumber  
        }
      }
    }
    aPolicyProperty.RUNumber = maxRUNumber + 1
    aPolicyProperty.PropertyNumberExt = maxPropNumber + 1;
  
    return aPolicyProperty;
  }
  
  
  //2014 dnmiller - Function added to create Jobsites for PIM Builder's Risk
  function createPolicyJobsite(): JobsiteRUExt {
    var aPhysicalJobsite = new PolicyLocation();
    var aPolicyJobsite = new JobsiteRUExt();
    var aBuilding = new Building();
    aBuilding.PolicyLocation = aPhysicalJobsite;
    aPolicyJobsite.Building = aBuilding;
    aPhysicalJobsite.Policy = this
    aPhysicalJobsite.PhyPropEffDateExt = this.EffectiveDate
    aPhysicalJobsite.PhyPropExpDateExt = this.ExpirationDate
    aPhysicalJobsite.Policy = this
    aPolicyJobsite.Policy = this
    aPolicyJobsite.Property = aPhysicalJobsite;
   
    var maxJobNumber : int = 0
    var maxRUNumber: int = 0
    for (j in this.Properties) {
      if (j typeis JobsiteRUExt) {
        if (j.JobsiteNumberExt != null && j.JobsiteNumberExt > maxJobNumber) {
          maxJobNumber = j.JobsiteNumberExt;
        }        
        if(j.RUNumber != null && j.RUNumber > maxRUNumber){
          maxRUNumber = j.RUNumber  
        }
      }
    }
    aPolicyJobsite.RUNumber = maxRUNumber + 1
    aPolicyJobsite.JobsiteNumberExt = maxJobNumber + 1;
  
  
    return aPolicyJobsite;
  }
}
