package gw.ant.wrappers

uses gw.ant.ScriptEnv
uses java.io.File
uses org.apache.tools.ant.types.Path

class Javadoc extends Task<org.apache.tools.ant.taskdefs.Javadoc>
{
  property set Maxmemory(s : String) { _task.setMaxmemory( s ) }
  property set SrcDir(dir : File)
  {
    addSrcDir( dir )
  }
  property set SrcDirs(dirs : List<File>)
  {
    addSrcDirs( dirs )
  }
  property set Packagenames(s : String) { _task.setPackagenames( s ) }
  property set ExcludePackageNames(s : String) { _task.setExcludePackageNames( s ) }
  property set Nodeprecated(b : boolean) { _task.setNodeprecated( b ) }
  property set ShowProtected(b : boolean) { _task.setProtected( b ) }
  property set Version(b : boolean) { _task.setVersion( b ) }
  property set Author(b : boolean) { _task.setAuthor( b ) }
  property set WindowTitle(s : String) { _task.setWindowtitle( s ) }
  property set Verbose(b : boolean) { _task.setVerbose( b ) }
  property set Breakiterator(b : boolean) { _task.setBreakiterator( b ) }
  property set Destdir(d : File) { _task.setDestdir( d ) }
  property set Encoding(s : String) { _task.setEncoding( s ) }
  property set Doctitle(s : String) { _task.setDoctitle( s ) }
  property set Bottom(s : String) { _task.setBottom( s ) }
  property set Cpath(p : Path) { _task.setClasspath(p) }

  construct()
  {
    super(new org.apache.tools.ant.taskdefs.Javadoc())
  }

  function addGroup(title : String, packages : String)
  {
    var group = _task.createGroup()
    group.Title = title
    group.Packages = packages
  }

  private function addSrcDir( dir : File )
  {
    _task.createSourcepath().createPathElement().setLocation(dir)
  }

  function addSrcDirs( dirs : List<File> )
  {
    dirs.each(\ dir -> addSrcDir(dir))
  }

  function addArg(arg : String)
  {
    var commandLineArg = _task.createArg()
    commandLineArg.setValue( arg )
  }

  function addTag(name : String, desc : String, enabled : boolean)
  {
    var tag = _task.createTag()
    tag.setName( name )
    tag.setDescription( desc )
    tag.setEnabled( enabled )
  }

  function setLink(href : String, offline : boolean) {
    var link = _task.createLink()
    link.setHref(href)
    link.setOffline(offline)
  }
}
