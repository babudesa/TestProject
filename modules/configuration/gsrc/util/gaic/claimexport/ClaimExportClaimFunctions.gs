package util.gaic.claimexport
uses util.gaic.claimexport.gaigclaimexport.enums.RecordTypeEnum

class ClaimExportClaimFunctions {

  private construct() {}
  
  private static final var CUSTOM_SEND_EVENT_NAME : String = "ClaimExportTrigger"
  
  @Returns("a new instance of ClaimExportClaimFunctions class")
  static function getInstance() : ClaimExportClaimFunctions {
    return new ClaimExportClaimFunctions();
  }
    

  /**
  * Builds claim changed messages and sends to CC external
  */
  @Param("messageContext", "the context of the message")
  @Param("claim","the contact to check for changes")
  @Param("recordType", "the record type associated with this message")
  function sendClaimChanges(messageContext : MessageContext, claim : Claim, recordType : RecordTypeEnum) {
    var message :String = null
    
    //If this is a custom claim export trigger then send without checking changes.
    if(messageContext.EventName.equalsIgnoreCase(CUSTOM_SEND_EVENT_NAME)) {
      message = ClaimExportUtil.buildClaimExportMessage(claim, recordType)    
    }else{    
      if(this.claimChanged(claim)) {
        message = ClaimExportUtil.buildClaimExportMessage(claim, recordType)
      }  
    }
    
    //if message isn't null or empty then send it
    if(message != null && message != ""){
        ClaimExportUtil.sendMessage(messageContext, message)
    }
  }


  /**
  * Returns true if the claim has changed.
  */
  @Param("claim", "the claim to check for changes")
  @Returns("the changed status of the claim")
  protected function claimChanged(claim : Claim) : boolean {
    
    if(this.claimFieldChanged(claim) || this.bodyPartsChanged(claim) || this.claimInjuryIncidentFieldChanged(claim)
      || this.diagnosticCodesChanged(claim)){
        return true;
    }else{
        return false
    }     
  }
  
  
  /**
  * Checks to see if specific fields have changed on the claim.
  */
  @Param("claim", "the claim to check for field changes")
  @Returns("the changed field status of the claim")
  private function claimFieldChanged(claim : Claim) : boolean {
    var fields = new String[] {"LossDate","ReportedDate", "AssignedUser", "State", "JurisClaimNumberExt",
      "JurisdictionState", "CloseDate", "Policy", "MMIDate", "ReOpenDate", "IncidentReport", "Description", 
      "ex_DetailLossCause", "NCWOnlyBusinessUnitExt", "AssignmentStatus"}

    if (util.gaic.CommonFunctions.fieldFromListChanged(claim, fields)) {
      return true
    }else{
      return false
    }
  }
    
  
  /**
  * Checks to see if specific fields have changed on the claim injury incident.
  */
  @Param("claim", "the claim to check for injury incident changes")
  @Returns("the changed status of the claim's injury incident")
  private function claimInjuryIncidentFieldChanged(claim : Claim) : boolean {      
    var fields = new String[] {"DetailedInjuryType", "ReturnToWorkDate", "ReturnToModWorkActual"}

    if (util.gaic.CommonFunctions.fieldFromListChanged(claim.ClaimInjuryIncident, fields)) {
      return true
    }else{
      return false
    }
  }
    
    
  /**
  * Checks to see if any fields on the body parts.
  */
  @Param("claim", "the claim to check for body part changes")
  @Returns("the changed status of the claims's body parts")
  private function bodyPartsChanged(claim : Claim) : boolean {
    var fields = new String[] {"DetailedBodyPart", "PrimaryExt"}
    var changed : boolean = null
      
      //check for specified changed fields on each bodypart
      for(part in claim.ClaimInjuryIncident.BodyParts) {          
        if(util.gaic.CommonFunctions.fieldFromListChanged(part, fields)){
          changed = true
          break
        }       
      }   
      
      //if there were body parts on the claim before and now they have been
      //removed then the claim changed.
      if((claim.OriginalVersion as Claim).ClaimInjuryIncident.BodyParts.Count > claim.ClaimInjuryIncident.BodyParts.Count) {
           changed = true                 
      }
      
    return changed
  }  
  
  
  /**
  * Checks to see if any diagnostic codes changed
  */
  @Param("claim", "the claim to check for changed diagnostic codes")
  @Returns("the changed status of the claim's diagnostic codes")
  private function diagnosticCodesChanged(claim : Claim) : boolean {
    var fields = new String[] {"ICDCode"}
    var changed : boolean = null
    
    for(code in claim.ClaimInjuryIncident.InjuryDiagnoses) {
      if(util.gaic.CommonFunctions.fieldFromListChanged(code, fields)){
          changed = true
          break
        }         
    }
    
    //if there were icds on the claimant before and now they have been
    //removed then the claim changed.
    if((claim.OriginalVersion as Claim).ClaimInjuryIncident.InjuryDiagnoses.Count > claim.ClaimInjuryIncident.InjuryDiagnoses.Count) {
         changed = true                 
    }
    
    return changed
  }  
    
}//end ClaimExportClaimFunctions
