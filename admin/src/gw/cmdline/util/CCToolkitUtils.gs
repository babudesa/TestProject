package gw.cmdline.util

uses java.io.File
uses java.util.LinkedHashSet
uses java.util.Arrays

class CCToolkitUtils {

  /**
   * Strip the blank entries from the list of strings passed in
   */
  static function stripBlanks( strings : String[] ) : String[] {
    if(strings.length > 0) {
      var returnSet = new LinkedHashSet<String>()
      var list =  Arrays.asList(strings)
      for(entry in list) {
        if(entry != "" and entry != null) {
          returnSet.add(entry)
        }
      }
      return returnSet.toTypedArray()
    }
    return strings
  }


}