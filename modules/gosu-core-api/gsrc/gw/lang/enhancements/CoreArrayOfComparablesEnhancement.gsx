package gw.lang.enhancements
uses java.lang.Comparable
uses java.util.Collections
uses java.util.Arrays

enhancement CoreArrayOfComparablesEnhancement<T extends Comparable> : T[]
{
  /**
   * Returns the minium non-null element in this collection, or null
   * if all elements are null or the colleciton is empty.
   */
  function min() : T {
    return this.toList().min( \ e -> e )
  }

  /**
   * Returns the maximum non-null element in this collection, or null if
   * all elements are null or the collection is empty.
   */
  function max() : T {
    return this.toList().max( \ e -> e )
  }

  /**
   * Sorts this array on the natural order of its elements
   */
  function sort() : T[]{
    if( this typeis Object[] ) {
      Arrays.sort( this )
    } else {
      throw "This array is not a java-based non-primitive array, and thus is not sortable"
    }
    return this
  }

  /**
   * Sorts this array descending on the natural order of its elements
   */
  function sortDescending() : T[]{
    if( this typeis Object[] ) {
      Arrays.sort( this, Collections.reverseOrder() )
    } else {
      throw "This array is not a java-based non-primitive array, and thus is not sortable"
    }
    return this
  }
  
}
