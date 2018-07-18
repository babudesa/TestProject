package util.document;

uses gw.plugin.document.IDocumentContentSource;
uses gw.plugin.document.IDocumentProduction;
uses gw.plugin.document.IDocumentTemplateSource;
uses gw.document.DocumentContentsInfo;

uses java.lang.RuntimeException;
uses java.util.HashMap;
uses java.util.Map;

uses gw.api.util.Logger;

/*
 * The DocumentProduction class contains methods which can be used in both.pcf configuration
 * and from rules to create Document entities from Document Templates.
 */
class DocumentProduction
{
  construct()
  {
  }

/*******************************************************************************************
 *  Document Creation functions
 *******************************************************************************************/  

  /*
   * Determine whether synchronous creation is supported by the IDocumentProduction plugin for
   * the specified template. Returns true if so, false otherwise. Returns false if a template cannot be found
   * with the specified name.
   */
  public static function synchronousDocumentCreationSupported(templateName : String) : boolean {
    Logger.DOCUMENT.debug("Entering synchronousDocCreationSupported")
    var docTemplateSource : IDocumentTemplateSource = getDocumentTemplateSourcePlugin();
    var documentProductionPlugin : IDocumentProduction = getDocumentProductionPlugin();

    var documentTemplateDescriptor = docTemplateSource.getDocumentTemplate( templateName);
    if (documentTemplateDescriptor == null) {
      Logger.DOCUMENT.debug("Entering synchronousDocCreationSupported - null descriptor")
      return false;
    } else {
      Logger.DOCUMENT.debug("Leaving synchronousDocCreationSupported")
      return documentProductionPlugin.synchronousCreationSupported( documentTemplateDescriptor );
    }
  }
  
    /*
   * Determine whether asynchronous creation is supported by the IDocumentProduction plugin for
   * the specified template. Returns true if so, false otherwise. Returns false if a template cannot be found
   * with the specified name.
   */
  public static function asynchronousDocumentCreationSupported(templateName : String) : boolean {
    Logger.DOCUMENT.debug("Entering synchronousDocCreationSupported")
    var docTemplateSource : IDocumentTemplateSource = getDocumentTemplateSourcePlugin();
    var documentProductionPlugin : IDocumentProduction = getDocumentProductionPlugin();

    var documentTemplateDescriptor = docTemplateSource.getDocumentTemplate( templateName);
    if (documentTemplateDescriptor == null) {
      Logger.DOCUMENT.debug("Leaving synchronousDocCreationSupported - null descriptor")
      return false;
    } else {
      Logger.DOCUMENT.debug("Leaving synchronousDocCreationSupported")
      return documentProductionPlugin.asynchronousCreationSupported( documentTemplateDescriptor );
    }
  } 
 
  /*
   * Create a document synchronously and pass it to the IDocumentContentSource plugin for persistence
   * This method should be used when the document should be created and stored without any further user interaction.
   * 
   * templateName - the id of the template to be used to create the document
   * parameters - the set of objects, keyed by name, which will be supplied to the template generation process to create the document
   * document - the Document entity corresponding to the newly generated content
   */
  public static function createAndStoreDocumentSynchronously(templateName : String, parameters : Map, document : Document) {
     Logger.DOCUMENT.debug("Entering createAndStoreDocumentSynchronously")
    var documentContentSource : IDocumentContentSource = getDocumentContentSourcePlugin();

    //adjustDocumentName(documentContentSource, document);

    var documentContentsInfo = createDocumentSynchronously(templateName, parameters, document);
    Logger.DOCUMENT.debug("InputStream in gosu null? " + (documentContentsInfo.InputStream == null))

    if (documentContentsInfo.ResponseType !=  gw.document.DocumentContentsInfo.DOCUMENT_CONTENTS) {
      throw new RuntimeException("The IDocumentProduction implementation must return document contents to be called from a rule");
    }

    document.DMS = true;
    document.DateModified = Now as java.util.Date;
    document.Author = "Auto-generated";
    if (documentContentSource.addDocument( documentContentsInfo.InputStream, document )) {
//      document.setPersistedByDocumentSource( true );
      document.setPersistenceRequired(true)
    }
    Logger.DOCUMENT.debug("Leaving createAndStoreDocumentSynchronously")
  }

  /*
   * Create a document synchronously. Does not persist the newly generated content.
   * This method should be used when the generated content is desired for display in the UI.
   *
   * templateName - the id of the template to be used to create the document
   * parameters - the set of objects, keyed by name, which will be supplied to the template generation process to create the document
   * document - the Document entity corresponding to the newly generated content
   */
  public static function createDocumentSynchronously(templateName : String, parameters : Map, document : Document) : DocumentContentsInfo {
    Logger.DOCUMENT.debug("Entering createDocumentSynchronously")
    var docTemplateSource : IDocumentTemplateSource = getDocumentTemplateSourcePlugin();
    var documentProductionPlugin : IDocumentProduction = getDocumentProductionPlugin();
    var documentContentsInfo = documentProductionPlugin.createDocumentSynchronously( docTemplateSource.getDocumentTemplate( templateName ), parameters, document );
    Logger.DOCUMENT.debug("Leaving createDocumentSynchronously")
    return documentContentsInfo;
  }

