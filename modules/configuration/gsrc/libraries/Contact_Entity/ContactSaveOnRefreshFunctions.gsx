package libraries.Contact_Entity

enhancement ContactSaveOnRefreshFunctions : entity.Contact {
  /*
  *  To allow certain fields on a Verified Policy (contact updates) to
  *  be updated by ClaimCenter and not replace these when an automated process updates, i.e. PRM nightly updates
  *  Sprint/Maintenance Release:Foundation Sprint 5 
  *  Author: Eric Rawe
  *  Date: 3/5/09
  */
  function modifiedFieldNames(claim:Claim) {
    var usermodifiedentry:UserModifiedFieldExt
    var originalContact :Contact = (this.OriginalVersion as Contact);
    var originalAddress : Address = (this.PrimaryAddress.OriginalVersion as Address);
   
  if(!(originalContact typeis ex_Agency)){
  
    if(originalContact != null and originalContact.DisplayName != ""){
      if(originalContact.WorkPhone != this.WorkPhone 
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_WORKPHONE)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_WORKPHONE
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      if(originalContact.FaxPhone != this.FaxPhone 
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_FAXPHONE)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_FAXPHONE
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      if(originalContact.HomePhone != this.HomePhone 
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_HOMEPHONE)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_HOMEPHONE
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      if(originalContact.CellPhoneExt != this.CellPhoneExt 
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_CELLPHONE)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_CELLPHONE
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      if(originalContact.EmailAddress1 != this.EmailAddress1 
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_EMAILADDRESS1)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_EMAILADDRESS1
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      if(originalContact.EmailAddress2 != this.EmailAddress2 
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_EMAILADDRESS2)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_EMAILADDRESS2
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      if(originalContact.TollFreeNumberExt != this.TollFreeNumberExt 
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_TOLLFREENUMBER)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_TOLLFREENUMBER
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      if(originalContact.PrimaryPhone != this.PrimaryPhone
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_PRIMARYPHONE)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_PRIMARYPHONE
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      if(originalContact.ContactPersonExt != this.ContactPersonExt
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_PRIMARYCONTACT)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_PRIMARYCONTACT
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      if(originalContact.Ex_TaxStatusCode != this.Ex_TaxStatusCode
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_TAXSTATUS)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_TAXSTATUS
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      if(originalContact.Ex_TaxReportingName != this.Ex_TaxReportingName
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_TAXREPORTINGNAME)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_TAXREPORTINGNAME
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      if(originalContact.TaxID != this.TaxID
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_TAXID)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_TAXID
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      //Person specific fields
      if(originalContact typeis Person){
        if(originalContact.Person.DateOfBirth != this.Person.DateOfBirth
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_DATEOFBIRTH)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_DATEOFBIRTH
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.DateOfDeathExt != this.Person.DateOfDeathExt
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_DATEOFDEATH)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_DATEOFDEATH
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.Gender != this.Person.Gender
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_GENDER)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_GENDER
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.MaritalStatus != this.Person.MaritalStatus
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_MARITALSTATUS)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_MARITALSTATUS
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.HICNExt != this.Person.HICNExt
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_HICN)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_HICN
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.MedicareEligibleExt != this.Person.MedicareEligibleExt
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_MEDICAREELIGIBLEFLAG)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_MEDICAREELIGIBLEFLAG
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.SendPartyToCMSExt != this.Person.SendPartyToCMSExt
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_SENDPARTYTOCMSFLAG)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_SENDPARTYTOCMSFLAG
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.LegalFNameExt != this.Person.LegalFNameExt
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_LEGALFIRSTNAME)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_LEGALFIRSTNAME
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.LegalLNameExt != this.Person.LegalLNameExt
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_LEGALLASTNAME)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_LEGALLASTNAME
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.LegalMNameExt != this.Person.LegalMNameExt
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_LEGALMIDDLENAME)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_LEGALMIDDLENAME
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.StopSendPartyToCMSExt != this.Person.StopSendPartyToCMSExt
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_STOPQUERYTOCMSFLAG)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_STOPQUERYTOCMSFLAG
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.LicenseNumber != this.Person.LicenseNumber
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_LICENSENUMBER)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_LICENSENUMBER
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.LicenseState != this.Person.LicenseState
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_LICENSESTATE)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_LICENSESTATE
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
        if(originalContact.Person.Occupation != this.Person.Occupation
        and !exists(modifiedfield in this.UserModifiedFieldsExt 
        where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_OCCUPATION)
        and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
          usermodifiedentry = new UserModifiedFieldExt()
            usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_OCCUPATION
            this.addToUserModifiedFieldsExt(usermodifiedentry)
        }
      }
    }
  /* Added code for defect 7530 for replacing the address only for Producer
  */
    if(originalAddress != null and originalAddress.DisplayName != ""  and !((originalContact typeis ex_Agency))) {
      if(originalAddress.DisplayName != this.PrimaryAddress.DisplayName
      and !exists(modifiedfield in this.UserModifiedFieldsExt where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_PRIMARYADDRESS)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft")))
      {
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_PRIMARYADDRESS
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }  
  
      if((originalContact.PrimaryAddress.Country != this.PrimaryAddress.Country or
      originalContact.PrimaryAddress.AddressType != this.PrimaryAddress.AddressType or
      originalContact.PrimaryAddress.AddressLine1 != this.PrimaryAddress.AddressLine1 or
      originalContact.PrimaryAddress.AddressLine2 != this.PrimaryAddress.AddressLine2 or
      originalContact.PrimaryAddress.City != this.PrimaryAddress.City or
      originalContact.PrimaryAddress.State != this.PrimaryAddress.State or
      originalContact.PrimaryAddress.PostalCode != this.PrimaryAddress.PostalCode or
      originalContact.PrimaryAddress.County != this.PrimaryAddress.County or
      originalContact.PrimaryAddress.Description != this.PrimaryAddress.Description) and    
      !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_PRIMARYADDRESS)
      and (originalContact.VerifiedPolicyContactExt or (originalContact.VerifiedPolicyContactExt == "" and claim.State == "draft"))){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_PRIMARYADDRESS
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
   }
}
  }

  /*
  *  To allow certain fields on a Verified Policy during the New Claim Wizard (contact updates) to
  *  be updated by ClaimCenter and not replace these when an automated process updates, i.e. PRM nightly updates
  *  Sprint/Maintenance Release:Foundation Sprint 5 
  *  Author: Zach Thomas
  *  Date: 6/24/10
  *  Updated: 8/24/10 - Made changes to use new OrigVerifiedPolContactsExt array to compare for chagnes.
  */
  function modifiedFieldNamesNCW(claim:Claim) {
    var usermodifiedentry:UserModifiedFieldExt

    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
    and origPolCont.OrigContWorkPhoneExt != this.WorkPhone)
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_WORKPHONE)
    and this.VerifiedPolicyContactExt){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_WORKPHONE
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }
    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
    and origPolCont.OrigContFaxPhoneExt != this.FaxPhone)
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_FAXPHONE)
    and (this.VerifiedPolicyContactExt)){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_FAXPHONE
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }
    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
    and origPolCont.OrigContHomePhoneExt != this.HomePhone)
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_HOMEPHONE)
    and (this.VerifiedPolicyContactExt)){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_HOMEPHONE
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }
    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
    and origPolCont.OrigContCellPhoneExt != this.CellPhoneExt)
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_CELLPHONE)
    and (this.VerifiedPolicyContactExt)){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_CELLPHONE
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }
    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
    and origPolCont.OrigContPrimaryPhoneExt != this.PrimaryPhone)
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_PRIMARYPHONE)
    and (this.VerifiedPolicyContactExt)){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_PRIMARYPHONE
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }
    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
    and origPolCont.OrigContEmailAddress1Ext != this.EmailAddress1) 
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_EMAILADDRESS1)
    and this.VerifiedPolicyContactExt){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_EMAILADDRESS1
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }
    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
    and origPolCont.OrigContEmailAddress2Ext != this.EmailAddress2) 
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_EMAILADDRESS2)
    and this.VerifiedPolicyContactExt){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_EMAILADDRESS2
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }
    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
    and origPolCont.OrigContTollFreeNumberExt != this.TollFreeNumberExt) 
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_TOLLFREENUMBER)
    and this.VerifiedPolicyContactExt){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_TOLLFREENUMBER
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }

    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
    and origPolCont.OrigContContactPersonExt != this.ContactPersonExt)
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_PRIMARYCONTACT)
    and this.VerifiedPolicyContactExt){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_PRIMARYCONTACT
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }

    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
    and origPolCont.OrigContPrimaryAddressExt != this.PrimaryAddress)
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_PRIMARYADDRESS)
    and this.VerifiedPolicyContactExt){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_PRIMARYADDRESS
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }    
  
    /**************************************************/
    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContTaxIDExt != this.TaxID)
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_TAXID)
    and this.VerifiedPolicyContactExt){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_TAXID
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }
  
    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContEx_TaxStatusCode != this.Ex_TaxStatusCode)
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_TAXSTATUS)
    and this.VerifiedPolicyContactExt){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_TAXSTATUS
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }
    
    if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContTaxReportingNameExt != this.Ex_TaxReportingName)
    and !exists(modifiedfield in this.UserModifiedFieldsExt 
    where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_TAXREPORTINGNAME)
    and this.VerifiedPolicyContactExt){
      usermodifiedentry = new UserModifiedFieldExt()
        usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_TAXREPORTINGNAME
        this.addToUserModifiedFieldsExt(usermodifiedentry)
    }
  
    // Person specific fields
    if(this typeis Person){
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContDateOfBirthExt != this.Person.DateOfBirth)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_DATEOFBIRTH)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_DATEOFBIRTH
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.origContDateOfDeathExt != this.Person.DateOfDeathExt)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_DATEOFDEATH)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_DATEOFDEATH
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
  
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContGenderExt != this.Person.Gender)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_GENDER)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_GENDER
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContMaritalStatusExt != this.Person.MaritalStatus)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_MARITALSTATUS)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_MARITALSTATUS
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContOccupationExt != this.Person.Occupation)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_OCCUPATION)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_OCCUPATION
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContLicenseNumberExt != this.Person.LicenseNumber)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_LICENSENUMBER)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_LICENSENUMBER
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
      
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContLicenseStateExt != this.Person.LicenseState)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_LICENSESTATE)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_LICENSESTATE
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
  
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContMedicareEligibleExt != this.Person.MedicareEligibleExt)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_MEDICAREELIGIBLEFLAG)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_MEDICAREELIGIBLEFLAG
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
  
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContSendPartyToCMSExt != this.Person.SendPartyToCMSExt)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_SENDPARTYTOCMSFLAG)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_SENDPARTYTOCMSFLAG
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
  
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContHICNExt != this.Person.HICNExt)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_HICN)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_HICN
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
  
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContLegalFNameExt != this.Person.LegalFNameExt)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_LEGALFIRSTNAME)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_LEGALFIRSTNAME
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
  
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContLegalLNameExt != this.Person.LegalLNameExt)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_LEGALLASTNAME)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_LEGALLASTNAME
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
  
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContLegalMNameExt != this.Person.LegalMNameExt)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_LEGALMIDDLENAME)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_LEGALMIDDLENAME
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
    
      if(exists(origPolCont in claim.Policy.OrigVerifiedPolContactsExt where origPolCont.OrigContContactEBIExt == this.ContactEBIExt 
      and origPolCont.OrigContStopSendToCMSExt != this.Person.StopSendPartyToCMSExt)
      and !exists(modifiedfield in this.UserModifiedFieldsExt 
      where modifiedfield.ModifiedFieldNamesExt == ModifiedFieldNamesExt.TC_STOPQUERYTOCMSFLAG)
      and this.VerifiedPolicyContactExt){
        usermodifiedentry = new UserModifiedFieldExt()
          usermodifiedentry.ModifiedFieldNamesExt = ModifiedFieldNamesExt.TC_STOPQUERYTOCMSFLAG
          this.addToUserModifiedFieldsExt(usermodifiedentry)
      }
    }
  }  
}
