package util.document
uses gw.plugin.document.impl.BaseDocumentProductionDispatcher
uses gw.plugin.document.IDocumentProduction
uses gw.plugin.document.IDocumentTemplateDescriptor
uses gw.document.DocumentContentsInfo
uses gw.api.util.LocaleUtil
uses gw.document.TemplatePluginUtils
uses gw.plugin.document.IDocumentProductionBase
uses java.util.Map
uses gw.api.util.Logger

class GAICDocumentProductionDispatcher extends BaseDocumentProductionDispatcher implements IDocumentProduction {

  construct() {
  }
override function createDocumentSynchronously(templateDescriptor : IDocumentTemplateDescriptor , parameters : Map<Object, Object>, document : Document) : DocumentContentsInfo {
    Logger.DOCUMENT.debug("Entering GAIC createDocSynchronously function")
    var result : DocumentContentsInfo
    var locale = templateDescriptor.Locale
    if (locale == null) {
      locale = LocaleUtil.getDefaultLocale()
    }
    document.Locale = locale // does the translation to language 
    LocaleUtil.runAsCurrentLocale( locale , \ ->  {
      Logger.DOCUMENT.debug("Entering createDocSync")
      result = (getDispatchImplementation(templateDescriptor) as IDocumentProduction).createDocumentSynchronously(templateDescriptor, parameters, document);
      Logger.DOCUMENT.debug("result is " + (result == null?"null":"not null"))
      Logger.DOCUMENT.debug("Leaving createDocSync")
    })
    return result
  }
  
  
  override protected function cast(obj : Object) : IDocumentProductionBase {
    return TemplatePluginUtils.castDocumentProduction(obj, IDocumentProduction)
  }

}
