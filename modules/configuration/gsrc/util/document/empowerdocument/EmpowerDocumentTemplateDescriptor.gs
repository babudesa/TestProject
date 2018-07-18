package util.document.empowerdocument
uses gw.plugin.document.IDocumentTemplateDescriptor
uses java.util.Date
uses gw.i18n.ILocale
uses java.util.Map
uses java.util.HashMap
uses java.text.SimpleDateFormat
uses gaic.plugin.cc.document.EmpowerDocumentUtil
uses gw.api.util.Logger

public class EmpowerDocumentTemplateDescriptor implements IDocumentTemplateDescriptor {
  private var _meta:Map<String, Object>

  construct(empHash:Map<String,String>) {
    var sdf = new SimpleDateFormat("MM/dd/yyyy");
    _meta = new HashMap<String, Object>();
    _meta.put("centralprintenabledext", empHash.get("CentralPrint").equalsIgnoreCase("Yes")?"True":"False");
    _meta.put("name", empHash.get("Name"));
    _meta.put("mimetype", EmpowerDocumentUtil.MIME_TYPE);
    _meta.put("templateid", empHash.get("Name")+EmpowerDocumentUtil.FILE_EXTENSION);
    _meta.put("dms", empHash.get("dms"));
    _meta.put("dateeffective", sdf.parse("1/1/2005"));
    _meta.put("dateexpires", sdf.parse("1/1/2060"));
    _meta.put("description", empHash.get("Description"));
    _meta.put("keywords", empHash.get("Keywords"));
    _meta.put("lob", empHash.get("LOB"));
    _meta.put("state", empHash.get("State"));
    _meta.put("ex_type", empHash.get("DocumentType"));
    _meta.put("ex_subtype", empHash.get("DocumentSubType"));
    _meta.put("processmethod", empHash.get("ProcessMethod"));
    _meta.put("privileged", YesNo.TC_NO);
    _meta.put("formidext", empHash.get("FormID"));
    _meta.put("saseext", empHash.get("saseext"));
    _meta.put("agentcopyext", empHash.get("AgentCopy"));
    _meta.put("datemodified", empHash.get("datemodified"));
    _meta.put("approval", "false");
    _meta.put("sendto",empHash.get("SendTo"));
    _meta.put("autoccparty",empHash.get("AutoCCParty"));
  }

  override property get ContextObjectNames() : String[] {
    return {};
  }

  override property get DateEffective() : Date {
    return _meta.get("dateeffective") as Date;
  }

  override property get DateExpiration() : Date {
    return _meta.get("dateexpires") as Date;
  }

  override property get DateModified() : Date {
    return _meta.get("datemodified") as Date;
  }

  override property set DateModified(d : Date) {
    _meta.put("datemodified", d);
  }

  override property get DefaultSecurityType() : String {
    return null;
  }

  override property get Description() : String {
    return _meta.get("description") as String;
  }

  override property get DocumentProductionType() : String {
    return null;
  }

  override property get FormFieldNames() : String[] {
    return {};
  }

  override property get Identifier() : String {
    return null;
  }

  override property get Keywords() : String[] {
    return _meta.get("keywords") as java.lang.String[]
  }

  override property get Locale() : ILocale {
    return null;
  }

  override property get MetadataPropertyNames() : String[] {
    return _meta.Keys.toTypedArray();
  }

  override property get MimeType() : String {
    return _meta.get("mimetype") as String;
  }

  override property get Name() : String {
    return _meta.get("name") as String;
  }

  override property get Password() : String {
    return null;
  }

  override property get RequiredPermission() : String {
    return null //## todo: Implement me
  }

  override property get Scope() : String {
    return null //_meta.get("scope") as String;
  }

  override property get TemplateId() : String {
    return (_meta.get("name") as String) + EmpowerDocumentUtil.FILE_EXTENSION;
  }

  override property get TemplateType() : String {
    return null //## todo: Implement me
  }

  override function getContextObjectAllowsNull(p0 : String) : boolean {
    return false;
  }

  override function getContextObjectDefaultValueExpression(p0 : String) : String {
    return null;
  }

  override public function getContextObjectDisplayName(p0 : String) : String {
    return null;
  }

  override function getContextObjectPossibleValuesExpression(p0 : String) : String {
    return null
  }

  override function getContextObjectType(p0 : String) : String {
    return null;
  }

  override function getFormFieldDisplayValue(p0 : String, p1 : Object) : String {
    return null;
  }

  override function getFormFieldValueExpression(p0 : String) : String {
    return null;
  }

  override function getMetadataPropertyValue(p0 : String) : Object {
    return _meta.get(p0);
  }

  override function getName(loc : ILocale) : String {
    return _meta.get("name") as String;
  }

}
