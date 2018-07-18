/**
 * User: dbrewster
 * Date: May 6, 2005
 * Time: 4:57:55 PM
 */

package examples.cc.plugins.document;

import com.guidewire.cc.plugin.document.IDocumentContentSource;
import com.guidewire.cc.external.entity.Document;
import com.guidewire.cc.external.entity.Claim;
import com.guidewire.cc.external.entity.Exposure;
import com.guidewire.cc.external.entity.Contact;
import gw.document.DocumentContentsInfo;

import java.io.File;
import java.io.InputStream;
import java.util.Date;

/**
 * Implementation of {@link com.guidewire.cc.plugin.document.IDocumentContentSource}. This implementation is provided
 * primarily as a proof-of-concept; it lacks many features of standard DMS systems like versioning, etc.
 *
 * WARNING:  This class is not registered.  Instead the gosu version is.
 */
public class LocalDocumentContentSource extends examples.plugins.document.BaseLocalDocumentContentSource implements IDocumentContentSource {

  public boolean addDocument(InputStream documentContents, Document document) {
    Claim claim = document.getClaim();
    DocumentInfoWrapper docInfoWrapper = new DocumentInfoWrapper(document.getName(), claim.getClaimNumber(), document.getExposure(), document.getClaimant());
    String docUID;
    if ((documentContents == null) && isDocument(document)) {
      docUID = getDocUID(docInfoWrapper);
    } else {
      docUID = addDocument(documentContents, docInfoWrapper);
      document.setDateModified(new Date());
    }
    document.setDocUID(docUID);
    return false;
  }

  public boolean isDocument(Document document) {
    if (document.getDocUID() != null) {
      File docFile = getDocumentFile(document.getDocUID(), true);
      return docFile.isFile() && docFile.exists();
    } else {
      return isDocumentFile(new DocumentInfoWrapper(document.getName(), document.getClaim().getClaimNumber(), document.getExposure(), document.getClaimant()));
    }
  }

  public DocumentContentsInfo getDocumentContentsInfo(Document document, boolean includeDocumentContents) {
    DocumentContentsInfo dci = getDocumentContents(document.getDocUID(), includeDocumentContents);
    dci.setResponseMimeType(document.getMimeType());
    return dci;
  }


  public DocumentContentsInfo getDocumentContentsInfoForExternalUse(Document document) {
    throw new UnsupportedOperationException("Not implemented");
  }

  public boolean updateDocument(Document document, InputStream isDocument) {
    updateDocument(document.getDocUID(), isDocument);
    document.setDateModified(new Date());
    return false;
  }

  public boolean removeDocument(Document document) {
    removeLinkToInfo(document.getDocUID());
    return false;
  }

  /**
   * Class which wraps required information into an identifying token for document contents
   */
  private static class DocumentInfoWrapper implements IDocumentInfoWrapper {
    private String _docName;
    private String _claimNumber;
    private int _exposureID;
    private int _claimantID;

    public DocumentInfoWrapper(String docName, String strClaimNumber, Exposure exposure, Contact claimant) {
      _docName = docName;
      _claimNumber = strClaimNumber;
      _exposureID = exposure == null ? -1 : exposure.getID().getValue();
      _claimantID = claimant == null ? -1 : claimant.getID().getValue();
    }



    public String getDocumentName() {
      return _docName;
    }

    public String getSubDirForDocument() {
      StringBuffer strSubDir = new StringBuffer();
      strSubDir.append(_claimNumber).append(File.separator);
      if (_exposureID > 0) {
        strSubDir.append("Exposure").append(_exposureID).append(File.separator);
      } else if (_claimantID > 0) {
        strSubDir.append("Claimant").append(_claimantID).append(File.separator);
      }
      return strSubDir.toString();
    }
  }
}
