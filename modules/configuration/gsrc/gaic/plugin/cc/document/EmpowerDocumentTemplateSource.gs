package gaic.plugin.cc.document

uses gw.plugin.document.IDocumentTemplateSource
uses gw.i18n.ILocale
uses gw.plugin.document.IDocumentTemplateDescriptor
uses java.util.Map
uses java.util.Date
uses java.io.InputStream
uses java.util.ArrayList
uses gw.plugin.InitializablePlugin
uses java.util.HashMap
uses util.document.empowerdocument.EmpowerDocumentTemplateDescriptor
uses java.lang.Integer
uses soap.HPEmpowerService.entity.EmpowerGetTemplateDto
uses javax.xml.parsers.DocumentBuilderFactory
uses javax.xml.parsers.DocumentBuilder
uses java.io.StringReader
uses org.xml.sax.InputSource
uses org.w3c.dom.Node
uses org.w3c.dom.Element
uses gw.plugin.document.impl.LocalDocumentTemplateSource
uses gw.api.util.Logger

class EmpowerDocumentTemplateSource implements IDocumentTemplateSource, InitializablePlugin {
  private var old:LocalDocumentTemplateSource;
  private static var _empowerTemplates=new ArrayList<IDocumentTemplateDescriptor>();

  construct() {
    old = new LocalDocumentTemplateSource();
  }
  
  public static function empowerTemplatesNotAvailable():Boolean{
    return _empowerTemplates.Empty
  }
  
  override function setParameters(p0 : Map<Object,Object>) {
    old.setParameters(p0);
  }
  
  override function getDocumentTemplate(templateId : String) : IDocumentTemplateDescriptor {
    if (isEmpowerTemplate(templateId)) {
      return _empowerTemplates.firstWhere(\ i -> i.TemplateId==templateId); 
    }
    return old.getDocumentTemplate(templateId);
  }

  override function getDocumentTemplate(templateId : String, loc : ILocale) : IDocumentTemplateDescriptor {
    if (isEmpowerTemplate(templateId)) {
      return _empowerTemplates.firstWhere(\ i -> i.TemplateId==templateId); 
    }
    return old.getDocumentTemplate(templateId, loc);
  }

  override function getDocumentTemplates(date : Date, valuesToMatch : Map<Object,Object>, maxResults : int) : IDocumentTemplateDescriptor[] {
    var map = new HashMap<String,Object>()
    valuesToMatch.eachKeyAndValue( \ key, value -> map.put((key as String).toLowerCase( ), value) )
    var locale = old.extractLocale(map)
    
    var allDescriptorsArr = new ArrayList<IDocumentTemplateDescriptor>();
    _empowerTemplates = getTemplateDescriptors() // get Empower descriptors
    for (var descriptor in _empowerTemplates) {
      if (old.descriptorIsInEffect(descriptor, date) and old.descriptorMatchesAllValues(descriptor, map)) {
        if (old.descriptorIsValid(descriptor)) {
          // fix for getDocumtneTemplate needs to get a single descriptor 
          if (maxResults != 1 or locale != null or locale == descriptor.Locale) {
            allDescriptorsArr.add(descriptor);
            if ((maxResults > 0) && (allDescriptorsArr.size() >= maxResults)) {
              break;
            }
          }
        }
      }
    }
    var localTemplates = old.getDocumentTemplates(date, valuesToMatch, maxResults).toList()
    if(allDescriptorsArr.size>0){
      localTemplates.addAll(allDescriptorsArr)
    }
      return localTemplates.orderBy(\ i -> i.Name).toTypedArray()
  }

  override function getTemplateAsStream(p0 : String) : InputStream {
    return old.getTemplateAsStream(p0, null);
    //throw new java.lang.UnsupportedOperationException("Template as a stream has not be implemented") //not sure if this is used anywhere
  }

  override function getTemplateAsStream(p0 : String, p1 : ILocale) : InputStream {
    return old.getTemplateAsStream(p0, null);
    //throw new java.lang.UnsupportedOperationException("Template as a stream has not be implemented!!!!") //not sure if this is used anywhere
  }
  
  private function isEmpowerTemplate(templateId:String):boolean {
    return templateId.toLowerCase().endsWith(EmpowerDocumentUtil.FILE_EXTENSION);
  }
  
