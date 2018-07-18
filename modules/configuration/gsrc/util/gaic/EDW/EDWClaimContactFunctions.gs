package util.gaic.EDW;
uses templates.messaging.edw.PartyDataEDW
uses templates.messaging.edw.PartyOfficialDataEDW
uses templates.messaging.edw.PartyCSCIDataEDW
uses templates.messaging.edw.PartyRoleCSCIDataEDW
uses templates.messaging.edw.PartyUserDataEDW
uses gaic.conversion.util.ConversionStatusChecker
uses gw.policy.RefreshPolicyParallel

class EDWClaimContactFunctions {
  
  private construct() {
  }
  
  static function getInstance() : EDWClaimContactFunctions {
    return new EDWClaimContactFunctions();
  }
  
  function sendClaimContactAdded(messageContext : MessageContext, ccontact : ClaimContact) {
       // do not send EDW messages if policy is refreshed from batch process 
    var claim=ccontact.Claim
    if (claim != null and RefreshPolicyParallel.wasClaimRefreshedFromBatchRefreshPolicy(claim.ID)) {
      return
    } 
 
    var fnd = "false";
    var vendorPublicID = "";
    var partyrole = "";
    var reltoparty = "";
    var vendorCSCIStatus = "";
    
    if (ccontact.Contact typeis CompanyVendor || ccontact.Contact typeis PersonVendor) {
      vendorCSCIStatus = getClaimContactCSCIStatus(ccontact);
      if (ccontact.Contact.AddressBookUID != null) {  
          vendorPublicID = ccontact.Contact.AddressBookUID;
      } else { 
          vendorPublicID = ccontact.Contact.PublicID; 
      }
    }
    if (ccontact.Contact.VerifiedPolicyContactExt) {
      for (r in ccontact.Roles) {
        if (r.Policy == null) {
          fnd = "true";
        }
      }
      if (fnd == "false") {
        if (ccontact.Contact.AllContactContacts != null && ccontact.Contact.AllContactContacts.length > 0) {
            fnd = "true";
        }
      }
      if (fnd == "true") {
        createClaimContactPayload(messageContext, ccontact, "A");
        if (vendorCSCIStatus == "A") {
           createVendorCSCIPayload(messageContext, ccontact, vendorCSCIStatus)
           partyrole = "<Role><Code>claimspecificcontact</Code><Description>Claim Specific Contact</Description><ListName>ContactRole</ListName></Role>";
           reltoparty = "<PartyRelTo><PublicID>"+ccontact.Claim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>";
           createVenCSCIRolePayload(messageContext, ccontact, partyrole, reltoparty, vendorCSCIStatus)
           partyrole = "<Role><Code>cscinformation</Code><Description>Claim Specific Contact Info</Description><ListName>PersonRelationType</ListName></Role>"
           reltoparty = "<PartyRelTo><PublicID>"+vendorPublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>";
           createVenCSCIRolePayload(messageContext, ccontact, partyrole, reltoparty, vendorCSCIStatus)
        }
      }
    } else {
      createClaimContactPayload(messageContext, ccontact, "A");
      if (vendorCSCIStatus == "A") {
         createVendorCSCIPayload(messageContext, ccontact, vendorCSCIStatus)
         partyrole = "<Role><Code>claimspecificcontact</Code><Description>Claim Specific Contact</Description><ListName>ContactRole</ListName></Role>";
         reltoparty = "<PartyRelTo><PublicID>"+ccontact.Claim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>";
         createVenCSCIRolePayload(messageContext, ccontact, partyrole, reltoparty, vendorCSCIStatus)
         partyrole = "<Role><Code>cscinformation</Code><Description>Claim Specific Contact Info</Description><ListName>PersonRelationType</ListName></Role>"
         reltoparty = "<PartyRelTo><PublicID>"+vendorPublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>";
         createVenCSCIRolePayload(messageContext, ccontact, partyrole, reltoparty, vendorCSCIStatus)
      }
    }
  }  

