package util.gaic.EDW;
uses templates.messaging.edw.ClaimDataEDW
uses templates.messaging.edw.PartyDataEDW
uses templates.messaging.edw.PartyRoleDefaultDataEDW
uses gw.policy.RefreshPolicyParallel

class EDWClaimFunctions {
  
  private var featureF = EDWFunctionsFactory.getFeatureFunctions();
  private var claimContactRoleF = EDWFunctionsFactory.getClaimContactRoleFunctions();
  private var claimContactF = EDWFunctionsFactory.getClaimContactFunctions();
  private var noteF = EDWFunctionsFactory.getNoteFunctions();
  private var activityF = EDWFunctionsFactory.getActivityFunctions();
  private var siuF = EDWFunctionsFactory.getSIUFunctions();
  private var coverageF = EDWFunctionsFactory.getCoverageFunctions();
  private var policyF = EDWFunctionsFactory.getPolicyFunctions();
  private var commonF = EDWFunctionsFactory.getCommonFunctions();

  private construct() {}

  static function getInstance() : EDWClaimFunctions {
    return new EDWClaimFunctions();
  }

  function sendNewClaim(messageContext : MessageContext, claim : Claim) {
    var incidentStatus = "";

    // First, make sure the claim is not in the draft state
    // Then, a new claim will either have a newclaim event, or a claimchanged event.  If claimchanged event,
    // then both the claim and policy must have changed - this can only happen on a new claim.
    if ((messageContext.EventName == "NewClaim" || messageContext.EventName == "ClaimAdded") and claim.State != "draft") {
      // an incident only claim first needs to be sent open, then followed by a close action
      if (claim.IncidentReport) {
        if (claim.State == "closed") {
          incidentStatus = "open" ; 
        } else {
          incidentStatus = "Actual" ; 
        }
      } else {
        incidentStatus = "Actual" ;
      }
      createClaimPayload(messageContext, claim, "A", incidentStatus)

      // process each feature of the new claim
      for (feature in claim.Exposures) {
        featureF.sendExposureAdd(messageContext, feature);
      }        

      // create activities messages
      for (activity in claim.Activities) {
        activityF.createActivityPayload(messageContext, activity, "A");
      }

      // create notes
      for (note in claim.Notes) {
        noteF.sendNewNote(messageContext, note);
      }      
      // create Official parties and roles
      for (official in claim.Officials) {
        claimContactF.createOfficialPayload(messageContext, official, "A");
        claimContactRoleF.sendOfficialRoleChange(messageContext, official, "A");
      }

      //def 1798      
      processRelToInsuredParties(messageContext, claim)   
            
      //def 6192      
      processRelToContactParties(messageContext, claim)
                  
      //def 6697      
      processVendorCSCIParties(messageContext, claim)
      
      //def 5778 create User assignment roles
      //def 7090 - all users will be pushed - no need to create user party add message 
          //if (!userNlist.contains(usrrole.AssignedUser.PublicID)) {
          //    claimContactF.createUserPayload(messageContext, usrrole.AssignedUser, claim, "A")
          //    userNlist.add(usrrole.AssignedUser.PublicID)
          //}
      for (usrrole in claim.AllRoleAssignments) {
        if (usrrole.Role.Code == "siu" or usrrole.Role.Code == "scoassist" or usrrole.Role.Code == "RecoveryAssist" or usrrole.Role.Code == "secureclaim"
        or usrrole.Role.Code == "sensitiveclaim" or usrrole.Role.Code == "tempclaimeditor" or usrrole.Role.Code == "transferclaim"
        or usrrole.Role.Code == "secureadjuster") {
          claimContactRoleF.sendUserRoleChange(messageContext, usrrole, "");
        }
      }  

      //for closed incident only, follow with the close status
      if (claim.IncidentReport) {
        if (claim.State == "closed") {
          incidentStatus = "Actual" ; 
          createClaimPayload(messageContext, claim, "C", incidentStatus)
        }
      }
    }
  }

