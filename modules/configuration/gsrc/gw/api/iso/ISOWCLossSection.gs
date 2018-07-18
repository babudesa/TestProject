package gw.api.iso
uses xsd.iso.req.StringCd
uses util.WCHelper

/**
 * Empty subclass of ISOWCLossSectionBase, provided so customers can
 * override methods and properties.
 */
@Export
class ISOWCLossSection extends ISOWCLossSectionBase {

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
   * Override to use Part of Body, Nature of Injury, Injury Cause for ISO in the Alleged Injuries/Damage to Property field, 
   * formatting like the example below:
   * 
   * Upper Arm � Laceration � Using Tool or Machinery
   */
  override property get InjuryDescription() : String {
    var incidentDesc = ""
    
    if(InjuryIncident != null){
      if(InjuryIncident.BodyParts.HasElements){
        var bodyPart = InjuryIncident.BodyParts[0].DetailedBodyPart.DisplayName
        incidentDesc += bodyPart
      }
      
      if(InjuryIncident.DetailedInjuryType != null){
        incidentDesc += " - " + InjuryIncident.DetailedInjuryType.DisplayName 
      }
    }
    
    if(Exposure.Claim.ex_DetailLossCause != null){
      incidentDesc += " - " +  Exposure.Claim.ex_DetailLossCause.DisplayName
    }
    
    //this description has the potential to get very long, so truncate it at the ISO 50 character limit
    return (incidentDesc.length > 50) ? incidentDesc.substring(0, 50) : incidentDesc
      
  }
  
  /**
   * For WC, the ICD codes are primarily stored on the Injury Incident. They are replicated to the Medicare tab only for viewing.
   * Cause of Injury Codes are still only available on the Medicare tab
   */
  override function addICDCodes(claimsInjuredInfo : xsd.iso.req.ClaimsInjuredInfo){
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
      addICDDiagnosticCodes(claimsInjuredInfo)
      }
  }
  /**
  * WC claims, and Employer's Liability (EL) are resolved from here.
  * WC claims have the ICDMedReportExt field determining that ICDCode should
  * be sent to ISO or not (checkbox for user on screen). EL claims do not have this field. Furthermore,
  * EL claims store the ICDCode like non-WC claims do. The ICDCode
  * has to be resolved from the claimant's Medicare page, like in non-WC claims,
  * and there is no option for the user to choose; ICD10 codes are sent if given.
  */
  private function addICDDiagnosticCodes(claimsInjuredInfo : xsd.iso.req.ClaimsInjuredInfo){
  
    var injuryInc = Exposure.Claim.ClaimInjuryIncident
    var diagnosticCd : StringCd
    if (util.WCHelper.isELLossType(Exposure.Claim)){
        var medicareCont = (Exposure.Claimant as Person).ContactISOMedicareExt  
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
     else {
      for(injuryDiagnosis in injuryInc.InjuryDiagnoses.where(\ id -> id.ICDMedReportExt && id.ICDCode.Code != _WCICD)){
        diagnosticCd = new StringCd()
        diagnosticCd.Value = injuryDiagnosis.ICDCode.Code.replace(".", "")
        
        if (injuryDiagnosis.ICDCode.ICDVersionExt != ICDVersionExt.TC_10){ 
          getOrCreateCovInfo1(claimsInjuredInfo).ICDDiagnosticCds.add(diagnosticCd)
        } else {
          getOrCreateCovInfo1(claimsInjuredInfo).com_iso_ICD10Cds.add(diagnosticCd)
        }
      }
    }
  }
}
