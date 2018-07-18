package gw.plugin.integration

uses com.guidewire.pl.web.controller.UserDisplayableException
uses java.util.IdentityHashMap
uses gw.plugin.integration.ObjectConverter
uses gw.api.util.mapping.NameTranslator
uses gw.api.util.mapping.GWObjectUtils
uses gw.lang.reflect.IType

class ObjectConverterImpl implements ObjectConverter {
  var _nameTranslator : NameTranslator
  var _convertedGWObjects = new IdentityHashMap()
  var _targetEnumPackage : String

  // TODO pdalbora 22-Apr-2005 -- Add logging to this class where appropriate.
  // We should log when we can't find a field, for example.

  construct(nameTranslator : NameTranslator, targetEnumPackage1 : String) {
    _nameTranslator = nameTranslator
    _targetEnumPackage = targetEnumPackage1
  }

  override property get Translator() : NameTranslator {
    return _nameTranslator
  }
  
  /**
   * value = the object to convert.
   * valueType = it's type in the type system; note that for non-array codegen'ed entity beans you can typically call "typeof value" to 
   *             get this, but for extension entities, Arrays, plain-old Java/Gosu objects, or enhancements on entities/objects, you
   *             should not depend on "typeof" 
   */
  override function convert(value : Object, valueType: IType) : Object{
    try {
      var newValue : Object
      if (value == null) {
        return null
      } else if (GWObjectUtils.isGWObject(value)) {
        // It's a bean
        newValue = convertGWObject(value)
      } else if ( (typeof value).Array && ( GWObjectUtils.isGWClass( (typeof value).ComponentType ) ) ) {
        // It's an array of beans
        var c = value as Object[]
        var newComponentClass = _nameTranslator.translateClass(valueType.getComponentType())
        var newArray = newComponentClass.makeArrayInstance(c.length) as Object[]
        for( elem in c index i) {
          newArray[i] = convertGWObject(elem)
        }
        newValue = newArray
      } else if ((typeof value).Array && (typeof value).getComponentType() == String) {
        // Array of Strings
        newValue = value
      } else if ( GWObjectUtils.isEnum( value ) ) {
        newValue = convertEnum(value)
      } else {
        newValue = value
      }
      return newValue
    } catch(e) {
      e.printStackTrace()
      throw new UserDisplayableException(formatErrorMessage(value), e.Cause)
    }
  }
  
  function convertGWObject(gwObject : Object) : Object {
    var newGWObject = _convertedGWObjects.get(gwObject);
    if (newGWObject == null) {
      var newGWClass = _nameTranslator.translateClass( typeof gwObject )
      if (GWObjectUtils.isGWClass(newGWClass)) {
        // todo need dave's fix that zeroconstrouctor creates a thread-local when needed.
        if( !newGWClass.Namespace.equals( "entity" ) ) {
          newGWObject = newGWClass.TypeInfo.getConstructor( null ).Constructor.newInstance( null )
        } else {
          newGWObject = EntityFactory.getEntityFactory().newEntity( newGWClass )
        }
      } 
      _convertedGWObjects.put(gwObject, newGWObject)
      for(prop in (typeof gwObject).TypeInfo.Properties) {
        var fieldMapper = _nameTranslator.getFieldMapper( typeof gwObject, prop )
        fieldMapper.mapField( this, gwObject, newGWObject, prop )
      }
    }
    return newGWObject
  }

  function convertEnum(value : Object) : Object {
    var code = GWObjectUtils.getCode(value)
    var tlName = (typeof value).RelativeName
    var newTLName = _nameTranslator.translateTypelistName( tlName )
    newTLName = _targetEnumPackage + newTLName
    var newCode = _nameTranslator.translateTypeCode(tlName, code)
    var newTLClass = Type.forName(newTLName)
    return GWObjectUtils.getTypeKeyFromCode( newCode, newTLClass )
  }

  override property get TargetEnumPackage() : String {
    return _targetEnumPackage  
  }
  
  private function formatErrorMessage(value : Object) : String{
    return "Could not convert object of type \"" + ( typeof value ) + "\"";
  }
}
