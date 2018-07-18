package gw.lang.enhancements

uses java.util.Collection
uses java.math.BigDecimal
uses java.lang.IllegalStateException
uses java.util.Set
uses java.lang.Comparable
uses java.util.ArrayList
uses java.util.Collections
uses java.lang.StringBuilder
uses gw.util.IOrderedList
uses java.util.Map
uses java.util.HashMap
uses java.util.LinkedHashSet

enhancement CoreCollectionEnhancement<T> : Collection<T> {
  
  /**
   * Returns true if all elements in this collection match the given
   * condition and false otherwise
   */
  function allMatch( cond(elt1 : T):Boolean ) : Boolean {
    for( e in this ) {
      if( not cond( e ) ) return false
    }
    return true
  }

  /**
   * Return the average of the mapped value
   */
  function average<N extends java.lang.Number>( select:block(elt:T):N ) : BigDecimal {
     return this.sum( select ) / (this.Count as BigDecimal)
  }
  
  /**
   * Return a new list that is the concatenation of the two lists
   */
  function concat( that : Collection<T> ) : Collection<T> {
    var returnList = new ArrayList<T>( this.Count + that.Count )
    returnList.addAll( this )
    returnList.addAll( that )
    return returnList
  }
  
  /**
   * Return the count of elements in this collection that match the
   * given condition
   */
  function countWhere( cond(elt:T):boolean ) : int {
    var i = 0
    for( e in this ) {
      if( cond( e) ) i++
    }
    return i
  }

 /**
  * Returns a the set disjunction of this collection and the other collection, that is,
  * all elements that are in one collection *not* and not the other.
  */
  function disjunction( that : Collection<T> ) : Set<T> {
    var intersection = this.intersect( that )
    return this.union( that ).subtract( intersection )
  }

  /**
   * This method will invoke the operation on each element in the Collection
   */
  function each( operation(elt : T) ) {
    for( elt in this ) {
      operation( elt )
    }
  }

  /**
   * This method will invoke the operation on each element in the Collection, passing in the
   * index as well as the element
   */
  function eachWithIndex( operation(elt : T, index : int ) ) {
    for( elt in this index i) {
      operation( elt, i )
    }
  }

  function flatMap<R>( mapper(elt:T):Collection<R> ) : List<R>{
    var returnList = new ArrayList<R>()
    for( elt in this ){
      var iter = mapper( elt )
      for( result in iter ) {
        returnList.add( result )
      }
    }
    return returnList
  }

  /**
   * Returns all the values of this collection folded into a single value
   */
  function fold( aggregator(elt1 : T, elt2 : T):T ) : T {
    var retVal : T = null
     for( elt in this index i ) {
       if( i == 0 ) {
         retVal = elt
       } else {
         retVal = aggregator( retVal, elt )
       }
     }
    return retVal
  }
  
  /**
   * Returns the first element in this collection.  If the collection is
   * empty, null is returned.
   */
  function first() : T {
    if( this.Count == 0 ) {
      return null
    } else {
      if( this typeis List ) {
        return this[0] as T
      } else {
        return this.iterator().next()
      }
    }
  }
  
  /**
   * Returns the first element in this collection that matches the given condition. 
   * If no element matches the criteria, null is returned.
   */
  function firstWhere( cond(elt:T):boolean ) : T {
    for( e in this ) {
      if( cond( e ) ) return e
    }
    return null
  }
  
  /**
   * Returns Boolean.TRUE if this collection has elements in it
   * and Boolean.FALSE otherwise.  This property is more consistent
   * across null and empty collections that the Empty property, which
   * returns true if the collection is empty, but null (interpreted
   * as false in if statements by Gosu) if the collection is null.
   */
  property get HasElements() : Boolean {
   return not this.Empty
  }

  /**
   * Returns true if any elements in this collection match the given
   * condition and false otherwise
   */
  function hasMatch( cond(elt1 : T):Boolean ) : Boolean
  {
    for( e in this ) {
      if( cond( e ) ) return true
    }
    return false
  }

  /**
   * Return the set intersection of these two collections. 
   */
  function intersect( that : Collection<T> ) : Set<T>{
    var set = this typeis Set ? this.copy() as Set<T> : new LinkedHashSet<T>( this )
    set.retainAll( that )
    return set
  }

  /**
   * Coerces each element in the collecion to a string and joins them together with the
   * given delimiter
   */
  function join( delimiter : String  ) : String {
    var retVal = new StringBuilder()
    for( elt in this index i ) {
      if( i > 0 ) {
        retVal.append( delimiter )
      }
      retVal.append( elt as String )
    }
    return retVal.toString()
  }

  /**
   * Returns the last element in this collection.  If the collection is 
   * empty, null is returned.
   */
  function last() : T {
    var i = this.Count
    if( i == 0 ) {
      return null
    } else {
      if( this typeis List ) {
        return this[i - 1] as T
      } else {
        var ret : T
        for( elt in this ) {
          ret = elt
        }
        return ret
      }
    }
  }
  
  /**
   * Returns the last element in this collection that matches the given condition. 
   * If the collection is empty, null is returned.
   */
  function lastWhere( cond(elt:T):boolean ) : T {
    var returnVal : T
    var found = false
    for( elt in this ) {
      if( cond( elt ) ) {
        returnVal = elt
        found = true
      }
    }
    return returnVal
  }
  
  /**
   *  Maps the values of the collection to a list of values by calling the
   *  mapper block on each element.
   */
  function map<Q>( mapper(elt : T):Q ) : List<Q> {
    var returnList = new ArrayList<Q>()
    for( elt in this ){
      returnList.add( mapper( elt ) )
    }
    return returnList
  }

  /**
   * Returns the maximum value of the transformed elements.
   */
  function max<R extends Comparable>( transform(elt:T):R ) : R {
    if( this.Empty ) {
      throw new IllegalStateException( "${this} is empty" )
    }
    var returnVal = transform( first() )
    for( elt in this ) {
      var eltVal = transform( elt )
      if( eltVal > returnVal ) {
        returnVal = eltVal
      }
    }
    return returnVal
  }

  /**
   * Returns the maximum value of this collection with respect to the Comparable attribute
   * calculated by the given block.  If more than one element has the maximum value, the first
   * element encountered is returned.
   */
  function maxBy<R extends Comparable>( comparison(elt : T):R ) : T {
    var max : T = null
    var maxVal : R = null
    for( elt in this ) {
      var altVal = elt == null ? null : comparison(elt)
      if( elt != null and (maxVal == null or maxVal < altVal )) {
        max = elt
        maxVal = altVal
      }
    }
    return max
  }

  /**
   * Returns the minimum value of the transformed elements.
   */
  function min<R extends Comparable>( transform(elt:T):R ) : R {
    if( this.Empty ) {
      throw new IllegalStateException( "${this} is empty" )
    }
    var returnVal = transform( first() )
    for( elt in this ) {
      var eltVal = transform( elt )
      if( eltVal < returnVal ) {
        returnVal = eltVal
      }
    }
    return returnVal
  }

  /**
   * Returns the minimum value of this collection with respect to the Comparable attribute
   * calculated by the given block.  If more than one element has the minimum value, the first
   * element encountered is returned.
   */
  function minBy<R extends Comparable>( comparison(elt : T):R ) : T {
    var min : T = null
    var minVal : R = null
    for( elt in this ) {
      var altVal = elt == null ? null : comparison(elt)
      if( elt != null and (minVal == null or minVal > altVal  )) {
        min = elt
        minVal = altVal
      }
    }
    return min
  }

  /**
   * Returns a lazily-computed List that consists of the elements of this Collection, ordered
   * by the value mapped to by the given block.
   */
  function orderBy<R extends Comparable>( value(elt:T):R ) : IOrderedList<T> {
    if( this typeis IOrderedList ) {
      throw new IllegalStateException( "You must only call thenBy() after an orderBy()" )
    }
    var ordered = new OrderedList<T>( this )
    ordered.addOrderBy( value )
    return ordered
  }

  /**
   * Returns a lazily-computed List that consists of the elements of this Collection, descendingly ordered
   * by the value mapped to by the given block.
   */
  function orderByDescending<R extends Comparable>( value(elt:T):R ) : IOrderedList<T> {
    if( this typeis IOrderedList ) {
      throw new IllegalStateException( "You must only call thenBy() after an orderBy()" )
    }
    var ordered = new OrderedList<T>( this )
    ordered.addOrderByDescending( value )
    return ordered
  }

  /**
   * Partitions each element into a Map where the keys are the value produce by the mapper block and the
   * values are the elements of the Collection.  If two elements map to the same key an IllegalStateException
   * is thrown.
   */
  function partitionUniquely<Q>( mapper(elt : T):Q ) : Map<Q, T> {
    var returnMap = new HashMap<Q, T>()
    for( elt in this ) {
      var key = mapper( elt )
      var currentVal = returnMap[key]
      if( currentVal != null ) {
        throw new IllegalStateException ( "${mapper} does not define a unique value across all elements of this Collection : " +
                                          " Element ${elt} and element ${currentVal} both have the value ${key}" )

      }
      returnMap[key] = elt
    }
    return returnMap
  }

  /**
   * Returns all the values of this collection down to a single value
   */
  function reduce<V>( init : V, aggregator(val : V, elt2 : T):V ) : V {
    var retVal = init
    for( elt in this ) {
      retVal = aggregator( retVal, elt )
    }
    return retVal
  }

  /**
   * Retains all elements that match the given condition in this collection
   */
  function retainWhere( cond(elt:T):boolean )  {
    var iter = this.iterator()
    while( iter.hasNext() ) {
      if( not cond( iter.next() ) ){
        iter.remove()
      }
    }
  }

  /**
   * Removes all elements that match the given condition in this collection
   */
  function removeWhere( cond(elt:T):boolean )  {
    var iter = this.iterator()
    while( iter.hasNext() ) {
      if( cond( iter.next() ) ){
        iter.remove()
      }
    }
  }

  /**
   * Returns a new list of the elements in the collection, in their
   * reverse iteration order 
   */  
  function reverse() : List<T> {
    var returnList = this typeis List ? this.copy() as List<T> : this.toList()
    Collections.reverse( returnList )
    return returnList
  }

  /**
   * Returns a single item matching the given condition.  If there is no such element or if multiple
   * elements match the condition, and IllegalStateException is thrown.
   */
  function singleWhere( cond(elt:T):boolean ) : T {
    var found = false
    var returnVal : T
    for( elt in this ) {
      if( cond( elt ) ) {
        if( found ) {
          throw new IllegalStateException( "More than one element matches the given condition" )
        } else {
          returnVal = elt
          found = true
        }
      }
    }

    if( found ) {
      return  returnVal
    } else {
      throw new IllegalStateException( "No elements match the given condition" )
    }
  }

  /**
   * Returns the Set subtraction of that Collection from this Collection
   */
  function subtract( that : Collection<T> ) : Set<T> {
    var returnSet = new LinkedHashSet<T>( this )
    returnSet.removeAll( that )
    return returnSet
  }

  /**
   * Sums up the values of the target of the mapper argument
   */
  function sum<N extends java.lang.Number>( mapper(elt:T):N ) : N {
    var sum  = 0 as java.lang.Number as N
    for( elt in this ) {
      sum += mapper( elt )
    }
    return sum
  }

  /**
   * Returns the set union of the two collections.
   */
  function union( that : Collection<T> ) : Set<T>{
    var returnSet = new LinkedHashSet<T>( this )
    returnSet.addAll( that )
    return returnSet
  }

  /**
   * Returns all the elements of this collection for which the given condition is true
   */
  function where( cond(elt:T): boolean ) : List<T> {
    var result = new ArrayList<T>()
    for( elt in this ) {
      if( cond( elt ) ) {
        result.add( elt )
      }
    }
    return result
  }

  /**
   * Returns all the elements of this collection that are assignable to the 
   * given type
   */
  function whereTypeIs<R>( type : Type<R> ) : List<R>{
    var retList = new ArrayList<R>()
    for( elt in this ) {
      if( type.isAssignableFrom( typeof elt ) ) {
        retList.add( elt as R )
      }
    }
    return retList
  }

}