/*
 * Guidewire ClaimCenter
 *
 * Copyright 2003 Guidewire Software, Inc. All Rights Reserved.
 * Guidewire Software, Guidewire ClaimCenter, and the Guidewire logo are trademarks of Guidewire Software, Inc.
 */

package examples.plugins.document;

import com.guidewire.util.FileUtil;
import com.guidewire.pl.plugin.IPlugin;
import com.guidewire.util.StringUtil;
import gw.document.DocumentContentsInfo;
import gw.document.DocumentExistsException;
import org.apache.commons.lang.StringUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.net.URL;
import java.util.Map;

/**
 * A very simple implementation. Assumes a document's DocUID is a direct URL.
 *
 * Note that this class currently supplies the implementation for both the CC and PC
 * versions of IDocumentSource. It is possible that in the future these interfaces will
 * conflict by having an identical method, in which case this class will have to be
 * replaced by two facades which both call into a common implementation.
 */
public abstract class BaseLocalDocumentContentSource extends ConfigBasedFileSource implements IPlugin {

  //These mode parameters are provided for testing purposes; they allow simulation of different kinds of
  // content responses. See the documentation for DocumentContentsInfo for more details on the various modes.
  // Note that not all of the simulated modes faithfully transmit the actual document contents.
  // Generally speaking, the mode parameter should not be used in production.
  private static final String MODE_PARAM = "mode";
  private static final String CONTENT_MODE = "content";
  private static final String HTML_MODE = "html";
  private static final String JSCRIPT_MODE = "jscript";
  //Determine whether a hidden frame should be targeted
  private static final String TARGET_PARAM = "target";
  //This is the script used for the jscript mode simulation
  private static final String OPEN_DOCUMENT_SCRIPT = "/com/guidewire/pl/domain/document/scripts/OpenDocument.js";
  private static final String URL_MODE = "url";
  private static final String URL_PARAM = "url";

  private String _contentMode = "content";
  private boolean _targetHiddenFrame = false;
  private String _contentURL;

// ----------------------------------------- common IDocumentSource implementation helpers ----------------

  public void setParameters(Map parameters) {
    super.setParameters(parameters);
    if (parameters != null) {
      String mode = (String) parameters.get(MODE_PARAM);
      if (!StringUtils.isEmpty(mode)) {
        _contentMode = mode;
        if (URL_MODE.equals(_contentMode)) {
          _contentURL = (String) parameters.get(URL_PARAM);
        }
      }
      String target = (String) parameters.get(TARGET_PARAM);
      if (!StringUtils.isEmpty(target)) {
        _targetHiddenFrame = "hidden".equals(target);
      }
    }
  }

  public boolean isInboundAvailable() {
    return true;
  }

  public boolean isOutboundAvailable() {
    return true;
  }
  /**
   * Builds the DocumentContentsInfo containing the document contents information. Most of the code in this method
   * exists for the testing-time "mode" parameter; see the CONTENT_MODE section for the standard content-returning scenario.
   * @param strDocUID The DocUID of the document whose contents should be returned
   * @param includeContents If true, the actual contents of the document should be included in the DocumentContentsInfo
   * @return A DocumentContentsInfo object with the metadata of the Document Contents, and possibly the contents themselves
   */
  protected DocumentContentsInfo getDocumentContents(String strDocUID, boolean includeContents) {
    DocumentContentsInfo response = null;
    if (CONTENT_MODE.equals(_contentMode)) {
        response = new DocumentContentsInfo(DocumentContentsInfo.DOCUMENT_CONTENTS, includeContents ? getContentStream(strDocUID) : null, null);
    } else if (URL_MODE.equals(_contentMode)) {
      response = new DocumentContentsInfo(DocumentContentsInfo.URL, includeContents ? _contentURL : null, null);
    } else if (HTML_MODE.equals(_contentMode)) {
      StringBuffer htmlPage = new StringBuffer();
      htmlPage.append("<HTML><BODY>This is an HTML page. There's not a good general way to display arbitrary content in a HTML page.<BR>");
      htmlPage.append("For now, here's the URL which would have been used to retrieve the content: ").append(getDocumentsURL()).append("/").append(strDocUID);
      htmlPage.append("</BODY></HTML>");
      response = new DocumentContentsInfo(DocumentContentsInfo.HTML_PAGE, includeContents ? htmlPage.toString() : null, null);
    } else if (JSCRIPT_MODE.equals(_contentMode)) {
      try {
        StringBuffer jscript = new StringBuffer();
        jscript.append("var _arg1 = \"");
        encodeContentsAsJavaScriptString(getContentStream(strDocUID), jscript);
        jscript.append("\"; ");
        jscript.append("var _strDocFileExtension = ");
        int dotIndex = strDocUID.lastIndexOf(".");
        String fileExtension = dotIndex > 0 ? strDocUID.substring(dotIndex) : "";
        if (!StringUtils.isEmpty(fileExtension)) {
          jscript.append("\"").append(fileExtension).append("\";");
        } else {
          jscript.append("null;");
        }
        //Next, add in the js file
        URL urlActions = getClass().getResource(OPEN_DOCUMENT_SCRIPT);
        appendCharContentToStringBuffer(urlActions, jscript);

        response = new DocumentContentsInfo(DocumentContentsInfo.JSCRIPT, includeContents ? jscript.toString() : null, null);
      } catch (Exception e) {
        throw new RuntimeException("Exception encountered trying to retrieve contents for for DocUID: " + strDocUID + ", includeContents = " + (includeContents ? "true" : "false") , e);
      }

    }
    if (response != null) {
      response.setTargetHiddenFrame(_targetHiddenFrame);
    }
    return response;
  }

