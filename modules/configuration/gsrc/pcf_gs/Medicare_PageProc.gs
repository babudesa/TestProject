package pcf_gs
uses gw.api.util.DateUtil
uses java.util.ArrayList
uses util.gaic.CMS.validation.*
uses util.gaic.CMS.orm.ORMHelper
uses gw.api.database.Query

/* 
    This class is designed to create methods and fields used on the ClaimMedicare.pcf
*/
class Medicare_PageProc {

  private var _contactISO : ContactISOMedicareExt as ContactISOMedicare
  private var _claim : Claim
  private var _exposures : List<Exposure> as readonly Exposures
  private var _diagHelpers : List<ContactDiagICDHelper> as DiagHelpers
  private var _causeHelpers : List<ContactCauseICDHelper>
  private var _injConConHelpers : List<InjPartyRepContactContactHelper> as InjPartyRepContHelpers
  private var _claimantConConHelpers : List<ClaimantContactContactHelper> as ClaimantContHelpers
  private var _exposure : Exposure as readonly SingleExposure
  private var valueEqualsExhaustDate = false
  private var _ormHelper : util.gaic.CMS.orm.ORMHelper as ORMHelper
  private var _searchICDCode : String
  public static var _icdVersion : ICDVersionExt as claimICDVersion

  construct(){
    
  }
  
  /* 
    The following function is used to initialize the values of the variables on this page process
    This value is called on ContactRepDataDV.pcf and ContactMedicareDataDV.pcf
  */
  function detailedInit(contactISO : ContactISOMedicareExt, claim : Claim) : Medicare_PageProc {
    _contactISO = contactISO
    _claim = claim
    _icdVersion = getICDVersion() 
    _diagHelpers = new ArrayList<ContactDiagICDHelper>()
    _causeHelpers = new ArrayList<ContactCauseICDHelper>()
    initExposures()
    initExistingICDHelpers()
    _injConConHelpers = new ArrayList<InjPartyRepContactContactHelper>()
    initExistingInjRepHelpers()
    _claimantConConHelpers = new ArrayList<ClaimantContactContactHelper>()
    initExistingClaimantHelpers()

/*    if((_contactISO.Contact as Person) != null and (_contactISO.Contact as Person).MedicareEligibleExt != null)
      initORM()
  */  
    return this 
  }
  
  /* 
    The following function is used to initialize the values of the variables on this page process
    This value is called on ContactRepDataDV.pcf and ContactMedicareDataDV.pcf
  */
  function detailedInit(contactISO : ContactISOMedicareExt, claim : Claim, exposure : Exposure) : Medicare_PageProc {
    _exposure = exposure       
    return detailedInit(contactISO, claim)
  }  
  
  
  /************************************************************************************************
      EXPOSURE HELPER METHODS 
  ************************************************************************************************/
  
  private function initExposures() {
    _exposures = new ArrayList<entity.Exposure>()
    
    //Add any exposures where:
    //  1. The claimant is the same as the helper object's contact -OR-
    //       The claimant is null and the exposure is new
    //  2. The MedicareExposureExt flag is set -OR- it will be set once the exposure is saved
    if(_claim.Exposures != null){
      if(_contactISO.Contact.New){
        _exposures = _claim.Exposures.where(\ e -> e.MedicareExposureExt || e.IsMedicareExposureExt) as List<Exposure> 
      }else{
        _exposures = _claim.Exposures.where(\ e -> (e.Claimant == _contactISO.Contact or (e.Claimant == null && e.New)) and
                   (e.MedicareExposureExt || e.IsMedicareExposureExt)) as List<Exposure>
      }
    }
  }
  
  property get ProductLiabRequired() : boolean {
    var personClaimant = _contactISO.Contact as Person
    
    if(personClaimant != null)
      return personClaimant.MedicareEligibleExt && !(personClaimant.BelowThresholdExt || personClaimant.RefuseProvideExt)
    else
      return false
  }
  
  /* 
    Used to get a default date for date of incident. If the Date of Incident is null, it defaults 
    to the Loss Date on the claim.
  */
  property get DateOfIncident(): java.util.Date{
    if(_contactISO != null and _contactISO.CMSIncidentDateExt == null)
      _contactISO.CMSIncidentDateExt = _claim.LossDate
    return  _contactISO.CMSIncidentDateExt
  }
  
