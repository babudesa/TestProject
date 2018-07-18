package util;

uses gw.api.util.DateUtil;
uses java.util.ArrayList
uses gw.api.claim.NewClaimWizardInfo
uses java.lang.Exception

class WCHelper {

  construct(){
  }

  /* 5.6.15 - cmullin - added try/catch for known issue where Desktop Activities and Desktop Pending Assignment screens 
      are throwing an error when a null claim is passed into this function. 
  */
  static function isWCorELLossType (claim : Claim) : Boolean {
    try{
      return claim.LossType == LossType.TC_PIMINMARINEWC or claim.LossType == LossType.TC_PIMINMARINEEL or 
        claim.LossType == LossType.TC_SPECIALTYESWC or claim.LossType == LossType.TC_SPECIALTYESEL or
        claim.LossType == LossType.TC_STRATEGICCOMPWC or claim.LossType == LossType.TC_STRATEGICCOMPEL or
        claim.LossType == LossType.TC_TRUCKINGWC or claim.LossType == LossType.TC_TRUCKINGEL or
        claim.LossType == LossType.TC_ALTMARKETSWC or claim.LossType == LossType.TC_ALTMARKETSEL or
        claim.LossType == LossType.TC_AGRIWC or claim.LossType == LossType.TC_AGRIEL or
        claim.LossType == LossType.TC_OMWC or claim.LossType == LossType.TC_OMEL or
        claim.LossType == LossType.TC_ECUWC or claim.LossType == LossType.TC_ECUEL
   }catch(e){
     //only print the exception if the passed in 'claim' is actually a Key. This will prevent many ClassCastExceptions from being printed in the logs.
     if(!(claim typeis Key)){
       print(e)
     }
   }
   return null
  }

  static function isWCLossType (claim : Claim) : Boolean {
    return claim.LossType == LossType.TC_PIMINMARINEWC or 
        claim.LossType == LossType.TC_SPECIALTYESWC or 
        claim.LossType == LossType.TC_STRATEGICCOMPWC or 
        claim.LossType == LossType.TC_TRUCKINGWC or 
        claim.LossType == LossType.TC_ALTMARKETSWC or 
        claim.LossType == LossType.TC_AGRIWC or 
        claim.LossType == LossType.TC_OMWC or 
        claim.LossType == LossType.TC_ECUWC 
   }

  static function isELLossType (claim : Claim) : Boolean {
    return claim.LossType == LossType.TC_PIMINMARINEEL or 
        claim.LossType == LossType.TC_SPECIALTYESEL or
        claim.LossType == LossType.TC_STRATEGICCOMPEL or 
        claim.LossType == LossType.TC_TRUCKINGEL or
        claim.LossType == LossType.TC_ALTMARKETSEL or 
        claim.LossType == LossType.TC_AGRIEL or
        claim.LossType == LossType.TC_OMEL or 
        claim.LossType == LossType.TC_ECUEL
  }
  
  static function ageAtInjury (claim : Claim) : Number {
    var birth = claim.claimant.DateOfBirth
    var loss = claim.LossDate
    var yearDiff = loss.YearOfDate - birth.YearOfDate
    if(birth != null){
      if (loss.MonthOfYear > birth.MonthOfYear || (loss.MonthOfYear == birth.MonthOfYear && loss.DayOfMonth >= birth.DayOfMonth)){
        return yearDiff;
      }else{
        return yearDiff-1;
      }
    }
   return null
  }

  static function currentAge(claim : Claim) : Number {
    var birth = claim.claimant.DateOfBirth
    var today = DateUtil.currentDate()
    var yearDiff = today.YearOfDate - birth.YearOfDate
    if(birth != null){
      if (today.MonthOfYear > birth.MonthOfYear || (today.MonthOfYear == birth.MonthOfYear && today.DayOfMonth >= birth.DayOfMonth)){
        return yearDiff;
      }else{
        return yearDiff-1;
      }
    }
   return null
  }
    
  static function getTOLValues(claim : Claim):List{
    var result : List = new ArrayList();
    util.TypeOfLoss.Subline810.returnList( result, claim );
    return result
  }

  static function getManagedCareOrgTypeExtList(state : State) : List<ManagedCareOrgTypeExt> {
    if(state != null){
      return typekey.ManagedCareOrgTypeExt.getTypeKeys(false).where(\ s -> s.hasCategory(state))
    }else{
      return null
    }
  }
  
  static function getBureauBenefitExtList (claim : Claim) : List<BureauBenefitExt> {
    return BureauBenefitExt.getTypeKeys(false).where(\ s -> s.hasCategory(claim.JurisdictionState))
  }
  
  static function getWCInjuryTypeExtList (claim : Claim) : List<WCInjuryTypeExt> {
    return WCInjuryTypeExt.getTypeKeys(false).where(\ s -> s.hasCategory(claim.JurisdictionState))
  }
  
