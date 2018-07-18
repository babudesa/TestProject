/*
 * Guidewire ClaimCenter
 *
 * Copyright 2003 Guidewire Software, Inc. All Rights Reserved.
 * Guidewire Software, Guidewire ClaimCenter, and the Guidewire logo are trademarks of Guidewire Software, Inc.
 */

package examples.cc.plugins.document.imageright;

import com.guidewire.cc.external.entity.Document;
import com.guidewire.cc.plugin.document.IDocumentContentSource;
import com.guidewire.util.FileUtil;
import com.guidewire.pl.plugin.IPlugin;
import examples.plugins.document.ConfigBasedFileSource;
import gw.document.DocumentContentsInfo;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.Calendar;
import java.util.Map;

/**
 * The ImageRight document source adapter.
 */
public class IRDocumentContentSource extends ConfigBasedFileSource implements IPlugin, IDocumentContentSource {

  /**
   * The IDX value must match the extension specified in the ImageRight Utility Scheduler
   * under the Import Insurance COLD preferences e.g., \\bering\images\*.idx.
   */
  private static final String IDX = ".idx";

  /**
   * The ImageRight Drawer to put the files in. This drawer must exist.
   * You can edit them via the ImageRight System Maintenance Tool.
   */
  private static final String DRAWER = "CLMS";

  /**
   * The literal Index Information field as specified in the Insurance COLD Import docs.
   */
  private static final String INDEX_INFO = "$#IY#$";

  /**
   * The property in the config.xml file specifying the URL to use as
   * the URL from which to retrieve documents
   */
  private static final String PROP_IR_DISPLAY_URL = "imageright.display.url";
  private String _displayURL;

  /**
   * The property in the config.xml file specifying the
   * ImageRight server's IP address. This must be an ip address, not a name.
   */
  private static final String PROP_IR_SERVER_IP = "imageright.server.ip";
  private String _serverIP;

  /**
   * The property in the config.xml file specifying the directory
   * to copy imported files. The ImageRight COLD Import Scheduler polls this
   * directory approximately every 5 seconds for files to import.
   */
  private static final String PROP_IR_COLD_IMPORT = "imageright.cold.import.directory";
  private String _importDir;

  /**
   * The property in the plugin config file specifying whether
   * documents should be displayed using the ImageRight WebView ActiveX control,
   * or in the ImageRight desktop client via an integration ActiveX control.
   * Legal values are "webview" or "desktop".
   */
  private static final String PROP_IR_DISPLAY_MODE = "imageright.display.mode";
  private String _displayMode;

  private static final String PROP_IR_URL_PREFIX = "imageright.url.prefix";
  private String _urlPrefix;

  /**
   * The property in the plugin config with the URL fragment to be used to access
   * the IRWebView cab file and IR_Viewer.jsp files
   * @param parameters parameters for the plugin configuration
   */
  public void setParameters(Map parameters) {
    super.setParameters(parameters);
    if (parameters != null) {
      _displayURL = (String) parameters.get(PROP_IR_DISPLAY_URL);
      _serverIP = (String) parameters.get(PROP_IR_SERVER_IP);
      _importDir = (String) parameters.get(PROP_IR_COLD_IMPORT);
      _displayMode = (String) parameters.get(PROP_IR_DISPLAY_MODE);
      _urlPrefix = (String) parameters.get(PROP_IR_URL_PREFIX);
    }
  }

  public DocumentContentsInfo getDocumentContentsInfo(Document document, boolean includeDocumentContents) {
    try {
    String url = null;
    if (includeDocumentContents) {
      url = _displayURL +
            "?document=" + URLEncoder.encode(document.getDocUID(), Charset.forName("ISO-8859-1").name()) +
            "&irserver=" + _serverIP +
            "&displaymode=" + _displayMode +
            "&urlprefix=" + _urlPrefix;

      }
      DocumentContentsInfo response = new DocumentContentsInfo(DocumentContentsInfo.URL, url, null);
      response.setTargetHiddenFrame(true);
      return response;
    } catch (UnsupportedEncodingException e) {
      throw new RuntimeException(e);
    }
  }


  public DocumentContentsInfo getDocumentContentsInfoForExternalUse(Document document) {
    throw new UnsupportedOperationException("Not implemented");
  }

  public boolean isInboundAvailable() {
    return true;
  }

  public boolean isOutboundAvailable() {
    return true;
  }

