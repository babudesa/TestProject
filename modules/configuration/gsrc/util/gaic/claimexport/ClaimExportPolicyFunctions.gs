package util.gaic.claimexport
uses util.gaic.claimexport.gaigclaimexport.enums.RecordTypeEnum

/**
 * Class handles policy changed event messages for the claims
 * data export
 */
class ClaimExportPolicyFunctions {

  private construct() {}

  @Returns("a new instance of ClaimExportPolicyFunctions class")
  static function getInstance() : ClaimExportPolicyFunctions {
    return new ClaimExportPolicyFunctions();
  }
  
  
  /**
  * Builds policy changed messages and sends to CC external
  */
  @Param("messageContext", "the context of the message")
  @Param("policy","the policy to check for changes")
  @Param("recordType", "the record type associated with this message")
  function sendPolicyChanges(messageContext : MessageContext, policy : Policy, recordType : RecordTypeEnum) {
           
    if(this.policyChanged(policy)) {
      var message = ClaimExportUtil.buildClaimExportMessage(policy.Claim, recordType)

      if(message != null && message != ""){
          ClaimExportUtil.sendMessage(messageContext, message)
      }
    }       
  }
  
  
  /**
   * Checks to see if the policy has changed
   */
  @Param("policy", "the policy to check for changes")
  @Returns("the changed status of the policy")
  protected function policyChanged(policy : Policy) : boolean {
    
    if(this.policyFieldChanged(policy) || this.agencyFieldChanged(policy) || this.coverageFieldChanged(policy)){
        return true;
    }else{
        return false
    }     
  }  
  
  
  /**
  * Checks to see if specific fields have changed on the policy.
  */
  @Param("policy", "the policy to check for field changes")
  @Returns("the changed field status of the policy")
  private function policyFieldChanged(policy : Policy) : boolean {
    var fields = new String[] {"IssuingCompanyExt","EffectiveDate", "ExpirationDate", "NAICSCodeExt", "PolicyNumber",
        "PolicySuffix", "PolicyType"};
   
    if (util.gaic.CommonFunctions.fieldFromListChanged(policy, fields)) {      
      return true;
    }else{
        return false
    }
  }
  
  
  /**
   * Checks to see if specific fields have changed on the agency
   */
  @Param("policy", "the policy to check for field changes")
  @Returns("the changed field status of the agency on the policy")
  private function agencyFieldChanged(policy : Policy) : boolean {
    var agency = policy.ex_Agency
    var fields = new String[] {"ex_AgencyProfitCenter"};
   
    if (util.gaic.CommonFunctions.fieldFromListChanged(agency, fields)) {      
      return true;
    }else{
        return false
    }
  } 
  
  
    /**
   * Checks to see if specific fields have changed on the coverages
   */
  @Param("policy", "the policy to check for field changes")
  @Returns("the changed field status of the agency on the policy")
  private function coverageFieldChanged(policy : Policy) : boolean {
    var changed : boolean = false
    
    for(cov in policy.Claim.Exposures*.Coverage) {
      if((cov.OriginalVersion as Coverage).GoverningLawExt != cov.GoverningLawExt){
        return true;
      }      
    }
    return changed
  } 
  
  

}//end ClaimExportPolicyFunctions
