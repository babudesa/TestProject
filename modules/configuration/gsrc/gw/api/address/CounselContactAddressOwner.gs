package gw.api.address


class CounselContactAddressOwner extends MatterRelatedAddressOwner{
  
  private var _matterAssignment : MatterAssignmentExt
  
  construct(matterAssignment : MatterAssignmentExt) {
    super(matterAssignment, MatterAddressOwnerType.COUNSEL_CONTACT)
    _matterAssignment = matterAssignment
  }

  override property get Addresses() : Address[] {
   return (this.Owner as MatterAssignmentExt).CounselLawFirmExt.AllAddresses
  }

}
