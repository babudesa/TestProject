package gw.plugin.ccabintegration.impl

uses soap.abintegration.api.IContactAPI
uses gw.api.util.mapping.ObjectConverter
uses gw.util.ILogger
uses gw.api.system.PLLoggerCategories

// should really be an abstract class
class AddressBookOperation {
  var _logger : ILogger as readonly LOGGER = new PLLoggerCategories(PLLoggerCategories.PLUGIN, "AddressBook")
  var _ccToABConverter : ObjectConverter
  var _abToCCConverter : ObjectConverter
  var _api : IContactAPI

  construct(converterFactory : ObjectConverterFactory, api : IContactAPI) {
    _ccToABConverter = converterFactory.getCCToAB()
    _abToCCConverter = converterFactory.getABToCC()
    _api = api
  }

  function getCCToABConverter() : ObjectConverter {
    return _ccToABConverter
  }

  function getABToCCConverter() : ObjectConverter {
    return _abToCCConverter
  }

  function getContactAPI() : IContactAPI {
    return _api
  }
}