  /*
   * Create a document asynchronously. This means that the function will return immediately, but the actual document
   * creation will take place over an extended period of time. 
   * This is a convenience method which translates the Document entity into a Map of values.
   *
   * Note that the value Map will include the value of virtual properties, which will not
   * exist on the external version of the Document entity. The document production system
   * should be able to simply ignore these.
   *
   * templateName - the id of the template to be used to create the document
   * parameters - the set of objects, keyed by name, which will be supplied to the template generation process to create the document
   * document - the Document entity corresponding to the newly generated content. The document's field values will be 
   * passed to the IDocumentProduction implementation for use when the content is finally generated. Note that
   * this Document entity will be marked non-persistable, since the IDocumentProduction system should
   * create the necessary Document metadata once the creation process is complete
   */
  public static function createDocumentAsynchronously(templateName : String, parameters : Map, document : Document) : String {
    Logger.DOCUMENT.debug("Entering createDocumentAsynchronously")
    var fieldValues = new HashMap();
    var properties = document.IntrinsicType.TypeInfo.Properties;
    for (var docProperty in properties) {
      if (docProperty.isReadable() && docProperty.isWritable()){ // TODO Removed ScriptingUtil.
        //Only include the true properties which can be retrieved here and set on entity created in the plugin
        fieldValues.put( docProperty.Name, docProperty.Accessor.getValue( document ) )
      }
    }

    // Mark the supplied document as non-persistable, as noted above
//    document.setPersistedByDocumentSource( true );
    document.setPersistenceRequired(true);
    Logger.DOCUMENT.debug("Leaving createDocumentAsynchronously")
    return createDocumentAsynchronously(templateName, parameters, fieldValues);
  }

  /*
   * Create a document asynchronously. This means that the function will return immediately, but the actual document
   * creation will take place over an extended period of time. 
   * This method should be called when the creation process will take place over an extended period of time. The external
   * document production system is responsible for creating a Document entity (if desired) when the creation is complete.
   *   
   * templateName - the id of the template to be used to create the document
   * parameters - the set of objects, keyed by name, which will be supplied to the template generation process to create the document
   * fieldValues - a set of values, keyed by field name, which should be set on the Document entity which is eventually created
   * at the end of the asynchronous creation process.
   */  
  public static function createDocumentAsynchronously(templateName : String, parameters : Map, fieldValues : Map) : String {
    Logger.DOCUMENT.debug("Entering createDocumentAsynchronously 2")
    var docTemplateSource : IDocumentTemplateSource = getDocumentTemplateSourcePlugin();    
    var documentProductionplugin : IDocumentProduction = getDocumentProductionPlugin();
    Logger.DOCUMENT.debug("Leaving createDocumentAsynchronously 2")
    return documentProductionplugin.createDocumentAsynchronously( docTemplateSource.getDocumentTemplate( templateName ), parameters, fieldValues );
  }

/**********************************************************************************************
 * Helper functions
 **********************************************************************************************/

  // Retrieve the configured IDocumentProduction implementation 
  private static function getDocumentProductionPlugin() : IDocumentProduction  {
    Logger.DOCUMENT.debug("Entering getDocumentProductionPlugin")
    var plugin : IDocumentProduction;
    plugin = PluginRegistry.getPluginRegistry().getPlugin(IDocumentProduction);
    return plugin;
  }

  // Retrieve the configured IDocumentTemplateSource implementation
  private static function getDocumentTemplateSourcePlugin() : IDocumentTemplateSource {
    Logger.DOCUMENT.debug("Entering getDocumentTemplateSourcePlugin")
    var plugin : IDocumentTemplateSource;
    plugin = PluginRegistry.getPluginRegistry().getPlugin(IDocumentTemplateSource);
    return plugin;
  }

  // Retrieve the configured IDocumentContentSource implementation
  private static function getDocumentContentSourcePlugin() : IDocumentContentSource {
    Logger.DOCUMENT.debug("Entering getDocumentContentSourcePlugin")
    var plugin : IDocumentContentSource;
    plugin = PluginRegistry.getPluginRegistry().getPlugin(IDocumentContentSource);
    return plugin;
  }

  // Adjust the supplied document's name to avoid conflicts with documents already in the system. This
  // will supply a numeric argument to a display key, producing alternate names like "Foo (2)", "Foo (3)", etc.
  // until a unique name is generated.
  private static function adjustDocumentName(documentContentSource : IDocumentContentSource, document : Document) {
    Logger.DOCUMENT.debug("Entering adjustDocumentName")
    var i=1;
    var originalName = document.Name;
    while(documentContentSource.isDocument( document )) {
      //As long as the DocumentSource rejects the document name, tweak it to avoid conflicts.
      //This assumes that the name is all that needs to be changed; that may not be true for
      // every DMS integration.
      i = i+1; //Start the index at 2, since by definition there's already one
     document.Name = displaykey.Java.Document.DocumentDuplicateNameAdjustment(originalName, i);
    }
    Logger.DOCUMENT.debug("Leaving adjustDocumentName")
  }
}