  // Determines what messages are needed related to claim and policy changes
  // do not send to EDW if the policy was refreshed from the batch process
  function sendClaimChanges(messageContext : MessageContext, claim : Claim) {
    // do not send EDW messages if policy is refreshed from batch process 
    if (claim != null and RefreshPolicyParallel.wasClaimRefreshedFromBatchRefreshPolicy(claim.ID)) {
      return
    } 
    if (claim != null and claim.State != "draft" and claim.OriginalVersion.DisplayName.startsWith("T") == false) {
      if (claimFieldChanged(messageContext, claim)) {
        if (claim.PolicyRefreshedExt) {
          var theclaim = claim.OriginalVersion as Claim;
          createClaimPayload(messageContext, theclaim, "D", "Actual");
          claim.PolicyRefreshedExt = false;
        }

        createClaimPayload(messageContext, claim, "C", "Actual");
      }
      processOfficialParties(messageContext, claim);

      // send SIU changes
      siuF.sendSIUChanges( messageContext, claim );
      
      //def 5778 create User assignment roles
      processUserRoleParties(messageContext, claim) 
            
      //worker comp - may need to generate injured worker party message which will contain relationships to features
      if (claim.InjuredWorker != null and !claim.IncidentReport){
        if (!claim.InjuredWorker.Changed){      
          if (commonF.isInjWorkerClaimFieldChanged(claim)) {
             createInjuredWorkerPayload(messageContext, claim, "C");
          }
        }
      }
                  
      // if there used to be a mco type, generate delete of default party
      if (claim.ManagedCareOrgTypeExt == null){
         var origclaim = claim.OriginalVersion as Claim;
         if (origclaim.ManagedCareOrgTypeExt != null){  
             var thename = "default Managed Care Organization";
             var therole = "<Role><Code>MCO</Code><Description>Managed Care Organization</Description><ListName>ContactRole</ListName></Role>";
             var thereltoparty = "<PartyRelTo><PublicID>"+Claim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>";   
             createPartyRoleDefaultPayload(messageContext, "mco:", claim, "D", therole, thereltoparty, thename);
         }
      }
    }
  }

  // Determine what Officials require Party template generation
  protected function processOfficialParties(messageContext : MessageContext, claim : Claim) {
    for (official in claim.Officials) {
      var rolechg = "";
      if (official.New) {   
        claimContactF.createOfficialPayload(messageContext, official, "A");
        claimContactRoleF.sendOfficialRoleChange(messageContext, official, "A");
      } else {
        if (officialFieldChanged(official)) {
          claimContactF.createOfficialPayload(messageContext, official, "C");
        }
        if (officialRoleChanged(official)) {
          rolechg = "C";
        }
        if (officialReportChanged(official) or (rolechg == "C")) {
          claimContactRoleF.sendOfficialRoleChange(messageContext, official, rolechg);
        }
      }
    }
    for (origofficial in (claim.OriginalVersion as Claim).Officials )  {
      var fnd = "false";
      for (off in claim.Officials) {
        if (origofficial.PublicID == off.PublicID) {
          fnd = "true";
        }
      }
      if (fnd == "false") { 
        claimContactRoleF.sendOfficialRoleChange(messageContext, origofficial, "D");
      }
    }
  }
  
  // Def 1798 - process potential relationships to insured
  protected function processRelToInsuredParties(messageContext : MessageContext, claim : Claim) {
    var reltype = "maincontact";

    if (claim.Policy.insured !=null and claim.maincontact != null and claim.MainContactType != null) {  
      claimContactRoleF.sendRelatedInsuredRoleChange(messageContext, claim, claim.maincontact, claim.UpdateTime, claim.MainContactType as java.lang.String, "C", "A", "A" ); 
    } 

    if (claim.Policy.insured !=null and claim.reporter != null and claim.ReportedByType != null) { 
      reltype = "reportedby"; 
      claimContactRoleF.sendRelatedInsuredRoleChange(messageContext, claim, claim.reporter, claim.UpdateTime, claim.ReportedByType as java.lang.String, "C", "A", "A" ); 
    } 
  }
  
  // Def 6192 - process related to contacts
  protected function processRelToContactParties(messageContext : MessageContext, claim : Claim) {

    if (claim.Contacts != null) {
      for (cc in claim.Contacts) {
        var reltofnd = "false";
        if (cc.Contact.AllContactContacts != null && cc.Contact.AllContactContacts.length > 0) {
          for (allc in cc.Contact.AllContactContacts) {
            if (allc.SourceContact.PublicID == cc.Contact.PublicID) { 
               reltofnd = "true";
            }         
          }        
        }
        if (reltofnd == "true") { 
             claimContactF.createClaimContactPayload(messageContext, cc, "A");
        }
      }
    }
  }
  
