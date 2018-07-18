package gw.util

uses gw.entity.TypeKey
uses gw.entity.ITypeList

uses gw.api.util.TypecodeMapper

/**
 * Utility for using the the TypecodeMapper to map external codes to Guidewire's type codes.
 */
class TypeKeyMap<T extends TypeKey> 
{
  var typecodeMapper: TypecodeMapper
  var namespace:String
  var dk:String
  var typelist:ITypeList<T>
  
  /**
   * Constructs a new TypeKeyMap with the target TypeList, the namespace
   * of the mapping, and the Typecode mapper
   */
  construct(tl:ITypeList<T>, ns:String, tcm: TypecodeMapper) {
    typelist = tl
    namespace = ns
    typecodeMapper = tcm
  }
  
  /**
   * If a TypeKey is not present for a given code, the value
   * corresponding to DefaultKey will be the "Catch-All" TypeKey returned.
   */
  property get DefaultKey() : String {
    return dk
  }
  
  property set DefaultKey(defkey:String) {
    dk = defkey
  }
  
  //retrieves a TypeKey corresponding to the external code, or null
  private function getTypeKey(code:String) : T {
    var tkName = typecodeMapper.getInternalCodeByAlias(typelist.RelativeName, namespace, code)
    if(tkName==null)
      return null
    else {
      return typelist.getTypeKey(tkName)
    }
  }
  
  //return the mapping for a given key
  function get(code:String):T {
    if(code==null) return null
    var val:T = getTypeKey(code)
    if(val==null and dk!=null)
      val = getTypeKey(dk)
    return val
  }
}
