package gw.plugin.pcintegration.v2.mapping
uses gw.plugin.integration.mapping.IFieldMapper
uses gw.lang.reflect.IPropertyInfo
uses java.lang.IllegalArgumentException
uses gw.api.util.mapping.ObjectConverter

/**
 * Maps ClassCodes from PC out-of-the-box format to CC out-of-the-box format.  PC 
 * uses a more standard 4-digit format, whereas CC uses a 6-digit format.  This mapper
 * pads the code with 2 leading zeros.  Custom configurations probably should not 
 * use this mapper.
 */
@Export
class ClassCodeMapper implements IFieldMapper {

  construct() {
  }

  override function mapField( converter : ObjectConverter, 
                              source : Object, 
                              target : Object, 
                              sourceProperty : IPropertyInfo ) {  
    var sourceVal = source[sourceProperty.Name] as String
    if (sourceVal != null) {
      if (sourceVal.length != 4) {
        throw new IllegalArgumentException("Expected source value to be a string of length 4")
      }
      target[sourceProperty.Name] = "00" + sourceVal
    }
  }
}
