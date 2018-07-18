package gw.ant.util

uses gw.ant.ScriptEnv
uses java.io.File
uses org.apache.tools.ant.types.FileSet

enhancement AntFileEnhancement : File
{
  function file(child : String) : File {
    return new File(this, child)
  }

  function fileSet() : FileSet {
    var fileSet = new FileSet() { :Dir = this }
    fileSet.Project = ScriptEnv.get().Project
    return fileSet
  }

  function fileSet(includes : String, excludes : String) : FileSet {
    var fs = fileSet()
    if (includes != null) fs.setIncludes( includes )
    if (excludes != null) fs.setExcludes( excludes )
    return fs
  }
}
