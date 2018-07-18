package gw.datatype.presentation


uses gw.lang.reflect.IPropertyInfo
uses com.guidewire.pl.metadata.datatype2.presentation.FieldValidatorBasedPresentationHandler
uses java.lang.Integer
uses com.guidewire.pl.metadata.datatype2.fieldvalidator.FieldValidatorInfo
uses com.guidewire.pl.metadata.datatype2.fieldvalidator.FieldValidatorsLoader
uses gw.api.admin.BaseAdminUtil

class LocalizedFieldValidatorBasedPresentationHandler extends FieldValidatorBasedPresentationHandler{

  private var _country : String = null
  private var _validatorOverrideName : String = null
  private var _dataTypeName : String = null
  private var _lengthOverride : Integer = null
  
  construct(dataTypeName : String, validatorOverrideName : String, lengthOverride: Integer, country : String) {
    super(dataTypeName, validatorOverrideName, lengthOverride)
    _country = country
    _validatorOverrideName = validatorOverrideName
    _dataTypeName = dataTypeName
    _lengthOverride = lengthOverride
  }
  
  
  function getFieldValidatorForCountry(ctx : java.lang.Object) : FieldValidatorInfo{
    var countryToUse = ctx == null ? null : ctx[_country] 
    var fieldValidator = new FieldValidatorInfo(_dataTypeName, countryToUse as com.guidewire.pl.system.typelist.tl.Country);
    if (_validatorOverrideName != null) {
      var validator = FieldValidatorsLoader.getInstance().getFieldValidatorForCountry(countryToUse as com.guidewire.pl.system.typelist.tl.Country).getValidatorDefByName(_validatorOverrideName);
      if (validator != null) {
        fieldValidator.setValidator(validator);
      }
    }
    if (_lengthOverride != null) {
      fieldValidator.setLength(_lengthOverride);
    }
    return fieldValidator
  }
  
  
  override function getDisplayFormat(ctx : Object, propInfo : IPropertyInfo) :String  {
    var result = getFieldValidatorForCountry(ctx).DisplayFormat
    return result
  }

  override function getInputMask(ctx : Object, propInfo : IPropertyInfo) :String  {
    var result = getFieldValidatorForCountry(ctx).InputMask
    return result

  }

  override function getPlaceholderChar(ctx : Object, propInfo : IPropertyInfo) :String  {
    var result = getFieldValidatorForCountry(ctx).PlaceholderChar
    return result
  }




}