  /*
    Used to set the date of incident to the date selected by the user.
  */
  property set DateOfIncident(date : java.util.Date) : void{
    if(_contactISO != null)
      _contactISO.CMSIncidentDateExt = date 
  }
  
  /*
    Used to get the State of Venue. If the claimant is on a Bodily Injury feature, it defaults to 
    the Jurisdiction State on that feature. Otherwise, if the claimant is on a Medical Payment 
    feature, it will default to the Jurisdiction State on that feature. If the claimant is not on 
    either of those, the State of Venue will be null until set.
  */
  property get StateOfVenue() : String{
    var states : String
    
    /*if(_contactISO.New and _contactISO != null and _contactISO.StateOfVenueExt == null){
      print(_contactISO.StateOfVenueExt)
     
        for(medSt in MedicareState.getTypeKeys(false)){
               
          if(_claim.LossLocation.Country != "US" and _claim.LossLocation.Country != null){
            if(medSt.Code == "FC"){
              //_contactISO.StateOfVenueExt = medSt 
              StateOfVenue = medSt.Code
           }
          }
         if(medSt.Code == _claim.LossLocation.State.Code){
           //_contactISO.StateOfVenueExt = medSt
           StateOfVenue = medSt.Code
           }
          }
        }*/
      
       for(st in getStateOfVenueFields()){
             if(_contactISO.StateOfVenueExt.Code == st.substring(0,2)){
                states = st
             }
          }
    return states
  }

  
  /*
    Used to set the State of Venue to the state selected be the user.
  */
  property set StateOfVenue(input : String) {
    var state : MedicareState
    if(_contactISO != null){
      if(input != null ){
      for(st in MedicareState.getTypeKeys(false)){
        if(st.Code == input.substring(0,2)){
         state = st
        }
      }
    _contactISO.StateOfVenueExt = state
    } else{
     _contactISO.StateOfVenueExt = null 
    }
    }
  }
  
  function getStateOfVenueFields() : String[]{
    var states:List = new ArrayList<String>()
     
     for(medState in MedicareState.getTypeKeys(false)){
      states.add(medState.Code + " - " + medState.DisplayName) 
     }
   
     return states as String[]
}
  
  /************************************************************************************************
      ICD HELPER METHODS 
  ************************************************************************************************/
  
  /*
    To add a new diagnostic ICD Helper to the list view row iterator in ContactMedicareDataDV.pcf
  */
  function addDiagHelper() : ContactDiagICDHelper {
    var helper : ContactDiagICDHelper
    
     helper = new ContactDiagICDHelper(_contactISO)
     helper.ContactICD.CauseOfInjury = false
     this._diagHelpers.add(helper)
   
    return helper
  }
  
  /*
    To add a new Cause of Injury ICD Helper to the list view row iterator in 
    ContactMedicareDataDV.pcf
  */
  function addCauseHelper() : ContactCauseICDHelper {
    var helper : ContactCauseICDHelper

        helper = new ContactCauseICDHelper(_contactISO)
        helper.ContactICD.CauseOfInjury = true
        this._causeHelpers.add(helper)
      
    return helper
  }
  
  /* 
    To look for existing ContactICDHelper data and add it to the helper
  */
  private function initExistingICDHelpers() {
    if(_contactISO.Contact typeis Person){
     for(existingCode in _contactISO.ContactICDExt.where(\ c -> !c.CauseOfInjury )){
        _diagHelpers.add(new ContactDiagICDHelper(existingCode))
     }
     for(existingCode in _contactISO.ContactICDExt.where(\ c -> c.CauseOfInjury)){
       var helper = new ContactCauseICDHelper(existingCode)
       helper.ContactICD.CauseOfInjury = true
       _causeHelpers.add(helper)
     }
    }
  }
  
  /*
    Returns all of the ICD codes in the _icdHelper that are not Cause of Injury codes
  */
  property get DiagnosticCodes() : List<ContactDiagICDHelper> {
    if(_diagHelpers != null)
      return _diagHelpers.where(\ helper -> !helper.ContactICD.CauseOfInjury and 
            helper.ContactICD.ContactISOMedicareExt == _contactISO)
    else
      return null
  }  
  
