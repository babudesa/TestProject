package gw.ant.wrappers

uses java.io.File
uses org.apache.tools.ant.taskdefs.Manifest
uses org.apache.tools.ant.taskdefs.Zip.WhenEmpty

class Jar extends Task<org.apache.tools.ant.taskdefs.Jar>
{
  property set DestFile(f : File) { _task.setDestFile(f) }
  property set BaseDir(f : File) { _task.setBasedir(f) }
  property set WhenManifestOnly(we : WhenEmpty) { _task.setWhenmanifestonly(we) }
  property set Update(b : boolean) { _task.setUpdate(b) }
  property set Encoding(s : String) { _task.setEncoding( s ) }

  construct(initDestFile : File, initBaseDir : File)
  {
    super(new org.apache.tools.ant.taskdefs.Jar())
    DestFile = initDestFile
    BaseDir = initBaseDir
    Update = false
    Encoding = "UTF8"
  }

  function addConfiguredManifest(manifest : Manifest) {
    _task.addConfiguredManifest(manifest)
  }

  override function execute()
  {
    Mkdir.dir(_task.DestFile.ParentFile)
    super.execute()
  }
}
