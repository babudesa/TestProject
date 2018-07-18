package gw.util

@ReadOnly
class RangeInputUtil {

  construct() {

  }
  
  static function formatLabel(newEntry: Object, selectedEntry: Object) : String {
    if (selectedEntry == newEntry) {
      return displaykey.Java.NameValueView.New
    }
    return selectedEntry as String
  }


}
