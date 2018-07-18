/*
 * Guidewire ClaimCenter
 *
 * Copyright 2003 Guidewire Software, Inc. All Rights Reserved.
 * Guidewire Software, Guidewire ClaimCenter, and the Guidewire logo are trademarks of Guidewire Software, Inc.
 */

package examples.plugins.authenticationservice;

import com.guidewire.pl.plugin.security.UserNamePasswordAuthenticationSource;
import com.guidewire.pl.plugin.security.AuthenticationServicePluginCallbackHandler;
import com.guidewire.pl.plugin.security.AuthenticationSource;

import javax.security.auth.callback.Callback;
import javax.security.auth.callback.CallbackHandler;
import javax.security.auth.callback.NameCallback;
import javax.security.auth.callback.PasswordCallback;
import javax.security.auth.callback.UnsupportedCallbackException;
import javax.security.auth.login.FailedLoginException;
import javax.security.auth.login.LoginContext;
import javax.security.auth.login.LoginException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * Sample authentication service to be used with WebSEAL.
 */
public class JAASAuthenticationServicePluginBase {
  private static final String FILES_DIR = "files";
  private static final String CONFIG_FILE_NAME = "jaasAuthenticationService.properties";
  private static final String JAAS_CONTEXT_NAME_PROPERTY = "context";

  AuthenticationServicePluginCallbackHandler _handler = null;
  private String _jaasContextName;

  public void init(String rootDir, String tempDir) {
    Properties props = new Properties();
    String propFileName = rootDir + File.separator + FILES_DIR + File.separator + CONFIG_FILE_NAME;
    try {
      props.load(new FileInputStream(propFileName));
      _jaasContextName = props.getProperty(JAAS_CONTEXT_NAME_PROPERTY);
    } catch (IOException e) {
      throw new IllegalArgumentException("Cannot find properties file in " + propFileName + ".  Reason = " + e.toString());
    }
  }

  /**
   * Simple user name and password callback handler.
   */
  private static class JaasCallbackHandler implements CallbackHandler {
    private UserNamePasswordAuthenticationSource _source;

    public JaasCallbackHandler(UserNamePasswordAuthenticationSource source) {
      _source = source;
    }

    public void handle(Callback[] callbacks)
            throws IOException, UnsupportedCallbackException {
      for (int i = 0; i < callbacks.length; i++) {
        Callback callback = callbacks[i];
        if (callback instanceof NameCallback) {
          ((NameCallback) callback).setName(_source.getUsername());
        } else if (callback instanceof PasswordCallback) {
          ((PasswordCallback) callback).setPassword(_source.getPassword().toCharArray());
        } else {
          throw new UnsupportedCallbackException(callback);
        }
      }
    }
  }

  /**
   * Authenticates the user specified in the source in the configured JAAS context.
   *
   * @param source the source to authenticate
   * @return the public id of the user that authenticated
   * @throws LoginException if the user does not authenticate or if the user is not found in our system.
   */
  public String authenticate(AuthenticationSource source) throws LoginException {
    if (!(source instanceof UserNamePasswordAuthenticationSource)) {
      throw new IllegalArgumentException("Authentication source type " + source.getClass().getName() + " is not known to this plugin");
    }

    assert _handler != null : "Callback handler not set";

    UserNamePasswordAuthenticationSource uNameSource = (UserNamePasswordAuthenticationSource) source;
    LoginContext context;

    // Setup the JAAS context
    context = new LoginContext(_jaasContextName, new JaasCallbackHandler(uNameSource));

    // Authenticate the user.
    context.login();

    String username = uNameSource.getUsername();
    String userPublicId = _handler.findUser(username);
    if (userPublicId == null) {
      throw new FailedLoginException("Bad user name " + username);
    }

    return userPublicId;
  }

  public void setCallback(AuthenticationServicePluginCallbackHandler callbackHandler) {
    _handler = callbackHandler;
  }
}
