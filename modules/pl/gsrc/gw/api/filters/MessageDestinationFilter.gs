package gw.api.filters

uses com.guidewire.pl.system.database.Query
uses com.guidewire.pl.system.filters.QueryBasedQueryFilter
uses gw.entity.IEntityPropertyInfo

class MessageDestinationFilter implements QueryBasedQueryFilter
{
  var _destinationID : int
  var _destinationName : String
  
  construct(destination : com.guidewire.pl.system.integration.messaging.config.DestinationConfig) {
    _destinationID = destination.getDestID()
    _destinationName = destination.Name
  }
  
  override function applyFilter(obj : Object) : boolean {
    return _destinationID == obj["DestinationID"] as int
  }

  override function filterQuery(query : Query) : Query {
    query.PrimaryTableObject.Restriction.compareEquals( InstrumentedMessage.Type.TypeInfo.getProperty( "DestinationID" ) as IEntityPropertyInfo, _destinationID, true )
    return query
  }
  
  override function toString() : String {
    return _destinationName
  }
}