  //Given a DocUID, create an InputStream containing the contents corresponding to that DocUID
  private InputStream getContentStream(String strDocumentId) {
    String url = getDocumentsURL() + '/' + strDocumentId;
    InputStream responseStream;
    try {
      if (url.toLowerCase().startsWith("file:")) {
        responseStream = new FileInputStream(getDocumentFile(strDocumentId, true));
      } else {
        url = StringUtil.encodeURLCharacters(url);
        responseStream = new URL(url).openStream();
      }
    } catch (Exception e) {
      throw new RuntimeException("Exception encountered trying to get the content stream for DocID: " + strDocumentId, e);
    }
    return responseStream;
  }

  // Store a new set of contents for the given DocUID
  protected void updateDocument(String docId, InputStream isDocument) {
      try {
        File file = getDocumentFile(docId);
        if (!FileUtil.isFile(file)) {
          throw new IllegalArgumentException("Document " + docId + " does not exist!");
        }
        // Rather than just overwriting the file in place, move the old file,
        // upload the new contents, and then delete the old file. This helps avoid file corruption
        // if a user views the file while it is being updated.
        File backupFile = new File(file.getPath() + ".bak");
        if (!file.renameTo(backupFile)) {
          throw new IOException("rename failed from <" + file.getAbsolutePath() + "> to <" + backupFile.getAbsolutePath() + ">");
        }

        copyToFile(isDocument, file);

        //Kill the backup file, to avoid conflicts in the future
        if (!backupFile.delete()) {
          throw new IOException("deleting file failed <" + backupFile.getAbsolutePath() + ">");
        }

      } catch (Exception e) {
        throw new RuntimeException("Exception encountered trying to update document with doc id: " + docId, e);
      }
    }

  /**
   * Store a new chunk of contents.
   * @param isDocument An input stream containing the content to be stored
   * @param docInfoWrapper Information which uniquely identifies this content
   * @return A string which can be used to retrieve the contents in the future (the DocUID)
   */
  protected String addDocument(InputStream isDocument, IDocumentInfoWrapper docInfoWrapper) {
    try {
      String strUrl = getDocUID(docInfoWrapper);

      File file = getDocumentFile(docInfoWrapper, false);
      if (FileUtil.isFile(file)) {
        throw new DocumentExistsException(strUrl + " already exists.");
      }
      copyToFile(isDocument, file);

      return strUrl;
    } catch (Exception e) {
      throw new RuntimeException("Exception encountered trying to add document with doc id: " + getDocUID(docInfoWrapper), e);
    }
  }

  protected String getDocUID(IDocumentInfoWrapper docInfoWrapper) {
    String strDocumentName = FileUtil.makeValidPortableFileName(docInfoWrapper.getDocumentName());
    if (strDocumentName == null) {
      throw new IllegalArgumentException("Document name is null.");
    }

    // The id is a relative (but unique) path to the document. Allows for mobile document source.
    String strUrl = docInfoWrapper.getSubDirForDocument() + strDocumentName;
    strUrl = convertBackSlashPathToSlashPath(strUrl);
    return strUrl;
  }

