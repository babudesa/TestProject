/**
 * Created by IntelliJ IDEA.
 * User: sshi
 * Date: Jul 14, 2008
 * Time: 2:22:37 PM
 * To change this template use File | Settings | File Templates.
*/
package com.dayrealm.cc.plugins.document;

import com.guidewire.pl.plugin.InitializablePlugin;
import com.guidewire.logging.LoggerCategory;
import com.guidewire.cc.plugin.document.IDocumentMetadataSource;
import com.guidewire.cc.external.entity.*;
import com.guidewire.external.entity.KeyableEntity;
import com.guidewire.external.entity.EntityFactory;

import java.io.*;
import java.util.List;
import java.rmi.RemoteException;

/**
 * QA test java plugin for IDocumentMetadataSource.
 * <p/>
 * <b>Summary:</b>
 * <p/>
 * This plugin provides the following functionalities:
 * <p/>
 * The functionalities provided here are based on the requirements of http://wiki/index.php/Document_Management_Testing
 * <ul>
 * <li>1. getDocumentLinkedToEntity
 * <li>2. isDocumentLinkedToEntity
 * <li>3. linkDocumentToEntity
 * <li>4. removeDocument
 * <li>5. retrieveDocument
 * <li>6. saveDocument
 * <li>7. searchDocument
 * <li>7. unlinkDocumentFromEntity
 * </ul>
 * <p/>
 *
 * To get the above functionalities work, need to do the following:
 * <ul>
 * <li> Login as su/gw, open up a claim, go to Document, will call searchDocument
 * <li>Create a new document, will call saveDocument
 * <li>Delete document, will call removeDocument
 * <li>Go to Workplan page, open up a activity detail, click Link Document, will call getDocumentsLinkedToEntity, isDocumentLinkedToEntity,isDocumentLinkedToEntity
 * <li>(Create a new activity,) create document for the activity. will call linkDocumentToEntity while update this activity.
 * <li>Create a document in new email, will call retriveDocument while send email.
 * <li>Remove the document from activity, update the activity, will call unlinkDocumentFromEntity
 */

public class IDocumentMetadataSourceJavaTest extends LocalDocumentMetadataSource implements IDocumentMetadataSource, InitializablePlugin {
  //  private String _rootDir;
  //  private String _tempDir;
    private LoggerCategory _logger = null;

    public IDocumentMetadataSourceJavaTest() {
        _logger = LoggerCategory.PLUGIN;
        _logger.info("*** IDocumentMetadataSourceJavaTest is initialized.***");
    }

    /**
    * Retrieves the set of documents which match the given search criteria.
    *
    * @param criteria The search criteria to be used
    * @return return The DocumentSearchResult object mostly encapsulates a set of Document objects
    * containing information about the documents matching the search criteria.
    */
    public DocumentSearchResult searchDocuments(DocumentSearchCriteria criteria, com.guidewire.cc.plugin.util.RemotableSearchResultSpec searchResultSpec) throws RemoteException {
      _logger.info("*** IDocumentMetadataSourceJavaTest - searchDocuments is called.***");
      List docList = getMatchingDocuments(criteria);
      DocumentSearchResult result = (DocumentSearchResult) EntityFactory.getEntityFactory().newEntity(DocumentSearchResult.class);
      result.setSummaries((Document[])docList.toArray(new Document[docList.size()]));
      if (searchResultSpec.isIncludeTotal())
        result.setTotalResults(new Integer(docList.size()));
        return result;
    }

