package libraries.Policy_Entity
uses java.util.ArrayList

enhancement PolicyValidationFunctions : entity.Policy {
  function isoValidate(): gw.api.validation.ValidationResult{

    var currentUser : User = gw.plugin.util.CurrentUserUtil.getCurrentUser().User;
    
    try{
      var calledByISOValidate session : List;
      var valResult : gw.api.validation.ValidationResult;
   
      if (calledByISOValidate == null){
        calledByISOValidate = new ArrayList();
      }
      calledByISOValidate.add(this.PolicyNumber);
      valResult = this.validate();
      calledByISOValidate.remove(this.PolicyNumber);
      if(calledByISOValidate.length == 0){
        calledByISOValidate = null;
      }   
      return valResult;
    }catch(e){
      gw.api.util.Logger.logDebug("PolicyValidationFunctions isoValidate - " + currentUser)
      return this.validate();
    }
  }
  
  function validateVin(VALUE:String):String
  {
    var result:String = null
    try{
      if (!VALUE.matches("[0-9A-HJ-NPR-Za-hj-npr-z]{0,20}")){
        result = displaykey.Validator.VIN
      }
      return result
    }
    catch(NullPointerException){
      return result; //If you need it so VIN needs to be required just change to return displaykey.Validator.VIN
    }
  
  }
  
  function validatePolicyNumber():String{
    if(this.PolicyNumber != null){
      if(this.PolicyNumber.matches("[0]{7}") or this.PolicyNumber.matches("[9]{7}")){
        return displaykey.Validator.InvalidPolicyNumber
      }else{
        return null;
      }
    }else{
      return null;
    }
  }
  
  //returns an error string if there is a duplicate premises and building number combination, otherwise returns an empty string
  function validatePremisesBuildingCombo() : String {
    var preconditionsMet = \ prop1 : LocationBasedRU, prop2 : LocationBasedRU -> {
      return prop1 != prop2 && 
             prop1 typeis PropertyRU && 
             prop2 typeis PropertyRU &&
             prop1.Property.RiskTypeExt == EDWRiskType.TC_BLDG &&
             prop2.Property.RiskTypeExt == EDWRiskType.TC_BLDG &&
             prop1.PropertyNumberExt == prop2.PropertyNumberExt &&
             prop1.Property.BuildingNumberExt == prop2.Property.BuildingNumberExt
    }
    var props = this.Properties
    var n = 0
    var i = 0
    var prop1 : LocationBasedRU
    var prop2 : LocationBasedRU

    while(n < props.Count){
      prop1 = props[n]
      while(i < props.Count){
        prop2 = props[i]
        if(preconditionsMet(prop1, prop2)){
          //Duplicate Premises/Building combo found, reject policy
          return displaykey.Validation.Policy.Unverified.PIMUniquePremisesBuildingCombo(prop1.Property.BuildingNumberExt, (prop1 as PropertyRU).PropertyNumberExt)
        }
        i++
      }
      n++
      i = n
    }    
    return ""
  }
  
  function validateRiskTypeUniqueness() : String{
    //This block returns true if the given type is one of the risk types that should 
    //not be duplicated.
    var riskTypesOfInterestAndEqual = \ risk1 : EDWRiskType, risk2 : EDWRiskType -> {
      var riskTypesOfInterest = {EDWRiskType.TC_COVPROP, EDWRiskType.TC_PERSPROP, EDWRiskType.TC_TIMELEMENT}
      
      return riskTypesOfInterest.contains(risk1) && riskTypesOfInterest.contains(risk2) && risk1 == risk2
    }

    //This block returns true if both properties refer to the same location
    var sameBuilding = \ prop1 : LocationBasedRU, prop2 : LocationBasedRU -> {
      return prop1 typeis PropertyRU && prop2 typeis PropertyRU &&
             prop1.Property.BuildingNumberExt == prop2.Property.BuildingNumberExt &&
             prop1.PropertyNumberExt == prop2.PropertyNumberExt
    }
    
    var props = this.Properties
    var n = 0
    var i = 0
    var prop1 : LocationBasedRU
    var prop2 : LocationBasedRU
    
    while(n < props.Count){
      prop1 = props[n]
      while(i < props.Count){
        prop2 = props[i]
        if(prop1 != prop2 && 
          riskTypesOfInterestAndEqual(prop1.Property.RiskTypeExt, prop2.Property.RiskTypeExt) &&
          sameBuilding(prop1, prop2)){         
           return displaykey.Validation.Policy.Unverified.PIMUniqueBuildingRiskType(prop1.Property.RiskTypeExt.DisplayName, (prop1 as PropertyRU).PropertyNumberExt, prop1.Property.BuildingNumberExt)
        }
        i++            
      }
      n++
      i = n
    }
    return "" 
  }
  
  function validatePropertyUniqueness() : String{
    var preconditionsMet = \ prop1 : LocationBasedRU, prop2 : LocationBasedRU -> {
      return prop1 != prop2 &&
             prop1 typeis PropertyRU &&
             prop2 typeis PropertyRU &&
             prop1.PropertyNumberExt == prop2.PropertyNumberExt &&
             prop1.Property.BuildingNumberExt == prop2.Property.BuildingNumberExt &&
             prop1.Property.RiskNumberExt == prop2.Property.RiskNumberExt &&
             prop1.Property.RiskTypeExt == prop2.Property.RiskTypeExt             
    }
    
    var props = this.Properties
    var n = 0
    var i = 0
    var prop1 : LocationBasedRU
    var prop2 : LocationBasedRU
    
    while(n < props.Count){
      prop1 = props[n]
      while(i < props.Count){
        prop2 = props[i]
        if(preconditionsMet(prop1, prop2)){
          return displaykey.Validation.Policy.Unverified.PIMUniqueRisk 
        }
        i++
      }
      n++
      i = n
    }
    return ""
  }
  //dnmiller 8/2014 - function added for PIM Builder's Risk to prevent more than one of each Risk Type being added to a Jobsite Number
  function validateJobsiteRiskType() : String {
    var preconditionsMet = \ prop1 : LocationBasedRU, prop2 : LocationBasedRU -> {
      return prop1 != prop2 && 
             prop1 typeis JobsiteRUExt && 
             prop2 typeis JobsiteRUExt &&
             //(prop1.Property.RiskTypeExt == "COVPROP" || prop1.Property.RiskTypeExt == "TIMELEMENT") &&
             prop1.Property.RiskTypeExt == prop2.Property.RiskTypeExt &&
             prop1.JobsiteNumberExt == prop2.JobsiteNumberExt
             
    }
    var props = this.Properties
    var n = 0
    var i = 0
    var prop1 : LocationBasedRU
    var prop2 : LocationBasedRU

    while(n < props.Count){
      prop1 = props[n]
      while(i < props.Count){
        prop2 = props[i]
        if(preconditionsMet(prop1, prop2)){
          //Duplicate Jobsite Number/Risk Type combo found, reject policy
          return displaykey.Validation.Policy.Unverified.PIMUniqueJobsiteRiskType(prop1.Property.RiskTypeExt, (prop1 as JobsiteRUExt).JobsiteNumberExt)
        }
        i++
      }
      n++
      i = n
    }    
    return ""
  }
}
