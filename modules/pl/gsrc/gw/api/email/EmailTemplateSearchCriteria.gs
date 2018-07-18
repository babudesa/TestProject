package gw.api.email;

uses gw.plugin.email.IEmailTemplateDescriptor;

uses gw.api.util.DisplayableException
uses gw.api.util.LocaleUtil
uses gw.plugin.email.IEmailTemplateSource;

uses java.util.HashMap

@Export
class EmailTemplateSearchCriteria implements java.io.Serializable {  
  var _topic : String as Topic
  var _keywords : String as Keywords
  var _language : LanguageType as Language
  var _availableSymbols : String[] as AvailableSymbols 
  // see manually created copy() method add any new variable to that as well 
  
  construct() {
    Language = LocaleUtil.toLanguage(User.util.CurrentLocale)
  }
  
  construct(availSymbols : String[]) {
    this()
    AvailableSymbols = availSymbols
  }
  
  function performSearch() : IEmailTemplateDescriptor[] {
    var ets : IEmailTemplateSource;
    try {
      ets = gw.plugin.Plugins.get(IEmailTemplateSource)
    } catch (e) {
      throw new DisplayableException("Could not find a plugin configured for IEmailTemplateSource", e);
    }

    var valuesToMatch = new HashMap<String,String>()
    valuesToMatch.put("topic", _topic)
    valuesToMatch.put("keywords", _keywords)
    if (_availableSymbols != null) {
      valuesToMatch.put("availablesymbols", _availableSymbols.join( "," ))
    }
    var templates = ets.getEmailTemplates(LocaleUtil.toLocale( _language ), valuesToMatch);
    return templates;
  }
    
  function copy() : EmailTemplateSearchCriteria {
    var rtn = new EmailTemplateSearchCriteria()
    rtn._topic = Topic
    rtn._keywords = Keywords
    rtn._language = Language
    rtn._availableSymbols = AvailableSymbols
    return rtn
  }
}
