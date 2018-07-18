package util.gaic.EDW;

class EDWCommonFunctions {
  
  private construct() {}

  static function getInstance() : EDWCommonFunctions {
    return new EDWCommonFunctions();
  }
  
  // Helper for claim change related to injured worker
  protected function isInjWorkerClaimFieldChanged(claim : Claim) : boolean {
    var fields = new String[] { "ConcurrentEmp", "ApportionmentExt", "ApportionmentPctExt", "DrugTestExt", "DrugTestResultExt",
    "ExposureBegan", "ExposureEnded", "ExposureInjuryExt", "HospitalDate", "HospitalDays", "HospitalOvernightExt", "ExaminationDate", 
    "EmergencyRoomTxExt", "TreatmentTypeExt", "EmploymentInjury", "SafetyEquipProv", "SafetyEquipUsed", "SafetyViolationExt", 
    "ModifiedDutyAvail", "LossDate"};
  
    if (util.gaic.CommonFunctions.fieldFromListChanged(claim, fields)) {
      return true;
    }

    if (isInjWorkClaimExtChanged(claim)) {
      return true;
    }
    
    return false;
  }  
  
  // Defect: 8420  DepartmentCode, HireDate, HireState added
  protected function isInjWorkClaimExtChanged(claim : Claim) : boolean {
    if (claim.EmploymentData != null) {
      var fields = new String[] { "WageAmount", "LastWorkedDate", "EmploymentStatus", "EmployStatusDateExt", "PaidFull",
      "MilesToWorkExt", "WagePaymentCont", "WageAmountPostInjury", "WageAmountPreInjuryExt", "NoWorkFullDayAfterExt",
      "FirstFullDayMissedExt", "PhysRestrictionsExt", "DepartmentCode", "HireDate", "HireState"};
     
      if (util.gaic.CommonFunctions.fieldFromListChanged(claim.EmploymentData, fields)) {
        return true;
      }
      if (claim.EmploymentData.getAddedArrayElements("WorkStatusChanges").length != 0 or 
        claim.EmploymentData.getRemovedArrayElements("WorkStatusChanges").length != 0 or 
        claim.EmploymentData.getChangedArrayElements("WorkStatusChanges").length != 0) { 
           return true;
      }
    } 
    // Defect: 8420 DetailedInjuryType added 
    if(claim.ClaimInjuryIncident != null) {
         var fields = new String[] {"BodyParts" , "DetailedInjuryType" , "GeneralInjuryType"};
         if (util.gaic.CommonFunctions.fieldFromListChanged(claim.ClaimInjuryIncident, fields)){
           return true   
         }
    }
    
    if (claim.ClaimWorkComp != null) {
      var fields = new String[] {"WaitingPeriodApplied", "ActivityPerformed", "Compensable", "DeathReport", "EquipmentUsed"}
      if (util.gaic.CommonFunctions.fieldFromListChanged(claim.ClaimWorkComp, fields)) {
        return true;
      } else if (claim.ClaimWorkComp.getAddedArrayElements("WaitingPeriodDetails").length != 0 or 
        claim.ClaimWorkComp.getRemovedArrayElements("WaitingPeriodDetails").length != 0 or 
        claim.ClaimWorkComp.getChangedArrayElements("WaitingPeriodDetails").length != 0) {
          return true;
      }
    }
    if (claim.getAddedArrayElements("OtherBenefits").length != 0 or 
        claim.getRemovedArrayElements("OtherBenefits").length != 0) {
          return true;
   } else if (claim.getChangedArrayElements("OtherBenefits").length != 0) { 
            for (theOthBen in claim.OtherBenefits) {
                if (theOthBen.isFieldChanged("ReferenceNumber")) { 
                   return true;
                }
            }
    }
    return false
  } 
   
    
}