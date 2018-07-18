package libraries.Exposure_Entity
uses java.util.ArrayList
uses pcf.GeneralErrorWorksheet
uses util.WCHelper

enhancement ExposureISO : entity.Exposure {
    
    /**
     * This can be called to determine is an exposure is a medicare type exposure before the rules that actually set the 
     * MedicareExposureExt flag have run.
     */
     
  
    property get IsMedicareExposureExt() : boolean {
      return this.ExposureType==ExposureType.TC_AB_MEDPAY ||
            this.ExposureType==ExposureType.TC_AB_PIP ||
            this.ExposureType==ExposureType.TC_AB_AGG_AUTO_BODINJURY || 
            this.ExposureType==ExposureType.TC_AB_AGG_GL_BODINJURY || 
            this.ExposureType==ExposureType.TC_AB_BODILYINJURY ||
            this.ExposureType==ExposureType.TC_AB_PERSONALINJURY ||
            this.ExposureType==ExposureType.TC_PE_MEDPAY ||
            this.ExposureType==ExposureType.TC_PE_BODILYINJURY ||
            this.ExposureType==ExposureType.TC_PE_PRSNINJURYPROT ||
            this.ExposureType==ExposureType.TC_EX_AUTO_BODINJURY || 
            this.ExposureType==ExposureType.TC_EX_EXCESS_BODINJURY ||
            // 11/10/16 - dcarson2 - adding SHS D&O for three features and cleaned up a second EL_INDEMNITY section of code incorporating into the first
            ((this.Claim.LossType==LossType.TC_EXECLIABDIV || this.Claim.LossType==LossType.TC_MERGACQU || this.Claim.LossType==LossType.TC_SPECIALHUMSERV || this.Claim.LossType==LossType.TC_PROFLIABDIV) && this.Claim.BodilyInjuryExt &&
            this.ExposureType==ExposureType.TC_EL_INDEMNITY) ||
            // 12/20/13 - kniese - Defect 6641: Add Feature Types Duty to Defend as Medicare Eligible
            ((this.Claim.LossType==LossType.TC_EXECLIABDIV || this.Claim.LossType==LossType.TC_PROFLIABDIV || this.Claim.LossType==LossType.TC_SPECIALHUMSERV) && this.Claim.BodilyInjuryExt &&
            this.ExposureType==ExposureType.TC_EL_DUTYDEFWTHNLIMITS) ||
            ((this.Claim.LossType==LossType.TC_EXECLIABDIV || this.Claim.LossType==LossType.TC_PROFLIABDIV || this.Claim.LossType==LossType.TC_SPECIALHUMSERV) && this.Claim.BodilyInjuryExt &&
            this.ExposureType==ExposureType.TC_EL_DUTYDEFOTSDLIMITS) ||
            (this.Claim.LossType == LossType.TC_SPECIALTYES &&
                (this.ExposureType == ExposureType.TC_SP_BODILY_INJURY || 
                 this.ExposureType == ExposureType.TC_SP_PERSONAL_INJURY||
                 this.ExposureType == ExposureType.TC_SP_MEDICAL_PAYMENT)) ||
            (this.ExposureType==ExposureType.TC_EN_BODILYINJURY) ||
            this.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS ||
            this.ExposureType == ExposureType.TC_WC_EMPLOYERS_LIABILITY ||
            // 8/24/16 - dnmiller - adding feature types for Aviation
            this.ExposureType == ExposureType.TC_AV_BODILYINJURY ||
            this.ExposureType == ExposureType.TC_AV_MEDPAY ||
            this.ExposureType == ExposureType.TC_AV_PERSONALINJURY
    }
    
    property get IsORMExposure() : boolean {
      return this.ExposureType == ExposureType.TC_AB_MEDPAY ||
             this.ExposureType == ExposureType.TC_MEDPAY ||
             this.ExposureType == ExposureType.TC_AB_PIP ||
             this.ExposureType == ExposureType.TC_SP_MEDICAL_PAYMENT ||
	     this.ExposureType == ExposureType.TC_PE_PRSNINJURYPROT ||
             this.ExposureType == ExposureType.TC_PE_MEDPAY  ||
             this.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS ||
             this.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS ||
             this.ExposureType == ExposureType.TC_WC_VOCATIONAL_REHAB ||
             //this.ExposureType == ExposureType.TC_WC_EMPLOYERS_LIABILITY
             this.ExposureType == ExposureType.TC_AV_MEDPAY ||
             this.ExposureType == ExposureType.TC_AV_PERSONALINJURY
    }

  function getISOPayloadType() : String {
    // The ISO Payload Type is based off of GAIC&apos;s Feature (i.e. Exposure) Types
    var returnValue : String = "";
  
    if(this.Claim.LossType=="EQUINE"){
      returnValue = "Property"
    } else if (this.ExposureType == "ab_App_Priv_Struc" || this.ExposureType == "ab_BlanketFarmPerProp"
        || this.ExposureType == "ab_Buy_Up" || this.ExposureType == "ab_Dwelling"
        || this.ExposureType == "ab_Equip_Brkdwn" || this.ExposureType == "ab_Ext_Expense"
        || this.ExposureType == "ab_FarmStructure" || this.ExposureType == "ab_House_Per_Prop"
        || this.ExposureType == "ab_IdentityTheft" || this.ExposureType == "ab_Loss_of_Farm_Inc"
        || this.ExposureType == "ab_Loss_of_Use" || this.ExposureType == "ab_SchedFarmPerProp"
        || this.ExposureType == "ab_SchedPerProp" || this.ExposureType ==  "im_Building"
        || this.ExposureType == "im_PropOfOthers" || this.ExposureType ==  "im_PersonalProp"
        || this.ExposureType == "im_BusinessInc" || this.ExposureType ==  "im_ContractEquip"
        || this.ExposureType == "im_EquipBrkdwn" || this.ExposureType ==  "im_DataComp"
        || this.ExposureType == "im_MotorTruckCargo"
        //8/24/16 - dnmiller - adding feature types for Aviation
        || this.ExposureType == ExposureType.TC_AV_PHYSICALDAMAGE || this.ExposureType == ExposureType.TC_AV_BUSINESSINC
        ) { 
      returnValue = "Property" 
    }
  
    if(this.Claim.LossType=="EXECLIABDIV" || this.Claim.LossType=="EXCESSLIABILITY" || this.Claim.LossType=="EXCESSLIABILITYAUTO" || this.Claim.LossType=="PROFLIABDIV" 
      || this.Claim.LossType=="AGRIXSUMBAUTO" || this.Claim.LossType=="AGRIXSUMBLIAB" || this.Claim.LossType=="ENVLIAB" || this.Claim.LossType==LossType.TC_MERGACQU || this.Claim.LossType==LossType.TC_SPECIALHUMSERV){
      returnValue = "Injury"      
     } else if ((this.ExposureType == "ab_PropertyDamage" && this.LossParty == LossPartyType.TC_THIRD_PARTY) || this.ExposureType == "ab_AGG_auto_BodInjury" || this.ExposureType == "ab_AGG_gl_BodInjury"
        || this.ExposureType ==  "ab_AGG_auto_PropDamage" || this.ExposureType ==  "ab_AGG_gl_PropDamage"
        || this.ExposureType == "ab_MedPay" || this.ExposureType == "ab_PersonalInjury"
        || this.ExposureType == "ab_BodilyInjury" || this.ExposureType == "ab_ccc_pd"
        || this.ExposureType == "ab_ProdWithdrawal" || this.ExposureType == "ab_PIP"
        || this.ExposureType == ExposureType.TC_SP_BODILY_INJURY || this.ExposureType == ExposureType.TC_SP_MEDICAL_PAYMENT
        || this.ExposureType == ExposureType.TC_SP_PERSONAL_INJURY || this.ExposureType == ExposureType.TC_SP_PRODUCT_WITHDRWL
        || this.ExposureType == ExposureType.TC_SP_PROPERTY_DAMAGE || this.ExposureType == ExposureType.TC_SP_CONTRACTUAL
        || this.ExposureType == ExposureType.TC_SP_SPECIAL_FORM || this.ExposureType == ExposureType.TC_SP_IDENTITY_THEFT
        || this.ExposureType == ExposureType.TC_PE_BODILYINJURY || this.ExposureType == ExposureType.TC_PE_MEDPAY
        || this.ExposureType == ExposureType.TC_PE_PRSNINJURYPROT
        //8/24/16 - dnmiller - adding feature types for Aviation
        || this.ExposureType == ExposureType.TC_AV_BODILYINJURY || this.ExposureType == ExposureType.TC_AV_MEDPAY
        || this.ExposureType == ExposureType.TC_AV_PERSONALINJURY || this.ExposureType == ExposureType.TC_AV_PROPERTYDAMAGE
        ) {
      returnValue = "Injury"
    }
  
    if (this.ExposureType=="ab_BoatDamage" || this.ExposureType=="ab_TrailerDamage" || this.ExposureType=="ab_EngineDamage"){
      returnValue = "Boat"
    }
  
    if (this.ExposureType == "ab_PhysicalDamage" || this.ExposureType == "ab_AutoPropDam"
        || this.ExposureType == ExposureType.TC_PE_PROPDAMAGE || this.ExposureType == ExposureType.TC_PE_AUTOPROPDAMAGE
        || this.ExposureType == ExposureType.TC_PE_PHYSICALDAMAGE) { 
          returnValue = "Vehicle" 
    } else if (this.ExposureType == "ab_PropertyDamage" && this.LossParty == LossPartyType.TC_INSURED) {
        returnValue = "Property"; 
    }
    if(returnValue=="Property"){
      if(this.Claim.LossCause!=null and 
         (this.Claim.LossCause=="burglary" || this.Claim.LossCause=="theft" || this.Claim.LossCause=="theftotheremp")){
        if(this.LostPropertyType!=null){
          returnValue = "Theft"
        }
      }
    }
    
    var WCExposureTypes = {ExposureType.TC_WC_EMPLOYERS_LIABILITY, ExposureType.TC_WC_MEDICAL_DETAILS} //indemnity and voc rehab are intentionally excluded, see defect 8124
    if(WCExposureTypes.contains(this.ExposureType)){
      returnValue = "wc"
    }
  
    return returnValue;
  }

  function isLostPropertyTypeRequired() : Boolean {
    var isRequired = false
    if(this.Claim.LossCause=="burglary" || this.Claim.LossCause=="theft"||
      this.Claim.LossCause=="theftotheremp"){
      if(isLostPropertyTypeVisible()){
        isRequired = true
      }
    }
    return isRequired
  }

  function isLostPropertyTypeVisible() : Boolean {
    var isVisible = false
    
    if((this.Claim.LossType=="AGRIPROPERTY" and this.CoverageSubType!=typekey.CoverageSubtype.TC_AB_ORCHVINE_PD) || this.Claim.LossType=="PIMINMARINE"
    || this.Claim.LossType==typekey.LossType.TC_AVIATION || (this.Claim.LossType == LossType.TC_SPECIALTYES && this.Claim.Policy.PolicyType == PolicyType.TC_IMP)){
      isVisible = true
    }
    return isVisible
  }
  
  function getLostPropertyType() : List {
    var results : List = new ArrayList()
    if(this.Claim.LossType!=TC_AGRILIABILITY){
      results.addAll(LostPropertyType.getTypeKeys(false))
      results.remove(LostPropertyType.TC_ENGINE)
      results.remove(LostPropertyType.TC_MOBLEQUIP)
      results.remove(LostPropertyType.TC_OUTDRIVE)
    } else {
      results.add(LostPropertyType.TC_ENGINE)
      results.add(LostPropertyType.TC_OUTDRIVE)
    }
    return results
  }
  
    function isDateOfDeath():Boolean{
    var claimant = this.Claimant.AllContactContacts
    var flag:boolean=false
     if (( claimant.Count != 0) and (this.Claimant typeis Person) and (this.Claimant as Person).DateOfDeathExt == null and
           this.MedicareExposureExt and 
           (this.Claimant as Person).MedicareEligibleExt==true){
                for (c in claimant){
                     if (c.ClaimantFlagExt == true)
                      {
                        flag=true
                      }else{
                        flag=false
                      }
                  }
           }
    return flag
   }
   
   /*
  Defect 6539 - jjesudhasan - 10/17/14 - Added to check the If Medicare Eligible = Yes 
  and there is a Beneficiary on the Medicare tab but no Date of Death, a soft warning
  has been displayed. The warning will be invoked from the worksheet if we edit the existing feature or add another beneficiary in the exixting feature.
  */
  function isdateofdeathreqd(){

      if(isDateOfDeath()){
       GeneralErrorWorksheet.goInWorkspace("Medicare Beneficiary exists, Date of Death for claimant "+this.Claimant +" is required.") 
      }
    }
    
    function isDateOfDeathnotreqd():Boolean{
    var claimant = this.Claimant.AllContactContacts
    var flag:boolean=false
     if (( claimant.Count == 0) and (this.Claimant typeis Person) and (this.Claimant as Person).DateOfDeathExt != null and
           this.MedicareExposureExt and 
           (this.Claimant as Person).MedicareEligibleExt==true){
               
            flag=true
                      
           }
       else if (( claimant.Count != 0) and (this.Claimant as Person).DateOfDeathExt != null and
           this.MedicareExposureExt and (this.Claimant typeis Person) and 
           (this.Claimant as Person).MedicareEligibleExt==true){
                for (c in claimant){
                     if (c.ClaimantFlagExt == true)
                      {
                        flag=false
                      }
                      else if(c.InjuredPartyFlagExt == true){
                        flag=true
                      }
                  }
           }
       
    return flag
   }
   
   function isDamagePropertyDescriptionVisible() : Boolean {
    var isVisible = true
    
    if (this.Claim.LossType=="AGRIPROPERTY" and this.CoverageSubType==typekey.CoverageSubtype.TC_AB_ORCHVINE_PD){
      isVisible = false
    }
    return isVisible
  }
   
}

