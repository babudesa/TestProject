
package gw.api.iso
uses xsd.iso.req.ClaimsOccurrence_TaxIdentity
uses xsd.iso.req.com_iso_SIUParty
uses xsd.iso.req.ClaimsParty
uses xsd.iso.req.com_iso_SIUParty_EventInfo
uses java.util.ArrayList
uses xsd.iso.req.ACORD

/**
 * Empty subclass of ISOLossSectionBase, provided so customers can override
 * methods and properties across all loss section types.
 */
@Export
abstract class ISOLossSection extends ISOLossSectionBase {

  /**
   * Exposure level constructor, used when creating a request for just the
   * given exposure. Implicitly creates an ISOClaimSearchRequest.
   */
  construct(inExposure : Exposure) {
    super(inExposure)
  }

  /**
   * Claim level constructor, for adding a new loss section to an existing
   * claim level request.
   */
  construct(inSearchRequest : ISOClaimSearchRequest, inExposure : Exposure) {
    super(inSearchRequest, inExposure)
  }
  
  /**
   * bestor 10/05/2011 - overriden to add CMS data into the payload
   */
  override function populate() : ACORD {
    var acord : ACORD = null
    // defaulted to OTHER only if coverage is identity theft
    if (Exposure.LostPropertyType == null && Exposure.Coverage.Type == "ab_Identity") {
      Exposure.LostPropertyType = LostPropertyType.TC_OTHER
    }
    //populate the payload
    if(Exposure.isValid("iso")) {
      acord = super.populate()
      setSuppressMatchInd()
      
      /*** Entry point to add Medicare Related data into payload ***/
      if(Exposure.MedicareExposureExt and Exposure.Claimant typeis Person) {
        addMedicareDataIntoPayload(Exposure.Claimant) 
      }
    }
    return acord
  }
  
  /**
   * Called by populate to create the ClaimsParty or ClaimsParties for the
   * claimant and insured; two separate parties for third party losses, a
   * single "both claimant and insured" party for first party losses.
   * Returns the claimant party.
   */
  override protected function createClaimantAndInsured() : ClaimsParty {
    var insuredClaimsParty : ClaimsParty
    var result : ClaimsParty
    if (IsFirstParty) {
      result = SearchRequest.ClaimsParties.addIndividualParty(Claimant, CI)
      insuredClaimsParty = result
      // send Insured party if the claimant is not insured
      if (Claimant != Insured) {
        insuredClaimsParty = SearchRequest.ClaimsParties.addIndividualParty(Insured, INS)
      }
    } else {
      insuredClaimsParty = SearchRequest.ClaimsParties.addIndividualParty(Insured, INS)
      result = SearchRequest.ClaimsParties.addIndividualParty(Claimant, CL)
    }
    
    //create and add AKAs/Alias parties
    createAKAParties(insuredClaimsParty)
    
    return result
  }
  
  protected function createAKAParties(insuredClaimsParty : ClaimsParty){
    var mniParties = new ArrayList<Contact>() 
    
    if(Exposure.Claim.Policy.getMNICoveredParties()*.Contact != null){
      mniParties = Exposure.Claim.Policy.getMNICoveredParties()*.Contact as java.util.ArrayList<entity.Contact> 
    }
    
    if(Exposure.Claim.Policy.doingbusinessas != null){
      mniParties.add(Exposure.Claim.Policy.doingbusinessas) 
    }
        
    if(mniParties != null){
      mniParties.each(\ mniParty -> {
        SearchRequest.ClaimsParties.addParty(insuredClaimsParty, mniParty, ISOClaimsPartyRole.Alias)  
      })
    }
    
  }

  /**
   * String describing the loss, defaults to the exposure's incident
   * description
   */
  override protected property get IncidentDescription() : String {
    return Exposure.Claim.Description
  }
  
  /**
   * bestor 10/03/2011 - Added from 4.0 version, sets the SuppressMatchInd to "1"
   * if Exposure state is "Closed" for all payloads.
   * bestor 01/30/2012 - Changed from feature to claim level
   */
  protected function setSuppressMatchInd() {
    if (Exposure.Claim.Closed) {
      SearchRequest.AddRequest.SuppressMatchInd = "1";
    }
  }

 /*
   Medicare stuff
 */
  protected function addMedicareDataIntoPayload(medClaimant : Person)  {
    
    var claimsParty = SearchRequest.ClaimsParties.getExistingParty(medClaimant)
  
    if (medClaimant.LegalLNameExt != null && medClaimant.LegalLNameExt.trim().length > 0) {
      claimsParty.GeneralPartyInfo.NameInfos.first().Choice.PersonName.Surname 
        = SearchRequest.truncateString(medClaimant.LegalLNameExt, 30)
    }
  
    if (medClaimant.LegalFNameExt != null && medClaimant.LegalFNameExt.trim().length > 0) {
      claimsParty.GeneralPartyInfo.NameInfos.first().Choice.PersonName.GivenName 
        = SearchRequest.truncateString(medClaimant.LegalFNameExt, 20)
    }
  
    if (medClaimant.LegalMNameExt != null && medClaimant.LegalMNameExt.trim().length > 0) {
      claimsParty.GeneralPartyInfo.NameInfos.first().Choice.PersonName.OtherGivenNames.first().Value 
        = SearchRequest.truncateString(medClaimant.LegalMNameExt, 20)
    }
  
    // as per advise from Stephanie 11/07/2011
    if (medClaimant.TaxID != null) {
      addMedicareDataIntoClaimsOccurrence(medClaimant)
    }
  
    addSIUPartyToAddRequest(medClaimant, claimsParty)
  }
  
