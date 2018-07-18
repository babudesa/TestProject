package gw.plugin.ccabintegration.impl
uses gw.api.util.mapping.ObjectConverter

interface ObjectConverterFactory {
  function getCCToAB() : ObjectConverter
  function getABToCC() : ObjectConverter
}
