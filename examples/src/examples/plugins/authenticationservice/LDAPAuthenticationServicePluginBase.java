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
import org.apache.commons.lang.StringUtils;

import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.directory.InitialDirContext;
import javax.security.auth.login.FailedLoginException;
import javax.security.auth.login.LoginException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Hashtable;
import java.util.Properties;

/**
 * Sample authentication service to be used with any LDAP server that supports simple authentication.
 */
public class LDAPAuthenticationServicePluginBase {
  private static final String FILES_DIR = "files";
  private static final String CONFIG_FILE_NAME = "LDAPAuthenticationService.properties";
  private static final String SERVER_NAME_PROPERTY = "serverName";
  private static final String SERVER_PORT_PROPERTY = "serverPort";
  private static final String DOMAIN_NAME_PROPERTY = "domainName";

  AuthenticationServicePluginCallbackHandler _handler = null;

  private String _serverName;
  private String _serverPort;
  private String _domainName;

  public void init(String rootDir, String tempDir) {
    Properties props = new Properties();
    String propFileName = rootDir + File.separator + FILES_DIR + File.separator + CONFIG_FILE_NAME;
    try {
      props.load(new FileInputStream(propFileName));
      _serverName = props.getProperty(SERVER_NAME_PROPERTY);
      _serverPort = props.getProperty(SERVER_PORT_PROPERTY);
      _domainName = props.getProperty(DOMAIN_NAME_PROPERTY);
    } catch (IOException e) {
      throw new IllegalArgumentException("Cannot find properties file in " + propFileName + ".  Reason = " + e.toString());
    }
  }

  /**
   * Authenticates the user specified in the source using clear text simple LDAP authentication.
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

    Hashtable env = new Hashtable();

    env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
    env.put(Context.PROVIDER_URL, "LDAP://" + _serverName + ":" + _serverPort);
    env.put(Context.SECURITY_AUTHENTICATION, "simple");
    String userName = uNameSource.getUsername();
    if (StringUtils.isNotBlank(_domainName)) {
      userName = _domainName + "\\" + userName;
    }

    env.put(Context.SECURITY_PRINCIPAL, userName);
    env.put(Context.SECURITY_CREDENTIALS, uNameSource.getPassword());

    try {
      // Try to login.
      new InitialDirContext(env);
      // Here would could get the result to the above and modify the user in some way if we needed to
    } catch (NamingException e) {
      throw new LoginException(e.getMessage());
    }

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
