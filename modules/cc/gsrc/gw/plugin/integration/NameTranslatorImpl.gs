package gw.plugin.integration

uses com.guidewire.pl.web.controller.UserDisplayableException
uses gw.lang.reflect.IPropertyInfo
uses java.io.File
uses org.apache.commons.lang.ClassUtils
uses gw.plugin.integration.DataMapping
uses java.util.HashMap;
uses java.util.ArrayList;
uses gw.lang.reflect.IType
uses gw.api.util.mapping.IFieldMapper
uses gw.plugin.integration.mapping.NullFieldMapper
uses gw.plugin.integration.mapping.IdentityFieldMapper
uses gw.lang.reflect.TypeSystem

class NameTranslatorImpl implements NameTranslator {
  var _nullFieldMapper : IFieldMapper
  var _identityFieldMapper : IFieldMapper
  var _dataMapping : DataMapping
  protected var _targetNamespace : String
  var _fieldsToIgnoreByEntityType : HashMap
  private var TYPECODE_PREFIX = "TC_"
  
  construct(file : File, sourceNamespace : String, targetNamespace : String) {
    this(file, sourceNamespace, targetNamespace, new NullFieldMapper(), IdentityFieldMapper.INSTANCE)
  }
  construct(file : File, sourceNamespace : String, targetNamespace : String, nullFieldMapper:IFieldMapper, identityFieldMapper:IFieldMapper) {
    _targetNamespace = targetNamespace
    _dataMapping = new DataMapping(file, sourceNamespace, targetNamespace)
    _fieldsToIgnoreByEntityType = new HashMap()
    _nullFieldMapper = nullFieldMapper
    _identityFieldMapper = identityFieldMapper
  }

  override function translateEntityName(entityName : String) : String {
    var sourceEntityName = ClassUtils.getShortClassName( entityName )
    var targetEntityName = _dataMapping.getTargetEntityName(sourceEntityName)
    return (targetEntityName == null ? sourceEntityName : targetEntityName)
  }

  override function translateTypelistName(typelistName : String) : String {
    var sourceTypelistName = ClassUtils.getShortClassName( typelistName )
    var targetTypelistName = _dataMapping.getTargetTypeList( sourceTypelistName )
    return (targetTypelistName == null ? sourceTypelistName : targetTypelistName)
  }

  override function translateTypeCode(typeList : String, typeCode : String) : String {
    return translateTypeCode(typeList, typeCode, true)
  }

  public function translateTypeCode(typeList : String, typeCode : String, usePrefix : boolean) : String{
    if (typeCode != null && typeCode.startsWith(TYPECODE_PREFIX)) {
      typeCode = typeCode.substring(TYPECODE_PREFIX.length())
    }
    
    var targetTypeCode = _dataMapping.getTargetTypeCode(typeList, typeCode)
    var result = (targetTypeCode == null ? typeCode : targetTypeCode)
    
    if (result != null && usePrefix) {
      result = TYPECODE_PREFIX + result
    }
    return result
  }

  override function translateClass(sourceClass : IType) : IType {
    var className = sourceClass.RelativeName
    var targetName = translateEntityName( className )
    try {
      return TypeSystem.getByFullName( _targetNamespace + "." + targetName )
    } catch (e) {
      throw new UserDisplayableException( "Could not translate class " + sourceClass.Name, e.Cause )
    }
  }

  override function getFieldMapper(entity : IType, propertyInfo : IPropertyInfo) : IFieldMapper {
    if (isIgnoreField(entity, propertyInfo.getName())) {
      return _nullFieldMapper
    }
    
    var fieldMapper = _dataMapping.getFieldMapper(entity.RelativeName, propertyInfo.getName())
    if (fieldMapper == null) {
      var superEntity = entity.SuperType
      if (superEntity == null) {
        fieldMapper = _identityFieldMapper
      } else {
        fieldMapper = getFieldMapper(superEntity, propertyInfo)
      }
    }
    return fieldMapper
  }
  
  override function addFieldToIgnore(entity : IType, fieldName : String) {
    var list = _fieldsToIgnoreByEntityType.get( entity ) as List
    if (list == null) {
      list = new ArrayList()
    }
    list.add(fieldName)
    _fieldsToIgnoreByEntityType.put(entity, list)
  }
  
  private function isIgnoreField(entity : Type, fieldName : String) : boolean {
    var list = _fieldsToIgnoreByEntityType.get(entity) as List;
    if (list != null && list.contains(fieldName)) {
      return true
    }
    
    var superType = entity.SuperType
    if (superType != null) {
      return isIgnoreField(superType, fieldName)
    } else {
      return false
    }
  }

}