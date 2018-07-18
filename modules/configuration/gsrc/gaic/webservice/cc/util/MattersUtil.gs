package gaic.webservice.cc.util

class MattersUtil {

  construct() { }
  
  public static function invalidMatterID(matterID : String) : Boolean {
    if (matterID == null || matterID == "") return true;
    return false;
  }
}
