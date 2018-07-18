package gw.plugin.document.impl

uses gw.api.util.Logger
uses gw.api.util.DisplayableException
uses gw.plugin.document.IDocumentTemplateDescriptor
uses gw.document.TemplatePluginUtils
uses gw.plugin.InitializablePlugin
uses gw.plugin.document.DocumentConfigUtil
uses gw.plugin.document.IDocumentTemplateSerializer
uses gw.plugin.document.IDocumentTemplateSource
uses gw.i18n.ILocale
uses java.io.BufferedInputStream
uses java.io.BufferedReader
uses java.io.File
uses java.io.FileInputStream
uses java.io.InputStream
uses java.lang.IllegalArgumentException
uses java.lang.Exception
uses java.lang.Throwable
uses java.util.ArrayList
uses java.util.Date
uses java.util.Set
uses java.util.Map
uses java.util.HashMap
uses gw.api.util.LocaleUtil
uses java.util.concurrent.locks.ReentrantLock

@Export
class BaseDocumentTemplateSource implements InitializablePlugin, IDocumentTemplateSource {

  public static var DESCRIPTOR_SUFFIX : String = ".descriptor"
  public static var AVAILABLE_SYMBOLS_PROPNAME : String = "availablesymbols"
  public static var LOCALE_PROPNAME : String = "locale"
  public static var LANGUAGE_PROPNAME : String = "language"
  static var TEMPLATES_PATH : String = "templates.path"
  static var DESCRIPTORS_PATH : String = "descriptors.path"
  static var CACHE_DESCRIPTORS : String = "cacheDescriptors"
  static var PROPNAMES_TEST_WITH_STARTSWITH : Set<String> = { "templateid", "name", "identifier" }
  
  property get StemSearchPropNames() : Set<String> { return PROPNAMES_TEST_WITH_STARTSWITH }

  var _templateDir : File 
  var _descriptorDir : File
  var _cacheDescriptors = false
  var _loadedDescriptorsLock = new ReentrantLock()
  var _loadedDescriptors : List<IDocumentTemplateDescriptor>

  override function setParameters( params: Map ) : void  {
    var rootDirPath = params.get(ROOT_DIR) as String // should be only be null for testing
    _templateDir = DocumentConfigUtil.getTemplateDirectory(rootDirPath, params.get(TEMPLATES_PATH) as String)
    _descriptorDir = DocumentConfigUtil.getDiscriptorDirectory(rootDirPath, params.get(DESCRIPTORS_PATH) as String)

    if (params.containsKey(CACHE_DESCRIPTORS)) {
      _cacheDescriptors = "true".equals(params.get(CACHE_DESCRIPTORS));
    }
  }

  override function getTemplateAsStream( strTemplateId : String ) : InputStream {
    return getTemplateAsStream(strTemplateId, null);
  }

  override function getTemplateAsStream( strTemplateId : String, locale : ILocale ) : InputStream  {
    return getTemplateFileAsStream(strTemplateId, locale);
  }

  override function getDocumentTemplates( date: Date, valuesToMatch : Map, maxResults : int ) : IDocumentTemplateDescriptor[]  {
    var map = new HashMap<String,Object>()
    valuesToMatch.eachKeyAndValue( \ key, value -> map.put((key as String).toLowerCase( ), value) )
    var locale = extractLocale(map)
    var descriptors = getTemplateDescriptors(locale)
    var list = new ArrayList<IDocumentTemplateDescriptor>();
    for (var descriptor in descriptors) {
      if (descriptorIsInEffect(descriptor, date) and descriptorMatchesAllValues(descriptor, map)) {
        if (descriptorIsValid(descriptor)) {
          // fix for getDocumtneTemplate needs to get a single descritpor 
          if (maxResults != 1 or locale != null or locale == descriptor.Locale) {
            list.add(descriptor);
            if ((maxResults > 0) && (list.size() >= maxResults)) {
              break;
            }
          }
        } else {
          Logger.DOCUMENT.error("Document Template plugin could not find descriptor file based on the Id in a descriptor. Descriptor: ${descriptor}, Specified Id: ${descriptor.getTemplateId()}; Note that the template id must match the name of the template file");
        }
      }
    }
    return list.sortBy( \ t -> t.Name ) as IDocumentTemplateDescriptor[]
  }

  private function extractLocale(valuesToMatch : Map) : ILocale {
    var localeObj = valuesToMatch.remove( LOCALE_PROPNAME )
    var languageObj = valuesToMatch.remove( LANGUAGE_PROPNAME )
    if (localeObj == null) {
      if (languageObj == null) {
        return null
      }
      else if (languageObj typeis LanguageType) {
        return LocaleUtil.toLocale( languageObj )
      }
      else if (languageObj typeis String) {
        try {
          return LocaleUtil.toLocale( languageObj as LanguageType )
        } catch(e) {
          throw new IllegalArgumentException("Value of language should be an existing lanaguage was: ${languageObj}");
        }
      }
      else {
        throw new IllegalArgumentException("Value of language should be either a LanguageType or a String was: ${typeof(languageObj)}");
      }
    }
    else if (localeObj typeis ILocale) {
      return localeObj
    }
    else if (localeObj typeis String) {
      var rtn = ILocale.valueOf(localeObj)
      if (rtn == null) {
        throw new IllegalArgumentException("Value of locale should be an existing locale was: ${localeObj}");
      }
      return rtn
    }
    else {
      throw new IllegalArgumentException("Value of locale should be either an ILocale or a String was: ${typeof(localeObj)}");
    }
  }

