package libraries.Exposure_Entity
uses java.lang.StringBuffer;
uses java.util.ArrayList
uses gw.api.util.Logger //Added for logging in Debug - SR

enhancement ExposureValidationFunctions : entity.Exposure {
  public function getExposureWarningMessage():String{  
    var warningMsg : String = null;
  
    // 1/3/2008 - zthomas - Defect 479, This rule gives a warning when a feature is created on an Incident Only Claim.
    var sendWarning : Boolean = false;

    var warningMsgOpenClaim : String = displaykey.Web.Claim.OpenIncidentOnlyClaim.Warning.Message;
    var warningMsgClosedClaim : String = displaykey.Web.Claim.ClosedIncidentOnlyClaim.Warning.Message;
  
    if(this.New and this.Claim.IncidentReport){
      sendWarning = true;    
      if(this.Claim.State == "open" or this.Claim.State == "draft"){
        warningMsg = warningMsgOpenClaim;
      }
      if(this.Claim.State =="closed"){
        warningMsg = warningMsgClosedClaim;
      }  
    }  
  
    return warningMsg
  }

  public function checkMultipleAnimals():Boolean{
    // 2/01/08 - zthomas - Defect 259, Ensure features for different animals are created only when feature on other animal is closed because of wrong horse.
    var result : Boolean = false;
    // 2/14/08 - zthomas - Defect 789, modified function to use FixedPropertyIncident to access Property
    // 2/24/09 - kmboyd - Defect 1392, removed Wrong Horse restriction
      if(exists(exp in this.Claim.Exposures where exp.FixedPropertyIncident.Property.PublicID != this.FixedPropertyIncident.Property.PublicID
          and exp.PublicID != this.PublicID)){
        result = true;
      }  
    return result;
  }

/* Sprint/Maintenance Release: EM 55
    Author:ndasari
    Date: 8/30/2013*
    Defect #6400
    For ELD only, generate a soft warning message when a feature is being created with a "feature type" of an exisiting feature
    */
  public function checkFeatureType():Boolean{
    if(this.Claim.LossType== "EXECLIABDIV" and exists(exp in this.Claim.Exposures where 
               exp.ExposureType == this.ExposureType and exp.PublicID != this.PublicID)){   
      return true;    
    }  
    return false;
  }

  public function checkInjuredAnimal():Boolean{
    var result : Boolean = false;
    // 2/21/08 - zthomas - Defect 259, Ensure features have an injured animal.
    if(this.FixedPropertyIncident.Property == null and (this.New or this.Changed)){
      result = true;
    }
  
    return result;
  }

  public function getExposureValidationMessage():String{
    // 2/01/08 - zthomas - Defect 259, Display error messages during New Claim Wizzard process rather than at the end when claim is saved.
    // 2/21/08 - zthomas - Defect 789, Added checks for injured animal.
    // 3/6/09 - kmboyd - Removing the multiple feature restriction
    uses java.lang.StringBuffer;

    var validationMsg : String = null;
    var stringBuffer : StringBuffer = null;
  
    var injuredAnimal : Boolean = this.checkInjuredAnimal();
    var multipleAnimals : Boolean = this.checkMultipleAnimals();
    //var sameFeatureType : Boolean = this.checkFeatureType();
  
    if(this.Claim.State == "draft"){
      stringBuffer = new StringBuffer();
    
      if(injuredAnimal and !multipleAnimals){      
        stringBuffer.append(displaykey.Web.Feature.InjuredAnimal.Validation.Message);
        validationMsg = stringBuffer.toString();   
      }
      if(!injuredAnimal and multipleAnimals){      
        stringBuffer.append(displaykey.Web.Feature.MultipleHorse.Validation.Message);
        validationMsg = stringBuffer.toString();   
      }
      /*if(!injuredAnimal and !multipleAnimals and sameFeatureType){      
        stringBuffer.append(displayKey.Web.Feature.SameFeatureType.Validation.Message);
        validationMsg = stringBuffer.toString();   
      }*/
      if(injuredAnimal and multipleAnimals){      
        stringBuffer.append(displaykey.Web.Feature.InjuredAnimal.Validation.Message + "\n");
        stringBuffer.append(displaykey.Web.Feature.MultipleHorse.Validation.Message);
        validationMsg = stringBuffer.toString(); 
      }
      /*if(injuredAnimal and !multipleAnimals and sameFeatureType){      
        stringBuffer.append(displayKey.Web.Feature.InjuredAnimal.Validation.Message + "\n");
        stringBuffer.append(displayKey.Web.Feature.SameFeatureType.Validation.Message);
        validationMsg = stringBuffer.toString();   
      }
      if(!injuredAnimal and multipleAnimals and sameFeatureType){      
        stringBuffer.append(displayKey.Web.Feature.MultipleHorse.Validation.Message + "\n");
        stringBuffer.append(displayKey.Web.Feature.SameFeatureType.Validation.Message);
        validationMsg = stringBuffer.toString();   
      }
      if(injuredAnimal and multipleAnimals and sameFeatureType){
        stringBuffer.append(displayKey.Web.Feature.InjuredAnimal.Validation.Message + "\n");
        stringBuffer.append(displayKey.Web.Feature.MultipleHorse.Validation.Message + "\n");
        stringBuffer.append(displayKey.Web.Feature.SameFeatureType.Validation.Message);
        validationMsg = stringBuffer.toString();      
      }*/
    }  
  
    return validationMsg;
  }

  //Function added for Defect 3351 (ISO notes not generated) on 6/14/10 by Kamesh. 
  // This function will get called from Exposure Pre-Update to execute the exposure 
  //validation rules to find the validation level of exposure.
  function isoValidate(): gw.api.validation.ValidationResult{
    // added by kgopalan - 05/17/10 - This function called in the exposure post-setup rule (EPOX1300).
    // warnings called by validate function are not displayed on screen.  This function sets a session variable 
    // to indicate that the validation was called by the function.  This prevents messages that only display a given number
    // of times from counting an occurence when they are created by the validate function.
     var currentUser : User = gw.plugin.util.CurrentUserUtil.getCurrentUser().User;

     try{
       var calledByISOValidate session : List;
       var valResult : gw.api.validation.ValidationResult;
   
       if (calledByISOValidate == null){
         calledByISOValidate = new ArrayList();
       }
       calledByISOValidate.add(this);
       valResult = this.validate(true);
       calledByISOValidate.remove(this);
       if(calledByISOValidate.length == 0){
         calledByISOValidate = null;
       }   
       return valResult;
     }catch(e){
       gw.api.util.Logger.logDebug("ExposureValidationFunctions isoValidate - " + currentUser)
       return this.validate(true);
     }
  }

  function safeValidate(validateClaim : boolean): gw.api.validation.ValidationResult{
    // added by blawless - 9/8/09
    // warnings called by validate function are not displayed on screen.  This function sets a session variable 
    // to indicate that the validation was called by the function.  This prevents messages that only display a given number
    // of times from counting an occurence when they are created by the validate function.
    var currentUser : User = gw.plugin.util.CurrentUserUtil.getCurrentUser().User;
    
    try{
      var calledByValidate session : List;
      var valResult : gw.api.validation.ValidationResult;
   
      if (calledByValidate == null){
        calledByValidate = new ArrayList();
      }
      calledByValidate.add(this.Claim.ClaimNumber);
      valResult = this.validate(validateClaim);
      calledByValidate.remove(this.Claim.ClaimNumber);
      if(calledByValidate.length == 0){
        calledByValidate = null;
      }   
      return valResult;
    }catch(e){
      gw.api.util.Logger.logDebug("ExposureValidationFunctions safeValidate - " + currentUser)
      return this.validate(validateClaim);
    }
  }


  function validateVin():String {
    var result:String = null
    try {
      if (!this.VehicleIncident.Vehicle.Vin.matches("[0-9A-HJ-NPR-Za-hj-npr-z]{0,20}") and !this.Claim.Policy.ex_PolicyVersion.contains("Z")){
        result = displaykey.Validator.VIN
      }
      if (!this.VehicleIncident.Vehicle.Vin.matches("[0-9A-HJ-NPR-Za-hj-npr-z]{0,20}") and this.Claim.Policy.ex_PolicyVersion.contains("Z")){
        result = (displaykey.Validator.VINconvertedPolicy + this.Claim.ClaimNumber +"\".")
      }
      return result
    } catch (NullPointerException) {
      return result; //If you need it so VIN needs to be required just change to return displaykey.Validator.VIN
    }
  }


  function booleanValidateVin():boolean {
    try {
      if (!this.VehicleIncident.Vehicle.Vin.matches("[0-9A-HJ-NPR-Za-hj-npr-z]{0,20}")) {
        return true;
      }
    } catch (NullPointerException) {
      return false;
    }
    return false;
  }


  function validateVin(VALUE:String):String {
    var result:String = null
    try {
      //changed to logging in Debug - SR
      Logger.logDebug("I was in the second validate vin!");
      if (!VALUE.matches("[0-9A-HJ-NPR-Za-hj-npr-z]{0,20}")){
        result = displaykey.Validator.VIN
      }
      return result
    } catch (NullPointerException) {
      return result; //If you need it so VIN needs to be required just change to return displaykey.Validator.VIN
    }
  }
}
