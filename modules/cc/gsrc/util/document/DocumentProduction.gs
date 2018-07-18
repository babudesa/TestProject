package util.document;
uses gw.document.DocumentContentsInfo
uses java.util.Map
uses gw.plugin.document.IDocumentProduction
uses gw.plugin.document.IDocumentTemplateSource

/*
 * The DocumentProduction class contains methods which can be used in both.pcf configuration
 * and from rules to create Document entities from Document Templates.
 * @deprecated use gw.document.DocumentProduction
 */
@ReadOnly
class DocumentProduction extends gw.document.DocumentProduction
{
   /*
    * Create a document synchronously. Does not persist the newly generated content.
    * This method should be used when the generated content is desired for display in the UI, and when a
    * Document entity is not going to be created (for example, when simply printing some content).
    *
    * templateName - the id of the template to be used to create the document
    * parameters - the set of objects, keyed by name, which will be supplied to the template generation process to create the document
    */
    public static function createDocumentSynchronously(templateName : String, parameters : Map) : DocumentContentsInfo {
     var docTemplateSource : IDocumentTemplateSource = getDocumentTemplateSourcePlugin();
     var documentProductionPlugin : IDocumentProduction = getDocumentProductionPlugin();

     var documentContentsInfo = documentProductionPlugin.createDocumentSynchronously(docTemplateSource.getDocumentTemplate(templateName, null), parameters);

     return documentContentsInfo;
    }


}
