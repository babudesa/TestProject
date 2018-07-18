package com.dayrealm.cc.plugins.document;

/**
 * Created by IntelliJ IDEA.
 * User: sshi
 * Date: Jul 11, 2008
 * Time: 3:24:25 PM
 * To change this template use File | Settings | File Templates.
 */


import com.guidewire.cc.external.entity.*;
import com.guidewire.cc.external.typelist.DocumentSection;
import com.guidewire.cc.external.typelist.DocumentSecurityType;
import com.guidewire.cc.external.typelist.DocumentStatusType;
import com.guidewire.cc.external.typelist.DocumentType;
import com.guidewire.util.FileUtil;
import com.guidewire.external.entity.EntityFactory;
import com.guidewire.external.entity.KeyableEntity;
import com.guidewire.util.ServletProperties;
import org.apache.commons.lang.StringUtils;

import java.io.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


public abstract class LocalDocumentMetadataSource extends ConfigBasedFileSource {

    protected String getFileForUniqueId(String uniqueId) {
        String strFile = appendFileToPath(getMetadataDir(), FileUtil.makeValidPortableFileName(uniqueId) + ".xml");
        return strFile;
    }

    protected void storeDocument(String docId, Document document) {
        String filePath = getFileForUniqueId(docId);
        File documentData = new File(filePath);
        FileWriter out = null;
        try {
            out = new FileWriter(documentData);
            //--test--convertDocumentToXml(document, out);
            String xmlContent = convertDocumentToXml(document);
            out.write(xmlContent);
            out.flush();
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            if (out != null) try {out.close();} catch (Exception e){};
        }
    }
    private String convertDocumentToXml(Document document) throws Exception {
      StringBuffer retVal = new StringBuffer();
      String text;
      retVal.append("<Body>");
      retVal.append("DocUID=");
      retVal.append((text = document.getDocUID()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("DocumentIdentifier=");
      retVal.append((text = document.getDocumentIdentifier()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("docPublicID=");
      retVal.append((text = document.getPublicID()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("Active=");
      Boolean isDMS = document.isDMS();
      retVal.append(isDMS == null ? "" : isDMS.toString());
      retVal.append("\n");
      retVal.append("Name=");
      retVal.append((text = document.getName()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("Obsolete=");
      Boolean isObsolete = document.isObsolete();
      retVal.append(isObsolete == null ? "" : isObsolete.toString());
      retVal.append("\n");
      retVal.append("Description=");
      retVal.append((text = document.getDescription()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("Recipient=");
      retVal.append((text = document.getRecipient()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("section=");
      DocumentSection section = document.getSection();
      retVal.append((section == null) ? "" : (text = section.getCode()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("inbound=");
      Boolean isInbound = document.isInbound();
      retVal.append(isInbound == null ? "" : isInbound.toString());
      retVal.append("\n");
      retVal.append("SecurityType=");
      DocumentSecurityType sType = document.getSecurityType();
      retVal.append((sType == null) ? "" : (text = sType.getCode()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("ClaimPublicID=");
      Claim claim = document.getClaim();
      retVal.append((claim == null) ? "" : (text = claim.getPublicID()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("ClaimContactPublicID=");
      ClaimContact claimContact = document.getClaimContact();
      retVal.append((claimContact == null) ? "" : (text = claimContact.getPublicID()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("ExposurePublicID=");
      Exposure exposure = document.getExposure();
      retVal.append((exposure == null) ? "" : (text = exposure.getPublicID()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("MatterPublicID=");
      Matter matter = document.getMatter();
      retVal.append((matter == null) ? "" : (text = matter.getPublicID()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("Author=");
      retVal.append((text = document.getAuthor()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("MimeType=");
      retVal.append((text = document.getMimeType()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("DocType=");
      DocumentType type = document.getType();
      retVal.append((type == null) ? "" : (text = type.getCode()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("Status=");
      DocumentStatusType status = document.getStatus();
      retVal.append((status == null) ? "" : (text = status.getCode()) == null ? "" : text);
      retVal.append("\n");
      retVal.append("DateModified=");
      Date date = document.getDateModified();
      retVal.append((date == null) ? "" : (text = String.valueOf(date.getTime())) == null ? "" : text);
      retVal.append("\n");
      retVal.append("</Body>");
      return (retVal.toString());
    }



    protected Object getDocumentForUID(String uniqueId) {
        File documentData = new File(getFileForUniqueId(uniqueId));
        if (!documentData.exists()) {
          throw new IllegalArgumentException("No document exists with id: " + uniqueId);
        }
        try {
          DocumentSearchCriteria criteria = (DocumentSearchCriteria) EntityFactory.getEntityFactory().newEntity(DocumentSearchCriteria.class);
          criteria.setPublicID(uniqueId);
          return documentMatchesCriteria(documentData, criteria);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
    }
    protected void removeDocument(String uniqueId) {
        File file = new File(getFileForUniqueId(uniqueId));
        if (!file.exists()) {
          //BHJ: For now, do nothing but return. It's possible that the file got deleted out from under, by a deploy
          //      or something; since this is mainly a proof of concept implementation, we should be tolerant.
          return;
        }
        //Remove the file from the filesystem
        if (!file.delete()) {
          throw new IllegalStateException("Document could not be deleted: " + file.getName());
        }
    }

    protected void saveDocumentMetadata(Document document) {
        //Store metadata
        String docId = document.getPublicID();
        if (StringUtils.isEmpty(docId)) {
          docId = "doc" + document.getID().getValue();
          document.setPublicID(docId);
        }
        storeDocument(docId, document);
    }

    protected String getMetadataDir() {
        //FileSystem fileSystem = FileSystem.getInstance();
        //BHJ: This matches the current default in config.xml
      //  String strMetadataDir = fileSystem.getInternalConfigDir() + File.separator + "plugins\\document\\files\\documents\\";

 /*  Replace with the following sshi - 7/18/08
        System.out.println("In LocalDocumentMetadataSource: getMetadataDir()");
        String strMetadataDir = getInternalConfigDir() + File.separator + "plugins\\document\\files\\documents\\";
        strMetadataDir += "qa_metadata" + File.separator;

        File metadataDir = new File(strMetadataDir);
*/      File metadataDir = ServletProperties.getWebappContextTempDir();
  //      File metadataDir = new File(getWebappContextTempDir());
        if (!metadataDir.exists()) {
          metadataDir.mkdirs();
        }
        String strMetadataDir = metadataDir.getAbsolutePath(); 

        return strMetadataDir;
    }

    protected File[] getMetadataFiles() {
      File metadataDir = new File(getMetadataDir());
      if (!metadataDir.exists())
         throw new IllegalStateException("Metadata directory doesn't exist.");
      File[] documentFiles = metadataDir.listFiles(new FileFilter() {
        public boolean accept(File pathname) {
          return pathname.isFile();
        }
      });

      return documentFiles;
    }


    protected String getFolderPathForEntityLinks(KeyableEntity keyableBean) {
      String className = keyableBean.getID().getTypeName();
      String objName = className.substring(className.lastIndexOf(".") + 1);
      String dirName = getMetadataDir() + objName + File.separator + keyableBean.getID().getValue() + File.separator;
      return dirName;
    }

    /**
       * The parameters is an Object because there's no inheritence hierarchy in the external interfaces
       */
    protected List getMatchingDocuments(Object criteria) {

        List docList = new ArrayList();
        File[] documentFiles = getMetadataFiles();
        if (documentFiles != null) {
          try {
            for (int i = 0; i < documentFiles.length; i++) {
              File documentFile = documentFiles[i];
              if (documentFile.isFile()) {
                Document doc = documentMatchesCriteria(documentFile, criteria);
                if (doc != null)
                    docList.add(doc);
              }
            }
          } catch (Exception e) {
            throw new RuntimeException(e);
          }
        }
        return docList;
    }
    protected Document documentMatchesCriteria(File docFile, Object criteriaObj) {

        DocumentSearchCriteria criteria = null;
        String thisLine;
        String docUid = null;
        String documentIdentifier = null;
        String docPublicID = null;
        String name = null;
        String obsolete = null;
        String description = null;
        String author = null;
        String recipient = null;
        String section = null;
        String inbound = null;
        String claimPublicID = null;
        String claimContactPublicID = null;
        String exposurePublicID = null;
        String matterPublicID = null;
        String mimeType = null;
        String docType = null;
        String dateModified = null;
        String status = null;
        String securityType = null;
        String active = null;

        if (criteriaObj != null) criteria = (DocumentSearchCriteria) criteriaObj;
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(docFile));
            boolean isEmptyFile = true;
            while ((thisLine = br.readLine()) != null) {
                isEmptyFile = false;
                int idx;
                if ((idx = thisLine.indexOf("DocUID")) != -1)
                    docUid = thisLine.substring(idx + 7);
                else if ((idx = thisLine.indexOf("DocumentIdentifier")) != -1)
                    documentIdentifier = thisLine.substring(idx + "DocumentIdentifier".length() + 1);
                else if ((idx = thisLine.indexOf("docPublicID")) != -1)
                    docPublicID = thisLine.substring(idx + "docPublicID".length() + 1);
                else if ((idx = thisLine.indexOf("Name")) != -1)
                    name = thisLine.substring(idx + 5);
                else if ((idx = thisLine.indexOf("Obsolete")) != -1)
                    obsolete = thisLine.substring(idx + "Obsolete".length() + 1);
                else if ((idx = thisLine.indexOf("Description")) != -1)
                    description = thisLine.substring(idx + "Description".length() + 1);
                else if ((idx = thisLine.indexOf("Recipient")) != -1)
                    recipient = thisLine.substring(idx + "Recipient".length() + 1);
                else if ((idx = thisLine.indexOf("section")) != -1)
                    section = thisLine.substring(idx + "section".length() + 1);
                else if ((idx = thisLine.indexOf("inbound")) != -1)
                    inbound = thisLine.substring(idx + "inbound".length() + 1);
                else if ((idx = thisLine.indexOf("MimeType")) != -1)
                    mimeType = thisLine.substring(idx + "MimeType".length() + 1);
                else if ((idx = thisLine.indexOf("DocType")) != -1)
                    docType = thisLine.substring(idx + "DocType".length() + 1);
                else if ((idx = thisLine.indexOf("ClaimPublicID")) != -1)
                    claimPublicID = thisLine.substring(idx + "ClaimPublicID".length() + 1);
                else if ((idx = thisLine.indexOf("ClaimContactPublicID")) != -1)
                    claimContactPublicID = thisLine.substring(idx + "ClaimContactPublicID".length() + 1);
                else if ((idx = thisLine.indexOf("ExposurePublicID")) != -1)
                    exposurePublicID = thisLine.substring(idx + "ExposurePublicID".length() + 1);
                else if ((idx = thisLine.indexOf("MatterPublicID")) != -1)
                    matterPublicID = thisLine.substring(idx + "MatterPublicID".length() + 1);
                else if ((idx = thisLine.indexOf("Author")) != -1)
                    author = thisLine.substring(idx + 7);
                else if ((idx = thisLine.indexOf("DateModified")) != -1)
                    dateModified = thisLine.substring(idx + "DateModified".length() + 1);
                else if ((idx = thisLine.indexOf("Status")) != -1)
                    status = thisLine.substring(idx + "Status".length() + 1);
                else if ((idx = thisLine.indexOf("SecurityType")) != -1)
                    securityType = thisLine.substring(idx + "SecurityType".length() + 1);
                else if ((idx = thisLine.indexOf("Active")) != -1)
                    active = thisLine.substring(idx + "Active".length() + 1);
            }
            if (isEmptyFile)
                 return null;
            if (name != null && criteria != null && !StringUtils.isEmpty(criteria.getNameOrID())) {
              if (!name.startsWith(criteria.getNameOrID()))
               return null;

            }
            String crPublicID;
            if (docPublicID != null && criteria != null && !StringUtils.isEmpty(crPublicID = criteria.getPublicID())) {
              if (!docPublicID.equals(crPublicID)) {
              return null;
              }
            }

            if (claimPublicID != null && criteria != null) {
                Claim claimCriteria = criteria.getClaim();
                if (claimCriteria != null && !(claimCriteria.getPublicID()).equals(claimPublicID))
                  return null;
            }
            if (criteria != null && criteria.getAuthor() != null) {
              if (!criteria.getAuthor().startsWith(author))
              return null;
             }
        } catch (IOException e) {
          System.err.println("Error: " + e);
        } finally {
            try {
                if (br != null) br.close();
            } catch (IOException e) {
                System.err.println("Error: " + e);
            }
        }

        Document doc = (Document) EntityFactory.getEntityFactory().newEntity(Document.class);
        if (docUid != null && docUid.length() != 0) doc.setDocUID(docUid);
        if (documentIdentifier != null && documentIdentifier.length() != 0) doc.setDocumentIdentifier(documentIdentifier);
        if (docPublicID != null && docPublicID.length() != 0) doc.setPublicID(docPublicID);
        if (claimPublicID != null && claimPublicID.length() != 0) {
            Claim claim = (Claim) EntityFactory.getEntityFactory().getEntityByRef(Claim.class, claimPublicID);
            doc.setClaim(claim);
        }
        if (claimContactPublicID != null && claimContactPublicID.length() != 0) {
            ClaimContact claimContact = (ClaimContact) EntityFactory.getEntityFactory().getEntityByRef(ClaimContact.class, claimContactPublicID);
            doc.setClaimContact(claimContact);
        }
        if (exposurePublicID != null && exposurePublicID.length() != 0) {
            Exposure exposure = (Exposure) EntityFactory.getEntityFactory().getEntityByRef(Exposure.class, exposurePublicID);
            doc.setExposure(exposure);
        }
        if (matterPublicID != null && matterPublicID.length() != 0) {
            Matter matter = (Matter) EntityFactory.getEntityFactory().getEntityByRef(Matter.class, matterPublicID);
            doc.setMatter(matter);
        }
        if (dateModified != null && dateModified.length() != 0) doc.setDateModified(new Date(Long.parseLong(dateModified)));
        if (active != null && active.length() != 0) doc.setDMS(Boolean.valueOf(active));
        if (name != null && name.length() != 0) doc.setName(name);
        if (obsolete != null && obsolete.length() != 0) doc.setObsolete(Boolean.valueOf(obsolete));
        if (description != null && description.length() != 0) doc.setDescription(description);
        if (mimeType != null && mimeType.length() != 0) doc.setMimeType(mimeType);
        if (author != null && author.length() != 0) doc.setAuthor(author);
        if (recipient != null && recipient.length() != 0) doc.setRecipient(recipient);
        if (section != null && section.length() != 0) doc.setSection(DocumentSection.getByCode(section));
        if (inbound != null && inbound.length() != 0) doc.setInbound(Boolean.valueOf(inbound));
        if (status != null && status.length() != 0) doc.setStatus(DocumentStatusType.getByCode(status));
        if (securityType != null && securityType.length() != 0) doc.setSecurityType(DocumentSecurityType.getByCode(securityType));
        if (docType != null && docType.length() != 0) doc.setType(DocumentType.getByCode(docType));
        return doc;
    }

    /**
   * Removes all of the trailing file separators from the given String, presumed to be a directory
   */
  private static String stripTrailingSeparators(String toStrip) {
    if (StringUtils.isEmpty(toStrip)) {
      return toStrip;
    }
    StringBuffer retVal = new StringBuffer(toStrip);
    int sepLen = File.separator.length();
    while (retVal.substring(retVal.length() - sepLen, retVal.length()).equals(File.separator)) {
      retVal.delete(retVal.length() - sepLen, retVal.length());
    }
    return (retVal.toString());
  }

 
}