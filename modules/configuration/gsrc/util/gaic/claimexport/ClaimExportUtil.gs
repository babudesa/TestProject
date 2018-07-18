package util.gaic.claimexport


uses gw.xml.xsd.types.XSDDateTime
uses util.gaic.claimexport.gaigclaimexport.enums.GenderEnum
uses util.gaic.claimexport.gaigclaimexport.enums.ClaimStatusEnum
uses util.gaic.claimexport.gaigclaimexport.enums.RecordTypeEnum
uses java.text.SimpleDateFormat
uses java.util.Locale
uses java.util.TimeZone
uses util.gaic.claimexport.gaigclaimexport.BodyPart
uses util.gaic.claimexport.gaigclaimexport.DiagnosticCode
uses java.util.ArrayList
uses gw.api.util.StringUtil
uses util.gaic.policyexport.PolicyExportUtil
uses gw.api.database.Relop
uses gw.api.util.DateUtil
uses gw.api.database.Query



class ClaimExportUtil {

  private construct() {

  }

  /**
   * Generates a claim export message
   */
  @Param("claim", "the claim to generate the message from")
  @Param("recordType", "the record type associated with this message") 
  @Returns("the claim export message XML string")
  static function buildClaimExportMessage(claim : Claim, recordType : RecordTypeEnum) : String {
    
    var exportClaim = new util.gaic.claimexport.gaigclaimexport.CCExportClaim()
    var medFeature = claim.Exposures.firstWhere(\ e -> e.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS)
    
    exportClaim.RecordType = recordType
    if(claim.ClaimInjuryIncident.ReturnToWorkActual == true && claim.ClaimInjuryIncident.ReturnToWorkDate != null) {
      exportClaim.ActualRTWDate = formatDateforXSD(claim.ClaimInjuryIncident.ReturnToWorkDate)
    } else if(claim.ClaimInjuryIncident.ReturnToWorkDate != null) {
      exportClaim.ProjectedRTWDate = formatDateforXSD(claim.ClaimInjuryIncident.ReturnToWorkDate)
    }
    exportClaim.ClaimId = claim.PublicID
    exportClaim.InjuryDesc = claim.Description
    exportClaim.ClaimType = determineClaimType(claim)
    exportClaim.CauseOfInjuryCode = parseCauseOfInjuryCodeForNcciCode(claim.ex_DetailLossCause)
    exportClaim.CauseOfInjuryDesc = claim.ex_DetailLossCause.DisplayName
    exportClaim.Adjuster.FirstName = claim.AssignedUser.Contact.FirstName
    exportClaim.Adjuster.LastName = claim.AssignedUser.Contact.LastName
    exportClaim.Adjuster.EmailAddress = claim.AssignedUser.Contact.EmailAddress1
    exportClaim.Adjuster.PhoneNumber = claim.AssignedUser.Contact.PrimaryPhoneValue
    exportClaim.Adjuster.FaxNumber = claim.AssignedUser.Contact.FaxPhone
    exportClaim.Adjuster.UserId = claim.AssignedUser.PublicID
    exportClaim.Adjuster.SupervisorUserId = claim.AssignedGroup.Supervisor.PublicID
    exportClaim.CarrierKnowDate = formatDateforXSD(claim.ReportedDate)
    exportClaim.Claimant.ClaimantId = claim.claimant.PublicID
    exportClaim.Claimant.FirstName = claim.claimant.FirstName
    exportClaim.Claimant.MiddleInitial = claim.claimant.MiddleName
    exportClaim.Claimant.LastName = claim.claimant.LastName
    exportClaim.Claimant.AddressLine1 = claim.claimant.PrimaryAddress.AddressLine1
    exportClaim.Claimant.AddressLine2 = claim.claimant.PrimaryAddress.AddressLine2
    exportClaim.Claimant.City = claim.claimant.PrimaryAddress.City
    exportClaim.Claimant.State = claim.claimant.PrimaryAddress.State.Code
    exportClaim.Claimant.Zip = claim.claimant.PrimaryAddress.PostalCode
    exportClaim.Claimant.DateOfBirth = formatDateforXSD(claim.claimant.DateOfBirth)
    exportClaim.Claimant.Gender = translateGender(claim.claimant.Gender)
    exportClaim.Claimant.PhoneNumber = claim.claimant.PrimaryPhoneValue
    exportClaim.Claimant.TaxId = claim.claimant.TaxID
    exportClaim.ClaimNumber = claim.ClaimNumber
    exportClaim.BusinessUnitCode = getWCBusinessUnitCode(claim).Code
    exportClaim.ClaimStatus = translateClaimStatus(claim.State)
    exportClaim.CreateDate = formatDateforXSD(claim.CreateTime)
    exportClaim.CreateUserId = claim.AssignedUser.PublicID
    exportClaim.DateOfLoss = formatDateforXSD(claim.LossDate)
    if(claim.ClaimInjuryIncident!= null) {
      exportClaim.NatureOfInjuryCode = claim.ClaimInjuryIncident.DetailedInjuryType.Code
      exportClaim.NatureOfInjuryDesc = claim.ClaimInjuryIncident.DetailedInjuryType.DisplayName
    }
    if(claim.ClaimInjuryIncident != null && claim.ClaimInjuryIncident.BodyParts != null){
        var primaryPart : BodyPartDetails = null
        
        //if primary is not selected then pick the first part
        if(!exists(part in claim.ClaimInjuryIncident.BodyParts where part.PrimaryExt)){
          primaryPart = claim.ClaimInjuryIncident.BodyParts.first()
          exportClaim.InjuredBodyParts.PrimaryInjuredBody.BodyPartCode = primaryPart.DetailedBodyPart.Code
          exportClaim.InjuredBodyParts.PrimaryInjuredBody.BodyPartDesc = primaryPart.DetailedBodyPart.DisplayName
        }
        
        //if primary is selected
        if(exists(part in claim.ClaimInjuryIncident.BodyParts where part.PrimaryExt)){
          primaryPart = claim.ClaimInjuryIncident.BodyParts.firstWhere(\ b -> b.PrimaryExt)

          if(primaryPart != null){
      	  exportClaim.InjuredBodyParts.PrimaryInjuredBody.BodyPartCode = primaryPart.DetailedBodyPart.Code
      	  exportClaim.InjuredBodyParts.PrimaryInjuredBody.BodyPartDesc = primaryPart.DetailedBodyPart.DisplayName
          }
        }
        //if the body part list is larger than 1 then get the rest
        if(claim.ClaimInjuryIncident.BodyParts.Count > 1 ) {
          exportClaim.InjuredBodyParts.BodyParts = getInjuredBodyParts(claim)
        }
      
    }
    if(claim.ClaimInjuryIncident.InjuryDiagnoses != null && !claim.ClaimInjuryIncident.InjuryDiagnoses.IsEmpty){
      
      //if no primary code is selected then pick first code
      if(!exists(id in claim.ClaimInjuryIncident.InjuryDiagnoses where id.IsPrimary)){
        exportClaim.DiagnosisCodes.PrimaryDiagnosticCode = claim.ClaimInjuryIncident.InjuryDiagnoses.first().ICDCode.Code
       //if there is a primary code selected then use that code
      } else if(exists(id in claim.ClaimInjuryIncident.InjuryDiagnoses where id.IsPrimary)) {
        exportClaim.DiagnosisCodes.PrimaryDiagnosticCode = claim.ClaimInjuryIncident.InjuryDiagnoses.firstWhere(\ i -> i.IsPrimary).ICDCode.Code
      }
      
      //if the icd code list is larger than 1 then get the rest
      if(claim.ClaimInjuryIncident.InjuryDiagnoses.Count > 1) {
        exportClaim.DiagnosisCodes.DiagnosticCodes = getIcdCodes(claim)
      }
      
      
    }    
    exportClaim.JurisdictionClaimID = claim.JurisClaimNumberExt != null ? String.valueOf(claim.JurisClaimNumberExt) : null
    exportClaim.JurisdictionState = claim.JurisdictionState.Code
    exportClaim.FederalJurisdiction = isFederalJurisdiction(claim)
    exportClaim.LegalCloseDate = formatDateforXSD(claim.CloseDate)
    exportClaim.MedCloseDate = formatDateforXSD(medFeature.CloseDate)
    exportClaim.MMIDate = formatDateforXSD(claim.MMIdate)
    exportClaim.ModifiedDate = formatDateforXSD(claim.UpdateTime)
    exportClaim.ModifiedUserId = claim.AssignedUser.PublicID
    exportClaim.NatureOfInjuryCode = claim.ClaimInjuryIncident.DetailedInjuryType.Code
    exportClaim.Policy.Insurer.CarrierId = getCarrierFEIN(claim.Policy.IssuingCompanyExt) // using the taxid as the key
    exportClaim.Policy.Insurer.TaxId = getCarrierFEIN(claim.Policy.IssuingCompanyExt)
    exportClaim.Policy.Insurer.CarrierCode = getCarrierCode(claim.Policy.IssuingCompanyExt)
    exportClaim.Policy.Insurer.CarrierName = claim.Policy.IssuingCompanyExt.DisplayName
    exportClaim.Policy.CreateDate = formatDateforXSD(claim.Policy.CreateTime)
    exportClaim.Policy.CreateUserId = claim.Policy.CreateUser.PublicID
    exportClaim.Policy.Insured.InsuredId = claim.Policy.insured.PublicID
    exportClaim.Policy.Insured.TaxId = claim.Policy.insured.TaxID
    exportClaim.Policy.Insured.AddressLine1 = claim.Policy.insured.PrimaryAddress.AddressLine1
    exportClaim.Policy.Insured.AddressLine2 = claim.Policy.insured.PrimaryAddress.AddressLine2
    exportClaim.Policy.Insured.City = claim.Policy.insured.PrimaryAddress.City
    exportClaim.Policy.Insured.State = claim.Policy.insured.PrimaryAddress.State.Code
    exportClaim.Policy.Insured.Zip = claim.Policy.insured.PrimaryAddress.PostalCode
    exportClaim.Policy.Insured.InsuredName = claim.Policy.insured.DisplayName
    exportClaim.Policy.Insured.PhoneNumber = claim.Policy.insured.PrimaryPhoneValue
    exportClaim.Policy.ModifiedDate = formatDateforXSD(claim.Policy.UpdateTime)
    exportClaim.Policy.ModifiedUserId = claim.Policy.UpdateUser.PublicID
    exportClaim.Policy.PolicyEffectiveDate = formatDateforXSD(claim.Policy.EffectiveDate)
    exportClaim.Policy.PolicyNumber = claim.Policy.PolicyNumber
    exportClaim.Policy.PolicyTerminationDate = formatDateforXSD(claim.Policy.ExpirationDate)
    exportClaim.Policy.NAICSCode = claim.Policy.NAICSCodeExt.Code
    exportClaim.Policy.PolicyMod = claim.Policy.PolicySuffix
    exportClaim.Policy.PolicySymbol = claim.Policy.PolicyType.Code
    exportClaim.Policy.PolicyZone = parsePolicyZoneFromVersion(claim.Policy)
    exportClaim.Policy.ProfitCenter = claim.Policy.ex_Agency.ex_AgencyProfitCenter
    exportClaim.RecordType = recordType
    exportClaim.ReopenDate = formatDateforXSD(claim.ReOpenDate)
    exportClaim.ICDVersion = getClaimIcdVersion(claim)
    if(claim.AssignedGroup != null && claim.AssignedUser != null) {
      exportClaim.Branch.BranchCode = claim.AssignedGroup.PublicID
    }    
    return exportClaim.asUTFString()    
  }
  
  
  /**
   * Determines the ICD version for the Claim
   */
  private static function getClaimIcdVersion(claim : Claim) : String {
     var result : ICDVersionExt
     var qObj = Query.make(ContactICDExt).withFindRetired(true)
     var qObj1 = qObj.join("ContactISOMedicareExt")
     var qObj2 = qObj1.join("Contact")
     var qObj3 = qObj2.join(ClaimContact,"Contact")
     var qObj4 = qObj3.join("Claim")
     result = qObj4.compare("ClaimNumber", Relop.Equals, claim.ClaimNumber).select().FirstResult.ICDCode.ICDVersionExt
     return (result == null && ScriptParameters.ICDCodeDate <= DateUtil.currentDate() ? ICDVersionExt.TC_10 : result) as java.lang.String 
  }
  