  protected function addMedicareDataIntoClaimsOccurrence(medClaimant : Person) {
    SearchRequest.AddRequest.ClaimsOccurrence.com_iso_SelfInsuredInd = "N"
    SearchRequest.AddRequest.ClaimsOccurrence.TaxIdentity = createClaimsOccurrenceTaxIdentity(medClaimant)
  }
  
  protected function addSIUPartyToAddRequest(medClaimant : Person, claimsParty : ClaimsParty) {
    var siuParty = new com_iso_SIUParty()
    /** 
     * commented out and changed to 'switch' as medClaimant.MedicareEligibleExt=null when 
     * the claim is just created and Medicare Eligible field isn't changed
    */
    // siuParty.com_iso_MedicareEligibleInd = medClaimant.MedicareEligibleExt ? "Y" : "N" 
    switch(medClaimant.MedicareEligibleExt){
      case true: 
        siuParty.com_iso_MedicareEligibleInd = "Y"
      break
      case false: 
        siuParty.com_iso_MedicareEligibleInd = "N"
      break
      case null: 
        siuParty.com_iso_MedicareEligibleInd = " "
    }
    siuParty.ClaimsPartyRef = claimsParty.id
    siuParty.com_iso_NotSendToCMS = medClaimant.SendPartyToCMSExt ? "Y" : "N"
    siuParty.com_iso_HICN = medClaimant.HICNExt
    siuParty.com_iso_StopCMSQuery.Text = medClaimant.StopSendPartyToCMSExt ? "Y" : "N"
    
    //Added for Medicare Reporting
    if(medClaimant.DateOfDeathExt != null){
      var eventInfo = new com_iso_SIUParty_EventInfo()
      //var eventInfoCodeList = this.SearchRequest.findOrCreateCodeList("EventCd")
      eventInfo.EventCd = "Death" //event codes don't seem to be available in ISOConstants, so just hardcoding for now...
      eventInfo.EventDt = ISOTranslate.instance().formatClaimDate(medClaimant.DateOfDeathExt)
      //eventInfo.EventCd_elem.codelistref = eventInfoCodeList
      siuParty.EventInfo = eventInfo
    }
    
    SearchRequest.AddRequest.com_iso_SIUPartys.add(siuParty)    
  }
  
  protected function createClaimsOccurrenceTaxIdentity(contact : Contact) : ClaimsOccurrence_TaxIdentity {
    var taxIdentity = new ClaimsOccurrence_TaxIdentity()
    taxIdentity.TaxIdTypeCd = (contact typeis Person) ? ISOConstants.TAX_IDENTITY_SSN : ISOConstants.TAX_IDENTITY_TIN
    var taxIdTypeCodeList = SearchRequest.findOrCreateCodeList("TaxIdType")
    taxIdentity.TaxIdTypeCd_elem.codelistref = taxIdTypeCodeList
    taxIdentity.TaxId = contact.TaxID.replaceAll("-", "")
    return taxIdentity
  }
  
  //override, so we can send all features
  public override function verifyCanPopulate(existingLossSections : List<ISOLossSectionBase>) : String {
    var thisCodes = CoverageCodes
    var thisAggregateType = LossSectionAggregateType
    for (addedLossSection in existingLossSections) {
      var addedLossAggregateType = addedLossSection.LossSectionAggregateType
      if (thisAggregateType == addedLossAggregateType) {
         var addedPolicyCoverageCodes = addedLossSection.CoverageCodes
         if (thisCodes.CoverageType == addedPolicyCoverageCodes.CoverageType and
             thisCodes.LossType == addedPolicyCoverageCodes.LossType and 
             ((this.Exposure == addedLossSection.Exposure) || this.Exposure.Claimant == addedLossSection.Exposure.Claimant)){
            this.Exposure.ISOEnabledExt = false
            return displaykey.Java.Error.ISO.WrongLossInfoCoverageAndLossCause
         }
      }
    }
    this.Exposure.ISOEnabledExt = true
    return null
  }
  
  /**
   * Called by createClaimsPayment to determine the value for the ClaimStatusCd
   * field
   */
  protected override function createClaimStatusCode(hasPayment : boolean) : String {
    if (not Exposure.Closed) {
      return ISOConstants.OPEN_CLAIM_STATUS
    } else if (!hasPayment) {
      return ISOConstants.CLOSED_WITH_PAYMENT_CLAIM_STATUS
    } else {
      return ISOConstants.CLOSED_CLAIM_STATUS
    }
  }
  
}
