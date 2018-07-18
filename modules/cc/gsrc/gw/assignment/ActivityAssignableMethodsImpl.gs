package gw.assignment
uses gw.api.assignment.CCAssignableMethodsBaseImpl
uses gw.entity.ILinkPropertyInfo
uses java.util.Collections
uses gw.api.assignment.CCAssignableMethods

@Export
class ActivityAssignableMethodsImpl extends CCAssignableMethodsBaseImpl {

  construct(activity : Activity) {
    super(activity)
  }

  override property get Owner() : Activity {
    return super.Owner as Activity
  }

  override property get OwningClaim() : Claim {
    return Owner.Claim
  }

  override property get AssignmentReviewActivityLinkProperty() : ILinkPropertyInfo {
    return entity.Activity.Type.TypeInfo.getProperty("RelatedActivity") as ILinkPropertyInfo
  }

  override property get AssignmentReviewActivitySubject() : String {
    return displaykey.Java.Activity.AssignReview.Activity(Owner.Subject)
  }

  override function pushAssignmentPopup(assignables : List<CCAssignableMethods>) {
    var activities = assignables.whereTypeIs(Activity).toTypedArray()
    AssignmentPopupUtil.pushAssignActivities(activities)
  }

  override function createAssignmentHistoryEvent(assignable : Assignable) : History {
    return null
  }

  override function shouldCascadeAssignment(parent : Assignable,
                                            defaultOwnerUserId : Key,
                                            defaultGroupId : Key) : boolean {
    return Owner.Status == "open" 
            and Owner.Type != "assignmentreview" 
            and super.shouldCascadeAssignment(parent, defaultOwnerUserId, defaultGroupId)
  }
  
  override property get ChildrenForCascadeAssignment() : List<CCAssignableMethods> {
    return Collections.emptyList<CCAssignableMethods>()
  }

  override property get OwningAssignable() : Assignable {
    return Owner.Exposure != null ? Owner.Exposure : super.OwningAssignable
  }

}
