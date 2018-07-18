package libraries.Policy_Entity
uses java.util.ArrayList
uses gw.api.util.Logger //Added for logging in Debug - SR

enhancement PolicyFunctions : entity.Policy {
  function getMNICoveredParties():ClaimContactRole[]{
    var moreNamedInsuredList : List = new ArrayList();
    var moreNamedInsuredDBAList : List = new ArrayList();
    var coveredPartyRoleList : List = new ArrayList();
  
    for(cont in this.getClaimContactsByRole( "coveredparty" )){
      if(exists(role in cont.Roles where role.CoveredPartyType == "addnlnameinsured" || role.CoveredPartyType == "morenameinsureddba")){
        for(role in cont.Roles){
          if(role.CoveredPartyType == "addnlnameinsured" and role.Role != "formercoveredparty"){
            moreNamedInsuredList.add( role )
          }
          if(role.CoveredPartyType == "morenameinsureddba" and role.Role != "formercoveredparty"){
            moreNamedInsuredDBAList.add( role )
          }
        }
      }
    }
  

    for(moreNamedInsured in moreNamedInsuredList){
      coveredPartyRoleList.add( moreNamedInsured );
  //  12/15/2009 - zthomas - This section adds MNI DBA directly under MNI in MNI list, section removed until MoreNamedInsuredDBAExt is added back.
  //  12/29/2009 - zthomas - Reworked how the more named insured DBA is associated with the More Named Insured.
      for(moreNamedInsuredDBA in moreNamedInsuredDBAList){
        if(((moreNamedInsured as ClaimContactRole).Contact.AllContactContacts.length > 0) and 
        ((moreNamedInsured as ClaimContactRole).Contact.getContactContactsByRelationship("morenamedinsureddba").length > 0 and 
        (moreNamedInsuredDBA as ClaimContactRole).Contact == (moreNamedInsured as ClaimContactRole).Contact.getContactContactsByRelationship("morenamedinsureddba")[0].SourceContact)){
          coveredPartyRoleList.add( moreNamedInsuredDBA );
        }
      }
    }

    for(moreNamedInsuredDBA in moreNamedInsuredDBAList){
      if(!exists(ccr in coveredPartyRoleList where ccr == moreNamedInsuredDBA)){
        coveredPartyRoleList.add( moreNamedInsuredDBA );
      }
    }  
    return (coveredPartyRoleList.toArray() as ClaimContactRole[])
  }

  function getNonMNICoveredParties():ClaimContactRole[]{
    var coveredPartyList : List = new ArrayList();
  
    for(cont in this.getClaimContactsByRole( "coveredparty" )){
      if(!exists(role in cont.Roles where role.CoveredPartyType == "addnlnameinsured" || role.CoveredPartyType == "morenameinsureddba")){
        for(role in cont.Roles){
          if(role.Role == "coveredparty" && role.CoveredPartyType != "addnlnameinsured" && role.CoveredPartyType != "morenameinsureddba"){
            coveredPartyList.add( role )
          }
        }
      }
    }
    return (coveredPartyList.toArray() as ClaimContactRole[])
  }

  function addMNIClaimContact(){
    var CCR : ClaimContactRole;
    CCR = this.addEmptyRole( "coveredparty" );
    CCR.CoveredPartyType = "addnlnameinsured";
    //changed to logging in Debug - SR
    Logger.logDebug("Added MNIClaimContact: " + CCR.Role + ":" + CCR.CoveredPartyType )
  }

  /*
  * Filters mobile app unverified policy reasons out of the options available
  * for the end user to select when creating/editing a claim.
  * Date: 6/3/2010
  * Defect: 3428
  * @author Zach Thomas
  */
  function filterUnverifiedPolRsn(reasonCode:String):Boolean{
    // As more mobile app reasons get added, the if condition will have to be modified to include them.
    if(reasonCode == "iphoneclaim"){
      return false;
    }else{
      return true;
    }
  }

  /*
  * Prevents mobile app unverified policy reasons from being changed on an existing claim
  * created via the mobile app.
  * Date: 6/3/2010
  * Defect: 3428
  * @author Zach Thomas
  */
  function canEditUnverifiedPolRsn():Boolean{
    // As more mobile app reasons get added, the if condition will have to be modified to include them.
    if(this.UnverifiedRsnExt == "iphoneclaim"){
      return false;
    }else{
      return true;
    }
  }

  /*
  * Stores information that can be preserved during a refresh for use in the NCW.
  * Date: 8/20/2010
  * Defect: 3583
  * @author Zach Thomas
  */
  function storeOrigPolicyContacts(){
    for(clmCont in this.Claim.Contacts){
      if(clmCont.Contact.VerifiedPolicyContactExt){

        var origVerPolContact:OrigVerPolContactExt = new OrigVerPolContactExt(this);
    
        origVerPolContact.OrigContContactEBIExt = clmCont.Contact.ContactEBIExt
        origVerPolContact.OrigContPrimaryAddressExt = clmCont.Contact.PrimaryAddress.DisplayName;
        origVerPolContact.OrigContWorkPhoneExt = clmCont.Contact.WorkPhone;
        origVerPolContact.OrigContFaxPhoneExt = clmCont.Contact.FaxPhone;
        origVerPolContact.OrigContEmailAddress1Ext = clmCont.Contact.EmailAddress1;
        origVerPolContact.OrigContEmailAddress2Ext = clmCont.Contact.EmailAddress2;
        origVerPolContact.OrigContTollFreeNumberExt = clmCont.Contact.TollFreeNumberExt;
        origVerPolContact.OrigContContactPersonExt = clmCont.Contact.ContactPersonExt;
        origVerPolContact.OrigContTaxIDExt = clmCont.Contact.TaxID;
        if(clmCont.Contact.Ex_TaxStatusCode != null){
          origVerPolContact.OrigContEx_TaxStatusCode = clmCont.Contact.Ex_TaxStatusCode;
        }
        if(clmCont.Contact typeis Person){
          if(clmCont.Person.DateOfBirth != null){
            origVerPolContact.OrigContDateOfBirthExt = clmCont.Person.DateOfBirth.toString();
          }
          origVerPolContact.OrigContGenderExt = clmCont.Person.Gender.DisplayName;
          origVerPolContact.OrigContHICNExt = clmCont.Person.HICNExt;
          origVerPolContact.OrigContMedicareEligibleExt = clmCont.Person.MedicareEligibleExt;
          origVerPolContact.OrigContSendPartyToCMSExt = clmCont.Person.SendPartyToCMSExt;
          origVerPolContact.OrigContLegalFNameExt = clmCont.Person.LegalFNameExt;
          origVerPolContact.OrigContLegalLNameExt = clmCont.Person.LegalLNameExt;
          origVerPolContact.OrigContLegalMNameExt = clmCont.Person.LegalMNameExt;
        }
        this.addToOrigVerifiedPolContactsExt( origVerPolContact );    
      }
    }  
  }
}
