package gw.api.filters;
uses com.guidewire.pl.system.database.Query
uses gw.api.database.IQueryResult
uses com.guidewire.pl.system.database.impl.QueryImpl
uses com.guidewire.pl.system.database.impl.QueryProcessorImpl
uses com.guidewire.pl.system.filters.QueryBasedQueryFilter

@Deprecated("Please use StandardQueryFilter or StandardBeanFilter instead. This filter does an INTERSECT which can be innefficient in some cases.")
class GosuFilter implements QueryBasedQueryFilter {
  
  var _name : String;
  var _listFilter : block(o:Object) : Boolean;
  var _queryFilter : IQueryResult;
  
  construct(name : String, listFilter : block(o:Object) : Boolean, queryFilter : IQueryResult) {
    _name = name;
    _listFilter = listFilter;
    _queryFilter = queryFilter;
  }
  
  construct(name : String, listFilter : block(o:Object) : Boolean) {
    _name = name;
    _listFilter = listFilter;
  }

  construct(name : String, queryFilter : IQueryResult) {
    _name = name;
    _queryFilter = queryFilter;
  }

  override function applyFilter(obj : Object) : boolean {
    if(_listFilter == null) {
      throw "Query-based filter incorrectly applied to non-query-based listview";
    }
    return _listFilter(obj);
  }

  override function filterQuery(query : Query) : Query {
    if(_queryFilter == null && _listFilter != null) {
      throw "Object-based filter incorrectly applied to query-based listview";
    } else if (_queryFilter == null) {
      return query;
    } else {
      return query.intersect(((_queryFilter as QueryProcessorImpl).getStoredQuery() as QueryImpl).deepClone());
    }
  }

  override function toString() : String {
    return _name;
  }
}