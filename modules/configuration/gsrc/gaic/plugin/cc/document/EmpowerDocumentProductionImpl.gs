package gaic.plugin.cc.document

uses gw.plugin.document.IDocumentTemplateDescriptor;
uses gw.document.DocumentContentsInfo;
uses java.util.Map;
uses gw.plugin.document.IDocumentProduction;
uses gw.document.DocumentContentsInfo

class EmpowerDocumentProductionImpl implements IDocumentProduction {

  override public function createDocumentSynchronously(templateDescriptor : IDocumentTemplateDescriptor, parameters : Map<Object,Object>, doc : Document) : DocumentContentsInfo {
      var empId:String = null;
      if (doc != null) {
        empId = doc.DocUID;
      }
      if (empId == null) {
        // Creating new Empower document on Empower server if it hasn't been created already
        empId = EmpowerDocumentUtil.createNewEmpowerDocument(doc, templateDescriptor);
        if (doc != null) {
          doc.ECFIDExt = empId;
          doc.DocUID = empId;
          doc.DMS = true;
          doc.TemplateIdExt = templateDescriptor.TemplateId;
          doc.PendingDocUID = empId;
        }
      }
      var empowerDocUrl = EmpowerDocumentUtil.getEmpowerDocumentURL(empId)
      // creating documentContentsInfo of ResponseMimeType = "application/URL"
      //var documentContentsInfo = new DocumentContentsInfo(gw.document.DocumentContentsInfo.URL, empowerDocUrl, "application/mpw");
      //var documentContentsInfo = new DocumentContentsInfo(gw.document.DocumentContentsInfo.URL, new ByteArrayInputStream(empowerDocUrl.getBytes("UTF-8")), "application/mpw");
      //var documentContentsInfo = new DocumentContentsInfo(gw.document.DocumentContentsInfo.URL, empowerDocUrl, null);
      //var documentContentsInfo = new DocumentContentsInfo(gw.document.DocumentContentsInfo.URL, empowerDocUrl, "text/html");
      var documentContentsInfo = new DocumentContentsInfo(gw.document.DocumentContentsInfo.URL, empowerDocUrl, null);
    
      return documentContentsInfo;
  }

  override function asynchronousCreationSupported(p0 : IDocumentTemplateDescriptor) : boolean {
    return false;
  }

  override function createDocumentAsynchronously(p0 : IDocumentTemplateDescriptor, p1 : Map<Object,Object>) : String {
    return null;
  }

  override function createDocumentAsynchronously(p0 : IDocumentTemplateDescriptor, p1 : Map<Object,Object>, p2 : Map<Object,Object>) : String {
    return null;
  }

  override function createDocumentSynchronously(templateDescriptor : IDocumentTemplateDescriptor, parameters : Map<Object,Object>) : DocumentContentsInfo {
    return createDocumentSynchronously(templateDescriptor, parameters, null);
  }

  override function synchronousCreationSupported(p0 : IDocumentTemplateDescriptor) : boolean {
    return true;
  }

}