  // Def 6697 - generate csci parties for vendors when needed
  protected function processVendorCSCIParties(messageContext : MessageContext, claim : Claim) {

    var fnd = "false";
    var vendorPublicID = "";
    var partyrole = "";
    var reltoparty = "";
    var vendorCSCIStatus = "";
    
    if (claim.Contacts != null) {
      for (cc in claim.Contacts) {
        if (cc.Contact typeis CompanyVendor || cc.Contact typeis PersonVendor) {
            fnd = "false";
            vendorCSCIStatus = "";
            for (r in cc.Roles) {
                if (r.getOwner() == null or r.getOwner() == claim.ClaimNumber) {
                  fnd = "true";
                }
            }       
            if (fnd == "true") { 
                //vendorCSCIStatus = claimContactF.getClaimContactCSCIStatus(cc);
                if ((cc.claimSpecificContactExt != null) or
                    (cc.cscCellPhoneExt != null) or
                    (cc.cscEmail1Ext != null) or
                    (cc.cscEmail2Ext != null) or
                    (cc.cscFaxPhoneExt != null) or
                    (cc.cscHomePhoneExt != null) or
                    (cc.cscPrimaryPhoneExt != null) or
                    (cc.cscTollFreeNumberExt != null) or
                    (cc.cscWorkPhoneExt != null)) {
                    vendorCSCIStatus = "A"
                }
                if (vendorCSCIStatus == "A") {
                   if (cc.Contact.AddressBookUID != null) {  
                       vendorPublicID = cc.Contact.AddressBookUID;
                   } else { 
                       vendorPublicID = cc.Contact.PublicID; 
                   }
                   claimContactF.createVendorCSCIPayload(messageContext, cc, vendorCSCIStatus)
                   partyrole = "<Role><Code>claimspecificcontact</Code><Description>Claim Specific Contact</Description><ListName>ContactRole</ListName></Role>";
                   reltoparty = "<PartyRelTo><PublicID>"+cc.Claim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>";
                   claimContactF.createVenCSCIRolePayload(messageContext, cc, partyrole, reltoparty, vendorCSCIStatus)
                   partyrole = "<Role><Code>cscinformation</Code><Description>Claim Specific Contact Info</Description><ListName>PersonRelationType</ListName></Role>"
                   reltoparty = "<PartyRelTo><PublicID>"+vendorPublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>";
                   claimContactF.createVenCSCIRolePayload(messageContext, cc, partyrole, reltoparty, vendorCSCIStatus)
                }
            }
        }
      }
    }
  }  
  
    // Defect 5778 process user roles - generate party messages for certain roles
  protected function processUserRoleParties(messageContext : MessageContext, claim : Claim) {
 
    //def 7090 - all users will be pushed - no need to create user party add message
    //var userClist : java.util.Set = new java.util.HashSet();  
          //if (!userClist.contains(usrrole.AssignedUser.PublicID)) {
          //    claimContactF.createUserPayload(messageContext, usrrole.AssignedUser, claim, "A")
          //    userClist.add(usrrole.AssignedUser.PublicID)
          //}
    if (gw.api.util.ArrayUtil.count(claim.getRemovedArrayElements("RoleAssignments")) > 0) {
      for (delusrrole in claim.getRemovedArrayElements("RoleAssignments")) {
        if ((delusrrole as UserRoleAssignment).Role.Code == "secureclaim"
          or (delusrrole as UserRoleAssignment).Role.Code == "sensitiveclaim" or (delusrrole as UserRoleAssignment).Role.Code == "tempclaimeditor" or (delusrrole as UserRoleAssignment).Role.Code == "transferclaim"
          or (delusrrole as UserRoleAssignment).Role.Code == "secureadjuster") {

            claimContactRoleF.sendUserRoleChange(messageContext, delusrrole as UserRoleAssignment, "D");
        }
      }
    }
    for (usrrole in claim.AllRoleAssignments) {
      if (usrrole.Role.Code == "siu" or usrrole.Role.Code == "scoassist" or usrrole.Role.Code == "RecoveryAssist" or usrrole.Role.Code == "secureclaim"
        or usrrole.Role.Code == "sensitiveclaim" or usrrole.Role.Code == "tempclaimeditor" or usrrole.Role.Code == "transferclaim"
        or usrrole.Role.Code == "secureadjuster") {
        if (usrrole.New or usrrole.Changed)  {
          claimContactRoleF.sendUserRoleChange(messageContext, usrrole, "");
        }
      }
    }
  }
  
