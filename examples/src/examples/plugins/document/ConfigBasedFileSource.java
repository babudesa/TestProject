/**
 * Guidewire Software
 * <p/>
 * Creator information:
 * User: bjohnson
 * Date: Mar 16, 2005 10:35:11 AM
 */
package examples.plugins.document;

import com.guidewire.external.entity.EntityFactory;
import com.guidewire.logging.LoggerCategory;
import com.guidewire.pl.plugin.IPlugin;
import com.guidewire.pl.plugin.InitializablePlugin;
import org.apache.commons.lang.StringUtils;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Map;


/**
 * Abstract superclass for classes which store information in the server's file system.
 */
public abstract class ConfigBasedFileSource implements IPlugin, InitializablePlugin {

  public static final String DESCRIPTOR_SUFFIX = ".descriptor";

  private static final String TEMPLATES_PATH = "templates.path";
  private static final String DESCRIPTORS_PATH = "descriptors.path";
  private static final String DOCUMENTS_PATH = "documents.path";

  private static final String SERVER_HOST;

  static {
    String strHost = "localhost";
    try {
      strHost = InetAddress.getLocalHost().getHostName();
    } catch (UnknownHostException uhe) {
    }
    SERVER_HOST = strHost;
  }

  private String _rootDir;
  private String _tempDir;
  private String _documentsURL;
  private String _documentsPath;
  private String _demoDocumentsURL;
  private String _demoDocumentsPath;

// ------------------------------------ IService methods ------------------------------------------------------

  public void setParameters(Map parameters) {
    if (parameters != null) {
      _rootDir = (String) parameters.get(ROOT_DIR);
      _tempDir = (String) parameters.get(TEMP_DIR);
      String documentsPath = (String) parameters.get(DOCUMENTS_PATH);
      if (!StringUtils.isEmpty(documentsPath)) {
        _demoDocumentsPath = getAbsolutePath(documentsPath, _rootDir);
        _demoDocumentsURL =  getUrlFromPath(documentsPath, _rootDir);
        if (!new File(_demoDocumentsPath).equals(new File(documentsPath))) {
          //If they're not equal, then documentsPath was a relative path, not an absolute path, which should not be the case in production
          LoggerCategory.PLUGIN.warn("LocalDocumentContentSource has a relative path specified for its documents.path parameter, so it will store documents in the app container's temporary directory. For production use, the configuration should be changed to a full directory path, not a relative path");
          _documentsPath = getAbsolutePath(documentsPath, _tempDir);
          File file = new File(_documentsPath);
          if (!file.exists() && file.isDirectory()) {
            file.mkdirs();
          }
          _documentsURL = getUrlFromPath(documentsPath, _tempDir);
        } else {
          _documentsPath = _demoDocumentsPath;
          _documentsURL = _demoDocumentsURL;

        }
      }
    }
  }

  public String getDocumentsPath() {
    return _documentsPath;
  }

  public String getDocumentsURL() {
    return _documentsURL;
  }

  public String getDemoDocumentsPath() {
    return _demoDocumentsPath;
  }

  public String getDemoDocumentsURL() {
    return _demoDocumentsURL;
  }

  protected EntityFactory getPluginBeanFactory() {
    return EntityFactory.getInstance();
  }

  public static String appendFileToPath(String strPath, String strFile) {
    if (strPath == null) {
      strPath = "";
    }

    String strSeparator = File.separator;
    if (strPath.endsWith("/") ||
        strPath.endsWith("\\") ||
        strPath.endsWith(File.separator)) {
      strSeparator = "";
    }

    return strPath + strSeparator + strFile;
  }

  protected boolean match(String source, String[] words) {
    return match(StringUtils.split(source, ","), words);
  }
  /**
   * @param source
   * @param words
   */
  protected boolean match(String[] source, String[] words) {
    if (words == null || words.length == 0 || words[0] == null || words[0].length() == 0) {
      return true;
    }

    if (source == null || source.length == 0) {
      return false;
    }

    l_iLoop:
    for (int i = 0; i < words.length; i++) {
      for (int j = 0; j < source.length; j++) {
        if (words[i].equalsIgnoreCase(StringUtils.trim(source[j]))) {
          continue l_iLoop;
        }
      }

      return false;
    }

    return true;
  }

  protected static String encodeSpaces(String strUrl) {
    StringBuffer sb = new StringBuffer();
    for (int i = 0; i < strUrl.length(); i++) {
      char c = strUrl.charAt(i);
      if (c == ' ') {
        sb.append("%20");
      } else {
        sb.append(c);
      }
    }

    return sb.toString();
  }

  public static String getUrlFromPath(String strPath, String rootPath) {
    return encodeSpaces("file:///" + rootPath + "/" + forwardSlashify(strPath));
  }

  /**
   * A path is absolute if it begins with a "/" or a "\" or a drive letter "<drive-letter>:".
   * This method returns absolute paths as-is. Relative paths are prepended with the root
   * application directory.
   */
  private static String getAbsolutePath(String path, String rootPath) {
    String retVal=path;
    if (path.startsWith("\\") ||
            path.startsWith("/") ||
            (path.length() > 1 && path.charAt(1) == ':')) {
      retVal = path;
    } else {
      retVal = rootPath + File.separator + path;
    }
    try {
      retVal = (new File(retVal)).getCanonicalPath();
    } catch (IOException e) {
      throw new RuntimeException("Could not get absolute path from relative path: " + path, e);
    }
    return forwardSlashify(retVal);
  }

  /**
   * Changes all '//' slashes to '\' to turn path into a valid uri.
   */
  private static String forwardSlashify(String url) {
    // replaces "\\" with "/"
    return url.replaceAll("\\\\","/");
  }

  private String replaceLocalHostWithName(String strUrl) {
    if (strUrl == null) {
      return null;
    }

    String strLocalHostMatch = "//localhost";
    int iIndex = strUrl.indexOf(strLocalHostMatch);
    if (iIndex < 0) {
      return strUrl;
    }

    strUrl = strUrl.substring(0, iIndex + 2) + SERVER_HOST + strUrl.substring(iIndex + strLocalHostMatch.length());
    return strUrl;
  }

}
