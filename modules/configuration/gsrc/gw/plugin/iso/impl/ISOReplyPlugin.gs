package gw.plugin.iso.impl

uses gw.plugin.messaging.MessageFinder
uses com.guidewire.pl.system.server.InitTab
uses com.guidewire.pl.plugin.PluginCallbackHandler
uses gw.plugin.iso.ISOBadReplyException
uses gw.api.iso.ISOProperties
uses gw.api.iso.ISOReply
uses java.lang.Throwable
uses gw.plugin.iso.IISOReplyPlugin
uses javax.servlet.http.HttpServletRequest
uses gw.api.system.server.Runlevel
uses gw.api.iso.ISOConstants
uses com.gaic.claims.util.messagequeue.MessageQueueAlertAPI
uses com.gaic.claims.util.messagequeue.alert.AlertType
uses gw.api.database.Query
uses java.lang.Exception


/**
 * Used by the ISOReceive servlet to handle asynchronous replies from ISO. The
 * replies are typically stored as documents on the relevant claim/exposure
 * and may contain match reports which are added to the match report array
 * on the claim/exposure.
 */
@Export
class ISOReplyPlugin implements IISOReplyPlugin {

  /** Used to look up messages by id */
  var _messageFinder : MessageFinder
  private var _messageQueueAlertAPI = new MessageQueueAlertAPI()
  
  /**
   * Provides a context for executing as the appropriate user, and with a bundle
   * for committing changes
   */
  var _callbackHandler : PluginCallbackHandler
  
  /** Logger, for logging debug and error messages */
  var _logger = ISOProperties.LOGGER
  

  /**
   * Standard MessageReply method, called by messaging infrastructure to
   * initialize the plugin
   */
  override function initTools(callBackHandler: PluginCallbackHandler, messageFinder: MessageFinder) : void {
    _messageFinder = messageFinder
    _callbackHandler = callBackHandler;
  }
  
  /** Standard MessagePlugin method, does nothing in this case */
  override function resume() {}
  
  /** Standard MessagePlugin method, does nothing in this case */
  override function setDestinationID(i : int){}
  
  /** Standard MessagePlugin method, does nothing in this case */
  override function shutdown() {}
  
  /** Sends out an email when the queue is suspended*/

  override function suspend() {
  var environment = gw.api.system.server.ServerUtil.getEnv()
  	if(environment != "local"){
    	_messageQueueAlertAPI.sendQueueSuspendedAlert("Send to ISO", AlertType.EMAIL)  
    }   
  }
  
  /**
   * Called by ISO receive servlet to do an initial sanity check on the
   * incoming HTTP request. Throws ISOBadReplyException if the request
   * cannot be handled
   */
  @Throws(ISOBadReplyException, "")
  override function sanityCheck(httpRequest: HttpServletRequest) {
    checkServerIsUp()
    checkSecureConnection(httpRequest)
    checkRequestHasXMLParameter(httpRequest)
  }

  /**
   * The main interface; parse and process an XML reply from ISO. This
   * typically involves creating a document and extracting out any match
   * reports. Most of the work is handled by the ISOReply object.
   * <p>
   * The implementation of this particular method is mainly concerned
   * with using the callback handler to call handleISOReplyInTransaction
   * in the proper context. See handleISOReplyInTransaction for details
   * of creating and processing the ISOReply object.
   */
  @Throws(ISOBadReplyException, "")
  override function handleISOReply(xml : String) {
    try {
      _callbackHandler.execute(\ -> { handleISOReplyInTransaction(xml) })
    } catch( t : Throwable ) {
      var cause = t.getCauseOfType(ISOBadReplyException)
      throw cause == null ? t : cause
    }
  }

