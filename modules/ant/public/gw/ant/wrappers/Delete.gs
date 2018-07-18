package gw.ant.wrappers

uses java.io.File

class Delete extends Task<org.apache.tools.ant.taskdefs.Delete>
{
  static function dir(f : File)
  {
    new Delete() { :Dir = f, :IncludeEmptyDirs = true }
    .execute()
  }
  static function file(f : File)
  {
    new Delete() { :File = f }
    .execute()
  }

  property set Dir(f : File) { _task.setDir(f) }
  property set File(f : File) { _task.setFile(f) }
  property set IncludeEmptyDirs(b : boolean) { _task.setIncludeEmptyDirs( b ) }

  construct()
  {
    super(new org.apache.tools.ant.taskdefs.Delete())
  }
}
