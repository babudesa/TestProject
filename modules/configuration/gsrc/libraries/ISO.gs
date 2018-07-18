package libraries
uses gw.api.util.DateUtil
uses gw.api.iso.ISOKeyFieldUpdateRequest
uses gw.api.iso.ISOLossSection
uses gw.api.iso.ISOClaimSearchRequest
uses java.lang.IllegalStateException
uses java.util.Date
uses gw.api.iso.ISOConstants
uses java.util.Collections
uses java.util.ArrayList
uses java.lang.Integer
uses util.gaic.CMS.validation.CMSIntegrationValidation
uses util.gaic.CMS.validation.CMSValidationUtil
uses gw.api.iso.ISOProperties
uses gw.policy.RefreshPolicyParallel

@Export
class ISO {

  /**
   * Request scoped variable, used to display informational message to user in the UI. Only
   * set if an ISO request is actually sent
   */
  static var submitInfoMessage request : String
  
  /** Enforce static only access */
  private construct() {
    // Enforces static only access
  }

  /*
   * Show an informational message in the UI if a request has just been sent to ISO. Returns
   * true if there is a message to show, false otherwise. If called multiple times will only
   * add the message once. Should only be called from the UI (because it is
   * only intended for use by the UI we don't have to guard access to the
   * request scoped submitInfoMessage variable)
   */
  static function showSubmitInfoMessage() : boolean {
    if (submitInfoMessage != null) {
      gw.api.util.LocationUtil.addRequestScopedInfoMessage( submitInfoMessage )
      submitInfoMessage = null
      return true
    } else {
      return false
    }
  }

  /**
   * Looks to see if the given claim has changed and needs to be sent to ISO
   * 
   * If this claim should be sent to ISO at the exposure level, immediately calls
   * checkForExposureChanges on each exposure and returns
   * 
   * Otherwise, first checks if the claim is of interest to ISO, that it and alls
   * its exposures are valid and that we haven't already checked it in this message session.
   * Providing the claim passes these tests it is marked as "checked" (so we won't check it
   * again).
   * 
   * The claim is then checked for key field changes - key fields are special fields used by
   * ISO to identify the claim (claim number, policy number, loss date, agencyid) and if any of them change
   * a special key field update is sent to ISO.
   * 
   * Then the claim is checked for other changes. If any field relevant to ISO has changed, or
   * if the ISOStatus is "ResendPending" (i.e. the user has pressed the send to ISO button) then
   * a replacement search message is sent to ISO.
   */ 
  static function checkForClaimChanges(messageContext : MessageContext, claim : Claim) {
    //If not claim level messaging (set in iso.properties), check for exposure changes only
    if (!claim.ISOClaimLevelMessaging) {
      for (exposure in claim.ISOOrderedExposures) {
        checkForExposureChanges(messageContext, exposure)
      }
      return
    }
    // check for Claims's AssignedUser
    if (claim.AssignedUser == null) {
      return
    }
    //If ISO is not enabled, the claim is not valid for ISO, and if the claim has already been checked
    //for changes, then return
    if (!claim.ISOEnabled
        || !isValidISO(claim)
        || isCheckedForChanges(messageContext, claim)) {
      return
    }
     // if this claim is refreshed from the batch process  - not in EM83
    // then do not send to ISO
    if (RefreshPolicyParallel.wasClaimRefreshedFromBatchRefreshPolicy(claim.ID)){
      return
    }   
    markAsCheckedForChanges(messageContext, claim)
    var keyFieldChanged = false;
    if (claim.ISOStatus == "Sent") {
      keyFieldChanged = checkForKeyFieldChanges(messageContext, claim)
    }
    
    if(!keyFieldChanged and claim.Exposures.where(\ e -> e.ReconnectFailExt).Count > 0){
      return
    }
    
    if (keyFieldChanged
        || claim.New
        || claimFieldChanged(claim, true)
        || claim.ISOOrderedExposures.hasMatch(\ e -> (exposureFieldChanged(e, true) && e.isValid("iso")))
        || claim.ISOStatus == "ResendPending"
        || icdCodeAdded(claim)) {
      createSearchMessage(messageContext, claim)
    }
  }
  