  /**
   * Parses the policy zone number from the policy version if the Policy
   * is a converted policy.
   */
   @Param("policy", "the policy to get the zone from")
   @Returns("the policy zone number")
   public static function parsePolicyZoneFromVersion(policy : Policy) : String {
     var zone : String = "" 
     
     //If the policy version contains a Z then this is a converted policy and we 
     //need to parse the zone out
     if(policy.ex_PolicyVersion != null &&  policy.ex_PolicyVersion.contains("Z")){
       zone = StringUtil.substring(policy.ex_PolicyVersion, policy.ex_PolicyVersion.length - 1, policy.ex_PolicyVersion.length)
     }
     return zone           
   }
  
    /**
   * Parses the first 2 characters off of the cause of injury code name (this is the NCCI code to send)
   */
   @Param("cause of injury", "the cause of injury to parse")
   @Returns("the NCCI code for the given cause of injury")
  private static function parseCauseOfInjuryCodeForNcciCode(causeOfInjury : LossCauseDetails) : String {
    var code : String = null
    //fix this when they get the NCCI codes into config
    code = causeOfInjury.Description.substring(0, 2)
    if(code.length == 1) {
      code = "0" + code
    }
    return code
  }
  
  
  /**
   * Converts DateTime into XSDDateTime
   */
  @Param("date", "the date to format")
  @Returns("the XSDDateTime converted from a DateTime")
  public static function formatDateforXSD(date : DateTime) : XSDDateTime {
    if(date == null) {
      return null
    } else {
      return new gw.xml.xsd.types.XSDDateTime(getISO8601StringForDate(date))
    }
  }  
  
 
  /**
   * Translates the GenderType into
   */
  @Param("gender", "the gender to translate") 
  @Returns("the GenderEnum translated from the GenderType")
  private static function translateGender(gender : GenderType ) : GenderEnum {
  
      var gen : GenderEnum = null
      
      switch(gender) {
        case GenderType.TC_F:
          gen = GenderEnum.F
          break
        case GenderType.TC_M:
          gen = GenderEnum.M
          break
        default:
          gen = null
          break
      }
      
      return gen
  }
  
  
  /**
   * Translates the ClaimState into a ClaimStatuEnum value
   */
  @Param("claimStatus","the claim status to translate") 
  @Returns("the ClaimStatusEnum translated from the ClaimState")
  private static function translateClaimStatus(claimStatus : ClaimState) : ClaimStatusEnum {
     var status : ClaimStatusEnum = null
     
     switch(claimStatus) {
       case ClaimState.TC_OPEN:
         status = ClaimStatusEnum.open
         break
       case ClaimState.TC_CLOSED:
         status = ClaimStatusEnum.closed
         break
       default:
         status = null
         break
     }
     
     return status
  }   
  
