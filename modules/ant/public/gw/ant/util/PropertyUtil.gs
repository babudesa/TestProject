package gw.ant.util

uses gw.ant.wrappers.Mkdir
uses java.io.File
uses java.util.Map

class PropertyUtil
{
  static function syncProperties(props : Map<String, String>, comment : String, file : File) {
    var savedProps : Map<String, String>
    if (file.exists()) {
      savedProps = Map.readFromPropertiesFile(file)
    }
    else {
      Mkdir.dir(file.ParentFile)
    }
    if (props != savedProps) {
      print("Writing ${comment} to ${file}")
      props.writeToPropertiesFile(file, comment)
    }
  }
}
