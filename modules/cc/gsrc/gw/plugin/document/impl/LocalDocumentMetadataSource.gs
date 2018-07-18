package gw.plugin.document.impl
uses gw.plugin.document.IDocumentMetadataSource
uses gw.api.util.DisplayableException
uses java.util.Map
uses gw.plugin.util.RemotableSearchResultSpec
uses gw.plugin.InitializablePlugin
uses java.io.File
uses java.io.IOException
uses java.lang.RuntimeException
uses java.io.FileInputStream
uses java.io.FileNotFoundException
uses java.lang.Exception
uses gw.document.DocumentsUtilBase

class LocalDocumentMetadataSource extends BaseLocalDocumentMetadataSource  
  implements IDocumentMetadataSource, InitializablePlugin {
  var _defaultResultSpec : RemotableSearchResultSpec
  
  /** This will match the document to the criteria.  
  *
  * IMPLEMENTATION NOTE:  This should be overriden in sub classes and call super.
  */
  protected override function documentMatchesCriteria( doc : Document, criteria : DocumentSearchCriteria) : boolean  {
    if (not super.documentMatchesCriteria( doc, criteria )) {
      return false;
    }
    if (criteria.Claim != null and doc.Claim != criteria.Claim) {
        return false
    }
    if (criteria.RelatedTo != null and doc.RelatedTo != criteria.RelatedTo) {
        return false
    }
    if (criteria.Claimant != null and doc.Claimant != criteria.Claimant) {
      return false
    }
    if (criteria.ClaimContact != null and doc.ClaimContact != criteria.ClaimContact) {
      return false
    }
    return true
  }
  
  override function setParameters( params: Map ) {
    _defaultResultSpec = new RemotableSearchResultSpec()
    _defaultResultSpec.GetNumResultsOnly = false
    _defaultResultSpec.IncludeTotal = true
    _defaultResultSpec.MaxResults = 1024
    _defaultResultSpec.StartRow = 0
  }

  override function linkDocumentToEntity( entity : KeyableBean, doc : Document ) {
    if (entity.New) {
      throw new DisplayableException("Attemting to use a new entity")
    }    

    if (entity typeis Claim) {
      doc.Claim = entity
    } else if (entity typeis ClaimContact) {
      if (entity.Claimant) {
        doc.Claimant = entity.Contact
      } else {
        doc.ClaimContact = entity
      }
    } else if (entity typeis Contact) {
      doc.Claimant = entity
    } else {
      var folderPath = getFolderPathForBeanLinks(entity);
      var linkFile = new File(folderPath + doc.PublicID);
      if (!linkFile.getParentFile().exists()) {
        linkFile.getParentFile().mkdirs();
      }
      try {
        linkFile.createNewFile();
      } catch (e : IOException ) {
        throw new RuntimeException(e);
      }
    }

    saveDocument(doc)
  }

  override function getDocumentsLinkedToEntity( entity : KeyableBean ) : DocumentSearchResult  {
    var results = new DocumentSearchResult()
    
    if (!entity.New) {
      var dsc = new DocumentSearchCriteria()
      if (entity typeis Claim) {
        dsc.Claim = entity
        results = searchDocuments( dsc, _defaultResultSpec )
      }
      else if (entity typeis ClaimContact) {
        if (entity.Claimant) {
          dsc.Claimant = entity.Contact
        } else {
          dsc.ClaimContact = entity
        }
        results =  searchDocuments( dsc, _defaultResultSpec )
      }
      else if (entity typeis Contact) {
        dsc.Claimant = entity
        results =  searchDocuments( dsc, _defaultResultSpec )
      }
      else {
        var folderPath = getFolderPathForBeanLinks(entity)
        var linkDir = new File(folderPath)
        if (linkDir.exists()) {
          var linkFiles = linkDir.listFiles();
          for (linkFile in linkFiles) {
            var linkID = linkFile.Name
            var documentFile = new File(getMetadataDir(), linkID + ".xml");
            var xmlStream : FileInputStream = null
            try {
              xmlStream = new FileInputStream(documentFile);
              var document = DocumentsUtilBase.deserializeXmlTo(xmlStream, Document) as Document              
              results.addToSummaries(document);
            } catch (fnfe : FileNotFoundException) {
              //The document may have been deleted; just remove this link
              linkFile.delete();            
            } catch (e : Exception) {
              throw new RuntimeException(e)
            } finally {
              if (xmlStream != null) {
                try { xmlStream.close(); } catch (e : Exception) {}
              }
            }
          }
        }
      }
    }
    return results
  }

  override function isDocumentLinkedToEntity( entity : KeyableBean, doc : Document ) : boolean  {
    if (!entity.New) {
      if (entity typeis Claim) {
        return doc.Claim == entity
      }
      else if (entity typeis ClaimContact) {
        if (entity.Claimant) {
          return doc.Claimant == entity.Contact
        } else {
          return doc.ClaimContact == entity
        }
      }
      else if (entity typeis Contact) {
        return doc.Claimant == entity
      } else {
        var folderPath = getFolderPathForBeanLinks(entity)
        var linkFile = new File(folderPath + doc.PublicID);
        return linkFile.exists();
      }
    }
    return false;
  }

  override function unlinkDocumentFromEntity( entity : KeyableBean, doc : Document ) {
    var changed = false
    if (entity typeis Claim) {
      if (doc.Claim == entity) {
        doc.Claim = null
        changed = true
      }
    } else if (entity typeis ClaimContact) {
      if (entity.Claimant) {
        if (doc.Claimant == entity.Contact) {
          doc.Claimant = null
          changed = true
        }
      }
      else {
        if (doc.ClaimContact == entity) {
          doc.ClaimContact = null
          changed = true
        }
      }
    } else {
      var folderPath = getFolderPathForBeanLinks(entity);
      var linkFile = new File(folderPath + doc.PublicID);
      if (linkFile.exists()) {
        linkFile.delete();
        changed = true
      }
    }
    if (changed) {
      saveDocument(doc)
    }
  }
  
  private function getFolderPathForBeanLinks(keyableBean : KeyableBean) : String{
    var className = keyableBean.ID.Type.RelativeName
    var dirName = getMetadataDir() + File.separator + className + File.separator + keyableBean.ID.Value + File.separator;
    return dirName;
  }
}
