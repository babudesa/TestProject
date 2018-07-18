package gw.plugin.iso.impl
uses gw.plugin.messaging.MessageTransport
uses gw.api.iso.ISOProperties

uses java.lang.Exception
uses java.util.Timer
uses gw.api.iso.ISOCommunicationException
uses gw.api.iso.ISOSend
uses gw.util.concurrent.LazyVar
uses gw.plugin.iso.ISOBadReplyException
uses java.util.TimerTask
uses java.lang.Thread
uses gw.plugin.Plugins
uses gw.plugin.iso.IISOReplyPlugin
uses gw.api.iso.ISOConstants
uses gw.api.iso.ISOPreparePayload
uses com.gaic.claims.util.messagequeue.MessageQueueAlertAPI
uses com.gaic.claims.util.messagequeue.alert.AlertType


/**
 * Called to send ISO messages to the ISO server and to parse the synchronous
 * reply (or "receipt") returned by ISO.
 */
class ISOTransportPlugin implements MessageTransport  {
  
  var _preparePayload = new ISOPreparePayload()
  private var _messageQueueAlertAPI = new MessageQueueAlertAPI()

  /**
   * Simple task used to time key field update requests; if we don't get an
   * error back from ISO in the timeout period we assume success.
   */
  static class KeyFieldUpdateTimerTask extends TimerTask {

    var _messageId : int
    
    construct(messageId : int) {
      _messageId = messageId
    }
    
    override function run() {
      Thread.currentThread().setName("ISO Key Field Update Timeout")
      gw.plugin.Plugins.get(IISOReplyPlugin).handleKeyFieldUpdateSucceeded(_messageId)
    }
  }
  
  /** ISOSend encapsulates the ISO SOAP service */
  var _send = new ISOSend()
  
  /** The ISO properties */
  var _properties : ISOProperties
  
  /** Timer, used to time key field update requests */
  var _timeoutTimer = LazyVar.make(\ -> new Timer())
  
  /** Logger, for error, warning and debug messages */
  var _logger = ISOProperties.LOGGER

  /**
   * Initialize plugin, read ISO properties
   */
  construct() {
    _properties = ISOProperties.instance()
  }

  /** Standard MessagePlugin method, does nothing in this case */
  override function setDestinationID(id : int) {}

  /** Standard MessagePlugin method, does nothing in this case */
  override function shutdown() {}

  /** Standard MessagePlugin method, does nothing in this case */
  override function suspend() {}

  /** Standard MessagePlugin method, refreshes ISO properties */
  override function resume() {
    _properties = ISOProperties.instance(true)
  }

  /**
   * The main method of this plugin, sends the message payload (after it
   * has been modified by ISOPreparePayload) to ISO. Usually the modified
   * payload is sent to ISO using the ISOSend object, which sends it to ISO
   * via SOAP and then checks the returned "receipt" message to ensure that
   * ISO accepted the request. The message is then in pending state, and we
   * wait for ISO to send an asynchronous response containing any match reports
   * (or, possibly, errors).
   * <p>
   * Special cases:
   * <ul>
   * <li>Key field update requests are sent to ISO as normal, but ISO will only
   *     reply if there is an error. So after successfully sending a key field
   *     update request we set up a timer; if the timer expires before we hear
   *     anything from ISO we assume success.
   * <li>If the claim/exposure we are sending this message about is not known
   *     to ISO, and the message is a key field update, then we do nothing. Key
   *     field updates notify ISO of a key field change in a known claim/exposure
   *     so there is no point in sending a key field update if the claim/exposure
   *     is not known.
   * <li>In some cases we don't expect a reply from ISO. In such a case we ack
   *     a successful request immediately (see sendSucceeded for more details)
   * <li>If the send fails or the receipt is bad then we do one of the following:
   *     <ul>
   *     <li>throw an exception (for retryable errors). The messaging system
   *         will retry automatically
   *     <li>mark the message as being in the error state. This will block
   *         further ISO requests for the claim until the message is manually
   *         skipped or retried
   *     </ul>
   * </ul>
   */
  @Throws(Exception, "")
  override function send(message : Message, transformedPayload : String) {
    var messageID = message.ID.Value
    try {
      if (!isReportableKnownToISO(message) && isKeyFieldUpdate(message)){
        if (_logger.DebugEnabled) {
          _logger.debug( displaykey.Java.Logger.ISO.Message.Transport.SkipKeyFieldUpdate(messageID))
        }
        message.reportAck()
      } else {
        var payloadState = _preparePayload.preparePayload(message, _properties)
        if (_logger.isDebugEnabled()) {
          _logger.debug(displaykey.Java.Logger.ISO.Message.Transport.SendMessage(messageID));
        }
        _send.send(messageID, payloadState.Payload, _properties) 
        sendSucceeded(message, payloadState.SuppressMatches);
      }
    } catch (e : ISOCommunicationException) {
      sendFailed(message, e, e.Retryable)
    } catch (ex : ISOBadReplyException) {
      sendFailed(message, ex, false)
    }
  }
  