  static function icdCodeAdded(claim : Claim):boolean{
    if(claim.ClaimInjuryIncident != null && 
       claim.ClaimInjuryIncident.InjuryDiagnoses.HasElements && 
       claim.ClaimInjuryIncident.InjuryDiagnoses*.Changed.contains(true)){
      return true 
    }
    
    for(exp in claim.Exposures.where(\ e -> typeof e.Claimant == Person && (e.MedicareExposureExt || e.IsMedicareExposureExt))){
      var claimantPerson = exp.Claimant as Person
      if(claimantPerson.ContactISOMedicareExt != null && claimantPerson.ContactISOMedicareExt.ContactICDExt*.Changed.contains(true)){
        return true
      }
    }
    
    return false
  }

  /**
   * Looks to see if the given exposure has changed and needs to be sent to ISO. If this claim should
   * be sent to ISO at the claim level, immediately calls checkForClaimChanges on the exposure's claim
   * and does nothing else.
   * 
   * Otherwise, first checks if the exposure is of interest to ISO, that it is valid and that we
   * haven't already checked it in this message session. Providing the exposure passes these tests it is
   * marked as "checked" (so we won't check it again).
   * 
   * The exposure is then checked for key field changes - key fields are special fields used by
   * ISO to identify the claim (claim number, policy number, agencyid) and if any of them change
   * a special key field update is sent to ISO.
   * 
   * Then the exposure is checked for other changes. If any field relevant to ISO has changed, or
   * if the ISOStatus is "ResendPending" (i.e. the user has pressed the send to ISO button) then
   * a replacement search message is sent to ISO.
   */ 
  static function checkForExposureChanges(messageContext : MessageContext, exposure : Exposure) {
    if (!exposure.ISOEnabled
        || !exposure.isValid("iso")
        || !exposure.Claim.isValid("iso", false)
        || isCheckedForChanges(messageContext, exposure)
        || exposure.ReconnectFailExt) {
      return
    }
    if (exposure.Claim.ISOClaimLevelMessaging) {
      checkForClaimChanges(messageContext, exposure.Claim)
      return
    }
    markAsCheckedForChanges( messageContext, exposure )
    var keyFieldChanged = false;
    if (exposure.ISOStatus == "Sent" && exposure.ReconnectFailExt==false) {
      keyFieldChanged = checkForKeyFieldChanges(messageContext, exposure)
    }
    if ((keyFieldChanged
        || exposure.New
        || exposureFieldChanged(exposure, false)
        || claimFieldChanged(exposure.Claim, false)
        || exposure.ISOStatus == "ResendPending")
        && exposure.ReconnectFailExt==false) {
      createSearchMessage(messageContext, exposure)
    }
  }

  /**
   * Checks to see if a key field (claim number, policy number, agencyid or LossDate) has changed. If so
   * creates a new key field update message to send to ISO
   * Defect#7478 Also checks if it should send the original Loss Date for ELD, PLD, Spec E&S, and ENV business units 
   * Also for ELD, PLD, Spec E&S, and ENV, if only LossDate changed, it doesn't generate an Update message
   */ 
  static function checkForKeyFieldChanges(messageContext : MessageContext, reportable : ISOReportable) : boolean {
    if (!keyFieldChanged(reportable) || 
       (reportable typeis Claim && reportable.ShouldSendOriginalLossDate 
        && keyFieldOnlyLossDateChanged(reportable))) {
      return false
    }
    var payload = new ISOKeyFieldUpdateRequest(reportable).populate().asUTFString()
    if (payload != null) {
      var msg = messageContext.createMessage(payload)
      msg.MessageCode = ISOConstants.KEY_FIELD_UPDATE_MESSAGE_CODE
      msg.MessageRoot = reportable
      reportable.ISOSendDate = new java.util.Date()
      //setSubmitInfoMessage()
      return true;
    } else {
      return false;
    }
  }

  // Returns true if any field of interest to ISO has changed. This check is split into separate
  // functions which check the exposure, claim, policy etc.
  static function anyFieldChanged(exposure : Exposure, claimLevelMessaging : boolean) : boolean {
    return exposureFieldChanged(exposure, claimLevelMessaging) || 
           claimFieldChanged(exposure.Claim, claimLevelMessaging) || 
           policyFieldChanged(exposure.Claim.Policy)
  }
  
