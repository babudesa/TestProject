package examples.plugins.geocode.soap.mappoint;

import org.apache.axis.AxisFault;
import org.apache.axis.Message;
import org.apache.axis.MessageContext;
import org.apache.axis.handlers.BasicHandler;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Authenticator;
import java.net.HttpURLConnection;
import java.net.PasswordAuthentication;
import java.net.URL;
import java.net.URLConnection;

/**
 * MapPoint needs its own Http Sender class -- go figure!
 * @deprecated
 */
@Deprecated
public class MappointHttpSender extends BasicHandler {

  //==========PRIVATE STATIC INNER CLASSES==========//

  /**
   * SimpleAuthenticator provides the user name and password to an URLConnection.
   */
  private static class SimpleAuthenticator extends Authenticator {
    private PasswordAuthentication m_authentication;

    SimpleAuthenticator(String userName, String password) {
      m_authentication = new PasswordAuthentication(userName, password.toCharArray());
    }

    protected PasswordAuthentication getPasswordAuthentication() {
      return m_authentication;
    }
  }

  //==========PUBLIC METHODS IMPLEMENTING INTERFACES==========//

  /**
   * Invoke a remote call using an URLConnection.  This method is called by Axis.
   */
  public void invoke(MessageContext messageContext) throws AxisFault {
    try {
      String userName = messageContext.getUsername();
      String password = messageContext.getPassword();
      if (userName != null && password != null) {
        Authenticator.setDefault(new SimpleAuthenticator(userName, password));
      }

      URL url = new URL(messageContext.getStrProp(MessageContext.TRANS_URL));
      URLConnection conn = url.openConnection();
      writeToConnection(conn, messageContext);
      readFromConnection(conn, messageContext);
    } catch (Exception e) {
      throw AxisFault.makeFault(e);
    } finally {
      Authenticator.setDefault(null);
    }
  }

  //==========PRIVATE METHODS==========//

  /**
   * Read the SOAP response message from an URLConnection.
   */
  private void readFromConnection(URLConnection conn, MessageContext messageContext) throws Exception {
    String contentType = conn.getContentType();
    String contentLocation = conn.getHeaderField("Content-Location");

    InputStream in = ((HttpURLConnection) conn).getErrorStream();
    if (in == null) {
      in = conn.getInputStream();
    }
    in = new BufferedInputStream(in, 8192);
    Message response = new Message(in, false, contentType, contentLocation);
    response.setMessageType(Message.RESPONSE);
    messageContext.setResponseMessage(response);
  }


  /**
   * Write the SOAP request message to an URLConnection.
   */
  private void writeToConnection(URLConnection conn, MessageContext messageContext) throws Exception {
    conn.setDoOutput(true);
    Message request = messageContext.getRequestMessage();
    String contentType = request.getContentType(messageContext.getSOAPConstants());
    conn.setRequestProperty("Content-Type", contentType);
    if (messageContext.useSOAPAction()) {
      conn.setRequestProperty("SOAPAction", messageContext.getSOAPActionURI());
    }
    OutputStream out = new BufferedOutputStream(conn.getOutputStream(), 8192);
    request.writeTo(out);
    out.flush();
  }
}

