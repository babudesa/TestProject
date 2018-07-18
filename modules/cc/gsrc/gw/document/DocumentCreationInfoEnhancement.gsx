package gw.document

enhancement DocumentCreationInfoEnhancement : gw.document.DocumentCreationInfo
{
  function createAndRender() {
    var parameters = DocumentsUtil.getDocumentCreationParameters(this)
    var documentContentsInfo = DocumentProduction.createDocumentSynchronously(this.DocumentTemplateDescriptor, parameters, this.Document)
    DocumentsUtil.renderDocumentContents(this, documentContentsInfo)
  }
}