  private String convertBackSlashPathToSlashPath(String strPath) {
    if (strPath == null || strPath.length() == 0) {
      return strPath;
    }

    return strPath.replace('\\', '/');
  }

  // Remove the contents identified by the given DocUID
  protected void removeDocumentById(String strDocumentId) {
    try {
      //This assumes the current implementation, that the Id describes the location of the file
      File file = getDocumentFile(strDocumentId);
      if (!file.exists()) {
        //For now, do nothing but return. It's possible that the file got deleted out from under, by a deploy
        //      or something; since this is mainly a proof of concept implementation, we should be tolerant.
        return;
      }

      //Remove the file from the filesystem
      if (!file.delete()) {
        throw new IllegalStateException("Document could not be deleted: " + file.getName());
      }
    } catch (Exception e) {
      throw new RuntimeException("Exception encountered trying to remove document with doc id: " + strDocumentId, e);
    }
  }

  protected void removeLinkToInfo(String strDocumentId) {
    removeDocumentById(strDocumentId);
  }

  // ------------------------------------ Private helper methods ------------------------------------------

  protected void copyToFile(InputStream is, File file) throws IOException {
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

  protected boolean isDocumentFile(IDocumentInfoWrapper docInfoWrapper) {
    try {
      String strName = docInfoWrapper.getDocumentName();
      if (StringUtils.isEmpty(strName)) {
        throw new IllegalArgumentException("Document name is null or empty.");
      }

      File file = getDocumentFile(docInfoWrapper, true);

      return FileUtil.isFile(file);
    } catch (Throwable t) {
      throw new RuntimeException("Exception encountered trying to test for the existiance of document named: " + docInfoWrapper.getDocumentName(), t);
    }
  }

  private File getDocumentFile(IDocumentInfoWrapper docInfoWrapper, boolean checkDemoFolder) {
    String strSubDir = docInfoWrapper.getSubDirForDocument();

    File dirDoc = new File(getDocumentsDir() + strSubDir);
    if (!dirDoc.isDirectory()) {
      if (!dirDoc.mkdirs()) {
        throw new IllegalStateException("Error creating directory <" + dirDoc.getAbsolutePath() + ">");
      }
    }

    return getDocumentFile(strSubDir + FileUtil.makeValidPortableFileName(docInfoWrapper.getDocumentName()), checkDemoFolder);
  }

  protected String getDocumentsDir() {
    return getDocumentsPath() + File.separator;
  }

  protected String getDemoDocumentsDir() {
    return getDemoDocumentsPath() + File.separator;
  }

  protected File getDocumentFile(String relativePath) {
    return getDocumentFile(relativePath, false);
  }

  protected File getDocumentFile(String relativePath, boolean checkDemoFolder) {
    File file = new File(getDocumentsDir(), relativePath);
    if (!file.exists() && checkDemoFolder) {
      file = new File(getDemoDocumentsDir(), relativePath);
    }
    return file;
  }

  private static void encodeContentsAsJavaScriptString(InputStream is, StringBuffer sbData) throws IOException {
    byte[] bytes = new byte[2048];
    while (true) {
      int i = is.read(bytes);
      if (i < 0) {
        break;
      }
      getJScriptStringFromBytes(sbData, bytes, i);
    }
  }

  private static void getJScriptStringFromBytes(StringBuffer sbData, byte[] bytes, int iSize) {
    for (int i = 0; i < iSize; i++) {
      int iByte = bytes[i] & 0x000000ff;
      String strHex = Integer.toHexString(iByte);
      if (strHex.length() == 1) {
        sbData.append("\\x0");
      } else {
        sbData.append("\\x");
      }
      sbData.append(strHex);
    }
  }

  private void appendCharContentToStringBuffer(URL from, StringBuffer to) throws IOException{
    Reader is = FileUtil.getFileReader(from);

    char[] chars = new char[2048];

    while (true) {
      int numRead = is.read(chars);
      if (numRead < 0) {
        break;
      }
      for (int i=0;i<numRead;i++) {
        char ch = chars[i];
        to.append(ch);
      }
    }
    is.close();
  }



//---------- Wrapper classes to factor out differences between app-specific document info --------------------------

  /**
   * Class which wraps required information into an identifying token for document contents
   */
  protected static interface IDocumentInfoWrapper {
    public String getDocumentName();
    public String getSubDirForDocument();
  }
}
