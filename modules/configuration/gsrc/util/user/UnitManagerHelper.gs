package util.user
uses java.util.HashSet

/**
* Provides utility for accessing Unit Managers
*/
class UnitManagerHelper {

  construct() {}

  final static private var UNIT_MANAGER_PARAM = "unitmanager"

    /**
    * Gets a set of all Unit Managers configured in the ScriptParameters v2.0
    */
    public static property get UnitManagerSet() : HashSet <User> {

    var unitManagers = new HashSet <User> ()

      for (type in LossType.getTypeKeys(false)) {
        unitManagers.add(util.GlobalParameters.ParameterFinder.getUserParameter(UNIT_MANAGER_PARAM, type))
      }

      return unitManagers
  }

  /**
  * Checks to see if the given user is a Unit Manager
  */
  @Param("user", "the user to check")
  @Returns("is the user a Unit Manager")
  public static function isUnitManager(user : User) : boolean {

    return UnitManagerSet.contains(user)

  }

  /**
  * Gets the Unit Manager given a Group.  Will recursively
  * walk up the group structure until reaching a Unit Mangager
  * of a Parent Group.
  */
  @Param("group", "the group to get the Unit Manager from")
  @Returns("the group's Unit Manager")
  public static function getUnitManager(group : Group) : User {

    if (isUnitManager(group.Supervisor)) {
      return group.Supervisor
    } else {
      return getUnitManager(group.Parent)
    }
  }

  /**
   * Checks to see if the user belongs to a group with a Unit Manager
   *
   * @param user the user to check
   * @return does the user belong to a group with a Unit Manager
   */
  public static function userGroupHasUnitManager(user : User) : boolean {

    var userBaseGroup = util.user.GroupsHelper.getUsersGroup(user)
      var hasUnitManager : boolean = false

      if (getUnitManager(userBaseGroup) != null) {
        hasUnitManager = true
      } else {
        hasUnitManager = false
      }

      return hasUnitManager
  }

  /**
   * Checks to see if the given group has a Unit Manager as a the Group Supervisor
   *
   * @param group the group to check
   * @return is the groups supervisor also a Unit Manager
   */
  public static function groupsSupervisorIsUnitManager(group : Group) : boolean {

    var isUnitManager : boolean = false

      if (isUnitManager(group.Supervisor)) {
        isUnitManager = true
      } else {
        isUnitManager = false
      }
      return isUnitManager
  }

} //End Class UnitManagerHelper