  /**
   * Returns true if any exposure fields of interest to ISO have changed
   */
  static function exposureFieldChanged(exposure : Exposure, claimLevelMessaging : boolean) : boolean {
    var fieldsChanged : boolean = false
    if (fieldFromListChanged(exposure, { "Coverage", "PrimaryCoverage", "CoverageSubtype", "ISOStatus",
     "LostPropertyType","TotalLossIndExt", "AssignedUser","AssignmentDate"})
     || fieldFromListChanged( exposure.Incident, new String[] { "Description" } )
     || (exposure.isFieldChanged("ClaimantDenorm") || contactFieldChanged( exposure.ClaimantDenorm ))) {
      return true
    }
    //Injury/Casualty Payload
    if(exposure.getISOPayloadType() == "Injury") {
      if(fieldFromListChanged( exposure, new String[] { "InjuryNatureDescExt" } ) ) {
        return true
      }
    }
    
    //Vehicle Payload    
    if(exposure.getISOPayloadType() == "Vehicle") {
      if((exposure.ExposureType=="ab_AutoPropDam" || exposure.ExposureType=="ab_PhysicalDamage")
      && exposure.VehicleIncident!=null && exposure.VehicleIncident.Vehicle!=null) {
        if(fieldFromListChanged( exposure.VehicleIncident.Vehicle, new String[] { "Vin", "Make", "Model", "Year" } ) ) {
          return true
        }
      } else if (exposure.ExposureType=="ab_PropertyDamage" && exposure.Coverage typeis VehicleCoverage
        && (exposure.Coverage.RiskUnit as entity.VehicleRU).Vehicle != null) {
        if(fieldFromListChanged( exposure.VehicleIncident.Vehicle, new String[] { "Vin", "Make", "Model", "Year" } ) ){
          return true      
        }
      }  
    }
    
    //Boat Payload
    if(exposure.getISOPayloadType() == "Boat" && exposure.VehicleIncident.Vehicle!=null) {
      if(fieldFromListChanged( exposure.VehicleIncident.Vehicle, new String[] { "SerialNumber", "Make", "Year" } ) ){
        return true       
      }
    }

    //Property Payload - no Property Payload fields currently
    //CMS Query Data - Included in Contact fields
    //Total Loss Reporting
    if(exposure.needsTotalLossReporting() && exposure.TotalLossIndExt ==  true
    && exposure.VehicleIncident!=null && exposure.VehicleIncident.Vehicle!=null) {
      if(fieldFromListChanged( exposure.VehicleIncident,
        new String[] { "OwnLienAtAccidentExt", "OwnLienAtClaimCloseExt", "OdomRead", "ReasonForTotalLossExt",
        "IsOwnerRetainingExt", "Vehicle" })
      || contactFieldChanged( exposure.VehicleIncident.OwnLienAtAccidentExt )
      || contactFieldChanged( exposure.VehicleIncident.OwnLienAtClaimCloseExt )
      || fieldFromListChanged( exposure.VehicleIncident.Vehicle,
        new String[] { "Vin", "Make", "Model", "Year", "VehicleTypeExt", "VehicleStyleExt" })) {
        return true
      }
    }
    
    //CMS Reporting Data
    if(util.gaic.CMS.validation.CMSValidationUtil.generalPrecondition(exposure)){
      var cmsVal = new util.gaic.CMS.validation.CMSIntegrationValidation(exposure)
      util.gaic.CMS.validation.CMSValidationUtil.validate(cmsVal)
      if(cmsVal.ValidationMessage == "" && exposure.IsMedicareExposureExt && typeof exposure.Claimant == Person && medicareFieldChanged(exposure)){
        return true
      }
    }
    return fieldsChanged;
  }
  
  /**
   * Returns true if any claim fields of interest to ISO have changed
   */
  static function claimFieldChanged(claim : Claim, claimLevelMessaging : boolean) : boolean {
    var fieldsChanged : boolean = false
    if (fieldFromListChanged(claim, {"Policy", "ClaimNumber", "LossDate", "LossLocation", "ISOEnabled",
          "LossCause", "Description", "ex_DetailLossCause", "AssignedUser","AssignmentDate","State", "BodilyInjuryExt", "ExternalHandlingExt"})
        || addressFieldChanged(claim.LossLocation)
        || claim.isFieldChanged("InsuredDenorm")
        || claim.isFieldChanged("CertHolderExt")
        || (contactFieldChanged(claim.InsuredDenorm) || contactFieldChanged(claim.Insured) || contactFieldChanged(claim.CertHolderExt))) {
      fieldsChanged = true
    }
    return fieldsChanged
  }
  
