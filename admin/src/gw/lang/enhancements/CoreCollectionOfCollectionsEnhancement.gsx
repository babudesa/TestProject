package gw.lang.enhancements
uses java.util.Collection
uses java.util.ArrayList

enhancement CoreCollectionOfCollectionsEnhancement<E, T extends Collection<E>> : Collection<T> {

  function flatten() : List<E>
  {
    var flatList = new ArrayList<E>()
    for( col in this )
    {
      for( c in col as List<E> ) //TODO cgross - this cast shouldn't be necessary
      {
        flatList.add( c )
      }
    }
    return flatList
  }  
}