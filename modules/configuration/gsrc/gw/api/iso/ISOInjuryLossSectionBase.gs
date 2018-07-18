package gw.api.iso
uses xsd.iso.req.ClaimsInjuredInfo
uses xsd.iso.req.StringCd
uses gw.xml.xsd.IXMLNodeWithID
uses xsd.iso.req.ClaimsParty

/**
 * Creates an ClaimsInjuredInfo loss section, populated with information from the
 * exposure and exposure's injury incident
 */
@Export
abstract class ISOInjuryLossSectionBase extends ISOLossSection {

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
   * The type of loss section aggregate created by this object - ClaimsInjuredInfo
   * in this case.
   */
  override property get LossSectionAggregateType() : Type {
    return ClaimsInjuredInfo
  }
  
  /**
   * Override the standard createLossSection method to create a ClaimsInjuredInfo
   * aggregate. The ClaimsParty represents the claimant and is linked to the
   * new ClaimsInjuredInfo aggregate
   */
  protected override function createLossSection(claimantParty : ClaimsParty) : IXMLNodeWithID {
    var result : ClaimsInjuredInfo = null
    if (InjuryDescription != null) {
      result = createClaimsInjuredInfo()
      if (claimantParty.ClaimsInjuredInfos == null) {
        claimantParty.ClaimsInjuredInfos = {result}
      } else {
        claimantParty.ClaimsInjuredInfos.add(result) 
      }
    }
    return result
  }
  
  /**
   * Creates the new ClaimsInjuredInfo aggregate from the information given by
   * the exposure's injury incident
   */
  protected function createClaimsInjuredInfo() : ClaimsInjuredInfo {
    var injuredInfo = new xsd.iso.req.ClaimsInjuredInfo()
    injuredInfo.id = SearchRequest.getNextId()
    var claimsInjury = new xsd.iso.req.ClaimsInjury()
    claimsInjury.InjuryNatureDesc = InjuryDescription
    var injuryBodyPart = InjuryIncident.FirstBodyPart.DetailedBodyPart
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
   * The injury description, used to populate the InjuryNatureDesc field in the
   * ClaimsInjury aggregate
   */
  protected property get InjuryDescription() : String {
    return Exposure.Incident.Description
  }
  
  /**
   * The injury incident, used to populate the BodyPartCds aggregate list in
   * the ClaimsInjury aggregate 
   */
  protected property get InjuryIncident() : InjuryIncident {
    return Exposure.InjuryIncident
  }
  
  /**
   * Whether the claimant was disabled due to the accident, used to populate
   * the com.iso.DisabledDueToAccidentInd aggregate in the ClaimsInjuredInfo
   * aggregate
   */
  protected property get DisabledDueToAccident() : DisabledDueToAccident {
    return InjuryIncident.DisabledDueToAccident 
  }

}
