package gw.datatype.constraints

uses com.guidewire.pl.metadata.datatype2.constraints.FieldValidatorBasedStringConstraintsHandler
uses java.lang.Integer
uses com.guidewire.pl.metadata.datatype2.fieldvalidator.FieldValidatorInfo
uses gw.datatype.handler.IDelayedConstraintsHandler;
uses gw.lang.reflect.IPropertyInfo
uses com.guidewire.pl.metadata.datatype2.fieldvalidator.FieldValidatorsLoader
uses gw.api.system.PLConfigParameters
uses gw.datatype.impl.StringConstraintsHandler



class LocalizedFieldValidatorBasedStringConstraintsHandler extends StringConstraintsHandler implements IDelayedConstraintsHandler{

  private var _country : String = null
  private var _validatorOverrideName : String = null
  private var _dataTypeName : String = null
  private var _lengthOverride : Integer = null

  construct(dataTypeName : String, validatorOverrideName : String, lengthOverride: Integer, country : String) {
    super(lengthOverride)
    _country = country
    _validatorOverrideName = validatorOverrideName
    _dataTypeName = dataTypeName
    _lengthOverride = lengthOverride
  }

  override function  validateUserInput(ctx : java.lang.Object, whichProperty : IPropertyInfo, strValue : String) {
    var fieldValidator = getFieldValidatorForCountry(ctx)
    fieldValidator.validateFormat(whichProperty, strValue);
    super.validateUserInput(ctx, whichProperty, strValue)
  }

  override function validateValue(ctx : java.lang.Object, whichProperty : IPropertyInfo, obj : Object) {
    if (PLConfigParameters.StrictDataTypes.getValue()) {
      getFieldValidatorForCountry(ctx).validateFormat(whichProperty, obj.toString());
    }
    super.validateValue(ctx, whichProperty, obj)
  }

  function getFieldValidatorForCountry(ctx : java.lang.Object) : FieldValidatorInfo{
    var fieldValidator = new FieldValidatorInfo(_dataTypeName, ctx[_country] as com.guidewire.pl.system.typelist.tl.Country);
    if (_validatorOverrideName != null) {
      var validator = FieldValidatorsLoader.getInstance().getFieldValidatorForCountry(ctx[_country] as com.guidewire.pl.system.typelist.tl.Country).getValidatorDefByName(_validatorOverrideName);
      if (validator != null) {
        fieldValidator.setValidator(validator);
      }
    }
    if (_lengthOverride != null) {
      fieldValidator.setLength(_lengthOverride);
    }
    return fieldValidator
  }


}