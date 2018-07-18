package gw.api.iso
uses xsd.iso.req.ClaimsParty
uses xsd.iso.req.AdjusterPartyInfo
uses xsd.iso.req.PropertySchedule

/**
 * Empty subclass of ISOPropertyLossSectionBase, provided so customers can
 * override methods and properties in the base implementation.
 */
@Export
class ISOPropertyLossSection extends ISOPropertyLossSectionBase {

  /** Is this the first property loss section to be added to this request? */
  private var _isFirstPropertyLossSection : boolean as readonly isFirstPropertyLossSection = true
  
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
  
  /**
   * bestor 11/09/2011 - override OOB to make sure claimants have CI role for properties
   * 
   * Override of standard loss section behavior: PropertyLossInfos are only used
   * for first party losses, and can only have one associated ClaimsParty. If
   * there is an existing PropertyLossInfo we re-use its ClaimsParty rather than
   * trying to create a new one
   */
  override protected function createClaimantAndInsured() : ClaimsParty {
    var insuredClaimsParty : ClaimsParty
    var lossInfo = SearchRequest.AddRequest.PropertyLossInfo
    if (lossInfo == null) {
      // for property, all claimants must be first party
      var result : ClaimsParty
      result = SearchRequest.ClaimsParties.addIndividualParty(Claimant, CI)
      insuredClaimsParty = result
      // send Insured party if the claimant is not insured
      if (Claimant != Insured) {
        insuredClaimsParty = SearchRequest.ClaimsParties.addIndividualParty(Insured, INS)
      }
      this.createAKAParties(insuredClaimsParty)
      return result
    } else {
      _isFirstPropertyLossSection = false
      insuredClaimsParty = lossInfo.ClaimsPartyRefs[0] as ClaimsParty
      this.createAKAParties(insuredClaimsParty)
      return lossInfo.ClaimsPartyRefs[0] as ClaimsParty
    }
  }

  /**
   * bestor 11/09/2011 - have to copy from base since _isFirstPropertyLossSection was a private variable
   * 
   * Override of standard loss section behavior: only add adjuster if this is
   * the first property loss section; subsequent sections will just add
   * ClaimsSubjectInsuranceInfo sub aggregates, which cannot be associated with
   * a specific adjuster.
   */
  override protected function addAdjuster() : AdjusterPartyInfo {
    return _isFirstPropertyLossSection ? super.addAdjuster() : null
  }

  /**
   * bestor 02/14/2012 - check if the LostPropertyType typekey can be translated into ISO or not
   *                     and set the ItemTypeCd accordingly
   * 
   * Creates a PropertySchedule aggregate, used for theft and populated from the
   * exposure's LostPropertyType
   */    
  override protected function createPropertySchedule() : PropertySchedule {
    var propertySchedule = new PropertySchedule()
    propertySchedule.IsSummaryInd = IsSummary ? ISOConstants.TRUE : ISOConstants.FALSE
    if (SearchRequest.Translate.canTranslateTypeCode(Exposure.LostPropertyType)) {
      propertySchedule.ItemDefinition.ItemTypeCd = SearchRequest.Translate.translateTypeCode(Exposure.LostPropertyType)
    } else {
      propertySchedule.ItemDefinition.ItemTypeCd = Exposure.LostPropertyType.Code
    }
    var subjectInsuranceCodeList = SearchRequest.findOrCreateCodeList(ISOCodeList.SUBJECT_INSURANCE_CODE.Id) 
    propertySchedule.ItemDefinition.ItemTypeCd_elem.codelistref = subjectInsuranceCodeList 
    return propertySchedule
  }
  
  override function verifyCanPopulate(existingLossSections : List<ISOLossSectionBase>) : String {
    var result : String = null
    var lossInfo = SearchRequest.AddRequest.PropertyLossInfo
    if (lossInfo != null and lossInfo.ClaimsSubjectInsuranceInfos.Count == 0) {
      result = displaykey.Java.Error.ISO.NoMultiplePropertyLossInfo
      this.Exposure.ISOEnabledExt = false
    }else{
      this.Exposure.ISOEnabledExt = true
    }
    
    return result
  }  
}
