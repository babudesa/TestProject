package examples.plugins.messaging;

import com.guidewire.cc.external.entity.Message;
import com.guidewire.cc.plugin.messaging.MessageTransport;

import java.util.Map;

/**
 * Sample implementation of the MessageTransport plugin interface
 * that just prints message payloads and method invocations to the console.
 */
public class ConsoleMessageTransport implements MessageTransport {

  int _destinationID;

  public void send(Message message, String transformedPayload) {
    System.out.println("Destination " + _destinationID + " SEND (Msg ID = " + message.getID() + " Payload = \"" + transformedPayload + "\")");
    message.reportAck();
  }

  public void shutdown() {
    System.out.println("Destination " + _destinationID + " SHUTDOWN");
  }

  public void suspend() {
    System.out.println("Destination " + _destinationID + " SUSPEND");
  }

  public void resume() {
    System.out.println("Destination " + _destinationID + " RESUME");
  }

  public void setParameters(Map params) {
  }

  public void setDestinationID(int destinationID) {
    _destinationID = destinationID;
  }
}