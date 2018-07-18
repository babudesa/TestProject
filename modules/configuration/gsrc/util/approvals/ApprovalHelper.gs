package util.approvals
uses java.util.ArrayList


/**
* Class contains functions to assist with various conditions in the 
* transaction set approval hierarchy and the bulk invoice approval hierarchy
*/
class ApprovalHelper {

  construct() {}

  /**
  * Gets the approval activity history from the given transaction set
  */
  @Param("transSet","the transaction set you want the approval history from")
  @Returns("the list of approval activites for the transaction set")
  public static function getApprovalHistory(transSet : TransactionSet) : List <Activity> {
    return transSet.ApprovalHistory as List <Activity>
  }

  /**
  * Gets the approval activity history from the given bulk invoice
  */
  @Param("bulkInvoice","the bulk invoice you want the approval history from")
  @Returns("the list of approval activites for the given bulk invoice")
  public static function getApprovalHistory(bulkInvoice : BulkInvoice) : List <Activity> {
    return bulkInvoice.ApprovalHistory as List <Activity>
  }

  /**
  * Gets the most recent Assigned By user in the approval activity history given
  */
  @Param("history","the history you want the most recent approval activiy Assigned By user from")
  @Returns("the most recent Assigned By User in the history")
  public static function getLastAssignedByUserInHistory(history : List <Activity> ) : User {
    var user : User
    if (history.HasElements) {
      user = getCurrentApprovalFromHistory(history).AssignedByUser
    } else {
      user = null
    }
    return user
  }
  
  /**
  * Gets the most recent approval activity from the given approval activity history list
  */
  @Param("history","the history you want the most recent approval activiy from")
  @Returns("the most recent approval activity")
  public static function getLastAssignedToUserInHistory(history : List <Activity> ) : User {
    var user : User
    if (history.HasElements) {
      user = getCurrentApprovalFromHistory(history).AssignedUser
    } else {
      user = null
    }
    return user
  }
  
  /**
  * Gets the most recent approval activity from the given approval activity history list
  */
  @Param("history","the history you want the most current approval activiy from")
  @Returns("the most recent approval activity")
  public static function getCurrentApprovalFromHistory(history : List <Activity> ) : Activity {
    var act : Activity
    if (history.HasElements) {
      act = history.get(history.length - 1)
    } else {
      act = null
    }
    return act
  }

  /**
  * Checks to see if the given user is in the given path list of users 
  */
  @Param("user","the user you want to see is in the given path")
  @Param("transSet","the list/path of users to check in.")
  @Returns("is the given user in the given list of users")
  public static function userInApprovalPath(user : User, approvalPath : List <User> ) : boolean {
    var isInPath : boolean = false
    isInPath = exists(u in approvalPath where u == user)
    return isInPath
  }

  /**
  * Gets the transaction set hierarchy path for a given user and transaction.
  */
  @Param("user","the users bulk invoice approval hierarchy path you want to retrieve")
  @Param("transSet","the associated transaction set")
  @Returns("a list of all users in the given user's bulk invoice approval hierarchy path")
  public static function getApprovalPath(user : User, transSet : TransactionSet) : List <User > {
    var usersInPath = new ArrayList <User> ()
    var scoAssist = transSet.getSCOAssistUser()
    var sco = util.user.SCOHelper.getSCOUser(transSet.Claim.LossType)
    var cc1User = util.user.SCOHelper.CorpClaimsOneUser
    var cc2User = util.user.SCOHelper.CorpClaimsTwoUser
    var nextUser = user 
    
    while (!util.user.GroupsHelper.isClaimManager(nextUser) && nextUser != cc1User) {
      usersInPath.add(nextUser)
      nextUser = util.user.GroupsHelper.getDirectSupervisor(nextUser)
    }
    if (util.user.GroupsHelper.isClaimManager(nextUser)) {
      usersInPath.add(nextUser)
    }
    if (scoAssist != null && user != scoAssist) {
      usersInPath.add(scoAssist)
    }
    if (user != sco) {
      usersInPath.add(sco)
    }
    if (user != cc2User) {
      usersInPath.add(cc2User)
    }
    if (user != cc1User) {
      usersInPath.add(cc1User)
    }

    return usersInPath
  }

