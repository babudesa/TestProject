package gw.plugin.integration.mapping

uses gw.lang.reflect.IPropertyInfo
uses gw.api.util.mapping.IFieldMapper
uses com.guidewire.pl.web.controller.UserDisplayableException
uses gw.api.util.mapping.ObjectConverter

/**
 * Used to map the EntityValidation.EntityType field: converts AB entity names
 * into CC entity names.
 */
class EntityTypeFieldMapper implements IFieldMapper {
  
  override function mapField(converter : ObjectConverter,
                           source : Object,
                           target : Object,
                           sourceProperty : IPropertyInfo) : void {
    try {
      var sourceEntityType = source[sourceProperty.getName()]
      var targetEntityType = converter.getTranslator().translateEntityName(sourceEntityType as java.lang.String)
      target[sourceProperty.getName()] = targetEntityType
    } catch (e) {
      throw new UserDisplayableException("Could not access EntityType property", e.Cause)
    }
  }
}