  function sendClaimContactChanged(messageContext : MessageContext, ccontact : ClaimContact) {
    var fnd = "false";
    var vendorPublicID = "";
    var partyrole = "";
    var reltoparty = "";
    var vendorCSCIStatus = "";
    // do not send EDW messages if policy is refreshed from batch process 
    var claim=ccontact.Claim
    if (claim != null and RefreshPolicyParallel.wasClaimRefreshedFromBatchRefreshPolicy(claim.ID)) {
      return
    } 
    if (messageContext.EventName == "ClaimContactChanged" and ccontact.Contact.Changed) {
      return
    }
    if (messageContext.EventName == "ClaimContactContactChanged" and (ConversionStatusChecker.isCurrentlyinManualSync(ccontact.Contact.LoadCommandID, ccontact.Contact.UpdateUser))) {
      return
    }  
    if (ccontact.Contact typeis CompanyVendor || ccontact.Contact typeis PersonVendor) {
      vendorCSCIStatus = getClaimContactCSCIStatus(ccontact);
      if (ccontact.Contact.AddressBookUID != null) {  
          vendorPublicID = ccontact.Contact.AddressBookUID;
      } else { 
          vendorPublicID = ccontact.Contact.PublicID; 
      }
    }
  
    if (ccontact.Contact.VerifiedPolicyContactExt) {
      for (r in ccontact.Roles) {
        if (r.Policy == null) {
          fnd = "true";
        }
      }
      if (fnd == "false") {
        if (ccontact.Contact.AllContactContacts != null && ccontact.Contact.AllContactContacts.length > 0) {
           fnd = "true";     
        }
      }
      if (fnd == "true") {
        createClaimContactPayload(messageContext, ccontact, "C");
        if (vendorCSCIStatus == "A") {
          createVendorCSCIPayload(messageContext, ccontact, vendorCSCIStatus)
          partyrole = "<Role><Code>claimspecificcontact</Code><Description>Claim Specific Contact</Description><ListName>ContactRole</ListName></Role>";
          reltoparty = "<PartyRelTo><PublicID>"+ccontact.Claim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>";
          createVenCSCIRolePayload(messageContext, ccontact, partyrole, reltoparty, vendorCSCIStatus)
          partyrole = "<Role><Code>cscinformation</Code><Description>Claim Specific Contact Info</Description><ListName>PersonRelationType</ListName></Role>"
          reltoparty = "<PartyRelTo><PublicID>"+vendorPublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>";
          createVenCSCIRolePayload(messageContext, ccontact, partyrole, reltoparty, vendorCSCIStatus)
        } else 
            if (vendorCSCIStatus == "C" or vendorCSCIStatus == "D") {
               createVendorCSCIPayload(messageContext, ccontact, vendorCSCIStatus)
            }      
      }
    } else {
      createClaimContactPayload(messageContext, ccontact, "C");
      if (vendorCSCIStatus == "A") {
          createVendorCSCIPayload(messageContext, ccontact, vendorCSCIStatus)
          partyrole = "<Role><Code>claimspecificcontact</Code><Description>Claim Specific Contact</Description><ListName>ContactRole</ListName></Role>";
          reltoparty = "<PartyRelTo><PublicID>"+ccontact.Claim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>";
          createVenCSCIRolePayload(messageContext, ccontact, partyrole, reltoparty, vendorCSCIStatus)
          partyrole = "<Role><Code>cscinformation</Code><Description>Claim Specific Contact Info</Description><ListName>PersonRelationType</ListName></Role>"
          reltoparty = "<PartyRelTo><PublicID>"+vendorPublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>";
          createVenCSCIRolePayload(messageContext, ccontact, partyrole, reltoparty, vendorCSCIStatus)
      } else 
          if (vendorCSCIStatus == "C" or vendorCSCIStatus == "D") {
              createVendorCSCIPayload(messageContext, ccontact, vendorCSCIStatus)
          }  
    }            
  }
  
  
  function sendClaimContactMainChanged(messageContext : MessageContext, ccontact : ClaimContact) {
    var fnd = "false";
    var vendorPublicID = "";
    var partyrole = "";
    var reltoparty = "";
    var vendorCSCIStatus = "";
     // do not send EDW messages if policy is refreshed from batch process 
    var claim=ccontact.Claim
    if (claim != null and RefreshPolicyParallel.wasClaimRefreshedFromBatchRefreshPolicy(claim.ID)) {
      return
    }    
    if (messageContext.EventName == "ClaimContactChanged" and ccontact.Contact.Changed) {
      return
    }
    if (ccontact.Contact typeis CompanyVendor || ccontact.Contact typeis PersonVendor) {
      vendorCSCIStatus = getClaimContactCSCIStatus(ccontact);
      if (ccontact.Contact.AddressBookUID != null) {  
          vendorPublicID = ccontact.Contact.AddressBookUID;
      } else { 
          vendorPublicID = ccontact.Contact.PublicID; 
      }
    }
  
    if (ccontact.Contact.VerifiedPolicyContactExt) {
      for (r in ccontact.Roles) {
        if (r.Policy == null) {
          fnd = "true";
        }
      }
      if (fnd == "false") {
        if (ccontact.Contact.AllContactContacts != null && ccontact.Contact.AllContactContacts.length > 0) {
           fnd = "true";     
        }
      }
      if (fnd == "true") {
        if (vendorCSCIStatus == "A") {
          createVendorCSCIPayload(messageContext, ccontact, vendorCSCIStatus)
          partyrole = "<Role><Code>claimspecificcontact</Code><Description>Claim Specific Contact</Description><ListName>ContactRole</ListName></Role>";
          reltoparty = "<PartyRelTo><PublicID>"+ccontact.Claim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>";
          createVenCSCIRolePayload(messageContext, ccontact, partyrole, reltoparty, vendorCSCIStatus)
          partyrole = "<Role><Code>cscinformation</Code><Description>Claim Specific Contact Info</Description><ListName>PersonRelationType</ListName></Role>"
          reltoparty = "<PartyRelTo><PublicID>"+vendorPublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>";
          createVenCSCIRolePayload(messageContext, ccontact, partyrole, reltoparty, vendorCSCIStatus)
        } else 
            if (vendorCSCIStatus == "C" or vendorCSCIStatus == "D") {
               createVendorCSCIPayload(messageContext, ccontact, vendorCSCIStatus)
            }      
      }
    } else {
      if (vendorCSCIStatus == "A") {
          createVendorCSCIPayload(messageContext, ccontact, vendorCSCIStatus)
          partyrole = "<Role><Code>claimspecificcontact</Code><Description>Claim Specific Contact</Description><ListName>ContactRole</ListName></Role>";
          reltoparty = "<PartyRelTo><PublicID>"+ccontact.Claim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>";
          createVenCSCIRolePayload(messageContext, ccontact, partyrole, reltoparty, vendorCSCIStatus)
          partyrole = "<Role><Code>cscinformation</Code><Description>Claim Specific Contact Info</Description><ListName>PersonRelationType</ListName></Role>"
          reltoparty = "<PartyRelTo><PublicID>"+vendorPublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>";
          createVenCSCIRolePayload(messageContext, ccontact, partyrole, reltoparty, vendorCSCIStatus)
      } else 
          if (vendorCSCIStatus == "C" or vendorCSCIStatus == "D") {
              createVendorCSCIPayload(messageContext, ccontact, vendorCSCIStatus)
          }  
    }            
  }
  
