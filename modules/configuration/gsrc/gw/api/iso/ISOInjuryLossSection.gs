package gw.api.iso
uses xsd.iso.req.ClaimsParty
uses gw.xml.xsd.IXMLNodeWithID
uses xsd.iso.req.ClaimInvestigationAddRq_com_iso_AddCovInfo
uses util.gaic.CMS.validation.CMSIntegrationValidation
uses util.gaic.CMS.validation.CMSValidationUtil
uses xsd.iso.req.ClaimsInjuredInfo
uses xsd.iso.req.StringCd
uses xsd.iso.req.ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo1
uses xsd.iso.req.ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo2
uses xsd.iso.req.ClaimsInjury

/**
 * Empty subclass of ISOInjuryLossSectionBase, provided so customers can
 * override methods and properties in the base implementation.
 */
@Export
class ISOInjuryLossSection extends ISOInjuryLossSectionBase {
  
  public static final var _WCICD : String = "WCCONV"
  /**
   * Exposure level constructor, used when creating a request for just the
   * given exposure. Implicitly creates an ISOClaimSearchRequest.
   */
  construct(inExposure : Exposure)  {
    super(inExposure)
  }

  /**
   * Claim level constructor, for adding a new loss section to an existing
   * claim level request.
   */
  construct(inSearchRequest : ISOClaimSearchRequest, inExposure : Exposure) {
    super(inSearchRequest, inExposure)
  }
  
  override function createLossSection(claimantParty : ClaimsParty) : IXMLNodeWithID {
    var claimsInjuredInfo = super.createLossSection(claimantParty) as ClaimsInjuredInfo
    
    if(SearchRequest.AddRequest.com_iso_AddCovInfo == null){
      SearchRequest.AddRequest.com_iso_AddCovInfo = new ClaimInvestigationAddRq_com_iso_AddCovInfo()
    }
    
    //always add ICD codes, if present
    if(Exposure.Claimant typeis Person){
      addICDCodes(claimsInjuredInfo)
    }
    
    if(Exposure.Claimant typeis Person && (Exposure.MedicareExposureExt || Exposure.IsMedicareExposureExt)){
      var cmsVal = new CMSIntegrationValidation(Exposure)
      CMSValidationUtil.validate(cmsVal)
      
      if(cmsVal.ValidationMessage == ""){
        var medicareUtil = new MedicareUtil(Exposure, claimsInjuredInfo, SearchRequest)
    	medicareUtil.populateMedicareInfo()
      }
    }
    
    return claimsInjuredInfo    
  }
  
  /*
    Adds the cause of injury code and ICD9 diagnostic codes to the covInfo1 aggregate. Both types of codes
    are stored in the same array. The cause of injury code is distinguishable from the other ICD9 codes because
    it has the "CauseOfInjury" flag set to true. If for some reason there are more than one ICD9 codes with the flag set,
    the first is used.
  */
  protected function addICDCodes(claimsInjuredInfo : ClaimsInjuredInfo) {
    var medicareCont = (Exposure.Claimant as Person).ContactISOMedicareExt    
    if(medicareCont.ContactICDExt != null){  
      var causeOfInjury = medicareCont.ContactICDExt.where(\ c -> c.CauseOfInjury).first()
      if(causeOfInjury != null && causeOfInjury.ICDCode.Code != _WCICD){ 
        if (causeOfInjury.ICDCode.ICDVersionExt != ICDVersionExt.TC_10) {      
          getOrCreateCovInfo1(claimsInjuredInfo).com_iso_CauseofInjuryCd = causeOfInjury.ICDCode.Code.replace(".", "")
        } else {
          getOrCreateCovInfo2(claimsInjuredInfo).com_iso_ICD10CauseOfInjuryCd.Text = causeOfInjury.ICDCode.Code.replace(".", "")
        }
      }
      
      var diagnosticCd : StringCd
      for(conICD in medicareCont.ContactICDExt.where(\ c -> !c.CauseOfInjury && c.ICDCode.Code != _WCICD)){
        diagnosticCd = new StringCd()
        diagnosticCd.Value = conICD.ICDCode.Code.replace(".", "")
        if (conICD.ICDCode.ICDVersionExt != ICDVersionExt.TC_10){ 
          getOrCreateCovInfo1(claimsInjuredInfo).ICDDiagnosticCds.add(diagnosticCd)
        } else {
          getOrCreateCovInfo1(claimsInjuredInfo).com_iso_ICD10Cds.add(diagnosticCd)
        }
      }
    }
  }
  
