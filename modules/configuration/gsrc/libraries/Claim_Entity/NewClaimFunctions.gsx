package libraries.Claim_Entity
uses java.util.ArrayList;
uses gw.api.claim.NewClaimWizardInfo

enhancement NewClaimFunctions : entity.Claim {
  // 03/27/2008 - zthomas - Defect 938, Function used to ensure verified policy numbers are obtained through policy search only.
  function validateVerifiedPolicySelected(verifiedPolNum : String, policyVerified : Boolean, verifiedPolicyInfo : util.custom_Ext.VerifiedPolicyInfo) : String{
    var validationExpression : String = null;
    var errorMsg : String = displaykey.Web.Policy.VerifiedPolicySelected.Validation.Message;
    var verifiedPolicySelected : Boolean = verifiedPolicyInfo.VerifiedPolicySelected;
    var selectedVerifiedPolicyNumber : String = verifiedPolicyInfo.SelectedVerifiedPolicyNumber;
  
    if(verifiedPolNum != null and policyVerified){
      if(!verifiedPolicySelected and this.Policy.PolicyNumber == null and selectedVerifiedPolicyNumber != verifiedPolNum){
        validationExpression = errorMsg;
      }
      if(!verifiedPolicySelected and this.Policy.PolicyNumber != null and this.Policy.PolicyNumber != verifiedPolNum){
        validationExpression = errorMsg;
      }
      if(!verifiedPolicySelected and this.Policy.PolicyNumber == null and selectedVerifiedPolicyNumber == verifiedPolNum){
        validationExpression = errorMsg;
      }
      if(verifiedPolicySelected and selectedVerifiedPolicyNumber != verifiedPolNum){
        validationExpression = errorMsg;
        //verifiedPolicyInfo.setVerifiedPolicySelected( false );
        verifiedPolicyInfo.VerifiedPolicySelected = false 
      }
    }
  
    return validationExpression;
  }


  function safeValidate(validateExposures : boolean): gw.api.validation.ValidationResult {
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
      calledByValidate.add(this.ClaimNumber);
      valResult = this.validate(validateExposures);
      calledByValidate.remove(this.ClaimNumber);
      if(calledByValidate.length == 0){
        calledByValidate = null;
      }   
      return valResult;
    }catch(e){
      gw.api.util.Logger.logDebug("NewClaimFunctions safeValidate - " + currentUser)
      return this.validate(validateExposures);
    }
  }
  
  function setClaimInfo(wizard:NewClaimWizardInfo){
  if(wizard.ClaimMode.LossType == "AGRIAUTO"){
    this.NCWOnlyBusinessUnitExt = "ab"
    this.BusinessLineExt = "AGRIAUTO"
    //Claim.LossType = "AGRIAUTO"
  }
  if(wizard.ClaimMode.LossType == "AGRILIABILITY"){
    this.NCWOnlyBusinessUnitExt = "ab"
    this.BusinessLineExt = "AGRILIABILITY"
    //Claim.LossType = "AGRILIABILITY"
  }
  if(wizard.ClaimMode.LossType == "AGRIPROPERTY"){
    this.NCWOnlyBusinessUnitExt = "ab"
    this.BusinessLineExt = "AGRIPROPERTY"
    //Claim.LossType = "AGRIPROPERTY"
  }
  if(wizard.ClaimMode.LossType == "EQUINE"){
    this.NCWOnlyBusinessUnitExt = "eq"
    this.BusinessLineExt = "EQUINE"
    //Claim.LossType = "EQUINE"
  }
  if(wizard.ClaimMode.LossType == "FIDCRIME"){
    this.NCWOnlyBusinessUnitExt = "fc"
    this.BusinessLineExt = "FIDCRIME"
    //Claim.LossType = "FIDCRIME"
  }
  if(wizard.ClaimMode.LossType == "PIMINMARINE"){
    this.NCWOnlyBusinessUnitExt = "im"
    this.BusinessLineExt = "PIMINMARINE"
    //Claim.LossType = "PIMINMARINE"
  }
  if(wizard.ClaimMode.LossType == "EXECLIABDIV"){
    this.NCWOnlyBusinessUnitExt = "el"
    this.BusinessLineExt = "EXECLIABDIV"
  }
  if(wizard.ClaimMode.LossType == "MERGACQU"){
    this.NCWOnlyBusinessUnitExt = "ma"
    this.BusinessLineExt = "MERGACQU"
  }
  if(wizard.ClaimMode.LossType == "SPECIALHUMSERV"){
    this.NCWOnlyBusinessUnitExt = "sh"
    this.BusinessLineExt = "SPECIALHUMSERV"
  }
  if(wizard.ClaimMode.LossType == "EXCESSLIABILITY"){
    this.NCWOnlyBusinessUnitExt = "ex"
    this.BusinessLineExt = "EXCESSLIABILITY"
    //Claim.LossType = "EXCESSLIABILITY"
  }
  if(wizard.ClaimMode.LossType == "EXCESSLIABILITYAUTO"){
    this.NCWOnlyBusinessUnitExt = "ex"
    this.BusinessLineExt = "EXCESSLIABILITYAUTO"
    //Claim.LossType = "EXCESSLIABILITYAUTO"
  }
  if(wizard.ClaimMode.LossType == "PROFLIABDIV"){
   this.NCWOnlyBusinessUnitExt = "pl"
   this.BusinessLineExt = "PROFLIABDIV"
  }  
  if(wizard.ClaimMode.LossType == "AGRIXSUMBAUTO"){
   this.NCWOnlyBusinessUnitExt = "ab"
   this.BusinessLineExt = "AGRIXSUMBAUTO"
   //Claim.LossType = "AGRIXSUMBAUTO"
  }  
  if(wizard.ClaimMode.LossType == "AGRIXSUMBLIAB"){
   this.NCWOnlyBusinessUnitExt = "ab"
   this.BusinessLineExt = "AGRIXSUMBLIAB"
   //Claim.LossType = "AGRIXSUMBLIAB"
  } 
  if(wizard.ClaimMode.LossType == "BONDS"){
   //this.BusinessUnitExt = "bs"
   //this.BusinessLineExt = "BONDS"
   //Claim.LossType = "BONDS"
  }       
  if(wizard.ClaimMode.LossType == "COMMBONDS"){
   this.NCWOnlyBusinessUnitExt = "bs"
   this.BusinessLineExt = "COMMBONDS"
   //Claim.LossType = "COMMBONDS"
  }    
  if(wizard.ClaimMode.LossType == "SPECIALTYES"){
       this.NCWOnlyBusinessUnitExt = "sp"
       this.BusinessLineExt = "SPECIALTYES"
  }     
  if(wizard.ClaimMode.LossType == "KIDNAPRANSOM"){
    this.NCWOnlyBusinessUnitExt = "fc"
    this.BusinessLineExt = "FIDCRIME"
    //Claim.LossType = "FIDCRIME"
  }
  if(wizard.ClaimMode.LossType == "ENVLIAB"){
   this.NCWOnlyBusinessUnitExt = "en"
   this.BusinessLineExt = "ENVLIAB"
   //Claim.LossType = "ENVIRONMENTAL"
  }
  if(wizard.ClaimMode.LossType == "OMAVALON"){
   this.NCWOnlyBusinessUnitExt = "om"
   this.BusinessLineExt = "OMAVALON"
   //Claim.LossType = "OMAVALON"
  }
  if(wizard.ClaimMode.LossType == "PERSONALAUTO"){
   this.NCWOnlyBusinessUnitExt = "pe"
   this.BusinessLineExt = "PERSONALAUTO"
  }
  if(wizard.ClaimMode.LossType == "AVIATION"){
   this.NCWOnlyBusinessUnitExt = "av"
   this.BusinessLineExt = "AVIATION"
  }
  if(wizard.ClaimMode.LossType == "ALTMARKETSAUTO"){
   this.NCWOnlyBusinessUnitExt = "am"
   this.BusinessLineExt = "ALTMARKETSAUTO"
  }         
  if(wizard.ClaimMode.LossType == "SHSAUTO"){
   this.NCWOnlyBusinessUnitExt = "sh"
   this.BusinessLineExt = "SHSAUTO"
  }    
  if(wizard.ClaimMode.LossType == "TRUCKINGAUTO"){
   this.NCWOnlyBusinessUnitExt = "tk"
   this.BusinessLineExt = "TRUCKINGAUTO"
  }
  /* Don't need these to automatically pick the business unit since we won't be showing all of them in the dropdown.
  if(wizard.ClaimMode.LossType == "PIMINMARINEWC"){
   this.BusinessUnitExt = "im"
   this.BusinessLineExt = "PIMINMARINEWC"
   //Claim.LossType = "PIMINMARINEWC"
  }
  if(wizard.ClaimMode.LossType == "PIMINMARINEEL"){
   this.BusinessUnitExt = "im"
   this.BusinessLineExt = "PIMINMARINEEL"
   //Claim.LossType = "PIMINMARINEEL"
  }
  if(wizard.ClaimMode.LossType == "SPECIALTYESWC"){
   this.BusinessUnitExt = "sp"
   this.BusinessLineExt = "SPECIALTYESWC"
   //Claim.LossType = "SPECIALTYESWC"
  }    
  if(wizard.ClaimMode.LossType == "SPECIALTYESEL"){
   this.BusinessUnitExt = "sp"
   this.BusinessLineExt = "SPECIALTYESEL"
   //Claim.LossType = "SPECIALTYESEL"
  }
  if(wizard.ClaimMode.LossType == "ALTMARKETSEL"){
   this.BusinessUnitExt = "am"
   this.BusinessLineExt = "ALTMARKETSEL"
   //Claim.LossType = "ALTMARKETSEL"
  }
  if(wizard.ClaimMode.LossType == "ALTMARKETSWC"){
   this.BusinessUnitExt = "am"
   this.BusinessLineExt = "ALTMARKETSWC"
   //Claim.LossType = "ALTMARKETSWC"
  }
  if(wizard.ClaimMode.LossType == "STRATEGICCOMPWC"){
   this.BusinessUnitExt = "sc"
   this.BusinessLineExt = "STRATEGICCOMPWC"
   //Claim.LossType = "STRATEGICCOMPWC"
  }    
  if(wizard.ClaimMode.LossType == "STRATEGICCOMPEL"){
   this.BusinessUnitExt = "sc"
   this.BusinessLineExt = "STRATEGICCOMPEL"
   //Claim.LossType = "STRATEGICCOMPEL"
  }
  if(wizard.ClaimMode.LossType == "TRUCKINGWC"){
   this.BusinessUnitExt = "tk"
   this.BusinessLineExt = "TRUCKINGWC"
   //Claim.LossType = "TRUCKINGWC"
  }    
  if(wizard.ClaimMode.LossType == "TRUCKINGEL"){
   this.BusinessUnitExt = "tk"
   this.BusinessLineExt = "TRUCKINGEL"
   //Claim.LossType = "TRUCKINGEL"
  }*/
 }
}
