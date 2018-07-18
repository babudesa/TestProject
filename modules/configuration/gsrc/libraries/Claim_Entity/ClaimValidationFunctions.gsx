package libraries.Claim_Entity
uses java.util.ArrayList;

enhancement ClaimValidationFunctions : entity.Claim {
  //Function added for Defect 3351 (ISO notes not generated) on 07/19/10 by Stephanie Przygocki
  // This function will get called from Exposure Pre-Update to execute the exposure 
  // validation rules to find the validation level of exposure.
  function isoValidate(): gw.api.validation.ValidationResult{
     var currentUser : User = gw.plugin.util.CurrentUserUtil.getCurrentUser().User;
     
     try{
       var calledByISOValidate session : List;
       var valResult : gw.api.validation.ValidationResult;
   
       if (calledByISOValidate == null){
         calledByISOValidate = new ArrayList();
       }
       calledByISOValidate.add(this.ClaimNumber);
       valResult = this.validate( false );
       calledByISOValidate.remove(this.ClaimNumber);
       if(calledByISOValidate.length == 0){
         calledByISOValidate = null;
       }   
       return valResult;
     }catch(e){
       gw.api.util.Logger.logDebug("ClaimValidationFunctions isoValidate - " + currentUser)
       return this.validate(false);
     }
  }  

  function validateVin(VALUE:String):String {
    var result:String = null
    try{
      if (!VALUE.matches("[0-9A-HJ-NPR-Za-hj-npr-z]{0,20}")) {
        result = displaykey.Validator.VIN
      }
      return result
    } catch(NullPointerException) {
      return result; //If you need it so VIN needs to be required just change to return displaykey.Validator.VIN
    }
  }
  
  /*4/12/17 Use for condition to check if claim is valid in order to create activity*/
  function isClaimOpenToCreateActivity(): boolean {
    var result = false
    if (this.AssignmentStatus == AssignmentStatus.TC_ASSIGNED and
      this.IncidentReport == false and
      this.State != Claimstate.TC_CLOSED and
      this.State != ClaimState.TC_DRAFT){
        result = true
    }
    return result;
  }
   
}
