package util.custom_Ext;
uses gw.api.util.Logger //Added for logging in Debug - SR

class PolicyRefreshFunctions
{
  construct()
  {
  }
  
  /*
  Function compares oldContact and newContact to see if they meet the matching contact criteria.
  Sprint/Maintenance Release: EM 12 - Defect 465
  Author: Zach Thomas
  Date: 01/09/2009
  */
 public static function isMatchingContact(oldContact : ClaimContact, newContact : ClaimContact) : Boolean{
    var matchingContact : Boolean = false;
    
    if((oldContact.Contact.ContactEBIExt==null || oldContact.Contact.ContactEBIExt=="") ||
       (newContact.Contact.ContactEBIExt==null || newContact.Contact.ContactEBIExt=="")){
      if(oldContact.Contact typeis Person and newContact.Contact typeis Person){
        if(((oldContact.Contact.TaxID != null and newContact.Contact.TaxID != null and oldContact.Contact.TaxID == newContact.Contact.TaxID) or oldContact.Contact.TaxID == null and newContact.Contact.TaxID == null) and
        (oldContact.Contact.FirstName != null and newContact.Contact.FirstName != null and oldContact.Contact.FirstName.toLowerCase().trim().equals(newContact.Contact.FirstName.toLowerCase().trim()) or
        oldContact.Contact.FirstName == null and newContact.Contact.FirstName == null) and
        oldContact.Contact.LastName != null and newContact.Contact.LastName != null and oldContact.Contact.LastName.toLowerCase().trim().equals(newContact.Contact.LastName.toLowerCase().trim()) and
        (oldContact.PublicID != newContact.PublicID or (oldContact.PublicID == null and newContact.PublicID == null and oldContact != newContact))){
          matchingContact = true;
        }
      }
      if(oldContact.Contact typeis Company and newContact.Contact typeis Company){
        if(((oldContact.Contact.TaxID != null and newContact.Contact.TaxID != null and oldContact.Contact.TaxID == newContact.Contact.TaxID) or oldContact.Contact.TaxID == null and newContact.Contact.TaxID == null) and
        oldContact.Contact.Name != null and newContact.Contact.Name != null and oldContact.Contact.Name.toLowerCase().trim().equals(newContact.Contact.Name.toLowerCase().trim()) and
        (oldContact.PublicID != newContact.PublicID or (oldContact.PublicID == null and newContact.PublicID == null and oldContact != newContact))){
          matchingContact = true;
        }
      }
    } else {
      if(oldContact.Contact.ContactEBIExt==newContact.Contact.ContactEBIExt){
        matchingContact = true;
      }
    }
        
    return matchingContact;
  }
  
  // 7/18/13 - kniese Used in mergeContacts to compare an old related contact and a new related contact
  public static function isMatchingRelatedContact(oldContact : Contact, newContact : Contact) : Boolean{
    var matchingContact : Boolean = false;
    
    if((oldContact.ContactEBIExt==null || oldContact.ContactEBIExt=="") ||
       (newContact.ContactEBIExt==null || newContact.ContactEBIExt=="")){
      if(oldContact typeis Person and newContact typeis Person){
        if(((oldContact.TaxID != null and newContact.TaxID != null and oldContact.TaxID == newContact.TaxID) or oldContact.TaxID == null and newContact.TaxID == null) and
        (oldContact.FirstName != null and newContact.FirstName != null and oldContact.FirstName.toLowerCase().trim().equals(newContact.FirstName.toLowerCase().trim()) or
        oldContact.FirstName == null and newContact.FirstName == null) and
        oldContact.LastName != null and newContact.LastName != null and oldContact.LastName.toLowerCase().trim().equals(newContact.LastName.toLowerCase().trim())
        and (oldContact.PublicID != newContact.PublicID or (oldContact.PublicID == null and newContact.PublicID == null and oldContact != newContact))){
        
          matchingContact = true;
        }
      }
       if(oldContact typeis Company and newContact typeis Company){
        if(((oldContact.TaxID != null and newContact.TaxID != null and oldContact.TaxID == newContact.TaxID) or oldContact.TaxID == null and newContact.TaxID == null) and
        oldContact.Name != null and newContact.Name != null and oldContact.Name.toLowerCase().trim().equals(newContact.Name.toLowerCase().trim()) and
        (oldContact.PublicID != newContact.PublicID or (oldContact.PublicID == null and newContact.PublicID == null and oldContact != newContact))){
          matchingContact = true;
        }
      }
    } else {
      if(oldContact.ContactEBIExt==newContact.ContactEBIExt){
        matchingContact = true;
      }
    }
        
    return matchingContact;
  }
  