  /*
    To remove a diagnostic ICD Helper from the list view row iterator in ContactMedicareDataDV.pcf
  */
  function removeICDHelper(help : ContactDiagICDHelper){
      help.ContactICD.ContactISOMedicareExt.removeFromContactICDExt(help.ContactICD)
      _diagHelpers.remove(help)  
  }
  
   /*
    To remove a cause of injury ICD Helper from the list view row iterator in 
    ContactMedicareDataDV.pcf
  */
   function removeInjuryHelper(help : ContactCauseICDHelper){
     help.ContactICD.ContactISOMedicareExt.removeFromContactICDExt(help.ContactICD)
     _causeHelpers.remove(help)     
  }
  
  /*
    The following is used to add ICD codes to the helper or to the ContactICDExt
  */
  function addCodes(checkedValues:ICDCode[], searchType : String, injury:InjuryIncident){
    var helper : ContactDiagICDHelper
    var helper2 : ContactCauseICDHelper
    var codeAlreadyExists : int
    
    for (code in checkedValues){
      codeAlreadyExists = 0
      
      // find out if the code is already in the list
      for(help in this.DiagHelpers){
        if(help.ContactICD.ICDCode == code){
          codeAlreadyExists = codeAlreadyExists + 1
        }
      }
      
      if(codeAlreadyExists < 2  and searchType == "Diagnostic"){
        helper = this.addDiagHelper()
        helper.ContactICD.ICDCode = code
      }
      
      if(codeAlreadyExists < 2  and searchType == "DiagnosticWC"){
        //helper = this.addDiagHelper()
        //helper.ContactICD.ICDCode = code
        var injDiag = new InjuryDiagnosis()
        injDiag.ICDCode=code
        injDiag.InjuryIncident=injury
        //injDiag.InjuryIncident.Claim=injury.Claim
        injDiag.Compensable=false
        injDiag.ICDMedReportExt=false
        injDiag.IsPrimary=false
        
        injury.addToInjuryDiagnoses(injDiag)
      }

       // Checking to see if this is being called from the Cause of Injury lookup
       if(searchType == "CauseOfInjury"){
         for(help in _causeHelpers.where(\ c -> c.ContactICD.CauseOfInjury )){
           removeInjuryHelper(help)
         }
         helper2 = addCauseHelper()
         helper2.ContactICD.ICDCode = code
       }    
     }    
  }
  
  /*
    Returns the current cause of injury value -- NOT USED in LV. Only used on disabled 
    ExposureISOMedicareDataInputSet value
  */
  property get CauseInjury() : String {
    return _contactISO.ContactICDExt.where(\ c -> c.CauseOfInjury ).last().ICDCode as java.lang.String
  }
  
  /*
    Sets the cause of injury value to true and adds it to the end of ContactICDExt 
    -- NOT USED in LV. Only used on disabled ExposureISOMedicareDataInputSet value
  */
  property set CauseInjury( enteredCode : String) {
    var conICD = new ContactICDExt()
    
    checkCauseCode(conICD, enteredCode)
  }
  
  /*
    Returns the current cause of injury value
  */
  property get CauseOfInjury() : List<ContactCauseICDHelper>{
    if(_causeHelpers != null)
      return _causeHelpers.where(\ helper -> helper.ContactICD.CauseOfInjury and 
            helper.ContactICD.ContactISOMedicareExt == _contactISO)
    else
      return null
  }
  
  /*
    Check to see if the code is already in Diagnostic codes before adding it to the list
  */ 
  function checkICDCode(conICD : ContactICDExt, enteredCode : String) : void {
    var codeAlreadyExists = 0
    
    for(icdCode in _diagHelpers){
        if(icdCode.ContactICD.ICDCode.Code == enteredCode){
          codeAlreadyExists = codeAlreadyExists + 1 
        }
    }
    if(codeAlreadyExists < 2){
      var icd = find(code in ICDCode where code.Code == enteredCode).FirstResult
      conICD.ICDCode = icd
    }
    else{
      removeICDHelper(_diagHelpers.last())
    }
   }
   
