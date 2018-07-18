package gw.entity
uses gw.api.iso.ISOProperties
uses gw.api.iso.ISOTranslate
uses gw.api.iso.ISOBadRequestException
uses gw.api.iso.ISOInjuryLossSection
uses gw.api.iso.ISOWatercraftLossSection
uses gw.api.iso.ISOAutoLossSection
uses gw.api.iso.ISOPropertyLossSection
uses gw.api.iso.ISOCoverageCodes
uses gw.api.iso.ISOWCLossSection

/**
 * Exposure enhancements for ISO integration
 */
@Export
enhancement GWExposureISOEnhancement : Exposure {
  
  /**
   * Constructs a value to put in the InsuredId field of an ISO ClaimSearch
   * request for this exposure, based on the claim's claim number and the
   * exposure's order number
   */
  function getISOInsurerId(properties : ISOProperties) : String {
    return getISOInsurerId(properties, this.Claim.ClaimNumber)
  }

  /**
   * Constructs a value to put in the InsuredId field of an ISO ClaimSearch
   * request for this exposure, based on the given claim number and the
   * exposure's order number
   */
  function getISOInsurerId(properties : ISOProperties, claimNumber : String) : String {
    return claimNumber + properties.ClaimExposureNumberSeparator + this.ClaimOrder
  }

  /**
   * A mapper object giving the appropriate ISO policy type, coverage type
   * and loss type codes for this exposure 
   */
  property get ISOCoverageCodes() : ISOCoverageCodes {
    var policyCoverageCode : ISOCoverageCodes
    //Defect 8642 dnmiller - ISO error messages when exposures are disconnected. 
    // Changes to send old Policy Type until coverages are reconnected.
    if(!this.ReconnectFailExt){
      policyCoverageCode = ISOTranslate.instance().getCoverageCodes(this.Claim.Policy.PolicyType, this.Claim.LOBCode, 
                                                                    this.PrimaryCoverage, this.CoverageSubType, this.Claim.LossCause)
    }else{
      //coverage is disconnected, get mapping for previous coverage
      var originalExpo = this.OriginalVersion as Exposure
      policyCoverageCode = ISOTranslate.instance().getCoverageCodes(originalExpo.Claim.Policy.PolicyType, originalExpo.Claim.LOBCode, 
                                                                    originalExpo.PrimaryCoverage, originalExpo.CoverageSubType, originalExpo.Claim.LossCause)
    }
    
    //if the claim has disconnected features and didn't find any ISO Coverage Code mapping
    //given the values above, then return nothing.  The codes will be created correctly once 
    //the features are reconnected.
    if(policyCoverageCode == null && this.Claim.checkDisconnectedFeatures()){
      return null
    }
    
    //dynamic mapping for ELD
    //If the Loss Type is Executive Liability or Professional Liability, and the Claim is marked as Bodily Injury, then the ISO Loss Type
    //will be reassigned to "BODI".
    if((this.Claim.LossType == LossType.TC_EXECLIABDIV or this.Claim.LossType == LossType.TC_PROFLIABDIV or this.Claim.LossType == LossType.TC_MERGACQU or this.Claim.LossType == LossType.TC_SPECIALHUMSERV) && this.Claim.BodilyInjuryExt){
      policyCoverageCode = new ISOCoverageCodes(policyCoverageCode.PolicyType, policyCoverageCode.CoverageType, "BODI")
    }
    
    //dynamic mapping for PIM
    if(this.Claim.LossType == LossType.TC_PIMINMARINE && this.ExposureType=="im_DataComp" && this.ExposureDetailsExt=="068" ){
    policyCoverageCode = new ISOCoverageCodes(policyCoverageCode.PolicyType, policyCoverageCode.CoverageType, "THFT")
     
    }
    
    //dynamic mapping for Agri Auto Bodily Injury
    if(this.CoverageSubType == CoverageSubtype.TC_AB_AGG_AUT_LIAB_BI && this.Claim.LossType == LossType.TC_AGRILIABILITY){
      policyCoverageCode = new ISOCoverageCodes("CFRM", "LIAB", "BODI") 
    }
    
    //dynamic mapping for Auto Physical Damage using Statistical Type of Loss
    if(this.ExposureType == ExposureType.TC_AB_PHYSICALDAMAGE && this.TypeOfLossMostExt != null){
      var newCovCodes = mapAutoPhysicalDamage(policyCoverageCode.PolicyType)
      if(newCovCodes != null){
        policyCoverageCode = newCovCodes 
      }
    }
//Environmental ISO mappings for Statistical Type of Loss   
    IF (this.Claim.LossType == LossType.TC_ENVLIAB){
      var newCovCodes = mapEnvironmental(policyCoverageCode.PolicyType, policyCoverageCode.LossType)
      if (newCovCodes != null){
        policyCoverageCode = newCovCodes
      }
    }
       
    if (policyCoverageCode == null) {
      throw new ISOBadRequestException(displaykey.Java.Error.ISO.IncorrectPolicyCoverage(
          this.Claim.Policy.PolicyType.Code, this.PrimaryCoverage.Code,
          this.CoverageSubType.Code, this.LossParty.Code))
    }
    
    return policyCoverageCode
  }
  
    private function mapEnvironmental(polType: String, lossType: String): ISOCoverageCodes{ 
    
    switch(this.TypeOfLossMostExt){
      //Subline350 bi
      case TypeOfLossExt.TC_18_00186.Code:
        return new ISOCoverageCodes(polType, "POLL", lossType)
      case TypeOfLossExt.TC_15_00187.Code:
        return new ISOCoverageCodes(polType, "POLL", lossType)
      case TypeOfLossExt.TC_15_00185.Code:
        return new ISOCoverageCodes(polType, "POLL", lossType)
      case TypeOfLossExt.TC_15_00183.Code:
        return new ISOCoverageCodes(polType, "POLL", lossType)
      case TypeOfLossExt.TC_18_00186.Code:
        return new ISOCoverageCodes(polType, "POLL", lossType)
      case TypeOfLossExt.TC_15_00388.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
      case TypeOfLossExt.TC_83_00200.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
      case TypeOfLossExt.TC_84_00202.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
      case TypeOfLossExt.TC_95_00204.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
      case TypeOfLossExt.TC_82_00206.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
      //Subline350 pd cu
      case TypeOfLossExt.TC_27_00189.Code:
        return new ISOCoverageCodes(polType, "POLL", lossType)
      case TypeOfLossExt.TC_25_00188.Code:
        return new ISOCoverageCodes(polType, "POLL", lossType) 
      case TypeOfLossExt.TC_25_00390.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType) 
      case TypeOfLossExt.TC_27_00389.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
      case TypeOfLossExt.TC_86_00208.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
      case TypeOfLossExt.TC_87_00209.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
      case TypeOfLossExt.TC_96_00210.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
      case TypeOfLossExt.TC_85_00211.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
        //Subline325 bi - duplicates omitted
              case TypeOfLossExt.TC_23_00029.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_11_00057.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_12_00167.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_23_00164.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_47_00166.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_16_00172.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_30_00182.Code:
        return new ISOCoverageCodes(polType, "POLL", lossType)
              case TypeOfLossExt.TC_91_00184.Code:
        return new ISOCoverageCodes(polType, "POLL", lossType)
              case TypeOfLossExt.TC_90_00387.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_90_00017.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
        //Subline325 pd cu
              case TypeOfLossExt.TC_72_00050.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_21_00058.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_73_00059.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_24_00168.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_29_00169.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_48_00170.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_22_00171.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
              case TypeOfLossExt.TC_26_00190.Code:
        return new ISOCoverageCodes(polType, "LIAB", lossType)
                   
      default:
        //do nothing, keep defaults defined in the csv file
    }
    
    return null
  }
  /**
   * Defect 6590: try to determine coverage and loss for Auto Physical Damage using statistical type of loss
   */
  private function mapAutoPhysicalDamage(polType: String): ISOCoverageCodes{ 
    
    switch(this.TypeOfLossMostExt){
      case TypeOfLossExt.TC_00_00045.Code:
        return new ISOCoverageCodes(polType, "COLL", "COLL")
      case TypeOfLossExt.TC_97_00124.Code:
        return new ISOCoverageCodes(polType, "COMP", "TRSM")
      case TypeOfLossExt.TC_01_00131.Code:
        return new ISOCoverageCodes(polType, "COLL", "COLL")
      case TypeOfLossExt.TC_02_00132.Code:
        return new ISOCoverageCodes(polType, "COLL", "COLL")
      case TypeOfLossExt.TC_09_00152.Code:
        return new ISOCoverageCodes(polType, "COMP", "COMP")        
      case TypeOfLossExt.TC_01_00154.Code:
        return new ISOCoverageCodes(polType, "COMP", "FIRE")
      case TypeOfLossExt.TC_07_00155.Code:
        return new ISOCoverageCodes(polType, "COMP", "FLOD")
      case TypeOfLossExt.TC_13_00156.Code:
        return new ISOCoverageCodes(polType, "COMP", "GLSS")
      case TypeOfLossExt.TC_23_00157.Code:
        return new ISOCoverageCodes(polType, "COMP", "GLSS")
      case TypeOfLossExt.TC_05_00158.Code:
        return new ISOCoverageCodes(polType, "COMP", "VAMM")
      case TypeOfLossExt.TC_10_00159.Code:
        return new ISOCoverageCodes(polType, "COMP", "COMP")
      case TypeOfLossExt.TC_04_00160.Code:
        return new ISOCoverageCodes(polType, "COMP", "COMP")
      case TypeOfLossExt.TC_02_00161.Code:
        return new ISOCoverageCodes(polType, "COMP", "THFT")
      case TypeOfLossExt.TC_08_00162.Code:
        return new ISOCoverageCodes(polType, "TOWL", "TOWL")
      case TypeOfLossExt.TC_06_00163.Code:
        return new ISOCoverageCodes(polType, "COMP", "COMP")
      default:
        //do nothing, keep defaults defined in the csv file
    }
    
    return null
  }
  /**
   * The appropriate ISO loss section type to construct for this exposure, or
   * null if this exposure should not be sent to ISO
   */
  property get ISOLossSectionType() : Type {
    var lossSectionType : Type
    var payload = this.getISOPayloadType()
    
    switch(payload.toLowerCase()){
      case "property":
        lossSectionType = ISOPropertyLossSection
        break;
      case "boat":
        lossSectionType = ISOWatercraftLossSection
        break;
      case "injury":
        lossSectionType = ISOInjuryLossSection
        break;
      case "vehicle":
        lossSectionType = ISOAutoLossSection
        break;
      case "theft":
        lossSectionType = ISOPropertyLossSection
        break;
      case "wc":
        lossSectionType = ISOWCLossSection
        break;
      default:
        break;
    }
    /*
    GW OOB Code
    if (this.ExposureType == "BodilyInjuryDamage" || this.ExposureType == "MedPay") {
      lossSectionType = ISOInjuryLossSection
    } else if (this.ExposureType == "VehicleDamage") {
      if (this.VehicleIncident.Vehicle.Style == "ATV" || this.VehicleIncident.Vehicle.Style == "snowmobile") {
        lossSectionType = ISOMobileEquipmentLossSection
      } else if (this.VehicleIncident.Vehicle.Style == "boat") {
        lossSectionType = ISOWatercraftLossSection
      } else {
        lossSectionType = ISOAutoLossSection
      }
    } else if (this.ExposureType == "WCInjuryDamage") {
       lossSectionType = ISOWCLossSection
    } else if (this.ExposureType == "PropertyDamage" || this.ExposureType == "LossOfUseDamage" || this.ExposureType == "PersonalPropertyDamage") {
      if (this.LossParty == "insured") {
        lossSectionType = ISOPropertyLossSection
      } else {
        lossSectionType = ISOInjuryLossSection
      }
    }*/
    return lossSectionType   
  }

  /**
   * Used on the exposure and medical details pages to decide whether the ISO
   * buttons should be visible
   */
  property get ISOButtonsVisible() : boolean {
    return perm.Exposure.edit(this) and !this.Claim.ISOClaimLevelMessaging
  }

  /**
   * Used on the exposure and medical details pages to decide whether the ISO
   * buttons should be available
   */
  property get ISOButtonsAvailable() : boolean {
    return this.ISOButtonsVisible and this.isValid("iso") and this.Claim.ISOEnabled
        and this.Claim.isValid("iso", false)
  }
  
}
