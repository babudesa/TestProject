package gw.api.filters
uses gw.entity.ITypekeyPropertyInfo
uses gw.lang.reflect.IPropertyInfo
uses gw.entity.TypeKey
uses com.guidewire.pl.system.filters.BeanBasedQueryFilter
uses gw.entity.ITypeList

/*
 * This class is useful for filtering LVs by typekeys.
 * 
 * For example, if the History entity has a typekey called EventType, then one woudl construct this class to use 
 * as the ToolbarFilterOptionGroup with parameter "History.TypeInfo.getProperty( &quot;EventType&quot; )".
 * Calling getFilterOptions() on that instance will create a BeanBasedQueryFilter with all available typekeys plus an "ALL" filter.
 * Calling getFilterOptions() with a prepared list of typekeys as a parameter will create a BeanBasedQueryFilter with all only those
 * typekeys in the parameter.
 */
class TypeKeyFilterSet {
  
  var _typekeyPropertyInfo : ITypekeyPropertyInfo
  
  construct(typekeyPropertyInfo : IPropertyInfo) {
    _typekeyPropertyInfo = typekeyPropertyInfo as ITypekeyPropertyInfo
  }
  
/*
 * Returns a BeanBasedQueryFilter with all available typekeys plus an "ALL" filter.
 */
  public function getFilterOptions() : BeanBasedQueryFilter[] {
    var types = (_typekeyPropertyInfo.Type as ITypeList).getTypeKeys( false )
    var filter = new BeanBasedQueryFilter[types.Count + 1]
    filter[0] = gw.api.util.CoreFilters.ALL
    
    var index = 1
    populateTypeKeyFilter(filter, types, index)

    return filter
  }

/*
 * Takes as parameter a prepared list of typekeys and returns a BeanBasedQueryFilter with all only those
 * typekeys in the parameter. Also takes in a second parameter that determines whether "All" is an option in the filter.  
 */
  public function getFilterOptions(types : List<TypeKey>, withAllOption : Boolean) : BeanBasedQueryFilter[] {
    var filter : BeanBasedQueryFilter[]
    var index = 0

    if ( withAllOption ) {
      filter = new BeanBasedQueryFilter[types.Count + 1]
      filter[index] = gw.api.util.CoreFilters.ALL
      index = index + 1
    } else {
      filter = new BeanBasedQueryFilter[types.Count]
    }
    
    populateTypeKeyFilter(filter, types, index)

    return filter
  }
  
  private function populateTypeKeyFilter(filter : BeanBasedQueryFilter[], types : List<TypeKey>, index : int) {
    var iter = types.iterator()
    while (iter.hasNext()) {
      filter[index] = new TypeKeyFilter(iter.next(), _typekeyPropertyInfo)
      index = index + 1
    }
  }
}