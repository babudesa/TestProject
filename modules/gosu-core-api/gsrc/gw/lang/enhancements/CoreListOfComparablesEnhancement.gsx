package gw.lang.enhancements
uses java.lang.Comparable
uses java.util.Collections

enhancement CoreListOfComparablesEnhancement<T extends Comparable> : List<T>
{
  function sort() : List<T> {
    Collections.sort( this )
    return this
  }
  
  function sortDescending() : List<T> {
    Collections.sort( this, Collections.reverseOrder<T>() )
    return this
  }
}
