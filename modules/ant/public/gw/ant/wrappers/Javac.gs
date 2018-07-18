package gw.ant.wrappers

uses java.io.File
uses org.apache.tools.ant.types.Path
uses java.util.List

class Javac extends Task<org.apache.tools.ant.taskdefs.Javac>
{
  var _somethingToDo = false

  property set SrcDir(dir : File)
  {
    addSrcDir( dir )
  }
  property set SrcDirs(dirs : List<File>)
  {
    addSrcDirs( dirs )
  }
  property set DestDir(f : File) { _task.setDestdir(f) }
  property set Cpath(p : Path) { _task.setClasspath(p) }
  property set Source(src : String) { _task.setSource(src) }
  property set Target(trg : String) { _task.setTarget(trg) }
  property set Nowarn(b : boolean) {  _task.setNowarn(b) }
  property set Debug(b : boolean) { _task.setDebug(b) }
  property set Encoding(s : String) { _task.setEncoding(s) }
  property set Fork(b : boolean) { _task.setFork(b) }
  property set MemoryInitialSize(i : int) { _task.setMemoryInitialSize(i + "m") }
  property set MemoryMaximumSize(i : int) { _task.setMemoryMaximumSize(i + "m") }

  construct()
  {
    super(new org.apache.tools.ant.taskdefs.Javac())
    Encoding = "UTF-8"  // set default encoding to UTF-8
  }

  private function addSrcDir( dir : File )
  {
    _task.createSrc().createPathElement().setLocation(dir)
    _somethingToDo = true
  }

  function addSrcDirs( dirs : List<File> )
  {
    dirs.each(\ dir -> addSrcDir(dir))
  }

  override function execute()
  {
    if (_somethingToDo)
    {
      Mkdir.dir(_task.Destdir)
      super.execute()
    }
  }
}
