package util.gaic.groupuserexport

class GroupUserExportFunctionFactory {

  private construct() {}
  
  static function getGroupFunctions() : GroupUserExportGroupFunctions {
    return GroupUserExportGroupFunctions.getInstance()
  }
  
  static function getUserFunctions() : GroupUserExportUserFunctions {
    return GroupUserExportUserFunctions.getInstance()
  }
  
  static function getGroupUserFunctions() : GroupUserExportGroupUserFunctions {
   return GroupUserExportGroupUserFunctions.getInstance() 
  }
  
  static function getContactFunctions() : GroupUserExportContactFunctions {
   return GroupUserExportContactFunctions.getInstance() 
  }

}
