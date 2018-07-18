package gw.ant.wrappers

class FilterSet
{
  protected var _delegate : org.apache.tools.ant.types.FilterSet

  construct(fs : org.apache.tools.ant.types.FilterSet) {
    _delegate = fs
  }

  function addFilter(token : String, value : String) {
    var filter = new org.apache.tools.ant.types.FilterSet.Filter() { :Token = token, :Value = value }
    _delegate.addFilter(filter)
  }
}
