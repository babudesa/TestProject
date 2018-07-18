package gw.ant.wrappers

class PatternSet
{
  protected var _delegate : org.apache.tools.ant.types.PatternSet

  property set Includes(s : String) { _delegate.setIncludes(s) }
  property set Excludes(s : String) { _delegate.setExcludes(s) }

  construct()
  {
    _delegate = new org.apache.tools.ant.types.PatternSet()
  }
}
