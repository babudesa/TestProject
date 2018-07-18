package gw.api.iso

/**
 * Empty subclass of ISOKeyFieldUpdateRequestBase, provided so customers can
 * override methods and properties in the base implementation.
 */
@Export
class ISOKeyFieldUpdateRequest extends ISOKeyFieldUpdateRequestBase {
  
  construct(reportable : ISOReportable)  {
    super(reportable)
  }
  
  /**
   * Populate the the com.iso.Update aggregate, which is specific to key field
   * update requests
   * <p>
   * Returns the populated request
   */
  override protected function createUpdate() {
    var originalClaim = Claim.OriginalVersion as Claim
    AddRequest.com_iso_Update.com_iso_OriginalFields.com_iso_KeyFields.PolicyNumber = Claim.OriginalPolicyNumber
    AddRequest.com_iso_Update.com_iso_OriginalFields.com_iso_KeyFields.ItemIdInfo.AgencyId = 
                        (originalClaim.AgencyId == null) ? Properties.getAgencyId() : originalClaim.AgencyId  
    AddRequest.com_iso_Update.com_iso_OriginalFields.com_iso_KeyFields.ItemIdInfo.InsurerId = CreateInsurerId(originalClaim.ClaimNumber)
    // if only DOL was changed for ELD, PLD, Spec E&S or ENV Claim, then uses OriginalLossDtExt date
    if (originalClaim.LossDate != null){
      if(Claim.ShouldSendOriginalLossDate && Claim.OriginalLossDtExt!=null)
        AddRequest.com_iso_Update.com_iso_OriginalFields.com_iso_KeyFields.LossDt = Translate.formatClaimDate(Claim.OriginalLossDtExt)
      else
        AddRequest.com_iso_Update.com_iso_OriginalFields.com_iso_KeyFields.LossDt = Translate.formatClaimDate(originalClaim.LossDate)
    }
    AddRequest.com_iso_Update.com_iso_UpdateInd = ISOConstants.UPDATE_KEY_FIELDS_INDICATOR
  }
}
