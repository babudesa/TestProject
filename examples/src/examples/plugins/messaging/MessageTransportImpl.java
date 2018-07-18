package examples.plugins.messaging;


import com.guidewire.cc.external.entity.Message;
import com.guidewire.cc.plugin.messaging.MessageTransport;
import com.guidewire.logging.LoggerCategory;

import java.util.Map;

/**
 * Sample implementation of the MessageTransport plugin interface
 * that shows how to post messages to an asynchronous transport
 * queue.
 */
public class MessageTransportImpl implements MessageTransport {

  public static final LoggerCategory _logger = new LoggerCategory(LoggerCategory.MESSAGING, "examples");

  public void send(Message message, String transformedPayload) {
    _logger.info("Received (" + message.getID() + "): " + transformedPayload);
    QueueSimulator.getInstance().put(message);
  }

  public void shutdown() {
  }

  public void suspend() {
  }

  public void resume() {
  }

  public void setParameters(Map params) {
  }

  public void setDestinationID(int destinationID) {
  }
}