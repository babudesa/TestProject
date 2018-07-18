package util

@ReadOnly
class RangeInputUtil
{
  static function formatLabel(newEntry: Object, selectedEntry: Object) : String {
    if (selectedEntry == newEntry) {
      return displaykey.Java.NameValueView.New
    }
    return selectedEntry as String
  }
}
