package util.gaic.EDW;
uses templates.messaging.edw.PartyRoleDataEDW
uses templates.messaging.edw.PartyRoleOfficialDataEDW
uses templates.messaging.edw.PartyRelateDataEDW
uses templates.messaging.edw.PartyRoleUserDataEDW
uses gw.policy.RefreshPolicyParallel

class EDWClaimContactRoleFunctions {
  
  private var claimContactF = util.gaic.EDW.EDWFunctionsFactory.getClaimContactFunctions();
  
  private construct() {
  }
  
  static function getInstance() : EDWClaimContactRoleFunctions {
    return new EDWClaimContactRoleFunctions();
  }
  
  function sendClaimContactRoleChange(messageContext : MessageContext, contactrole : ClaimContactRole) {
     // do not send EDW messages if policy is refreshed from batch process 
    var claim=contactrole.ClaimContact.Claim
    if (claim != null and RefreshPolicyParallel.wasClaimRefreshedFromBatchRefreshPolicy(claim.ID)) {
      return
    } 
    var partyrole = "";
    var reltoparty ="";
    var publid = "";
    var reltotype = "";
    var sendmsg = true;
    var obstatus = "";
    var opublid = "";
    var oreltotype = "";
    var ccr = contactrole.OriginalVersion as ClaimContactRole
    var relinsobjstatus = "";
    var drivertype = "";
    var dependentinfo = "";

    // Don't send role if claimant, this is done in exposure message
    // Don't send driver role if exposure is new - will be sent in exposure message - 1/7/10
    // add drivertype logic - 6/9/10 def 2609
    if (contactrole.Role != "claimant"
    && !(contactrole.ClaimContact.Claim.Policy.Verified && contactrole.Policy != null)
    && contactrole.Role != "checkpayee"
    && contactrole.Role != "recoverypayer"
    && contactrole.Role != "activityowner") {
      if (contactrole.Exposure != null) {
        publid = contactrole.Exposure.PublicID
        reltotype = "Feature" 
        if (contactrole.Exposure.DriverTypeExt != null && messageContext.EventName == "ClaimContactRoleAdded") {
          drivertype = "<DriverTypeExt><Code>"+contactrole.Exposure.DriverTypeExt.Code+"</Code><Description>"+contactrole.Exposure.DriverTypeExt.Description+"</Description><ListName>"+contactrole.Exposure.DriverTypeExt.ListName+"</ListName></DriverTypeExt>";
        }
        if (contactrole.Exposure.DrivingExperienceExt != null && messageContext.EventName == "ClaimContactRoleAdded") {
          drivertype = drivertype + "<DrivingExperienceExt>"+contactrole.Exposure.DrivingExperienceExt+"</DrivingExperienceExt>";
        }
        if (contactrole.Role == "claimantdep" ) {
          if (contactrole.ClaimContact.DependentType != null ) {
            dependentinfo = "<DependentType><Code>"+contactrole.ClaimContact.DependentType.Code+"</Code><Description>"+contactrole.ClaimContact.DependentType.Description+"</Description><ListName>"+contactrole.ClaimContact.DependentType.ListName+"</ListName></DependentType>";
          }
          if (contactrole.ClaimContact.BenefitEndReasonType != null ) {
            dependentinfo = dependentinfo + "<DependentEndReason><Code>"+contactrole.ClaimContact.BenefitEndReasonType.Code+"</Code><Description>"+contactrole.ClaimContact.BenefitEndReasonType.Description+"</Description><ListName>"+contactrole.ClaimContact.BenefitEndReasonType.ListName+"</ListName></DependentEndReason>";
          }
          if (contactrole.ClaimContact.BenefitEndDate != null ) {
            dependentinfo = dependentinfo + "<DependentEndDate>"+contactrole.ClaimContact.BenefitEndDate+"</DependentEndDate>";
          }
        }
      } else if (contactrole.Policy != null) {
        publid = contactrole.Policy.PublicID 
        reltotype = "Policy" 
      } else if (contactrole.Incident != null) {
        publid = contactrole.Incident.PublicID 
        reltotype = "Incident" 
      } else if (contactrole.Evaluation != null) {
        publid = contactrole.Evaluation.PublicID 
        reltotype = "Evaluation" 
      } else if (contactrole.Matter != null) {
        publid = contactrole.Matter.PublicID 
        reltotype = "Matter" 
      } else if (contactrole.Negotiation != null) {
        publid = contactrole.Negotiation.PublicID 
        reltotype = "Negotiation" 
      } else {
        publid = contactrole.ClaimContact.Claim.PublicID
        reltotype = "Claim" 
      }

      if (messageContext.EventName == "ClaimContactRoleAdded" ) {
        if (contactrole.Role.Code == "doingbusinessas") {
          reltoparty = "<PartyRelTo><PublicID>"+contactrole.ClaimContact.Claim.Insured.PublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>"; 
          partyrole = getPartyRole(contactrole, "curr"); 
          createContactRolePayload(messageContext, contactrole, partyrole, reltoparty, "A");
          sendmsg = false
        } else if (contactrole.Role == "driver" && contactrole.Exposure != null && contactrole.Exposure.New) {
          sendmsg = false
        } else if (contactrole.Role == "plaintiffs" && contactrole.Exposure != null && contactrole.Exposure.New) {
          sendmsg = false
        } else if (contactrole.Role == "VehOwnClaimOpen" && contactrole.Exposure != null && contactrole.Exposure.New) {
          sendmsg = false
        } else if (contactrole.Role == "VehOwnClaimClose" && contactrole.Exposure != null && contactrole.Exposure.New) {
          sendmsg = false
        } else if (contactrole.Role == "doctor" && contactrole.Exposure != null && contactrole.Exposure.New) {
          sendmsg = false
        } else if (contactrole.Role == "salvagebuyer" && contactrole.Exposure != null && contactrole.Exposure.New) {
          sendmsg = false
        } else if (contactrole.Role == "claimantdep" && contactrole.Exposure != null && contactrole.Exposure.New) {
          sendmsg = false
        } else if (contactrole.Role == "vocrehabspecialist" && contactrole.Exposure != null && contactrole.Exposure.New) {
          sendmsg = false
        } else if (contactrole.Role == "opposingcounsel" && contactrole.Exposure != null && contactrole.Exposure.New) {
          sendmsg = false
        } else if (contactrole.Role == "claimlosspayee" && contactrole.Exposure != null && contactrole.Exposure.New) {
          sendmsg = false
        } else if (contactrole.Role == "primarypilot") {
          sendmsg = false       }
        
        obstatus = "A"
      } else if (messageContext.EventName == "ClaimContactRoleChanged" ) {
        if (ccr.Exposure != null) {
          opublid = ccr.Exposure.PublicID;
          oreltotype = "Feature"; 
        } else if (ccr.Policy != null) {
          opublid = ccr.Policy.PublicID; 
          oreltotype = "Policy" 
        } else if (ccr.Incident != null) {
          opublid = ccr.Incident.PublicID 
          oreltotype = "Incident" 
        } else if (ccr.Evaluation != null) {
          opublid = ccr.Evaluation.PublicID 
          oreltotype = "Evaluation" 
        } else if (ccr.Matter != null) {
          opublid = ccr.Matter.PublicID 
          oreltotype = "Matter" 
        } else if (ccr.Negotiation != null) {
          opublid = ccr.Negotiation.PublicID 
          oreltotype = "Negotiation" 
        } else {
          opublid = ccr.ClaimContact.Claim.PublicID
          oreltotype = "Claim" 
        } 
        if (ccRoleFieldChanged(contactrole) || ccRoleCovPartyFieldChanged(contactrole)) {
          partyrole = getPartyRole(contactrole, "orig");
          reltoparty = "<PartyRelTo><PublicID>"+opublid+"</PublicID><RelToType>"+oreltotype+"</RelToType></PartyRelTo>"; 
          if (contactrole.ChangedFields.contains("ClaimContact")) {
            var origRole : ClaimContactRole = contactrole.OriginalVersion as ClaimContactRole;
            createContactRolePayload(messageContext, origRole, partyrole, reltoparty, "D");
          } else {
            createContactRolePayload(messageContext, contactrole, partyrole, reltoparty, "D");
          }
          // after creating a removal for the previous role, send the new role
          obstatus = "A"                 
        } else if (reltotype == oreltotype) {
          reltoparty = "<PartyRelTo><PublicID>"+publid+"</PublicID><RelToType>"+reltotype+"</RelToType></PartyRelTo>";
          if (contactrole.ChangedFields.contains("ClaimContact")) {	      
            var origRole2 : ClaimContactRole = contactrole.OriginalVersion as ClaimContactRole;
            partyrole = getPartyRole(contactrole, "curr");
            createContactRolePayload(messageContext, origRole2, partyrole, reltoparty, "D");
            obstatus = "A"
          } else {
            sendmsg = false
          }
        } else {
          partyrole = getPartyRole(contactrole, "orig");
          reltoparty = "<PartyRelTo><PublicID>"+opublid+"</PublicID><RelToType>"+oreltotype+"</RelToType></PartyRelTo>"; 
          createContactRolePayload(messageContext, contactrole, partyrole, reltoparty, "D");
          obstatus = "A"     
        }
      } else if (messageContext.EventName == "ClaimContactRoleRemoved" ) {
        if (contactrole.Role.Code == "doingbusinessas") {
          var ipublid = "";
          if (contactrole.ClaimContact.Claim.ChangedFields.contains("InsuredDenorm")) {
            ipublid = (contactrole.ClaimContact.Claim.Policy.insured.OriginalVersion as Contact).PublicID
            //Insured.PublicID (contactrole.getOriginalValue("Role") as ContactRole)
          } else {
            ipublid = contactrole.ClaimContact.Claim.Insured.PublicID
          }
          reltoparty = "<PartyRelTo><PublicID>"+ipublid+"</PublicID><RelToType>Party</RelToType></PartyRelTo>"; 
          partyrole = getPartyRole(contactrole, "curr"); 
          createContactRolePayload(messageContext, contactrole, partyrole, reltoparty, "D");
          sendmsg = false
        }
        obstatus = "D"
      } else {
        sendmsg = false
      }
    } else {
      sendmsg = false
    }

    if (sendmsg) {
      if (contactrole.ClaimContact.Contact.VerifiedPolicyContactExt) { 
        var newccontact = "true";
        for (r in contactrole.ClaimContact.Roles) { 
          if (r.PublicID != contactrole.PublicID) {
            if (r.Policy == null && !r.New) {
              newccontact = "false";
            }
          }
        }
        if (newccontact == "true") {
          claimContactF.sendClaimContactAdded( messageContext, contactrole.ClaimContact );   
        }
      }
      partyrole = getPartyRole(contactrole, "curr");     
      //      partyrole = "<Role><Code>"+contactrole.Role.Code+"</Code><Description>"+contactrole.Role.Description+"</Description><ListName>"+contactrole.Role.ListName+"</ListName></Role>";
      //      add driver type def 2609
      if (contactrole.Role == "driver" && reltotype == "Feature" && drivertype != "") {
        partyrole = partyrole + drivertype;
      }
      if (contactrole.Role == "claimantdep" && reltotype == "Feature" && dependentinfo != "") {
        partyrole = partyrole + dependentinfo;
      }
      reltoparty = "<PartyRelTo><PublicID>"+publid+"</PublicID><RelToType>"+reltotype+"</RelToType></PartyRelTo>";
      createContactRolePayload(messageContext, contactrole, partyrole, reltoparty, obstatus);
    }
  
    // def 1798 - send parties related to insured
    if ((contactrole.Role == "insured") && (messageContext.EventName == "ClaimContactRoleAdded" || messageContext.EventName == "ClaimContactRoleRemoved")){
      if (messageContext.EventName == "ClaimContactRoleAdded") {
        relinsobjstatus = "A";
        if ((contactrole.ClaimContact.Claim.maincontact != null) && (contactrole.ClaimContact.Claim.MainContactType !=null)) {
          sendRelatedInsuredRoleChange(messageContext, contactrole.ClaimContact.Claim, contactrole.ClaimContact.Claim.maincontact, contactrole.UpdateTime, contactrole.ClaimContact.Claim.MainContactType.Code, "C", relinsobjstatus , relinsobjstatus );
        }
        if ((contactrole.ClaimContact.Claim.reporter != null) && (contactrole.ClaimContact.Claim.ReportedByType !=null)) {
        }  
      }
      if (messageContext.EventName == "ClaimContactRoleRemoved") {
        relinsobjstatus = "D" 
        if ((contactrole.ClaimContact.Claim.maincontact != null) && (contactrole.ClaimContact.Claim.MainContactType !=null)) {
          sendRelatedOldInsuredRoleChange(messageContext, contactrole.ClaimContact.Claim, contactrole.ClaimContact.Claim.maincontact, contactrole.UpdateTime, contactrole.ClaimContact.Claim.MainContactType.Code, "C", "E" , relinsobjstatus );
        }
        if ((contactrole.ClaimContact.Claim.reporter != null) && (contactrole.ClaimContact.Claim.ReportedByType !=null)) {
          sendRelatedOldInsuredRoleChange(messageContext, contactrole.ClaimContact.Claim, contactrole.ClaimContact.Claim.reporter, contactrole.UpdateTime, contactrole.ClaimContact.Claim.ReportedByType.Code, "C", "E", relinsobjstatus );
        } 
      }
    }

    if (messageContext.EventName == "ClaimContactRoleAdded") {
      relinsobjstatus = "A" 
      if ((contactrole.Role == "maincontact") && (contactrole.ClaimContact.Claim.maincontact != null) && (contactrole.ClaimContact.Claim.MainContactType !=null)) {
        sendRelatedInsuredRoleChange(messageContext, contactrole.ClaimContact.Claim, contactrole.ClaimContact.Claim.maincontact, contactrole.UpdateTime, contactrole.ClaimContact.Claim.MainContactType.Code, "C", relinsobjstatus, relinsobjstatus );
      }
      if ((contactrole.Role == "reporter") && (contactrole.ClaimContact.Claim.reporter != null) && (contactrole.ClaimContact.Claim.ReportedByType !=null)) {
        sendRelatedInsuredRoleChange(messageContext, contactrole.ClaimContact.Claim, contactrole.ClaimContact.Claim.reporter, contactrole.UpdateTime, contactrole.ClaimContact.Claim.ReportedByType.Code, "C", relinsobjstatus, relinsobjstatus );
      }  
    }
    
    if (messageContext.EventName == "ClaimContactRoleRemoved") {
      relinsobjstatus = "D" 
      if ((contactrole.Role == "maincontact") && ((contactrole.ClaimContact.Claim.OriginalVersion as Claim).maincontact != null) && ((contactrole.ClaimContact.Claim.OriginalVersion as Claim).MainContactType !=null)) {
        sendRelatedInsuredRoleChange(messageContext, contactrole.ClaimContact.Claim, (contactrole.ClaimContact.Claim.OriginalVersion as Claim).maincontact, contactrole.UpdateTime, (contactrole.ClaimContact.Claim.OriginalVersion as Claim).MainContactType.Code, "C", "E", relinsobjstatus );
      }
      if ((contactrole.Role == "reporter") && ((contactrole.ClaimContact.Claim.OriginalVersion as Claim) != null) && ((contactrole.ClaimContact.Claim.OriginalVersion as Claim).ReportedByType !=null)) {
        sendRelatedInsuredRoleChange(messageContext, contactrole.ClaimContact.Claim, (contactrole.ClaimContact.Claim.OriginalVersion as Claim).reporter, contactrole.UpdateTime, (contactrole.ClaimContact.Claim.OriginalVersion as Claim).ReportedByType.Code, "C", "E", relinsobjstatus );
      }  
    }
  
    if  ((messageContext.EventName == "ClaimContactRoleChanged") && ccRoleFieldChanged(contactrole)) {
      if ((contactrole.Role == "maincontact") && (contactrole.ClaimContact.Claim.maincontact != null) && (contactrole.ClaimContact.Claim.MainContactType !=null)) {
        sendRelatedInsuredRoleChange(messageContext, contactrole.ClaimContact.Claim, contactrole.ClaimContact.Claim.maincontact, contactrole.UpdateTime, contactrole.ClaimContact.Claim.MainContactType.Code, "C", "E", "A" );
      }
      if ((contactrole.Role == "reporter") && (contactrole.ClaimContact.Claim.reporter != null) && (contactrole.ClaimContact.Claim.ReportedByType !=null)) {
        sendRelatedInsuredRoleChange(messageContext, contactrole.ClaimContact.Claim, contactrole.ClaimContact.Claim.reporter, contactrole.UpdateTime, contactrole.ClaimContact.Claim.ReportedByType.Code, "C", "E", "A" );
      }  
      if (((contactrole.OriginalVersion as ClaimContactRole).Role == "maincontact") && (contactrole.ClaimContact.Claim.MainContactType !=null)) {
        sendRelatedInsuredRoleChange(messageContext, contactrole.ClaimContact.Claim, contactrole.ClaimContact.Contact, contactrole.UpdateTime, contactrole.ClaimContact.Claim.MainContactType.Code, "C", "E", "D" );
      }
      if (((contactrole.OriginalVersion as ClaimContactRole).Role == "reporter") && (contactrole.ClaimContact.Claim.ReportedByType !=null)) {
      }
    }
  }

