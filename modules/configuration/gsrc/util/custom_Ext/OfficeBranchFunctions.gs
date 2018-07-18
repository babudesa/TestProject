package util.custom_Ext;

class OfficeBranchFunctions
{
  construct()
  {
  }
  
  static function getClaimOfficeBranch(obj : Object) : String {
    var defaultValue = "Corporate Claims";
    var group : Group;
    
    if(obj typeis Claim){
      group = obj.AssignedGroup;
    }else if(obj typeis Exposure){
      group = obj.AssignedGroup;
    }else if(obj typeis Activity){
      group = obj.AssignedGroup;
    }else{
      group = null;
    }    
    
    if (group == null)
      return defaultValue
    
    do {
      var type = group.GroupType
      /** Return the group name if the GroupType is of branch office or business unit */
      if (type == "branchoffice" || type == "busunit" || type == "nonclaimsbusunit") {
        return group.Name
      }
      group = group.Parent
    }
    while(group != null)
    /** If we didn't have a group which was a branchoffice or business unit return "SCO" */
    return defaultValue
  }
  
  static function getClaimBusinessUnitPublicId(obj :Object):String{
    var defaultPublicId = "cc:fakeCorpClaim";
    var group : Group;
    if(obj typeis Claim){
      group = obj.AssignedGroup;
    }else if(obj typeis Exposure){
      group = obj.AssignedGroup;
    }else if(obj typeis Activity){
      group = obj.AssignedGroup;
    }else{
      group = null;
    }    
    if (group == null)
      return defaultPublicId
    do {
      var type = group.GroupType
      if (type == "branchoffice" || type == "busunit" || type == "nonclaimsbusunit") {
        return group.PublicID
      }
      group = group.Parent
    }
    while(group != null)
    return defaultPublicId
  }
}