   // function to check if enteredCode is a valid ICD Code or Cause of Injury code, based on codeType
   // 8-28-2015 ivorobyeva: ICD9: Diagnosis ICD codes exclude codes which start with E - these are Cause of Injury Codes (like E9988)
   // ICD10: Diagnosis ICD codes exclude codes starting with V, W, X or Y - these are Cause of Injury Codes (like V00.01XA)
   function isValidICDCode(enteredCode : String, codeType:String) : boolean {
      var icd = libraries.ICDCodeUtil.ICDSearch(enteredCode, null, null, false, codeType, _icdVersion, true).FirstResult
      if(icd != null){ 
        return true 
      }
      return false
   }
   
   function checkMismatch(claim:Claim):String {
     var errMsg: String = "";
     var icdEdition : ICDVersionExt= null;
     var versionMisMatch: boolean = false;
     for(i in _diagHelpers.where(\ c -> c.ContactICD != null )){
       if(icdEdition==null){
         icdEdition = i.ContactICD.ICDCode.ICDVersionExt
     }

     if((i.ContactICD.ICDCode.ICDVersionExt!=null && i.ContactICD.ICDCode.ICDVersionExt!=icdEdition) or(getICDVersion()!=null && getICDVersion()!=icdEdition) ){
        versionMisMatch = true      
        errMsg= "ICD Codes: Only ICD Codes with the same ICD Edition may be selected."
     break
     } else if(getICDVersion()==null&&( claim.UpdateTime>ScriptParameters.ICDCodeDate or claim.CreateTime>ScriptParameters.ICDCodeDate)){
     if(i.ContactICD.ICDCode.ICDVersionExt!="10")
       errMsg= "ICD Codes: ICD-9 codes may not be selected; select an ICD-10 code"
     } 
   } 
   return errMsg
   }
    
   // returns ICD Version of the claim
   function getICDVersion() : ICDVersionExt {
     if (!util.WCHelper.isWCLossType(_claim)){
       var result : ICDVersionExt
       var qObj = Query.make(ContactICDExt).withFindRetired(true)
       var qObj1 = qObj.join("ContactISOMedicareExt")
       var qObj2 = qObj1.join("Contact")
       var qObj3 = qObj2.join(ClaimContact,"Contact")
       var qObj4 = qObj3.join("Claim")
       result = qObj4.compare("ClaimNumber", Equals, this._claim.ClaimNumber).select().FirstResult.ICDCode.ICDVersionExt
       return (result == null && ScriptParameters.ICDCodeDate <= DateUtil.currentDate() ? ICDVersionExt.TC_10 : result) 
     }
     else {
       var result : ICDVersionExt
       var qObj = Query.make(InjuryDiagnosis).withFindRetired(true)
       var qObj1 = qObj.join("InjuryIncident")
       var qObj2 = qObj1.join("Claim")
       result = qObj2.compare("ClaimNumber", Equals, this._claim.ClaimNumber).select().FirstResult.ICDCode.ICDVersionExt
       return (result == null && ScriptParameters.ICDCodeDate <= DateUtil.currentDate() ? ICDVersionExt.TC_10 : result)        
     }
   }

// function VersionMismatch(claimNum : String):String{
//    var errMsg: String = null;
//    var icdEdition:ICDVersionExt =null
//    for(i in _diagHelpers.where(\ c -> c.ContactICD != null )){
//      if(icdEdition==null){
//       icdEdition = i.ContactICD.ICDCode.ICDVersionExt
//      }
//    }
//    print("icdEdition +++++"+icdEdition)
//    print("inside VersionMismatch outside if++++++++++++=")
//    if(getICDVersion(claimNum)!=null && getICDVersion(claimNum)!=icdEdition){
//       print("inside VersionMismatch outside if++++++++++++=")
//      errMsg="ICD Codes: Only ICD Codes with the same ICD Edition may be selected111111."
//    }
//    return errmsg
// }
   
   
   function CheckCode(claim:Claim): String{
     var errMsg: String = null;

     if(checkICDCodes() != ""){
       errMsg=checkICDCodes() 
     }
  
     else if (checkMismatch(claim)!=""){
       errMsg=checkMismatch(claim)
     }
     return errMsg
   }

// NEW FUNCTION: returns the duplicate values for defect 6492
   
