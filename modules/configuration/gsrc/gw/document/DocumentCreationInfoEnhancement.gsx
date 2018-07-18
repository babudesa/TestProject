package gw.document
uses gw.api.util.Logger

enhancement DocumentCreationInfoEnhancement : gw.document.DocumentCreationInfo
{
  function createAndRender() {
    Logger.DOCUMENT.debug(\ -> "createAndRender")
    var parameters = DocumentsUtil.getDocumentCreationParameters(this)
    var documentContentsInfo = DocumentProduction.createDocumentSynchronously(this.DocumentTemplateDescriptor, parameters, this.Document)
    DocumentsUtil.renderDocumentContents(this, documentContentsInfo)
  }
}
