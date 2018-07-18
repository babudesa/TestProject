package gw.ant.wrappers

uses java.io.File

class Mkdir extends Task<org.apache.tools.ant.taskdefs.Mkdir>
{
  static function dir(f : File)
  {
    new Mkdir() { :Dir = f }
    .execute()
  }

  property set Dir(f : File) { _task.setDir(f) }

  construct()
  {
    super(new org.apache.tools.ant.taskdefs.Mkdir())
  }
}
