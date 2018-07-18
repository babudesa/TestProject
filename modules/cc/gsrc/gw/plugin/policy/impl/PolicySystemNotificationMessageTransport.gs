package gw.plugin.policy.impl
uses gw.plugin.messaging.MessageTransport
uses gw.plugin.Plugins
uses gw.plugin.policy.IPolicySystemNotificationPlugin
uses gw.plugin.policy.PolicySystemRetryableException
uses gw.plugin.policy.PolicySystemAlreadyExecutedException
uses gw.policy.notification.PolicySystemNotificationBase
uses gw.policy.notification.PolicySystemNotifications

/**
 * Message transport for reliable delivery of notifications to Policy System. The
 * different types of notification are identified by their event name. The full
 * notification process is as follows:
 * <ul>
 * <li>The code that identifies the notification condition creates an event
 * <li>Event messaging rules detect the event and add a message for this transport
 * <li>This transport reads the message and calls the appropriate
 *     IPolicySystemNotificationPlugin method to actually deliver the notification
 *     to the policy system.
 * </ul>
 * This transport plugin uses the event name to look up a PolicySystemNotification
 * strategy object, and then calls the object's send and afterSend methods to
 * actually contact the policy system.
 */
@ReadOnly
class PolicySystemNotificationMessageTransport implements MessageTransport {

  var logger = gw.api.util.Logger.forCategory("Messaging.PolicySystemNotificationMessageTransport")
  
  construct() {}

  override function send(message : Message, transformedPayload : String) {
    logger.debug("Policy system notification: ${message.EventName}:${message.Claim}"
            + " <order=${message.SendOrder} created=${message.CreationTime}>")
    var status : PolicySystemNotificationBase.MessageStatus = GOOD
    var notification = PolicySystemNotifications.get(message.EventName)
    if (notification != null) {
      try {
        notification.send(NotificationPlugin, message, transformedPayload)        
        message.reportAck()
      } catch (e : PolicySystemRetryableException) {
        message.safeSetErrorDescription(e.Message)
        message.reportError()
        status = RETRYABLE_ERROR
      } catch (e : PolicySystemAlreadyExecutedException) {
        message.reportAck()
      } catch (e) {
        logger.error("Policy System Notification Error", e)
        message.safeSetErrorDescription(e.Message)
        message.reportNonRetryableError()
        status = NON_RETRYABLE_ERROR
      }
      notification.afterSend(message, status)
    } else {
      var error = "Unknown policy system notification event: " + message.EventName
      logger.error(error)
      message.safeSetErrorDescription(error)
      message.reportNonRetryableError()
    }
  }

  override function shutdown() {}

  override function resume() {}

  override function suspend() {}

  override function setDestinationID(id : int) {}
  
  private property get NotificationPlugin() : IPolicySystemNotificationPlugin {
    return Plugins.get(IPolicySystemNotificationPlugin)
  }
}
