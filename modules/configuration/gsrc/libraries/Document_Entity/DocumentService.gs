package libraries.Document_Entity

@WebService
class DocumentService {
  public function getDocumentPublicID(docUID : String) : String {
    var z = findDocument(docUID);
    if (z == null) return null;
    return z.PublicID;
  }
  
  public function setDocument(doc : Document) : Document {
    gw.transaction.Transaction.getCurrent().commit();
    return doc;
  }
  
  public function getDocumentName(docUID : String) : String {
    var z = findDocument(docUID);
    if (z == null) return null;
    return z.Name;
  }
  
  private function findDocument(docUID : String) : Document {
    var doc = find (var a in Document where a.DocUID == docUID);
    if (doc == null) return null;
    return doc.FirstResult;
  }
  
  public function obsoleteDocument(docUID : String) {
    var doc = findDocument(docUID);
    if (doc == null) return;
    doc.Obsolete = true;
    gw.transaction.Transaction.getCurrent().commit();
  }
}