  // Helper for anyFieldChanged; returns true if any claim/policy/risk/coverage fields of interest to EDW have changed
  protected function claimFieldChanged(messageContext : MessageContext, claim : Claim) : boolean {
    var claimChanged = false;
    var policyChanged = false;
    var coverageChanged = false;
    var coverageRemoved = false;
    var coverageAdded = false;

    if (isClaimFieldChanged(claim)) {
      claimChanged = true;
    }

    // check if policy was refreshed
    if(claim.PolicyRefreshedExt) {
      claimChanged = true;
    }
    
    // check for claim loss location changes
    if (util.gaic.CommonFunctions.addressFieldChanged( claim.LossLocation )) {
      claimChanged = true;
    }   

    // check for policy field changes
    if (policyF.policyFieldChanged( claim.Policy )) {
      policyChanged = true;
    }

    // check for coverage field changes
    if (coverageF.coverageFieldChanged( claim.Policy )) {
      coverageChanged = true;
    }

    if (messageContext.EventName == "CoverageRemoved") {
      coverageRemoved = true;
    }
    if (messageContext.EventName == "CoverageAdded") {
      coverageAdded = true;
    }

    if (messageContext.EventName == "ClaimChanged" and claimChanged) {
      return true
    }

    if (messageContext.EventName == "PolicyChanged" and policyChanged and !claimChanged) {
      return true
    } else if (messageContext.EventName == "PolicyAdded" || messageContext.EventName == "PolicyRemoved") {
      return true
    }

    if (messageContext.EventName == "CoverageChanged" and coverageChanged and !policyChanged and !claimChanged) {
      return true
    }    

    if (coverageAdded and (!coverageChanged and !policyChanged and !claimChanged)) {
      return true
    }

    if (coverageRemoved and (!coverageAdded and !coverageChanged and !policyChanged and !claimChanged)) {
      return true
    }

    return false;
  }

  // Test for changed to assigned user 
  protected function assigneduserChanged(claim : Claim) : boolean {  
    if (claim.isFieldChanged("AssignedUserDenorm") ) {
      return true;
    }
    return false;
  }

  // Test for changed to assigned user 
  protected function assignedbyuserChanged(claim : Claim) : boolean {  
    if (claim.isFieldChanged("AssignedByUserDenorm") ) {
      return true;
    }
    return false;
  }

  // Test for changed to assigned user 
  protected function previoususerChanged(claim : Claim) : boolean {  
    if (claim.isFieldChanged("PreviousUserDenorm") ) {
      return true;
    }
    return false;
  }

  // Test for changed to assigned user 
  protected function assignedgroupChanged(claim : Claim) : boolean {  
    if (claim.isFieldChanged("AssignedGroupDenorm") ) {
      return true;
    }
    return false;
  }

