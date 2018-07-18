package gw.api.filters
uses gw.entity.TypeKey
uses gw.entity.ITypekeyPropertyInfo
uses com.guidewire.pl.system.database.Query
uses com.guidewire.pl.system.filters.QueryBasedQueryFilter

class TypeKeyFilter implements QueryBasedQueryFilter {
  
  var _typeKey : TypeKey
  var _typekeyPropertyInfo : ITypekeyPropertyInfo
  
  construct(typeKey : TypeKey, typekeyPropertyInfo: ITypekeyPropertyInfo) {
    _typeKey = typeKey
    _typekeyPropertyInfo = typekeyPropertyInfo
  }
  
  override function applyFilter(obj : Object) : boolean {
    return _typeKey == obj[_typekeyPropertyInfo.Name] as TypeKey
  }

  override function filterQuery(query : Query) : Query {
    query.PrimaryTableObject.Restriction.compareEquals( _typekeyPropertyInfo, _typeKey, true )
    return query
  }
  
  override function toString() : String {
    return _typeKey.getDisplayName()
  }
}