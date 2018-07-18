package gw.datatype.impl
uses gw.datatype.def.IDataTypeDef
uses gw.lang.reflect.IPropertyInfo
uses gw.datatype.def.IDataTypeDefValidationErrors
uses gw.datatype.handler.IDataTypeConstraintsHandler
uses gw.datatype.handler.IDataTypePersistenceHandler
uses gw.datatype.handler.IDataTypePresentationHandler
uses com.guidewire.pl.metadata.datatype2.impl.FieldValidatorBasedEncryptableStringDataTypeDef
uses gw.lang.reflect.IPropertyInfo
uses gw.datatype.def.IDataTypeDefValidationErrors
uses com.guidewire.pl.metadata.datatype2.fieldvalidator.FieldValidatorsLoader
uses gw.datatype.constraints.LocalizedFieldValidatorBasedStringConstraintsHandler
uses gw.datatype.presentation.LocalizedFieldValidatorBasedPresentationHandler

class LocalizedStringDataTypeDef extends FieldValidatorBasedEncryptableStringDataTypeDef implements IDataTypeDef {

  private var _countryProperty : String
  private var _sizeProperty : int = 0

  override property get PersistenceHandler() : IDataTypePersistenceHandler {
    return new VarcharPersistenceHandler(Encryption, TrimWhitespace, Linguistic, Size)
  }

  override property get PresentationHandler() : IDataTypePresentationHandler {
    return new LocalizedFieldValidatorBasedPresentationHandler("LocalizedString", Validator, Size, CountryProperty);
  }

  override property get ConstraintsHandler() : IDataTypeConstraintsHandler {
    return new LocalizedFieldValidatorBasedStringConstraintsHandler("LocalizedString", Validator, Size, CountryProperty)
  }
  
  override function validate(value : IPropertyInfo, errors :IDataTypeDefValidationErrors ){
    FieldValidatorsLoader.getInstance().getFieldValidatorForCountry(null).getValidatorDefByName(Validator)
  }
  
  property get CountryProperty() : String {
    return _countryProperty
  }

  property set CountryProperty(country : String){
    _countryProperty = country
  }


  property get Size() : int {
    return _sizeProperty
  }
  property set Size(sizeProperty : int){
    _sizeProperty= sizeProperty
  }



}
