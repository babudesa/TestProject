package gw.ant.wrappers

uses java.io.File

class Expand extends Task<org.apache.tools.ant.taskdefs.Expand>
{
  property set Src(f : File) { _task.setSrc(f) }
  property set Dest(f : File) { _task.setDest(f) }
  property set PatternSet(ps : PatternSet) { addPatternSet(ps) }
  property set Encoding(s : String) { _task.setEncoding(s) }

  construct(initSrc : File, initDest : File)
  {
    super(new org.apache.tools.ant.taskdefs.Expand())
    Src = initSrc
    Dest = initDest
    Encoding = "UTF8"
  }

  function addPatternSet(ps : PatternSet)
  {
    _task.addPatternset(ps._delegate)
  }
}
