package gw.ant.wrappers

uses gw.ant.wrappers.FilterSet
uses java.io.File
uses java.util.List
uses org.apache.tools.ant.types.FileSet

class Copy extends Task<org.apache.tools.ant.taskdefs.Copy>
{
  var _somethingToDo = false

  property set File(f : File)
  {
    _task.setFile(f)
    _somethingToDo = true
  }
  property set FileSet(fs : FileSet)
  {
    addFileSet( fs )
  }
  property set FileSets(sets : List<FileSet>)
  {
    addFileSets(sets)
  }
  property set ToDir(f : File) { _task.setTodir(f) }
  property set ToFile(f : File) { _task.setTofile(f) }
  property set IncludeEmptyDirs(b : boolean) { _task.setIncludeEmptyDirs(b) }
  property set Overwrite(b : boolean) { _task.setOverwrite(b) }

  construct()
  {
    super(new org.apache.tools.ant.taskdefs.Copy())
  }

  override function execute()
  {
    if (_somethingToDo)
    {
      _task.setIncludeEmptyDirs(false)
      super.execute()
    }
  }

  private function addFileSet(fs : FileSet)
  {
    _task.addFileset(fs)
    _somethingToDo = true
  }

  function addFileSets(sets : List<FileSet>)
  {
    sets.each(\ fs -> addFileSet(fs))
  }

  function createFilterSet() : FilterSet
  {
    return new FilterSet(_task.createFilterSet())
  }
}
