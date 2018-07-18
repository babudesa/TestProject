package gw.lang.enhancements

uses java.lang.Comparable
uses gw.util.IOrderedList
uses gw.lang.enhancements.OrderedList
uses java.lang.IllegalStateException

enhancement CoreIOrderedListEnhancement<T> : IOrderedList<T> {

  /**
   * Returns a new lazily constructed list secondarily ordered by the given
   * block
   */
  function thenBy<R extends Comparable>( by(elt:T):R ) : IOrderedList<T> {
    if( this typeis OrderedList ) {
      return this.addThenBy( by ) as IOrderedList<T>
    } else {
      throw new IllegalStateException( "Cannot call thenBy() on anything except an OrderedList" )
    }
  }
  
  /**
   * Returns a new lazily constructed list secondarily descendingly ordered by the given
   * block
   */
  function thenByDescending<R extends Comparable>( by(elt:T):R ) : IOrderedList<T> {
    if( this typeis OrderedList ) {
      return this.addThenByDescending( by ) as IOrderedList<T>
    } else {
      throw new IllegalStateException( "Cannot call thenBy() on anything except an OrderedList" )
    }
  }
  
}