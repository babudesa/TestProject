/*
 * Guidewire ClaimCenter
 *
 * Copyright 2003 Guidewire Software, Inc. All Rights Reserved.
 * Guidewire Software, Guidewire ClaimCenter, and the Guidewire logo are trademarks of Guidewire Software, Inc.
 */

package examples.plugins.authenticationsourcecreator;

import com.guidewire.pl.plugin.security.AuthenticationSource;
import com.guidewire.pl.plugin.security.InvalidAuthenticationSourceData;
import com.guidewire.pl.plugin.security.UserNamePasswordAuthenticationSource;
import org.apache.commons.codec.binary.Base64;

import javax.servlet.http.HttpServletRequest;

import gw.util.StreamUtil;

public class BasicAuthenticationSourceCreatorPluginBase {
  public void init(String rootDir, String tempDir) {
  }

  public AuthenticationSource createSourceFromHTTPRequest(HttpServletRequest request) throws InvalidAuthenticationSourceData {
    AuthenticationSource source;
    String authString = request.getHeader("Authorization");
    if (authString != null) {
      byte[] bytes = StreamUtil.toBytes(authString.substring(6));
      String fullAuth = new String(Base64.decodeBase64(bytes));
      int colonIndex = fullAuth.indexOf(':');
      if (colonIndex == -1) {
        throw new InvalidAuthenticationSourceData("Invald authorization header format");
      }
      String userName = fullAuth.substring(0, colonIndex);
      String password = fullAuth.substring(colonIndex + 1);
      if (userName.length() == 0) {
        throw new InvalidAuthenticationSourceData("Could not find username");
      }
      if (password.length() == 0) {
        throw new InvalidAuthenticationSourceData("Could not find password");
      }
      source = new UserNamePasswordAuthenticationSource(userName, password);
      return source;
    } else {
      throw new InvalidAuthenticationSourceData("Could not find authorization header");
    }
  }
}
