package util.gaic.LDM

uses java.util.ArrayList
uses java.util.HashSet
uses templates.messaging.LDM.commons.TransactionBaseTemplate
uses templates.messaging.LDM.LawMatterTemplate
uses templates.messaging.LDM.AdjusterTemplate
uses templates.messaging.LDM.LawFirmTemplate
uses templates.messaging.LDM.AttorneyTemplate
uses templates.messaging.LDM.LawMediationTemplate
uses templates.messaging.LDM.LawClaimantTemplate
uses templates.messaging.LDM.ClaimIDTemplate
uses templates.messaging.LDM.LegalActionTemplate
uses templates.messaging.LDM.LawFeatureTemplate
uses templates.messaging.LDM.LawClaimFeatureIDTemplate

/**
* This class performs the functions to build and send contact changes to LDM.
* Used to detect & send changes related to Adjuster, Claimant, and contacts
* associated with Matter and MatteAssignmentExt entities.
* 
* @author kepage
* @since 2013-01-22
*/
class LDMContactFunctions {

    private  construct() {

    }  
  
  
    /**
    * Gets a new instance of the LDMContactFunctions class.
    * 
    * @return a new instance of LDMContactFunctions class.
    */
    static function getInstance() : LDMContactFunctions {
        return new LDMContactFunctions()
    }
  
  
    /**
    * Builds contact changed messages and sends message to LDM
    * 
    * @param messageContext the context of the message.
    * @param contact the contact that changed.
    */
    function sendContactChanges(messageContext : MessageContext, contact : Contact) {
  
        var message =  this.buildContactChangedMessage(messageContext, contact)
  
        if(message != null && message != ""){
            sendMessage(messageContext, message)
        }  
    }
    
     
    /**
    * Build CC outbound message to LDM for Contact Changed Event
    * 
    * @param contact the contact that changed.
    * @return the completed contact changed message.
    */
    protected function buildContactChangedMessage(messageContext : MessageContext, contact : Contact) : String {
        var messageContent =  new String()
        var FeatureClaimID = null
        
        var features = new HashSet<AssignmentExposureExt>()
        var matters = new HashSet<MatterAssignmentExt>()
        var legalActions = new HashSet<Matter>()
        var contacts = new HashSet<Contact>()
        var claimants = new HashSet<Contact>()
        var adjusters = new HashSet<Contact>()
        
        
      
        if(this.contactChanged(contact) && typeof contact == UserContact){
            //Handle matter assignments associated where contact is adjuster
            if(!this.getAdjusterAssociatedAssignments(contact).Empty){
              var tempMessageContent  =  new String()
                for(ma in this.getAdjusterAssociatedAssignments(contact)){
                    //adjusters.add(contact)
                    //messageContent = messageContent + AdjusterTemplate.renderToString(contact, "C")
                    for(aee in ma.AssignmentExposuresExt){
                      //features.add(aee)
                      //tempMessageContent  =  null
                      tempMessageContent = AdjusterTemplate.renderToString(contact, "C") +  LawFeatureTemplate.renderToString(aee, "E") + LawMatterTemplate.renderToString(ma, "E") 
                      tempMessageContent = TransactionBaseTemplate.renderToString(tempMessageContent + LawClaimantTemplate.renderToString(aee.ClaimantExt, "C") + ClaimIDTemplate.renderToString(aee.Exposure.Claim))
                      sendMessage(messageContext, tempMessageContent)
                    }
                    //matters.add(ma)
                }
            } 
        }else if(this.contactChanged(contact)){
        
            //Handle changed law firm, lead counsel, opposing law firm, and opposing lead counsel
              if(!this.getLegalContactAssociatedAssignments(contact).Empty){
                  contacts.add(contact)
                  for(ma in this.getLegalContactAssociatedAssignments(contact)){                    
                      matters.add(ma)
                  }
              }
            
              //Handle associated assignment exposures
              if(!this.getLegalContactAssociatedAssignmentExposures(contact).Empty){
                  for(ae in this.getLegalContactAssociatedAssignmentExposures(contact)){
                      contacts.add(contact)
                      claimants.add(ae.ClaimantExt)
                      features.add(ae)
                  }
              }
            
              //Handle associated matter mediators
              if(!this.getAssociatedMatterMediators(contact).Empty){
              
                  for(med in this.getAssociatedMatterMediators(contact)){
                      messageContent = messageContent + LawMediationTemplate.renderToString(med, contact, "C")
                      for(la in find(matmed in MatterMediatorExt where matmed.MediatorExt == contact).toList()){
                        legalActions.add(la.Matter)
                        FeatureClaimID=la.Matter.MatterAssignmentsExt.first()
                      }
                  }
                  
              }
      
            //Handle claimant related assignment exposure changes
            if(!this.getClaimantAssociatedAssignmentExposures(contact).Empty){
               for(ae in this.getClaimantAssociatedAssignmentExposures(contact)){
                     claimants.add(contact)
                     // messageContent = messageContent + LawClaimantTemplate.renderToString(contact, "C")
                      features.add(ae)
               }
            }
          
            //Handle claimant related matter assignment changes
            if(!this.getClaimantAssociatedAssignments(contact).Empty){
               for(ma in this.getClaimantAssociatedAssignments(contact)){
                      matters.add(ma)
               }
            }
        }
        
        if(claimants.HasElements){
          for(claimant in claimants)
            messageContent = messageContent + LawClaimantTemplate.renderToString(claimant, "C")
        }
        
        if(FeatureClaimID != null){
          messageContent = messageContent + LawClaimFeatureIDTemplate.renderToString(FeatureClaimID, "C")
        }
        
        
        if(contacts.HasElements)
          for(con in contacts){
            if(con typeis Company){
              messageContent = messageContent + LawFirmTemplate.renderToString(con, "C")                      
            }else if(con typeis Person){
              messageContent = messageContent + AttorneyTemplate.renderToString(con, "C")                
            }
          }
        
        if(features.HasElements)
          for(fea in features)
            messageContent = messageContent + LawFeatureTemplate.renderToString(fea, "E") 
            
        if(matters.HasElements){
          for(ma in matters){
              messageContent = messageContent + LawMatterTemplate.renderToString(ma, "E")
          }
        }
        
        if(legalActions.HasElements){
          for(la in legalActions){
              messageContent = messageContent + LegalActionTemplate.renderToString(la, "E")
          }
        }
        
         if(adjusters.HasElements){
          for(adjuster in adjusters){
              messageContent = messageContent + AdjusterTemplate.renderToString(adjuster, "C")
          }
        }       
        
        if(messageContent != null && messageContent != ""){ 
            
            messageContent = messageContent + ClaimIDTemplate.renderToString(ClaimForContact(Contact))      
            //add message into base template
            messageContent = TransactionBaseTemplate.renderToString(messageContent)
        }

        return(messageContent)
    }
  
  
    /**
    * Returns true if the contact has changed.
    * 
    * @param contact the contact to check for changes.
    * @return changed status of the contact.
    */
    protected function contactChanged(contact : Contact) : boolean {
        if(contact typeis Person && this.contactPersonFieldChanged(contact)){
            return true
        }else if(contact typeis Company  && this.contactCompanyFieldChanged(contact)){
            return true
        }else{
            return false
        }
    }


