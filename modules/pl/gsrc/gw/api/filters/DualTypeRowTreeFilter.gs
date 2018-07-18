package gw.api.filters

class DualTypeRowTreeFilter<P, L> implements com.guidewire.pl.web.iterator.data.DualTypeRowTreeFilter
{
  
  var _containerFilter(p:P) : boolean
  var _contentFilter(l:L) : boolean
  
  construct(containerFilter(p:P) : boolean, contentFilter(l:L) : boolean)
  {
    _containerFilter = containerFilter
    _contentFilter = contentFilter
  }

  override function applyFilter( obj : Object ) : boolean
  {
    if(obj typeis L) {
      return _contentFilter(obj)
    } else {
      return _containerFilter(obj as P)
    }
  }

}