  /*
  Function merges roles from oldContact into newContact, then adds any addresses that exist on oldContact and not on newContact
  to newContact.
  Sprint/Maintenance Release: EM 12 - Defect 465
  Author: Zach Thomas
  Date: 01/09/2009
  Updated: 04/06/2009 - Add check for former role when merging duplicate contacts.  Former roles will not be merged from old contact to new contact.
  Updated: 01/28/2010 - Made changes for claimant.
  */
  static function mergeContacts(oldContact : ClaimContact, newContact : ClaimContact){
    var ccRole:ClaimContactRole;
    
    for(oldContactRole in oldContact.Roles){
      ccRole = oldContactRole;
      if(!ccRole.isFormerRole() and !ccRole.isRestrictedRole() and !exists(newContactRole in newContact.Roles where newContactRole.Role == ccRole.Role and newContactRole.getOwner() == ccRole.getOwner())){
        
        if(ccRole.Role == "claimant"){
          for(exp in oldContact.Claim.Exposures){
            if(exp.Claimant == oldContact.Contact){
              exp.Claimant = null;
              exp.Claimant = newContact.Contact;
            }
            
            
          }
        }else if(ccRole.Role == "driver"){
          for(exp in oldContact.Claim.Exposures){
            if(ccRole.getOwner() == exp){
              if(exp.DriverExt == oldContact.Contact){
                exp.DriverExt = null;
                exp.DriverExt = newContact.Contact;
              }
            }else{
              newContact.addToRoles( ccRole );
            }
          }
        }else if(ccRole.Role == "activityowner"){
          for(act in oldContact.Claim.Activities){
            if(act.ExternalOwner == oldContact.Contact){
              act.ExternalOwner = null;
              act.ExternalOwner = newContact.Contact;
            }
          }
        }else if(ccRole.Role == "VehOwnClaimOpen"){
          for(exp in oldContact.Claim.Exposures){
            if(exp.VehicleIncident.OwnLienAtAccidentExt == oldContact.Contact){
              exp.VehicleIncident.OwnLienAtAccidentExt = null;
              exp.VehicleIncident.OwnLienAtAccidentExt = newContact.Contact;
            }
          }
          newContact.addToRoles( ccRole );
        }else if(ccRole.Role == "VehOwnClaimClose"){
          for(exp in oldContact.Claim.Exposures){
            if(exp.VehicleIncident.OwnLienAtClaimCloseExt == oldContact.Contact){
              exp.VehicleIncident.OwnLienAtClaimCloseExt = null;
              exp.VehicleIncident.OwnLienAtClaimCloseExt = newContact.Contact;
            }
          }
          newContact.addToRoles( ccRole );
        }else{
          newContact.addToRoles( ccRole );
        } 
      }             
    }
        
    /* 
    * 3/12/2009 - zthomas - Foundation Sprint 5, Loop through UserModifiedFieldsExt array and copy over emailaddress1, emailaddress2
    * faxphone, contactpersonext, tollfreenumberext, workphone modified fields from oldContact to newContact during the 
    * automerge process of Policy Refresh/Select.
    */

    for(modifiedField in oldContact.Contact.UserModifiedFieldsExt){
      switch(modifiedField.ModifiedFieldNamesExt){
        case "emailaddress1":
          newContact.Contact.EmailAddress1 = oldContact.Contact.EmailAddress1;
          break;
        case "emailaddress2":
          newContact.Contact.EmailAddress2 = oldContact.Contact.EmailAddress2;
          break;
        case "faxphone":
          newContact.Contact.FaxPhone = oldContact.Contact.FaxPhone;
          break;
        case "primaryphone":
          newContact.Contact.PrimaryPhone = oldContact.Contact.PrimaryPhone;
          break;
        case "primarycontact":
          newContact.Contact.ContactPersonExt = oldContact.Contact.ContactPersonExt;
          break;
        case "tollfreenumber":
          newContact.Contact.TollFreeNumberExt = oldContact.Contact.TollFreeNumberExt;
          break;
        case "workphone":
          newContact.Contact.WorkPhone = oldContact.Contact.WorkPhone;
          break;
        case "homephone":
          newContact.Contact.HomePhone = oldContact.Contact.HomePhone;
          break;
        case "cellphone":
          newContact.Contact.CellPhoneExt = oldContact.Contact.CellPhoneExt;
          break;
        case "primaryaddress":
          if(newContact.Contact.PrimaryAddress.AddressLine1 != oldContact.Contact.PrimaryAddress.AddressLine1){
            newContact.Contact.PrimaryAddress.AddressLine1 = oldContact.Contact.PrimaryAddress.AddressLine1;
                      
          }
          if(newContact.Contact.PrimaryAddress.AddressLine2 != oldContact.Contact.PrimaryAddress.AddressLine2){
            newContact.Contact.PrimaryAddress.AddressLine2 = oldContact.Contact.PrimaryAddress.AddressLine2;
          }
          if(newContact.Contact.PrimaryAddress.AddressType != oldContact.Contact.PrimaryAddress.AddressType){
            newContact.Contact.PrimaryAddress.AddressType = oldContact.Contact.PrimaryAddress.AddressType;
          }
          if(newContact.Contact.PrimaryAddress.City != oldContact.Contact.PrimaryAddress.City){
            newContact.Contact.PrimaryAddress.City = oldContact.Contact.PrimaryAddress.City;
          }
          if(newContact.Contact.PrimaryAddress.Country != oldContact.Contact.PrimaryAddress.Country){
            newContact.Contact.PrimaryAddress.Country = oldContact.Contact.PrimaryAddress.Country;
          }
          if(newContact.Contact.PrimaryAddress.County != oldContact.Contact.PrimaryAddress.County){
            newContact.Contact.PrimaryAddress.County = oldContact.Contact.PrimaryAddress.County;
          }
          if(newContact.Contact.PrimaryAddress.Description != oldContact.Contact.PrimaryAddress.Description){
            newContact.Contact.PrimaryAddress.Description = oldContact.Contact.PrimaryAddress.Description;
          }
          if(newContact.Contact.PrimaryAddress.PostalCode != oldContact.Contact.PrimaryAddress.PostalCode){
            newContact.Contact.PrimaryAddress.PostalCode = oldContact.Contact.PrimaryAddress.PostalCode;
          }
          if(newContact.Contact.PrimaryAddress.State != oldContact.Contact.PrimaryAddress.State){
            newContact.Contact.PrimaryAddress.State = oldContact.Contact.PrimaryAddress.State;
          }
          if(newContact.Contact.PrimaryAddress.StandardizedExt != oldContact.Contact.PrimaryAddress.StandardizedExt){
            newContact.Contact.PrimaryAddress.StandardizedExt = oldContact.Contact.PrimaryAddress.StandardizedExt;
          }
          break;
        case "dateofbirth":
          if(newContact.Contact typeis Person){
            newContact.Contact.Person.DateOfBirth = oldContact.Contact.Person.DateOfBirth;
          }
          break;
       case "dateofdeath":
         if(newContact.Contact typeis Person){
           newContact.Contact.Person.DateOfDeathExt = oldContact.Contact.Person.DateOfDeathExt; 
         }
         break;
        case "gender":
          if(newContact.Contact typeis Person){
            newContact.Contact.Person.Gender = oldContact.Contact.Person.Gender
          }
          break; 
        case "taxid":
          newContact.Contact.TaxID = oldContact.Contact.TaxID
          break; 
        case "taxstatus":
          newContact.Contact.Ex_TaxStatusCode = oldContact.Contact.Ex_TaxStatusCode
          break; 
        case "taxreportingname":
          newContact.Contact.Ex_TaxReportingName = oldContact.Contact.Ex_TaxReportingName
          break;
        case "hicn":
          if(newContact.Contact typeis Person){
            newContact.Contact.Person.HICNExt = oldContact.Contact.Person.HICNExt
          }
          break; 
        case "medicareeligibleflag":
          if(newContact.Contact typeis Person){
            newContact.Contact.Person.MedicareEligibleExt = oldContact.Contact.Person.MedicareEligibleExt
          }
          break; 
        case "sendpartytocmsflag":
          if(newContact.Contact typeis Person){
            newContact.Contact.Person.SendPartyToCMSExt = oldContact.Contact.Person.SendPartyToCMSExt
          }
          break;
        case "stopquerytocmsflag":
          if(newContact.Contact typeis Person){
            newContact.Contact.Person.StopSendPartyToCMSExt = oldContact.Contact.Person.StopSendPartyToCMSExt
          }
          break;
        case "maritalstatus":
           if(newContact.Contact typeis Person){
            newContact.Contact.Person.MaritalStatus = oldContact.Contact.Person.MaritalStatus 
           }
           break;
         case "occupation":
           if(newContact.Contact typeis Person){
            newContact.Contact.Person.Occupation = oldContact.Contact.Person.Occupation
           }
           break;
         case "licensenumber":
           if(newContact.Contact typeis Person){
            newContact.Contact.Person.LicenseNumber = oldContact.Contact.Person.LicenseNumber
           }
           break;
         case "licensestate":
           if(newContact.Contact typeis Person){
            newContact.Contact.Person.LicenseState = oldContact.Contact.Person.LicenseState
           }
           break;
        default:
          break;        
      }
      if(!exists(modField in newContact.Contact.UserModifiedFieldsExt where modField.ModifiedFieldNamesExt == modifiedField.ModifiedFieldNamesExt)){
        newContact.Contact.addToUserModifiedFieldsExt( modifiedField );       
        
      }
    }
    
    // 9/10/2009 - zjthomas - Defect 2060, preserve ContactProhibited field if it has been changed.
    if(oldContact.ContactProhibited != newContact.ContactProhibited){
      newContact.ContactProhibited = oldContact.ContactProhibited;
    }
    
    for(address in oldContact.Contact.AllAddresses){
      if(address != null and !exists(address2 in newContact.Contact.AllAddresses where address2 != null and
          address.AddressLine1 == address2.AddressLine1 and
          address.AddressLine2 == address2.AddressLine2 and
          address.AddressType == address2.AddressType and 
          address.City == address2.City and 
          address.State == address2.State and
          address.PostalCode == address2.PostalCode and
          address.Country == address2.Country and
          address.County == address2.County and 
          address.Description == address2.Description)){
            
            var newAddress:Address = new Address();
            newAddress.AddressLine1 = address.AddressLine1
            newAddress.AddressLine2 = address.AddressLine2
            newAddress.AddressType = address.AddressType
            newAddress.City = address.City
            newAddress.State = address.State
            newAddress.PostalCode = address.PostalCode
            newAddress.Country = address.Country
            newAddress.County = address.County
            newAddress.Description = address.Description
           // newContact.Contact.removeAddress(newAddress );
	   // newContact.Contact.removeAddress(address);
        //  newContact.Contact.addAddress(newAddress);
           /*commented and added code to remove the old address, in
           order not to preserve the previous address -- for defect # 7530*/
        //   print(" before change :: "+newAddress.AddressLine1);
        
      //  newContact.Contact.removeAddress(address)
        
        //newContact.Contact.addAddress(newAddress)
        //   oldContact.Contact.removeAddress( address)
           
          
     if (newContact.Contact.AllAddresses!= oldContact.Contact.AllAddresses){
        oldContact.Contact.removeAddress( address)
     }
          else{
            newContact.Contact.addAddress(newAddress)
         
        }
     
          }}
           
     
    
    
  
    
    
   /* if(oldContact.Contact.HomePhone != null){
      newContact.Contact.HomePhone = oldContact.Contact.HomePhone
    }
    if(OldContact.Contact.CellPhoneExt != null){
      newContact.Contact.CellPhoneExt = oldContact.Contact.CellPhoneExt;
    }
    */
    //10/7/13 - kniese - Calls function to merge all the medicare data
    if(oldContact.Contact typeis Person && newContact.Contact typeis Person && oldContact.Contact.ContactISOMedicareExt != null)
     mergeMedicareData(oldContact, newContact)
    
    // 7/18/13 - kniese - Used to merge related contacts
    if(oldContact.Contact.TargetRelatedContacts.Count != 0){
      for(contCont in oldContact.Contact.TargetRelatedContacts){
        if(contCont.getBidiRel(contCont.SourceContact) != "morenamedinsured" and contCont.getBidiRel(contCont.SourceContact) != "morenamedinsureddba"){
          var contContRecreated = false
          for(con in oldContact.Claim.Contacts){
              if(!con.hasFormerRole() and isMatchingRelatedContact(contCont.RelatedContact, con.Contact)){
                 var newContCont = new ContactContact()
                 newContCont.Relationship = contCont.Relationship
                 newContCont.RelatedContact = con.Contact
                 if(contCont.ClaimantAddRepFlagExt)
                   newContCont.ClaimantAddRepFlagExt = true
                 if(contCont.ClaimantFlagExt)
                   newContCont.ClaimantFlagExt = true
                 if(contCont.InjuredPartyFlagExt){
                   newContCont.InjuredPartyFlagExt = true
                 }
                 contContRecreated = true
                 newContact.Contact.addToTargetRelatedContacts(newContCont)
                }
            }
          // add contacts who have a former source contact
          if(contCont.SourceContact.DisplayName.contains("(Former)") and !contContRecreated){
                 //changed to logging in Debug - SR
                 Logger.logDebug("Source Contact " + contCont.SourceContact)
                 var newContCont = new ContactContact()
                 newContCont.Relationship = contCont.Relationship
                 newContCont.RelatedContact = contCont.RelatedContact
                 if(contCont.ClaimantAddRepFlagExt)
                   newContCont.ClaimantAddRepFlagExt = true
                 if(contCont.ClaimantFlagExt)
                   newContCont.ClaimantFlagExt = true
                 if(contCont.InjuredPartyFlagExt)
                   newContCont.InjuredPartyFlagExt = true
               
                 newContact.Contact.removeFromTargetRelatedContacts(contCont)
                 newContact.Contact.addToTargetRelatedContacts(newContCont)  
                 
         }
        }
      }
    }
    
    //moved out of the userModifiedFields switch so this field is preserved even if it isn't changed...
    if(oldContact.Contact typeis Person && newContact.Contact typeis Person){
      if(oldContact.Contact.LegalFNameExt != null){
        newContact.Contact.LegalFNameExt = oldContact.Contact.LegalFNameExt
      }
      
      if(oldContact.Contact.LegalMNameExt != null){
        newContact.Contact.LegalMNameExt = oldContact.Contact.LegalMNameExt 
      }
      
      if(oldContact.Contact.LegalLNameExt != null){
        newContact.Contact.LegalLNameExt = oldContact.Contact.LegalLNameExt 
      }
    }
    
    
  }
  
 
  