   function checkICDCodes():String{
     var codeCount : int
     var message: String = ""
     for(code1 in _diagHelpers){
       codeCount = 0
       for(code2 in _diagHelpers){
         if(code1.ContactICD.ICDCode.Code == code2.ContactICD.ICDCode.Code){
           codeCount++  
         }
       }
       if(codeCount >=2  and code1.ContactICD.ICDCode.Code != null){
         if(message == "")
           message = code1.ContactICD.ICDCode.Code
         else{
           if(!message.contains(code1.ContactICD.ICDCode.Code))
             message = message + ", " + code1.ContactICD.ICDCode.Code
         }
       }
     }
     if(message != "")
       message = "ICD Codes: Duplicate ICD Codes are not valid: " + message
     return message
   }
   
   /*
     Checks to see if the enteredCode is a valid icd code. It then adds the icd to ContactICDExt 
     -- NOT USED in LV. Only used on disabled ExposureISOMedicareDataInputSet value
   */
   function checkCauseCode(conICD: ContactICDExt, enteredCode : String) : void {
     for(contactICD in _contactISO.ContactICDExt.where(\ c -> c.CauseOfInjury)){
       _contactISO.removeFromContactICDExt(contactICD)
     }
     var icd = find(code in ICDCode where code.Code == enteredCode).FirstResult
     
     if(icd.Code != "" or icd.Code != null){
       conICD.ICDCode = icd
       conICD.CauseOfInjury = true
       _contactISO.addToContactICDExt(conICD)
     }   
   }
  
  /****************************************************************** 
      ClAIMANT REPRESENTATIVE METHODS 
  ******************************************************************/
  
  /*
    Determines whether or not a contactContact already has been selected
  */
  function isInjPartyRepDisplayable(contactContact: ContactContact) : boolean{
     return !(_contactISO.Contact.AllContactContacts.contains(contactContact)) 
  }
  
  /*
    Initializes the existing claimant helpers for a particular contact.
  */
  function initExistingClaimantHelpers(){
    if(_contactISO.Contact.AllContactContacts.Count != 0){
     for(existingCode in _contactISO.Contact.AllContactContacts.where(\ c -> c.ClaimantFlagExt and 
         c.RelatedContact != _contactISO.Contact)){
           
           _claimantConConHelpers.add(new ClaimantContactContactHelper(existingCode, _contactISO))
     }
    }
  }
  
  /* 
    Creates a new ClaimantContactContactHelper and adds it to the list of claimant helpers
  */
  function addClaimantHelper() : ClaimantContactContactHelper{
    var helper = new ClaimantContactContactHelper(_contactISO)
    helper.conContact.ClaimantFlagExt = true
    _claimantConConHelpers.add(helper)
    _contactISO.Contact.addContactContact(helper.conContact)
   
    return helper
    
  }
  
  /*
    Removes the passed in helper from the list of cliamant helpers
  */
  function removeClaimantHelper(helper :ClaimantContactContactHelper) {
    _contactISO.Contact.removeContactContact(helper.conContact) 
    _claimantConConHelpers.remove(helper)
  }
  
  /*
    Returns a list of additional claimant contact contacts. 
  */
  property get claimantContactContacts() : List<ClaimantContactContactHelper>{
    if(_claimantConConHelpers != null)
      return _claimantConConHelpers.where(\ c -> c.conContact.ClaimantFlagExt == true) 
    else 
      return null
  }
  
  /*
    used to add claimants to the list view
  */
  function addClaimantCodes(contactContact: ContactContact){
     contactContact.ClaimantFlagExt = true
     _contactISO.Contact.addContactContact(contactContact)
  }
  
  /*
    used to remove claimants from the list view
  */
  function removeClaimantCodes(contactContact: ContactContact, contact: Contact){
    contact.removeContactContact(contactContact) 
  }
  
  /*
    Returns the list of claimant representatives contact contacts
  */
  property get claimantReps():ContactContact[]{
    if(_contactISO.Contact.TargetRelatedContacts == null)
      return null
    return _contactISO.Contact.TargetRelatedContacts.where(\ c -> c.ClaimantAddRepFlagExt)   
    
  }
  

  
  /*
    used to add claimant representatives to the list view
  */
  function addClaimantRepCodes(contactContact: ContactContact, contact: Contact){
        contactContact.ClaimantAddRepFlagExt = true
        contact.addContactContact(contactContact)

  }
  
  /*
    used to remove claimant representatives from the list view
  */
  function removeClaimantRepCodes(contactContact: ContactContact, contact: Contact){
        contactContact.ClaimantAddRepFlagExt = false
        contact.removeContactContact(contactContact) 
  }
  
