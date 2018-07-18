package libraries.ClaimContact_Entity

enhancement PolicyRefreshFunctions : entity.ClaimContact {
  /*
    Loops through the roles on the ClaimContact to find one of the former roles.
    Sprint/Maintenance Release: EM 12 - Defect 465
    Author: Zach Thomas
    Date: 01/09/2009
    Updated: 04/06/20009 - Use new isFormerRole function.
  */
  function hasFormerRole():Boolean{
    var hasFormerRole : Boolean = false;
    for(role in this.Roles){
      if(role.isFormerRole()){
        hasFormerRole = true;
        break;
      }
    }
    return hasFormerRole;
  }
  /*
    Loops through the roles on the ClaimContact to any roles that would prevent the contact from being merged.
    Sprint/Maintenance Release: EM 12 - Defect 465
    Author: Zach Thomas
    Date: 01/09/2009
    Updated: 01/25/2010 - Point to isRestrictedRole() to get restricted roles.
  */
  function hasRestrictedRole():Boolean{
    var hasRestrictedRole : Boolean = false;
    for(role in this.Roles){
      if(role.isRestrictedRole()){
        hasRestrictedRole = true;
        break;
      }
    }
    return hasRestrictedRole;
  }
}
