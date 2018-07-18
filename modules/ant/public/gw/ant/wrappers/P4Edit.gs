package gw.ant.wrappers

uses java.io.File

class P4Edit extends Task<org.apache.tools.ant.taskdefs.optional.perforce.P4Edit>
{
  static function _(f : File)
  {
    new P4Edit() { :View = f, :FailOnError = true }
    .execute()
  }

  property set View( f : File ) { _task.setView( f as String ) }
  property set FailOnError( b : boolean ) { _task.setFailonerror( b ) }

  construct()
  {
    super(new org.apache.tools.ant.taskdefs.optional.perforce.P4Edit())
  }
}