  /* 
    Method to add ConctactContactHelpers to the list of helpers
  */
  function addInjRepHelper() : InjPartyRepContactContactHelper{
   var helper = new InjPartyRepContactContactHelper(_contactISO)
   
   _injConConHelpers.add(helper)
   _contactISO.Contact.addContactContact(helper.conContact)
   
   return helper    
  }
  
  /*
    Method used to add existing ContactContactHelpers to the new list
  */
  function initExistingInjRepHelpers(){
    if(_contactISO.Contact.AllContactContacts.Count != 0){
     for(existingCode in _contactISO.Contact.AllContactContacts.where(\ c -> c.InjuredPartyFlagExt 
         and c.RelatedContact != _contactISO.Contact)){
           
           _injConConHelpers.add(new InjPartyRepContactContactHelper(existingCode, _contactISO))
     }
    }
  }
  
  /*
    Method used to remove ConctactContactHelpers from the list
  */
  function removeInjRepHelper(helper :InjPartyRepContactContactHelper) {
    _contactISO.Contact.removeContactContact(helper.conContact) 
    _injConConHelpers.remove(helper)
  }
  
  /*
    Access all of the contact contacts that are injured party representatives for the selected contact
  */
  property get injContactContacts() : List<InjPartyRepContactContactHelper>{
    if(_injConConHelpers != null)
      return _injConConHelpers.where(\ c -> c.conContact.InjuredPartyFlagExt == true) 
    else 
      return null
  }
  
  /*
    used to add new injured party representatives to the list view
  */
  function addInjRepCodes(contactContact:ContactContact, contact: Contact){
     contactContact.InjuredPartyFlagExt = true
     if(contact == _contactISO.Contact)
       contact.addContactContact(contactContact)          
  }
  
  /*
    used to remove injured party representatives from the list view
  */
  function removeInjRepCodes(contactContact: ContactContact, contact : Contact){
    contact.removeContactContact(contactContact)
  }
  
  /* 
    used to determine if a contactConctact has been selected from the list view yet
  */
  function isRoleDisplayable(role: ContactBidiRel) : boolean {
    for( contCont in _contactISO.Contact.TargetRelatedContacts){
      if(contCont.getBidiRel(_contactISO.Contact) != null){
       if(contCont.getBidiRel(_contactISO.Contact).equals(role) and contCont.InjuredPartyFlagExt)
         return false
      }
    }
    return true
    //_contactISO.Contact.TargetRelatedContacts*.getBidiRel(_contactISO.Contact).contains(role)
    
  }
  
  /*
     Used to add additional representatives to additional claimants. May be removed.
  */
  function createNewContactContact(relatedContact:Contact, primaryContact:Contact, newRel:ContactBidiRel){
    var conCon = new ContactContact()
    
    conCon.RelatedContact = relatedContact
    conCon.SourceContact = primaryContact 
    conCon.setBidiRel(primaryContact, newRel)
    _claim.resolveAndSetContactContact(conCon, primaryContact, relatedContact)
    _contactISO.Contact.addContactContact(conCon)
  }
  
  
  
  /************************************************************************************************
     ORM
  ************************************************************************************************/
  
  function isORMEditable() : boolean{
    if(_contactISO.PersonClaimant.MedicareEligibleExt){
      if(this._exposure != null && this._exposure.IsORMExposure){  
        return false
      }else if(this._exposures.hasMatch(\ e -> e.IsORMExposure && e.Claimant == _contactISO.Contact)){
        return false  
      } 
    }
    return true
  }
  
  function updateORM(){
    if(_contactISO.PersonClaimant.MedicareEligibleExt){
      if(this._exposure != null && this._exposure.IsORMExposure){
        _contactISO.ORMIndExt = true
        (_contactISO.Contact as Person).SendPartyToCMSExt = false
      }else if(this._exposures.hasMatch(\ e -> e.IsORMExposure && e.Claimant == _contactISO.Contact)){
        _contactISO.ORMIndExt = true
        (_contactISO.Contact as Person).SendPartyToCMSExt = false        
      }else if(_contactISO.ORMIndExt == null or this._exposures.where(\ e -> e.ExposureType == ExposureType.TC_WC_EMPLOYERS_LIABILITY).Count > 0){
        _contactISO.ORMIndExt = false 
      }
    }
  }
  
