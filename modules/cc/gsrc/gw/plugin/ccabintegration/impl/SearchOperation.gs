package gw.plugin.ccabintegration.impl

uses soap.abintegration.api.IContactAPI
uses soap.abintegration.entity.ObjectFilter
uses com.guidewire.pl.plugin.addressbook.AddressBookRemotableSearchResultSpec
uses soap.abintegration.entity.ABContactSearchCriteria
uses soap.abintegration.entity.ABContactSearchResult
uses gw.api.util.DisplayableException

class SearchOperation extends SearchOperationBase {

  construct(converterFactory : ObjectConverterFactory, api : IContactAPI, searchFilter : ObjectFilter) {
    super(converterFactory, api, searchFilter)
  }

  function searchContact(searchCriteria : ContactSearchCriteria, remotableSearchResultSpec : AddressBookRemotableSearchResultSpec) : ContactSearchResult {
    var contactSearchResult : ContactSearchResult
    try {
      var abContactSearchCriteria = getCCToABConverter().convert(searchCriteria, typeof searchCriteria) as ABContactSearchCriteria
      // FOR PL-1464: if we have an Address criteria set and the country is set to null, we need to set 
      //    IgnoreCountry to true as soap will not serialize the null, and ContactCenter will insert the 
      //    default country for us there.
      if (searchCriteria.Address != null && searchCriteria.Address.Country == null) {
        abContactSearchCriteria.IgnoreCountry = true;
      }
      var abContactSearchResult =
              getContactAPI().searchContact(abContactSearchCriteria, convertSearchResultSpec(remotableSearchResultSpec))
      contactSearchResult = convertSearchResult(abContactSearchResult)
    } catch (e) {
      throw new DisplayableException("Error searching contact " + e.Cause, e)
    }
    return contactSearchResult
  }
}
