package gw.plugin.ccabintegration.impl

uses com.guidewire.pl.plugin.addressbook.AddressBookRemotableSearchResultSpec
uses soap.abintegration.entity.ObjectFilter
uses soap.abintegration.api.IContactAPI
uses soap.abintegration.entity.ABContactSearchResult
uses java.lang.Integer
uses soap.abintegration.enums.ABContactSearchResultType
uses soap.abintegration.entity.ABContactSearchResultSpec
uses soap.abintegration.entity.ABContactSearchSortColumn
uses java.lang.StringBuffer
uses org.apache.commons.lang.StringUtils
uses gw.api.util.DisplayableException
uses gw.api.util.mapping.ObjectConverter

class SearchOperationBase extends AddressBookOperation {
  private var _searchFilter : ObjectFilter

  construct(converterFactory : ObjectConverterFactory, api : IContactAPI, searchFilter : ObjectFilter) {
    super(converterFactory, api)
    _searchFilter = searchFilter
  }

  function convertSearchResult(abContactSearchResult : ABContactSearchResult) : ContactSearchResult {
    var contactSearchResult = new ContactSearchResult()
    contactSearchResult.TotalResults = new Integer(abContactSearchResult.getTotalResults())

    if (ABContactSearchResultType.GW_TC_SUCCESS.equals(abContactSearchResult.getSearchResultType())) {
      contactSearchResult.SearchResultType = ContactSearchResultType.TC_SUCCESS
      var abResults = abContactSearchResult.getResults()
      var results = new Contact[abResults.length]
      for(abContact in abResults index i) {
        var o = getABToCCConverter().convert(abContact, soap.abintegration.entity.ABContact);
        results[i] = o as Contact
      }
      contactSearchResult.Results = results
    } else if (ABContactSearchResultType.GW_TC_TOO_LOOSE_SEARCH.equals(abContactSearchResult.getSearchResultType())) {
      contactSearchResult.SearchResultType = ContactSearchResultType.TC_TOO_LOOSE_SEARCH
    } else {
      throw new DisplayableException("Unexpected ABContactSearchResultType: " + abContactSearchResult.getSearchResultType());
    }
    return contactSearchResult;
  }

  function convertSearchResultSpec(remotableSearchResultSpec : AddressBookRemotableSearchResultSpec) :ABContactSearchResultSpec  {
    var abContactSearchResultSpec = new ABContactSearchResultSpec()
    abContactSearchResultSpec.GetNumResultsOnly = remotableSearchResultSpec.GetNumResultsOnly
    var excludedContactSubtypes = remotableSearchResultSpec.getContactSubtypeFilter();
    if(excludedContactSubtypes != null) {
      var abExcludedContactSubtypes = new String[excludedContactSubtypes.length];
      for (excludedContactSubtype in excludedContactSubtypes index i) {
        abExcludedContactSubtypes[i] = translateEntityIntrinsicType(getCCToABConverter(), excludedContactSubtype);
      }
      abContactSearchResultSpec.ContactSubtypeFilter = abExcludedContactSubtypes
    }
    
    if( abContactSearchResultSpec.GetNumResultsOnly ) {
      // return immediately if only number of result is needed.
      return abContactSearchResultSpec
    }
    abContactSearchResultSpec.IncludeTotal = remotableSearchResultSpec.IncludeTotal
    abContactSearchResultSpec.MaxResults = remotableSearchResultSpec.MaxResults
    abContactSearchResultSpec.ObjectFilter = _searchFilter
    abContactSearchResultSpec.StartRow = remotableSearchResultSpec.StartRow
    var sortColumns = remotableSearchResultSpec.SortColumns
    var abSortColumns = new ABContactSearchSortColumn[sortColumns.length];
    for( remotableSortColumn in sortColumns index i) {
      abSortColumns[i] = new ABContactSearchSortColumn();
      abSortColumns[i].Ascending = remotableSortColumn.isAscending()
      var beanPath = translateBeanPath(getCCToABConverter(), remotableSortColumn.getSortPath());
      abSortColumns[i].BeanPath = beanPath
    }
    abContactSearchResultSpec.SortColumns = abSortColumns
    return abContactSearchResultSpec;
  }

  static function translateBeanPath(converter : ObjectConverter, beanPath : String) : String {
    var translatedPath = new StringBuffer()
    var entityAndPath = StringUtils.split(beanPath, ".")
    for(elem in entityAndPath index j) {
      // Don't translate the last element, assume this is a field
      if (j < (entityAndPath.length - 1)) {
        // Assume this is an entity, so translate the entity name
        elem = converter.getTranslator().translateEntityName(elem)
      }
      if (j > 0) {
        translatedPath.append(".")
      }
      translatedPath.append(elem)
    }
    return translatedPath.toString()
  }

  static function translateEntityIntrinsicType(converter : ObjectConverter, type : String) : String {
    return converter.getTranslator().translateEntityName(type)
  }
}
