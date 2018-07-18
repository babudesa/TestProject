package gw.assignment
uses gw.api.assignment.CCAssignableMethodsBaseImpl
uses gw.entity.ILinkPropertyInfo
uses gw.api.assignment.CCAssignableMethods

@Export
class ExposureAssignableMethodsImpl extends CCAssignableMethodsBaseImpl {

  construct(exposure : Exposure) {
    super(exposure)
  }

  override property get Owner() : Exposure {
    return super.Owner as Exposure
  }

  override property get OwningClaim() : Claim {
    return Owner.Claim
  }

  override property get AssignmentReviewActivityLinkProperty() : ILinkPropertyInfo {
    return entity.Activity.Type.TypeInfo.getProperty("Exposure") as ILinkPropertyInfo
  }

  override property get AssignmentReviewActivitySubject() : String {
    return displaykey.Java.Activity.AssignReview.Exposure(Owner.ClaimOrder, entity.Exposure.Type.TypeInfo.DisplayName)
  }

  override function pushAssignmentPopup(assignables : List<CCAssignableMethods>) {
    var exposures = assignables.whereTypeIs(Exposure).toTypedArray()
    AssignmentPopupUtil.pushAssignExposures(exposures)
  }

  override function createAssignmentHistoryEvent(assignable : Assignable) : History {
    var history = super.createAssignmentHistoryEvent(assignable)
    history.Exposure = Owner
    return history
  }

  override function shouldCascadeAssignment(parent : Assignable,
                                            defaultOwnerUserId : Key,
                                            defaultGroupId : Key) : boolean {
    return (Owner.State =="draft" or Owner.State =="open")
            and super.shouldCascadeAssignment(parent, defaultOwnerUserId, defaultGroupId)
  }
  
  override property get ChildrenForCascadeAssignment() : List<CCAssignableMethods> {
    return Owner.Claim.Activities.where(\ a -> a.Exposure == Owner).toList()
  }
}
