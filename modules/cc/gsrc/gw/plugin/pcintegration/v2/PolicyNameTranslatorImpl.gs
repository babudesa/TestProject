package gw.plugin.pcintegration.v2

uses gw.lang.reflect.IPropertyInfo
uses gw.api.util.mapping.IFieldMapper
uses gw.plugin.integration.mapping.NullFieldMapper
uses gw.plugin.integration.NameTranslatorImpl

uses java.io.File
uses gw.lang.reflect.TypeSystem
uses gw.lang.reflect.IType

/**
 * An extension of the default NameTranslator that ignores the PublicID field.
 */
@Export
class PolicyNameTranslatorImpl extends NameTranslatorImpl
{
  construct( file : File, sourceNamespace : String, targetNamespace : String ) 
  {
    super( file, sourceNamespace, targetNamespace )
  }
  
  override function getFieldMapper( entity : IType, propertyInfo : IPropertyInfo ) : IFieldMapper 
  {
    if( "PublicID".equals(propertyInfo.Name) ) 
    {
      return new NullFieldMapper()
    } 
    else 
    {
      return super.getFieldMapper(entity, propertyInfo)
    }
  }

  /**
   * Tries to find the entity with the given name, if not found and the name starts with "CC" then
   * tries to find the entity with the "CC" truncated from the name.
   */
  override function translateEntityName(entityName : String) : String 
  {
    var targetEntityName = super.translateEntityName( entityName )
    var targetEntityType = TypeSystem.getByFullNameIfValid( _targetNamespace + "." + targetEntityName )
    if( targetEntityType == null && targetEntityName.startsWith( "CC" ) )
    {
      targetEntityType = TypeSystem.getByFullNameIfValid( _targetNamespace + "." + targetEntityName.substring( 2 ) )
      if( targetEntityType != null )
      {
        targetEntityName = targetEntityName.substring( 2 )
      }
    }
    return targetEntityName
  }
}
