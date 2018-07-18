package gaic.plugin.cc.document

uses soap.HPEmpowerService.api.HPEmpowerService

uses com.guidewire.pl.web.controller.UserDisplayableException
uses javax.jws.WebMethod
uses gaic.webservice.util.SSOCallHandler
uses soap.HPEmpowerService.entity.*
uses gw.document.DocumentCreationInfo
uses gw.api.util.Logger
uses util.document.empowerdocument.EmpowerDocumentPayloadUtil
uses com.gaic.claims.ecfdocinterface.plugin.DocumentContentSource
uses gw.plugin.document.IDocumentTemplateDescriptor

/**
 * This API provides methods for creating, removing, opening and finalizing HP Empower documents 
 * and also getting available templates from HP Exstream
 */

public class EmpowerDocumentUtil {
  public static final var MIME_TYPE:String = "application/mpw";
  public static final var FINALIZED_MIME_TYPE:String = "application/mpwf";
  public static final var FILE_EXTENSION:String = ".mpw";
  
  construct() { 
  }
  
    /**
   * Retrieves available Exstream templates
   *
   * @return The list of templates available in Exstream
   */
  @WebMethod
  public static function getExstreamTemplates() : EmpowerGetTemplateDto[] {
    // Retrieving the list of all templates from Exstream
    var result:EmpowerGetTemplateDto[]
    try{
      var _api = new HPEmpowerService()  
      _api.addHandler(new SSOCallHandler())
      result = _api.getAvailableTemplates("ClaimsEmpower")
      return result
    }
    catch(e){
      Logger.logError("getExstreamTemplates Error : " + e + "\n" + e.StackTraceAsString)
      throw new UserDisplayableException("HP Empower Documents are unavailable. Please contact ClaimCenter Support.")
    }
  }  
  
  /**
   * Creates HP Empower document
   *
   * @param templateID
   * @param xmlPayload
   * @return ID of the document in Empower
   */
  @WebMethod
  public static function createNewEmpowerDocument(doc:Document, template:IDocumentTemplateDescriptor) : String {
    // Creating new document in HP Empower
    try{
      var _api = new HPEmpowerService()
      _api.addHandler(new SSOCallHandler())
      var xmlPayload = EmpowerDocumentPayloadUtil.buildEmpowerDocumentXML(doc, template)
      return _api.createEmpowerDocument("ClaimsEmpower", xmlPayload)
    }
    catch(e){
      Logger.logError("createEmpowerDocument Error : " + e + "\n" + e.StackTraceAsString)
      throw new UserDisplayableException("Documents cannot be created. Please contact ClaimCenter Support.")
    }
  }
  
    /**
   * Retrieves HP Empower document URL by document ID
   *
   * @param documentID
   * @return document URL as String
   */
  @WebMethod
  public static function getEmpowerDocumentURL(documentID : String):String{
    try{
      var _api = new HPEmpowerService()
      _api.addHandler(new SSOCallHandler())
      var empowerDocumentURL = _api.getEmpowerDocumentUrl(documentID)
      if(empowerDocumentURL==null){
        throw new com.guidewire.pl.web.controller.UserDisplayableException("Requested Document does not exist in HP Empower") 
      }
      else {
        return empowerDocumentURL
      }
    }
    catch(e){
      Logger.logError("GetEmpowerDocumentURL Error : "+ e + "\n" + e.StackTraceAsString)
      throw new UserDisplayableException("HP Empower is unavailable. Please contact ClaimCenter Support.")
    }
  }
  
  /**
   * Deletes the document from empower if it is an empower document and the screen is cancelled during creation
   */
  public static function maybeDeleteEmpowerDocFromScreenCancel(DocumentCreationInfo:DocumentCreationInfo) {
    if (DocumentCreationInfo.Document != null && DocumentCreationInfo.Document.DocUID != null && isUnFinalizedEmpowerDocument(DocumentCreationInfo.Document)) {
      removeEmpowerDocument(DocumentCreationInfo.Document.DocUID)
    }
  }
  