    /**
    * Checks to see if specific fields have changed on the person contact.
    * 
    * @param contact the person contact to check for changes.
    * @return changed status of the person contact.
    */
    private function contactPersonFieldChanged(contact : Contact) : boolean {
         var fields = new String[] {"FirstName", "LastName"};
         
        if(contact typeis Attorney){
          if(contact.isFieldChanged("PanelIndicatorExt") || contact.isFieldChanged("TaxID")){
            return true;
          }
        }      
        if (util.gaic.CommonFunctions.fieldFromListChanged(contact, fields)) {
            return true;
        }else{
            return false
        }      
    }

  
    /**
    * Checks to see if specific fields have changed on the company contact.
    * 
    * @param contact the company contact to check for changes.
    * @return changed status of the company contact.
    */
    private function contactCompanyFieldChanged(contact : Contact) : boolean {
        var fields = new String[] {"Name"};  
        if(contact typeis LawFirm){
          if(contact.isFieldChanged("PanelIndicatorExt") || contact.isFieldChanged("TaxID")){
            return true;
          }
        }
     
        if (util.gaic.CommonFunctions.fieldFromListChanged(contact, fields)) {
            return true;
        }else{
            return false
        }      
    }
    
  
    /**
    * Checks to see if a contact already exists on an assignment as the law firm, lead counsel,
    * opposing law firm, or opposing lead counsel.
    * 
    * @param assignment the assignment to check for existance of the contact.
    * @param contact the contact to look for on the assignment.
    * @return 
    */
    protected function contactExistsOnAssignment(assignment : MatterAssignmentExt, contact : Contact) : boolean {
    
        if(assignment.CounselLawFirmExt == contact || assignment.LeadCounselExt == contact){
            return true;
    
        //Check to see it contact exists on the assignment exposures of the assignment
        }else if(exists(ae in assignment.AssignmentExposuresExt where ae.OpposingCounselFirmExt == contact ||
            ae.OpposingLeadCounselExt == contact)){
          
            return true;  
        }else{
    
            return false
        }  
    }
  
  
    /**
    * Used to get the action code to send to LDM for the contact associated with a
    * MatterAssignmentExt entity  
    * 
    * @param contact the contact to get the action code for.
    * @param assignment the MatterAssignmentExt entity to check against.
    */ 
    protected function getActionCode(contact : Contact, assignment : MatterAssignmentExt) : String {
        var originalAssignment = assignment.OriginalVersion as MatterAssignmentExt
  
        if(this.contactChanged(contact) && this.contactExistsOnAssignment(assignment, contact) &&
           this.contactExistsOnAssignment(originalAssignment, contact)){
             return "C"
        }else if(this.contactExistsOnAssignment(assignment, contact) && !this.contactExistsOnAssignment(originalAssignment, contact) && contact !=null){
            return "A"
        }else{
            return null
        } 
    }
    
