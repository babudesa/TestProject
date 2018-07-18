package gaic.webservice.cc

uses gw.transaction.Bundle
uses gw.api.database.Query
uses java.lang.Exception
uses gw.api.util.Logger
uses java.text.SimpleDateFormat
uses java.util.List
uses java.util.ArrayList
//uses com.guidewire.cc.webservices.entity.CMSReportImportRecordExt

/**
 * CMSImportAPI processes the CMS record for one claim and updates the 
 * Medicare information coming from CMS on the claimant of the claim
 */
@WebService
class CMSImportAPI <T extends CMSReportImportRecordExt>  {
  
  var errorMessage: String =null     // log warning
  var warningMessage: String = null  // user warning
  var formatter: SimpleDateFormat = new SimpleDateFormat("MM/dd/yyyy");	
  var NO_UPDATE: String ="NO"
  var YES_UPDATE: String="YES"
  var NO_UPDATE_MESSAGE=""
  var PERIOD="."
  construct() {}
  
  /**
   * Updates the Medicare data of the Claimant that is on the Medicare tab of the person
   * The HICN number and the Medicare Eligible fields are updated with the data
   * from the CMS Report
   * the SSN number is also updated if none was given yet
   */
  public function processCMSRecord(cmsImportRecord : CMSReportImportRecordExt) : CMSReportImportResultExt{
        var result: CMSReportImportResultExt = null
        errorMessage=null
        warningMessage=null
        var claim: Claim=null
        try {
          claim=findRelevantClaim(cmsImportRecord)
          if (claim!=null){ //1
            Logger.logInfo("CMSImportAPI: Minor Child: "+claim.InjuredWorker.MinorWorkerExt)
            gw.transaction.Transaction.runWithNewBundle(\ bundle -> { //2
            claim=bundle.add(claim)   
            var exposure :Exposure=findExposure(claim,cmsImportRecord)
            if (exposure!=null){ // if 
              // process and commit
              result=processCMSRecordExposureFound(claim,cmsImportRecord, exposure,bundle)
            }
            else {
              //result=buildErrorResult( "Person not found in claim. " ,cmsImportRecord)
              Logger.logInfo("CMSImportAPI: no exposure found "+errorMessage)
              if (errorMessage!=null)  {
                var tempMessage=errorMessage
                errorMessage=null            
                result=buildErrorResult(tempMessage,claim,cmsImportRecord,NO_UPDATE)
              }
              else {
                var fullName=cmsImportRecord.ClaimantLastName
                result=buildErrorResult(displaykey.Integration.CMSReport.ClaimantNotFound(fullName),claim,cmsImportRecord,NO_UPDATE)
              }}
            })
          }
          else {
             result=buildClaimNotFoundResult()
          }
       }
    catch (e:Exception){
      Logger.logInfo("CMSImportAPI: "+e.Message)
       if (warningMessage!=null) Logger.logInfo("CMSImportAPI: "+warningMessage)
       // forget warningMessage, error is stronger
       warningMessage=null
      //result=buildErrorResult(displaykey.Integration.CMSReport.UnexpectedError,cmsImportRecord,NO_UPDATE)
       result=buildErrorResult(e.Message,claim,cmsImportRecord,NO_UPDATE)
    }
    
    return result
  }
  
