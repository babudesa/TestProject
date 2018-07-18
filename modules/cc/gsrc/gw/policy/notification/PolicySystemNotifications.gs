package gw.policy.notification
uses java.util.Map
uses java.util.Collections
uses java.util.ArrayList
uses java.util.HashSet

/**
 * Registry for the available policy system notifications
 */
@ReadOnly
class PolicySystemNotifications {

  /** Map of all notifications, by event name */
  private static var NOTIFICATIONS_BY_EVENT_NAME : Map<String, PolicySystemNotificationBase>
          = Collections.unmodifiableMap(PolicySystemNotificationList.ALL.partitionUniquely(\ n -> n.EventName))

  /**
   * True if a notification is registered for this eventName, false otherwise
   */
  public static function present(eventName : String) : boolean {
    return NOTIFICATIONS_BY_EVENT_NAME.containsKey(eventName)
  }
  
  /**
   * Return the notification registered for this eventName, or null
   */
  public static function get(eventName : String) : PolicySystemNotificationBase {
    return NOTIFICATIONS_BY_EVENT_NAME.get(eventName)
  }
  
  /**
   * Used if the policy system notification destination is resynced. For each
   * pending message, consults the corresponding notification and optionally
   * creates a copy. If the notification's message resync behavior is COPY_LAST
   * then only one pending message corresponding to that notification will be
   * copied (the last one, by send order)
   */
  public static function resync(messageContext : MessageContext) {
    var pendingNotificationMessages = messageContext.PendingMessages
        .orderByDescending(\ m -> m.SendOrder)
    var alreadyCopied = new HashSet<String>()
    var messagesToCopy = new ArrayList<Message>(pendingNotificationMessages.Count)
    for (pendingMessage in pendingNotificationMessages) {
      var event = pendingMessage.EventName
      if (present(event) and not alreadyCopied.contains(event)) {
        var notification = get(pendingMessage.EventName)
        if (notification.MessageResyncBehavior != DROP) {
          messagesToCopy.add(pendingMessage)
          if (notification.MessageResyncBehavior == COPY_LAST) {
            alreadyCopied.add(event)
          }
        }
      }
    }
    for (pendingMessage in messagesToCopy.reverse()) {
      messageContext.createMessage(pendingMessage)
    }
  }
  
  /** Never instantiated */
  private construct() {}

}