    /**
    * Link a document to an entity.
    *
    * @param entity The entity to be linked to.
    * @param document The document will be linked to.
    */
    public void linkDocumentToEntity(KeyableEntity entity, Document document)
    {
        _logger.info("*** IDocumentMetadataSourceJavaTest - linkDocumentToEntity is called.***");
        String folderPath = getFolderPathForEntityLinks(entity);
        File linkFile = new File(folderPath + document.getPublicID());
        if (!linkFile.getParentFile().exists()) {
          linkFile.getParentFile().mkdirs();
        }
        try {
            linkFile.createNewFile();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    /**
    * Link a document to an entity.
    *
    * @param entity The entity which the caller wants the linked documents.
    * @return DocumentSearchResult containing the Documents linked to the given Entity
    */
    public DocumentSearchResult getDocumentsLinkedToEntity(KeyableEntity entity)
    {
        _logger.info("*** IDocumentMetadataSourceJavaTest - getDocumentsLinkedToEntity is called.***");
        DocumentSearchResult results = (DocumentSearchResult) EntityFactory.getEntityFactory().newEntity(DocumentSearchResult.class);
        KeyableEntity bean = (KeyableEntity) entity;
        if (bean.getID().getValue() > 0) {
            String folderPath = getFolderPathForEntityLinks(entity);
            File linkDir = new File(folderPath);
            if (linkDir.exists()) {
              File[] linkFiles = linkDir.listFiles();
              for (int i = 0; i < linkFiles.length; i++) {
                File linkFile = linkFiles[i];
                String linkID = linkFile.getName();
                File documentFile = new File(getMetadataDir() + linkID + ".xml");
                Document doc = documentMatchesCriteria(documentFile, null);
                if (doc != null) results.addToSummaries(doc);
              }
            }
         }
        return results;
    }
    /**
     * Determine whether a given Document is already linked to a given Entity.
     *
     * @param entity The entity object.
     * @param document The document which might be linked.
     * @return true if the entity and document are already linked, false if not.
    */
    public boolean isDocumentLinkedToEntity(KeyableEntity entity, Document document)
    {
        _logger.info("*** IDocumentMetadataSourceJavaTest - isDocumentLinkedToEntity is called.***");
         KeyableEntity bean = (KeyableEntity) entity;
        if (bean.getID().getValue() < 0) return false;
        String folderPath = getFolderPathForEntityLinks(entity);
        File linkFile = new File(folderPath + document.getPublicID());
        return linkFile.exists();
    }
    /**
     * Indicate that a link should no longer exist between the given Entity and the given Document.
     *
     * @param entity The entity object.
     * @param document The document which might be linked.
    */
    public void unlinkDocumentFromEntity(KeyableEntity entity, Document document)
    {
        _logger.info("*** IDocumentMetadataSourceJavaTest - unlinkDocumentFromEntity is called.***");
        String folderPath = getFolderPathForEntityLinks(entity);
        File linkFile = new File(folderPath + document.getPublicID());
        if (linkFile.exists()) {
          linkFile.delete();
        }
    }
   /**
     * Retrieves the complete metadata for a single document, identified by the uniqueId string.
     *
     * @param uniqueId Uniquely identify the desired document, so that the appropriate metadata can be returned.
     * @return Document A completely initialized Document object with the latest information from DMS
    */
    public Document retrieveDocument(java.lang.String uniqueId)
    {
        _logger.info("*** IDocumentMetadataSourceJavaTest - retrieveDocument is called.***");
        return (Document)getDocumentForUID(uniqueId);
    }
    /**
      * Saves the complete metadata for a single document.
      *
      * @param document the new set of metadata to be saved to the backing DMS system.
     */
    public void saveDocument(Document document)
    {
        _logger.info("*** IDocumentMetadataSourceJavaTest - saveDocument is called.***");
        saveDocumentMetadata(document);

    }

  public boolean isInboundAvailable() {
     return true;
   }

   public boolean isOutboundAvailable() {
     return true;
   }

   /**
      * Remove the indicated document from the DMS system.
      *
      * @param document the set of metadata is saved in the backing DMS system.
     */
    public void removeDocument(Document document)
    {
        _logger.info("*** IDocumentMetadataSourceJavaTest - removeDocument is called.***");
        removeDocument(document.getPublicID());
      }
}

