package gw.transaction
uses gw.transaction.Bundle

enhancement GWBaseBundleEnhancement : Bundle {
  
  /**
   * Returns any beans of the given type that have been inserted in the bundle
   */
  function getInsertedBeansOfType<Q>(t : Type<Q>) : List<Q> {
    return this.InsertedBeans.toList().whereTypeIs(t)
  }
  
  /**
   * Returns any beans of the given type that have been updated in the bundle
   */
  function getUpdatedBeansOfType<Q>(t : Type<Q>) : List<Q> {
    return this.UpdatedBeans.toList().whereTypeIs(t)
  }

  /**
   * Returns any beans of the given type that have been removed in the bundle (that is, they are added for
   * remove and will be retired or deleted when the bundle is committed)
   */
  function getRemovedBeansOfType<Q>(t : Type<Q>) : List<Q> {
    return this.RemovedBeans.toList().whereTypeIs(t)
  }
  
  /**
   * Returns any beans of the given type that have been inserted or updated in the bundle; this combination is
   * often useful because it represents beans of the given type that are still active (not removed) but are either
   * new or changed.
   */
  function getInsertedAndUpdatedBeansOfType<Q>(t : Type<Q>) : List<Q> {
    var result = getInsertedBeansOfType(t)
    result.addAll(getUpdatedBeansOfType(t))
    return result
  }

  /**
   * Returns all modified (inserted, updated or removed) beans of the given type in the bundle
   */
  function getAllModifiedBeansOfType<Q>(t : Type<Q>) : List<Q> {
    var result = getInsertedAndUpdatedBeansOfType(t)
    result.addAll(getRemovedBeansOfType(t))
    return result
  }
}
