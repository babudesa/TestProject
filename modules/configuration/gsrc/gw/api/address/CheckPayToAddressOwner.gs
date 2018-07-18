package gw.api.address
uses java.util.*

class CheckPayToAddressOwner extends CheckRelatedAddressOwner {
  
  private static final var associatedProperty : String = "ex_PayToAddress"

  private var _nonEditableAddresses = gw.util.concurrent.LazyVar.make(\ -> findNonEditableAddresses())
  
  construct(associatedCheck : Check) {
    super(getAddressProperty(entity.Check, associatedProperty), associatedCheck)
  }

  override property get Addresses() : Address[] {
    //return addOriginalValue((Owner as Check).Payees[0].ClaimContact.Contact.AllAddresses)
    return (Owner as Check).Payees[0].ClaimContact.Contact.AllAddresses
  }


  override property get NonEditableAddresses() : Set<Address> {
    return _nonEditableAddresses.get()
  }
  
  override function getOrCreateNewAddress() : Address{
    var result = super.getOrCreateNewAddress()
    var payeeCont = (Owner as Check).Payees[0].ClaimContact.Contact
   
    if((payeeCont typeis CompanyVendor || payeeCont typeis PersonVendor) and payeeCont.Preferred and 
      !gw.plugin.util.CurrentUserUtil.getCurrentUser().User.hasUserRole("Compliance Accounting")){
        
        if(!gw.plugin.util.CurrentUserUtil.getCurrentUser().User.islawFirmAttorneyAdmin() and
          result.AddressType != AddressType.TC_BILLING){
            result.AddressType = AddressType.TC_MAILING
        }
    }
    
    return result
  }
  override property get UnavailableFields() : Set<AddressOwnerFieldId> {
    var makeTheseUnavailable : Set<AddressOwnerFieldId> = {}
    var payeeCont = (Owner as Check).Payees[0].ClaimContact.Contact
  
    if((payeeCont typeis CompanyVendor or payeeCont typeis PersonVendor) and payeeCont.Preferred and
    !gw.plugin.util.CurrentUserUtil.getCurrentUser().User.hasUserRole("Compliance Accounting") and
    !gw.plugin.util.CurrentUserUtil.getCurrentUser().User.islawFirmAttorneyAdmin()){  
      makeTheseUnavailable.add(CCAddressOwnerFieldId.ADDRESSTYPE) 
    }
    if(Address == null or isAddressInAddresses()){
      makeTheseUnavailable.addAll({CCAddressOwnerFieldId.COUNTRY, CCAddressOwnerFieldId.ADDRESSTYPE,
                                   CCAddressOwnerFieldId.ADDRESSLINE1, CCAddressOwnerFieldId.ADDRESSLINE2,
                                   CCAddressOwnerFieldId.CITY, CCAddressOwnerFieldId.STATE, CCAddressOwnerFieldId.POSTALCODE}) 
    }
    
    return makeTheseUnavailable
  } 
  private function findNonEditableAddresses() : Set<Address> {
  
    var result = ((Owner as Check).FirstPayee.Payee.AllAddresses != null)
                  ? (Owner as Check).FirstPayee.Payee.AllAddresses.toSet()
                  : Collections.emptySet<Address>()
                  
    return result
    
  }
  
  property get PayeeContact() : Contact {
    return (Owner as Check).Payees[0].ClaimContact.Contact 
  }
}
