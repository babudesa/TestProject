package libraries.Contact_Entity

//Previously canEditTaxInfo.xml
enhancement EditTaxInfo : entity.Contact {
  public function canEditTaxInfo() : Boolean{
    var result : Boolean = true;
  
    if(this typeis CompanyVendor){
      if(this.PayableExt and !exists(role in User.util.getCurrentUser().Roles where exists(perm in role.Role.Privileges where perm.Permission == "vendorpayable"))){
        result = false;
      }
    }
  
    if(this typeis PersonVendor){
      if(this.PayableExt and !exists(role in User.util.getCurrentUser().Roles where exists(perm in role.Role.Privileges where perm.Permission == "vendorpayable"))){
        result = false;
      }
    }
  
    return result;
  }

  function ssnISEditable(claim : Claim, pageIsInEditMode:boolean) : Boolean {
    var canEditSSN : boolean = false
    if(pageIsInEditMode){
      if((this.OriginalVersion as Contact).TaxID==null || (this.OriginalVersion as Contact).TaxID==""){
        canEditSSN = true
      }
      if(this.AddressBookUID!=null){
        canEditSSN = true
      }
      if(exists(role in User.util.getCurrentUser().Roles where exists(perm in role.Role.Privileges where perm.Permission == "vendorpayable" || perm.Permission == "editSSNInformation")) ||
         User.util.getCurrentUser()==claim.AssignedUser ||
         exists(exp in claim.Exposures where User.util.getCurrentUser()==exp.AssignedUser)){
        canEditSSN = true
      }
    } else {
      if(this.AddressBookUID!=null || exists(role in User.util.getCurrentUser().Roles where exists(perm in role.Role.Privileges where perm.Permission == "viewSSNInformation"))){
        canEditSSN = true
      }
    }
    return canEditSSN
  }
}