  // def 1790 - send contact remove in order to remove the relationship with the claim
  function sendClaimContactRemoved(messageContext : MessageContext, ccontact : ClaimContact) {
      // do not send EDW messages if policy is refreshed from batch process 
    var claim=ccontact.Claim
    if (claim != null and RefreshPolicyParallel.wasClaimRefreshedFromBatchRefreshPolicy(claim.ID)) {
      return
    } 
    var fnd = "false";
    if (ccontact.Contact.VerifiedPolicyContactExt) {
      for (r in ccontact.Roles) {
        if (r.Policy == null) {
          fnd = "true";
        }
      }
      if (fnd == "true") {
        createClaimContactPayload(messageContext, ccontact, "D");
        if ((ccontact.Contact typeis CompanyVendor || ccontact.Contact typeis PersonVendor) and
            (ccontact.claimSpecificContactExt != null) or
            (ccontact.cscCellPhoneExt != null) or
            (ccontact.cscEmail1Ext != null) or
            (ccontact.cscEmail2Ext != null) or
            (ccontact.cscFaxPhoneExt != null) or
            (ccontact.cscHomePhoneExt != null) or
            (ccontact.cscPrimaryPhoneExt != null) or
            (ccontact.cscTollFreeNumberExt != null) or
            (ccontact.cscWorkPhoneExt != null)) { 
                createVendorCSCIPayload(messageContext, ccontact, "D")
        }
      }
    } else {
      createClaimContactPayload(messageContext, ccontact, "D");
      if ((ccontact.Contact typeis CompanyVendor || ccontact.Contact typeis PersonVendor) and
          (ccontact.claimSpecificContactExt != null) or
          (ccontact.cscCellPhoneExt != null) or
          (ccontact.cscEmail1Ext != null) or
          (ccontact.cscEmail2Ext != null) or
          (ccontact.cscFaxPhoneExt != null) or
          (ccontact.cscHomePhoneExt != null) or
          (ccontact.cscPrimaryPhoneExt != null) or
          (ccontact.cscTollFreeNumberExt != null) or
          (ccontact.cscWorkPhoneExt != null)) { 
              createVendorCSCIPayload(messageContext, ccontact, "D")
      }
    }
  }
  