  private function processCMSRecordExposureFound(claim: Claim,cmsImportRecord : CMSReportImportRecordExt, exposure: Exposure,bundle: Bundle) : CMSReportImportResultExt{
    var result: CMSReportImportResultExt = null
    var message :String=null
    if (cmsImportRecord.DispositionCode!=null)  {//3
        var errorCode: String=cmsImportRecord.DispositionCode
        result=createActivityForClaimWithCMSError(claim,exposure,errorCode,cmsImportRecord)
        if (result.ErrorMessage!=null&&result.Status!=CMSReportImportStatusExt.TC_PROCESSED) {//4
            message=result.ErrorMessage
            Logger.logInfo("CMSImportAPI: "+message)
            result= buildErrorResult(displaykey.Integration.CMSReport.UnexpectedError,claim,cmsImportRecord,NO_UPDATE)
         }
        else {
            result= buildGoodResult(claim)
         } //4
       } 
    else { // disposition code is null query was successful
         result=updateClaim(bundle,claim,exposure,cmsImportRecord)
         if (result.ErrorMessage==null) {//  then there is no error
             result=createActivityForClaim(claim, exposure,cmsImportRecord)
             IF (result==null) {
                 Logger.logInfo("CMSImportAPI:  activity not created. ")
                 result= buildErrorResult(displaykey.Integration.CMSReport.UnexpectedError,claim, cmsImportRecord,NO_UPDATE)
             }
         }
         else {
             message=result.ErrorMessage
             Logger.logInfo("CMSImportAPI: "+message+" activity not created. ")
             result= buildErrorResult(displaykey.Integration.CMSReport.UnexpectedError,claim, cmsImportRecord,NO_UPDATE)
         }
      }
     return result
  }
  
  private function findRelevantClaim(cmsImportRecord : CMSReportImportRecordExt) : Claim {
      var claimQuery = Query.make(Claim).compare("ClaimNumber",Equals,cmsImportRecord.ClaimNumber)
      var claim: Claim=claimQuery.select().AtMostOneRow
      return claim
  }
  /**
  * We already know that this exposure contains the person who is the claimant
  * update the claimant information on this exposure
  */
  private function updateClaim(bundle:Bundle, claim:Claim, exposure:Exposure,cmsImportRecord : CMSReportImportRecordExt)  : CMSReportImportResultExt{
     var result: CMSReportImportResultExt = new CMSReportImportResultExt()
     // get the claimant
     var person: Person=exposure.Claimant as Person
     if (person!=null){
         person=bundle.add(person)
         person.MedicareEligibleExt=true
         person.HICNExt=cmsImportRecord.HICN
         person.StopSendPartyToCMSExt=true  // Stop Querying Party for CMS
         person.SendPartyToCMSExt=true  // Defer Sending Data to CMS
         person=optUpdateSSN(person,cmsImportRecord)
         person=optUpdateCMSName(person,cmsImportRecord)
         setDefaults(bundle,person,claim,exposure)
         var businessLine=claim.BusinessLineExt
         if (businessLine!=null) {
           result.BusinessUnitName=claim.BusinessLineExt.DisplayName
         }
         result.Status=CMSReportImportStatusExt.TC_PROCESSED as String  
         }
      else {
           var fullName=cmsImportRecord.ClaimantFirstName+" "+cmsImportRecord.ClaimantLastName
           result=buildErrorResult( displaykey.Integration.CMSReport.ClaimantNotFound(fullName),claim,cmsImportRecord,NO_UPDATE)
      }
      return result
  }
 /**
  * Person matches if the last name, the claimnumber matches,
  * and either SSN, HICN, or birth date matches.
  * Note that HICN and SSN are not mandatory in ClaimCenter on the ISO validation level
  * where the CMS/ISO request is sent
  * and there are often typo in birth date (10% of cASES)
  */
 private function personMatches(person:Person,cmsImportRecord : CMSReportImportRecordExt): Boolean {  
    if (person != null ){
          if(matchesPersonName(person,cmsImportRecord)){
            if (ssnMatches(person,cmsImportRecord)){
                return true
               }
           else if (hicnMatches(person,cmsImportRecord)){
               warningMessage=displaykey.Integration.CMSReport.CMSSSNNoMatch(cmsImportRecord.SSN,getSSNFromPerson(person))     
               return true
               }
           else if (person.DateOfBirth.equals(cmsImportRecord.DateOfBirth)){
               warningMessage=displaykey.Integration.CMSReport.CMSSSNNoMatch(cmsImportRecord.SSN,getSSNFromPerson(person)) +" "+    
                displaykey.Integration.CMSReport.CMSHicnToUpdate(cmsImportRecord.HICN,person.HICNExt)
                return true
                } 
           else {
               var ccDateOfBirthString=formatter.format(person.DateOfBirth)
               var cmsDateOfBirthString=formatter.format(cmsImportRecord.DateOfBirth)
             
               errorMessage=
               displaykey.Integration.CMSReport.CMSDateOfBirthNoMatch(cmsDateOfBirthString,ccDateOfBirthString)+" "+
               displaykey.Integration.CMSReport.CMSSSNNoMatch(cmsImportRecord.SSN,getSSNFromPerson(person))+" "+
                 displaykey.Integration.CMSReport.CMSHicnToUpdate(cmsImportRecord.HICN,person.HICNExt)
              } 
           }
    }
    return false
 }
 /**
  * Find out if this person is a match based on the criteria used when sending the ISO report
  * LegalLastName is matched
  * If one of these is missing on the ClaimCenter side
  * then the corresponding LastName on the Basics tab are matched instead
  * as this is how ClaimCenter assembles the name to be sent to ISO
  */
 private function matchesPersonName(person:Person,cmsImportRecord : CMSReportImportRecordExt): Boolean {  
      if(matchesLastName(person,cmsImportRecord))
       {
         return true
       }
       else {
         return false
       }}

