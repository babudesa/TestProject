package gw.api.iso

uses java.text.SimpleDateFormat
uses gw.document.DocumentProduction
uses java.util.Collections
uses java.util.Date
uses java.text.ParseException
uses xsd.iso.MatchDetails
uses java.util.HashSet
uses gw.plugin.iso.ISOBadReplyException
uses gw.datatype.DataTypes
uses java.lang.StringBuilder

/**
 * Parses an asynchronous response from ISO and identifies the corresponding claim/exposure
 * encoded in the response RqUID field. Provides methods to verify that the response is
 * valid and successful, and to add details about the reply (XML document, match reports) to
 * the claim/exposure
 */
@Export
class ISOReplyBase {

  var _xml : String
  
  /** The reply as a parsed XML object */
  var _reply : xsd.iso.ClaimInvestigationAddRs as readonly Reply
  
  /** The reply's request id */
  var _requestId : ISORequestId as readonly RequestId
  
  /** The claim/exposure corresponding to this reply */
  var _reportable : ISOReportable as readonly Reportable
  
  /** The ISO properties */
  var _isoProperties : ISOProperties as readonly Properties
  
  /**
   * Create a new ISOReply object from the given XML string. Also checks the password and
   * finds the claim/exposure associated with this reply.
   * @param xml the XML string to be parsed
   * @throws an ISOBadReplyException if the reply cannot be parsed, does not have a valid
   *   RqUID or contains a bad customer password
   */
  @Throws(ISOBadReplyException, "If response cannot be parsed, or password/requestId is not valid.")
  construct(xml : String) {
    _xml = xml
    try {
      _reply = xsd.iso.ClaimInvestigationAddRs.parse(xml)
    } catch (e) {
      throw new ISOBadReplyException(displaykey.Java.Error.ISO.CouldNotParseReply, e)
    }
    _isoProperties = ISOProperties.instance()
    _requestId = ISORequestId.parse(Reply.RqUID, _isoProperties.getTestSuffix())
    _reportable = gw.transaction.Transaction.getCurrent().loadByKey(RequestId.ReportableId) as ISOReportable
    if (not ValidCustomerPassword) {
      throw new ISOBadReplyException(displaykey.Java.Error.ISO.InvalidPassword + _xml)
    } 
    if (RequestId == null) {
      throw new ISOBadReplyException(displaykey.Java.Error.ISO.InvalidRequestId + _xml) 
    }
  }
  
  /**
   * Checks whether the reply contains a valid customer password. The password can be given either in
   * the com_iso_CustLoginPwd aggregate, or embedded in the request id (or both). If the password in
   * either place matches this property will be true.
   */
  property get ValidCustomerPassword() : boolean {
    var validPassword = false
    validPassword = _isoProperties.CustomerPassword == Reply.com_iso_CustLoginPwd.Text
    if (not validPassword and RequestId != null){
      validPassword = _isoProperties.CustomerPassword == RequestId.Password
    }
    return validPassword
  }

  /**
   * True if this reply is associated with a valid claim/exposure, false otherwise. Could
   * return false if a claim has been purged or archived.
   */
  property get Applicable() : boolean {
    return Reportable != null
  }

  /**
   * True if the the reply contains the expected "Success" message status code. If this property
   * is false then ISO did not accept the original message and there should be an error message
   * in MsgStatus.MsgStatusDesc. This property determines whether we ack or nack the corresponding
   * ISO transport message. 
   */
  property get Successful() : boolean {
    return ISOConstants.RESPONSE_STATUS_SUCCESS.equals(Reply.MsgStatus.MsgStatusCd)
  }
  
  /**
   * Called if Successful is true, to add the XML reply string as a document on the exposure/claim.
   */
  function addReplyAsDocument() {
    var nameFormat = Properties.MatchReportNameFormat
    if (nameFormat.HasContent) {
      var name = new SimpleDateFormat(nameFormat).format(Date.CurrentDate)
      var document = new Document(Reportable.Bundle)
      document.Name = name
      document.Type = DocumentType.TC_ISO
      document.Claim = Reportable.ISOClaim
      document.Exposure = Reportable.ISOExposure
      document.Status = DocumentStatusType.TC_FINAL
      var template = DocumentProduction.getDocumentTemplateSourcePlugin().getDocumentTemplate("ISOMatchReport.gosu.xml", null)
      DocumentProduction.createAndStoreDocumentSynchronously(template, Collections.singletonMap("xml", _xml), document)
    }
  }
  
