package libraries.Matter_Entity
uses java.util.HashMap

class AttorneyTypeMapper {
  
  var _map : HashMap<LineCategory, ContactRole> as AttorneyTypeRoleMap  

  var _attorneyTypes : List<LineCategory> as AttorneyTypes
  
  construct() {
   _attorneyTypes = LineCategory.TF_MATTERATTORNEYTYPES.TypeKeys
  
   _map = new HashMap<LineCategory, ContactRole>()

   initMap()
  }
  
  private function initMap(){
    for(type in _attorneyTypes){
      _map.put(type, type.Categories.where(\ cat -> cat typeis ContactRole).first() as ContactRole) 
    }

  }
}



