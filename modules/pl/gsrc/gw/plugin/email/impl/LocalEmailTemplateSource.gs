package gw.plugin.email.impl

uses gw.plugin.email.IEmailTemplateDescriptor
uses gw.api.util.DisplayableException
uses gw.api.util.Logger
uses gw.document.TemplatePluginUtils
uses gw.i18n.ILocale
uses gw.plugin.InitializablePlugin
uses gw.plugin.email.IEmailTemplateSource
uses gw.util.StreamUtil
uses gw.plugin.email.EmailConfigUtil

uses java.io.BufferedReader
uses java.io.File
uses java.io.FileInputStream
uses java.io.InputStreamReader
uses java.util.ArrayList
uses java.util.Map
uses java.util.HashMap
uses java.util.HashSet
uses java.util.Set

@Export
class LocalEmailTemplateSource implements InitializablePlugin, IEmailTemplateSource {

  static var TOPIC : String = "topic"
  static var NAME : String = "name"
  static var KEYWORDS : String = "keywords"
  static var AVAILABLE_SYMBOLS : String = "availablesymbols"
  
  static var DESCRIPTOR_SUFFIX : String = ".descriptor"
  static var TEMPLATES_PATH : String = "templates.path"
  static var DESCRIPTORS_PATH : String = "descriptors.path"
  static var DESC_SUFF_LEN = DESCRIPTOR_SUFFIX.length()

  var _templateDir : File
  var _descriptorDir : File

  /** This is called by the plugin initialization.
   */ 
  override function setParameters( params : Map<Object,Object> ) {
    var rootDirPath = params.get(ROOT_DIR) as String

    _templateDir = EmailConfigUtil.getTemplateDirectory(rootDirPath, params.get(TEMPLATES_PATH) as String)
    _descriptorDir = EmailConfigUtil.getDiscriptorDirectory(rootDirPath, params.get(DESCRIPTORS_PATH) as String)
  }

  /**
  * @Deprecated use the locale aware version which also supports available symbols
  */
  override public function getEmailTemplates(strTopic : String, keywrds : String[]) : IEmailTemplateDescriptor[] {
    var map = new HashMap<String,Object>()
    if (strTopic != null) { map.put(TOPIC, strTopic) }
    if (keywrds != null) { map.put(KEYWORDS, keywrds) }
    return getEmailTemplates( null, map )
  }
  
  /** This is the routine that will perform the search of the available templates.  If doing a locale specific search, it will search
   * first the lang/country/var, then the lang/country, then the lang, then the default.  The locales are subdirectories in the
   * template directory with the directory name equalling the locale code.
   *
   * @param locale the locale to search for
   * @param valuesToMatch the values to test
   *   keys are "topic", "name", "keywords", "availablesymbols"
   *   availablesymbols are matched against the template's requiredsymbols
   */ 
  override public function getEmailTemplates(locale : ILocale, valuesToMatch : Map) : IEmailTemplateDescriptor[] {
    var list = new ArrayList<IEmailTemplateDescriptor>();
    var foundFileNames = new HashSet<String>()
    var map = new HashMap<String,Object>()
    valuesToMatch.eachKeyAndValue( \ key, value -> map.put((key as String).toLowerCase(), value ))

    // if doing a locale specific search just want to limit it to that directory and the default
    var locales = locale == null ? LanguageType.getTypeKeys( false ).map( \ l -> ILocale.valueOf( l.Code ) ) : new ArrayList<ILocale>(){ locale }
    for (wkLocale in locales) {
      handleADirectory(wkLocale, new File(_descriptorDir, wkLocale.Code), foundFileNames, list, map, false)
    }
    // now pickup any emails with default
    handleADirectory(null, _descriptorDir, foundFileNames, list, map, locale != null)
    return list.toTypedArray()
  }