  /** Getting XML code from Empower Web Service's GetAvailableTemplates method and retreiving values for
   *  template names and metadata. Then saving it into hashtable.
   */ 
  private static function getValuesFromXML(xmlCode:String):Map<Integer, Map<String,String>>{
    var factory:DocumentBuilderFactory = DocumentBuilderFactory.newInstance()
    var builder:DocumentBuilder = factory.newDocumentBuilder()
    
    var document:org.w3c.dom.Document = builder.parse(new InputSource(new StringReader(xmlCode)))
    var rootElement = document.getDocumentElement()
    var templateNodes = rootElement.getElementsByTagName("Template")

    var templateHash = new HashMap<Integer, Map<String,String>>()
    var i:int=0
    // Iterating through all Template elements
    while(i < templateNodes.Length){
      if (templateNodes.item(i).getNodeType() == Node.ELEMENT_NODE){
        var nextLevelNode:Element = templateNodes.item(i) as Element
        var tempHash = new HashMap<String, String>() 
        // Getting Name/ID of the document
        tempHash.put("Name", checkIfEmpty(nextLevelNode.getElementsByTagName("Name").item(0).TextContent))
        // Getting metadata of the document
        tempHash.put("FormID", checkIfEmpty(nextLevelNode.getElementsByTagName("FormID").item(0).TextContent))
        tempHash.put("DocumentType", checkIfEmpty(nextLevelNode.getElementsByTagName("DocumentType").item(0).TextContent))
        tempHash.put("DocumentSubType", checkIfEmpty(nextLevelNode.getElementsByTagName("DocumentSubType").item(0).TextContent))
        tempHash.put("CentralPrint", checkIfEmpty(nextLevelNode.getElementsByTagName("CentralPrint").item(0).TextContent))
        tempHash.put("Approval", checkIfEmpty(nextLevelNode.getElementsByTagName("Approval").item(0).TextContent))
        tempHash.put("Description", checkIfEmpty(nextLevelNode.getElementsByTagName("Description").item(0).TextContent))
        tempHash.put("Keywords", checkIfEmpty(nextLevelNode.getElementsByTagName("Keywords").item(0).TextContent))       
        tempHash.put("LOB", checkIfEmpty(nextLevelNode.getElementsByTagName("LOB").item(0).TextContent))        
        tempHash.put("State", checkIfEmpty(nextLevelNode.getElementsByTagName("State").item(0).TextContent))
        tempHash.put("ProcessMethod", checkIfEmpty(nextLevelNode.getElementsByTagName("ProcessMethod").item(0).TextContent))
        tempHash.put("Privileged", checkIfEmpty(nextLevelNode.getElementsByTagName("Privileged").item(0).TextContent))
        tempHash.put("dms", checkIfEmpty(nextLevelNode.getElementsByTagName("DMS").item(0).TextContent))
        tempHash.put("saseext", checkIfEmpty(nextLevelNode.getElementsByTagName("saseext").item(0).TextContent))
        tempHash.put("AgentCopy", checkIfEmpty(nextLevelNode.getElementsByTagName("AgentCopy").item(0).TextContent))
        tempHash.put("SendTo", checkIfEmpty(nextLevelNode.getElementsByTagName("SendTo").item(0).TextContent))
        tempHash.put("AutoCCParty", checkIfEmpty(nextLevelNode.getElementsByTagName("AutoCCParty").item(0).TextContent))
        // Saving temporary hashtable into final hashtable with indices
        templateHash.put(i, tempHash)
      }
      i++
    }
    return templateHash
  }
  
  // Checking if the value is null then setting it to ""
  private static function checkIfEmpty(value:String):String{
    return value==null ? "" : value  
  }
  
  // getting array with empower templates to merge with regular templates
  private static function getTemplateDescriptors():ArrayList<IDocumentTemplateDescriptor>{
    var list = new ArrayList<IDocumentTemplateDescriptor>();
    var empowerHash:Map<Integer, Map<String,String>> = new HashMap<Integer,Map<String, String>>()
    empowerHash = getEmpowerTemplates()
    
    for (var key in empowerHash.Keys) {
      list.add(new EmpowerDocumentTemplateDescriptor(empowerHash.get(key)));
    }
    return list;
  }
  
  // function to get list of available Exstream templates with metadata in Hashtable
  public static function getEmpowerTemplates():Map<Integer, Map<String,String>>{
    var templateHash:Map<Integer, Map<String,String>> = new HashMap<Integer,Map<String, String>>()
    try{// Reading 
      var newTemplates:EmpowerGetTemplateDto[] = gaic.plugin.cc.document.EmpowerDocumentUtil.getExstreamTemplates()
      var xmlPayload:String = newTemplates*.empowerTemplate.first()
    
      if(xmlPayload!=null)
        templateHash = getValuesFromXML(xmlPayload)
      return templateHash
    }
    catch(e){
      Logger.logError("getEmpowerTemplates Error: "+e)
      return templateHash
    }
  }
}