  /** Determine if the descriptor is in effect at the requested time.
  */
  private function descriptorIsInEffect(descriptor : IDocumentTemplateDescriptor, date : Date) : boolean {
    if (date != null) {
      if (descriptor.getDateEffective() != null and descriptor.getDateEffective().getTime() > date.getTime()) {
        return false
      }
      if (descriptor.getDateExpiration() != null and descriptor.getDateExpiration().getTime() < date.getTime()) {
        return false
      }
    }
    return true
  }
  
  /** Determine if the template matches all supplied parameters.  Some special cases, some symbols should be checked with
   *  startsWith, i.e., a stem search.  Templates may have required symbols, this is matched against the supplied available
   * symbols.
   */

  private function descriptorMatchesAllValues(descriptor : IDocumentTemplateDescriptor, valuesToMatch : Map) : boolean {
    for (var propName in valuesToMatch.keySet() as Set<String>) {
      if (propName.equalsIgnoreCase( AVAILABLE_SYMBOLS_PROPNAME ) ) { // available vs required symbol check, 
        var requiredSymbols = descriptor.getMetadataPropertyValue("requiredsymbols")
        if (requiredSymbols != null and not TemplatePluginUtils.matchStringsEqual( valuesToMatch.get( propName ), requiredSymbols) ) {
          return false
        }
      }
      else if (StemSearchPropNames.contains(propName.toLowerCase())) {
         if (not matchStartsWith(propName, descriptor.getMetadataPropertyValue(propName), valuesToMatch)) {
           return false;
         }
      }
      else {
         if (not match(propName, descriptor.getMetadataPropertyValue(propName), valuesToMatch)) {
           return false;
         }
      }
    }
    return true
  }
  
   private function match(propName : String, value : Object, valuesToMatch : Map) : boolean {
     try {
        return TemplatePluginUtils.matchStringsEqual( value, valuesToMatch.get( propName )) 
     } catch (exception) {
       throw new IllegalArgumentException("On ${propName}: ${exception.Message}")
     }
   }

   private function matchStartsWith(propName : String, value : Object, valuesToMatch : Map) : boolean {
     try {
        return TemplatePluginUtils.matchStringsStartsWith( value, valuesToMatch.get( propName )) 
     } catch (exception) {
       throw new IllegalArgumentException("On ${propName}: ${exception.Message}")
     }
   }
  /** Determine if the descriptor is valid
  */
  function descriptorIsValid(descriptor : IDocumentTemplateDescriptor) : boolean {
    return descriptor != null
  }

  /**
   * Returns the document template for the template id.
   *
   * @param strTemplateId The template id.
   * @return A document template intance corresponding to the specified template id or null
   *         no template corresponds to the id.
   */
  override function getDocumentTemplate( strTemplateId: String ) : IDocumentTemplateDescriptor {
    return getDocumentTemplate(strTemplateId, null);
  }

  /** Return the document template for the given template id in the given locale
  */
  override function getDocumentTemplate( strTemplateId: String, locale : ILocale ) : IDocumentTemplateDescriptor {
    var propMap = new HashMap<String, String>() {
      "templateid" -> strTemplateId,
      LOCALE_PROPNAME -> locale.Code
    }
    var descriptors = getDocumentTemplates(null, propMap, 1)
    return descriptors.first()
  }

  /** This will parse the document descriptor file so that getMetadataProperty can be called to 
  extract values to be compaired
  */
  private function getDocumentTemplateHelper(strTemplateId : String, serializer:IDocumentTemplateSerializer) : IDocumentTemplateDescriptor  {
    //TODO BHJ see the comment in descriptorIsValid
    if (strTemplateId == null || strTemplateId.length() == 0 ) {
      return null;
    }
    var reader : BufferedReader;
    var is : InputStream;
    try {
      var strDescriptorId = strTemplateId + ".descriptor"
      is = getTemplateDescriptorAsStream(strDescriptorId);
      var descriptor = serializer.read(is)
      descriptor.setDateModified(getDateTemplateModified(strTemplateId))
      return descriptor;
    } catch (t : Throwable) {
      //Log the error and return; we don't want to blow up here, because the user may be looking for a set of templates and not care about
      // this one in particular
      Logger.DOCUMENT.error("Could not load a document template descriptor: ${strTemplateId}", t);
      return null;
    } finally {
      //The catch blocks here are empty because throwing inside a finally is a bad idea
      if (reader != null) {
        try { reader.close(); } catch (e : Exception) {/*ignore*/}
      }
      if (is != null) {
        try { is.close(); } catch (e : Exception) {/*ignore*/}
      }
    }
  }


