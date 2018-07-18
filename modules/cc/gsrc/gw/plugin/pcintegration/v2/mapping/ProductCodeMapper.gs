package gw.plugin.pcintegration.v2.mapping

uses gw.lang.reflect.IPropertyInfo
uses gw.api.util.mapping.IFieldMapper
uses gw.api.util.mapping.ObjectConverter
uses java.lang.IllegalArgumentException
uses java.util.HashMap

/**
 * Maps the ProductCode string retrieved from PC to a CC PolicyType.
 */
@Export
class ProductCodeMapper implements IFieldMapper 
{
  static final var valueMap = new HashMap<String, PolicyType>() { "PersonalAuto" -> PolicyType.TC_AUTO_PER,
                                                                  "WorkersComp" -> PolicyType.TC_COMP }
  
  construct() 
  {
  }
  
  override function mapField( converter : ObjectConverter, 
                              source : Object, 
                              target : Object, 
                              sourceProperty : IPropertyInfo )
  {
    var productCode = sourceProperty.Accessor.getValue( source )
    if( typeof productCode != String )
    {
      throw new IllegalArgumentException( "ProductCodeMapper used a on a non-String property: " + sourceProperty.Name)
    }
    if( valueMap[productCode as String] == null ) 
    {
      throw new IllegalArgumentException( "Unknown ProductCode received from PolicyCenter: " + productCode )
    }
    target[sourceProperty.Name] = valueMap[productCode as String]
  }
  
  /**
   * Maps from CC PolicyType to PC ProductCode. 
   */
  static function getProductCodeForPolicyType( policyType : PolicyType ) : String 
  {
    var entry = getEntryForPolicyType( policyType )
    if( entry == null )
    {
      throw new IllegalArgumentException( "Unsupported PolicyType: " + policyType )
    }
    return entry.Key
  }

  static function isSupportedPolicyType( policyType : PolicyType ) : boolean
  {
    return getEntryForPolicyType( policyType ) != null
  }
  
  static private function getEntryForPolicyType( policyType : PolicyType ) : java.util.Map.Entry<java.lang.String,typekey.PolicyType>
  {
    var entries = valueMap.entrySet().toList()
    return entries.firstWhere( \ e -> e.Value.Code == policyType.Code )
  }
}
