package gw.plugin.integration.mapping

uses gw.lang.reflect.IPropertyInfo

class NameTranslatingFieldMapper extends FieldMapperBase {
  var _newFieldName : String as newFieldName

  override function getTargetProperty(targetType : Type, 
                             sourceProperty : IPropertyInfo) : IPropertyInfo {
    return targetType.TypeInfo.getProperty( _newFieldName )
  }

  override function getTargetFieldName(sourceProperty : IPropertyInfo) : String {
    return _newFieldName
  }

  function setNewFieldName(newFieldName2 : String) {
    _newFieldName = newFieldName2
  }
}
