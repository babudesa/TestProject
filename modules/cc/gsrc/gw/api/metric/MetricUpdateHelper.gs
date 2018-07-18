package gw.api.metric
uses gw.transaction.Bundle
uses gw.entity.IEntityType
uses java.util.Set
uses java.util.HashSet
uses java.lang.Iterable

/**
 * A utility class for use in metric update methods, to simplify checking whether
 * entities of a particular type are changed as part of this bundle commit. It
 * snapshots all changes in the bundle at the time it is created, so it makes
 * the assumption that none of the metric update methods will change any entities
 * (other than the metrics themselves)
 */
@ReadOnly
class MetricUpdateHelper {

  var _changedTypes : Set<Type> = null
  
  /** Create a new helper for the given bundle */
  construct(bundle : Bundle) {
    _changedTypes = new HashSet<Type>()
    addChanges(_changedTypes, bundle.InsertedBeans)
    addChanges(_changedTypes, bundle.UpdatedBeans)
    addChanges(_changedTypes, bundle.RemovedBeans)
  }

  /** Does the bundle contain an insert, update or remove for the given type of entity */
  function updateContainsChangesOfType(type : IEntityType) : boolean {
    return _changedTypes.contains(type)
  }
  
  private function addChanges(types : Set<Type>, beans : Iterable<KeyableBean>) {
    for (bean in beans) {
      for (type in (typeof bean).AllTypesInHierarchy) {
        types.add(type as Type)
      }
    }
  }
}
