package gw.plugin.integration.utils

uses com.guidewire.modules.ConfigFileAccess
uses com.guidewire.pl.config.PLConfigResourceKeys
uses java.lang.Integer;
uses java.text.MessageFormat;
uses java.io.File;
uses java.util.Properties;
uses java.io.FileInputStream;

class ErrorGeneratorImpl implements ErrorGenerator {
  var _configFile : File
  var _properties : Properties
  var _entityType : String
  
  public construct( entityType : String ){
    var configFileAccess = ConfigFileAccess.INSTANCE.get()
    _configFile = configFileAccess.getFile( PLConfigResourceKeys.ADDRESSBOKEMESSGES_PROPERTIES )
    _properties = new Properties()
    var fis = new FileInputStream( _configFile )
    _properties.load( fis )
    _entityType = entityType
  }

  override function createGeneralError(errorMessageKey : String, errorMessageArgs : Object[]) : ValidationResult {
    return createGeneralError(formatMessage(errorMessageKey, errorMessageArgs))
  }

  override function createGeneralError(formattedErrorMessage : String) : ValidationResult {    
    var validationRst = new ValidationResult()
    var entityVal = new EntityValidation()
    entityVal.EntityType = _entityType
    // This field is required by CC, so we must supply a value
    entityVal.EntityId = new Integer(0)
    var generalVal = new GeneralValidation()

    //generalValidation.setErrorLevel(ValidationLevel.LOADSAVE);
    //generalValidation.setErrorReason(formatMessage(errorMessageKey, errorMessageArgs));
    //dmccreay: changed the above two lines to this to fix build error, apparently caused by an out of date gen-bridge
    generalVal.Level = ValidationLevel.TC_LOADSAVE
    generalVal.Reason = formattedErrorMessage

    entityVal.addToGeneralValidations(generalVal);
    validationRst.addToEntityValidations(entityVal);
    return validationRst;
  }

  private function formatMessage(messageKey : String, messageArgs : Object[]) : String {
    var message = _properties.get(messageKey) as String
    return MessageFormat.format(message, messageArgs)
  }  
}
