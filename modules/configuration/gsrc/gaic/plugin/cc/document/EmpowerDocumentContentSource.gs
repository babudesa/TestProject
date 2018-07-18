package gaic.plugin.cc.document

uses gw.plugin.document.IDocumentContentSource
uses gw.document.DocumentContentsInfo
uses java.io.InputStream
uses gw.api.system.database.SequenceUtil


class EmpowerDocumentContentSource implements IDocumentContentSource {
  private var old:com.gaic.claims.ecfdocinterface.plugin.DocumentContentSource;
  
  construct() {
    old = new com.gaic.claims.ecfdocinterface.plugin.DocumentContentSource();
  }


  override property get InboundAvailable() : boolean {
    return old.InboundAvailable;
  }

  override property get OutboundAvailable() : boolean {
    return old.OutboundAvailable;
  }

  override function addDocument(stream : InputStream, doc : Document) : boolean {
    if (EmpowerDocumentUtil.isUnFinalizedEmpowerDocument(doc)) {
      doc.DateModified = new java.util.Date();
      if (doc.ex_CentralPrint == true) {
        doc.ex_CentralPrintRowNumInDb = java.lang.Long.toString(SequenceUtil.next(100, "CentralPrintSequence"));
      }
      return false;
    } else {
      return old.addDocument(stream, doc);
    }
  }

  override function getDocumentContentsInfo(p0 : Document, p1 : boolean) : DocumentContentsInfo {
    return old.getDocumentContentsInfo(p0, p1);
  }

  override function getDocumentContentsInfoForExternalUse(p0 : Document) : DocumentContentsInfo {
    return old.getDocumentContentsInfoForExternalUse(p0);
  }

  override function isDocument(p0 : Document) : boolean {
    return old.isDocument(p0);
  }

  override function removeDocument(p0 : Document) : boolean {
    return old.isDocument(p0);
  }

  override function updateDocument(p0 : Document, p1 : InputStream) : boolean {
    return old.updateDocument(p0, p1);
  }

}
