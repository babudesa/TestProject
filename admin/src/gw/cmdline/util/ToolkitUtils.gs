package gw.cmdline.util

uses java.io.File
uses java.util.LinkedHashSet

class ToolkitUtils {

  /**
   * Reads a simple CSV file (no commas allowed in content) into a string array.
   */
  static function readSimpleCSV( fileName : String ) :String[] {
    var f = new File( fileName )
    if( not f.exists() ) throw "The file #{fileName} does not exist"
    var returnSet = new LinkedHashSet<String>()
    f.eachLine( \ l -> {
      var valsOnLine = l.split(",").map( \ s -> s.trim() )
      for( claimNum in valsOnLine ) {
        if( not returnSet.contains( claimNum ) ) returnSet.add( claimNum )
      }
    })
    return returnSet.toTypedArray()
  }


}