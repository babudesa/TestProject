package gw.api.web
uses gw.lang.reflect.TypeSystem
uses gw.lang.reflect.gs.IGosuClass
uses java.util.ArrayList

class LoadedGosuClassesHelper {

  construct() {

  }
  
  static function getAllRelevantLoadedClasses() : List<String> {
    var typeLoader = TypeSystem.getTypeLoader(gw.lang.reflect.gs.GosuClassTypeLoader)
    var results = new ArrayList<String>()
    for (name in typeLoader.AllTypeNames) {
      if (isRelevantClassName(name.toString())) {
        var type = TypeSystem.getByFullName(name.toString()) as IGosuClass
        if (type.DefinitionsCompiled) {
          results.add(name.toString())
        }
      }
    }
    
    return results.sort()
  }
  
  private static function isRelevantClassName(className : String) : boolean {    
    if (className.contains(".block_")) {
      return false  
    }
    
    if (className.contains("AnonymouS__")) {
      return false  
    }
    
    return true
  }

}
