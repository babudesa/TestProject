package gw.ant.wrappers

uses java.io.File
uses org.apache.tools.ant.types.Path
uses org.apache.tools.ant.types.PropertySet

class Java extends Task<org.apache.tools.ant.taskdefs.Java>
{
  property set ClassName( s : String ) { _task.setClassname( s ) }
  property set Cpath(p : Path) { _task.setClasspath(p) }
  property set Dir( f : File ) { _task.setDir( f ) }
  property set FailOnError( b : boolean ) { _task.setFailonerror( b ) }
  property set Fork( b : boolean ) { _task.setFork( b ) }
  property set Spawn( b : boolean ) { _task.setSpawn( b ) }

  construct()
  {
    super(new org.apache.tools.ant.taskdefs.Java())
  }

  function addJvmArg( arg : String )
  {
    _task.createJvmarg().setLine( arg )
  }

  function addJvmArgs( args : List<String> )
  {
    args.each(\ arg -> addJvmArg( arg ) )
  }

  function addArg( arg : String )
  {
    _task.createArg().setLine( arg )
  }

  function addArgs( args : List<String> )
  {
    args.each(\ arg -> addArg( arg ) )
  }

  function addSyspropertyset (propSet : PropertySet) {
    propSet.setProject(_task.getProject())
    _task.addSyspropertyset(propSet)
  }

}