  private function handleADirectory(locale : ILocale, dir : File, foundFileNames : Set<String>, list : List<IEmailTemplateDescriptor>, 
                                    valuesToMatch : Map,
                                    skipIfPresent : boolean) {
    if (dir.exists()) {
      var fileNames = dir.listFiles( \ file -> !file.Directory and file.getName().toLowerCase().endsWith(DESCRIPTOR_SUFFIX) ).map( \ f -> f.Name)
      if (skipIfPresent) { // if doing a locale search, this will be true on the search for default templates so just ignore them
        fileNames = fileNames.where( \ s -> not foundFileNames.contains(s) )
      }
      for (fileName in fileNames) {
        var strSansDescriptor = fileName.substring(0, fileName.length() - DESC_SUFF_LEN)
        var template = getEmailTemplate(locale, strSansDescriptor)
        var availSyms = valuesToMatch.get(AVAILABLE_SYMBOLS)
        if (template != null 
            && matchStartsWith(NAME, template.Name, valuesToMatch) 
            && match(TOPIC, template.Topic, valuesToMatch) // a typelist
            && (availSyms == null or TemplatePluginUtils.matchStringsEqual( availSyms, template.RequiredSymbols))
            && match(KEYWORDS, template.Keywords, valuesToMatch) ) { 
          template.Filename = strSansDescriptor
          list.add(template)
        }
      }
    }
   }
   
   private function match(propName : String, value : Object, valuesToMatch : Map) : boolean {
     try {
        return TemplatePluginUtils.matchStringsEqual( value, valuesToMatch.get( propName )) 
     } catch (exception) {
       throw new DisplayableException("On " + propName + ": " + exception.Message)
     }
   }
   private function matchStartsWith(propName : String, value : Object, valuesToMatch : Map) : boolean {
     try {
        return TemplatePluginUtils.matchStringsStartsWith( value, valuesToMatch.get( propName )) 
     } catch (exception) {
       throw new DisplayableException("On " + propName + ": " + exception.Message)
     }
   }
  /**
   * Returns the email template for the template filename.
   *
   * @param strTemplateFilename The template filename.
   * @return A email template instance corresponding to the specified template filename
   *         or null if no template corresponds to the name.
   */
  override public function getEmailTemplate( strTemplateFilename : String ) : IEmailTemplateDescriptor {
    return getEmailTemplate(null, strTemplateFilename)
  }
  
  /**
   * Returns the email template for the template filename.  This assumes that the strTemplateName is just the
   * fileName.
   *
   * @param templateFilename The template filename.
   * @return A email template instance corresponding to the specified template filename
   *         or null if no template corresponds to the name.
   */
  override public function getEmailTemplate( locale : ILocale, templateFilename : String ) : IEmailTemplateDescriptor {
    if (templateFilename == null || templateFilename.length() == 0) {
      return null
    }
    
    var descriptorFile = new File(locale == null ? _descriptorDir : new File(_descriptorDir, locale.Code), templateFilename + DESCRIPTOR_SUFFIX)
    var templateFile = new File(locale == null ? _templateDir : new File(_templateDir, locale.Code), templateFilename)
    if (not (descriptorFile.exists() and templateFile.exists()) ) {
      descriptorFile = new File(_descriptorDir, templateFilename + DESCRIPTOR_SUFFIX)
      templateFile = new File(_templateDir, templateFilename)
      locale = null
      if (not (descriptorFile.exists() and templateFile.exists()) ) {
        return null
      }
    }
    
    var reader : BufferedReader
    var reader2 : BufferedReader
    try {
      reader = new BufferedReader(new InputStreamReader(new FileInputStream(descriptorFile), "UTF-8"))
      var descriptor = EmailConfigUtil.parse(reader)
      descriptor.Locale = locale
      descriptor.Filename = templateFilename

      // get the actual body
      reader2 = new BufferedReader(new InputStreamReader(new FileInputStream(templateFile), "UTF-8"))
      descriptor.setBody(StreamUtil.getContent( reader2 )) // lets convert a file to a string?
      descriptor.Locale = locale
      return descriptor;

    } catch (exception) {
      throw new DisplayableException(exception.getMessage(), exception);
    } finally {
      try { if (reader != null) reader.close() } 
      catch (exception) { 
        Logger.DOCUMENT.debug( "Error closing input file " + descriptorFile, exception )
      }
      try { if (reader2 != null) reader2.close() } 
      catch (exception) {
        Logger.DOCUMENT.debug( "Error closing input file " + templateFile, exception )
      }
    }
  }


}