    protected function getAssociatedMatter(exp : Exposure) : ArrayList<MatterAssignmentExt> {
      var associatedMatters : List<MatterAssignmentExt> = new ArrayList<MatterAssignmentExt>()
      var associatedAssignmentExposure : List<AssignmentExposureExt> = new ArrayList<AssignmentExposureExt>()
      associatedAssignmentExposure = find(assExp in AssignmentExposureExt where assExp.Exposure == exp).toList()
      associatedMatters = associatedAssignmentExposure*.Assignment
      return(associatedMatters as ArrayList<MatterAssignmentExt>)
    }
    
    
    /**
    * Returns MatterMediatorExt entities associated with the contact if the contact is 
    * a mediator for the matter.
    * 
    * @param the contact.
    * @return the MatterMediatorExt entities where the contact is the mediator on the associated matters
    */
    protected function getAssociatedMatterMediators(contact : Contact) : ArrayList<MatterMediatorExt> {
        var associatedMediators : List<MatterMediatorExt> = new ArrayList<MatterMediatorExt>()
        associatedMediators = find(med in MatterMediatorExt where med.MediatorExt == contact).toList()

        return associatedMediators as ArrayList<MatterMediatorExt>
    }
  
  
    /**
    * Returns AssignmentExposureExt entities associated with the contact if the contact is 
    * an opposing law firm or opposing lead counsel.
    * 
    * @param the contact.
    * @return the AssignmentExposureExt entities where the contact is the opposing law firm or opposing lead counsel.
    */  
    protected function getLegalContactAssociatedAssignmentExposures(contact : Contact) : ArrayList<AssignmentExposureExt> {
        var associatedAssignmentExpos : List<AssignmentExposureExt> = new ArrayList<AssignmentExposureExt>()
        associatedAssignmentExpos = find(ae in AssignmentExposureExt where  ae.OpposingCounselFirmExt == contact ||
            ae.OpposingLeadCounselExt == contact).toList()

        return associatedAssignmentExpos as ArrayList<AssignmentExposureExt>
    }
    