  /**
   * Called if Successful is true, to update the claim/exposure with details of the reply. Updates
   * the ISOReceiveDate and ISOKnown fields, nulls out the ISOErrorMessage and, if there are match
   * reports, creates an activity to notify the user.
   */
  function updateReportableOnSuccess() {
    Reportable.ISOReceiveDate = Date.CurrentDate
    Reportable.ISOErrorMessage = null
    if (Reportable.ISOMatchReports.hasMatch(\ m -> m.New)) {
      Reportable.ISOClaim.createActivityFromPattern(Reportable.ISOExposure, ActivityPattern.finder.getActivityPatternByCode("iso_matches"))
    }
    Reportable.ISOKnown = true
  }
  
  /**
   * Called if Successful is true, to add ISOMatchReport entities to the claim/exposure. A new
   * ISOMatchReport entity is created for each match report aggregate in the reply. If the new
   * match report matches an existing report, as determined by matchReportsAreEqual, then the
   * method handleDuplicateMatchReport is called to process the duplicates. Finally the method
   * handleObsoleteMatchReport is called for each match report in the claim/exposure's array 
   * that is not either new or one of the already processed duplicates.
   */
  function addMatchReportRecords() {
    var existingDuplicates = new HashSet<ISOMatchReport>()
    for (matchDetail in Reply.MatchDetailss) {
      var newReport = createMatchReport(matchDetail)
      var matchingExistingReport = Reportable.ISOMatchReports.firstWhere(\ r -> r != newReport and matchReportsAreEqual(r, newReport))
      if (matchingExistingReport != null) {
        handleDuplicateMatchReport(matchingExistingReport, newReport)
        existingDuplicates.add(matchingExistingReport)
      }
    }
    var newMatchReports = Reportable.Bundle.getInsertedBeansOfType(ISOMatchReport).toSet()
    for (matchReport in Reportable.ISOMatchReports) {
      if (not newMatchReports.contains(matchReport) and not existingDuplicates.contains(matchReport)) {
        handleObsoleteMatchReport(matchReport)
      }
    }
  }

  /**
   * Called if Successful is false to update the ISOErrorMessage and ISOReceiveDate fields on
   * the claim/exposure. Also creates a new activity to notify the user that an error has
   * occurred.
   */
  function updateReportableOnErrorStatus() : String {
    var errorMessage = displaykey.Java.Error.ISO.IncorrectStatus("ClaimInvestigationAddRs.MsgStatus",
                                                                 Reply.MsgStatus.MsgStatusCd, 
                                                                 ISOConstants.RESPONSE_STATUS_SUCCESS, 
                                                                 Reply.MsgStatus.MsgStatusDesc)
    Reportable.ISOErrorMessage = errorMessage
    Reportable.ISOReceiveDate = Date.CurrentDate
    var activity = Reportable.ISOClaim.createActivityFromPattern(Reportable.ISOExposure, ActivityPattern.finder.getActivityPatternByCode("iso_matches"))
    activity.Subject = displaykey.Java.Error.ISO.IncorrectStatus.Subject
    activity.Description = errorMessage
    return errorMessage
  }
  
  /**
   * Utility to log the reply message to a file, if message logging is enabled in ISO.properties
   */
  function logReplyMessage() {
    var messageId = RequestId.getMessageId()    
    _isoProperties.MessageLogger.logResponse(messageId, _xml)    
  }

  /**
   * Called to create a new ISOMatchReport entity from the given MatchDetails aggregate. Can be
   * overridden but subclassers would usually override populateMatchReportFromXML which is called
   * from within this method to populate all the simple fields in the match report.
   */
  protected function createMatchReport(matchDetail : MatchDetails) : ISOMatchReport {
    var matchReport = Reportable.addNewISOMatchReport()
    matchReport.ReceivedDate = Date.CurrentDate
    matchReport.DateOfLoss = createDateOfLoss(matchDetail.ClaimsOccurrence.LossDt, matchDetail.ClaimsOccurrence.LossTime)
    var matchReason = getMatchReasons(matchDetail)
    matchReport.MatchReasons = matchReason
    populateMatchReportFromXML(matchReport, matchDetail)
    return matchReport
  }

  /**
   * Called to determine whether two match reports are equal. If you add additional fields to ISOMatchReport
   * you should override this method, call super.matchReportsAreEqual and then add in equality checks for the
   * additional fields.
   */
  protected function matchReportsAreEqual(toFind : ISOMatchReport, report : ISOMatchReport) : boolean {
    return report.DateOfLoss == toFind.DateOfLoss
            and report.MatchReasons == toFind.MatchReasons
            and report.ClaimNumber == toFind.ClaimNumber
            and report.PolicyNumber == toFind.PolicyNumber
            and report.PolicyType == toFind.PolicyType
            and report.InsuringCompany == toFind.InsuringCompany
            and report.InsurerAddress1 == toFind.InsurerAddress1
            and report.InsurerAddress2 == toFind.InsurerAddress2
            and report.InsurerAddress3 == toFind.InsurerAddress3
            and report.InsurerAddressCity == toFind.InsurerAddressCity
            and report.InsurerAddressState == toFind.InsurerAddressState
            and report.InsurerAddressPostalCode == toFind.InsurerAddressPostalCode
            and report.InsurerPhone == toFind.InsurerPhone
  }
  
