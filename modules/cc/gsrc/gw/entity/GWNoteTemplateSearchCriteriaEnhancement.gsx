package gw.entity
uses gw.plugin.note.INoteTemplateSource
uses gw.api.util.DisplayableException
uses java.util.ArrayList
uses java.util.HashMap
uses gw.api.util.LocaleUtil
uses gw.api.system.PLLoggerCategories

enhancement GWNoteTemplateSearchCriteriaEnhancement : entity.NoteTemplateSearchCriteria
{
  function performSearch() : NoteTemplateSearchResults[] {
    var nts : INoteTemplateSource = null
    try {
      nts = gw.plugin.Plugins.get(INoteTemplateSource)
    } catch (e) {
      throw new DisplayableException(displaykey.Java.Note.Template.Plugin.Exception)
    }
    
    // populate values to match
    var valuesToMatch = new HashMap<String, Object>()
    for (prop in NoteTemplateSearchCriteria.Type.EntityProperties) {
      if (prop.Name == "ID" or prop.Name == "PublicId" or prop.Name == "BeanVersion") {
        // skip
      }
      else {
        var value = this[prop.Name]
        if (value == null) {
          // skip
        }
        else if (value typeis TypeKey) { 
          valuesToMatch.put(prop.Name, value.Code)
        }
        else {
          valuesToMatch.put(prop.Name, value)
        }
      }
    }
    
    // perform the search
    var templates = nts.getNoteTemplates(LocaleUtil.toLocale(this.getLanguage()), valuesToMatch)
    var resultsList = new ArrayList<NoteTemplateSearchResults>(templates.Count)
    
    //Convert results from INoteTemplateDescriptor to NoteTemplateSearchResults (non-persistent bean)
    for (template in templates) {
      var searchResults = new NoteTemplateSearchResults()
      try {
        searchResults.Name = template.Name
        searchResults.Topic = template.Topic as NoteTopicType
        searchResults.Type = template.Type as NoteType
        searchResults.LossTypes = template.LobTypes.map( \ s -> (s as LossType).DisplayName).join( ", " )
        searchResults.Body = template.Body
        searchResults.Subject = template.Subject
        searchResults.Language = LocaleUtil.toLanguage( template.Locale )
        resultsList.add(searchResults)
      } catch (e) {
        PLLoggerCategories.PLUGIN.error("Failed to load a template (" + template.getName() + ") due to exception: ", e);
        continue;
      }
    }
    return resultsList as NoteTemplateSearchResults[]
  }
}
