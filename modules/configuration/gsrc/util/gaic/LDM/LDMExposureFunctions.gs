package util.gaic.LDM
uses templates.messaging.LDM.commons.TransactionBaseTemplate
uses templates.messaging.LDM.LawFeatureTemplate
uses templates.messaging.LDM.AdjusterTemplate

uses templates.messaging.LDM.LawClaimantTemplate
uses java.util.ArrayList
uses java.util.HashSet

class LDMExposureFunctions {

  construct() {

  }
  
    /**
    * Gets a new instance of the LDMExposureFunctions class.
    * 
    * @return a new instance of LDMExposureFunctions class.
    */
    static function getInstance() : LDMExposureFunctions {
        return new LDMExposureFunctions()
    }
    
     /**
    * Builds exposure changed messages and sends message to LDM
    * 
    * @param messageContext the context of the message.
    * @param exposure that is changed.
    */
    function sendExposureChanges(messageContext : MessageContext, exposure : Exposure) {
        var message = this.buildExposureMessage(exposure)
        if(message != null && message != ""){
      
          sendMessage(messageContext,message)
        } 
    }
    
    /**
    * Builds exposure changed messages and sends message to LDM
    * 
    * @param exposure that is changed.
    * 
    * @return the string of text to send of the export xml.
    */
      public function buildExposureMessage(exposure : Exposure) : String {
      var assignmentExposures = new HashSet<AssignmentExposureExt>()
      var claimant = new HashSet<Contact>()
      var adjuster = new HashSet<Contact>()
      
        
      var messageContent : String
      messageContent=""
      if(exposure.Claim.Matters != null && exposureFieldChanged(exposure)){
        for(ae in exposure.Claim.Matters*.MatterAssignmentsExt*.AssignmentExposuresExt){
          if(ae.Exposure.ID == exposure.ID){
            assignmentExposures.add(ae) 
            adjuster.add(ae.Exposure.AssignedUser.Contact)
            claimant.add(ae.ClaimantExt)
          }
        }
        if (assignmentExposures.size() > 0){
          for (cont in assignmentExposures){
            if (cont == null) continue
              messageContent = messageContent + LawFeatureTemplate.renderToString(cont, "C")
          }
        }
        if (claimant.size() > 0){
          for (cont in claimant){
            if (cont == null) continue
              messageContent = messageContent + LawClaimantTemplate.renderToString(cont, "C")
          }
        }
        if(adjuster.size() > 0){
          for(adj in adjuster){
            if(adj == null) continue
              messageContent = messageContent + AdjusterTemplate.renderToString(adj, "C")
          }
        }
      }
      if(messageContent != null && messageContent != ""){
        //add message into base template
        messageContent  = TransactionBaseTemplate.renderToString(messageContent)
      }
      return(messageContent)
    }
    
    /**
    * Checks to see if the exposure fields related to the LDM export have changed
    * 
    * @param exposure to be tested.
    *     
    * @return a boolean that indicates if the exposure has been updated.
    */
    protected function exposureFieldChanged(exposure : Exposure) : boolean {
        var fields = new String[] {"AssignedUser"};
        var orignalExposure = exposure.OriginalVersion as Exposure
       
        if(util.gaic.CommonFunctions.fieldFromListChanged(exposure, fields) || exposure.Claim.PolicyChanged || exposure.Claimant != orignalExposure.Claimant) {
            return true;
        }else{
            return false
        }
    }
    
    protected function sendMessage(messageContext : MessageContext, messageContent : String){
      util.gaic.CommonFunctions.sendTemplateMessage(messageContext, messageContent);   
   }
}
