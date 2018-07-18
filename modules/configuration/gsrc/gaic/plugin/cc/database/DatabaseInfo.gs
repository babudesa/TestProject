package gaic.plugin.cc.database
uses java.lang.String

class DatabaseInfo {

  construct() {

  }
  
  static function getDatabaseName() : String {
    var paremetersets = gw.api.tools.DatabaseParametersHelper.getParameters()
    var dbname = ""
    for(ps in paremetersets){
      if(ps.Name == "Guidewire Database Config"){
        var list : String[][] = ps.AttributeValuesAsStrings
        var dbnamefound = false
        for (value in list) {
          var val = value.last()
          if (val.startsWith("jdbc:sqlserver")) {
            var dbnamestr = ";databasename="
            dbname = val.substring(val.indexOf(dbnamestr) + dbnamestr.length,val.indexOf(";user="))
            dbnamefound = true
            break
          }
        }
        if (dbnamefound) break
      }
    }
    return dbname
  }

}
