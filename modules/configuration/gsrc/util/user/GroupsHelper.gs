package util.user
uses java.util.HashSet

/**
* Provides utility for groups
*/
class GroupsHelper {

  construct() {}
  
  private static var GAIC_CLAIMS_GROUPNAME = "GAIC Claims"
  public static var TERMINATED_EMPLOYEES_GROUPNAME : String = "Terminated Employees"
 

  /**
  * Gets a set of all current group supervisors from all groups.   *
  */
  public static property get GroupSupervisorSet() : HashSet <User> {

    var groupSupervisors = new HashSet <User> ()
      groupSupervisors.addAll(AllGroupsSet*.Supervisor.toSet())

      return groupSupervisors
  }
  
  public static function getAllChildGroups(parentGroup : Group) : List<Group> {
      return parentGroup.ChildGroups.toList()
  }
  
  public static property get GaicClaimsChildGroups() : List<Group> {
    var gaicGroup = getGroupByName(GAIC_CLAIMS_GROUPNAME)
    return getAllChildGroups(gaicGroup)
  }
  
  public static property get ClaimsManagers() : List<User>  {
     return GaicClaimsChildGroups*.Supervisor.toList()
  }
  
  public static function isClaimManager(user : User) : boolean {
    return ClaimsManagers.contains(user)
  }

  /**
  * Gets all existing groups
  */
  public static property get AllGroupsSet() : HashSet <Group> {

    var groups = new HashSet <Group> ()
      groups.addAll(find(group in Group).toSet())

      return groups
  }
  
  /**
  * Checks to see if the given user's direct supervisor
  */
  @ Param("user", "the user you want to get the direct supervisor of")
  @ Returns("User's direct supervisor")
  public static function getDirectSupervisor(user : User) : User {
    var supervisor : User
    if(isAGroupSupervisor(user)){
      supervisor = getUsersGroup(user).Parent.Supervisor
    }else {      
      supervisor = getUsersGroup(user).Supervisor
    }      
    return supervisor
  }
  
  public static function getGroupByName(groupName : String) : Group {
    return find(group in Group where group.Name == groupName).AtMostOneRow
  }


  /**
  * Gets given user's group
  */
  @ Param("user", "the user to get group of")
  @ Returns("user's group")
  public static function getUsersGroup(user : User) : Group {
    var userGroup : Group
    if(user.AllGroups != null) {
      userGroup = user.AllGroups.cast(Group).first()
    }else {
      userGroup = null 
    }
    return userGroup
  }
    

  /**
  * Checks to see if the given user is a group supervisor
  */
  @ Param("user", "the user to check if it is a supervisor")
  @ Returns("is the user a group supervisor")
  public static function isAGroupSupervisor(user : User) : boolean {
    return GroupSupervisorSet.contains(user)
  }
  
  /**
  * 
  */
  public static function getClaimManager(user : User) : User {
    
    if(user == null || user == util.user.SCOHelper.CorpClaimsOneUser) {
      return null
    } else if (util.user.GroupsHelper.isClaimManager(user)) {
      return user
    } else {
      return getClaimManager(getDirectSupervisor(user))
    }
  }
  
  public static function getWCClaimManager(user : User) : User {
    if(user == null || user == util.user.SCOHelper.CorpClaimsOneUser) {
      return null
    } else if (util.user.GroupsHelper.isClaimManager(user)) {
      return user
    } else {
      return getDirectSupervisor(user)
    }
  }
  
  public static function getParentGroup(group : Group) : Group {
    return group.Parent
  }
  
  public static function getTopMostParentGroup(user : User) : Group {
    var indx = 0;
    var limit = 5;
    var currentGroup = user.AllGroupUsersAsArray.first().Group;
    while (!currentGroup.Parent.Name.equalsIgnoreCase(GAIC_CLAIMS_GROUPNAME) && indx < limit) {
      currentGroup = currentGroup.Parent;
      indx++;
    }
    return currentGroup;
  }
  
  public static function getTopMostParentGroup(claim : Claim) : Group {
    var indx = 0;
    var limit = 5;
    var currentGroup = claim.AssignedUser.AllGroupUsersAsArray.first().Group;
    while (currentGroup.Parent.Name != null && !currentGroup.Parent.Name.equalsIgnoreCase(GAIC_CLAIMS_GROUPNAME) && indx < limit) {
      currentGroup = currentGroup.Parent;
      indx++;
    }
    return currentGroup;
  }

  /**
  * 
  */
  public static function areUsersInSameGroup(userOne : User, userTwo : User) : boolean {
    
    var userOnesGroup : Group = util.user.GroupsHelper.getUsersGroup(userOne)
    var userTwosGroup : Group = util.user.GroupsHelper.getUsersGroup(userTwo)
    var areGroupsEqual : boolean = false
    
    if(userOnesGroup == userTwosGroup) {
      areGroupsEqual = true
    }else {
      areGroupsEqual = false
    }    
    return areGroupsEqual    
  }
  
//  
//  public static function isAssignedUserInTerminatedGroup(exposure : Exposure) {
//    if(exposure.AssignedUser.
//  }
  

}//End Class GroupsHelper