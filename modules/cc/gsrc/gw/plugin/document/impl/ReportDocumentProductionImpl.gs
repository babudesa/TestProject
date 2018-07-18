package gw.plugin.document.impl;
uses gw.plugin.document.IDocumentTemplateDescriptor;
uses gw.document.DocumentContentsInfo;
uses java.util.Map;
uses gw.plugin.document.IDocumentProduction;
uses gw.plugin.document.impl.BaseReportDocumentProductionImpl

@Export
class ReportDocumentProductionImpl extends BaseReportDocumentProductionImpl implements IDocumentProduction
{
  construct()
  {
  }
  
  override function createDocumentSynchronously(templateDescriptor : IDocumentTemplateDescriptor, parameters : Map, document : Document) : DocumentContentsInfo {
    var contentsInfo = createDocumentSynchronously(templateDescriptor, parameters)
    return contentsInfo
  }
  
}
