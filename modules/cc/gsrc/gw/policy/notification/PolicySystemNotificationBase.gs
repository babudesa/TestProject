package gw.policy.notification
uses gw.plugin.policy.IPolicySystemNotificationPlugin

/**
 * A policy system notification is a call to the policy system to let it know of
 * a change in ClaimCenter. Notifications are delivered via the messaging system,
 * to ensure reliability. The details of the policy system are encapsulated in
 * a plugin, IPolicySystemNotificationPlugin. The internals of the plugin
 * typically deliver the notifications via a distribution layer such as SOAP.
 * <p>
 * The full notification process is as follows:
 * <ul>
 * <li>The code that identifies the notification condition creates an event
 * <li>Event messaging rules detect the event and add a message for the transport
 *     (PolicySystemNotificationMessageTransport)
 * <li>The transport reads the message and calls the appropriate
 *     IPolicySystemNotificationPlugin method to actually deliver the notification
 *     to the policy system.
 * </ul>
 * This class is an abstract superclass to help build notifications. It is a
 * strategy pattern; the event messaging and transport code call into instances
 * of PolicySystemNotificationBase to do notification specific work
 */
@ReadOnly
abstract class PolicySystemNotificationBase {

  /** Status of a notification message after it has been sent */
  public enum MessageStatus {GOOD, RETRYABLE_ERROR, NON_RETRYABLE_ERROR}

  /**
   * Describes what to do if a ClaimResync event is raised
   */
  public enum MessageResyncBehavior {DROP, COPY_ALL, COPY_LAST}

  /** The event name used for this notification */
  private var _eventName : String as readonly EventName

  /**
   * Create new notification. Notifications should be singletons
   * @param inEventName the event name for this notification
   */
  protected construct(inEventName : String) {
    _eventName = inEventName
  }
  
  /** 
   * Called by the event messaging rules if an event with name EventName is
   * raised. Should, if appropriate, create a message using the provided
   * context
   * @param context the message context, used to create the message
   */
  abstract function createMessage(context : MessageContext)

  /**
   * Called by the PolicySystemNotificationMessageTransport to send the
   * notification. Typically extracts any necessary information from the
   * message and payload, then calls a method on the plugin.
   * @param plugin the plugin for communicating with the policy system
   * @param message the message
   * @param transformedPayload the payload of the message which may have
   *   been modified by a request plugin. In the normal configuration the
   *   transformedPayload will just be the message.Payload, though the
   *   system could be configured to call a request plugin which would
   *   transform the payload in some way.
   */
  abstract function send(
          plugin : IPolicySystemNotificationPlugin,
          message : Message,
          transformedPayload : String)

  /**
   * Called by the PolicySystemNotificationMessageTransport after send
   * has been called and any error handling has taken place. The status
   * parameter gives the current status of the message. The default
   * implementation is empty, but subclasser can override to do any
   * necessary clean up
   * @param message the message, which may now be acked or in an error state
   * @param status the status of the message
   */
  function afterSend(
          message : Message,
          status : MessageStatus) {
  }
  
  /**
   * Describes what to do if a ClaimResync event is raised and there are pending
   * messages for this notification:
   * <ul>
   * <li>DROP - just drop the messages
   * <li>COPY_ALL - copy all the messages
   * <li>COPY_LAST - copy just the last message (by send order)
   * </ul>
   */
  property get MessageResyncBehavior() : MessageResyncBehavior {
    return COPY_ALL
  }

}
