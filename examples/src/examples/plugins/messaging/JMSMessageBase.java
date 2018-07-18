package examples.plugins.messaging;

import com.guidewire.logging.LoggerCategory;
import com.guidewire.pl.plugin.InitializablePlugin;
import com.guidewire.pl.plugin.messaging.InitializationException;

import javax.jms.ExceptionListener;
import javax.jms.JMSException;
import javax.jms.MessageListener;
import javax.jms.Queue;
import javax.jms.QueueConnection;
import javax.jms.QueueConnectionFactory;
import javax.jms.QueueReceiver;
import javax.jms.QueueSender;
import javax.jms.QueueSession;
import javax.jms.Session;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import java.util.Hashtable;
import java.util.Map;

/**
 * Guidewire Software
 * <p/>
 * Base helper class for JMS Messaging example.
 * Creates queue connections and sessions, send and receive queues, and JMS messages.
 * <p/>
 * Creator information:
 * User: ahuynh
 * Date: Sep 25, 2006 4:14:43 PM
 */

public abstract class JMSMessageBase implements ExceptionListener, InitializablePlugin {

  QueueConnection _queueConnection = null;
  QueueSession _queueSession = null;

  String _jmsURL = null;
  String _connectionFactoryName = null;
  boolean _initialized = false;

  protected static JMSMessageReply reply = null;

  public static final LoggerCategory _logger = new LoggerCategory(LoggerCategory.MESSAGING, "examples");

  /**
   * ****** ExceptionLister ************************************
   */
  public void onException(JMSException jmsException) {
    _logger.error("JMS Exception: " + jmsException.toString());
    if ("connection_to_server_dropped".equals(jmsException.getErrorCode())) {
      _logger.error("Connection to server has been dropped so clearing connection info.  No messages will be sent or received.");      
      reset();
      
    }
  }

  private void reset() {
    _initialized = false;
    closeJMSConnection();
    resetQueues();
  }

  /**
   * ****** Messaging API methods ************************************
   */

  public void shutdown() {
    reset();
  }

  public void suspend() {
    reset();
  }

  public void resume() throws InitializationException {
    init();
  }

  public void setParameters(Map params) {
    _jmsURL = (String) params.get("url");
    _connectionFactoryName = (String) params.get("connectionFactoryName");
  }

  public void setDestinationID(int destinationID) {
  }

  /**
   * ****** Protected Methods ************************************
   */

  /**
   * Initialize queues.
   * @throws InitializationException if error is encountered while initializing.
   */
  abstract protected void initQueues() throws InitializationException;

  /**
   * Reset the queues, ie. set them to null.
   */
  abstract protected void resetQueues();

  /**
   * Create a JMS message given the ID, message code and transformed payload.
   * This is just an example.  Other parts of the message can of course be put into the
   * JMS message.
   *
   * @param messageID int value of the id
   * @param messageCode message code
   * @param transformedPayload transformed payload
   * @return the JMS message
   * @throws JMSException
   */
  protected javax.jms.Message createJMSMessage(int messageID, String messageCode, String transformedPayload) throws JMSException {
    javax.jms.Message jmsMessage = _queueSession.createMessage();
    jmsMessage.setIntProperty("messageID", messageID);
    jmsMessage.setStringProperty("body", transformedPayload);
    jmsMessage.setStringProperty("messageCode", messageCode);
    return jmsMessage;
  }

  /**
   * Create a queue receiver.
   * @param queueReceiverName the name of the queue receiver
   * @param listener the listener for the queue receiver
   * @return queue receiver
   * @throws InitializationException if a JMSException occurs
   */
  protected QueueReceiver createQueueReceiver(String queueReceiverName, MessageListener listener) throws InitializationException {
    try {
      Queue replyQueue = _queueSession.createQueue(queueReceiverName);
      QueueReceiver receiver = _queueSession.createReceiver(replyQueue);
      receiver.setMessageListener(listener);
      return receiver;
    }  catch (JMSException e) {
      // Close the JMS connection since we could not create the queue sender.
      closeJMSConnection();
      throw new InitializationException("Failed to initialize receive queue", e);
    }
  }

  /**
   * Create a queue sender.
   * @param queueSenderName the name of the queue sender
   * @return queue sender
   * @throws InitializationException if a JMSException occurs
   */
  protected QueueSender createQueueSender(String queueSenderName) throws InitializationException {
    // Create send queue and set up a sender
    try {
      Queue sendQueue = _queueSession.createQueue(queueSenderName);
      return _queueSession.createSender(sendQueue);
    } catch (JMSException e) {
      // Close the JMS connection since we could not create the queue sender.
      closeJMSConnection();
      throw new InitializationException("Failed to initialize send queue", e);
    }
  }

  /********* Private Methods *************************************/

  /**
   * Create Queue connection factory given the JMS url and the factory name.
   *
   * @return a queue connection factory
   */
  private QueueConnectionFactory getQueueConnectionFactory() throws NamingException {
    // Set up relationship to JMS server

    Hashtable properties = new Hashtable();
    properties.put(Context.INITIAL_CONTEXT_FACTORY,
            org.exolab.jms.jndi.InitialContextFactory.class.getName());
    properties.put(Context.PROVIDER_URL, _jmsURL);

    // Get the JNDI server
    Context jndiContext = new InitialContext(properties);

    // Create a connection to the JMS Server
    return (QueueConnectionFactory) jndiContext.lookup(_connectionFactoryName);
  }

  /**
   * Initialize the queue connection and session.
   */
  private void initQueueConnectionAndSession(QueueConnectionFactory factory) throws JMSException {

    // Get connection and start it.
    _queueConnection = factory.createQueueConnection();
    _queueConnection.start();
    _queueConnection.setExceptionListener(this);

    // Create a non-transaction session that requires the client to explicitly
    // acknowledge the messages received.
    _queueSession = _queueConnection.createQueueSession(false, Session.CLIENT_ACKNOWLEDGE);
  }

  /**
   * Close JMS connection.  That should also take care of the session and queue.
   */
  private void closeJMSConnection() {
    if (_queueConnection != null) {
      try {
        _queueConnection.close();
      } catch (JMSException jmse) {
        throw new RuntimeException(jmse);
      } finally {
        _initialized = false;
        _queueConnection = null;
      }

    }
  }

  /**
   * Initialize queues.
   *
   * @throws InitializationException
   */
  private void init() throws InitializationException {
    if (_initialized) {
      return;
    }

    // Initialize factory.
    QueueConnectionFactory factory;
    try {
      factory = getQueueConnectionFactory();
    } catch (NamingException e) {
      throw new InitializationException("Error initializing queue connection factory, please ensure that your configuration properties are correct and that your JMS Server is running.", e);
    }

    // Init connection and session.
    try {
      initQueueConnectionAndSession(factory);
    } catch (JMSException e) {
      throw new InitializationException("Error initializing queue connection and session", e);
    }

    // Init queues.
    initQueues();

    _initialized = true;
  }

  protected void checkIsInitialized() {
    if (!_initialized) {
      // Try to initialize.
      try {
        init();
      } catch (InitializationException e) {

      }

      if (!_initialized) {
        throw new IllegalStateException("There is a problem with the jms connection, please check the jms server.");
      }

      // Initialize the reply if needed.
      if ((this instanceof JMSMessageTransport) && reply != null) {
        reply.checkIsInitialized();
      }
    }
  }
}