package gw.api.address
uses java.util.Set
uses java.util.HashSet


abstract class MatterRelatedAddressOwner extends CCAddressOwnerBase {
 
 
  //used to determine which field of the Matter entity the addressowner maps to
  enum MatterAddressOwnerType {
    
    COUNSEL_CONTACT("CounselContactAddressExt"),
    COUNSEL_BILLING("CounselBillingAddressExt")
    
    var _name : String
    
    private construct(propName : String){
      _name = propName 
    }
    override property get Name() : String {
      return _name
    }
  }
  
  
   override function getOrCreateNewAddress() : Address{
    var result = new Address()
      //If the counsel contact on the assignment is preferred and 
      //current user does not have the compliance accounting role then
      //set the default address type to mailing for any new address creation
      if(!User.util.getCurrentUser().hasUserRole("Compliance Accounting")
          && _matterAssignment.CounselLawFirmExt.Preferred){
            
          if(!User.util.getCurrentUser().islawFirmAttorneyAdmin() &&
            result.AddressType != AddressType.TC_BILLING){
              result.AddressType = AddressType.TC_MAILING
          }
      }
    return result
  }
  
  private var _matterAssignment : MatterAssignmentExt
  
  construct(matterAssignment : MatterAssignmentExt, type : MatterAddressOwnerType) {
    super(getAddressProperty(entity.MatterAssignmentExt, type.Name))   
    _matterAssignment = matterAssignment
  }
  
  override property get Owner() : KeyableBean {
    return _matterAssignment
  }
  
  override property get HiddenFields() : Set<AddressOwnerFieldId> {
   var fieldsToHide : Set<AddressOwnerFieldId> = new HashSet<AddressOwnerFieldId>()
    fieldsToHide.add(CCAddressOwnerFieldId.ADDRESSTYPE)
    fieldsToHide.add(CCAddressOwnerFieldId.LATITUDE)
    fieldsToHide.add(CCAddressOwnerFieldId.LONGTITUDE)
    
    //Checking for an empty string display name is the one way to detect a "New..." address.
    //Note that the New property just means new in the bundle (publicID is null), which isn't always reliable
    if(this.Address.DisplayName == "" or this.Address.New){
      fieldsToHide.remove(CCAddressOwnerFieldId.ADDRESSTYPE) 
    }
    
    return fieldsToHide
  }
  
  override property get RequiredFields() : Set<AddressOwnerFieldId> {
    switch(InputSetMode){
      case "US":
        return CCAddressOwnerFieldId.US_REQUIREDFIELDS
      case "CA":
        return CCAddressOwnerFieldId.CA_REQUIREDFIELDS
      default:
        return CCAddressOwnerFieldId.DEFAULT_REQUIREDFIELDS
    }
  }
  
  override property get ShowAddressSummary() : boolean {
    return false 
  }
  
  override property get NonEditableAddresses() : Set<Address> {
    
   var doNotEditThese : Set<Address> = new java.util.HashSet<Address>()
    
      if(Addresses != null){
        Addresses.each(\ a -> {
          if(a.AddressBookUID != null) 
            doNotEditThese.add(a) 
          })
      }
    
      return doNotEditThese
  }
  
  
  property get UnavailableFields() : Set<AddressOwnerFieldId> {
    
    //if the address is null then make all other fields unavailable to edit until 
    //address is selected
    if(this.Address == null){        
          
         return   ({CCAddressOwnerFieldId.COUNTRY,
                   CCAddressOwnerFieldId.ADDRESSTYPE,
                   CCAddressOwnerFieldId.ADDRESSLINE1,
                   CCAddressOwnerFieldId.ADDRESSLINE2,
                   CCAddressOwnerFieldId.CITY,
                   CCAddressOwnerFieldId.STATE,
                   CCAddressOwnerFieldId.POSTALCODE,
                   CCAddressOwnerFieldId.COUNTY}) 
           
    }
    
    //if the address is already located in address book     
    //then make address type field unavailable to change (is defaulted to mailing)
    if(this.NonEditableAddresses.contains(this.Address) || isAddressInAddresses()){        
     
             return   ({CCAddressOwnerFieldId.COUNTRY,
                       CCAddressOwnerFieldId.ADDRESSTYPE,
                       CCAddressOwnerFieldId.ADDRESSLINE1,
                       CCAddressOwnerFieldId.ADDRESSLINE2,
                       CCAddressOwnerFieldId.CITY,
                       CCAddressOwnerFieldId.STATE,
                       CCAddressOwnerFieldId.POSTALCODE,
                       CCAddressOwnerFieldId.COUNTY})   
    }
    
    //if the address is new and the counsel contact selected is a preferred vendor 
    // and the current user doesnt have the compliance accounting role
    //then make address type field unavailable to change (is defaulted to mailing)
    if(this.Address.New && !User.util.getCurrentUser().hasUserRole("Compliance Accounting")
          && !User.util.getCurrentUser().islawFirmAttorneyAdmin()
          && _matterAssignment.CounselLawFirmExt.Preferred == true){        
          
             return ({CCAddressOwnerFieldId.ADDRESSTYPE})    
    }
    
    return (CCAddressOwnerFieldId.NO_FIELDS)
}


  function isAddressInAddresses() : boolean {
    for(addy in this.Addresses){
      if(addy == this.Address and !addy.New){
        return true
      }
    }
    return false
  }

  
}
