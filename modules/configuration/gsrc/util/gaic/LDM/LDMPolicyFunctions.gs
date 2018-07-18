package util.gaic.LDM

uses templates.messaging.LDM.LawPolicyTemplate
uses templates.messaging.LDM.LawMatterTemplate
uses templates.messaging.LDM.commons.TransactionBaseTemplate
uses java.util.ArrayList


/**
* This class performs the functions to build and send policy changes to LDM.
* 
* @author kepage
* @since 2013-01-22
*/
class LDMPolicyFunctions {

    private construct() {

    }
  
  
    /**
    * Gets a new instance of the LDMPolicyFunctions class.
    * 
    * @return a new instance of LDMPolicyFunctions class.
    */
    static function getInstance() : LDMPolicyFunctions {
        return new LDMPolicyFunctions();
    }
  
  
    /**
    * Builds policy changes and sends message to LDM
    * 
    * @param messageContext the context of the message.
    * @param policy the policy that changed.
    */
     function sendPolicyChanges(messageContext : MessageContext, policy : Policy) {
    
        var message = this.buildPolicyChangedMessage(policy)
    
        if(message != null && message != ""){
            sendMessage(messageContext,message)
        }
    }
   
   
    /**
    * Build CC outbound message to LDM for Policy Changed Event
    * 
    * @param policy the policy that changed.
    * @return the completed policy changed message.
    */
    protected function buildPolicyChangedMessage(policy : Policy) : String {
        var messageContent =  new String()
      
        if(this.policyChanged(policy)){
          
            if(!this.getAssociatedMatterAssignments(policy).Empty){
              
                for(ma in this.getAssociatedMatterAssignments(policy)){
                    messageContent = messageContent + LawPolicyTemplate.renderToString(ma, "C")
                    messageContent = messageContent + LawMatterTemplate.renderToString(ma, "E")
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
    * Returns true if the policy has changed.
    * 
    * @param policy the policy to check for changes.
    * @return changed status of the policy.
    */
    protected function policyChanged(policy : Policy) : boolean {
  
          if(this.policyFieldChanged(policy)){
                return true;
          }else{
              return false
          }     
    }

  
    /**
    * Checks to see if specific fields have changed on the policy.
    * 
    * @param policy the policy to check for changes.
    * @return changed status of the policy.
    */
    private function policyFieldChanged(policy : Policy) : boolean {
        var fields = new String[] {"EffectiveDate", "ExpirationDate"};
    
        if (util.gaic.CommonFunctions.fieldFromListChanged(policy, fields)) {
          return true;
        }else{
            return false
        }
    }
  
  
    /**
    * Returns MatterAssignmentExt entities associated with the policy.
    * 
    * @param policy the policy.
    * @return the MatterAssignmentExt entities where the assignment is on a claim associated
    * with the given policy.
    **/
    protected function getAssociatedMatterAssignments(policy : Policy) : ArrayList<MatterAssignmentExt>{
        var associatedAssignments = new ArrayList<MatterAssignmentExt>()
        var associatedClaims = find(claim in Claim where claim.Policy == policy)

        for(claim in associatedClaims){
            associatedAssignments.addAll(claim.Matters*.MatterAssignmentsExt as java.util.Collection<entity.MatterAssignmentExt>)
        }

        return associatedAssignments
    }
  
  
    /**
    * Sends the message to LDM
    * 
    * @param messageContext the context of the message.
    * @param messageContent the message.
    */
    protected function sendMessage(messageContext : MessageContext, messageContent : String){
         util.gaic.CommonFunctions.sendTemplateMessage(messageContext, messageContent);   
    }


}//End LDMPolicyFuncitons class