  /**
   * Are these key fields different from the specified ones? Not quite an
   * equality operation because if the loss dates only differ in the time of
   * day then the key fields are not considered to be different.
   * 
   */
  static function keyFieldChanged(reportable : ISOReportable) : boolean {
    var claim = reportable.ISOClaim 
    // Changing claim's AgencyID if the new adjuster's group's AgencyId changed
    var newID = getClaimLevelISOAgencyId(claim)
    if(claim.AgencyId != newID)
      claim.AgencyId = newID
    
    return claim.isFieldChanged("ClaimNumber")
        || claim.isFieldChanged("AgencyId")
        || claim.Policy.PolicyNumber != claim.OriginalPolicyNumber
        || (claim.isFieldChanged("LossDate")
            && DateUtil.compareIgnoreTime(claim.getOriginalValue("LossDate") as Date, claim.LossDate) != 0)
  }
  // Checks if from all Key Fields only LossDate changed
  static function keyFieldOnlyLossDateChanged(reportable : ISOReportable) : boolean {
    var claim = reportable.ISOClaim 
    return !claim.isFieldChanged("ClaimNumber")
        && !claim.isFieldChanged("AgencyId")
        && claim.Policy.PolicyNumber == claim.OriginalPolicyNumber
        && (claim.isFieldChanged("LossDate")
            && DateUtil.compareIgnoreTime(claim.getOriginalValue("LossDate") as Date, claim.LossDate) != 0)
  }
  
  /**
   * Helper for claimFieldChanged; returns true if anything of interest to ISO has changed in the claim
   * injury incident
   */
  static function claimInjuryIncidentChanged(injuryIncident : InjuryIncident) : boolean {
    return injuryIncident.New
        || detailedBodyPartChanged(injuryIncident.FirstBodyPart)
        || fieldFromListChanged(injuryIncident, { "Description" })
  }
  
  /**
   * Helper for exposureFieldChanged and claimInjuryIncidentChanged; see if the primary body part field changed
   */
  static function detailedBodyPartChanged(bodyPart : BodyPartDetails) : boolean {
    return bodyPart.New || fieldFromListChanged(bodyPart, { "Ordering", "DetailedBodyPart"})
  }

  /**
   * Helper for anyFieldChanged; returns true if any policy fields of interest to ISO have changed
   */
  static function policyFieldChanged(policy : Policy) : boolean {
    var fieldsChanged : boolean = false
    if(fieldFromListChanged(policy, new String[] { "PolicyNumber" }) ||
       contactFieldChanged(policy.insured)){
      fieldsChanged = true   
    }
    return fieldsChanged
  }

  /**
   * Helper for anyFieldChanged; returns true if any contact fields of interest to ISO have changed
   */
  static function contactFieldChanged(contact : Contact) : boolean {
    var fieldsChanged : boolean =     
      fieldFromListChanged(contact,{"PrimaryAddress", "WorkPhone", "HomePhone", "TaxId"}) ||       //common contact fields
      (contact typeis Person && personFieldChanged(contact)) ||                                    //person and medicare fields
      (contact typeis Company && (companyFieldChanged(contact))) ||                                //company fields
      addressFieldChanged(contact.PrimaryAddress)                                                  //primary address fields
    
    return fieldsChanged
  }
  
  static function personFieldChanged(person : Person) : boolean {
    return fieldFromListChanged(person,{"LastName", "FirstName", "MiddleName", "DateOfBirth", "Gender", "HICNExt", 
                                        "MedicareEligibleExt", "SendPartyToCMSExt", "LegalFNameExt", "LegalMNameExt", "LegalLNameExt"})
  }
  
  static function companyFieldChanged(company : Company) : boolean {
    return fieldFromListChanged(company, {"Name"})
  }
  