  private function matchesLastName(person:Person,cmsImportRecord : CMSReportImportRecordExt): Boolean {  
   var matches: boolean =false
   var reportLastName=cmsImportRecord.ClaimantLastName
      if (person.LegalLNameExt!=null&&person.LegalLNameExt.equalsIgnoreCase(reportLastName)){
        matches=true
      }
     else if (person.LastName!=null&&person.LastName.equalsIgnoreCase(reportLastName)){
       matches=true
     }
   return matches
 }
 
   private function matchesFirstName(person:Person,cmsImportRecord : CMSReportImportRecordExt): Boolean {  
   var matches: boolean =false
   var reportFirstName=cmsImportRecord.ClaimantFirstName
      if (person.LegalFNameExt!=null&&person.LegalFNameExt.equalsIgnoreCase(reportFirstName)){
        matches=true
      }
     else if (person.FirstName!=null&&person.FirstName.equalsIgnoreCase(reportFirstName)){
       matches=true
     }
   return matches
 }

 /**
 *  A person might not have an ssn, or may be identified by tax id instead of ssn
 * ssn is not mandatory at the iso validation level when the CMS request to ISO is sentmmm
 *  CMS provides only the last 4 digits of the ssn
 *  if the person has an ssn and its last 4 digits match those given by CMS then there is a match
 */
 private function ssnMatches(person:Person,cmsImportRecord : CMSReportImportRecordExt): Boolean {
   if (person.TaxID!=null&&person.Ex_TaxStatusCode==typekey.TaxStatusCode.TC_3){
      // this is ssn
      var cmsSSN=cmsImportRecord.SSN
      var ssnLength: int=cmsSSN.length()
      var cmsSSNLast4Digits=cmsSSN.substring(ssnLength-4)
      // only the last 4 digits are returned by CMS
      var personSSN=getSSNFromPerson(person)
      if (personSSN.length()>0&&personSSN.endsWith(cmsSSNLast4Digits)){
         return true
         }
      }
   return false
}

private function getSSNFromPerson(person:Person) : String {
  var ccSSN=""
   if (person.TaxID!=null&&person.Ex_TaxStatusCode==typekey.TaxStatusCode.TC_3){
     ccSSN=person.TaxID
   }
  return ccSSN
  
}
/**
 * Check if there is a matching HICN number
 */
 private function hicnMatches(person:Person,cmsImportRecord : CMSReportImportRecordExt): Boolean {
   if (person.HICNExt!=null){
      var cmsHICN=cmsImportRecord.HICN
      if (person.HICNExt!=null&&person.HICNExt.equalsIgnoreCase(cmsHICN)){
         return true
         }
      }
   return false
}
 /**
  * Find the exposure where the person in the CMS record is claimant
  * if there are two exposures for the same person then we assume that 
  * the person record is the same and needs to be updated only once
  * two persons - warning cannot resolve
  */
 private function findExposure(claim : Claim,cmsImportRecord : CMSReportImportRecordExt) : Exposure {
   var personList=new ArrayList<Person>()
   var exposureList=new ArrayList<Exposure>()
   var errorMessageList=new ArrayList<String>()
   var warningMessageList=new ArrayList<String>()
   errorMessage=null
   warningMessage=null
   var exposure:Exposure=null
   for (exp in claim.Exposures){
      errorMessage=null
      warningMessage=null
      var person = getClaimantPersonFromExposure(exp)
      if (person != null &&personMatches(person,cmsImportRecord)){
         if (!inPersonList(person,personList)){
            personList.add(person)
            exposureList.add(exp)
            errorMessageList.add(errorMessage)
            warningMessageList.add(warningMessage)
            }
          }
     }
   exposure=getUniqueExposure(personList,exposureList,warningMessageList,errorMessageList,cmsImportRecord )
   return exposure
 }
/**
 * Check whether the person is already in the list or not
 */ 
 private function inPersonList(person: Person, personList: List<Person>) : Boolean {
   var inList: boolean=false
   if (personList.size()>0){
       for (listPerson in personList){
         if (person.ID==listPerson.ID){
           inList=true
           break
         }
       }
   }
   return inList
 }
 /**
  * if there are more exposures try to find the one whose ssn or hicn matches the CMS report
  * if there is no such match then we cannot distinguish among the persons
  */
 private function getUniqueExposure(personList: List<Person>,exposureList: List<Exposure>, warningMessageList: List<String>,errorMessageList: List<String>,cmsImportRecord : CMSReportImportRecordExt) : Exposure {
   var exposure:Exposure=null
   if (personList.size()==1){//1
        exposure=exposureList.get(0)
        errorMessage=errorMessagelist.get(0)
        warningMessage=warningMessageList.get(0)
     }
     else {
       for (person in personList index i){//2
        // if either ssn or hicn matches we found the person she could be on two coverages
         if (ssnMatches(person,cmsImportRecord)||hicnMatches(person,cmsImportRecord)){//3
               exposure=exposureList.get(i)
               warningMessage=warningMessageList.get(i)
               errorMessage=errorMessageList.get(i)
               break
         }
         else if (exposure==null){//3
            // retrieve the exposure and the potential error/warning messages for this claimant
               exposure=exposureList.get(i)
               warningMessage=warningMessageList.get(i)
               errorMessage=errorMessageList.get(i)
             }
        else {
               // no unique name, cannot match
               errorMessage=displaykey.Integration.CMSReport.ClaimantNotUnique(cmsImportRecord.ClaimantLastName)
               warningMessage=null
               exposure=null
               break
         }//3
       }//2
     }//1
   return exposure
 }
 
