package gw.plugin.integration.mapping

uses gw.api.util.mapping.ObjectConverter
uses gw.lang.reflect.IPropertyInfo;
uses com.guidewire.pl.web.controller.UserDisplayableException
uses gw.api.util.mapping.GWObjectUtils

class StringToTypelistMapper extends IdentityFieldMapper {
  construct() {}
  
  override function mapField(converter : ObjectConverter, 
                           source : Object, 
                           target : Object, 
                           sourceProperty : IPropertyInfo) {
    var sourcePropertyName = sourceProperty.getName()
    try {
      var newProperty = getTargetProperty(typeof target, sourceProperty)
      if (String.Type.isAssignableFrom( sourceProperty.Type ) && GWObjectUtils.isEnumType( newProperty.Type)) {
        if (newProperty.Writable) {      
          var newPropertyValue = converter.getTranslator().translateTypeCode(newProperty.Type.RelativeName, source[sourcePropertyName] as String)
          target[newProperty.Name] = GWObjectUtils.getTypeKeyFromCode(newPropertyValue, newProperty.Type)
        }
      }
    } catch (e) {
      throw new UserDisplayableException("Fail to map field: " + sourcePropertyName 
        + " From: " + source.toString() + " to: " + target.toString() , e.Cause)
    }
  }
}
