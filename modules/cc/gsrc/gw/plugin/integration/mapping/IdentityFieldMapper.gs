package gw.plugin.integration.mapping

uses gw.lang.reflect.IPropertyInfo

class IdentityFieldMapper extends FieldMapperBase {
  // define a read-only var
  static var _INSTANCE : IdentityFieldMapper = new IdentityFieldMapper()
  
  static property get INSTANCE() : IdentityFieldMapper {
    return _INSTANCE
  }

  construct() {}
  
  override function getTargetProperty(targetType : Type, sourceProperty : IPropertyInfo) : IPropertyInfo {
    return targetType.TypeInfo.getProperty( sourceProperty.Name )
  }

  override function getTargetFieldName(sourceProperty : IPropertyInfo) : String {
    return sourceProperty.Name;
  }
}
