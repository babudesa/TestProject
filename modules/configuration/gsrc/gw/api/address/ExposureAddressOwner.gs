package gw.api.address
uses java.util.Set
/**
 * CCAddressOwner object for the Exposure entity.
 * See AddressOwner and CCAddressOwner for details of what an
 * AddressOwner object does.
 */
@Export
class ExposureAddressOwner extends ClaimRelatedAddressOwner {
  
  private var _exposure : Exposure
  static var initial : boolean = true 
  
  construct(exposure : Exposure) {
    super(getAddressProperty(entity.Exposure, "TempLocation"), exposure.Claim)
    _exposure = exposure
    if(initial){
    this.Address =_exposure.Claim.Insured.PrimaryAddress
    initial =false
    }
  }

  override property get Owner() : KeyableBean {
    return _exposure
  }
  
  override property get HiddenFields() : Set<AddressOwnerFieldId> {
    return{CCAddressOwnerFieldId.LATITUDE, CCAddressOwnerFieldId.LONGTITUDE, CCAddressOwnerFieldId.ADDRESSTYPE} 
  }
  
  override property get RequiredFields() : Set<AddressOwnerFieldId> {
    return CCAddressOwnerFieldId.NO_FIELDS 
  }
  
function resetInitial():Boolean{
  initial = initial ? false : true  
  return initial
}

}