  /**
   * Determines if we should create the export message
   */
  @Param("claim","the claim to check")
  @Returns("is this claim valid to send to the export") 
  public static function sendToExport(claim : Claim) : boolean {
    var doSend : boolean = null
    var type : LossType = claim.LossType
    var group : Group = claim.AssignedGroup
    if(isWcExportLossType(type) && isWcExportGroup(group)) {    
        doSend = true
      } else {
        doSend = false
      }
    
    return doSend
  }
  
  /**
   * Checks to see if the loss type is a WC export loss type
   */
  @Param("type", "the loss type to check if it is a WC export type")
  @Returns("is this loss type a WC export loss type")
  public static function isWcExportLossType(type : LossType) : boolean {
    var isWcLossType : boolean = false
    
    isWcLossType = exists(t in LossType.TF_WC_EXPORT_LOSSTYPES.TypeKeys where t == type)
    return isWcLossType
  }
  
  
   /**
   * Checks to see if the group is a WC export group
   */
  @Param("group", "the group to check to see if it is a WC export group")
  @Returns("is this group a WC export group")
  public static function isWcExportGroup(group : Group) : boolean {
    var isWcExportGroup : boolean = false  
    isWcExportGroup = (isStrategicCompGroup(group.DivisionNameExt) || isAltMarketsGroup(group.DivisionNameExt))
    return isWcExportGroup
  }   
  
  
  /**
   * Checks to see if the division is strat comp
   */
  @Param("division", "the division to check to see if its strategic comp")
  @Returns("is this division Strategic comp")
  private static function isStrategicCompGroup(division : DivisionNameExt) : boolean {
    var isSC : boolean = false
    if(division != null && division.DivisionNameValue != null) {
      isSC = division.DivisionNameValue.startsWith("Strat")
    }
    return isSC
  }
  
  
  /**
   * Checks to see if the division is alt markets
   */
  @Param("division", "the division to check to see if its alt comp")
  @Returns("is this division alt markets")
  private static function isAltMarketsGroup(division : DivisionNameExt) : boolean {
    var isAM : boolean = false
    if(division != null && division.DivisionNameValue != null) {
      isAM = division.DivisionNameValue.startsWith("Alt")
    }
    return isAM
  }
  