  /**
   * Called after sending a key field update, after a configurable timeout. If
   * no reply has come from ISO in the intervening time then the key field
   * update is deemed to have succeeded. This is an unsatisfactory protocol, but
   * ISO do not send any confirmation that a key field update has succeeded.
   */    
  override function handleKeyFieldUpdateSucceeded(messageId : int) {
    _callbackHandler.execute(\ ->{
      if (_logger.DebugEnabled) {
        _logger.debug(displaykey.Java.Logger.ISO.Message.Transport.KeyFieldUpdateTimedOut(messageId))
      }
      try {
        var message = _messageFinder.findById(messageId)
        if (message.AckCount == 0) {
          // We only send key field updates if ISOKnown is true, so there is no need to set ISOKnown here
          if (_logger.DebugEnabled) {
            _logger.debug(displaykey.Java.Logger.ISO.Message.Transport.AcknowledgingKeyFieldUpdate(messageId))
          }
          message.reportAck()
        } else {
          if (_logger.DebugEnabled) {
            _logger.debug(displaykey.Java.Logger.ISO.Message.Transport.KeyFieldUpdateAlreadyAcknowledged(messageId))
          }
        }
      } catch (e) {
        _logger.error(displaykey.Java.Logger.ISO.Message.Transport.KeyFieldUpdateAckFailed(messageId))
      }
    })
  }  
  
  /** Sanity check - server must be running at NODAEMONS level or higher */
  @Throws(ISOBadReplyException, "")
  private function checkServerIsUp() {
    if (InitTab.getInstance().getRunLevel().isEarlier(Runlevel.NODAEMONS)) {
      throw new ISOBadReplyException("ClaimCenter server is not running", null, true)
    }
  }

  /**
   * Sanity check - if ISOProperties specify that a secure connection is required
   * then ensure that the request is secure
   */
  @Throws(ISOBadReplyException, "")
  private function checkSecureConnection(httpRequest: HttpServletRequest) {
    if (ISOProperties.instance().getRequireSecureReceive() && !httpRequest.isSecure()) {
      throw new ISOBadReplyException(displaykey.Java.Error.ISO.ConnectionNotSecure, null)
    }
  }

  /**
   * Sanity check - ensure the incoming HTTP request has a parameter with the
   * expected name
   */
  @Throws(ISOBadReplyException, "If the parameter is empty")
  private function checkRequestHasXMLParameter(httpRequest: HttpServletRequest) {
    var parameterName = ISOConstants.HTTP_REPLY_XML_PARAMETER_NAME
    var xml = httpRequest.getParameter(parameterName)
    if (not xml.HasContent) {
      throw new ISOBadReplyException(displaykey.Java.Error.ISO.NoXMLParam(parameterName), null);
    }
  }

  /**
   * The main work of handleISOReply - creates the ISOReply object and uses
   * it to update the associated claim or exposure. Finally, acks the message
   */
  @Throws(ISOBadReplyException, "If the XML cannot be parsed or contains an invalid RqUID or customer password")
  private function handleISOReplyInTransaction(xml : String) {
    var reply = new ISOReply(xml)
    reply.logReplyMessage() 
    var errorMessage : String = null
    if (reply.Applicable) {
      if (reply.Successful) {
        reply.addReplyAsDocument()
        reply.addMatchReportRecords()
        reply.updateReportableOnSuccess()
        // Turned on for Medicare Ingestion Project delivery in MR92 release. 
        reply.createCMSErrorActivity()
      } else {
        errorMessage = reply.updateReportableOnErrorStatus()
      }
    } else {
      // Claim/exposure has been purged or archived, so cannot be updated
    }
    ackMessage(reply.RequestId.MessageId, errorMessage)
  }

  /**
   * Acknowledge the original message sent from ClaimCenter to ISO, if it
   * has not been acknowledged already
   */
  private function ackMessage(messageId : int, error : String) : void {
    if (_logger.DebugEnabled) {
      _logger.debug("Acknowledging message " + messageId + " error = " + error)
    }
    var message = _messageFinder.findById(messageId)
    if (message != null && message.AckCount == 0 && error == null) {

        message.reportAck()
        return
    }else{      
      
      if(message != null){

        message.safeSetErrorDescription(error)  
        message.reportNonRetryableError()    
      }
      
      if(error == null || (!(error.contains("UF0001") || error.contains("UF0010")))){
        _messageQueueAlertAPI.sendQueueErrorAlert(message, "Send To ISO", AlertType.EMAIL)
      }else{      
        try{
          handleISOError(messageId, message, error)
        }catch(ex){
          _logger.error("Exception while attempting to handle failure for ISO message " + message.PublicID + ": " + ex.Message)
          ex.printStackTrace()           
        }                                                                                                                            
      }
    }
  }
  