 private function getClaimantPersonFromExposure(exp: Exposure) : Person {
    var person: Person =null
    if (exp.Claimant != null){
      try {
        person= exp.Claimant as Person
        }
      catch (e: Exception){
       // the person might be on another exposure, this is not necessarily an error
      }
      }
      
     return person
 }
 
 /**
 * Use the partial SSN returned from CMS if the user does not have ssn in the claim
 * 
 */
 private function  optUpdateSSN(person: Person, cmsImportRecord : CMSReportImportRecordExt): Person {
  // Logger.logInfo("CMSImportAPI -> cmsImportRecord.ssn: "+cmsImportRecord.SSN+"  person.TaxID: "+person.TaxID)
   if ((person.TaxID==null||person.TaxID.length()==0)&&cmsImportRecord.SSN!=null){
        // get last 4 characters
        var length: int = cmsImportRecord.SSN.length()
        // fill up with leading zero
        var ssnUpdate="00000"+cmsImportRecord.SSN.substring(length-4)
        person.TaxID=ssnUpdate
        person.Ex_TaxStatusCode=TaxStatusCode.TC_3  // 3 - Social Security Number (SSN) Non-Exempt
   }
   return person
   }
 /**
 * Use the name returned by CMS if the user does not have a Medicare 
 * name given at the claim creation, or the CMS legal name does not match the Medicare name
 */  
  private function  optUpdateCMSName(person: Person, cmsImportRecord : CMSReportImportRecordExt): Person {
     if (person.LegalFNameExt==null||person.LegalFNameExt.length()==0){
        person.LegalFNameExt=cmsImportRecord.CMSFirstName
     }
      if (person.LegalLNameExt==null||person.LegalLNameExt.length()==0){
        person.LegalLNameExt=cmsImportRecord.CMSLastName
     }
   return person
   } 
 /*********************************************************************
 /**
 * setDefaults is commonly performed when the adjuster sets the Medicare Eligible=yes
 * on the medicare data entry on CMSMedicareInfoInputSet.pcf
 * we have to do it when updating the person data from the application directly
 */
 private function setDefaults(bundle:Bundle,person:Person, claim: Claim, exposure:Exposure) {
    var contactISOMedicare= getContactISO(person)
    if (contactISOMedicare==null){
      contactISOMedicare = new ContactISOMedicareExt()
      //it is already in the bundle
      person.ContactISOMedicareExt=contactISOMedicare
    }
    else {
      // has to be added to the bundle
       contactISOMedicare=bundle.add(contactISOMedicare)
    }
    if(contactISOMedicare.CMSIncidentDateExt == null){
      contactISOMedicare.CMSIncidentDateExt = claim.LossDate
    }
    if(contactISOMedicare.StateOfVenueExt == null){
      for(medSt in MedicareState.getTypeKeys(false)){
        if(claim.LossLocation.Country != "US" and claim.LossLocation.Country != null){
          if(medSt.Code == "FC"){
            contactISOMedicare.StateOfVenueExt = medSt
          }
        }
        if(medSt.Code == claim.LossLocation.State.Code){
          contactISOMedicare.StateOfVenueExt = medSt
        }
      }
    } 
    if(contactISOMedicare.ProductLiabTypeExt == null){
      contactISOMedicare.ProductLiabTypeExt = ProductLiabilityTypeExt.TC_NO
    }  
    updateORM(contactISOMedicare,exposure) 
  }

private function getContactISO(person: Person): ContactISOMedicareExt {
   var contactISO: ContactISOMedicareExt=null
   var contactISOQuery = Query.make(ContactISOMedicareExt).compare("Contact",Equals,person.ID)
   if (contactISOQuery!=null){
      contactISO=contactISOQuery.select().AtMostOneRow
      }
   return contactISO
}
/**
 * Modified from new pcf_gs.Medicare_PageProc()
 */
 function updateORM(contactISOMedicare: ContactISOMedicareExt, exposure: Exposure) : ContactISOMedicareExt{
    if(contactISOMedicare.PersonClaimant.MedicareEligibleExt){
      if (exposure != null && exposure.IsORMExposure){
        contactISOMedicare.ORMIndExt = true    
      }else if(contactISOMedicare.ORMIndExt == null or exposure.ExposureType == ExposureType.TC_WC_EMPLOYERS_LIABILITY){
        contactISOMedicare.ORMIndExt = false 
      }
    }
    return contactISOMedicare
  } 
 /**********************************************************************
 /**
  * Notify the adjuster that the medicare information was updated base on the CMS data
  */
 private function createActivityForClaim(claim:Claim, exposure: Exposure,cmsImportRecord : CMSReportImportRecordExt)  : CMSReportImportResultExt{
     var result: CMSReportImportResultExt = new CMSReportImportResultExt()
     try {
       var claimant: Contact
       //claimant =  getClaimantPerson(claim,cmsImportRecord)
       claimant=getClaimantPersonFromExposure(exposure)
     // check for activity on this claimant
     if (claimant !=null){
       if(!exists(act in claim.Activities where (act.Claimant == claimant and act.Subject == "Medicare Eligibility confirmed by CMS"))){
         // create Activity
         var actCode = util.custom_Ext.finders.findActivityPattern("med_eligibility_confirm")
        var activity = claim.createActivityFromPattern(null, actCode)
         if (claimant != null){
           activity.Claimant = claimant
           activity.Description = displaykey.Rules.Activities.ISO.CMS.MedEligibility(claimant)
         }
         // create Note
         createNoteForClaim(claim, claimant)
        }
     }
     result=buildGoodResult(claim)
   }
   catch (e: Exception){
      var errMessage=e.Message
      if (errMessage==null||errMessage=="null") {
        errMessage=""
      }// forget the warning - error is stronger
      warningMessage=null
      result=buildErrorResult(errMessage,claim,cmsImportRecord,NO_UPDATE)
   }
     return result
     }
   /**
  * Notify the adjuster that the medicare information was updated,
  * and there was an error, and the report should be sent to ISO again
  * after correcting the error
  */
 private function createActivityForClaimWithCMSError(claim:Claim, exp: Exposure, dispositionCode: String,
                              cmsImportRecord : CMSReportImportRecordExt)  : CMSReportImportResultExt{
   var result: CMSReportImportResultExt = new CMSReportImportResultExt()
   try {
   // check for an exposure and for disposition code 51
   if (exp!=null && dispositionCode.equals("51")){
     // create Activity
     var actCode = util.custom_Ext.finders.findActivityPattern("inj_party_not_bene")
     var activity = claim.createActivityFromPattern(null, actCode)
     if (exp.Claimant != null){
       activity.Claimant = exp.Claimant
       activity.Description = displaykey.Rules.Activities.ISO.CMS.InjuredParty(exp.Claimant)
     }
     result=buildGoodResult(claim)
     }
    else if (!dispositionCode.equals("51")){
      Logger.logInfo("CMSImportAPI: "+displaykey.Integration.CMSReport.NoSuchDispositionCode(dispositionCode))
      result=buildErrorResult(displaykey.Integration.CMSReport.NoSuchDispositionCode(dispositionCode),claim,cmsImportRecord,NO_UPDATE_MESSAGE)
     //  result=buildErrorResult(dispositionCode+" : no such error from CMS is processed",cmsImportRecord)
      }
   }
   catch (e: Exception){
      var errMessage=e.Message
      if (errMessage==null||errMessage=="null") {
        errMessage=""
      }
      result=buildErrorResult(errMessage,claim,cmsImportRecord,NO_UPDATE)
   }
   return result
 }
  
