package libraries.User_Entity


enhancement Roles : entity.User {
  
  function hasPermission(permission:SystemPermissionType):boolean{
    for(role in this.Roles){
      if(exists(perm in role.Role.Privileges where perm.Permission == permission)){
        return true;  
      }
    }
    return false;
  }
  
  function hasUserRole(role : String):boolean{
    if(exists(userRole in this.Roles where userRole.Role.Name.equalsIgnoreCase(role))){
      return true; 
    }
    return false;
  }

  function hasVendorPayable() : boolean{
    for(role in this.Roles){
      if(exists(priv in role.Role.Privileges where priv.Permission == "vendorpayable")){
        return true;
      }
    }
    return false;
  }

  function hasEditEFTInformation() : boolean{
    for(role in this.Roles){
      if(exists(priv in role.Role.Privileges where priv.Permission == "editeftinformation")){
        return true;
      }
    }
    return false;
  }

  function resetAuthorityLimits(){
    if(this.hasVendorPayable()){
      for(limits in this.AuthorityLimits){
        if(limits.LimitAmount > 0.01){
          pcf.GeneralErrorWorksheet.goInWorkspace( displaykey.Java.Admin.User.ResetAuthorityLimit )
          limits.LimitAmount = 0.01
        }
      }
    }
    if(this.hasEditEFTInformation()){
      for(limits in this.AuthorityLimits){
        if(limits.LimitAmount > 0.01){
          pcf.GeneralErrorWorksheet.goInWorkspace( displaykey.Java.Admin.User.ResetAuthorityLimit )
          limits.LimitAmount = 0.01
        }
  	}
    }
  }

  function hasCreatePreferred() : boolean{
    for(role in this.Roles){
      if(exists(priv in role.Role.Privileges where priv.Permission == "abcreatepref")){
        return true;
      }
    }
    return false;
  }
  
  function hasEditPreferred() : boolean{
    for(role in this.Roles){
      if(exists(priv in role.Role.Privileges where priv.Permission == "abeditpref")){
        return true;
      }
    }
    return false;
  }
  
  function hasEditPanel() : boolean{
    for(role in this.Roles){
      if(exists(priv in role.Role.Privileges where priv.Permission == "editPanelIndicator")){
        return true;
      }
    }
    return false;
  }

  //Checks to see if the user can visit the Policy Conversion Request screen in the Admin tab - kmboyd - 3/16/09
  function canVisitPolReqRptScreen() : boolean{
    if((this.hasUserRole("Processing Supervisor") or 
      this.hasUserRole("Processor") or 
      this.hasUserRole("Adjuster") or 
      this.hasUserRole("New Loss Supervisor") or
      this.hasUserRole("Claims Supervisor") or 
      this.hasUserRole("Corporate Claims Administrator") or 
      this.hasUserRole("Superuser") or 
      this.hasUserRole("Claims Manager") or
      this.hasUserRole("Corporate Claims"))){
        return true;
    }
    return false;
  }

function underwriterRestrictionsELD() : boolean{
  if((this.hasUserRole("ELD Underwriter"))){
    return false;
    }
    return true;
  }
  
  function islawFirmAttorneyAdmin() : boolean{
    if(this.hasUserRole("LawFirm Attorney Administrator")){
    return true;
    }
    return false;
  }
  
  function isBillingAdressAdmin(): boolean{
    if(this.hasUserRole("Billing Address Administrator")){
    return true;
    }
    return false;
  }
}