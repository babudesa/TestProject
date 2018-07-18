package gw.api.filters

uses com.guidewire.pl.system.dependency.PLDependencies
uses com.guidewire.pl.system.filters.QueryBasedQueryFilter

class MessageDestinationFilterSet
{
  construct()
  {
  }

  public function getFilterOptions() : QueryBasedQueryFilter[] {
    var destinations = PLDependencies.getMessagingConfiguration().getDestinations()
    var index = 0
    var filters = new QueryBasedQueryFilter[destinations.length + 1]
    filters[index] = gw.api.util.CoreFilters.ALL
    index = index + 1
    for (destination in destinations) {
      filters[index] = new MessageDestinationFilter(destination)
      index = index + 1
    }
    return filters
  }
}

