package examples.plugins.messaging;

import com.guidewire.cc.plugin.messaging.MessageReply;
import com.guidewire.cc.plugin.messaging.MessageFinder;
import com.guidewire.pl.plugin.PluginCallbackHandler;
import com.guidewire.pl.plugin.messaging.InitializationException;

import javax.jms.JMSException;
import javax.jms.QueueReceiver;
import javax.jms.MessageListener;
import java.util.Map;

/**
 * Guidewire Software
 * Sample code that implements MessageReply for JMS.
 * <p/>
 * Creator information:
 * User: ahuynh
 * Date: Sep 25, 2006 5:11:32 PM
 */
public class JMSMessageReply extends JMSMessageBase implements MessageReply, MessageListener {

  QueueReceiver _queueReceiver = null;
  String _queueReceiverName = null;
  private MessageFinder _messageFinder;
  private PluginCallbackHandler _callbackHandler;


  /************* MessageReply  *********************************/
  public void initTools(PluginCallbackHandler pluginCallbackHandler, MessageFinder messageFinder) {
    _messageFinder = messageFinder;
    _callbackHandler = pluginCallbackHandler;
    reply = this;
  }

  public void shutdown() {
    try {
      // Prevent further message notifications on the callback thread
      if (_queueReceiver != null) {
        _queueReceiver.setMessageListener(null);
      }
    } catch (JMSException jmse) {
      _logger.warn("Got error trying to shutdown JMSMessageReply: " + jmse.toString());
    }

    super.shutdown();
  }

  public void setParameters(Map params) {
    super.setParameters(params);
    _queueReceiverName = (String) params.get("replyQueue");
  }

  /************* JMSMessageBase *********************************/  
  protected void initQueues() throws InitializationException {

    // Create reply queue and set up a receiver
    _queueReceiver = createQueueReceiver(_queueReceiverName, this);

    try {
      // Specify this object as the message listener on the queue
      _queueReceiver.setMessageListener(this);
    } catch (JMSException e) {
      throw new InitializationException("Failed to set message listener for queue receiver", e);
    }
  }

  protected void resetQueues() {
    _queueReceiver = null;
  }

  /************* MessageListener  *********************************/
  public void onMessage(javax.jms.Message message) {
    checkIsInitialized();

    try {
      // Show that we got the message that was sent
      int messageID = message.getIntProperty("messageID");
      String body = message.getStringProperty("body");
      _logger.info("JMSMessageReply received message with id " + messageID);
      _logger.info("JMSMessageReply payload: " + body);

      // Acknowledge message to CC
      messageReceived(messageID);

      // Acknowledge message to JMS
      message.acknowledge();

    } catch (JMSException e) {
      _logger.error("Failed to acknowledge message to JMS: " + e.toString());
    } catch (Throwable e) {
    _logger.error("Failed to acknowledge message to ClaimCenter: " + e.toString());
    }
  }

  /**
   * Ack the message to CC
   * @param messageId the id of the message.
   * @throws Throwable
   */
  public void messageReceived(final int messageId) throws Throwable {

    PluginCallbackHandler.Block block = new PluginCallbackHandler.Block() {
      public void run() throws Throwable {
        com.guidewire.cc.external.entity.Message message = _messageFinder.findById(messageId);
        message.reportAck();
      }
    };

    _callbackHandler.execute(block);
  }


}