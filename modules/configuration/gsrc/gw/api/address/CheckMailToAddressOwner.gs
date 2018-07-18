package gw.api.address
uses java.util.*

class CheckMailToAddressOwner extends CheckRelatedAddressOwner{

  private static final var associatedProperty : String = "ex_MailToAddress"

  private var _nonEditableAddresses = gw.util.concurrent.LazyVar.make(\ -> findNonEditableAddresses())

  construct(associatedCheck : Check) {
    super(getAddressProperty(entity.Check, associatedProperty), associatedCheck)
  }

  override property get Addresses() : Address[] {
    return (Owner as Check).ex_MailTo.AllAddresses
    //return addOriginalValue((Owner as Check).ex_MailTo.AllAddresses)
  }

  override property get NonEditableAddresses() : Set<Address> {
    return _nonEditableAddresses.get()
  } 
  
  override property get UnavailableFields() : Set<AddressOwnerFieldId> {
    var makeTheseUnavailable : Set<AddressOwnerFieldId> = {}
    var mailCont = (Owner as Check).ex_MailTo 
          
    if((mailCont typeis CompanyVendor or mailCont typeis PersonVendor) and  
      (!gw.plugin.util.CurrentUserUtil.getCurrentUser().User.hasUserRole("Compliance Accounting") and
      !gw.plugin.util.CurrentUserUtil.getCurrentUser().User.islawFirmAttorneyAdmin()) and
      mailCont.Preferred and (this.Address.DisplayName == "" or this.Address.New)){             
        makeTheseUnavailable.add(CCAddressOwnerFieldId.ADDRESSTYPE) 
        return makeTheseUnavailable
    }
    
    return super.UnavailableFields  
  }
  
  
  override function getOrCreateNewAddress() : Address{
    var result = super.getOrCreateNewAddress()
    var mailCont = (Owner as Check).ex_MailTo
    
    if((mailCont typeis CompanyVendor || mailCont typeis PersonVendor) and 
      !gw.plugin.util.CurrentUserUtil.getCurrentUser().User.hasUserRole("Compliance Accounting")
       and mailCont.Preferred){
               
      if(!gw.plugin.util.CurrentUserUtil.getCurrentUser().User.islawFirmAttorneyAdmin() and
        result.AddressType != AddressType.TC_BILLING){
          result.AddressType = AddressType.TC_MAILING
      }      
    }
    
    return result
  }
  
  private function findNonEditableAddresses() : Set<Address> {
    var chk = Owner as Check
    
    var result : Set<Address> = new HashSet<Address>()
    if(chk.ex_MailTo.AllAddresses != null){
      result = chk.ex_MailTo.AllAddresses.toSet()
    }
    
    if(chk.hasPayeeWithholdings() and !chk.ManualCheck){
      result.add(chk.ex_MailToAddress) 
    }
   
    return result
  }
  
  property get MailToContact() : Contact {
    return (Owner as Check).ex_MailTo
  }
  
 /*
   Defect: 7527
  Comments:  When checks are created with a Check Delivery type of 'Return to Office/Adjuster', default the Location Address to the 
  Business Address and lock down the field - do not allow changes. 

 */ 
  property get rTOUnavailableFields(): Set<AddressOwnerFieldId> {
    var makeTheseUnavailable : Set<AddressOwnerFieldId> = this.UnavailableFields
    if(this typeis  CheckMailToAddressOwner && (Owner as Check).DeliveryMethod=="hold" && this.Address.AddressType=="business" ){
      makeTheseUnavailable.add(CCAddressOwnerFieldId.ADDRESS_NAME)      
    }
    return makeTheseUnavailable
  }  
}