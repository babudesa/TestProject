package libraries
uses java.util.HashSet

class RoleUtil {

  construct() {}
    
    static function deleteRolesUpdateDenormvalues(roles : Role[]){
      if(roles*.Privileges*.Permission.contains("ignoreacl")){
        var users = new HashSet<User>()
        for(user in roles*.AllUsersArray){
          users.add(user)
        }
        gw.api.admin.BaseAdminUtil.deleteRoles(roles)
        for(user in users){
          var userPerm = user.Roles*.Role*.Privileges*.Permission.contains("ignoreacl");
          
          if(user.ignoreACLDenormIndExt != userPerm){
            var bundle = gw.transaction.Transaction.getCurrent()
            var temp = bundle.add(user);
            temp.setFieldValue("ignoreACLDenormIndExt", userPerm)
          }
        }
      }else {
        gw.api.admin.BaseAdminUtil.deleteRoles(roles)
      }
}
   
   static function updateACLPrivileges(role : Role){
     //first check to see if the Role has the permission ignoreacl, if so then all Users on that role should have IgnoreACLDenormIndExt set
     if(role.Privileges*.Permission.contains("ignoreacl")){
       for(user in role.AllUsersArray){
         if(user.ignoreACLDenormIndExt == False){
           var bundle = gw.transaction.Transaction.getCurrent()
           var temp = bundle.add(user);
           temp.setFieldValue("ignoreACLDenormIndExt", True)
         }
       }
     } else {
       //if the updated role doesn't have ignoreACL permission then check for users other roles
       // we can't include the current role because previous values could be cached
       for(user in role.AllUsersArray){
         var userPerm = user.Roles*.Role.where(\ r -> r != role)*.Privileges*.Permission.contains("ignoreacl");
         if(user.ignoreACLDenormIndExt != userPerm){
           var bundle = gw.transaction.Transaction.getCurrent()
           var temp = bundle.add(user);
           temp.setFieldValue("ignoreACLDenormIndExt", userPerm)
         }
       }
     }
   }
}
