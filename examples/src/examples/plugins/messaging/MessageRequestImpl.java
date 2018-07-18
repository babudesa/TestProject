package examples.plugins.messaging;

import com.guidewire.cc.external.entity.Message;
import com.guidewire.cc.plugin.messaging.MessageRequest;

import java.util.Map;


/**
 * Sample implementation of the MessageRequest plugin interface.
 */
public class MessageRequestImpl implements MessageRequest {

  public String beforeSend(Message message) {
    return message.getPayload();
  }

  public void afterSend(Message message) {
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