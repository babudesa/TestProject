package gw.api.address 
uses java.util.Set 
uses gw.api.address.* 
uses gw.api.util.LocationUtil 

enhancement AddressOwnerInputsetEnhancement : gw.api.address.CCAddressOwner { 

  /**
   * @return the Boolean value
   * Sets the AddeessInputSets are editable or not
   * The current user has the privileges: to edit preferred contacts
   * -OR-
   * has the Billing Address Administrator role
   */
 
 property get InputSetEditable() : boolean {
   if (this.Address.AddressType == AddressType.TC_BILLING) {
     if ( this typeis gw.api.address.ContactHandleAddressOwner &&
        (this.Owner typeis LawFirm || this.Owner typeis Ex_ForeignCoVenLawFrm || this.Owner typeis Attorney || this.Owner typeis Ex_ForeignPerVndrAttny) ) {
            return User.util.CurrentUser.isBillingAdressAdmin()
            
     }else if(this typeis gw.api.address.AddressAddressOwner &&
        (this.addressOwnerContact() typeis LawFirm || this.addressOwnerContact() typeis Ex_ForeignCoVenLawFrm || this.addressOwnerContact() typeis Attorney || this.addressOwnerContact() typeis Ex_ForeignPerVndrAttny)){
        return User.util.CurrentUser.isBillingAdressAdmin()
     }else if( this typeis gw.api.address.CustomAddressAddressOwner && ( this.addressOwnerContact() typeis LawFirm || this.addressOwnerContact() typeis Ex_ForeignCoVenLawFrm || this.addressOwnerContact() typeis Attorney || this.addressOwnerContact() typeis Ex_ForeignPerVndrAttny)){
             return User.util.CurrentUser.islawFirmAttorneyAdmin()
     }else if( this typeis gw.api.address.ContactAddressOwner && ( this.Owner typeis LawFirm || this.Owner typeis Ex_ForeignCoVenLawFrm || this.Owner typeis Attorney || this.Owner typeis Ex_ForeignPerVndrAttny)){
             return User.util.CurrentUser.isBillingAdressAdmin()
     }
   } else if(this.Address.AddressType == AddressType.TC_FEES){
     if(User.util.CurrentUser.hasPermission(SystemPermissionType.TC_EDITFEEADDRESS)){
       return true
     } else {
       return false
     }
   } else {
           return not getContact().Preferred or this.Address.AddressBookUID == null or 
            User.util.getCurrentUser().hasCreatePreferred()
   }
    return true
  }


  /**
   * @return the Boolean value
   * Address Type should be available if:
   *   1) The address owner object is of type AddressAddressOwner or one of its subtypes
   *   2) The address Country is not null
   *   3) The address owner (contact object based on number 1) is a preferred contact
   *   4) The current user has the privileges: to edit preferred contacts -OR- has the Billing Address Administrator role
   *   -OR-
   *   1) Non-editable addresses does not contain the address and unavailable fields does not contain Address Type
   */
  property get AddressTypeAvailable() : boolean {
    var currentUser : User = gw.plugin.util.CurrentUserUtil.getCurrentUser().User 
    var available : boolean = true 
	
    if (this typeis gw.api.address.AddressAddressOwner and this.Address.
      Country != null and (this.addressOwnerContact().Preferred and(!currentUser.hasEditPreferred()
      and !currentUser.islawFirmAttorneyAdmin()))) {
      available = false
    } else {
     available = !this.NonEditableAddresses.contains(this.Address) && 
     !getUnavailableFields().contains(gw.api.address.CCAddressOwnerFieldId.ADDRESSTYPE)
    }
    return available
  }

  /**
   * @return the Set of type gw.api.address.AddressOwnerFieldId
   *  Gets unavilable fields on the AddeessInputSets
   */
  function getUnavailableFields() : Set <gw.api.address.AddressOwnerFieldId> {
    switch (this.IntrinsicType) {
    case CheckPayToAddressOwner:
      return (this as CheckRelatedAddressOwner).UnavailableFields
    case CheckMailToAddressOwner:
      //Defect: 7527
      // return (this as CheckMailToAddressOwner).UnavailableFields
      return (this as CheckMailToAddressOwner).rTOUnavailableFields
    case ContactHandleAddressOwner:
      return (this as ContactHandleAddressOwner).UnavailableFields
    case CustomAddressAddressOwner:
      return (this as CustomAddressAddressOwner).UnavailableFields
    case LocationBasedRUAddressOwner:
      return (this as LocationBasedRUAddressOwner).UnavailableFields
    case PolicyLocationAddressOwner:
      return (this as PolicyLocationAddressOwner).UnavailableFields
    case ClaimAddressOwner:
      return (this as ClaimAddressOwner).UnavailableFields
    case BulkInvoiceMailToAddressOwner:
      return (this as BulkInvoiceMailToAddressOwner).UnavailableFields
    case BulkInvoicePayToAddressOwner:
      return (this as BulkInvoicePayToAddressOwner).UnavailableFields
    case CounselContactAddressOwner:
      return (this as MatterRelatedAddressOwner).UnavailableFields
    default:
      return CCAddressOwnerFieldId.NO_FIELDS
    }
  }

  /**
   *  @return the Set of type gw.api.address.AddressOwnerFieldId
   *  Bug Fix 6.0_Testing_FeatureActions [32]:   Set of fields needs to hide while Selecting
   *  Policy in Policy->PolicySelect General Page to maintain CC 4.0.9 UI Page
   */
  function getPolicySearchHiddenFields() : Set <gw.api.address.AddressOwnerFieldId> {
    switch (this.IntrinsicType) {
    case PolicySearchAddressOwner:
      return (this as PolicySearchAddressOwner).PolicySearchHiddenFields
    default:
      return CCAddressOwnerFieldId.NO_FIELDS
    }
  }

  /**
   * return the Boolean value
   *  Bug Fix 6.0_Testing_FeatureActions [33]:   Set of fields needs to hide while Selecting
   * Policy in Policy->PolicySelect General Page to maintain CC 4.0.9 UI Page
   */
  function isStandardizingNeeded() : Boolean {
    if (this.IntrinsicType typeis PolicySearchAddressOwner) {
      return (this as PolicySearchAddressOwner).isStandardizationNeeded()
    } else {
      return true
    }
  }

  /**
   * @return the Conatct
   * Get the contact of AddressAddressOwner
   */
  function getContact() : Contact {
    var contact : Contact 
	
    if (this typeis gw.api.address.AddressAddressOwner) {
      contact = this.addressOwnerContact()
    } else {
      contact = null
    }
    return contact
  }

  /**
   * @return the Boolean value
   * It will check AddressPicker is Availabele or not in AddressInputSet
   */
  function isAddressPickerEditable() : boolean {
    if (typeof this == gw.api.address.CheckMailToAddressOwner) {
      var check = (this as gw.api.address.CheckMailToAddressOwner).Owner as Check 
      return check.ex_MailToAddress != check.ex_PayToAddress ? true : false
    }
    if (typeof this == gw.api.address.BulkInvoiceMailToAddressOwner) {
      var bi = (this as gw.api.address.BulkInvoiceMailToAddressOwner).Owner as BulkInvoice 
      return bi.MailToAddressExt != bi.PayToAddressExt ? true : false
    }
    return true
  }

  /**
   * @return the Boolean value
   * Only foriegn vendors cannot have US as their country,
   * all US vendors can have other countries as their address.
   */
  function isOkCountryValue(countryValue : String) : boolean {
    var okFlag = false 
    
    if (this typeis gw.api.address.ContactHandleAddressOwner) {
        okFlag = this.Owner.filterVendorCountries(countryValue)
      } else if (this typeis gw.api.address.ContactAddressOwner) {
        okFlag = this.Owner.filterVendorCountries(countryValue)
      } else if (this typeis gw.api.address.AddressAddressOwner) {
        okFlag = this.addressOwnerContact().filterVendorCountries(countryValue)
      } else {
        okFlag = true
      }
    return okFlag
  }

  /**
   * @return the Boolean value
   * it will checks for the combinations of Foreign vendor with a US address
   * and a US vendor with a Foreign address then returns the appropriate validation expression.
   */
  function isUSCntryValidation() : String {
    var validationString : String 
    
    if (this typeis gw.api.address.ContactHandleAddressOwner) {
      validationString = this.Owner.validateCountryForVendors(this.Address.Country.Code)
    } else if (this typeis gw.api.address.ContactAddressOwner) {
      validationString = this.Owner.validateCountryForVendors(this.Address.Country.Code)
    } else {
      validationString = null
    }
    return validationString
  }

  /**
   * @return the Boolean value
   * It will show StandardizeButton clikable to user or not in UI
   */
  function showStandardizeButton() : boolean {
    var chkContact : Contact 
	
    if (this typeis gw.api.address.CheckPayToAddressOwner and this.Owner typeis Check) {
      chkContact = this.Owner.FirstPayee.ClaimContact.Contact
    }
    if (this typeis gw.api.address.CheckMailToAddressOwner and this.Owner typeis Check) {
      chkContact = this.Owner.ex_MailTo
    }
    if (this typeis gw.api.address.CounselContactAddressOwner and this.Owner typeis MatterAssignmentExt) {
      chkContact = this.Owner.CounselLawFirmExt
    }
    
     // Hide standardize button for defect 5541
    if (this typeis gw.api.address.CheckMailToAddressOwner and
      this.Owner typeis Check and
      this.Owner.DeliveryMethod == DeliveryMethod.TC_HOLD or
      this typeis gw.api.address.CheckPayToAddressOwner and
      this.Owner typeis Check and
      this.Owner.DeliveryMethod == DeliveryMethod.TC_HOLD){
      return false
    }
    
    if (this typeis gw.api.address.CounselContactAddressOwner and this.Owner typeis MatterAssignmentExt &&
      this.Address.AddressType == AddressType.TC_BILLING &&
      !gw.plugin.util.CurrentUserUtil.getCurrentUser().User.islawFirmAttorneyAdmin()){
      return false
    } else if (this typeis gw.api.address.CounselContactAddressOwner and this.Owner typeis MatterAssignmentExt &&
      this.Address.AddressType == AddressType.TC_BILLING &&
      gw.plugin.util.CurrentUserUtil.getCurrentUser().User.islawFirmAttorneyAdmin()){
      return true
    }
	if (chkContact != null and!this.Address.New and ((chkContact typeis CompanyVendor and chkContact.Preferred) or
	   (chkContact typeis PersonVendor and chkContact.Preferred)) and 
	   !gw.plugin.util.CurrentUserUtil.getCurrentUser().User.hasUserRole("Compliance Accounting")) {
       return false
    }
    return true
  }

  /**
   * @return the AddressType as List[]
   * It will remove Billing AddressType from if current user does not have Billing Address Administrator role
   * and user has Billing Address Admin role and contact is preferred but the current user does not have permission
   * to edit a preferred contact addy, with the exception of mailing and billing addresses
   */
  function filterAddressTypes(addressTypes : AddressType[]) : List <AddressType> {
    var currentUser : User = gw.plugin.util.CurrentUserUtil.getCurrentUser().User 
    var displayThese : List <AddressType>  = new java.util.ArrayList <AddressType>()
    addressTypes.each(\ at-> displayThese.add(at))
   
    //remove Billing AddressType from if current user does not have Billing Address Administrator role
    if(!isBillingAddressEnable(currentUser)){
      displayThese.removeWhere(\ at -> at != AddressType.TC_MAILING)
    } else if ((this typeis AddressAddressOwner and this.addressOwnerContact().Preferred) or
     (this typeis CheckPayToAddressOwner and this.PayeeContact.Preferred) or
     (this typeis CheckMailToAddressOwner and this.MailToContact.Preferred) or
     (this typeis gw.api.address.CounselContactAddressOwner and (this.Owner as MatterAssignmentExt).CounselLawFirmExt.Preferred)) {

      //user has Billing Address Admin role and contact is preferred but the current user does not have permission
      //to edit a preferred contact addy, with the exception of mailing and billing addresses
     // if (currentUser.isBillingAdressAdmin()) {
        displayThese.removeWhere(\ at -> at != AddressType.TC_BILLING and at != AddressType.TC_MAILING)
      //}
    }
    if(currentUser.hasPermission(SystemPermissionType.TC_EDITFEEADDRESS) and !displayThese.contains(AddressType.TC_FEES)){
       displayThese.add(AddressType.TC_FEES)
    }
    if(!currentUser.hasPermission(SystemPermissionType.TC_EDITFEEADDRESS)){
     displayThese.removeWhere(\ at -> at == AddressType.TC_FEES)
    }
    return displayThese
  }
  
  
  /** @param : cussrent user
   *  @return : boolean value for A Billing Address can be added/updated for all other Vendor Types(except Legal vendors) without the user having the Billing Address Administrator Role 
   */
   function isBillingAddressEnable(currentUser : User): boolean{
     var flag : boolean = true
      if (!currentUser.isBillingAdressAdmin()) {
        if(this.getContact() typeis LawFirm or this.getContact() typeis Ex_ForeignCoVenLawFrm or this.getContact() typeis Attorney or this.getContact() typeis Ex_ForeignPerVndrAttny){
         flag = false 
        }
    }
    return flag
  }
 
  /**
   * Returns indicator as to whether or not a new address should be allowed to be created.
   *
   * Defect 6791 - 6.5.14 - cmullin - existing function included only the DeliveryMethod.TC_HOLD condition. Additional functionality
   * added to disallow the New... address option for the new Non-Vendor Payee types unless the user has the proper permission.
   */
  function canCreateNewAddress() : Boolean {
    var chkContact : Contact 
    
    if (this typeis gw.api.address.CheckPayToAddressOwner and this.Owner typeis Check) {
      chkContact = this.Owner.Payees*.Payee.first()
    }
    if (this typeis gw.api.address.CheckMailToAddressOwner and this.Owner typeis Check) {
      chkContact = this.Owner.ex_MailTo
    }
    if (this typeis gw.api.address.ContactHandleAddressOwner) {
      chkContact = this.Owner
    }
    if (this typeis gw.api.address.BulkInvoiceMailToAddressOwner and this.Owner typeis BulkInvoice) {
      chkContact = this.Owner.ex_MailTo
    }
    if (this typeis gw.api.address.BulkInvoicePayToAddressOwner and this.Owner typeis BulkInvoice) {
      chkContact = this.Owner.Payee
    }
    if (this typeis gw.api.address.CheckMailToAddressOwner and (this.Owner as Check).DeliveryMethod == DeliveryMethod.TC_HOLD) {
      return false
    }
    if (this typeis gw.api.address.BulkInvoiceMailToAddressOwner and (this.Owner as BulkInvoice).DeliveryMethod == DeliveryMethod.TC_HOLD) {
      return false
    }
    if (chkContact != null and((chkContact typeis NonVendorPayeePersonExt or 
	chkContact typeis NonVendorPayeeCompanyExt) and !gw.plugin.util.CurrentUserUtil.getCurrentUser()
        .User.hasUserRole("Non-Vendor Payee Admin"))) {
      return false
    }
    return true
  }

  /**
   * This function will check City field and state field is null or empty it will throw
   * error message
   */
  function checkCityState() {
    if (this.Address.City != null && !this.Address.City.Empty && this.Address.State != null) {
      gw.api.contact.AddressAutocompleteUtil.autofillAddress(this.Address, "city")
    } else {
      LocationUtil.addRequestScopedErrorMessage("Please enter a city and state to use this automatic fill.")
    }
  }

  /**
   * This function will check postalcode field  is null or empty it will throw error message
   */
  function checkPostalCode() {
    if (this.Address.PostalCode != null && !this.Address.PostalCode.Empty) {
      gw.api.contact.AddressAutocompleteUtil.autofillAddress(this.Address, "postalcode")
    } else {
      LocationUtil.addRequestScopedErrorMessage("Please enter a ZIP code in order to use this automatic fill.")
    }
  }

  /**
   * @return the Object array
   */
  function getCountyValueRange() : Object[] {
    if (this.Address.PostalCode != null) {
      return gw.api.contact.AddressAutocompleteUtil.
      getValueRange(this.SelectedCountry, "county", {"postalcode"}, {this.Address.PostalCode}, 1)
    } else {
      return gw.api.contact.AddressAutocompleteUtil.
      getValueRange(this.SelectedCountry, "county", {"state"}, {this.Address.State}, 1)
    }
  }
  
}