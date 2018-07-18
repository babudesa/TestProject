package examples.plugins.messaging;

import com.guidewire.cc.external.entity.Message;
import com.guidewire.cc.plugin.messaging.MessageReply;
import com.guidewire.cc.plugin.messaging.MessageReplyBase;
import com.guidewire.pl.plugin.PluginCallbackHandler;

import java.util.Map;

/**
 * Sample implementation of the MessageReply plugin interface that shows
 * how to acknowledge a message from an asynchronous reply.  Registers
 * a listener to be called whenever a message is posted to
 * a simulated asynchronous queue.  When the listener is called back,
 * uses the PluginCallbackHandler and MessageFinder instances to
 * look up and acknowledge the message.
 */
public class MessageReplyImpl extends MessageReplyBase implements MessageReply {

  public void setParameters(Map params) {
  }

  public void shutdown() {
  }

  public void suspend() {
  }

  public void resume() {
    // Start listening on the queue.
    QueueSimulator.getInstance().listen(new MyQueueListener());
  }

  public void setDestinationID(int destinationID) {
  }
  

  /**
   * Implementation of QueueListener that listens for messages to be posted
   * to the queue and acks them.
   */
  private class MyQueueListener implements QueueListener {

    /**
     * Called when a message is added to the queue.  Looks up the message
     * and acks it using the PluginCallbackHandler instance supplied when the
     * plugin was initialized.
     *
     * @param messageID
     */
    public void responseReceived(final int messageID) {
      PluginCallbackHandler.Block block = new PluginCallbackHandler.Block() {
        public void run() throws Throwable {
          Message message = _messageFinder.findById(messageID);
          message.reportAck();
        }
      };

      try {
        _pluginCallbackHandler.execute(block);
      } catch (Throwable throwable) {
        throwable.printStackTrace();  // In the real world, we'd log this at least.
      }
    }
  }


}