package libraries.Claim_Entity
uses java.util.ArrayList;

enhancement RoleOwnerFunctions : entity.Claim {
  // def 545 by KSO on 01/09/2008
  // eliminate Incident owners that display as spaces for Equine
  //01/31/2008 - zthomas - Defect 816, Added if statements to ensure policy number isn't displayed as an optional owner if policy is verified.
  //08/31/2011 - sprzygocki - Defect 4489 - Incident was once again showing blank in the drop down. Removed again.
  function getRoleOwnersExt(): List{
    var ownerList : List = new ArrayList();
    for(owner in this.RoleOwners) {
      if (owner != null){
        if(this.Policy.Verified){
          if(owner != this.Policy.PolicyNumber and !(owner typeis Incident)){
            ownerList.add(owner);
          }
        } else {
          ownerList.add(owner);
        }
      }
    }
    return ownerList;
  }
}
