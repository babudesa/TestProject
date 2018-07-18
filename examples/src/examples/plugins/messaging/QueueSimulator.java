package examples.plugins.messaging;

import com.guidewire.cc.external.entity.Message;

import java.util.List;
import java.util.ArrayList;

/**
 * Simulates an asynchronous message queue for testing the sample
 * {@link MessageTransportImpl} and {@link MessageReplyImpl} plugins.
 * The {@link MessageReplyImpl} instance registers a listener with the
 * queue using {@link #listen(QueueListener)} which is invoked when a
 * message is added to the queue.  QueueSimulator maintains its own
 * dispatch thread which is used to invoke the listener, accurately
 * simulating a true asynchronous message queue.
 *
 * @author jseybold
 * @noinspection EmptyCatchBlock
 */
public class QueueSimulator {
  private static QueueSimulator _instance;
  private List _messages;
  private QueueListener _listener;
  private boolean _shutdown;

  /**
   * Returns the singleton instance of the QueueSimulator
   */
  public static synchronized QueueSimulator getInstance() {
    if (_instance == null) {
      _instance = new QueueSimulator();
    }
    return _instance;
  }

  private QueueSimulator() {
    _messages = new ArrayList();
    _shutdown = false;
    new Worker().start();

  }

  /**
   * Add a message to the queue.  The {@link QueueListener} registered
   * with the queue will be notified asynchronously on the QueueSimulator's thread.
   */
  public synchronized void put(Message message) {
    _messages.add(message);
    notifyAll();
  }

  /**
   * Blocks until the queue is empty.  Useful for testing; the listener
   * is invoked inside the synchronized region, so the caller can rely
   * on the queue being empty and all listener work being completed
   * when this method returns.
   */
  public synchronized void waitUntilEmpty() {
    while (!_messages.isEmpty()) {
      try {
        wait();
      } catch (InterruptedException e) {
      }
    }
  }

  /**
   * Register a {@link QueueListener} for notifications when a message
   * is added to the queue.
   */
  public void listen(QueueListener listener) {
    _listener = listener;
  }

  /**
   * Dispatch thread for the QueueSimulator that waits until messages
   * are added to the queue.  When notified, it empties the queue,
   * calling the listener's responseReceived() method for each message.
   */
  private class Worker extends Thread {
    public void run() {
      while (!_shutdown) {
        synchronized (_instance) {
          while (_messages.isEmpty()) {
            try {
              _instance.wait();
            } catch (InterruptedException e) {
            }
          }

          // Run listener inside the synch block so that listener's work
          // is done when waitUntilEmpty() returns.  You wouldn't do this for real...
          Message message = (Message) _messages.remove(0);
          _listener.responseReceived(message.getID().getValue());
          _instance.notifyAll();
        }
      }
    }
  }
}