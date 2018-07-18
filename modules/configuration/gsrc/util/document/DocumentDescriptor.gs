package util.document
uses gw.plugin.document.IDocumentTemplateDescriptor

class DocumentDescriptor {

  construct() {

  }
  public static function getDescriptorFromDoc(docName : String) : IDocumentTemplateDescriptor {
    var iDTSP = gw.plugin.Plugins.get(gw.plugin.document.IDocumentTemplateSource)
    // return iDTSP.getDocumentTemplate(docName, gw.api.util.LocaleUtil.toLocale(gw.api.util.LocaleUtil.getDefaultLanguage()) )
    return null
  }
}
