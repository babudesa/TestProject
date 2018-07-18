package util.gaic.CMS.validation

class CMSValidationUtil {  
  
  construct() {

  }
  
  /**
   * Conditions that must be true for validation to continue:
   *   1) Medicare Type exposure
   *   2) Claimant exactly of type Person (not PersonVendor) or InjuredWorkerExt
   *       Defect 7846 - 11.10.15 - cmullin - added additional check for InjuredWorkerExt to allow for WC features
   *   3) Override is not invoked
   * 
   * Medicare Eligible == True is intentionally excluded because some Medicare related rules rely on it being set to False.
   */
  static function generalPrecondition(exposure : Exposure) : boolean{
    if (!exposure.Claim.isNativeORUpdatedExt()) {
      exposure.MedicareExposureExt = exposure.SSDIEligible
    }
    return (exposure.MedicareExposureExt or exposure.IsMedicareExposureExt) &&
            (typeof exposure.Claimant == Person || typeof exposure.Claimant == InjuredWorkerExt) &&
            !((exposure.Claimant as Person).RefuseProvideExt || (exposure.Claimant as Person).BelowThresholdExt)
  }
  
  /**
   * You must invoke validationPrecondition before calling this.
   */
  static function validate(cmsVal : CMSValidation){       
        
    if(cmsVal.DoQueryData){
      validateQueryData(cmsVal)
    }
    
    if(cmsVal.DoReportingData){
      validateReportingData(cmsVal)
    }
  }
  
  private static function validateQueryData(cmsVal : CMSValidation){
    var person = cmsVal.ClaimantPerson
    
    if(person.MedicareEligibleExt == null){
      cmsVal.Fields.add(CMSFieldID.MEDICARE_ELIGIBLE)  
    }
    
    if(person.Gender == null){
      cmsVal.Fields.add(CMSFieldID.GENDER)
    }
    
    if(person.DateOfBirth == null){
      cmsVal.Fields.add(CMSFieldID.DATE_OF_BIRTH)
    }
    
    if((person.TaxID=="" || person.TaxID==null) && (person.HICNExt=="" || person.HICNExt==null)){
      cmsVal.Fields.add(CMSFieldID.SSN_HICN)
    }
    
    if((person.LegalFNameExt=="" || person.LegalFNameExt==null) && (person.LegalLNameExt=="" || person.LegalLNameExt==null)){
      cmsVal.Fields.add(CMSFieldID.MEDICARE_RPT_NAME_FIRST_AND_LAST)
    } else if(person.LegalFNameExt=="" || person.LegalFNameExt==null){
      cmsVal.Fields.add(CMSFieldID.MEDICARE_RPT_NAME_FIRST)
    } else if(person.LegalLNameExt=="" || person.LegalLNameExt==null){
      cmsVal.Fields.add(CMSFieldID.MEDICARE_RPT_NAME_LAST)
    }
  }
  
  private static function validateReportingData(cmsVal : CMSValidation){
    var conISO = cmsVal.ConISO
    
    if(conISO != null){
      if(conISO.ORMIndExt == null){
        cmsVal.Fields.add(CMSFieldID.ORM_IND)
      }
      
      if(cmsVal.ICD9Flag && (conISO.ContactICDExt == null || 
                             conISO.ContactICDExt.Count == 0 || 
                             conISO.ContactICDExt.where(\ c -> c.ICDCode != null && !c.CauseOfInjury).Count < 1)){
        cmsVal.Fields.add(CMSFieldID.ICD9_DIAGNOSTIC)
      }
      
      if(conISO.ProductLiabTypeExt == null){
        cmsVal.Fields.add(CMSFieldID.PRODUCT_LIABILITY) 
      }
      
      if(conISO.CMSIncidentDateExt == null){
        cmsVal.Fields.add(CMSFieldID.CMS_DATE_OF_INCIDENT) 
      }
      
      if(conISO.StateOfVenueExt == null){
        cmsVal.Fields.add(CMSFieldID.STATE_OF_VENUE) 
      }
      
      if(cmsVal.ORMFlag && conISO.NFILLimitExt == null){
        cmsVal.Fields.add(CMSFieldID.NFIL) 
      }
      
      if(cmsVal.TPOCFlag && (conISO.TPOCExt == null or conISO.TPOCExt.Count == 0)){
        cmsVal.Fields.add(CMSFieldID.TPOC_DATE)
        cmsVal.Fields.add(CMSFieldID.TPOC_AMOUNT)
        cmsVal.Fields.add(CMSFieldID.TPOC_FEATURE)
      }
    }
  }
 
}
