package gw.api.address
uses java.util.Set

class CounselBillingAddressOwner extends MatterRelatedAddressOwner {
  

  private var _matterAssignment : MatterAssignmentExt
  
  construct(matterAssignment : MatterAssignmentExt) {
    super(matterAssignment, MatterAddressOwnerType.COUNSEL_BILLING)
     _matterAssignment = matterAssignment
  }
    
  override property get Addresses() : Address[] {
    return (this.Owner as MatterAssignmentExt).CounselLawFirmExt.AllAddresses
  }
 
   override property get RequiredFields() : Set<AddressOwnerFieldId> {
    switch(InputSetMode){
      case "US":
        return CCAddressOwnerFieldId.NO_FIELDS 
      case "CA":
        return CCAddressOwnerFieldId.NO_FIELDS
      default:
        return CCAddressOwnerFieldId.NO_FIELDS 
    }
   }


}
