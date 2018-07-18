package examples.plugins.dbauthentication;

import com.guidewire.util.FileUtil;
import com.guidewire.pl.plugin.dbauth.UsernamePasswordPair;
import com.guidewire.pl.plugin.InitializablePlugin;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.util.Map;

/**
 * Guidewire Software
 * <p/>
 * Creator information:
 * User: akeefer
 * Date: Apr 21, 2005 5:12:06 PM
 *
 * Simple class that returns a username/password pair with a null username and a db password retrieved
 * from a file specified by the "filename" property.
 */
public class FileDBAuthPluginBase implements InitializablePlugin {
  private static final String PASSWORD_FILE_PROPERTY = "passwordfile";
  private static final String USERNAME_FILE_PROPERTY = "usernamefile";

  private String _passwordfile;
  private String _usernamefile;

  public void setParameters(Map properties) {
    _passwordfile = (String) properties.get(PASSWORD_FILE_PROPERTY);
    _usernamefile = (String) properties.get(USERNAME_FILE_PROPERTY);
  }

  public UsernamePasswordPair retrieveUsernameAndPassword(String dbName) {
    try {
      String password = null;
      if (_passwordfile != null) {
        password = readLine(new File(_passwordfile));
      }
      String username = null;
      if (_usernamefile != null) {
        username = readLine(new File(_usernamefile));
      }
      return new UsernamePasswordPair(username, password);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private static String readLine(File file) throws IOException {
    BufferedReader reader = new BufferedReader(FileUtil.getFileReader(file));
    String line = reader.readLine();
    reader.close();
    return line;
  }
}
