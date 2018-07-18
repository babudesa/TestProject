package util.gaic.claimexport
uses util.gaic.claimexport.gaigclaimexport.enums.RecordTypeEnum

/**
* Class handles the claim contact changed event messages for 
* the claim data export
*/
class ClaimExportClaimContactFunctions {

  private construct() {
    
  }
  

  @Returns("a new instance of ClaimExportClaimContactFunctions class")
  static function getInstance() : ClaimExportClaimContactFunctions {
      return new ClaimExportClaimContactFunctions();
  }


  /**
  * Builds contact changed messages and sends to CC external
  */
  @Param("messageContext", "the context of the message")
  @Param("contact","the contact to check for changes")
  @Param("recordType", "the record type associated with this message")
  function sendContactChanges(messageContext : MessageContext, contact : ClaimContact, recordType : RecordTypeEnum) {
           
    if(this.contactChanged(contact)) {
      var message = ClaimExportUtil.buildClaimExportMessage(contact.Claim, recordType)

      if(message != null && message != ""){
          ClaimExportUtil.sendMessage(messageContext, message)
      }
    }       
  }
    
 
  /**
  * Returns true if the contact has changed.
  */
  @Param("claimContact", "the claim contact to check for changes")
  @Returns("the changed status of the contact")
  protected function contactChanged(claimContact : ClaimContact) : boolean {
    var changed : boolean = null
    
    //if contact is a claimant
    if(exists(role in claimContact.Roles where role.Role == ContactRole.TC_CLAIMANT) &&
    (this.claimantChanged(claimContact.Claim) || claimantAddressChanged(claimContact.Contact))){
      changed = true
    
    //if contact is the insured
    }else if(exists(role in claimContact.Roles where role.Role == ContactRole.TC_INSURED) &&
     (this.insuredFieldChanged(claimContact.Contact) || this.insuredAddressChanged(claimContact.Contact))) {
       changed = true 
    
    //nothing of interest changed
    }else {
      changed = false
    }
    
    return changed
  }
    
 
  /**
  * Checks to see if the claimant changed
  */
  @Param("claim", "the claim to check for claimant changes")
  @Returns("the changed status of the claimant")
  private function claimantChanged(claim : Claim) : boolean {
    var fields = new String[] {"FirstName", "LastName", "MiddleName", "DateOfBirth", "Gender", "TaxID"}
    var changed : boolean = null

    if (util.gaic.CommonFunctions.fieldFromListChanged(claim.claimant, fields)) {
      changed = true
    }
    
    //if the phone number value is different then the claimant changed
    if((claim.OriginalVersion as Claim).claimant.PrimaryPhoneValue != claim.claimant.PrimaryPhoneValue) {
      changed = true
    }
    
    return changed
  }
    
    
  /**
  * Checks to see if the address changed
  */
  @Param("claimant", "the claimant to check for address changes")
  @Returns("the changed status of the claimant's address")
  private function claimantAddressChanged(claimant : Contact) : boolean {
    return ClaimExportUtil.addressChanged(claimant.PrimaryAddress)
  }
  

  /**
  * Checks to see if specific fields have changed on the insured
  */
  @Param("insured", "the insured to check for field changes")
  @Returns("the changed field status of the policy")
  private function insuredFieldChanged(insured : Contact) : boolean {
    
    var fields : String[] = null
    
    if(insured typeis Company) {
      fields = new String[] {"TaxID", "Name"};
    }else if(insured typeis Person) {
      fields = new String[] {"TaxID", "FirstName","LastName", "Name"};
    }

    if (util.gaic.CommonFunctions.fieldFromListChanged(insured, fields)) {      
      return true;
    }else{
        return false
    }    
  }
  
  /**
  * Checks to see if the insured address has changed
  */
  @Param("insured", "the insured to check for address changes")
  @Returns("the changed status of the insured's address")
  private function insuredAddressChanged(insured : Contact) : boolean {
    return ClaimExportUtil.addressChanged(insured.PrimaryAddress)
  }

  
  
}//end ClaimExportClaimContactFunctions

