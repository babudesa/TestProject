package util.gaic.LDM

uses templates.messaging.LDM.LawClaimTemplate
uses templates.messaging.LDM.LawMatterTemplate
uses templates.messaging.LDM.AdjusterTemplate
uses templates.messaging.LDM.LawPolicyTemplate
uses templates.messaging.LDM.LawFeatureTemplate
uses templates.messaging.LDM.LawClaimantTemplate
uses templates.messaging.LDM.commons.TransactionBaseTemplate
uses java.util.HashSet
uses java.util.ArrayList
uses java.util.Date
uses java.util.GregorianCalendar


/**
* This class performs the functions to build and send claim changes to LDM.
* 
* @author kepage
* @since 2013-01-22
*/
class LDMClaimFunctions {

  private construct() {
    
  }
  
    /**
    * Returns a new instance of the LDMClaimFunctions class.
    * 
    * @return a new instance of LDMClaimFunctions class.
    */
    static function getInstance() : LDMClaimFunctions {
        return new LDMClaimFunctions();
    }
    

    /**
    * Builds claim changed messags and sends message to LDM
    * 
    * @param messageContext the context of the message.
    * @param claim the claim that changed.
    */
    function sendClaimChanges(messageContext : MessageContext, claim : Claim) {
        var message = this.buildClaimChangedMessage(claim)

        if(message != null && message != ""){
            sendMessage(messageContext,buildClaimChangedMessage(claim))
        }
    }

  
    /**
    * Build CC outbound message to LDM for Claim Changed Event
    * 
    * @param claim the claim that changed.
    * @return the completed contact changed message.
    */
    protected function buildClaimChangedMessage(claim : Claim) : String {
        var messageContent = new String()
        var contacts = new HashSet<Contact>()
        var matters = new HashSet<MatterAssignmentExt>()
        var claimant = new HashSet<Contact>()
        var assignExposure = new HashSet<AssignmentExposureExt>()
        
        if(this.claimChanged(claim) && !this.getAssociatedMatterAssignments(claim).Empty) {
            for(ex in claim.Exposures){
              if(ex.ChangedFields.contains("AssignedUser")){
                contacts.add(ex.AssignedUser.Contact)
                claimant.add(ex.Claimant)
                for(ae in getAssignmentExposures(ex))
                  assignExposure.add(ae)
              }
            }
         
            
            if (contacts.size() > 0){
              for (cont in contacts){
                if (cont == null) continue
                  messageContent = messageContent + AdjusterTemplate.renderToString(cont, "A")
              }
            }
            
            if (assignExposure.size() > 0){
              for (assign in assignExposure){
                if (assign == null) continue
                  messageContent = messageContent + LawFeatureTemplate.renderToString(assign, "E")
              }
            }
            
            if (claimant.size() > 0){
              for (cont in claimant){
                if (cont == null) continue
                  messageContent = messageContent + LawClaimantTemplate.renderToString(cont, "C")
              }  
            }            
            
            for(ma  in claim.Matters*.MatterAssignmentsExt){
              var cutoffDate : Date = (new GregorianCalendar(2013,4,2)).getTime();
              if (ma.CreateTime.compareTo(cutoffDate) == -1) continue;
              messageContent = messageContent + LawClaimTemplate.renderToString(ma, "C")
              //messageContent = messageContent + LawMatterTemplate.renderToString(ma, "E")
              matters.add(ma)
            }                                         
        }
        
        if(claim.PolicyChanged && claim.Matters != null){
          if(!getAssociatedMatterAssignments(claim).Empty){
            for(ma in getAssociatedMatterAssignments(claim)){
              messageContent += LawPolicyTemplate.renderToString(ma, "C")
              //messageContent += LawMatterTemplate.renderToString(ma, "E")
              matters.add(ma)
            }
          }
        }
        
        if(matters.size() > 0){
          for(ma in matters){
            if(ma == null)
              continue
            messageContent = messageContent + LawMatterTemplate.renderToString(ma, "E")
          }
        }
    
        if(messageContent != null && messageContent != ""){       
            //add message into base template
            messageContent  = TransactionBaseTemplate.renderToString(messageContent)
        }
    
        return(messageContent)
    }
    
    /**
    * Returns MatterAssignmentExt entities associated with the claim.
    * 
    * @param claim the Claim to be checked.
    * @return the MatterAssignmentExt entities where the assignment is on a claim associated
    * with the given claim.
    **/
    protected function getAssociatedMatterAssignments(claim : Claim) : ArrayList<MatterAssignmentExt>{
        var associatedAssignments = new ArrayList<MatterAssignmentExt>()
        associatedAssignments.addAll(claim.Matters*.MatterAssignmentsExt as java.util.Collection<entity.MatterAssignmentExt>)
        return associatedAssignments
    }

    /**
    * Returns true if the claim has changed.
    * 
    * @param claim the claim to check for changes.
    * @return changed status of the claim.
    */
    protected function claimChanged(claim : Claim) : boolean {
      
        if(this.claimFieldChanged(claim)){
            return true;
        }else{
            return false
        }     
    }
  
  /**
    * Checks to see if specific fields have changed on the claim.
    * 
    * @param claim the claim to check for changes.
    * @return changed status of the claim
    */
    private function claimFieldChanged(claim : claim) : boolean {
        var fields = new String[] {"LossDate","ReportedDate","Description", "AssignedUser", "JurisClaimNumberExt"};
    
        if (util.gaic.CommonFunctions.fieldFromListChanged(claim, fields)) {
          return true;
        }else{
            return false
        }
    }

    /**
    * Returns MatterAssignmentExt entities associated with the claim.
    * 
    * @param claim the Claim to be checked.
    * @return the MatterAssignmentExt entities where the assignment is on a claim associated
    * with the given claim.
    **/
    protected function getAssignmentExposures(exposure : Exposure) : ArrayList<AssignmentExposureExt>{
        var assignmentExposures = new ArrayList<AssignmentExposureExt>()
        for(ae in exposure.Claim.Matters*.MatterAssignmentsExt*.AssignmentExposuresExt){
          if(ae.Exposure.ID == exposure.ID){
            assignmentExposures.add(ae) 
          }
        }
        return assignmentExposures
    }
  
    /**
    * Sends the message to LDM
    * 
    * @param messageContext the context of the message.
    * @param messageContent the message.
    */
    protected function sendMessage(messageContext : MessageContext, messageContent : String){
       //TODO: activate this when the transport plugin is working
       util.gaic.CommonFunctions.sendTemplateMessage(messageContext, messageContent);   

    }
    

}//End LDMClaimFunction class