package gw.lang.enhancements
uses java.util.Collection
uses java.lang.Comparable
uses gw.util.IOrderedList

enhancement CoreCollectionOfComparablesEnhancement<T extends Comparable> : Collection<T> {

  /**
   * Returns the minium non-null element in this collection, or null
   * if all elements are null or the colleciton is empty.
   */
  function min() : T {
    return this.min( \ e -> e ) 
  }

  /**
   * Returns the maximum non-null element in this collection, or null if
   * all elements are null or the collection is empty.   
   */
  function max() : T {
    return this.max( \ e -> e )
  }

  /**
   * Returns a new list of the elements of this collection ordered naturally
   */
  function order() : IOrderedList<T> {
    return this.orderBy( \ c -> c )
  }
  
  /**
   * Returns a new list of the elements of this collection reverese ordered naturally
   */
  function orderDescending() : IOrderedList<T> {
    return this.orderByDescending( \ c -> c )
  }

}