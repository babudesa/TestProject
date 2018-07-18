package libraries



class UserUtils {
construct() {}

    //static function
    static function hasClaimUserModel(claim:Claim, group:Group, role: typekey.UserRole, user:User) : boolean{
      return claim.ClaimUserModelSet.ClaimUserModels.hasMatch(\ c -> c.Group == group && c.User == user && c.UserRoleAssignments.firstWhere(\ u -> u.Role == role) != null);
    }
   
    static function getClaimUserModel(claim : Claim, group: Group, user:User) : ClaimUserModel {
      var claimUserModel = claim.ClaimUserModelSet.ClaimUserModels.firstWhere((\ c -> c.Group == group && c.User == user));
      if (claimUserModel == null) {
        claimUserModel = new ClaimUserModel(claim.getBundle());
      }
      return claimUserModel;
    }
    
    static function getClaimUserModelIfExist(claim : Claim, group: Group, user:User) : ClaimUserModel {
      return claim.ClaimUserModelSet.ClaimUserModels.firstWhere((\ c -> c.Group == group && c.User == user));
    }
    
    static function addToClaimUserModels(claim:Claim, claimuserModel:ClaimUserModel) {
      claim.ClaimUserModelSet.addToClaimUserModels(claimuserModel);
    }
   
    //7/24/14 tested for FidCrime claim owned by ELD user : 3 arguments
    static function addToUserRoleAssignments(claimUserModel:ClaimUserModel, userRoleAssignment: UserRoleAssignment, role:typekey.UserRole) {     
      userRoleAssignment.Role = role
      claimUserModel.addToUserRoleAssignments(userRoleAssignment);
    }
    //end of this 3 argument function
    static function getClaimUserModels(claim : Claim) : ClaimUserModel[] {
      if (claim != null && claim.ClaimUserModelSet != null) { 
        return claim.ClaimUserModelSet.ClaimUserModels;
      }
      return null;
    }
    
    static function getUserRoleAssignment(newClaimUserModel : ClaimUserModel) : UserRoleAssignment {
      var ura : UserRoleAssignment = null
      
      if(!newClaimUserModel.New and newClaimUserModel.UserRoleAssignments != null and newClaimUserModel.UserRoleAssignments.length<=0){
      //ura = newClaimUserModel.UserRoleAssignments.firstWhere(\ u -> u.Role.Code == (typekey.UserRole.TC_PROFITCENTER as java.lang.String));
      ura = newClaimUserModel.UserRoleAssignments.firstWhere(\ u -> u.Role.Code == (typekey.UserRole.TC_SENSITIVECLAIM as java.lang.String));
      }
      if (ura == null) {
        ura =  new UserRoleAssignment(newClaimUserModel.getBundle());
      }
      return ura;
    }
    
    //Remove user from a claim if they no longer have profit center match on a claim
    static function removeFromUserRoleAssignments(claimUserModel:ClaimUserModel, claim : Claim) {     
      if(claimUserModel.UserRoleAssignments.length > 0) {
        //if(claimUserModel.UserRoleAssignments.hasMatch(\ u -> u.Role.Code == (typekey.UserRole.TC_SENSITIVECLAIM as java.lang.String)) ) {
        if(claimUserModel.UserRoleAssignments.hasMatch(\ u -> u.Role.Code == (typekey.UserRole.TC_TEMPCLAIMEDITOR as java.lang.String)
        or u.Role.Code == (typekey.UserRole.TC_TRANSFERCLAIM as java.lang.String)
        or u.Role.Code == (typekey.UserRole.TC_TEMPCLAIMVIEWER as java.lang.String)) ) {  
        var userRoleAssignment2 = claimUserModel.UserRoleAssignments[0];
        claim.removeFromRoleAssignments(userRoleAssignment2);
        }
      }
    }
       
//    //Function checks to see if secure user needs to be removed or not based on user's security
//    // 10/6/14 ER - after merge I noticed error, really don't think we even use this now
//    //commenting out for now 
//    static function isAccessLevel(claimUserModel:ClaimUserModel, claim: Claim) : boolean {
//    var profit = claim.Policy.ex_Agency.ex_AgencyProfitCenter
//    var policy = claim.Policy.PolicyNumber
//    
//    return (claimUserModel.User.AccessControlsExt.hasMatch(\ a ->profit.equals(a.AccessLevel.StringValue))
//     or claimUserModel.User.AccessControlsExt*.AccessGroup*.AccessLevels*.StringValue.firstWhere(\ s -> s!=null && s.equals(profit)).HasContent
//     or claimUserModel.User.AccessControlsExt.hasMatch(\ a ->policy.equals(a.AccessLevel.StringValue))
//     or claimUserModel.User.AccessControlsExt*.AccessGroup*.AccessLevels*.StringValue.firstWhere(\ s -> s!=null && s.equals(Policy)).HasContent)
//   }
////////////////////////////////////////////////////////////////////////////////////////////////
//this? 
    static function canViewSecureNCW(claim:Claim, agency : ex_Agency) : boolean     {
      var user = gw.plugin.util.CurrentUserUtil.getCurrentUser().User
      if(user.hasPermission("ignoreacl")){
        return true;
      }
      for(x in user.GroupUsers){
        if(x.Group.SecurityZone.CanSeeUnsecureClaimsExt){
          return true
        }else if(x.Group.SecurityZone.IsSecurityZoneTPAExt) {
          for(r in x.Group.SecurityZone.SecurityFilters){
            if (r typeis ProfitCenterSecurityFilterExt) {
              var pcg = r.ProfitCenterGrouping;
              if (pcg == null) continue;
              for (var bu in pcg.BusinessUnitItemExt) {
                if (bu.BusinessUnit == null) continue;
                if (bu.BusinessUnit == claim.NCWOnlyBusinessUnitExt) return true;
              }
              for (var pc in pcg.ProfitCenterItemExt) {
                if (pc.ProfitCenter == null) continue;
                if (pc.ProfitCenter == agency.ex_AgencyProfitCenter) return true;
              }
            } else if (r typeis ClaimsBusinessUnitSecurityFilterExt) {
              if (r.ClaimsBusinessUnit == null) continue;
              if (claim.AssignedGroup != null && r.ClaimsBusinessUnit == claim.getClaimBusinessUnitGroup()) return true;
            }
          }
        }
      }
      return false;
    }
    
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //  This is method for User Updates to set ignoreACLDenormIndExt
  //10/15/14 MB: Method used to update the value of ignoreACLDenormIndExt as needed
    static function verifyIgnoreACL(user : User) {
      var tempIgnoreACL = user.Roles*.Role*.Privileges*.Permission.contains("ignoreacl")
    
      if(user.ignoreACLDenormIndExt != tempIgnoreACL)
        user.ignoreACLDenormIndExt = tempIgnoreACL
    }      
    
  // Defect:8333 - method for getting claimant name on claimsearchresult LVs 
  static function convertClaimantNamesToString(names : String[]) : String {
  var result = ""
  for(name in names){
    result += name + ", "
  }
  result = result.trim()
  if(result.endsWith( "," )){
    result = result.substring( 0, result.lastIndexOf( "," ) )
  }
  return result
 }
 

}  //end class UserUtils