  /*
    used to get a default date for the ORM Termination Date
  */
  property get ORMDate() : java.util.Date{ 
    if(_contactISO.ExhaustDateExt != null){      
      _contactISO.ORMEndDateExt = _contactISO.ExhaustDateExt
      valueEqualsExhaustDate = true
    }
    if(_contactISO.ExhaustDateExt == null and valueEqualsExhaustDate){
      _contactISO.ORMEndDateExt = null
      valueEqualsExhaustDate = false 
    }
    return _contactISO.ORMEndDateExt
  }
  
  /*
    used to set the default date for the ORM Termination date
  */
  property set ORMDate(date:java.util.Date):void{
    _contactISO.ORMEndDateExt = date  
  }
  
  function isORMValid() : boolean {
    var isValid = false
    if(_contactISO.ORMIndExt && _exposures != null && _exposures.Count > 0){
       //Loop through any exposures where the claimant is the helper object's contact OR where the exposure is new 
       //and the claimant is null.
       //This is critical for the case where a new person is added during new feature creation.
       for(expo in _exposures.where(\ e -> e.Claimant == _contactISO.Contact || (e.Claimant == null && e.New))){
         if(expo.IsORMExposure){
              isValid = true
         }     
       }
       return isValid
     }else{
       return true
     }
  }
  
  /************************************************************************************************
      TPOC LIST VIEW METHODS
  ************************************************************************************************/
 
  /*
    used to add the TPOC information
  */
  function addTPOCInfo(tpoc:TPOCExt){   
     if (_contactISO == null){
       _contactISO = new ContactISOMedicareExt()
     }
     for(tpocInfo in _contactISO.TPOCExt){
        if(_contactISO.TPOCExt.where(\ t -> t.CMSTPOCNumber == 1 ).Count == 0)
          tpoc.CMSTPOCNumber = 1 
        else if (_contactISO.TPOCExt.where(\ t -> t.CMSTPOCNumber == 2 ).Count == 0)
          tpoc.CMSTPOCNumber = 2
        else if (_contactISO.TPOCExt.where(\ t -> t.CMSTPOCNumber == 3 ).Count == 0)
          tpoc.CMSTPOCNumber = 3
        else if (_contactISO.TPOCExt.where(\ t -> t.CMSTPOCNumber == 4 ).Count == 0)
          tpoc.CMSTPOCNumber = 4
        else 
          tpoc.CMSTPOCNumber = 5
     }
     _contactISO.addToTPOCExt(tpoc)  
  }
  
  /*
    used to remove the TPOC information
  */
  function removeTPOCInfo(tpoc:TPOCExt){
    _contactISO.removeFromTPOCExt(tpoc)
  }
  
  
  //6/25/13 kniese - Function to validate the amount on tpoc is whole dollars and not equal to zero
  function validateAmount(value : java.math.BigDecimal) : Boolean{
    var result : Boolean = true;
    //if(value != null &amp;&amp; (value.intValue() != value || (value.intValue() || (value.intValue()&lt; 0 as java.lang.Integer).toString()))){
    if(value != null && (value.intValue() != value || (value.intValue() < 0 ))){
      result = false;
    }
    return result;
  }
  
