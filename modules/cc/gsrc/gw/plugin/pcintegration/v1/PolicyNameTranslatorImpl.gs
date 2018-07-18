package gw.plugin.pcintegration.v1

uses gw.lang.reflect.IPropertyInfo
uses gw.api.util.mapping.IFieldMapper
uses gw.plugin.integration.mapping.NullFieldMapper
uses gw.plugin.integration.NameTranslatorImpl

uses java.io.File
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
}
