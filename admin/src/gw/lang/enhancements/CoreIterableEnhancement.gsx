package gw.lang.enhancements

uses java.util.Collection
uses java.lang.Iterable
uses java.util.ArrayList
uses java.lang.IllegalStateException
uses java.util.Set
uses java.util.HashSet

enhancement CoreIterableEnhancement<T> : java.lang.Iterable<T> {    

  /**
   * Return the number of elements in this Iterable object
   */
  property get Count() : int {
    if( this typeis Collection ) {
      return this.size()
    } else {
      var iter = this.iterator()
      var i = 0
      while(iter.hasNext()) {
        iter.next()
        i++
      }
      return i
    }
  }
 
  /**
   * Returns a single element from this iterable, if only one exists.  It no elements are
   * in this iterable, or if there are more than one elements in it, an IllegalStateException
   * is thrown
   */
  function single() : T {
    var iter = this.iterator()
    if( not iter.hasNext() ) { 
      throw new IllegalStateException( "This iterable has no elements in it" )
    } 
    var val = iter.next()
    if( iter.hasNext() ) {
      throw new IllegalStateException( "This iterable has more than one element in it" )
    }
    return val
  }

  /**
   * If this Iterable is already a Collection, return this Itearble cast to a Collection.  
   * Otherwise create a new Collection and copy this Iterable into it.
   */
  function toCollection() : Collection<T> {
    if( this typeis Collection ) {
      return this as Collection<T>
    } else {
      var lst = new ArrayList<T>()
      for( e in this ){
        lst.add( e )
      }
      return lst
    }
  }

  /**
   * If this Iterable is already a List, return this Iterable cast to a List.  
   * Otherwise create a new List and copy this Iterable into it.
   */
  function toList() : List<T> {
    if( this typeis List ) {
      return this as List<T>
    } else {
      var lst = new ArrayList<T>()
      for( e in this ){
        lst.add( e )
      }
      return lst
    }
  }

  /**
   * If this Iterable is already a Set, return this Iterable cast to a Set.  Otherwise create a new
   * Set based on this Iterable.
   */
  function toSet() : Set<T> {
    if( this typeis Set ) {
      return this as Set<T>
    } else {
      var st = new HashSet<T>()
      for( e in this ){
        st.add( e )
      }
      return st
    }
  }

  /**
   * Returns a strongly-typed array of this Iterable, as opposed to the argumentless Iterable#toArray(), which
   * returns an Object array.  This method takes advantage of static reification and, therefore, does not necessarily
   * return an array that matches the theoretical runtime type of the Iterable, if actual reification were supported.
   */
  function toTypedArray() : T[]
  {
    var asCollection = this.toCollection()
    var arr = T.Type.makeArrayInstance( asCollection.Count ) as T[]
    for( elt in asCollection index i ) {
      arr[i] = elt
    }
    return arr
  }
}