  /*
    Used to make sure the date being verified is no more then six months ahead of the current date. 
  */
  function verifyDate(date: java.util.Date) : String{
    var curDate = gw.api.util.DateUtil.currentDate()
    var message = "The date can only be set up to six months in advance."
    
    if(curDate.MonthOfYear <= 6){
      if(date.MonthOfYear <= curDate.MonthOfYear + 6){
        if(date.MonthOfYear == 12 and (date.DayOfMonth > curDate.DayOfMonth or date.YearOfDate >
             curDate.YearOfDate)){
          return message
        } else if(date.YearOfDate > curDate.YearOfDate){
          return message
         }else
            return null
      }
    } else if (curDate.MonthOfYear == 7){
        if(date.MonthOfYear >= 7 and date.MonthOfYear <= 12){
          if(date.YearOfDate != curDate.YearOfDate)
            return message
          else 
            return null
        }
        if(date.MonthOfYear == 1 ){
          if(date.DayOfMonth > curDate.DayOfMonth or date.YearOfDate - curDate.YearOfDate > 1)
            return message
          else
            return null
        }
        if(date.MonthOfYear > 1 and date.MonthOfYear < 7){
          if(date.YearOfDate == curDate.YearOfDate)
            return null
        }   
    } else if (curDate.MonthOfYear == 8){
        if(date.MonthOfYear >= 8 and date.MonthOfYear <= 12){
          if(date.YearOfDate != curDate.YearOfDate)
            return message
          else 
            return null
        }
        if(date.MonthOfYear < 2){
          if(date.YearOfDate - curDate.YearOfDate > 1)
            return message
          else 
            return null
        }
        if(date.MonthOfYear == 2 ){
          if(date.DayOfMonth > curDate.DayOfMonth or date.YearOfDate - curDate.YearOfDate > 1)
            return message
          else
            return null
        }
        if(date.MonthOfYear > 2 and date.MonthOfYear < 8){
          if(date.YearOfDate == curDate.YearOfDate)
            return null
        }
      
    } else if (curDate.MonthOfYear == 9){
        if(date.MonthOfYear >= 9 and date.MonthOfYear <= 12){
          if(date.YearOfDate != curDate.YearOfDate)
            return message
          else 
            return null
        }
        if(date.MonthOfYear < 3){
          if(date.YearOfDate - curDate.YearOfDate > 1)
            return message
          else 
              return null
        }
        if(date.MonthOfYear == 3 ){
          if(date.DayOfMonth > curDate.DayOfMonth or date.YearOfDate - curDate.YearOfDate > 1)
            return message
          else
            return null
        }
        if(date.MonthOfYear > 3 and date.MonthOfYear < 9){
          if(date.YearOfDate == curDate.YearOfDate)
            return null
        }
    } else if (curDate.MonthOfYear == 10){
        if(date.MonthOfYear >= 10 and date.MonthOfYear <= 12){
          if(date.YearOfDate != curDate.YearOfDate)
            return message
          else 
            return null
        }
        if(date.MonthOfYear < 4){
          if(date.YearOfDate - curDate.YearOfDate > 1)
            return message
          else 
              return null
        }
        if(date.MonthOfYear == 4 ){
          if(date.DayOfMonth > curDate.DayOfMonth or date.YearOfDate - curDate.YearOfDate > 1)
            return message
          else
            return null
        }
        if(date.MonthOfYear > 4 and date.MonthOfYear < 10){
          if(date.YearOfDate == curDate.YearOfDate)
            return null
        }
    } else if (curDate.MonthOfYear == 11){
        if(date.MonthOfYear >= 11 and date.MonthOfYear <= 12){
          if(date.YearOfDate != curDate.YearOfDate)
            return message
          else 
            return null
        }
        if(date.MonthOfYear < 5){
          if(date.YearOfDate - curDate.YearOfDate > 1)
            return message
          else 
              return null
        }
        if(date.MonthOfYear == 5 ){
          if(date.DayOfMonth > curDate.DayOfMonth or date.YearOfDate - curDate.YearOfDate > 1)
            return message
          else
            return null
        }
        if(date.MonthOfYear > 5 and date.MonthOfYear < 11){
          if(date.YearOfDate == curDate.YearOfDate)
            return null
        }
    } else if (curDate.MonthOfYear == 12){
        if(date.MonthOfYear == 12){
          if(date.YearOfDate != curDate.YearOfDate)
            return message
          else 
            return null
        }
        if(date.MonthOfYear < 6){
          if(date.YearOfDate - curDate.YearOfDate > 1)
            return message
          else 
              return null
        }
        if(date.MonthOfYear == 6 ){
          if(date.DayOfMonth > curDate.DayOfMonth or date.YearOfDate - curDate.YearOfDate > 1)
            return message
          else
            return null
        }
        if(date.MonthOfYear > 6 and date.MonthOfYear < 12){
          if(date.YearOfDate == curDate.YearOfDate)
            return null
        }
    } else 
        return message
    return message
  }
  
  property set searchICDCode(varICDCode: String){
    _searchICDCode = varICDCode
  }
  
  property get searchICDCode(): String {
    return _searchICDCode
  }
  
  function addInjuryIncident(injury : InjuryIncident) : InjuryDiagnosis {
  var medDiag = new InjuryDiagnosis()
  injury.addToInjuryDiagnoses(medDiag)
  
  return medDiag
  }
}




