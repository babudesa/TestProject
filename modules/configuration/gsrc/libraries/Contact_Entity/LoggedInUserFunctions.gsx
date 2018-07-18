package libraries.Contact_Entity

enhancement LoggedInUserFunctions : entity.Contact {
  //*defect 403 zthomas get the current logged in user&amp;apos;s Business Unit Name and update the LoggedInUserBUNameEXT.  To be used on e-mails when a vendor is added
  // 12/13/2007 - zthomas - Defect 532, restrict LoggedInUserBUNameEXT to only get set when a contact is new and isn&amp;apos;t currently linked to the addressbook.
  // 5/14/09 - erawe - Defect 1811, added all the vendor subtypes in order to update the LoggedInUserBUNameEXT field. This will put the user&apos;s group
  // on the email that actually made the vendor payable.
  function setLoggedInUserBUName(){
    var userBUName: String
    var userGroup: Group

    if((this.New and !this.generateLinkStatus().Linked)or
        (this.Subtype =="PersonVendor" and (this as PersonVendor).isFieldChanged( "PayableExt" )and (this as PersonVendor).PayableExt == true) or
        (this.Subtype == "Attorney" and (this as Attorney).isFieldChanged( "PayableExt" ) and (this as Attorney).PayableExt == true) or 
        (this.Subtype == "Doctor" and (this as Doctor).isFieldChanged( "PayableExt" ) and (this as Doctor).PayableExt == true) or 
        (this.Subtype == "Ex_GAIVendor" and (this as Ex_GAIVendor).isFieldChanged( "PayableExt" ) and (this as Ex_GAIVendor).PayableExt == true) or 
        (this.Subtype == "Ex_ForeignPersonVndr" and (this as Ex_ForeignPersonVndr).isFieldChanged( "PayableExt" ) and (this as Ex_ForeignPersonVndr).PayableExt == true) or
        (this.Subtype == "Ex_ForeignPerVndrAttny" and (this as Ex_ForeignPerVndrAttny).isFieldChanged( "PayableExt" ) and (this as Ex_ForeignPerVndrAttny).PayableExt == true) or 
        (this.Subtype == "Ex_ForeignPerVndrDoc" and (this as Ex_ForeignPerVndrDoc).isFieldChanged( "PayableExt" ) and (this as Ex_ForeignPerVndrDoc).PayableExt == true) or
        (this.Subtype == "CompanyVendor" and (this as CompanyVendor).isFieldChanged( "PayableExt" ) and (this as CompanyVendor).PayableExt == true ) or 
        (this.Subtype == "LawFirm" and (this as LawFirm).isFieldChanged( "PayableExt" ) and (this as LawFirm).PayableExt == true ) or 
        (this.Subtype == "MedicalCareOrg" and (this as MedicalCareOrg).isFieldChanged( "PayableExt" ) and (this as MedicalCareOrg).PayableExt == true ) or 
        (this.Subtype == "Ex_ForeignCoVendor" and (this as Ex_ForeignCoVendor).isFieldChanged( "PayableExt" ) and (this as Ex_ForeignCoVendor).PayableExt == true ) or
        (this.Subtype == "Ex_ForeignCoVenMedOrg" and (this as Ex_ForeignCoVenMedOrg).isFieldChanged( "PayableExt" ) and (this as Ex_ForeignCoVenMedOrg).PayableExt == true) or
        (this.Subtype == "Ex_ForeignCoVenLawFrm" and (this as Ex_ForeignCoVenLawFrm).isFieldChanged( "PayableExt" ) and (this as Ex_ForeignCoVenLawFrm).PayableExt == true )){
      for(grp in gw.plugin.util.CurrentUserUtil.getCurrentUser().User.GroupUsers ){
        userGroup = grp.Group
        while(userGroup != grp.Group.RootGroup){
            if(userGroup.GroupType == "busunit" or userGroup.GroupType == "nonclaimsbusunit"){
               userBUName = userGroup.DisplayName 
               break;
            }
          userBUName = userGroup.DisplayName
          userGroup = userGroup.Parent
        }
      }
      this.LoggedInUserBUNameEXT = userBUName;
    }
  }
  
  /*Determine if current user has the compliance accounting role.
    Sprint/Maintenance Release: EM 10
    Author: Zach Thomas
    Date: 06/27/08
    Defect: 968
  */
  function setLoggedInUserCompAcct(){
  
    if(this.New and !this.generateLinkStatus().Linked or      
      (this typeis PersonVendor and this.PayableExt and !(this.OriginalVersion as PersonVendor).PayableExt) or
      (this typeis CompanyVendor and this.PayableExt and !(this.OriginalVersion as CompanyVendor).PayableExt)){
      if(exists(role in User.util.getCurrentUser().Roles where role.Role == Role( "compliance_account" ))){
        this.LoggedInUserCompAcctExt = true;
      }else{
        this.LoggedInUserCompAcctExt = false;
      }
    }   
  }
  
  //*defect 424 djohnson get the current logged in user and update the ex_loggedInUserId.  To be used on e-mails when a vendor is addedte
  // 12/13/2007 - zthomas - Defect 532, restrict Ex_LoggedInUserID to only get set when a contact is new and isn&amp;apos;t currently linked to the addressbook.
  // 5/14/09 - erawe - Defect 1811, added all the vendor subtypes in order to update the Ex_LoggedInUserID field. This will put the user
  // on the email that actually made the vendor payable.
  function setLoggedInUserId(){
    
     if((this.New and !this.generateLinkStatus().Linked) or      
      (this typeis PersonVendor and this.PayableExt and !(this.OriginalVersion as PersonVendor).PayableExt) or
      (this typeis CompanyVendor and this.PayableExt and !(this.OriginalVersion as CompanyVendor).PayableExt)){
  
        this.Ex_LoggedInUserID = gw.plugin.util.CurrentUserUtil.getCurrentUser().User.toString()
        
      }
  }
}