  static function medicareFieldChanged(exposure : Exposure) : boolean{
    var fieldChanged : boolean = false
    var contactISO = exposure.Claimant.ContactISOMedicareExt
    
    if(contactISO != null){
      var fieldsToMonitor = new String[] {"AllegedHarmExt", "CMSIncidentDateExt", "ExhaustDateExt", "NFILLimitExt",
                                          "ORMEndDateExt", "ORMIndExt", "ProductBrandNameExt", "ProductGenericNameExt",
                                          "ProductLiabTypeExt", "ProductManufacturerExt", "StateOfVenueExt",
                                          "ContactICDExt", "TPOCExt"}
                           
      if(fieldFromListChanged(contactISO, fieldsToMonitor)){
        return true
      }
      
      //ICD9 data
      if(contactISO.ContactICDExt != null){
        for(icd in contactISO.ContactICDExt){
           if(fieldFromListChanged(icd, {"CauseOfInjury", "ICDCode"})){
             return true
           }
        }
      }
      
      //TPOC data
      if(contactISO.TPOCExt != null){
        for(tpoc in contactISO.TPOCExt){
          if(fieldFromListChanged(tpoc, {"CMSTPOCAmount", "CMSTPOCDate", "CMSTPOCStartDate", "ExposureExt"})){
            return true
          }
        }
      }
      
      var contactContactsOfInterest = exposure.Claimant.AllContactContacts.where(\ cc -> cc.ClaimantAddRepFlagExt ||
                                                                                        cc.ClaimantFlagExt ||
                                                                                        cc.InjuredPartyFlagExt)
      for(contCont in contactContactsOfInterest){
        if(contCont.Changed){
          return true
        }
      }
    }
    
    return fieldChanged 
  }

  /**
   * Helper for anyFieldChanged; returns true if any address fields of interest to ISO have changed
   */
  static function addressFieldChanged(address : Address) : boolean {
    return fieldFromListChanged(address, { "AddressLine1", "AddressLine2", "AddressLine3", "City", "State", "PostalCode" })
  }

