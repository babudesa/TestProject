package gw.plugin.integration.utils

uses com.guidewire.external.typelist.TypeKey
uses java.lang.IllegalArgumentException;
uses java.util.regex.Pattern;

class GWObjectUtils {
  static private var ENTITY_NAME_PATTERN = Pattern.compile( "soap\\.\\w+\\.entity\\.\\w+" )
  static private var ENUMS_NAME_PATTERN = Pattern.compile( "soap\\.\\w+\\.enums\\.\\w+" )
  
  construct(){}
  
  static function isGWObject( value : Object ) : boolean {
    return isGWClass( typeof value ) 
  }
  
  static function isGWClass( clazz : Type ) : boolean {
    if( null == clazz ) {      
      return false
    } else {
      return com.guidewire.external.entity.KeyableEntity.Type.isAssignableFrom( clazz ) 
             || ENTITY_NAME_PATTERN.matcher( clazz.Name).matches()
             && clazz.Array == false
    }
  }
  
  static function isEnum( value : Object ) : boolean {
    if( value == null ) {
      return false
    } else {
      return isEnumType( typeof value )
    }
  }
  
  static function isEnumType( clazz : Type ) : boolean {
    return TypeKey.Type.isAssignableFrom( clazz ) 
           || ENUMS_NAME_PATTERN.matcher( clazz.Name).matches()
           && clazz.Array == false
  }  
  
  static function getCode(enumeration : Object) : String {
    if( !GWObjectUtils.isEnum(enumeration) ) {
      throw new IllegalArgumentException("Object is not an enumberation.")
    }
    var code : String
    if( (typeof enumeration).Namespace.equals("typekey") ) {
      code = (enumeration as TypeKey).Code
    } else {
      code = enumeration.toString()
    }
    return code
  }  
  
  /**
   * Convert a typekey object from domain to soap or vice versa.
   * @param value : the typekey to be converted
   * @param targetType: the type of the target typekey to be converted to
   * @return the converted typekey
   * <pre>
   * convertTypeKey( typekey.AddressType.TC_HOME, soap.abintegration.enums.AddressType ) returns soap.abintegration.enums.AddressType.TC_HOME
   * convertTypeKey( soap.abintegration.enums.AddressType.TC_BUSINESS, AddressType ) returns AddressType.TC_BUSINESS
   * </pre>
   */
  static function convertTypeKey( value : Object, targetType : Type ) : Object {
    var sourceType = typeof value
    for( sourceProp in sourceType.TypeInfo.Properties ) {
      if( sourceProp.Static ) {
        if( value == sourceProp.Accessor.getValue( sourceType ) ) {
          for( targetProp in targetType.TypeInfo.Properties ) {
            if( targetProp.Static ) {
              if( targetProp.Name.equalsIgnoreCase( sourceProp.Name ) ) {
                return targetProp.Accessor.getValue( targetType )
              }
            }
          }
        }
      }
    }
    return null
  }  
 
  static function getTypeKeyFromCode( code : String, tList : Type) : Object {
    for (prop in tList.TypeInfo.Properties) {
      if (prop.Static) {
        if (prop.Name.equalsIgnoreCase(code)) {
          return prop.Accessor.getValue( tList );
        }
      }
    }
    return null
  }
  
}