  private function getDateTemplateModified(strFileName : String) : Date {
    var file = new File(_templateDir, strFileName)
    if ( file.exists()) {
      return new Date(file.lastModified());
    }
    return null;
  }

  /** This will return the document descriptors from the directory which should contain the document descriptors
  */
  private function getTemplateDescriptors(locale : ILocale) : List<IDocumentTemplateDescriptor> {
    // deal with the cache
    // if caching we need to populate the cache without filtering by locale
    if (_cacheDescriptors && _loadedDescriptors == null) {
      _loadedDescriptorsLock.with(\->{
        _loadedDescriptors = getLocalTemplateDescriptors( null ) // get all descriptors
      })
    }
    // now that we have a cache either return it or filter it
    if (_cacheDescriptors && _loadedDescriptors != null) {
      return locale == null ? _loadedDescriptors : filterByLocale(locale)
    }
    return getLocalTemplateDescriptors( locale )
  }
 
  private function getLocalTemplateDescriptors(locale : ILocale) : List<IDocumentTemplateDescriptor> {
    var files = new ArrayList<String>()
    _descriptorDir.listFiles().each( \ f -> {
      if (f.Name.toLowerCase().endsWith(DESCRIPTOR_SUFFIX)) { 
          files.add(f.Name)
      }
    })
    Logger.DOCUMENT.debug(\->"Found " + files.Count + " document template discriptors")

    var localDescriptors = new ArrayList<IDocumentTemplateDescriptor>()
    if (files.isEmpty()) {
      //Null indicates a directory path or IO problem. Don't cache in this case
      Logger.DOCUMENT.error("Could not find Document Template Files in ${_descriptorDir.Path}. Usually this error indicates that either the configured directory does not exist or there was an I/O problem")
      return new ArrayList<IDocumentTemplateDescriptor>()
    } else {      
      var iDescriptorSuffixLength = DESCRIPTOR_SUFFIX.length()
      var templateLocaleDirs = _templateDir.listFiles( \ file ->  file.Directory)
      var serializer = gw.plugin.Plugins.get(IDocumentTemplateSerializer);
      // this is modifying the global
      // it is either not cached or is only ever executed with a null locale
      // this is insured in the top of the method by explicitly recusing with null
      if (locale != null) { // only need to search the specified locale and default
        templateLocaleDirs = templateLocaleDirs.where( \ t -> locale.Code == t.Name )
      }
      for (var file in files) {
        var strSansDescriptor = file.substring(0, file.length() - iDescriptorSuffixLength)
        var template = getDocumentTemplateHelper(strSansDescriptor, serializer)
        if (template == null) {
          Logger.DOCUMENT.error("Document Template plugin found a file ending in .descriptor, but couldn't find the corresponding template file! Descriptor: " + file + ", missing template: " + strSansDescriptor)
          continue
        }
        var found = false;
        for (var localeDir in templateLocaleDirs ) {
          if (new File(localeDir, template.TemplateId).exists()) {
            var dirLocale = ILocale.valueOf( localeDir.Name )
             localDescriptors.add(serializer.localize( dirLocale, template))
             found = true;
          }
        }
        if (locale == null or not found) {
          if (new File(_descriptorDir, template.TemplateId).exists()) {
            localDescriptors.add(template)
          }
        }
      }
    }
    return localDescriptors
  }

  /** this will find the best template for the desired locale.
  * The order of the templates is locale specific templates first, followed by the default
  * template.  So if we find the template for the locale we don't add the the default,
  * if we don't find the template for the locale, but do find the default template, then
  * we add that.
  */
  private function filterByLocale(locale : ILocale) : List<IDocumentTemplateDescriptor> {
    var rtn = new ArrayList<IDocumentTemplateDescriptor>()
    var doingId : String
    var found = false
    for (descriptor in _loadedDescriptors) {
      if (descriptor.TemplateId != doingId) {
        found = false
      }
      if (descriptor.Locale == null) {
        if (not found) {
          rtn.add(descriptor)
        }
      }
      else if (locale == descriptor.Locale) {
        rtn.add(descriptor)
        found = true;
      }
    }
    return rtn;
  }
  
  private function getTemplateFileAsStream(strTemplateId : String, locale : ILocale) : InputStream {
    var dir = locale == null ? _templateDir : new File(_templateDir, locale.Code)
    if (not dir.exists()) {
      dir = _templateDir 
    }
    Logger.DOCUMENT.debug(\-> "Retrieving template ${strTemplateId} in locale ${locale.Code} " )
    try {
      var testFile = new File(dir, strTemplateId)
      if (not testFile.exists()) {
        testFile = new File(_templateDir, strTemplateId)
      }
      return new BufferedInputStream(new FileInputStream(testFile))
    } catch (e : Throwable) {
      throw new DisplayableException("Cannot access ${strTemplateId} in locale ${locale.Code}", e)
    }
  }

  private function getTemplateDescriptorAsStream(strTemplateDescriptorName : String) : InputStream  {
    return new BufferedInputStream(new FileInputStream(new File(_descriptorDir, strTemplateDescriptorName)))
  }
}
