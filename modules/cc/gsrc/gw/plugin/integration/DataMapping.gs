package gw.plugin.integration

uses gw.api.util.mapping.IFieldMapper
uses com.guidewire.pl.web.controller.UserDisplayableException

uses org.w3c.dom.Document
uses org.w3c.dom.Element

uses javax.xml.parsers.DocumentBuilderFactory
uses java.util.HashMap
uses java.util.Map
uses java.io.File
uses gw.lang.reflect.TypeSystem

class DataMapping {
  var _targetEntityNameBySourceEntityName = new HashMap()
  var _fieldMapperBySourceFieldNameBySourceEntityName = new HashMap()
  var _targetTypeCodeBySourceTypeCodeByTypeListName = new HashMap()
  var _targetTypeListNameBySourceTypeListName = new HashMap()
  var _sourceNamespace : String
  var _targetNamespace : String

  construct(file : File, sourceNamespace : String, targetNamespace : String) {
    _sourceNamespace = sourceNamespace
    _targetNamespace = targetNamespace
    var documentBuilderFactory = DocumentBuilderFactory.newInstance();
    var documentBuilder = documentBuilderFactory.newDocumentBuilder();
    // TODO pdalbora 26-Apr-2005 -- Parse with validation against the data-mapping.xsd.
    var document = documentBuilder.parse(file);
    buildEntityMappings(document);
    buildTypeListMappings(document);
  }

  public function getTargetEntityName(sourceEntityName : String) : String {
    return _targetEntityNameBySourceEntityName.get(sourceEntityName) as String;
  }

  public function getTargetFieldName(sourceEntityName : String, sourceFieldName : String) : String {
    var targetFieldNameBySourceFieldName = _fieldMapperBySourceFieldNameBySourceEntityName.get(sourceEntityName) as Map
    var fieldName : String
    if (targetFieldNameBySourceFieldName != null) {
      fieldName = targetFieldNameBySourceFieldName.get(sourceFieldName) as String
    }
    return fieldName
  }

  public function getFieldMapper(sourceEntityName : String, sourceFieldName : String) : IFieldMapper{
    var fieldMapperBySourceFieldName = _fieldMapperBySourceFieldNameBySourceEntityName.get(sourceEntityName) as Map
    var fieldMapper : IFieldMapper
    if (fieldMapperBySourceFieldName != null) {
      fieldMapper = fieldMapperBySourceFieldName.get(sourceFieldName) as IFieldMapper
    }
    return fieldMapper
  }

  public function getTargetTypeCode(typeListName : String, sourceTypeCode : String) : String {
    var targetTypeCodeBySourceTypeCode = _targetTypeCodeBySourceTypeCodeByTypeListName.get(typeListName) as Map
    var typeCode : String
    if (targetTypeCodeBySourceTypeCode != null) {
      typeCode = targetTypeCodeBySourceTypeCode.get(sourceTypeCode) as String
    }
    return typeCode
  }

  public function getTargetTypeList(typeListName : String) : String {
    return _targetTypeListNameBySourceTypeListName.get(typeListName) as String
  }

  private function buildTypeListMappings(doc : Document) : void {
    var typeListMappings = doc.getElementsByTagName("TypeListMapping")
    var i : int = 0
    while(i < typeListMappings.getLength()) {
      var typeListMapping = typeListMappings.item(i) as Element
      var typeList = typeListMapping.getAttribute("typeList")
      var targetTypeList = typeListMapping.getAttribute("targetTypeList")
      if(String.isEmpty(targetTypeList)) {
        // default to same typelist name
        targetTypeList = typeList
      }
      _targetTypeListNameBySourceTypeListName.put(typeList, targetTypeList)
      var targetTypeCodeBySourceTypeCode = new HashMap();
      var typeCodeMappings = typeListMapping.getElementsByTagName("TypeCodeMapping")
      var j : int = 0
      while(j < typeCodeMappings.getLength()) {
        var typeCodeMapping = typeCodeMappings.item(j) as Element
        var sourceTypeCode = typeCodeMapping.getAttribute("source")
        var targetTypeCode = typeCodeMapping.getAttribute("target")
        targetTypeCodeBySourceTypeCode.put(sourceTypeCode, targetTypeCode)
        j = j + 1
      }
      _targetTypeCodeBySourceTypeCodeByTypeListName.put(typeList, targetTypeCodeBySourceTypeCode)
     i = i + 1
    }
  }

  private function buildEntityMappings(doc : Document) : void{
    var entityMappings = doc.getElementsByTagName("EntityMapping")
    var i : int = 0
    while (i < entityMappings.getLength()) {
      var entityMapping = entityMappings.item(i) as Element
      var sourceEntity = entityMapping.getAttribute("source")
      var targetEntity = entityMapping.getAttribute("target")
      _targetEntityNameBySourceEntityName.put(sourceEntity, targetEntity)
      var fieldMappings = entityMapping.getElementsByTagName("FieldMapping")
      var targetFieldNameBySourceFieldName = new HashMap()
      var sourceClass = TypeSystem.getByFullName(_sourceNamespace + "." + sourceEntity)

      var j : int = 0
      while(j < fieldMappings.getLength()) {
        var fieldMapping = fieldMappings.item(j) as Element
        var sourceFieldName = fieldMapping.getAttribute("source");
        var sourceProperty = sourceClass.TypeInfo.getProperty( sourceFieldName )
        if(sourceProperty == null) {
          throw new UserDisplayableException("Unmapped source field \"" + sourceFieldName + "\" in mapping file.")
        }

        var mapperClassName = fieldMapping.getAttribute("mapperClassName")
        var mapperClass = TypeSystem.getByFullName( mapperClassName )
        var fieldMapper = mapperClass.TypeInfo.getConstructor( null ).Constructor.newInstance( null )
        var fields = fieldMapping.getElementsByTagName("MapperProperty")
        var k : int = 0
        while(k < fields.getLength()) {
          var mapperProperty = fields.item(k) as Element
          var mapperFieldName = mapperProperty.getAttribute("name");
          fieldMapper[mapperFieldName] = mapperProperty.getAttribute("value")
          k = k + 1
        }
        targetFieldNameBySourceFieldName.put(sourceProperty.getName(), fieldMapper);
        j = j + 1
      }
      _fieldMapperBySourceFieldNameBySourceEntityName.put(sourceEntity, targetFieldNameBySourceFieldName);
      i = i + 1
    }
  }
}