  /**
   * there should be a note per claimant - todo
   */   
 private function createNoteForClaim(claim:Claim, claimant:Contact){
   // create note
   var note:Note
   var noteBody:String
   noteBody = displaykey.Notes.NoteBody.MedicareEligibility(claimant)
   note = claim.addNote(NoteTopicType.TC_MEDICARE, noteBody)
   note.Subject = displaykey.Notes.NoteSubject.MedicareEligibility
 }

 /*****************************************************************************
  /**
   * Create the error message and update the processing status accordingly
   * Note that updating the processing status in the ClaimCenterExternal
   * database is the responsibility of the Medicare Report Import batch process
   * that invokes CMSImportAPI
   */
 private function buildErrorResult(message:String,claim:Claim,cmsImportRecord : CMSReportImportRecordExt,updateSign: String) : CMSReportImportResultExt {
    var errorResult  = initCMSReportImportResult(claim)
    if (message!=null&&message.length()>0&&!message.endsWith(PERIOD)) message+=PERIOD
    errorResult.ErrorMessage=""
    if (message==null|| message.length()==0 ){
        errorResult.ErrorMessage = 
        cmsImportRecord.ClaimNumber+" "+cmsImportRecord.ClaimantFirstName
           +" "+cmsImportRecord.ClaimantLastName+" -> "+message
        errorResult.Status = CMSReportImportStatusExt.TC_EXCEPTION as String
       }
       else {
         errorResult.ErrorMessage =addUpdateMessage(message,updateSign)
          errorResult.Status = CMSReportImportStatusExt.TC_EXCEPTION as String
     }
     if (errorMessage!=null){
         if (errorResult.ErrorMessage==null)
            errorResult.ErrorMessage=addUpdateMessage(errorMessage, updateSign)
         else {
           if (errorResult.ErrorMessage.indexOf("CMS Date of Birth") >=0&&errorMessage.indexOf("CMS Date of Birth")>=0){
             // there can be more than one exposure on the claim with same claimant,
             // give only one message
             errorResult.ErrorMessage=addUpdateMessage(errorMessage, updateSign)
           }
           else {    
              errorResult.ErrorMessage+=" "+addUpdateMessage(errorMessage, updateSign)
           }
         }
       errorResult.Status = CMSReportImportStatusExt.TC_EXCEPTION as String
       }
    if (warningMessage!=null&&errorMessage==null){ // error message is stronger than warning
       errorResult.ErrorMessage=addUpdateMessage(warningMessage,updateSign)
       errorResult.Status=CMSReportImportStatusExt.TC_WARNING as String
    }
    warningMessage=null
    errorMessage=null
    return errorResult     
  }
  