  // 11/9/2012 - kniese - Create a function to call in mergeRoles for a contact that has a role of
  // claimant. This checks to see if the claimant is medicare eligible. If yes, copy the medicare
  // informtation from the old claimant to the new claimant.
  static function mergeMedicareData(oldContact : ClaimContact, newContact : ClaimContact){
   // 9/26/13 - kniese - Medicare defect - remove check for medicare eligible on refresh
   //if(oldContact.Contact.Person.MedicareEligibleExt){
     
     // Copy the medicare data thats not an array
      newContact.Contact.ContactISOMedicareExt = oldContact.Contact.ContactISOMedicareExt.shallowCopy() as ContactISOMedicareExt
     
     // copy the tpoc data
      if(oldContact.Contact.ContactISOMedicareExt.TPOCExt.Count != 0){
       for(tpoc in oldContact.Contact.ContactISOMedicareExt.TPOCExt){
        newContact.Contact.ContactISOMedicareExt.addToTPOCExt(tpoc.shallowCopy() as TPOCExt) 
       }
      }
      
      // copy the icd codes
      if(oldContact.Contact.ContactISOMedicareExt.ContactICDExt.Count != 0){
       for(icd in oldContact.Contact.ContactISOMedicareExt.ContactICDExt){
        newContact.Contact.ContactISOMedicareExt.addToContactICDExt(icd.shallowCopy() as ContactICDExt) 
       }
      }
      
      // copy the ssn override
      newContact.Contact.Person.BelowThresholdExt = oldContact.Contact.Person.BelowThresholdExt
      newContact.Contact.Person.RefuseProvideExt = oldContact.Contact.Person.RefuseProvideExt
      
      //if(oldContact.Contact.ContactISOMedicareExt != null and oldContact.Contact.ContactISOMedicareExt.TPOCExt.Count != 0){
       //for(tpoc in oldContact.Contact.ContactISOMedicareExt.TPOCExt){
        //newContact.Contact.ContactISOMedicareExt.addToTPOCExt(tpoc) 
       //}
      //}
    /* for(contCont in oldContact.Contact.TargetRelatedContacts.where(\ c -> c.ClaimantFlagExt )){
        //contCont2 = new ContactContact() 
        
        //contCont2.Relationship = contCont.Relationship
        //contCont2.RelatedContact = contCont.RelatedContact
        //contCont2.RelatedContact.DisplayName.equals("Ted")
        //mergeRelatedContacts(contCont.RelatedContact, contCont2.RelatedContact)
        contCont.SourceContact = null
        newContact.Contact.addContactContact(contCont)
      }
      for(contCont in oldContact.Contact.TargetRelatedContacts.where(\ c -> c.InjuredPartyFlagExt)){
        //contCont.SourceContact = null
        //newContact.Contact.addContactContact(contCont)
        print("injured party")
        for(con in oldContact.Claim.Contacts){ 
          
            if(!con.hasFormerRole() and isMatchingRelatedContact(contCont.RelatedContact, con.Contact)){
             var newContCont = new ContactContact()
             newContCont.Relationship = contCont.Relationship
             newContCont.RelatedContact = con.Contact
             newContCont.InjuredPartyFlagExt = true
             newContact.Contact.addToTargetRelatedContacts(newContCont) 
            }
        }
      }
      for(contCont in oldContact.Contact.TargetRelatedContacts.where(\ c -> c.ClaimantAddRepFlagExt) ){
        contCont.SourceContact = null
        newContact.Contact.addContactContact(contCont)
      }*/
    //}
  }
}