  static function fixClaimMode(wizard:NewClaimWizardInfo, claim :Claim){
    var busUnit : BusinessUnitExt = claim.NCWOnlyBusinessUnitExt
    if(wizard.ClaimMode.LossType != null){
      if(wizard.ClaimMode.LossType.DisplayName.equalsIgnoreCase("Workers' Compensation")){
        switch(busUnit){
         case typekey.BusinessUnitExt.TC_AB:
            wizard.ClaimMode.LossType = typekey.LossType.TC_AGRIWC
            break;
         case typekey.BusinessUnitExt.TC_AM:
            wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSWC
            break;
         case typekey.BusinessUnitExt.TC_OC:
            wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSWC
            break;
         case typekey.BusinessUnitExt.TC_MI:
            wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSWC
            break;
         case typekey.BusinessUnitExt.TC_IM:
            wizard.ClaimMode.LossType = typekey.LossType.TC_PIMINMARINEWC
            break;
         case typekey.BusinessUnitExt.TC_OM:
            wizard.ClaimMode.LossType = typekey.LossType.TC_OMWC
            break;
         case typekey.BusinessUnitExt.TC_SC:
            wizard.ClaimMode.LossType = typekey.LossType.TC_STRATEGICCOMPWC
            break;   
         case typekey.BusinessUnitExt.TC_SP:
            wizard.ClaimMode.LossType = typekey.LossType.TC_SPECIALTYESWC
            break;
         case typekey.BusinessUnitExt.TC_TK:
            wizard.ClaimMode.LossType = typekey.LossType.TC_TRUCKINGWC
            break;
         case typekey.BusinessUnitExt.TC_EC:
            wizard.ClaimMode.LossType = typekey.LossType.TC_ECUWC
            break;
         case typekey.BusinessUnitExt.TC_AR:
            wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSWC
            break;
         case typekey.BusinessUnitExt.TC_DO:
            wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSWC
            break;
         case typekey.BusinessUnitExt.TC_SL:
            wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSWC
            break;
         case typekey.BusinessUnitExt.TC_SR:
            wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSWC
            break;
         default:
            break;
        }
      }else if(wizard.ClaimMode.LossType.DisplayName.equalsIgnoreCase("Employers' Liability"))
        switch(busUnit){
         case typekey.BusinessUnitExt.TC_AB:
           wizard.ClaimMode.LossType = typekey.LossType.TC_AGRIEL
           break;
         case typekey.BusinessUnitExt.TC_AM:
           wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSEL
           break;
         case typekey.BusinessUnitExt.TC_OC:
           wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSEL
           break;
         case typekey.BusinessUnitExt.TC_MI:
           wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSEL
           break;
         case typekey.BusinessUnitExt.TC_IM:
           wizard.ClaimMode.LossType = typekey.LossType.TC_PIMINMARINEEL
           break;
         case typekey.BusinessUnitExt.TC_OM:
           wizard.ClaimMode.LossType = typekey.LossType.TC_OMEL
           break;
         case typekey.BusinessUnitExt.TC_SC:
           wizard.ClaimMode.LossType = typekey.LossType.TC_STRATEGICCOMPEL
           break;   
         case typekey.BusinessUnitExt.TC_SP:
           wizard.ClaimMode.LossType = typekey.LossType.TC_SPECIALTYESEL
           break;
         case typekey.BusinessUnitExt.TC_TK:
           wizard.ClaimMode.LossType = typekey.LossType.TC_TRUCKINGEL
           break;
         case typekey.BusinessUnitExt.TC_EC:
           wizard.ClaimMode.LossType = typekey.LossType.TC_ECUEL
           break;
         case typekey.BusinessUnitExt.TC_AR:
           wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSEL
           break;
         case typekey.BusinessUnitExt.TC_DO:
           wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSEL
           break;
         case typekey.BusinessUnitExt.TC_SL:
           wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSEL
           break;
         case typekey.BusinessUnitExt.TC_SR:
           wizard.ClaimMode.LossType = typekey.LossType.TC_ALTMARKETSEL
           break;
         default:
           break;
        }
      }
  }
    // dnmiller - added to validate ICD Codes
    static function validateICDCodes(injury: InjuryIncident):Boolean{
      // if there is only one code in the list, set it to be the primary
      if (injury.InjuryDiagnoses.length == 1){
        injury.InjuryDiagnoses[0].IsPrimary = true
      }
      // the count for Medicare Reportable ICD codes cannot be greater than 19
      var count: int = 0
      for (code in injury.InjuryDiagnoses){
        if (code.ICDMedReportExt){
          count++
        }
      }
      if (count > 19){
        return true
      }
      else {
        return false
      }
    }
    