  /**
   * Utility method, checks if any of the named fields of the given bean have changed
   */
  static function fieldFromListChanged(bean : KeyableBean, fields : String[]) : boolean {
    if (bean == null) {
      return false;
    }
    for (field in fields) {
      if (bean.isFieldChanged(field)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns true if the given reportable (claim or exposure) has already been checked for changes in this
   * message session. Prevents multiple messages if a single bundle commit results in several change
   * messages
   */
  static function isCheckedForChanges(messageContext : MessageContext, reportable : ISOReportable) : boolean {
    var checkedKey = getReportableHandledKey(reportable);
    return messageContext.SessionMarker.getFromTempMap(checkedKey) != null;
  }

  /**
   * Marks the reportable (claim or exposure) as checked for this message session - see
   * isCheckedForChanges, above
   */
  static function markAsCheckedForChanges(messageContext : MessageContext, reportable : ISOReportable) {
    var checkedKey = getReportableHandledKey(reportable);
    messageContext.SessionMarker.addToTempMap(checkedKey, "Checked");
  }

  /**
   * Helper method for isCheckedForChanges, markAsCheckedForChanges. Constructs a key to store in
   * the session temp map, used to store a value which marks this reportable as already checked
   */
  static function getReportableHandledKey(reportable : ISOReportable) : String {
    return "ISOReportableHandled_" + reportable.ID.Value;
  }

  /**
   * Creates a new search message to send to ISO. Used when a reportable becomes ISO valid or if a
   * field of interest to ISO changes. This function should be suitable for most customers as it is,
   * but it calls the createSearchPayload function to create the message payload and that method
   * will need to be customized by different customers according to the exposure types in their
   * system
   */
  static function createSearchMessage(messageContext : MessageContext, reportable : ISOReportable) {
    var exposure = reportable.ISOExposure
    var payload = exposure != null
        ? createExposureLevelSearchPayload(exposure)
        : new ISOClaimSearchRequest(reportable.ISOClaim).createClaimLevelSearchPayload()
    if (payload != null) {
      var msg = messageContext.createMessage(payload)
      msg.MessageCode = ISOConstants.CLAIM_SEARCH_MESSAGE_CODE
      msg.MessageRoot = reportable
      reportable.ISOSendDate = new java.util.Date()
      reportable.ISOStatus = "Sent"
      //setSubmitInfoMessage()
    } else {
      if (exposure != null) {
        exposure.ISOStatus = "NotOfInterest"
      }
    }
  }

  /**
   * Sets a request scoped variable used to store an informational message
   * to display to the user. Because this method is called from event
   * messaging rules which can execute in any context (due to user change,
   * batch process, SOAP call etc.) it has to be careful about accessing
   * the request scoped variable - it's possible it won't be available in
   * the current context in which case setting it will throw an exception.
   * However setting the variable is bound to work in the one case we
   * actually care about, which is when the user has made a change through
   * the UI and we want to inform the user that their change resulted in
   * a message being sent to ISO
   */
  static function setSubmitInfoMessage() {
    try {
      submitInfoMessage = displaykey.Web.ISO.Send.InfoMessage
    } catch (e) {
      // If couldn't set request scoped variable then don't worry - if there's
      // no request scope then there is no user to display the message to in
      // any case
    }
  }
  
  /**
   * Create an ISO search message payload appropriate to the given exposure. At this point we
   * know the exposure is valid or changed so we need to send a new search request to ISO. This
   * function examines the exposure type and decides which type of payload to send. This function
   * will need to be customized according to the exposure types configured at a customer site.
   * If this method returns null then the exposure will be marked as "not of interest" to ISO, and
   * no message will be sent. 
   */
  static function createExposureLevelSearchPayload(exposure : Exposure) : String {
    var payloadGenerator = constructExposureLevelLossSection(exposure)
    if (payloadGenerator != null) {
      return payloadGenerator.populate().asUTFString()
    } else {
      return null
    }
  }
  
  static function constructExposureLevelLossSection(exposure : Exposure) : ISOLossSection {
    var lossSectionType = exposure.ISOLossSectionType
    if (lossSectionType == null) {
      return null
    }
    var constructor = lossSectionType.TypeInfo.getConstructor({entity.Exposure})
    if (constructor == null) {
      throw new IllegalStateException(displaykey.Java.Error.ISO.NoConstructorForExposure(lossSectionType))
    }
    return constructor.Constructor.newInstance({exposure}) as ISOLossSection
  }

  // Called from the exposure change event handling to see if the given exposure has just received
  // new match reports from ISO. If so customers may choose to add an activity, or take some other
  // action to warn the user that match reports are available. Note that whenever new match reports
  // come in the ISOReceiveDate field is updated.
  static function hasNewMatchReports(exposure : Exposure) : boolean {
    if (!fieldFromListChanged(exposure, new String[] {"ISOReceiveDate"})) {
      return false;
    }
    var reports = exposure.ISOMatchReports;
    for (report in reports) {
      if (report.New) {
        return true;
      }
    }
    return false;
  }
  
  // Called from the exposure change event handling to see if the given exposure has just received
  // an error response from ISO. If it has then the error message is returned, otherwise null is
  // returned
  function getNewErrorMessage(exposure : Exposure) : String {
    var result : String = null;
    var added = exposure.getAddedArrayElements("Text");
    for (text in exposure.Text) {
      if (text.TextType == "ISOErrorMessage" &&
          (text.Changed || exists (newText in added where newText == text))) {
        result = text.Text;
        break;
      }
    }
    return result;
  }
  
  static function isValidISO(claim : Claim) : boolean {
    if (claim.isValid("iso", false)) {
      for (exposure in claim.Exposures) {
        if (exposure.isValid("iso")) {
          return true
        }
      }
    }
    return false
  }
  
  static function getISONoteBody(exposure : Exposure) : String {
    var sendNote = ""
    var exposureList : List<Exposure> = new ArrayList<Exposure>()
    var tempExpNumList : List = new ArrayList()
    
    if(exposure.Claim.ISOClaimLevelMessaging){ 
      sendNote = "Claim " + exposure.Claim.ClaimNumber + " sent to ISO.\nFeatures sent:\n"
      for(exp in exposure.Claim.Exposures.where(\ e -> e.ISOEnabledExt)){
        if(exp.isValid( "iso" ) and exp.Coverage!=null){
          tempExpNumList.add(exp.ClaimOrder)
        }
      }
      Collections.sort(tempExpNumList as java.util.List<Integer>)
      for(num in tempExpNumList){
        for(exp in exposure.Claim.Exposures){
          if(exp.ClaimOrder==num){
            exposureList.add(exp)
          }
        }
      }
      for(expo in exposureList){
        if(isValidSendToISOMedicare(expo)){
          sendNote = sendNote + "  " + expo.DisplayName + " - Medicare Info included\n"
        }else{
          sendNote = sendNote + "  " + expo.DisplayName + "\n"
        }
       }
    } else {
      sendNote = exposure.DisplayName + " sent to ISO."
    }
    return sendNote
  }
  
  static function isValidSendToISOMedicare(exposure : Exposure) : boolean {
      if(exposure.Claimant typeis Person && exposure.Claimant.MedicareEligibleExt){
      var cmsVal = new CMSIntegrationValidation(exposure);
      CMSValidationUtil.validate(cmsVal)
      return (exposure.IsMedicareExposureExt or exposure.MedicareExposureExt)
              and cmsVal.ValidationMessage.Empty
      }      
      return false
  }
  
  static function getISONoteBody(claim : Claim) : String {
    var sendNote = ""
    var exposureList : List<Exposure> = new ArrayList<Exposure>()
    var tempExpNumList : List = new ArrayList()
    
    if(claim.ISOClaimLevelMessaging){ 
      sendNote = "Claim " + claim.ClaimNumber + " sent to ISO.\nFeatures sent:\n"
      for(exp in claim.Exposures){
        if(exp.isValid( "iso" ) and exp.Coverage!=null){
          tempExpNumList.add(exp.ClaimOrder)
        }
      }
      Collections.sort(tempExpNumList as java.util.List<Integer>)
      for(num in tempExpNumList){
        for(exp in claim.Exposures){
          if(exp.ClaimOrder==num){
            exposureList.add(exp)
          }
        }
      }
      for(expo in exposureList){
        if(isValidSendToISOMedicare(expo)){
          sendNote = sendNote + "  " + expo.DisplayName + " - Medicare Info included\n"
       }else{
         sendNote = sendNote + "  " + expo.DisplayName + "\n"
       }
      }
    }
    
    return sendNote
  }  
  
  static property get ClaimCloseNoteBody() : String {
    return "Claim close notice sent to ISO." 
  }
  
  /** function to set the appropriate ISO AgencyId
   *  for prod environment, if new assigned group has AgencyId then it is set, otherwise, AgencyId "G01610514" is set
   *  
   *  for non-prod environments, we only have 2 AgencyIds setup with ISO for each server, 
   *  and if new group has no AgencyId, the id from the properties file is set,
   *  and if new group doesn't have AgencyId, the second valid AgencyId is set.
   */ 
  static function getClaimLevelISOAgencyId(claim:Claim) : String {
    var environment = gw.api.system.server.ServerUtil.getEnv()
    var _properties = ISOProperties.instance()
    var agencyId : String = _properties.AgencyId
    
    if(environment == "prod") {
      if (claim.AssignedGroup.ISOAgencyIDExt != null) {
        agencyId = claim.AssignedGroup.ISOAgencyIDExt.Code
      } else {
        agencyId = "G01610514"
      }
    }
    else{
      if(claim.AssignedGroup.ISOAgencyIDExt != null){
        switch(environment){
          case "dev": agencyId = "G01600060"
          break
          case "dev2": agencyId = "G01600069"
          break
          case "dev3": agencyId = "G01600071"
          break
          case "int": agencyId = "G01600072"
          break
          case "int2": agencyId = "G01600077"
          break
          case "int3": agencyId = "G01600080"
          break
          case "uat": agencyId = "G01600082"
          break
          case "cert": agencyId = "G01600086"
        }
      }
    }
    claim.AgencyId=agencyId
    
    // commented out as now we set new AgencyIds for new assigned groups
    /*if(Claim.AgencyId == null) {
      Claim.AgencyId = agencyId
    }  */
    
    return claim.AgencyId
  } // end getClaimLevelISOAgencyId
  
  // Defect#6186 Function checks if the user making updates is Script Superuser (scriptsu)
  static function updatedByScriptSu(mesContext:MessageContext):Boolean{
    var user:User
    if(mesContext.Root typeis Claim)
      user = mesContext.Root.UpdateUser
    if(mesContext.Root typeis ClaimContact)
      user = mesContext.Root.Claim.UpdateUser
    if(mesContext.Root typeis ClaimContactRole)
      user = mesContext.Root.ClaimContact.Claim.UpdateUser
    if(mesContext.Root typeis Exposure)
      user = mesContext.Root.Claim.UpdateUser
    if(mesContext.Root typeis Policy)
      user = mesContext.Root.Claim.UpdateUser
    
    if(user == util.custom_Ext.finders.getUserOb("scriptsu")){
      return true
    }else{
      return false
    }
  }
} // end ISO
