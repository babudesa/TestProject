package util.custom_Ext;
uses java.util.ArrayList

class addressFunctions
{
  construct(){ 
  }

  public static function getValidCountyForState (st:State):String[] {
    var list = new ArrayList()
    var query = gw.api.contact.AddressAutocompleteUtil.getValueRange(Country.TC_US, "county", {"state"}, {st}, 1).toList()
    if(query.getCount()!= 0){
      for(countymatch in query.iterator()){
        list.add((countymatch))
      }
    }
    return list as java.lang.String[]
  }  
  
}