  /**
   * Gets the BU code for strat comp or alt markets from claim using the division name
   */
  @Param("claim", "the claim to get the businessunit code for")
  @Returns("business unit code for the claim")
  public static function getWCBusinessUnitCode(claim : Claim) : BusinessUnitExt {
    var buCode : BusinessUnitExt = claim.NCWOnlyBusinessUnitExt // default to claim BU so we return something 
    
    //If the loss type is a valid WC loss type then return the correct BU 
    //based on the claim assignment, otherwise the true loss type will be returned
    if(exists(type in LossType.TF_WC_EXPORT_LOSSTYPES.TypeKeys where type == claim.LossType)){
      //set to strategic comp or alt markets based on assigned group division
      if(isStrategicCompGroup(claim.AssignedGroup.DivisionNameExt)) {
        buCode = BusinessUnitExt.TC_SC
      }
    
      if(isAltMarketsGroup(claim.AssignedGroup.DivisionNameExt)) {
        buCode = BusinessUnitExt.TC_AM
      }
    }
    
    return buCode
  }
  
  /**
   * Gets the injured body parts associated with the given claim
   */
  @Param("claim","the claim to get the injured body parts from")
  @Returns("injured body parts associated with the claim")
  private static function getInjuredBodyParts(claim : Claim) : List<BodyPart> {
    var parts : List<BodyPart> = new ArrayList<BodyPart>()
    if(claim.ClaimInjuryIncident.BodyParts != null){
    	claim.ClaimInjuryIncident.BodyParts.where(\ b -> b.PrimaryExt != true)*.DetailedBodyPart.each(\ d -> {      
      	var part = new BodyPart()
      	part.BodyPartCode = d.Code
      	part.BodyPartDesc = d.DisplayName
      	parts.add(part)  
      })
    }
    
    return parts
  }
  
  
  /**
   * Gets the ICD codes associated with the given claim
   */
  @Param("claim", "the claim to get the ICD Codes off of")
  @Returns("ICD Codes associated with the claim")
  private static function getIcdCodes(claim : Claim) : List<DiagnosticCode> {
    var codes : List<DiagnosticCode> = new ArrayList<DiagnosticCode>()
    
    claim.ClaimInjuryIncident.InjuryDiagnoses.where(\ i -> i.IsPrimary != true)*.ICDCode.each(\ i -> {
      var code = new DiagnosticCode()
      code.Value = i.Code
      codes.add(code)
    })

    return codes
  }
  
