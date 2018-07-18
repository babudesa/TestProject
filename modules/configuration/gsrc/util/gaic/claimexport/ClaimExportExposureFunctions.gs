package util.gaic.claimexport
uses util.gaic.claimexport.gaigclaimexport.enums.RecordTypeEnum

/**
 * Class handles exposure changed event messages for the
 * claims data export
 */
class ClaimExportExposureFunctions {

  private construct() {
    
  }
  
  @Returns("a new instance of ClaimExportExposureFunctions class")
  static function getInstance() : ClaimExportExposureFunctions {
      return new ClaimExportExposureFunctions();
  }
  
  
  /**
  * Builds exposure changed messages and sends to CC external
  */
  @Param("messageContext", "the context of the message")
  @Param("exposure","the exposure to check for changes")
  @Param("recordType", "the record type associated with this message")
  function sendExposureChanges(messageContext : MessageContext, exposure : Exposure, recordType : RecordTypeEnum) {
           
    if(this.exposureChanged(exposure)) {
      var message = ClaimExportUtil.buildClaimExportMessage(exposure.Claim, recordType)

      if(message != null && message != ""){
          ClaimExportUtil.sendMessage(messageContext, message)
      }
    }       
  }
    
  
  /**
  * Checks to see if the exposure has changed
  */
  @Param("exposure", "the exposure to check for changes")
  @Returns("the changed status of the exposure")
  protected function exposureChanged(exposure : Exposure) : boolean {
    
    if(this.exposureFieldChanged(exposure)){
        return true;
    }else{
        return false
    }     
  }
  
  
  /**
  * Checks to see if specific fields have changed on the exposure.
  */
  @Param("exposure", "the exposure to check for field changes")
  @Returns("the changed field status of the exposure")
  protected function exposureFieldChanged(exposure : Exposure) : boolean {
    var fields = new String[] {"CloseDate", "MMIDateExt"};

    if(util.gaic.CommonFunctions.fieldFromListChanged(exposure, fields)) {
      return true;
    }else{
      return false
    }
  }
  
  /**
  * Checks to see if specific fields have changed on the exposure coverage.
  */
  @Param("exposure", "the exposure to check for field changes")
  @Returns("the changed field status of the exposure")
  protected function coverageFieldChanged(exposure : Exposure) : boolean {
    var expoFields = new String[] {"Coverage"}
    var expoCoverageChanged : boolean = util.gaic.CommonFunctions.fieldFromListChanged(exposure, expoFields)
    var changed : boolean = false
    
    if(expoCoverageChanged) {
      if((exposure.OriginalVersion as Exposure).Coverage.GoverningLawExt != exposure.Coverage.GoverningLawExt) {
        changed = true
      }else {
        changed = false
      }
    }
    return changed
  }

}//end ClaimExportExposureFunctions