  /**
   * Called when a new ISO match report matches an existing match report. The default behavior is to update the
   * received date on the existing report and then discard the new report. Subclassers can change this behavior by
   * overriding this method.
   */  
  protected function handleDuplicateMatchReport(oldISOMatchReport : ISOMatchReport, newISOMatchReport : ISOMatchReport) {
    oldISOMatchReport.ReceivedDate = newISOMatchReport.ReceivedDate
    Reportable.Bundle.remove(newISOMatchReport)
  }
  
  /**
   * Called on all match reports which are obsolete - that is they were added when processing a previous reply
   * but do not match any of the new reports for the current reply. The default behavior is to just leave these
   * reports intact but subclassers can change this behavior by overriding this method.
   */  
  protected function handleObsoleteMatchReport(isoMatchReport : ISOMatchReport) {
  }
  
  /**
   * Utility to create a Date object from the LossDt/LossTime fields provided in a MatchDetails aggregate
   */
  protected function createDateOfLoss(date : String, time : String) : Date {
    var dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm")
    if (not date.HasContent) {
      return null 
    }
    var dateTime = date + " " + (time.HasContent ? time : "00.00")
    try {
      return dateFormat.parse(dateTime)
    } catch (e : ParseException) {
      return null
    }
  }

  /**
   * Builds a comma separate list of match reason codes from the list of MatchReasonInfo aggregates in
   * the given MatchDetails aggregate. If the resulting list is too long to fit in the ISOMatchReport
   * MatchReasons field it is truncated.
   */  
  protected function getMatchReasons(matchDetail : xsd.iso.MatchDetails) : String {
    var alreadySeen = new HashSet<java.lang.String>()
    var reasons = new StringBuilder()
    for (matchReasonInfo in matchDetail.MatchReasonInfos) {
      for (matchReasonCd in matchReasonInfo.MatchReasonCds) {
        if (alreadySeen.add(matchReasonCd.Value)) {
          if (reasons.length() > 0) {
            reasons.append(",")
          }
          reasons.append(matchReasonCd.Value)
        }
      }
    }
    var lengthLimit = DataTypes.get(ISOMatchReport.Type.TypeInfo.getProperty("MatchReasons")).asPersistentDataType().Length
    if (reasons.length() > lengthLimit) {
      var lastCommaIndex = reasons.lastIndexOf(",", lengthLimit)
      reasons.setLength(lastCommaIndex >= 0 ? lastCommaIndex : 0);
    }
    return reasons.length() > 0 ? reasons.toString() : null;
  }
  
  /**
   * Utility called to populate the fields in a match report entity from a MatchDetail aggregate. If you add
   * additional fields to ISOMatchReport you should override this method to call super.populateMatchReportFromXML
   * and then add in your additional fields.
   */
  protected function populateMatchReportFromXML(matchReport : ISOMatchReport, matchDetail : xsd.iso.MatchDetails) {
    matchReport.ClaimNumber = matchDetail.ClaimsOccurrence.ItemIdInfo.InsurerId
    matchReport.PolicyNumber = matchDetail.Policy.PolicyNumber
    matchReport.PolicyType = matchDetail.Policy.LOBCd
    var miscParties = matchDetail.Policy.MiscPartys
    if (miscParties.HasElements) {
      var firstMiscParty = miscParties.first()
      var nameInfos = firstMiscParty.GeneralPartyInfo.NameInfos
      matchReport.InsuringCompany = nameInfos.HasElements ? nameInfos[0].Choice.CommlName.CommercialName : null
      var addresses = firstMiscParty.GeneralPartyInfo.Addrs
      var insuredAddress = addresses.HasElements ? addresses[0] : null
      matchReport.InsurerAddress1 = insuredAddress.Addr1
      matchReport.InsurerAddress2 = insuredAddress.Addr2
      matchReport.InsurerAddress3 = insuredAddress.Addr3
      matchReport.InsurerAddressCity = insuredAddress.City
      matchReport.InsurerAddressState = insuredAddress.StateProvCd
      matchReport.InsurerAddressPostalCode = insuredAddress.PostalCode
      var phoneInfos = firstMiscParty.GeneralPartyInfo.Communications.PhoneInfos
      if (phoneInfos.HasElements) {
        matchReport.InsurerPhone = phoneInfos.first().PhoneNumber
      }
    }
  }
}
