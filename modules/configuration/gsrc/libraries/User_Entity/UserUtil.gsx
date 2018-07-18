package libraries.User_Entity
uses java.util.ArrayList

enhancement UserUtil : entity.User {
  public function buildApprovedByList():List {
    var user = find( u in User where u.Department in new String[] {"AgriBusiness","Claims"} )
    var userList = new ArrayList();
    
    user.addAscendingSortColumn( "User.ex_Signature" );
    for(name in user) {
      userList.add(name.DisplayName) 
    }
   
     return userList
  }
}