  /**
   * Attempt to handle certain types of ISO errors that are predictable.
   * Steps:
   *   1) Finds the claim for the given message based on ClaimNumber and adds it to the current transaction
   *   2) Sets the ISOKnown flag depending on the error code
   *   3) Skips the current message and any necessary messages that might prevent the newly generated message from sending properly
   *   4) Sets the ISOStatus to ResendPending to generate a new message
   */
  private function handleISOError(messageID : int, message : Message, error : String) {
    var newMessage : Message
    var claim : Claim
    if(message == null){
      //message was already acked - find the history message to get relevant info
      var messageHist = Query.make(MessageHistory).compare("OrigMsgId", Equals, messageID)
                                                  .select()
                                                  .AtMostOneRow
                                                  
      claim = gw.transaction.Transaction.getCurrent().loadByKey(messageHist.Claim.ID) as Claim
      
      if(getRepairMessageCount(claim) > 2){
        return //a gauche way of limiting the number of repair messages to 3, to prevent sending thousands
      }
      
      if(messageHist.MessageCode == "ISOMessageRepaired"){
        throw new Exception("Cannot repair a repair message. Please resolve manually.") 
      }
                                              
      newMessage = buildRepairMessage(messageHist.Payload, messageHist.EventName, messageHist.Claim)      
    }else{
      claim = message.Claim
      
      if(getRepairMessageCount(claim) > 2){
        return //a gauche way of limiting the number of repair messages to 3, to prevent sending thousands
      }
      
      newMessage = buildRepairMessage(message.Payload, message.EventName, message.Claim)
    }
    
    
    
    var isoAcord = xsd.iso.req.ACORD.parse(newMessage.Payload)
    var addRequest = isoAcord.ACORDREQ.ClaimsSvcRqs[0].CLAIMSSVCRQMSGSs[0].Choice.ClaimInvestigationAddRq
                                 
    if(error.contains("UF0001")){  //Duplicate Error - Claim.ISOKnown is false when it really should be true
      //claim.ISOKnown = true
      if(addRequest.ReplacementInd != null){
        addRequest.ReplacementInd = ISOConstants.TRUE
      }
    }else if(error.contains("UF0010")){  //Initial Claim Not Found Error - Claim.ISOKnown is true when it really should be false
      //claim.ISOKnown = false
      if(addRequest.ReplacementInd != null){
        addRequest.ReplacementInd = ISOConstants.FALSE
      }      
    }
    
    //re-assign the modified addRequest to the isoAcord object
    newMessage.Payload = isoAcord.asUTFString()
    
    for(m in getMessagesToSkip(claim)) {
      m = gw.transaction.Transaction.getCurrent().add(m)
      m.skip()
    }
    
    //null out the existing error message
    claim.ISOErrorMessage = null
  }
  
  private function buildRepairMessage(payload : String, eventName : String, reportable : ISOReportable) : Message{
    var msg : Message = new Message()
    msg.setFieldValue("EventName", eventName)
    msg.setFieldValue("DestinationID", 10)
    msg.Payload = payload
    msg.MessageCode = "ISOMessageRepaired"
    msg.MessageRoot = reportable
    return msg
  }
  
  
  /**
   * Finds messages for Destination 10 for the given claim. Excludes KeyFieldUpdates, as these should not be skipped.
   */
  private function getMessagesToSkip(claim : Claim) : Message[]{
        return Query.make(entity.Message)
                    .compare("Claim", Equals, claim)
                    .compare("DestinationID", Equals, 10) //only get messages for Send To ISO destination
                    .compare("MessageCode", NotEquals, "KeyFieldUpdate") //do not get key field updates, as we do not want to skip those
                    .select()
                    .orderBy(\ m -> m.SendOrder)
                    .toTypedArray()
  }
  
  private function getRepairMessageCount(claim : Claim) : int{
    return Query.make(entity.MessageHistory) 
                .compare("Claim", Equals, claim)
                .compare("DestinationID", Equals, 10)
                .compare("MessageCode", Equals, "ISOMessageRepaired")
                .select()
                .Count
  }

}