  /**
   * Called after a successful send to ISO (ISO received the message and
   * returned a good receipt). Normally does nothing but there are some
   * special cases:
   * <ul>
   * <li>If we know ISO won't be replying asynchronously (determined by
   *     looking at the ISO properties "ISO.ExpectReplies" property) then
   *     we ack immediately
   * <li>For key field update requests ISO only sends a response if there
   *     is an error. So in this case we set up a timer; if we don't hear
   *     from ISO before the timer expires then assume the message succeeded
   *     and we ack it. This is horrible and error prone, but is just the
   *     way the ISO protocol works
   * </ul>
   */
  private function sendSucceeded(message : Message, suppressMatches : boolean) {
    if (suppressMatches or !_properties.shouldExpectResponses()) {
      // Have explicitly requested no matches or are in test mode, just logging
      // messages or checking them for validity
      ackRequestImmediately(message)
    } else if (isKeyFieldUpdate(message)) {
      setSuccessTimeout(message.ID.Value)
    }
  }
  
  /**
   * Called by sendSucceeded if we need to ack the ISO request immediately.
   */
  private function ackRequestImmediately(message : Message) {
    if (_logger.isDebugEnabled()) {
      _logger.debug(displaykey.Java.Logger.ISO.Message.Transport.NoResponseExpected(message.ID))
    }
    message.reportAck()
    var reportable = getReportable(message)
    if (reportable != null) {
      reportable.ISOKnown = true
    }
  }

  /**
   * Called by sendSucceeded to set up a "success timout" if we just sent a
   * key field update.
   */
  private function setSuccessTimeout(messageId : int) {
    var seconds = _properties.getKeyFieldUpdateTimeout()
    _logger.debug(displaykey.Java.Logger.ISO.Message.Transport.ScheduleKeyFieldUpdateTimer(messageId, seconds))
    TimeoutTimer.schedule(new KeyFieldUpdateTimerTask(messageId), (seconds * 1000) as long)
  }
  
  /**
   * Called if the send to ISO failed. Saves the error message on the message
   * object and then either throws the exception (for retryable errors) or
   * reports a non retryable error on the message object.
   */
  private function sendFailed(msg : Message, exception : Exception, retryable: boolean) {
    _logger.debug(displaykey.Java.Logger.ISO.Message.Transport.SendFailed(msg.ID));
    var errorMessage = exception.LocalizedMessage
    msg.safeSetErrorDescription(errorMessage)
    if (retryable) {
      _logger.debug(displaykey.Java.Logger.ISO.Message.Transport.RetryableCommunicationException(errorMessage));
     //_messageQueueAlertAPI.sendQueueErrorAlert(msg, "Send To ISO", AlertType.EMAIL)
      throw exception
    } else {
      _logger.debug(displaykey.Java.Logger.ISO.Message.Transport.NonRetryableCommunicationException(msg.ID, errorMessage));
      msg.reportNonRetryableError()
      _messageQueueAlertAPI.sendQueueErrorAlert(msg, "Send To ISO", AlertType.EMAIL)
    }
  }

  /**
   * The timer we use to time key field update requests. Lazily created as
   * necessary.
   */
  private property get TimeoutTimer() : Timer {
    return _timeoutTimer.get()
  }
  
  /**
   * Check if the given message is a key field update request (as opposed to
   * the more usual claim search request)
   */
  private function isKeyFieldUpdate(message : Message) : boolean {
    return ISOConstants.KEY_FIELD_UPDATE_MESSAGE_CODE == message.MessageCode
  }
  
  /**
   * Is the ISO reportable (claim or exposure) associated with this message
   * already known to ISO? By the time we call this method we can be sure that
   * any previous messages to ISO for this claim have been processed, because
   * the messaging system serializes ISO message processing per claim (this is
   * a standard feature of the messaging system)
   */
  private function isReportableKnownToISO(message : Message) : boolean {
    var reportable = getReportable(message)
    return reportable.ISOKnown 
  }
  
  /**
   * Returns the ISO reportable (claim or exposure) associated with the message
   */
  private function getReportable(message : Message) : ISOReportable {
    return message.MessageRoot as entity.ISOReportable
  }
}