package gw.api.iso
uses gw.plugin.iso.ISOBadReplyException

/**
 * Parses the initial synchronous reply or "receipt" returned by ISO in response to a search
 * or key field update request. Provides the ensureAccepted utility to verify that all the status
 * fields in the receipt are set correctly.
 */
@Export
class ISOReceiptBase  {

  var _xml : String
  
  /** The parsed receipt */
  var _receipt : xsd.iso.ACORD as readonly Receipt
  
  /**
   * Create a new ISOReceipt from the given XML string
   */
  construct(xml : String) {
    _xml = xml
    _receipt = xsd.iso.ACORD.parse(xml)  
  }
  

  /**
   * Verify that the receipt could be parsed correctly and that all the status codes indicate that
   * the message was accepted by ISO. Any failure results in an ISOBadReplyException being thrown
   */  
  @Throws(ISOBadReplyException, "If response does not contain valid status code.")
  public function ensureAccepted() {
    ensureParsed()
    checkXMLStatus()
    checkAuthenticationStatus()
    checkClaimStatus()
    checkClaimMessage()
  }
  
  /**
   * Called by ensureAccepted to verify that the receipt was parsed. Throws an ISOBadReplyException
   * with the bad XML string if parsing failed.
   */
  protected function ensureParsed() {
    if (Receipt == null) {
      throw new ISOBadReplyException(displaykey.Java.Error.ISO.BadXML + _xml)
    }
  }
  
  /**
   * Called by ensureAccepted to verify that the top level status code is correct. Throws an
   * ISOBadReplyException explaining the problem if the code is incorrect.
   */
  protected function checkXMLStatus() {
    ensureStatusValid("Status", Receipt.ACORDRSP.Status.StatusCd.Text, ISOConstants.RECEIPT_STATUS_CODE_OK,
                  Receipt.ACORDRSP.Status.StatusDesc.Text)
  }
  
  /**
   * Called by ensureAccepted to verify that the SignonRs status code is correct. Throws an
   * ISOBadReplyException explaining the problem if the code is incorrect.
   */
  protected function checkAuthenticationStatus() {
    ensureStatusValid("SignonRs.Status", Receipt.ACORDRSP.SignonRs.Status.StatusCd.Text, ISOConstants.RECEIPT_STATUS_CODE_OK,
                  Receipt.ACORDRSP.SignonRs.Status.StatusDesc.Text)
  }
  
  /**
   * Called by ensureAccepted to verify that the ClaimsSvcRs status code is correct. Throws an
   * ISOBadReplyException explaining the problem if the code is incorrect.
   */
  protected function checkClaimStatus() {
    ensureStatusValid("ClaimsSvcRs.Status", Receipt.ACORDRSP.ClaimsSvcRss[0].Status.StatusCd.Text, ISOConstants.RECEIPT_STATUS_CODE_OK,
                  Receipt.ACORDRSP.ClaimsSvcRss[0].Status.StatusDesc.Text)
  }
  
  /**
   * Called by ensureAccepted to verify that the ClaimInvestigationAddRs message status code is
   * correct. Throws an ISOBadReplyException explaining the problem if the code is incorrect.
   */
  protected function checkClaimMessage() {
    ensureStatusValid("ClaimInvestigationAddRs.MsgStatus", 
                      Receipt.ACORDRSP.ClaimsSvcRss[0].CLAIMSSVCRSMSGSs[0].Choice.ClaimInvestigationAddRs.MsgStatus.MsgStatusCd, 
                      ISOConstants.RECEIPT_STATUS_RESPONSE_PENDING,
                      Receipt.ACORDRSP.ClaimsSvcRss[0].CLAIMSSVCRSMSGSs[0].Choice.ClaimInvestigationAddRs.MsgStatus.MsgStatusDesc)
  }
  
  /**
   * Utility method used by all the checks which verify that a status code has a particular expected
   * value. The parameters are the path to the status code, the code's value, the expected value and
   * the description of the problem given in the status description field.
   */
  @Throws(ISOBadReplyException, "If the status code is not as expected")
  protected function ensureStatusValid(path : String, code : String, expectedCode : String, description : String) {
    if (!code.equalsIgnoreCase(expectedCode)) {
      throw new ISOBadReplyException(displaykey.Java.Error.ISO.IncorrectStatus(path, code, expectedCode, description))      
    }
  }
}

