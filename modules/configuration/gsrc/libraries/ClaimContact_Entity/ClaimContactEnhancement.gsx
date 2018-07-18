package libraries.ClaimContact_Entity

enhancement ClaimContactEnhancement : entity.ClaimContact {
  
  function validatePrimaryPhone():String{
    if (this.cscPrimaryPhoneExt == null or (this.cscPrimaryPhoneExt == "work" and this.cscWorkPhoneExt != null) or
    (this.cscPrimaryPhoneExt == "home" and this.cscHomePhoneExt != null) or 
    (this.cscPrimaryPhoneExt == "mobile" and this.cscCellPhoneExt != null)) {
      return null
    } else {
      return displaykey.Web.ContactDetail.Phone.PrimaryPhone.Error
    }
  }
  
}