  protected function getOrCreateCovInfo1(claimsInjuredInfo : ClaimsInjuredInfo) : ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo1 {
    var covInfo1 = SearchRequest.AddRequest.com_iso_AddCovInfo.com_iso_CovInfo1s.firstWhere(\ c -> c.ItemRef == claimsInjuredInfo)
    
    //If a covInfo1 aggregate that points to the given claimsInjuredInfo does not exist, create it.
    if(covInfo1 == null){
      covInfo1 = new ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo1()
      covInfo1.ItemRef = claimsInjuredInfo
      SearchRequest.AddRequest.com_iso_AddCovInfo.com_iso_CovInfo1s.add(covInfo1)
    }
    
    return covInfo1
  }
  
  protected function getOrCreateCovInfo2(claimsInjuredInfo : ClaimsInjuredInfo) : ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo2 {
    var covInfo2 = SearchRequest.AddRequest.com_iso_AddCovInfo.com_iso_CovInfo2s.firstWhere(\ c -> c.ItemRef == claimsInjuredInfo)
    
    //If a covInfo2 aggregate that points to the given claimsInjuredInfo does not exist, create it.
    if(covInfo2 == null){
      covInfo2 = new ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo2()
      covInfo2.ItemRef = claimsInjuredInfo
      SearchRequest.AddRequest.com_iso_AddCovInfo.com_iso_CovInfo2s.add(covInfo2)
    }
    
    return covInfo2
  }
  
  /**
   * Override for E&S to use certificate holder as the insured, if available
   * 
   * Please increment if you've struggled to understand why this function isn't working as expected = 43
   */
  override function createClaimantAndInsured() : ClaimsParty {
    var insuredClaimsParty : ClaimsParty
    var result : ClaimsParty
    var certHolder : Contact    
    
    if (IsFirstParty) {  //overridden version of IsFirstParty takes cert holder into account
      result = SearchRequest.ClaimsParties.addIndividualParty(Claimant, CI)
      insuredClaimsParty = result
    } else {
      result = SearchRequest.ClaimsParties.addIndividualParty(Claimant, CL)
    }
    
    //send a separate Insured party if not third party or if the claimant is not insured. Sadly this is possible even on our First Party claims.
    if(!IsFirstParty || (Claimant != Insured)){
      if(this.Exposure.Claim.LossType == LossType.TC_SPECIALTYES){
        certHolder = this.Exposure.Claim.CertHolderExt
      }      
      //send the certificate holder as the insured for E&S, if it is available and valid
      insuredClaimsParty = SearchRequest.ClaimsParties.addIndividualParty((isCertHolderValid(certHolder) ? certHolder : Insured), INS) 
    }
    
    //create and add AKAs/Alias parties (very important for Medicare)
    createAKAParties(insuredClaimsParty)
    
    return result
  }
  
  /**
   * Makes sure that the certificate holder has the required info before sending them as an Insured. Makes use of the existing
   * name and address validation functions. They're clunky but they work fine.
   */
  private function isCertHolderValid(certHolder : Contact) : boolean{
     var clm = this.Exposure.Claim
     var nameValid = false
     var addressValid = false
     if(certHolder != null){       
       //name validation
       if(certHolder typeis Company){
         nameValid = clm.performNameValidation(certHolder.Name) == "0"
       }else if(certHolder typeis Person){
         nameValid = clm.performNameValidation(certHolder.FirstName) == "0"
                       && clm.performNameValidation(certHolder.LastName) == "0"
       }       
       //address validation
       addressValid = (clm.performAddressValidation(certHolder.PrimaryAddress.AddressLine1) == "0"
                        && clm.performAddressValidation(certHolder.PrimaryAddress.City) == "0"
                        && clm.performAddressValidation(certHolder.PrimaryAddress.State.toString()) == "0"
                        && clm.performAddressValidation(certHolder.PrimaryAddress.PostalCode) == "0") 
     }
              
    return nameValid && addressValid
  }
  
