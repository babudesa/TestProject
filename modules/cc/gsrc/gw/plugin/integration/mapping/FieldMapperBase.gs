package gw.plugin.integration.mapping

uses gw.lang.reflect.IPropertyInfo
uses java.util.Calendar
uses java.util.Date
uses com.guidewire.pl.web.controller.UserDisplayableException
uses gw.api.util.mapping.ObjectConverter
uses gw.api.util.mapping.IFieldMapper
uses gw.api.util.mapping.GWObjectUtils

abstract class FieldMapperBase implements IFieldMapper {
  construct(){
  }
  
  override function mapField(converter : ObjectConverter, 
                           source : Object, 
                           target : Object, 
                           sourceProperty : IPropertyInfo) {
      var sourcePropertyName = sourceProperty.getName()
      try {
        var newProperty = getTargetProperty((typeof target), sourceProperty)
        if (newProperty != null && newProperty.Writable) {      
          var propertyValue : Object
          if (String.Type.isAssignableFrom( sourceProperty.Type ) && GWObjectUtils.isEnumType( newProperty.Type )) {
            var newTypecodeWithPrefix = converter.getTranslator().translateTypeCode( newProperty.Type.RelativeName, source[sourcePropertyName] as String)
            propertyValue = GWObjectUtils.getTypeKeyFromCode(newTypecodeWithPrefix, newProperty.Type)
          } else {
            
            propertyValue = converter.convert( source[sourcePropertyName], sourceProperty.Type)
          }

          // SOAP entities use Calendar instead of Date
          if (propertyValue typeis Date && Calendar.Type.isAssignableFrom(newProperty.Type)) {
            var cal = Calendar.getInstance()
            cal.setTime(propertyValue)
            propertyValue = cal
          } else if (propertyValue typeis Calendar && Date.Type.isAssignableFrom(newProperty.Type)){
            var cal2 = propertyValue
            propertyValue = cal2.Time
          }

          // SOAP entities have NULL for empty arrays
          if (propertyValue == null && 
              newProperty.Type.Array &&
              newProperty.Type.ComponentType.Namespace == "entity"){
            propertyValue = newProperty.Type.ComponentType.makeArrayInstance( 0 )
          }
          if (propertyValue typeis Object[] && propertyValue.length == 0) {
            var newPropertyType = (typeof target).TypeInfo.getProperty( newProperty.Name ).Type
            propertyValue = newPropertyType.ComponentType.makeArrayInstance( 0 )
          }
          target[newProperty.Name] = propertyValue
        }
      } catch (e) {
        throw new UserDisplayableException("Fail to map field: " + sourcePropertyName 
          + " From: " + source.toString() + " to: " + target.toString() + e.LocalizedMessage, e.Cause)
      }
  }
  
  abstract function getTargetProperty(targetType : Type, sourceProperty : IPropertyInfo) : IPropertyInfo
  abstract function getTargetFieldName(sourceProperty : IPropertyInfo) : String
}