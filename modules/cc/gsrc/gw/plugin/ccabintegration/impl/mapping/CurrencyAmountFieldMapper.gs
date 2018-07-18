package gw.plugin.ccabintegration.impl.mapping

uses gw.plugin.integration.mapping.FieldMapperBase
uses gw.lang.reflect.IPropertyInfo
uses gw.api.util.mapping.ObjectConverter
uses gw.api.util.mapping.GWObjectUtils
uses gw.api.financials.CurrencyAmount
uses java.math.BigDecimal
uses gw.api.util.DisplayableException

/**
 * This class maps gw.api.financials.CurrencyAmount properties to/from a soap integration entity to a local entity. Configure it in a
 * data mapping file (e.g. ab-to-cc-data-mapping.xml) to map a field which is a CurrencyAmount between applications.
 * It also supports the field having different names in each application.
 * 
 *  &lt;FieldMapping source="MoneyLimitRemoteProperty" mapperClassName="gw.plugin.ccabintegration.impl.mapping.CurrencyAmountFieldMapper"&gt;
 *    &lt;MapperProperty name="newFieldName" value="MoneyLimitLocalProperty" /&gt;
 *  &lt;/FieldMapping&gt;
 * 
 */
class CurrencyAmountFieldMapper extends FieldMapperBase {
  var _newFieldName : String as NewFieldName

  override function mapField(converter : ObjectConverter, 
                           source : Object, 
                           target : Object, 
                           sourceProperty : IPropertyInfo) { 
            
    var targetProperty = getTargetProperty(typeof target, sourceProperty)
    if((sourceProperty.Type).isAssignableFrom(gw.api.financials.CurrencyAmount)) {
      // Mapping from gw.api.financials.CurrencyAmount
      var sourceValue = source[sourceProperty.Name] as gw.api.financials.CurrencyAmount
      if(sourceValue != null) {
        var targetValue = targetProperty.Type.TypeInfo.getConstructor( null ).Constructor.newInstance( null )
        targetValue["Amount"] = sourceValue.Amount
      
        var newTypecodeWithPrefix = converter.getTranslator().translateTypeCode( targetProperty.Type.RelativeName, sourceValue.Currency.Code)
        var newCurrency = GWObjectUtils.getTypeKeyFromCode(newTypecodeWithPrefix, targetProperty.Type) 
        targetValue["Currency"] = newCurrency
        target[getTargetFieldName(sourceProperty)] = targetValue
      }
    } else if(targetProperty.Type.isAssignableFrom(gw.api.financials.CurrencyAmount)) {
      // Mapping to gw.api.financials.CurrencyAmount
      var sourceValue = source[sourceProperty.Name] 
      if(sourceValue != null) { 
        var amount = sourceValue["Amount"] as BigDecimal
    
        // convert the Currency typecode
        var currency = sourceValue["Currency"]
        var newTypecodeWithPrefix = converter.getTranslator().translateTypeCode( targetProperty.Type.RelativeName, currency as String)
        var newCurrency = GWObjectUtils.getTypeKeyFromCode(newTypecodeWithPrefix, typekey.Currency.Type) as typekey.Currency
    
        // create the new CurrencyAmount
        var newPropertyValue = CurrencyAmount.getStrict(amount, newCurrency)        
        target[getTargetFieldName(sourceProperty)] = newPropertyValue            
      }
    } else {
      throw new DisplayableException("Attempting to map non CurrencyAmount field:" + sourceProperty.Name + ", with a CurrencyAmount mapper")
    }
  }
  
  override function getTargetProperty(targetType : Type, sourceProperty : IPropertyInfo) : IPropertyInfo {
    return targetType.getTypeInfo().getProperty( getTargetFieldName(sourceProperty) );
  }

  override function getTargetFieldName(sourceProperty : IPropertyInfo) : String {
    // if a new field name hasn't been set, then use the sourceProperty name
    if(NewFieldName == null) {
      NewFieldName = sourceProperty.Name
    }
    return NewFieldName
  }

}
