package gw.plugin.ccabintegration.impl;

uses gw.api.util.DisplayableException
uses com.guidewire.modules.ConfigFileAccess
uses com.guidewire.cc.system.config.CCConfigResourceKeys
uses gw.api.util.mapping.ObjectConverter
uses gw.api.util.mapping.ObjectConverterImpl
uses gw.api.util.mapping.NameTranslator
uses gw.api.util.mapping.NameTranslatorImpl
uses gw.api.system.PLLoggerCategories

class ObjectConverterFactoryImpl implements ObjectConverterFactory {
  var _ccToABTranslator : NameTranslator
  var _abToCCTranslator : NameTranslator

  construct() {
    try {
      var configFileAccess = ConfigFileAccess.INSTANCE.get()
      var ccToabFile = configFileAccess.getFile( CCConfigResourceKeys.CCTOAB_DATAMAPPING )
      var abToccFile = configFileAccess.getFile( CCConfigResourceKeys.ABTOCC_DATAMAPPING )
      _ccToABTranslator = NameTranslatorImpl.create(ccToabFile, "entity", "soap.abintegration.entity");
      _abToCCTranslator = NameTranslatorImpl.create(abToccFile, "soap.abintegration.entity", "entity");
    } catch(e) {
      PLLoggerCategories.CONFIG.error("Error creating ObjectConverterFactory", e)
      throw new DisplayableException("Can't create ObjectConverterFactory", e.Cause);
    }
  }

  override function getABToCC() : ObjectConverter {
    return new ObjectConverterImpl(_abToCCTranslator, "typekey.")
  }

  override function getCCToAB() : ObjectConverter {
    return new ObjectConverterImpl(_ccToABTranslator, "soap.abintegration.enums.")
  }
}