  /**
  * Gets the bulk invoice hierarchy path for a given user.
  */
  @Param("user","the users bulk invoice approval hierarchy path you want to retrieve")
  @Returns("a list of all users in the given user's bulk invoice approval hierarchy path")
  public static function getBulkInoviceApprovalPath(user : User) : List <User> {
    var usersInPath = new ArrayList <User>()
    var manualBinApprovalUser = util.user.SCOHelper.ManualBulkInvoiceApproverUser
    var cc1User = util.user.SCOHelper.CorpClaimsOneUser
    var cc2User = util.user.SCOHelper.CorpClaimsTwoUser
    var nextUser = user 

    while (!util.user.GroupsHelper.isClaimManager(nextUser) && nextUser != cc1User) {
      usersInPath.add(nextUser)
      nextUser = util.user.GroupsHelper.getDirectSupervisor(nextUser)
    }
    if (util.user.GroupsHelper.isClaimManager(nextUser)) {
      usersInPath.add(nextUser)
    }
    if (user != manualBinApprovalUser) {
      usersInPath.add(manualBinApprovalUser)
    }
    if (user != cc2User) {
      usersInPath.add(cc2User)
    }
    if (user != cc1User) {
      usersInPath.add(cc1User)
    }
    
    return usersInPath
  }

  /**
  * Gets the last approving user who is at the adjuster level in the transaction set approval history
  */
  @Param("transSet","the transaction set you want to get the last approving first user from")
  @Returns("the last adjuster level user to approve this tranaction")
  public static function getLastApprovingFirstLevelUser(transSet : TransactionSet) : User {
    var activity : Activity = null
    var firstLevelUser : User = null
    var history = getApprovalHistory(transSet)
    var reverseHistory = history.reverse()
    var historyIterator = reverseHistory.iterator()
    
    while (historyIterator.hasNext() && firstLevelUser == null) {

      activity = historyIterator.next()

        if (!util.user.GroupsHelper.isAGroupSupervisor(activity.AssignedByUser) &&
          activity.AssignedByUser != util.user.SCOHelper.CorpClaimsOneUser &&
          activity.AssignedByUser != util.user.SCOHelper.CorpClaimsTwoUser &&
          activity.AssignedByUser != transSet.getSCOAssistUser() &&
          activity.AssignedByUser != util.user.SCOHelper.getSCOUser(transSet.Claim.LossType)) {

          firstLevelUser = activity.AssignedByUser
        }
    }
    return firstLevelUser
  }

  /**
  * Gets the last approving user who is at the adjuster level in the bulk invoice approval history
  */
  @Param("bulkInvoice","the bulk invoice you want to get the last approving first user from")
  @Returns("the last adjuster level user to approve this bulk invoice")
  public static function getLastApprovingFirstLevelUser(bulkInvoice : BulkInvoice) : User {
    var activity : Activity = null
    var firstLevelUser : User = null
    var history = getApprovalHistory(bulkInvoice)
    var reverseHistory = history.reverse()
    var historyIterator = reverseHistory.iterator()
    
    while (historyIterator.hasNext() && firstLevelUser == null) {

      activity = historyIterator.next()

        if (!util.user.GroupsHelper.isAGroupSupervisor(activity.AssignedByUser) &&
          activity.AssignedByUser !=  util.user.SCOHelper.ManualBulkInvoiceApproverUser &&
          activity.AssignedByUser != util.user.SCOHelper.CorpClaimsOneUser &&
          activity.AssignedByUser != util.user.SCOHelper.CorpClaimsTwoUser) {

          firstLevelUser = activity.AssignedByUser
        }
    }
    return firstLevelUser
  }

} //End ApprovalHelper