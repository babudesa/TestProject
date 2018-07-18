package gw.ant.wrappers

uses java.io.File

class P4Revert extends Task<org.apache.tools.ant.taskdefs.optional.perforce.P4Revert>
{
  static function _(f : File, revertUnchanged : boolean)
  {
    new P4Revert() { :View = f, :RevertOnlyUnchanged = revertUnchanged, :FailOnError = true }
    .execute()
  }

  property set View( f : File ) { _task.setView( f as String ) }
  property set RevertOnlyUnchanged( b : boolean ) { _task.setRevertOnlyUnchanged( b ) }
  property set FailOnError( b : boolean ) { _task.setFailonerror( b ) }

  construct()
  {
    super(new org.apache.tools.ant.taskdefs.optional.perforce.P4Revert())
  }
}