  // Helper for anyFieldChanged; returns true if claim contact role field changed
  protected function ccRoleFieldChanged(ccrole : ClaimContactRole) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(ccrole, new String[] {  "Role" })) {
      return true;
    }
    return false;
  }

  // Helper for anyFieldChanged; returns true if claim contact coveredpartytype field changed
  protected function ccRoleCovPartyFieldChanged(ccrole : ClaimContactRole) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(ccrole, new String[] {  "CoveredPartyType" })) {
      return true;
    }
    return false;
  }

  // return party role
  protected function getPartyRole(contactrole : ClaimContactRole, roletype : String) : String {
    var partyrole = "";
    if (roletype == "orig") {
      if ((contactrole.getOriginalValue("Role") as ContactRole).Code == "lienholder") {
        partyrole = "<Role><Code>"+(contactrole.getOriginalValue("CoveredPartyType") as CoveredPartyType).Code+"</Code><Description>"+(contactrole.getOriginalValue("CoveredPartyType") as CoveredPartyType).Description+"</Description><ListName>LienHolderType</ListName></Role>";
      } else if ((contactrole.getOriginalValue("Role") as ContactRole).Code == "coveredparty" || (contactrole.getOriginalValue("Role") as ContactRole).Code == "AdditionalInterestRisk" ) {
        partyrole = "<Role><Code>"+(contactrole.getOriginalValue("CoveredPartyType") as CoveredPartyType).Code+"</Code><Description>"+(contactrole.getOriginalValue("CoveredPartyType") as CoveredPartyType).Description+"</Description><ListName>"+(contactrole.getOriginalValue("CoveredPartyType") as CoveredPartyType).ListName+"</ListName></Role>";
      } else {
        partyrole = "<Role><Code>"+(contactrole.getOriginalValue("Role") as ContactRole).Code+"</Code><Description>"+(contactrole.getOriginalValue("Role") as ContactRole).Description+"</Description><ListName>"+(contactrole.getOriginalValue("Role") as ContactRole).ListName+"</ListName></Role>";
      }
    } else if (contactrole.Role.Code == "lienholder") {
      partyrole = "<Role><Code>"+contactrole.CoveredPartyType.Code+"</Code><Description>"+contactrole.CoveredPartyType.Description+"</Description><ListName>LienHolderType</ListName></Role>";
    } else if ((contactrole.Role.Code == "coveredparty") or (contactrole.Role.Code == "AdditionalInterestRisk")) {
      partyrole = "<Role><Code>"+ contactrole.CoveredPartyType.Code + "</Code><Description>" + contactrole.CoveredPartyType.Description + "</Description><ListName>" + contactrole.CoveredPartyType.ListName + "</ListName></Role>";
    }else {
      partyrole = "<Role><Code>" + contactrole.Role.Code + "</Code><Description>" + contactrole.Role.Description + "</Description><ListName>"+ contactrole.Role.ListName + "</ListName></Role>";
    }

    return partyrole;
  }

  // Kotteson - Def 822
  function sendOfficialRoleChange(messageContext : MessageContext, official : Official, roleobstatus : String) {
    var partyrole = "";
    var reltoparty ="";
    var publid = official.Claim.PublicID;
    var reltotype = "Claim";
    var sendmsg = true;

    // KOtteson - if role object status is null, then only the report number was changed.  Send object status of change to EDW for report number to be updated.
    if (roleobstatus == "") {
      partyrole = "<Role><Code>"+official.OfficialType.Code+"</Code><Description>"+official.OfficialType.Description+"</Description><ListName>"+official.OfficialType.ListName
      +"</ListName></Role>";
      reltoparty = "<PartyRelTo><PublicID>"+publid+"</PublicID><RelToType>"+reltotype+"</RelToType></PartyRelTo>";
      createOfficialRolePayload(messageContext, official, partyrole, reltoparty, "C");
      sendmsg = false
    } else if (roleobstatus == "C") {
      partyrole = "<Role><Code>"+(official.getOriginalValue("OfficialType") as OfficialType).Code+"</Code><Description>"+(official.getOriginalValue("OfficialType") as OfficialType).Description+"</Description><ListName>"+(official.getOriginalValue("OfficialType") as OfficialType).ListName+"</ListName></Role>";
      reltoparty = "<PartyRelTo><PublicID>"+publid+"</PublicID><RelToType>"+reltotype+"</RelToType></PartyRelTo>";
      createOfficialRolePayload(messageContext, official, partyrole, reltoparty, "D");
      roleobstatus = "A"
    }  

    if (sendmsg) {  
      partyrole = "<Role><Code>"+official.OfficialType.Code+"</Code><Description>"+official.OfficialType.Description+"</Description><ListName>"+official.OfficialType.ListName
      +"</ListName></Role>";
      reltoparty = "<PartyRelTo><PublicID>"+publid+"</PublicID><RelToType>"+reltotype+"</RelToType></PartyRelTo>";

      createOfficialRolePayload(messageContext, official, partyrole, reltoparty, roleobstatus);
    }
  }

  // Kotteson - Def 1798  roles related to the insured
  // handle when maincontacttype or reportedbytype has changed, but the maincontact and reporter has not.
  // If the maincontact or reporter changes, the messages will be created in 
  function processRelatedInsuredRoleChange(messageContext : MessageContext, claim : Claim ) {
    if (claim.OriginalVersion typeis Claim) {
      if (messageContext.EventName == "MainContactTypeChanged") {
        if (claim.MainContactType == null) {
          if ((claim.OriginalVersion.maincontact != null) and (claim.maincontact != null) and (claim.maincontact.PublicID == claim.OriginalVersion.maincontact.PublicID)) {
            sendRelatedInsuredRoleChange(messageContext, claim, claim.maincontact, claim.UpdateTime, claim.OriginalVersion.MainContactType.Code, "C", "E", "D" );
          } 
        } else if ((claim.OriginalVersion.maincontact != null) and (claim.maincontact != null) and ((claim.maincontact.PublicID == claim.OriginalVersion.maincontact.PublicID))) {
          sendRelatedInsuredRoleChange(messageContext, claim, claim.maincontact, claim.UpdateTime, claim.MainContactType.Code, "C", "C", "A" );
          if (claim.OriginalVersion.MainContactType != null) {
          sendRelatedInsuredRoleChange(messageContext, claim, claim.maincontact, claim.UpdateTime, claim.OriginalVersion.MainContactType.Code, "C", "E", "D" );
          }
        } 
      }
      if (messageContext.EventName == "ReportedByTypeChange") {
      if (claim.ReportedByType == null) {
      if ((claim.OriginalVersion.reporter != null) and (claim.reporter != null) and (claim.reporter.PublicID == claim.OriginalVersion.reporter.PublicID)) {
      sendRelatedInsuredRoleChange(messageContext, claim, claim.reporter, claim.UpdateTime, claim.OriginalVersion.ReportedByType.Code, "C", "E", "D" );
      }
      } else 
      if ((claim.OriginalVersion.reporter != null) and (claim.reporter != null) and ((claim.reporter.PublicID == claim.OriginalVersion.reporter.PublicID))) {
      sendRelatedInsuredRoleChange(messageContext, claim, claim.reporter, claim.UpdateTime, claim.ReportedByType.Code, "C", "C", "A" );
      if (claim.OriginalVersion.ReportedByType != null) {
      sendRelatedInsuredRoleChange(messageContext, claim, claim.reporter, claim.UpdateTime, claim.OriginalVersion.ReportedByType.Code, "C", "E", "D" );
      }
      } 
      }
    }
  }

  // Kotteson - Def 1798  roles related to the insured
  function sendRelatedInsuredRoleChange(messageContext : MessageContext, claim : Claim, kontact : Contact,
  theupdatetime : DateTime, relation : PersonRelationType, objstatus : String, parentrolestatus : String,
  relationstatus : String ) {
    var parentrole = "";
    var childrole = "";
    var reltoparty ="";
    var publid = claim.Policy.PublicID;
    var reltotype = "Policy";

    if (!claim.Policy.Verified) {
      parentrole = "<Role><Code>insured</Code><Description>Insured</Description><ListName>ContactRole</ListName></Role>";
      childrole = "<Role><Code>"+relation.Code+"</Code><Description>"+relation.Description+"</Description><ListName>"+relation.ListName+"</ListName></Role>";
      reltoparty = "<PartyRelTo><PublicID>"+publid+"</PublicID><RelToType>"+reltotype+"</RelToType></PartyRelTo>";
      createRelatedPartyPayload(messageContext, claim, claim.Policy.insured, kontact, theupdatetime, parentrole, childrole, reltoparty, objstatus, parentrolestatus, relationstatus);
    }  else {
      publid = claim.PublicID;
      reltotype = "Claim";
      parentrole = "<Role><Code>insured</Code><Description>Insured</Description><ListName>ContactRole</ListName></Role>";
      childrole = "<Role><Code>"+relation.Code+"</Code><Description>"+relation.Description+"</Description><ListName>"+relation.ListName+"</ListName></Role>";
      reltoparty = "<PartyRelTo><PublicID>"+publid+"</PublicID><RelToType>"+reltotype+"</RelToType></PartyRelTo>";
      createRelatedPartyPayload(messageContext, claim, claim.Policy.insured, kontact, theupdatetime, parentrole, childrole, reltoparty, objstatus, parentrolestatus, relationstatus);
    }
  }

  // Kotteson - Def 1798  roles related to the insured
  function sendRelatedOldInsuredRoleChange(messageContext : MessageContext, claim : Claim, kontact : Contact,
  theupdatetime : DateTime, relation : PersonRelationType, objstatus : String, parentrolestatus : String,
  relationstatus : String ) {
    var parentrole = "";
    var childrole = "";
    var reltoparty ="";
    var publid = claim.Policy.PublicID;
    var reltotype = "Policy";

    if (!claim.Policy.Verified) {
      parentrole = "<Role><Code>insured</Code><Description>Insured</Description><ListName>ContactRole</ListName></Role>";
      childrole = "<Role><Code>"+relation.Code+"</Code><Description>"+relation.Description+"</Description><ListName>"+relation.ListName+"</ListName></Role>";
      reltoparty = "<PartyRelTo><PublicID>"+publid+"</PublicID><RelToType>"+reltotype+"</RelToType></PartyRelTo>";
      createRelatedPartyPayload(messageContext, claim, (claim.OriginalVersion as Claim).Policy.insured, kontact, theupdatetime, parentrole, childrole, reltoparty, objstatus, parentrolestatus, relationstatus);
    }  else {
      publid = claim.PublicID;
      reltotype = "Claim";
      parentrole = "<Role><Code>insured</Code><Description>Insured</Description><ListName>ContactRole</ListName></Role>";
      childrole = "<Role><Code>"+relation.Code+"</Code><Description>"+relation.Description+"</Description><ListName>"+relation.ListName+"</ListName></Role>";
      reltoparty = "<PartyRelTo><PublicID>"+publid+"</PublicID><RelToType>"+reltotype+"</RelToType></PartyRelTo>";
      createRelatedPartyPayload(messageContext, claim, (claim.OriginalVersion as Claim).Policy.insured, kontact, theupdatetime, parentrole, childrole, reltoparty, objstatus, parentrolestatus, relationstatus);
    }
  }
  
  // Kotteson - Def 5788
  function sendUserRoleChange(messageContext : MessageContext, usrRole : UserRoleAssignment, objStatus : String) {
    var partyrole = "";
//    var reltoparty ="";
//    var reltotype = "Claim";

    partyrole = "<Role><Code>"+usrRole.Role.Code+"</Code><Description>"+usrRole.Role.Description+"</Description><ListName>"+usrRole.Role.ListName+"</ListName></Role>";
//    reltoparty = "<PartyRelTo><PublicID>"+usrRole.Claim.PublicID+"</PublicID><RelToType>"+reltotype+"</RelToType></PartyRelTo>";
    createUserRolePayload(messageContext, usrRole, partyrole, objStatus);
  }

  protected function createContactRolePayload(messageContext : MessageContext, contactrole : ClaimContactRole,
  partyrole : String, reltoparty: String, objStatus : String) {
    var templateData = PartyRoleDataEDW.renderToString("", contactrole, partyrole, reltoparty, objStatus, contactrole.ClaimContact.Claim.PublicID);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  }

  protected function createOfficialRolePayload(messageContext : MessageContext, official : Official,
  partyrole : String, reltoparty: String, objStatus : String) {
    var templateData = PartyRoleOfficialDataEDW.renderToString("off:", official, partyrole, reltoparty, objStatus, official.Claim.PublicID);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  }

  protected function createRelatedPartyPayload(messageContext : MessageContext, claim : Claim, parentcontact : Contact,
  childcontact : Contact, theupdatetime : DateTime, partyrole : String, childrole : String, reltoparty: String,
  objStatus : String, parentrolestatus : String, roleobjstatus : String) {
    var templateData = PartyRelateDataEDW.renderToString("", claim, partyrole, childrole, reltoparty, "E", objStatus, parentrolestatus, roleobjstatus, theupdatetime, claim.PublicID, parentcontact, childcontact);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  }
   
  protected function createUserRolePayload(messageContext : MessageContext, usrRole : UserRoleAssignment, partyrole : String, roleobjstatus : String) {
    var templateData = PartyRoleUserDataEDW.renderToString( usrRole, partyrole, roleobjstatus);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  }
}