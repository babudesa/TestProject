package gw.plugin.ccabintegration.impl.mapping;

uses gw.lang.reflect.IPropertyInfo
uses gw.api.util.DisplayableException
uses soap.abintegration.enums.ABContact
uses gw.api.util.mapping.IFieldMapper
uses gw.api.util.mapping.ObjectConverter

class ContactSubtypeMapper implements IFieldMapper {
  override function mapField(converter : ObjectConverter,
                           source : Object, 
                           target : Object, 
                           sourceProperty : IPropertyInfo) {
    try{
      var sourcePropertyName = sourceProperty.Name
      var contactSubtype = source[sourcePropertyName] as typekey.Contact
      if( contactSubtype == null ) {
        throw new DisplayableException("Field contactSubtype is cannot be null.")
      } else {
        var contactEntityName = contactSubtype.Code
        var abContactEntityName = converter.getTranslator().translateEntityName(contactEntityName)
        var abContactSubtype = (ABContact)["TC_" + abContactEntityName]
        target[sourcePropertyName] = abContactSubtype
      }
    } catch (e) {  
      throw new DisplayableException("Could not access ContactSubtype property", e.Cause )
    }
  }
}
