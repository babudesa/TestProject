package gw.api.iso

/**
 * Empty subclass of ISORequestBase, provided so customers can
 * override methods and properties in the base implementation.
 */
@Export
class ISORequest extends ISORequestBase {
  private var hyphenString: String="-"
    
  protected construct(inClaim : Claim) {
    super(inClaim)
  }
  
  /**
   * Utility to create a MiscParty sub aggregate from the claim information
   * and add it to the Policy sub aggregate's MiscPartys
   */
  override protected function createMiscParty() {
    var miscParty = new xsd.iso.req.MiscParty()
    miscParty.id = ISOConstants.MISC_PARTY_ID
    //miscParty.ItemIdInfo.AgencyId = (Claim.AgencyId == null) ? Properties.AgencyId : Claim.AgencyId
    miscParty.ItemIdInfo.AgencyId = libraries.ISO.getClaimLevelISOAgencyId(Claim)
    var miscPartyInfo = new xsd.iso.req.MiscPartyInfo()
    miscPartyInfo.MiscPartyRoleCd = ISOConstants.MISC_PARTY_ROLE
    miscParty.MiscPartyInfos.add(miscPartyInfo)
    AddRequest.Policy.MiscPartys.add(miscParty)
  }
  
  /**
   * Utility to create an Addr sub aggregate from the given address
   */
  override protected function createAddr(address : Address) : xsd.iso.req.Addr {
    var addr = new xsd.iso.req.Addr()
    addr.Addr1 = truncateString(address.AddressLine1, 50)
    addr.Addr2 = truncateString(address.AddressLine2, 50)
    addr.Addr3 = truncateString(address.AddressLine3, 50)
    addr.City = truncateString(address.City, 25)
    if (address.State != null) {
      addr.StateProvCd = address.State.Code
    }
    if (address.PostalCode != null) {
      //addr.PostalCode = truncateString(address.PostalCode, 9)
      addr.PostalCode = createPostalCode(address)
    }
    addr.CountryCd = address.Country.Code
    return addr
  }
  
  private function createPostalCode(address:Address): String {
    var postalCode: String =address.PostalCode
    if (postalCode.contains(hyphenString)) {
       postalCode=postalCode.replace(hyphenString,"")
    }
    return postalCode
  
  }
  
  /**
   * Utility to create the ClaimsOccurrence sub aggregate within the
   * ClaimInvestigationAddRq, using information from the provided arguments
   * and the claim.
   */
  override protected function createClaimsOccurrence(lossDate : java.util.Date, reportedDate : java.util.Date, insurerId : String) {
    AddRequest.ClaimsOccurrence.ItemIdInfo.InsurerId = insurerId
    if (reportedDate != null) {
      var claimsReported = new xsd.iso.req.ClaimsReported()
      claimsReported.ReportedToRef = AddRequest.Policy.MiscPartys.firstWhere(\ m ->m.id == ISOConstants.MISC_PARTY_ID)
      if (reportedDate != null) {
        claimsReported.ReportedDt = Translate.formatClaimDate(reportedDate)
      }
      AddRequest.ClaimsOccurrence.ClaimsReporteds.add(claimsReported)
    }
     /* Defect#7478 Sets OriginalLossDtExt for ELD, PLD, Spec E&S and ENV Claims-made LOBs. 
     *  OriginalLossDtExt contains the first Loss Date sent to ISO 
     */
    if (Claim.ShouldSendOriginalLossDate) {
      if (Claim.OriginalLossDtExt == null){
        Claim.OriginalLossDtExt = Translate.formatClaimDate(lossDate) as java.util.Date
      }
      AddRequest.ClaimsOccurrence.LossDt = Translate.formatClaimDate(Claim.OriginalLossDtExt)
    }
    else
      AddRequest.ClaimsOccurrence.LossDt = Translate.formatClaimDate(lossDate)
  }
}
