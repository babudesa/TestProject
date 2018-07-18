package examples.plugins.messaging;

/**
 * Listener interface used to register with the QueueSimulator
 * for notifications when a message is posted to the queue.
 */
public interface QueueListener {

  /**
   * Called on the QueueSimulator's dispatch thread when a message
   * is posted to the queue.
   *
   * @param messageID the ID of the message that was added to the queue
   */
  void responseReceived(int messageID);
}