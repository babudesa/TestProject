package gw.assignment
uses gw.api.database.IQueryResult;
uses gw.api.assignment.CCAssignableMethodsBaseImpl
uses gw.entity.ILinkPropertyInfo
uses gw.api.database.Query
uses gw.api.assignment.CCAssignableMethods
uses java.util.ArrayList

@Export
class ClaimAssignableMethodsImpl extends CCAssignableMethodsBaseImpl {

  construct(inClaim : Claim) {
    super(inClaim)
  }

  override property get Owner() : Claim {
    return super.Owner as Claim
  }
  
  override property get OwningClaim() : Claim {
    return Owner
  }

  override property get AssignmentReviewActivityLinkProperty() : ILinkPropertyInfo {
    return entity.Activity.Type.TypeInfo.getProperty("Claim") as ILinkPropertyInfo
  }

  override property get AssignmentReviewActivitySubject() : String {
    return displaykey.Java.Activity.AssignReview.Claim
  }

  override function findAssignmentReviewActivities() : IQueryResult<Activity,Activity> {
    var query = new Query<Activity>(Activity)
    var claimProperty = AssignmentReviewActivityLinkProperty
    query.compare("Type", Equals, ActivityType.TC_ASSIGNMENTREVIEW);
    query.compare("Status", Equals, ActivityStatus.TC_OPEN);
    query.compare("Claim", Equals, OwningClaim)
    for (prop in Activity.Type.TypeInfo.Properties) {
      if (prop typeis ILinkPropertyInfo
              and CCAssignable.Type.isAssignableFrom(prop.FeatureType)
              and prop != claimProperty) {
        query.compare(prop.Name, Equals, null)
      }
    }
    return query.select()
  }
  
  override function pushAssignmentPopup(assignables : List<CCAssignableMethods>) {
    var claims = assignables.whereTypeIs(entity.Claim).toTypedArray()
    AssignmentPopupUtil.pushAssignClaims(claims)
  }

  override function shouldCascadeAssignment(parent : Assignable,
                                            defaultOwnerUserId : Key,
                                            defaultGroupId : Key) : boolean {
    // Never cascade to a claim
    return false
  }
  
  override property get ChildrenForCascadeAssignment() : List<CCAssignableMethods> {
    var result = new ArrayList<CCAssignableMethods>()
    result.addAll(Owner.OrderedExposures.toList())
    result.addAll(Owner.Activities.where(\ a -> a.Exposure == null and a.Matter == null).toList())
    result.addAll(Owner.Matters.toList())
    return result
  }
}
