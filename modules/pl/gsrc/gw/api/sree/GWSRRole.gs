package gw.api.sree

class GWSRRole {
  var _name : String as Name
  var _description : String as Description
  
  construct(role:Role) {
    Name = role.Name
    Description = role.Description
  }
  
  construct() {
    
  }
  
}