    /**
    * Returns AssignmentExposureExt entities associated with the contact if the contact is 
    * a claimant associated with the exposure.
    * 
    * @param contact the contact.
    * @return the AssignmentExposureExt entities where the contact is the claimant.
    */   
    protected function getClaimantAssociatedAssignmentExposures(contact : Contact) : ArrayList<AssignmentExposureExt> {
        var associatedAssignmentExpos : List<AssignmentExposureExt> = new ArrayList<AssignmentExposureExt>()
        associatedAssignmentExpos = find(ae in AssignmentExposureExt where  ae.ClaimantExt == contact).toList()
    
        return associatedAssignmentExpos as ArrayList<AssignmentExposureExt>
    }

  
    /**
    * Returns MatterAssignmentExt entities associated with the contact if the contact is 
    * a claimant listed on the assignment.
    * 
    * @param contact the contact.
    * @return the MatterAssignmentExt entities where the contact is a claimant listed on the assignment.
    **/  
    protected function getClaimantAssociatedAssignments(contact : Contact) : ArrayList<MatterAssignmentExt>{
        var associatedAssignments : List<MatterAssignmentExt> = new ArrayList<MatterAssignmentExt>()
        associatedAssignments = this.getClaimantAssociatedAssignmentExposures(contact)*.Assignment as java.util.List<entity.MatterAssignmentExt>            
             
        //remove duplicates
        var hs = new HashSet<MatterAssignmentExt>() 
        hs.addAll(associatedAssignments)
        associatedAssignments.clear()
        associatedAssignments.addAll(hs)
         
        return associatedAssignments as ArrayList<MatterAssignmentExt>
    }
  
  
    /**
    * Returns MatterAssignmentExt entities associated with the contact if the contact is 
    * the adjuster for the claim associated with the matter assignment.
    * 
    * @param contact the contact.
    * @return the MatterAssignmentExt entities where the contact is the adjuster on the associated claim.
    **/
    protected function getAdjusterAssociatedAssignments(contact : Contact) : ArrayList<MatterAssignmentExt>{

        var associatedAssignments = new ArrayList<MatterAssignmentExt>()
        var associatedClaims = find(claim in Claim where claim.AssignmentStatus == AssignmentStatus.TC_ASSIGNED and
            exists(con in Claim.AssignedUser.Contact where con == contact))
 
        for(claim in associatedClaims){
            associatedAssignments.addAll(claim.Matters*.MatterAssignmentsExt as java.util.Collection<entity.MatterAssignmentExt>)
        }
  
        return associatedAssignments  
    }  
    
    
    /**
    * Returns MatterAssignmentExt entities associated with the contact if the contact is 
    * the law firm or lead counsel listed on the assignment.
    * 
    * @param contact the contact.
    * @return the MatterAssignmentExt entities where the contact is the law firm or lead counsel listed on the assignment.
    **/
    protected function getLegalContactAssociatedAssignments(contact : Contact) : ArrayList<MatterAssignmentExt>{
        var associatedAssignments : List<MatterAssignmentExt> = new ArrayList<MatterAssignmentExt>()
         
        associatedAssignments = find(ma in MatterAssignmentExt where ma.CounselLawFirmExt == contact || 
            ma.LeadCounselExt == contact).toList()                
             
        //remove duplicates
        var hs = new HashSet<MatterAssignmentExt>() 
        hs.addAll(associatedAssignments)
        associatedAssignments.clear()
        associatedAssignments.addAll(hs)
         
        return associatedAssignments as ArrayList<MatterAssignmentExt>
    }
    
    protected function ClaimForContact(contact : Contact) : Claim {
      var claimcontact = find(c in ClaimContact where c.Contact == contact).AtMostOneRow
      return(claimcontact.Claim)
    }
  
    /**
    * Sends the message to LDM
    * 
    * @param messageContext the context of the message.
    * @param messageContent the message.
    */
    private function sendMessage(messageContext : MessageContext, messageContent : String){
       util.gaic.CommonFunctions.sendTemplateMessage(messageContext, messageContent);   

    }


}//End LDMContactFunctions class