  private function addUpdateMessage(message: String, updateSign: String): String {
    var updatedMessage=message
    if (updateSign==NO_UPDATE){
      updatedMessage+=" "+displaykey.Integration.CMSReport.NoUpdate
    }
    else if (updateSign==YES_UPDATE){
      updatedMessage+=" "+displaykey.Integration.CMSReport.YesUpdate
    }
    return updatedMessage
  }

  /**
  * All went well, the record is processed
  */
   private function buildGoodResult(claim:Claim) : CMSReportImportResultExt {
    var result  = initCMSReportImportResult(claim)
       if (warningMessage!=null) result.ErrorMessage=warningMessage+" "+displaykey.Integration.CMSReport.YesUpdate
       result.Status = CMSReportImportStatusExt.TC_PROCESSED as String
    return result     
  }
  
    /**
  * All went well, the record is processed
  */
   private function buildClaimNotFoundResult() : CMSReportImportResultExt {
    var result  = new CMSReportImportResultExt()
       result.Status = CMSReportImportStatusExt.TC_CLAIMNOTFOUND as String
    return result     
  }
  
  private function initCMSReportImportResult(claim:Claim): CMSReportImportResultExt {
    var result  = new CMSReportImportResultExt()
    if (claim!=null) {
        result.BusinessUnitName=claim.LOBCode.Description // line of business
        result.AdjusterName=claim.AssignedUser.DisplayName  // result should have an adjuster field
        result.ClaimStatus=claim.State.DisplayName  // needed in report
    }
    return result
  }
  //*****************************************************************
  /**
   * get script parameter
   * /
   */
public function getScriptParameter(parameterName: String) : String {
    var parameterValue: String =null
    if (parameterName.equalsIgnoreCase("CMSReportImport_emailSupport")){
      parameterValue=ScriptParameters.CMSReportImport_emailSupport
      }
    else if (parameterName.equalsIgnoreCase("CMSReportImport_emailMaint")){
      parameterValue=ScriptParameters.CMSReportImport_emailMaint
      }
    else if (parameterName.equalsIgnoreCase("CMSReportImport_fileDatePeriodInDays")){
      parameterValue=ScriptParameters.CMSReportImport_fileDatePeriodInDays
      }
    return parameterValue
  
  }
}