    // test if claim specific contact information changed for a claimcontact
  protected function getClaimContactCSCIStatus( ccontact : ClaimContact) : String {
    if (ccontact.New) {  
       if ((ccontact.claimSpecificContactExt != null) or
           (ccontact.cscCellPhoneExt != null) or
           (ccontact.cscEmail1Ext != null) or
           (ccontact.cscEmail2Ext != null) or
           (ccontact.cscFaxPhoneExt != null) or
           (ccontact.cscHomePhoneExt != null) or
           (ccontact.cscPrimaryPhoneExt != null) or
           (ccontact.cscTollFreeNumberExt != null) or
           (ccontact.cscWorkPhoneExt != null)) {
          return "A"
       } else {
          return "nochange"
         }
    }

    if (isClaimContactCSCIChanged(ccontact)) {
      var origCContact = ccontact.OriginalVersion as ClaimContact;
      if ((origCContact.claimSpecificContactExt == null) and
          (origCContact.cscCellPhoneExt == null) and
          (origCContact.cscEmail1Ext == null) and
          (origCContact.cscEmail2Ext == null) and
          (origCContact.cscFaxPhoneExt == null) and
          (origCContact.cscHomePhoneExt == null) and
          (origCContact.cscPrimaryPhoneExt == null) and
          (origCContact.cscTollFreeNumberExt == null) and
          (origCContact.cscWorkPhoneExt == null))  {
          return "A";
      } else {
        
          if ((ccontact.claimSpecificContactExt == null) and
              (ccontact.cscCellPhoneExt == null) and
              (ccontact.cscEmail1Ext == null) and
              (ccontact.cscEmail2Ext == null) and
              (ccontact.cscFaxPhoneExt == null) and
              (ccontact.cscHomePhoneExt == null) and
              (ccontact.cscPrimaryPhoneExt == null) and
              (ccontact.cscTollFreeNumberExt == null) and
              (ccontact.cscWorkPhoneExt == null)) {
                 return "D";
          } else {
              return "C";
          }
      }
    } else {
        return "nochange";
    }
  }
 
    // test if claim specific contact information changed for a claimcontact
  protected function isClaimContactCSCIChanged( ccontact : ClaimContact) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(ccontact, new String[] { "claimSpecificContactExt",
    "cscCellPhoneExt", "cscEmail1Ext", "cscEmail2Ext", "cscFaxPhoneExt", "cscHomePhoneExt",
      "cscPrimaryPhoneExt", "cscTollFreeNumberExt", "cscWorkPhoneExt"})) {
      return true;
    }
    return false;
  }
  
  protected function createClaimContactPayload(messageContext : MessageContext, ccontact : ClaimContact, objStatus : String) {
    var templateData = PartyDataEDW.renderToString("", ccontact.Contact, objStatus, ccontact.Claim);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  }
  
  protected function createOfficialPayload(messageContext : MessageContext, theofficial : Official, objStatus : String) {
    var templateData = PartyOfficialDataEDW.renderToString("off:", theofficial, objStatus, theofficial.Claim.PublicID);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  }
  
  protected function createVendorCSCIPayload(messageContext : MessageContext, ccontact : ClaimContact, objStatus : String) {
    var CSCPublicID = "";
    CSCPublicID = "csci|"+ccontact.Claim.PublicID+"|";
    var templateData = PartyCSCIDataEDW.renderToString(CSCPublicID, ccontact, objStatus);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  }
  
  protected function createVenCSCIRolePayload(messageContext : MessageContext, ccontact : ClaimContact,
  partyrole : String, reltoparty: String, objStatus : String) {
    var CSCPublicID = "";
    CSCPublicID = "csci|"+ccontact.Claim.PublicID+"|";
    var templateData = PartyRoleCSCIDataEDW.renderToString(CSCPublicID, ccontact, partyrole, reltoparty, objStatus, ccontact.Claim.PublicID);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  }
    
  protected function createUserPayload(messageContext : MessageContext, theUser : User, theClaim: Claim, objStatus : String) {
    var templateData = PartyUserDataEDW.renderToString(theUser, objStatus, theClaim);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  }
}