  public boolean addDocument(InputStream isDocument, Document document) {
    try {
      int exposureId = -1;
      if (document.getExposure() != null) {
        document.getExposure().getID().getValue();
      }
      int claimantId = -1;
      if (document.getClaimant() != null) {
        document.getClaimant().getID().getValue();
      }

      document.setDocUID(addDocument(document.getName() + getFileExtension(document.getMimeType()), document.getClaim().getClaimNumber(), exposureId, claimantId, isDocument));
      return false;
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  //## TODO: do something smarter
  // BHJ: In theory, this should really re-use the info in the mime-types configuration in config.xml, but currently that code is unavailable,
  //  since it's in PL and this is in toolkit. This class isn't really used, so it's not a big deal now, but keep
  //  an eye on it down the line.
  private String getFileExtension(String mimeType) {
    mimeType = mimeType.toLowerCase();
    if (mimeType.equals("application/msword")) {
      return ".doc";
    }
    if (mimeType.equals("application/vnd.ms-excel")) {
      return ".xls";
    }
    if (mimeType.equals("application/pdf")) {
      return ".pdf";
    }
    if (mimeType.equals("text/plain")) {
      return ".txt";
    }

    return "";
  }


  public boolean updateDocument(Document document, InputStream isDocument) {
  // The IR-CC integration currently doesn't use this feature.
    return false;
  }

  public boolean isDocument(Document document) {
    // The documents stored in ImageRight via this api are gaurenteed to be unique.
    // Besides, there's no api to check against anyway.
    return false;
  }

  public boolean removeDocument(Document document) {
    //BHJ: Not currently supported by this implementation of IDocumentSource, because
    //    there doesn't appear to be a way to communicate to the ImageRight system that
    //    the document should be removed (or figure out if it should be, if the system is also
    //    used for other purposes
    return false;
  }

  /**
   * Stores a document in a "central" place and returns the UID for it.
   * @param strName document name
   * @param strClaimNumber claim number
   * @param iExposureID exposure ID
   * @param iClaimantID claimant ID
   * @param content content
   * @return document DocUID
   */
  private String addDocument(String strName,
                             String strClaimNumber,
                             int iExposureID,
                             int iClaimantID,
                             InputStream content) {
    try {
      if (strName == null) {
        throw new IllegalArgumentException("Document name is null.");
      }

      if (strClaimNumber == null) {
        throw new IllegalArgumentException("Claim Number is null.");
      }

      String strId = String.valueOf(System.currentTimeMillis());
      int iSuffixMax = 40 - strId.length() - 5; // Reserve room for the .idx extension and underscore
      String strSuffix = strName.length() <= iSuffixMax ? strName : strName.substring(strName.length() - iSuffixMax);
      strId += '_' + strSuffix;

      File file = new File(getDocumentsDir() + File.separator + strId);
      if (FileUtil.isFile(file)) {
        throw new RuntimeException(getDocumentsDir() + File.separator + strId + " already exists.");
      }

      copyToFile(content, file);

      generateAndCopyIndexFile(strId, strClaimNumber, iExposureID, iClaimantID);

      return strId;
    } catch (Throwable t) {
      throw new RuntimeException(t);
    }
  }

  private void generateAndCopyIndexFile(String strId, String strClaimNumber, int iExposureID, int iClaimantID) {
    try {
      int iExt = strId.lastIndexOf('.');
      String strIdx = strId;
      if (iExt > 0) {
        strIdx = strIdx.substring(0, iExt);
      }
      strIdx += IDX;

      File file = new File(getDocumentsDir() + File.separator + strIdx);
      if (FileUtil.isFile(file)) {
        throw new RuntimeException(getDocumentsDir() + File.separator + strIdx + " already exists.");
      }

      String strIndexFileContent = generateIndexFileContent(strId, strClaimNumber, iExposureID, iClaimantID);

      Writer os = FileUtil.getFileWriter(file);
      os.write(strIndexFileContent);
      os.close();

    } catch (Throwable t) {
      throw new RuntimeException(t);
    }
  }

  private String generateIndexFileContent(String strImportFileName, String strClaimNumber, int iExposureID, int iClaimantID) {
    // Example:
    //abc123blahblahblah_test.doc $#IY#$ABC123                                  CLMS EXPS     600011                     FILE-NAME-HERE                20030213        Y*Claimant 123 : 00000126
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //abc123blahblahblah_test.doc - The name of the file to import (variable length, but at least 15 chars long)
    //                            -  (1) A space to separate the variable length file name
    //$#IY#$                      -  (6) Index info
    //ABC123                      - (40) Claim Number
    //CLMS                        -  (4) Drawer (always CLMS, for Claims)
    //<unused>                    -  (1) <unused>
    //EXPS                        -  (4) Document Type (one of: EXPS for Exposure related doc, CLMT for claimant related doc, or CLAM for entire claim related doc)
    //<unused>                    -  (5) <unused>
    //60001                       -  (5) Folder Type (one of: 60000 for Exposure related documents folder, 60001 for Claimant related folder, 60002 for entire claim related)
    //1                           -  (5) Workflow Id. This is the id of the ClaimCenter defined ImageRight workflow. See it via the Workflow definer.
    //<unused>                    - (17) <unused>
    //FILE-NAME-HERE              - (30) The name of the document to store in the imageright folder
    //20030213                    -  (8) Date. The date associated with the document.
    //<unused>                    -  (8) <unused>
    //Y                           -  (1) Must be Y
    //*E2355621:<reference-num>   - (50) Document Description. Must begin with an asterisk (*). Encode exposure id, claimant id or whatever here,
    //                                   plus add the Reference number of the document. The reference number must be globally unique.

    boolean bExposure = iExposureID >= 0;
    boolean bClaimant = iClaimantID >= 0;

    return
            /* Import Name */                strImportFileName +
            /* Space */                      ' ' +
            /* $#IY#$ */                     INDEX_INFO +
            /* Claim Number */               pad(strClaimNumber, 40) +
            /* CLMS Drawer */                DRAWER +
            /* <unused> (1) */               pad(1) +
            /* Document Type */              (bExposure ? "EXPS" : (bClaimant ? "CLMT" : "CLAM")) +
            /* <unused> (5) */               pad(5) +
            /* Folder Type */                (bExposure ? "60000" : (bClaimant ? "60001" : "60002")) +
            /* Workflow Id */                pad("1", 5) +
            /* <unused> (17) */              pad(17) +
            /* Document Name */              pad(strImportFileName, 30) +
            /* Date */                       getFormattedDate() +
            /* <unused> (8) */               pad(8) +
            /* Y */                          "Y" +
            /* Document Description */       pad(encodeDocumentDescription(iExposureID, iClaimantID, strImportFileName), 50);
  }

  /**
   * Encodes the document description (aka 'reason'). The description is encodes like so:
   * * + E|C + Id + ":" + docId
   * or
   * * + entireclaim + ":" + docId
   * where E = exposure, C = claimant, id = exposure or claimant id.
   * For example,
   * *E2355621:345663223433_whatever.doc
   * encodes docUID 345663223433_whatever.doc with the exposure #2355621.
   * Another example:
   * *entireclaim:345663223433_whatever.doc
   * encodes docUID 345663223433_whatever.doc with the entire claim (not exposure/claimant specific).
   *
   * @param iExposureID An exposure id or -1
   * @param iClaimantID A claimant id or -1
   * @param strDocId doc ID
   * @return The encoded doc description/reason.
   */
  private String encodeDocumentDescription(int iExposureID, int iClaimantID, String strDocId) {
    // Adding a '!' to avoid perpetual syncing. See the imageright-to-cc workflow.
    String strReason = "*!";

    if (iExposureID >= 0) {
      strReason += "E" + String.valueOf(iExposureID);
    } else if (iClaimantID > -0) {
      strReason += "C" + String.valueOf(iClaimantID);
    } else {
      strReason += "entireclaim";
    }

    return strReason + ":" + strDocId;
  }

  private String getFormattedDate() {
    Calendar cal = Calendar.getInstance();
    String strYear = String.valueOf(cal.get(Calendar.YEAR));
    String strMonth = String.valueOf(cal.get(Calendar.MONTH) + 1);
    strMonth = strMonth.length() == 1 ? ("0" + strMonth) : strMonth;
    String strDayOfMonth = String.valueOf(cal.get(Calendar.DATE));
    strDayOfMonth = strDayOfMonth.length() == 1 ? ("0" + strDayOfMonth) : strDayOfMonth;

    return strYear + strMonth + strDayOfMonth;
  }

  private String pad(int iLength) {
    return pad(null, iLength);
  }

  private String pad(String strIn, int iLength) {
    StringBuffer sb = new StringBuffer(strIn == null ? "" : strIn);
    for (int i = sb.length(); i < iLength; i++) {
      sb.append(' ');
    }

    return sb.toString();
  }

  private void copyToFile(InputStream is, File file) throws IOException {
    FileOutputStream os = new FileOutputStream(file);
    byte[] bytes = new byte[4096];
    while (true) {
      int i = is.read(bytes);
      if (i < 0) {
        break;
      }
      os.write(bytes, 0, i);
    }
    is.close();
    os.close();
  }

  private String getDocumentsDir() {
    return _importDir + File.separator;
  }

  /**
   * Reads a file's content as an array of bytes.
   *
   * @param file A file to read.
   * @return The content of the file as a byte array.
   * @throws IOException I/O errors
   */
  public static byte[] readBytes(File file) throws IOException {
    FileInputStream is = new FileInputStream(file);
    byte[] bytes = new byte[(int) file.length()];
    int read = is.read(bytes);
    for (int totalRead = read; read > 0; ) {
      read = is.read(bytes, totalRead, bytes.length - totalRead);
    }
    is.close();
    return bytes;
  }

  public static byte[] getContent(InputStream is) throws IOException {
    ByteArrayOutputStream os = new ByteArrayOutputStream();
    byte[] bytes = new byte[2048];

    while (true) {
      int i = is.read(bytes);
      if (i < 0) {
        break;
      }
      os.write(bytes, 0, i);
    }
    is.close();
    os.close();

    return os.toByteArray();
  }
}
