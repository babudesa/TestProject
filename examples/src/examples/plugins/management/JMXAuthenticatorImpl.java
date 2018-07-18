package examples.plugins.management;

import com.guidewire.logging.LoggerFactory;
import com.guidewire.pl.plugin.management.ManagementAuthorizationCallbackHandler;

import javax.management.remote.JMXAuthenticator;
import javax.security.auth.Subject;

/**
 * Guidewire Software
 * <p/>
 * Creator information:
 * User: akeefer
 * Date: Jan 26, 2005 2:13:08 PM
 */
public class JMXAuthenticatorImpl implements JMXAuthenticator {
  private ManagementAuthorizationCallbackHandler _callbackHandler;

  public JMXAuthenticatorImpl(ManagementAuthorizationCallbackHandler callbackHandler) {
    _callbackHandler = callbackHandler;
  }

  public Subject authenticate(Object o) throws SecurityException {
    if (o instanceof String[]) {
      String username = ((String[]) o)[0];
      String password = ((String[]) o)[1];

      if (_callbackHandler.hasManagementPermission(username, password)) {
        return new Subject();
      } else {
        return null;
      }
    }

    // Log the error and return null if it's not an object we can interpret
    LoggerFactory.getInstance().getLogger(getClass()).error("JMX Authenticator was passed an object of type " + o.getClass().getName() + " rather than a String[]");
    return null;
  }
}
