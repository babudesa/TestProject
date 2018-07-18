package gw.api.iso
uses java.text.SimpleDateFormat
uses java.util.Date
uses java.util.Collections

/**
 * Empty subclass of ISOReplyBase, provided so customers can
 * override methods and properties in the base implementation.
 */
@Export
class ISOReply extends ISOReplyBase {
  
  var xmlData : String
  
  construct(xml : String) {
    super(xml)
    xmlData = xml
  }

 override function getMatchReasons(matchDetail : xsd.iso.resp.MatchDetails) : String {
   var reasons = super.getMatchReasons(matchDetail)
   
     return reasons.length() > 0 ? reasons.toString() : "";
 }
  
  /**
   * Called if Successful is true, to add the XML reply string as a document on the exposure/claim.
   */
  override function addReplyAsDocument() {
    var nameFormat = Properties.MatchReportNameFormat
    if (nameFormat.HasContent) {
      var name = new SimpleDateFormat(nameFormat).format(Date.CurrentDate)
      var document = new Document(Reportable.Bundle)
      document.Name = name
      document.Type = DocumentType.TC_ISO
      document.Claim = Reportable.ISOClaim
      document.Exposure = Reportable.ISOExposure
      document.Status = DocumentStatusType.TC_FINAL
      document.MimeType = "text/html"
      document.ex_Type = "Investigation"
      document.ex_SubType = "ISO ClaimSearch Match Report"
      document.ProcessMethod = EmailProcessMethod.TC_FORWARD_TO_ADJUSTER
      document.Description = "Matching Claims from ISO ClaimSearch"
      document.Privileged = YesNo.TC_NO
      util.document.DocumentProduction.createAndStoreDocumentSynchronously("ISOMatchReport.gosu.xml", Collections.singletonMap("xml", xmlData), document)
    }
  }
  
  /**
   * Called if Successful is true, to update the claim/exposure with details of the reply. Updates
   * the ISOReceiveDate and ISOKnown fields, nulls out the ISOErrorMessage and, if there are match
   * reports, creates an activity to notify the user.
   * 
   * bestor 10/25/2011 - turned off creating activitypattern "iso_matches" as per advice from Santosh
   *                     to replicate the same in 4.0 version
   */
  override function updateReportableOnSuccess() {
    Reportable.ISOReceiveDate = Date.CurrentDate
    Reportable.ISOErrorMessage = null
    Reportable.ISOKnown = true    
  }

  /**
   * Called if Successful is false to update the ISOErrorMessage and ISOReceiveDate fields on
   * the claim/exposure. Also creates a new activity to notify the user that an error has
   * occurred.
   * 
   * bestor 01/05/2012 - turned off creating activitypattern "iso_matches"
   * 
   */
  override function updateReportableOnErrorStatus() : String {
    var errorMessage = displaykey.Java.Error.ISO.IncorrectStatus("ClaimInvestigationAddRs.MsgStatus",
                                                                 Reply.MsgStatus.MsgStatusCd, 
                                                                 ISOConstants.RESPONSE_STATUS_SUCCESS, 
                                                                 Reply.MsgStatus.MsgStatusDesc)
    Reportable.ISOErrorMessage = errorMessage
    Reportable.ISOReceiveDate = Date.CurrentDate
    /*
    var activity = Reportable.ISOClaim.createActivityFromPattern(Reportable.ISOExposure, ActivityPattern.finder.getActivityPatternByCode("iso_matches"))
    activity.Subject = displaykey.Java.Error.ISO.IncorrectStatus.Subject
    activity.Description = errorMessage
    */
    return errorMessage
  }  
  
    /**
   * Create an activity if there are CMSWarnings on the ISO Match Report.
   * Added for Medicare Ingestion project March 2017 - dnmiller.
   */
  function createCMSErrorActivity(){
    for (seq in this.Reply.com_iso_AddCovInfo.Sequences){
      for (cmsSeq in seq.com_iso_CMSs){
        var createActivity = false
        for (each in cmsSeq.com_iso_CMSWarnings){
          // If the only errors are the three below then do not create the activity:
          // ="15" Date of Incident Missing or Invalid, "16" State of Venue Missing or Invalid, "18" ORM Indicator Missing or Invalid
          if (each.Value != "15" && each.Value != "16" && each.Value != "18"){
            createActivity = true
            break;
          }
        }
        if (createActivity){
          try {
            Reportable.ISOClaim.createCMSErrorActivity(findMatchingClaimant(Reportable.ISOClaim, cmsSeq.itemRef.NodeID))
          }catch(e){
            gw.api.util.Logger.logInfo( "An error occurred ISOReply setupCMSErrorActivity")
          }
        }
      }
    }
  }
  
  private function findMatchingClaimant(claim: Claim, itemRef: String): Contact{
    if (claim.claimant != null){
      return claim.claimant
    }else{
      // find the claimant in the response for the itemRef of the cms errors
      var firstName: String
      var lastName: String
      var tax: String
      for (party in this.Reply.ClaimsPartys){
        if (party.ClaimsInjuredInfos.where(\ c -> c.id.equalsIgnoreCase(itemRef)).HasElements){
          firstName = party.GeneralPartyInfo.NameInfos.first().Choice.PersonName.GivenName
          lastName = party.GeneralPartyInfo.NameInfos.first().Choice.PersonName.Surname
          if (party.GeneralPartyInfo.NameInfos.first().TaxIdentitys.first().TaxId != null){
            tax = party.GeneralPartyInfo.NameInfos.first().TaxIdentitys.first().TaxId
            tax = tax.substring(tax.length()-4)
          }
          break;
        }
      }
      // find the matching claimant in the exposures
      for (exp in claim.Exposures){
        if (exp.Claimant typeis Person){
          // check first inital and last name
          if (exp.Claimant.FirstName.charAt(0) == firstName.charAt(0) and
            lastName.containsIgnoreCase(exp.Claimant.LastName)){
            return exp.Claimant
          }
          // check last 4 digits of taxID
          if (exp.Claimant.TaxID != null and exp.Claimant.TaxID.substring(exp.Claimant.TaxID.length()-4) == tax){
            return exp.Claimant
          }
        }
      }
    }
    return null
  }
}