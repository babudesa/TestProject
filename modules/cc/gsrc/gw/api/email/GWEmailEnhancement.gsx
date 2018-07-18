package gw.api.email

uses gw.api.util.DisplayableException
uses gw.document.TemplatePluginUtils
uses gw.plugin.email.IEmailTemplateDescriptor
uses java.io.StringReader
uses java.util.Map
uses java.util.HashSet
uses gw.api.util.LocaleUtil

enhancement GWEmailEnhancement : gw.api.email.Email {
  
  function useEmailTemplate(template : IEmailTemplateDescriptor, beans : Map<String,Object>) {
    try {
      var locale = template.Locale
      if (locale == null) {
        locale = LocaleUtil.getDefaultLocale()
      }
      TemplatePluginUtils.resolveTemplates( locale, 
          {new StringReader(template.Subject), new StringReader(template.Body)}, 
          // set up the symbol table for the template processing
          // this is the same between email and note
          \ iScriptHost -> {
            // load the symbols supplied by the caller
            var seen = new HashSet<String>()
            for (entry in beans.entrySet()) {
              var bean = entry.getValue()
              if (bean != null) {
                iScriptHost.putSymbol(entry.Key, typeof(bean) as String, bean)
                seen.add(entry.Key.toLowerCase())
              }
            }
            // now load (or copy from other possible symbol names) the symbols that could be expected
            if (not seen.contains( "claim" )) {
              var actv = beans.get("Activity")
              if (actv typeis Activity) {
                var claim = actv.Claim
                if (claim != null) {
                  iScriptHost.putSymbol( "Claim", typeof(claim) as String, claim )
                }
              }
            }
          }, 
          // process the result of the template expansion
          \ results -> {
            this.Subject = results[0]
            this.Body = results[1]
          } )
    } catch (e) {   
       throw new DisplayableException("On ${template.getName()} caught ", e);
    }
  }
}
