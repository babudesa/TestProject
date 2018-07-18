package gw.api.filters

uses gw.entity.ITypekeyPropertyInfo
uses com.guidewire.pl.system.filters.BeanBasedQueryFilter
uses java.util.ArrayList
uses java.util.Collections

class WorkQueueFilterSet
{
  var _typekeyPropertyInfo : ITypekeyPropertyInfo

  construct(typekeyPropertyInfo : ITypekeyPropertyInfo)
  {
    _typekeyPropertyInfo = typekeyPropertyInfo
  }

  property get FilterOptions() : BeanBasedQueryFilter[] {
    var queueNames = new ArrayList<String>(com.guidewire.pl.system.dependency.PLDependencies.getDistributedWorkerManager().getQueueNames())
    Collections.sort( queueNames )
    var filters = new BeanBasedQueryFilter[queueNames.Count + 1];
    filters[0] = gw.api.util.CoreFilters.ALL

    var idx = 1;
    for (queueName in queueNames) {
      filters[idx] = new TypeKeyFilter(queueName as BatchProcessType, _typekeyPropertyInfo)
      idx = idx + 1
    }
    
    return filters;
  }
}