  // Helper for anyFieldChanged; returns true if any claim/policy/risk/coverage fields of interest to EDW have changed
  protected function officialFieldChanged(official : Official) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(official, new String[] { "Name"})) {
      return true;
    }
    return false;
  }

  // Helper for anyFieldChanged; returns true if any claim/policy/risk/coverage fields of interest to EDW have changed
  protected function officialRoleChanged(official : Official) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(official, new String[] { "OfficialType"})) {
      return true;
    }
    return false;
  }

  // Helper for anyFieldChanged; returns true if any claim/policy/risk/coverage fields of interest to EDW have changed
  protected function officialReportChanged(official : Official) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(official, new String[] { "ReportNumber"})) {
      return true;
    }
    return false;
  }

  // NOTE: don't send claims in draft state into these functions
  protected function createClaimPayload(messageContext : MessageContext, claim : Claim, objStatus : String, incidentStatus : String) {
    var templateData = ClaimDataEDW.renderToString(claim, objStatus, incidentStatus, messageContext.EventName);
    util.gaic.CommonFunctions.sendTemplateMessage( messageContext, templateData );
  }
  // work comp injured worker
  protected function createInjuredWorkerPayload(messageContext : MessageContext, claim : Claim, objStatus : String) {
    var templateData = PartyDataEDW.renderToString("", claim.InjuredWorker as Contact, objStatus, claim);
    util.gaic.CommonFunctions.sendTemplateMessage( messageContext, templateData );
  }
  // default party role
  protected function createPartyRoleDefaultPayload(messageContext : MessageContext, theaddl : String, claim : Claim, objStatus : String, therole : String , thepartyrelto : String, thename : String) {
    var templateData = PartyRoleDefaultDataEDW.renderToString(theaddl, therole, thepartyrelto, objStatus, claim, thename);
    util.gaic.CommonFunctions.sendTemplateMessage( messageContext, templateData );
  }
  private function isClaimFieldChanged(claim : Claim) : boolean {
    var fields = new String[] { "ClaimNumber", "LossDate", "ReportedDate", "DateRptdToAgent", "IncidentReport",
    "FirstNoticeSuit", "Description", "WeatherRelated_Ext", "EstimatedDamage_Ext", "LossCause", "ex_DetailLossCause",
    "LossType", "HowReported", "ex_LossLocation", "AssignmentDate", "State", "JurisdictionState", "ClosedOutcome",
    "ReOpenedReason", "DeathDate", "Catastrophe", "LossLocation", "AmountClaimedExt", "DetailLossCause2Ext", "DetailLossCause3Ext",
    "PotentialDevelopmentExt", "ClaimRelatedTypeExt", "ClaimTypeExt", "ASideDICExt", "BodilyInjuryExt", "AttachmentPointExt",
    "LimitsInsuranceExt", "NoticeDateExt", "AreaofPracticeExt", "ProjectCategoryExt", "IndustryCategoryExt", "UnderlyingDamagesExt", 
    "ContractTypeExt", "WindHurricaneDedTriExt", "WindHurricaneDedAmtExt", "ThirdPartyAdminsExt", "InspectionDateExt",
    "SiteNumberExt", "SiteNameExt", "ProductInvolvedExt", "ClaimTypeDetailExt", "CertNumberExt", "CertHolderExt", "CertLocationIdExt", 
    "CertEffectiveDateExt", "CertExpirationDateExt", "CertGenAggregateLimitExt", "CertProdCompAggLimitExt", "CertPersAdInjuryAggLimitExt", 
    "CertEachOccLimitExt", "CertDeductibleExt", "CertDeductibleAppExt", "DeductibleStatus", "SubrogationStatus", 
    "SalvageStatus", "OtherRecovStatus", "ReinsuranceStatus", "CodeNameExt", "BrokerPolicyNumberExt" , "TotAggLimitExt",
    "PermissionRequired", "AgentUpdatesExt", "DOLOutsideIndExt", "LegacyClaimNumExt", "DateCompDcsnDue", "ControvertedExt", "EmpQusValidity", 
    "FraudulentCodeExt", "SchedReviewDateExt", "DateFormGivenToEmp", "InsuredPremises", "EmployerTypeExt", "EmployerDetailExt", "JurisClaimNumberExt", 
    "OWCPCaseNumberExt", "WCCatastropheExt", "CLEEExt", "ConcurrentEmp", "DateRptdToEmployer", "ExternalHandlingExt", "ReportStatusExt", "EventHighestInjuryExt", 
    "AirportCodeExt", "AircraftEngineTypeExt", "AircraftMakeExt", "AircraftModelExt" , "AircraftOwnerCategoryExt", "AircraftSizeExt", "AircraftTypeExt",
    "AircraftUseExt", "AircraftYearExt", "TailNumberExt", "StandardAirworthinessExt", "PolicyFormExt", "MAAccidentLocationExt"};
  
    if (util.gaic.CommonFunctions.fieldFromListChanged(claim, fields)) {
      return true;
    }

    if (isInjuredAnimalChange(claim)) {
      return true;
    }
    
    if (isClaimOtherCvrgChange(claim)) {
      return true;
    }
    
    if(isWorkerCompFieldChanged(claim)){
     return true; 
    }
 
    // Defect:8420   
    if(isCLEEExtFieldChanged(claim)){
     return true;
    }
    
    if (claim.isFieldChanged("ManagedCareOrgTypeExt")) {
       if (claim.ManagedCareOrgTypeExt != null) {
          return true;
       }
    }
  
    return false;
  }
  
  // Helper for claim change - deterime if an injured animal was added or removed
  private function isInjuredAnimalChange(claim : Claim) : boolean {
    for (inc in claim.FixedPropertyIncidentsOnly) {
      if (inc.New)  {
        for (prop in claim.Policy.Properties) {
          if (inc.Property.PublicID == prop.Property.PublicID) { 
            return true
          }
        }
      } 
    }

    // look for a deleted injured animal.  Was a fixedpropertyincident, and was policy property 
    // Defect 4885, made changes in accordance to Defect 4705 in CA 4.0 add logic to determine
    // if property was changed from unknown to an actual property. 
    for (originc in (claim.OriginalVersion as Claim).FixedPropertyIncidentsOnly) {
      var fnd = "false";
      for (incd in claim.FixedPropertyIncidentsOnly) {
        if (originc.PublicID == incd.PublicID) {
          fnd = "true";
          if ((originc.Property == null) && (incd.Property != null)) {
            return true;
          }
        }
      }

      if (fnd == "false") { 
        for (prop in (claim.OriginalVersion as Claim).Policy.Properties) {
          if (originc.Property.PublicID == prop.Property.PublicID) { 
            return true
          }
        }
      }
    }

    // Add tests for injured animal on converted claim - that is not on policy property 
    if (claim.LoadCommandID != null) {
      var policyInjAnimal = false;
      if ((claim.FixedPropertyIncidentsOnly != null) && (claim.FixedPropertyIncidentsOnly.length != 0)) {
        for (inc in claim.FixedPropertyIncidentsOnly) {
          policyInjAnimal = false;
          if (inc.Property.LoadCommandID != null) {
            if (claim.Policy.Properties != null && claim.Policy.Properties.length != 0) { 
              for (therisk in claim.Policy.Properties) {
                if (inc.Property.PublicID == therisk.Property.PublicID) { 
                  policyInjAnimal = true;
                }
              }
            }
            if (!policyInjAnimal and inc.Property.Changed) {
              return true;
            }
          }
        }
      }

      for (deletedinc in claim.getRemovedArrayElements("Incidents") ) {
        if (deletedinc typeis FixedPropertyIncident) {
          var delinc = deletedinc as FixedPropertyIncident;
          policyInjAnimal = false;
          if (delinc.Property.LoadCommandID != null) {
            if (claim.Policy.Properties != null && claim.Policy.Properties.length != 0) { 
              for (therisk in claim.Policy.Properties) {
                if (delinc.Property.PublicID == therisk.Property.PublicID) { 
                  policyInjAnimal = true;
                }
              }
            }
            if (!policyInjAnimal) {
              for (prop in (claim.OriginalVersion as Claim).Policy.Properties) {
                if (delinc.Property.PublicID == prop.PublicID) { 
                  policyInjAnimal = true;
                }
              }
            }
            if (!policyInjAnimal) {
              return true;
            }
          }
        }
      }
    }  
    return false
  }
  // Helper for claim change - deterime if an claim other coverage was added, changed, or removed
  private function isClaimOtherCvrgChange(claim : Claim) : boolean {
    if (claim.getAddedArrayElements("UnderlyingCoveragesExt").length != 0 or 
        claim.getRemovedArrayElements("UnderlyingCoveragesExt").length != 0 or 
        claim.getChangedArrayElements("UnderlyingCoveragesExt").length != 0) { 
           return true;
    }
    return false
  }

  // Defect: 8420 CLEEExt fields checked for change 
  private function isCLEEExtFieldChanged(claim : Claim) : boolean {
   if (claim.CLEEExt != null){
      var fields = new String[] {"CLEELocationExt", "CodeExt", "DescriptionOneExt" , "DescriptionTwoExt" , "DescriptionThreeExt"  };
      
      if (util.gaic.CommonFunctions.fieldFromListChanged(claim.CLEEExt, fields)){
        return true;
      }
    }
    return false; 
  } 
   
   private function isWorkerCompFieldChanged(claim : Claim) : boolean {
    if (claim.EmploymentData != null && claim.EmploymentData.isFieldChanged("ScndInjryFnd")) {
      return true;
    } else if (claim.ClaimInjuryIncident != null && (claim.ClaimInjuryIncident.getAddedArrayElements("InjuryDiagnoses").length != 0 or 
        claim.ClaimInjuryIncident.getRemovedArrayElements("InjuryDiagnoses").length != 0 or 
        claim.ClaimInjuryIncident.getChangedArrayElements("InjuryDiagnoses").length != 0)){
      return true;
    }
    return false
  } 
    
}