package gw.plugin.document.impl;

uses gw.plugin.document.impl.BaseServerSideDocumentProductionImpl;
uses gw.plugin.document.IDocumentTemplateDescriptor;
uses gw.document.DocumentContentsInfo;
uses java.io.ByteArrayOutputStream;
uses java.io.ByteArrayInputStream;
uses java.lang.IllegalArgumentException;
uses java.util.HashMap;
uses gw.plugin.document.IDocumentProductionBase
uses gw.api.sree.StyleReportAPI

@Export
class BaseReportDocumentProductionImpl extends BaseServerSideDocumentProductionImpl implements IDocumentProductionBase
{
  var api = new soap.sree.api.SoapRepositoryPortType()
  var rrs = new soap.sree.entity.RepletRequestStruct()
  
  // this map is used to store values needed for SoapRepository API calls.  Every call requires a valid ticket obtained
  // from a successful login.
  var _map : HashMap<String, String>
  var ticketString = "ticket"
  var repletIDString = "repletID"
  var exportIDString = "exportID"
  
  construct(){
    _map = new HashMap<String,String>()
  }
  
  /**
   * always login with system user regardless of current logged in user and returns the session ticket.
   */
  function login() {
    var ticket = StyleReportAPI.ticketLogin( gw.api.sree.SREEUtil.getSessionID() );
    _map[ticketString] = ticket

  }
  
  function createReplet(templateID : String, formFieldNames : String[], formFieldValues : String[]) {
    var report = find (report in SREEReport where report.FullPath == templateID).getAtMostOneRow();
    if ((report == null) or !report.DocumentReport) {
      throw new IllegalArgumentException(displaykey.Error.Document.InvalidRepletID)
    }
    rrs.name = "create";
    rrs.paramNames = formFieldNames;
    rrs.paramValues = formFieldValues;
    var repletID = api.executeReplet(_map.get(ticketString), templateID, gw.api.sree.StyleReportAPI.REPLET, rrs);
    _map.put(repletIDString, repletID)
  }

  /**
   * It is easier to test this function as it takes String for templateID, rather than an IDocumentTemplateDescriptor
   */  
  function generateDocument(mimeType : String ) : DocumentContentsInfo {
    var exportID = api.export(_map.get(ticketString), _map.get(repletIDString), getFormatForMimeType(mimeType));
    _map.put(exportIDString, exportID)
    
    var out = new ByteArrayOutputStream()
    var buf : byte[]
    while (true) {
      buf = api.nextBlock(_map[ticketString], exportID);
      if (buf == null) {
        break;
      }
      out.write(buf);
    } 
    out.flush();
    out.close();
    api.logout(ticketString);
        
    return new DocumentContentsInfo(DocumentContentsInfo.DOCUMENT_CONTENTS, new ByteArrayInputStream(out.toByteArray()), mimeType);
  }
  
  override function performDocumentCreation(templateDescriptor : IDocumentTemplateDescriptor, formFieldNames : String[], formFieldValues : String[]) : DocumentContentsInfo {    
    login()
    createReplet(templateDescriptor.TemplateId, formFieldNames, formFieldValues)
    return generateDocument( templateDescriptor.MimeType )        
  }
  
  function getFormatForMimeType(mimeType : String) : String {
    if (mimeType.equals("application/pdf")) {
      return gw.api.sree.StyleReportAPI.PDF //PDF
    } else if (mimeType.equals("application/csv")) {
      return gw.api.sree.StyleReportAPI.CSV //return "CSV"
    } else if (mimeType.equals("text/html")) {
      return gw.api.sree.StyleReportAPI.HTML //return "HTML"
    } else if (mimeType.equals("application/rtf")) {
      return gw.api.sree.StyleReportAPI.RTF //return "RTF"
    } else if (mimeType.equals("image/svg+xml")) {
      return gw.api.sree.StyleReportAPI.SVG //return "SVG"
    }
    throw new IllegalArgumentException("Unsupported MIME type " + mimeType);
  }
  
  // for test class to get hold of map object
  function getMap() : HashMap<String, String> {
    return _map
  }
}
