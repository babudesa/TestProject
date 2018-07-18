package gw.ant.wrappers

uses java.io.File
uses org.apache.tools.ant.taskdefs.Zip.WhenEmpty
uses org.apache.tools.ant.types.EnumeratedAttribute

class Zip extends Task<org.apache.tools.ant.taskdefs.Zip>
{
  public static final var WHEN_EMPTY_CREATE : WhenEmpty = EnumeratedAttribute.getInstance(WhenEmpty, "create") as WhenEmpty
  public static final var WHEN_EMPTY_FAIL : WhenEmpty = EnumeratedAttribute.getInstance(WhenEmpty, "fail") as WhenEmpty
  public static final var WHEN_EMPTY_SKIP : WhenEmpty = EnumeratedAttribute.getInstance(WhenEmpty, "skip") as WhenEmpty

  property set DestFile(f : File) { _task.setDestFile(f) }
  property set BaseDir(f : File) { _task.setBasedir(f) }
  property set Update(b : boolean) { _task.setUpdate(b) }
  property set WhenEmpty(we : WhenEmpty) { _task.setWhenempty( we ) }
  property set Encoding(s : String) { _task.setEncoding( s ) }

  construct(initDestFile : File, initBaseDir : File)
  {
    super(new org.apache.tools.ant.taskdefs.Zip())
    DestFile = initDestFile
    BaseDir = initBaseDir
    Update = false
    Encoding = "UTF8"
  }

  override function execute()
  {
    Mkdir.dir(_task.DestFile.ParentFile)
    super.execute()
  }
}