  @Param("code", "the issuing company")
  @Returns("the issuing company code")
  private static function getCarrierCode(issuingCoType : IssuingCompanyExt) : String {
    var issuingCompany : IssuingCoExt = PolicyExportUtil.getIssuingCo(issuingCoType)
    var carrierCode : String = null
    
    if(issuingCompany != null) {
      carrierCode = issuingCompany.MasterCoNum
    }
    return carrierCode
  }
  
  
  @Param("code", "the issuing company")
  @Returns("the issuing company FEIN")
  private static function getCarrierFEIN(issuingCoType : IssuingCompanyExt) : String {
    var issuingCompany : IssuingCoExt = PolicyExportUtil.getIssuingCo(issuingCoType)
    var carrierFEIN : String = null
    
    if(issuingCompany != null) {
      carrierFEIN = issuingCompany.FEIN
      carrierFEIN = carrierFEIN.replace("-", "");
    }
    return carrierFEIN
  }
  
  
  /**
  * Return an ISO 8601 combined date and time string for specified date/time
  * 
  * We will want to put this in a common class for use in all of the exports
  */
  @Param("date", "the date to format")
  @Returns("String with format yyyy-MM-dd'T'HH:mm:ss'Z'")
  private static function getISO8601StringForDate(date : DateTime) : String {
    var dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
    dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
    return dateFormat.format(date);
  }

    
  /**
  * Sends the message to CC External
  */
  @Param("messageContext", "the context of the message")
  @Param("messageContent", "the message content")
  static function sendMessage(messageContext : MessageContext, messageContent : String) {
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, messageContent);   
  }
    
  
  /**
  * Checks to see if the address changed
  */
  @Param("address","the address to check for changes")
  @Returns("did the address change")
  static function addressChanged(address : Address) : boolean {
    var fields = new String[] {"AddressLine1", "AddressLine2", "City", "State", "PostalCode"}
    var changed : boolean = null
  
    if (util.gaic.CommonFunctions.fieldFromListChanged(address, fields)) {
      changed = true
    }
  
    return changed
  }
  
  
  /**
   * Determins the claim type.  If there is an Indemnity feature on the claim
   * then the claim type is LT.  If there is only a medical feature on the claim
   * then the claim type is MO.
   */
  private static function determineClaimType(claim : Claim) : String {
    var claimType : String = null
    
    if(exists(e in claim.Exposures where e.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS)){
      claimType = "LT"
    }
    
    if(exists(e in claim.Exposures where e.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS) &&
        !exists(e in claim.Exposures where e.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS)){
      claimType = "MO"
    }
    
    return claimType
  }
  
  
  /**
   * Determines if the claim is under federal jurisdiction
   */
  private static function isFederalJurisdiction(claim : Claim) : boolean {
    var coverages = claim.Exposures*.Coverage
    var isFederal : boolean = false
    
    if(coverages != null) {
      if(exists(c in coverages where c.GoverningLawExt == GoverningLawExt.TC_DEFBASEACT ||
                                     c.GoverningLawExt == GoverningLawExt.TC_FEDCOALMINE ||
                                     c.GoverningLawExt == GoverningLawExt.TC_LONGSHOREHARBOR)) {
        isFederal = true
      
      }        
    }
    
    return isFederal
  }
  

}//end ClaimExportUtil