    /**
     *  6.12.15 - cmullin - WC Config: this function sets the InjuryNatureDescExt field for each Exposure on the Claim
     *  whenever the Detailed Body Part, Nature of Injury or Cause of Injury is changed. This field is not displayed for any
     *  Workers' Comp feature but it is required for ISO Integration. The [Exposure].InjuryNatureDescExt is concatenated from 
     *  the Detailed Body Part, Nature of Injury and Cause of Injury fields. 
     *  10.22.15 - cmullin - function moved to CPUWC1900
     */ 
    /* 
    static function setInjuryNatureDescExt(claim : Claim){
      var detailedBodyPart : String = ""
      var natureOfInjury = claim.ensureClaimInjuryIncident().GeneralInjuryType.DisplayName
      var injuryCause = claim.LossCause.DisplayName
      // Find the Detailed Body Part
      for(each in claim.Incidents){
        if(each.Subtype == "InjuryIncident" && (each as InjuryIncident).BodyParts.length != 0){
          for(part in (each as InjuryIncident).BodyParts){
            if(part.PrimaryExt == true){
              detailedBodyPart = part.DetailedBodyPart.Description
            }
          }
          // If PrimaryExt is not set for any BodyPart and detailedBodyPart cannot be assigned, then 
          // choose the first Body Part in the BodyParts array and set that first Body Part to Primary
          if(detailedBodyPart == ""){
            detailedBodyPart = (each as InjuryIncident).BodyParts.first().DetailedBodyPart.Description;
            (each as InjuryIncident).BodyParts.first().PrimaryExt=true
          }
        }
      }
      // Concatenate all three fields
      var result = detailedBodyPart + " - " + natureOfInjury + " - " + injuryCause
      // Set the new InjuryNatureDescExt for all Exposures on the Claim
      for(each in claim.OrderedExposures){
        each.InjuryNatureDescExt = result
      }
    }
    */
    
    static function resetNewClaimLossDetailsFields(clm : Claim){
      //If Loss Time From work changed from Yes to No then remove row
      if(clm.TimeLossReport==false){
        if(clm.EmploymentData.WorkStatusChanges.HasElements){
          for(each in clm.EmploymentData.WorkStatusChanges){
            each.remove()
          }
        }
      }
      //If Medical attention required changed from Yes to No then reset the below values
      if(clm.MedicalReport==false){
        
        clm.FirstIntakeDoctor = null
        clm.ExaminationDate = null
        clm.TreatmentTypeExt = null
        clm.firstintakehospital = null
        clm.HospitalDate = null
        clm.HospitalDays = null
      }
      //If incident only changed from No to Yes then reset the below value
      if(clm.IncidentReport==true){
        clm.MedicalReport = null
        clm.TimeLossReport = null
        clm.ReservedFileExt = null
        clm.AttorneyRepExt = null
        clm.AttorneyExt = null
        clm.FirstIntakeDoctor = null
        clm.ExaminationDate = null
        clm.TreatmentTypeExt = null
        clm.EmploymentData.PhysRestrictionsExt = null
        clm.EmergencyRoomTxExt = null
        clm.HospitalOvernightExt = null
        clm.firstintakehospital = null
        clm.HospitalDate = null
        clm.HospitalDays = null
        if(clm.EmploymentData.WorkStatusChanges.HasElements){
          for(each in clm.EmploymentData.WorkStatusChanges){
            each.remove()
          }
        }
      }
    }

    static function resetSavedLossDetailsFields(clm : Claim){
      if(clm.IncidentReport==true && !clm.Exposures.HasElements){ // this function should not run if there are already features on the claim.
        clm.MedicalReport = null
        clm.TimeLossReport = null
        clm.ReservedFileExt = null
        clm.AttorneyRepExt = null
        clm.AttorneyExt = null
      }
    }
    
    static function validateRTWdate(exp: Exposure) {
      if (exp.ReturnToWorkDateExt != null){
        if (exp.ReturnToWorkDateExt.compareIgnoreTime(gw.api.util.DateUtil.currentDate()) == -1) {
          exp.ReturnToWorkActualExt = true
        } 
        else if (exp.ReturnToWorkDateExt.compareIgnoreTime(gw.api.util.DateUtil.currentDate()) == 0) {
          exp.ReturnToWorkActualExt = null
        }
        else if (exp.ReturnToWorkDateExt.compareIgnoreTime(gw.api.util.DateUtil.currentDate()) == 1) {
          exp.ReturnToWorkActualExt = false
        }
      }
      if (exp.ReturnToWorkDateExt == null){
        exp.ReturnToWorkActualExt = null
      }
    }
    
    static function validateModDutyDate(exp: Exposure){
      if (exp.ReturnToModWorkDateExt != null){
        if (exp.ReturnToModWorkDateExt.compareIgnoreTime(gw.api.util.DateUtil.currentDate()) == -1) {
          exp.ReturnToModWorkActualExt = true
        }
        else if (exp.ReturnToModWorkDateExt.compareIgnoreTime(gw.api.util.DateUtil.currentDate()) == 0) {
          exp.ReturnToModWorkActualExt = null
        }  
        else if (exp.ReturnToModWorkDateExt.compareIgnoreTime(gw.api.util.DateUtil.currentDate()) == 1) {
          exp.ReturnToModWorkActualExt = false
        }
      }
      if (exp.ReturnToModWorkDateExt == null){
        exp.ReturnToModWorkActualExt = null
      }
    }

} //end of WCHelper