  /**
   * Deletes HP Empower document
   *
   * @param empowerDocumentID
   * @return ID of the document in Empower
   */
  @WebMethod
  public static function removeEmpowerDocument(documentId : String) : String {
    try{
      var _api = new HPEmpowerService()
      _api.addHandler(new SSOCallHandler())
      return _api.removeEmpowerDocument(documentId)
    }
    catch(e){
      Logger.logError("removeEmpowerDocument Error : " + e + "\n" + e.StackTraceAsString);
      throw new UserDisplayableException("HP Empower is unavailable. Please contact ClaimCenter Support.")
    }
  }
  
  /**
   * Finalizes (commits) HP Empower document
   *
   * @param empowerDocID
   * @return status
   */
  @WebMethod
  public static function finalizeEmpowerDocument(document : Document) : String {
    try{
      var _api = new HPEmpowerService()
      _api.addHandler(new SSOCallHandler())
      
      var ecfMetadata = EmpowerDocumentPayloadUtil.ecfMetadataForFinalizing(document)
      var centralPrint = document.ex_CentralPrint && (document.ex_CentralPrintCancelled==null || document.ex_CentralPrintCancelled==false)
      var centralPrintMetadata:String = null
      if (centralPrint == true) {
        centralPrintMetadata = DocumentContentSource.generateCentralPrintMetadata(document, java.lang.Long.valueOf(document.ex_CentralPrintRowNumInDb), document.DocUID+".pdf", true)
      }
      
      var ecfFlag = true
      var empowerDocId = document.ECFIDExt
      var result = _api.finalizeEmpowerDocument("ClaimsEmpower", empowerDocId, ecfFlag, ecfMetadata, centralPrint, centralPrintMetadata)
      return result
    }
    catch(e){
      Logger.logError("Error while Finalizing Empower Document : "+ e + "\n" + e.StackTraceAsString);
      throw e
    }
  }
  
  /**
   * Cancels Central Print for HP Empower document if the user chooses to cancel it 
   * on Documents screen by pushing a button. The button is available until 9pm of the day of document creation,
   * before the CentralPrint job runs on the Exstream server. After it Central Print cannot be cancelled.
   *
   * @param documentID
   * @return status
   */
  @WebMethod
  public static function cancelCentralPrintEmp(empDocID : String) : Boolean {
    try{
      var _api = new HPEmpowerService()
      _api.addHandler(new SSOCallHandler())
      var applicationCode = "016"
      var result = _api.cancelEmpowerTransaction(empDocID, applicationCode)
      if(result>0){
        Logger.logInfo("Cancel Central Print for Empower Document "+ empDocID + " is successful! " + result + " requests cancelled.")
        return true
      }
      return false
    }
    catch(e){
      Logger.logError("Error while Cancelling Central Print for Empower Document : "+ e + "\n" + e.StackTraceAsString)
      throw e
    }
  }
  
  /**
   * Checks if the template is of HP Empower mimetype
   */
  public static function isEmpowerTemplate(dci:DocumentCreationInfo):boolean {
    return (dci.DocumentTemplateDescriptor.MimeType == MIME_TYPE);
  }
  
  /**
   * Checks if the template is of HP Empower mimetype
   */
  public static function isFinalizedEmpowerDocumentPreECF(d:Document):boolean {
    return (d.MimeType == FINALIZED_MIME_TYPE);
  }
  
  public static function isFinalizedEmpowerDocumentPostECF(d:Document):boolean {
    return (d.TemplateIdExt != null && d.TemplateIdExt.toLowerCase().endsWith(FILE_EXTENSION) && d.MimeType != FINALIZED_MIME_TYPE && d.MimeType != MIME_TYPE);
  }
  
    /**
   * Checks if the document is of HP Empower mimetype
   */
  public static function isUnFinalizedEmpowerDocument(d:Document):boolean {
    return (d.MimeType == MIME_TYPE);
  }
}