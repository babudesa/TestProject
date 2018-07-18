/**
 * Created by IntelliJ IDEA.
 * User: ahuynh
 * Date: Sep 25, 2006
 * Time: 2:12:11 PM
 */

package examples.plugins.messaging;

import com.guidewire.cc.plugin.messaging.MessageTransport;
import com.guidewire.cc.external.entity.Message;
import com.guidewire.pl.plugin.messaging.InitializationException;

import javax.jms.JMSException;
import javax.jms.QueueSender;
import java.util.Map;

/**
 * Guidewire Software
 * <p/>
 * Creator information:
 * User: ahuynh
 * Date: Sep 25, 2006 2:12:11 PM
 */

public class JMSMessageTransport extends JMSMessageBase implements MessageTransport {

  QueueSender _queueSender = null;

  // Name of send queue as defined in config
  String _sendQueueName = null;

  public JMSMessageTransport() {

  }

  /*********** Message Transport ************************************************/

  public void send(Message message, String transformedPayload) throws Exception {
    checkIsInitialized();

    _logger.info("JMSMessageTransport sending message with id " + message.getID().getValue() + ", and payload " + message.getPayload());

    try {
      // Create the JMS message.
      javax.jms.Message jmsMessage = createJMSMessage(message.getID().getValue(), message.getMessageCode(), transformedPayload);

      // Send it to the JMS Server
      _queueSender.send(jmsMessage);

    } catch (JMSException jmse) {
      // Assume all JMS errors are unrecoverable
      throw new Exception("Error while sending jms message with id " + message.getID().getValue() + ":" + jmse.toString());
    }

  }

  public void setParameters(Map params) {
    super.setParameters(params);
    _sendQueueName = (String) params.get("sendQueue");
  }

  /************* JMSMessageBase *********************************/

  protected void resetQueues() {
    _queueSender = null;
  }

  protected void initQueues() throws InitializationException {
    _queueSender = createQueueSender(_sendQueueName);
  }

}
