package libraries.Exposure_Entity

enhancement ExposureTypeUtil : entity.Exposure {
  
  /**
  * Determins if the Exposure is Bodily Injury
  */
  property get IsBodilyInjuryFeature() : boolean {
    
    var expoType = this.ExposureType
    var isBodilyInjury = false
    
    if(expoType == ExposureType.TC_AB_AGG_AUTO_BODINJURY || expoType == ExposureType.TC_AB_AGG_GL_BODINJURY ||
      expoType == ExposureType.TC_AB_BODILYINJURY || expoType == ExposureType.TC_EX_AUTO_BODINJURY ||
      expoType == ExposureType.TC_EX_EXCESS_BODINJURY || expoType == ExposureType.TC_SP_BODILY_INJURY ||
      ((expoType == ExposureType.TC_EL_DUTYDEFOTSDLIMITS || expoType == ExposureType.TC_EL_DUTYDEFWTHNLIMITS ||
      expoType == ExposureType.TC_EL_INDEMNITY) && this.Claim.BodilyInjuryExt)){
        
      isBodilyInjury = true
    
    } else {
        
      isBodilyInjury = false
    }        
    return isBodilyInjury  
  }
  
    /* Defect 9249, create condition here, call in ABXX1100 - MA Mandatory Lien Check */
   property get IsExposureIncludedInMALienCheck() : boolean {
    var expoType = this.ExposureType
     
    if ((this.LossParty == LossPartyType.TC_THIRD_PARTY and
      (expoType == ExposureType.TC_AB_AGG_AUTO_BODINJURY or expoType == ExposureType.TC_AB_AGG_GL_BODINJURY or
      expoType == ExposureType.TC_AB_BODILYINJURY or expoType == ExposureType.TC_SP_BODILY_INJURY or
      expoType == ExposureType.TC_PE_BODILYINJURY or expoType == ExposureType.TC_AV_BODILYINJURY or
      expoType == ExposureType.TC_EN_BODILYINJURY or expoType == ExposureType.TC_EX_AUTO_BODINJURY or
      expoType == ExposureType.TC_EX_EXCESS_BODINJURY or expoType == ExposureType.TC_AB_MEDPAY or
      expoType == ExposureType.TC_SP_MEDICAL_PAYMENT or expoType == ExposureType.TC_PE_MEDPAY or
      expoType == ExposureType.TC_AV_MEDPAY or expoType == ExposureType.TC_AB_PIP or
      expoType == ExposureType.TC_PE_PRSNINJURYPROT))
      or 
      (expoType == ExposureType.TC_AB_AGG_AUTO_PROPDAMAGE or expoType == ExposureType.TC_AB_AGG_GL_PROPDAMAGE or
      expoType == ExposureType.TC_AB_AUTOPROPDAM or expoType == ExposureType.TC_PE_AUTOPROPDAMAGE or
      expoType == ExposureType.TC_SP_CONTRACTUAL or expoType == ExposureType.TC_EL_LOSSADJUSTEXP or 
      expoType == ExposureType.TC_EL_DUTYDEFOTSDLIMITS or expoType == ExposureType.TC_EL_DUTYDEFWTHNLIMITS or 
      expoType == ExposureType.TC_EX_AUTO_PROPDAMAGE or expoType == ExposureType.TC_EX_EXCESS_PROPDAMAGE or
      expoType == ExposureType.TC_EL_INDEMNITY or expoType == ExposureType.TC_AB_PERSONALINJURY or 
      expoType == ExposureType.TC_SP_PERSONAL_INJURY or  expoType == ExposureType.TC_AV_PERSONALINJURY or
      expoType == ExposureType.TC_AB_PRODWITHDRAWAL or expoType == ExposureType.TC_SP_PRODUCT_WITHDRWL or
      expoType == ExposureType.TC_AB_PROPERTYDAMAGE or expoType == ExposureType.TC_SP_PROPERTY_DAMAGE or
      expoType == ExposureType.TC_EN_PROPERTYDAMAGE or expoType == ExposureType.TC_PE_PROPDAMAGE or
      expoType == ExposureType.TC_AV_PROPERTYDAMAGE or expoType == ExposureType.TC_AB_CCC_PD or
      expoType == ExposureType.TC_SP_SPECIAL_FORM or expoType == ExposureType.TC_BS_SURETY))
      {  
        return true
      } else {
        return false
    }        
  }
  
}