  /**
   * Creates the new ClaimsInjuredInfo aggregate from the information given by
   * the exposure's injury incident
   * OVERRIDE to use our Body Part extension field
   */
  protected override function createClaimsInjuredInfo() : ClaimsInjuredInfo {
    var injuredInfo = new ClaimsInjuredInfo()
    injuredInfo.id = SearchRequest.getNextId()
    var claimsInjury = new ClaimsInjury()
    claimsInjury.InjuryNatureDesc = InjuryDescription
    var injuryBodyPart = Exposure.DetailedBodyPartExt
    if (injuryBodyPart != null) {
      var bodyPartCd = new StringCd()
      bodyPartCd.codelistref = SearchRequest.findOrCreateCodeList(ISOCodeList.BODY_PART_CODE.Id)
      bodyPartCd.Value = SearchRequest.Translate.optionallyTranslateTypeCode(injuryBodyPart)
      claimsInjury.BodyPartCds.add(bodyPartCd)
    }
    injuredInfo.ClaimsInjurys.add(claimsInjury) 
    if (InjuryIncident.AmbulanceUsed != null) {
      injuredInfo.com_iso_AmbulanceUsedInd = 
          InjuryIncident.AmbulanceUsed ? ISOConstants.YES : ISOConstants.NO
    } 
    var isoDisabledDueToAccident = SearchRequest.Translate.translateTypeCode(DisabledDueToAccident)
    if (isoDisabledDueToAccident != null) {
      injuredInfo.com_iso_DisabledDueToAccidentInd = isoDisabledDueToAccident
    }
    return injuredInfo 
  }  

  /**
   * Override to map to our custom Injury Description that is off the Exposure instead of the Incident.
   * If the Loss Type is Executive Liability, then we send the Claim Loss Description instead of the Injury Description
   * because InjuryNatureDescExt is not available on the Executive Liability exposure screens.
   */
  override property get InjuryDescription() : String {
    if((this.Exposure.Claim.LossType == LossType.TC_EXECLIABDIV or this.Exposure.Claim.LossType == LossType.TC_PROFLIABDIV or this.Exposure.Claim.LossType == LossType.TC_MERGACQU or this.Exposure.Claim.LossType == LossType.TC_SPECIALHUMSERV)
       || (this.Exposure.ExposureType == ExposureType.TC_SP_SPECIAL_FORM || this.Exposure.ExposureType == ExposureType.TC_SP_CONTRACTUAL
       || this.Exposure.ExposureType == ExposureType.TC_SP_IDENTITY_THEFT)
       || (this.Exposure.ExposureType == ExposureType.TC_EX_AUTO_PROPDAMAGE  || this.Exposure.ExposureType == ExposureType.TC_EX_EXCESS_PROPDAMAGE))
    { if(this.Exposure.InjuryNatureDescExt != null && this.Exposure.InjuryNatureDescExt != "")
        return this.Exposure.InjuryNatureDescExt 
      if(this.Exposure.Claim.Description != null)
        return this.Exposure.Claim.Description
      else{
        throw new ISOBadRequestException("Claim Description must be filled in to send to ISO.")    
      }
    }else{
      return Exposure.InjuryNatureDescExt
    }
  }

  /**
   * Override because it is possible to pick a third party claimant even if the Loss Party
   * on the exposure is First Party. Additionally, if the Cert Holder on an E&S claim is also the claimant, then 
   * we can give them the CI role instead of sending two separate parties.
   */
  override property get IsFirstParty() : boolean {
    if(this.Exposure.Claim.LossType == LossType.TC_SPECIALTYES){
      //we cannot send CI role if cert holder is not the same as the claimant
      return super.IsFirstParty && Exposure.Claim.CertHolderExt == Exposure.Claimant
    }else{
      return super.IsFirstParty && (Exposure.Claim.Policy.insured == Exposure.Claimant)
    }
  }
}
