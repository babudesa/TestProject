package util.gaic.LDM

uses templates.messaging.LDM.commons.TransactionBaseTemplate
uses templates.messaging.LDM.LegalActionTemplate
uses templates.messaging.LDM.LawMatterTemplate
uses templates.messaging.LDM.LawMediationTemplate
uses templates.messaging.LDM.LawClaimTemplate
uses templates.messaging.LDM.LawPolicyTemplate
uses templates.messaging.LDM.LawFeatureTemplate
uses templates.messaging.LDM.LawClaimantTemplate
uses templates.messaging.LDM.JudgeTemplate
uses templates.messaging.LDM.AdjusterTemplate
uses templates.messaging.LDM.LawFirmTemplate
uses templates.messaging.LDM.AttorneyTemplate
uses templates.messaging.LDM.LawClaimFeatureIDTemplate
uses java.util.ArrayList
uses java.util.HashSet
uses templates.messaging.LDM.CorpLegalRepTemplate
uses java.util.Date
uses java.util.GregorianCalendar
uses util.gaic.LitAdvisorFunctions

/**
* This class performs the functions to build and send matter changes to LDM. 
* 
* @author kepage
* @since 2013-01-22
*/
class LDMMatterFunctions {
  
    private var assignmentF = LDMFunctionsFactory.getMatterAssignmentFunctions()
    private var assignmentExpoF = LDMFunctionsFactory.getAssignmentExposureFunctions()
    private var mediatorF = LDMFunctionsFactory.getMatterMediatorFunctions()
    private var contactF = LDMFunctionsFactory.getContactFunctions()
    //private var claimantList = new HashSet<Contact>()
  
    private construct() {

    }
    
    /**
    * Gets a new instance of the LDMMatterFunctions class.
    * 
    * @return a new instance of LDMMatterFunctions class.
    */
    static function getInstance() : LDMMatterFunctions {
        return new LDMMatterFunctions();
    }

    /**
    * Builds matter added and  changed messages and sends message to LDM
    * 
    * @param messageContext the context of the message.
    * @param contact the matter added or changed.
    */
    function sendMatterChanges(messageContext : MessageContext, matter : Matter) {
      var cutoffDate : Date = (new GregorianCalendar(2013,3,2)).getTime();
      if (matter.CreateTime.compareTo(cutoffDate) >= 0){
        if(messageContext.EventName == "MatterAdded"){ 
            var message = buildMatterAddedMessage(matter)           
            sendMessage(messageContext, message)
           
        }else if(messageContext.EventName == "MatterChanged"){         
            var message = buildMatterChangedMessage(matter)         
      
            if(message != null && message != ""){
                sendMessage(messageContext, message)
            }
        }
      }
    }
    
    /**
    * Build CC outbound message to LDM for Matter Added Event
    * 
    * @param matter the matter that was added.
    * @return the completed matter added message.
    */
    protected function buildMatterAddedMessage(matter : Matter) : String {
        var contacts = new HashSet<Contact>()
        var adjusters = new HashSet<Contact>()
        
        //add matter
        var messageContent = LegalActionTemplate.renderToString(matter, "A")

        //add judge
        if(matter.JudgeFirstNameExt != null || matter.JudgeLastNameExt != null){
            messageContent = messageContent + JudgeTemplate.renderToString(matter, "A")
        }
    
        //add corporate legal rep
        if(matter.CorporateLegalRepresentative != null){        
            messageContent = messageContent + CorpLegalRepTemplate.renderToString(matter, "A")
        }

        //add any matterAssignments
       for(ma in matter.MatterAssignmentsExt){
            messageContent = messageContent + LawMatterTemplate.renderToString(ma, "A")
  
            contacts.add(ma.CounselLawFirmExt)
            
            if(!contacts.contains(ma.LeadCounselExt) && ma.LeadCounselExt != ma.CounselLawFirmExt){
                contacts.add(ma.LeadCounselExt)
            }
            //add claim
            messageContent = messageContent + LawClaimTemplate.renderToString(ma, "A") 
            //add adjuster
            //add policy
            messageContent = messageContent + LawPolicyTemplate.renderToString(ma, "A")      
        }

        //add features, claimants, opposing counsel & opposing lead attorney
        var claimantList = new HashSet<Contact>()
        
        for(ae in matter.MatterAssignmentsExt*.AssignmentExposuresExt){
            messageContent = messageContent + LawFeatureTemplate.renderToString(ae, "A")
            
            if (!claimantList.contains(ae.ClaimantExt)){
              claimantList.add(ae.ClaimantExt)
              messageContent = messageContent + LawClaimantTemplate.renderToString(ae.ClaimantExt, "A")  
            }
            if(!adjusters.contains(ae.Exposure.AssignedUser.Contact)){
              adjusters.add(ae.Exposure.AssignedUser.Contact)
              messageContent += AdjusterTemplate.renderToString(ae.Exposure.AssignedUser.Contact, "A")
            }
            contacts.add(ae.OpposingCounselFirmExt)
            contacts.add(ae.OpposingLeadCounselExt)
        }
        
        if (contacts.size() > 0){
          for (cont in contacts){
            if (cont == null) continue
            if (cont typeis Company){
              messageContent = messageContent + LawFirmTemplate.renderToString(cont, "A")
            } else if (cont typeis Person){
              messageContent = messageContent + AttorneyTemplate.renderToString(cont, "A")
            }
          }
        }
   
        //add mediators
        for(mediator in matter.MediatorsExt){
            messageContent = messageContent + LawMediationTemplate.renderToString(mediator, mediator.MediatorExt, "A")
        }      

        //add message into base template
        messageContent  = TransactionBaseTemplate.renderToString(messageContent)
        return(messageContent)   
      }
 
    /**
    * Build CC outbound message to LDM for Matter Added Event
    * 
    * @param matter the matter that was added.
    * @return the completed matter added message.
    */
    protected function buildMatterChangedMessage(matter : Matter) : String {
      var contacts = new HashSet<Contact>()
      var adjusters = new HashSet<Contact>()
      var FeatureClaimID = null
      
        var originalMatter = matter.OriginalVersion as Matter
        var messageContent = new String()
     
        //check for matter changed & add to message if changed
        if(matterFieldChanged(matter)){
            messageContent = LegalActionTemplate.renderToString(matter, "C")
            FeatureClaimID=matter.MatterAssignmentsExt.first()

            //check for judge changes
            if(matter.ChangedFields.contains("JudgeFirstNameExt") || matter.ChangedFields.contains("JudgeLastNameExt")){

                //if original matter has judge and changed matter does not, then perform delete
                if((originalMatter.JudgeFirstNameExt != null || originalMatter.JudgeLastNameExt != null) &&
                    (matter.JudgeFirstNameExt == null && matter.JudgeLastNameExt == null)){

                    messageContent = messageContent + JudgeTemplate.renderToString(originalMatter, "D")  

                 //if the judge was previously empty then add one
                }else if(originalMatter.JudgeFirstNameExt == null && originalMatter.JudgeLastNameExt == null){
                    messageContent = messageContent + JudgeTemplate.renderToString(matter, "A")

                }else{
                    messageContent = messageContent + JudgeTemplate.renderToString(matter, "A")
                    messageContent = messageContent + JudgeTemplate.renderToString(originalMatter, "D")
                }
            }
            
            //check for corporate legal rep changes
            if(matter.ChangedFields.contains("CorporateLegalRepresentative")){        
                
                //if original matter has corp legal rep and changed matter does not, then perform delete
                if(originalMatter.CorporateLegalRepresentative != null && matter.CorporateLegalRepresentative == null){
                    messageContent = messageContent + CorpLegalRepTemplate.renderToString(originalMatter, "D")  

                 //if the corp legal rep was previously empty then add one
                }else if(originalMatter.CorporateLegalRepresentative == null){
                     messageContent = messageContent + CorpLegalRepTemplate.renderToString(matter, "A") 

                }else{
                    messageContent = messageContent + CorpLegalRepTemplate.renderToString(matter, "A")
                    messageContent = messageContent + CorpLegalRepTemplate.renderToString(originalMatter, "D")
                }                
            }      
        }

        //Add new Assignments 
        if(!this.getNewAssignments(matter).Empty){
           for(ma in this.getNewAssignments(matter)){
          
              messageContent = messageContent + LawMatterTemplate.renderToString(ma, "A")
              //add claim
              messageContent = messageContent + LawClaimTemplate.renderToString(ma, "A") 
              //add policy
              messageContent = messageContent + LawPolicyTemplate.renderToString(ma, "A")  
           }
        }
    
        //Changed Assignments
        if(!this.getChangedAssignments(matter).Empty){
           for(ma in this.getChangedAssignments(matter)){
               messageContent = messageContent + LawMatterTemplate.renderToString(ma, "C")
               FeatureClaimID=ma
           }
        }
  
       //check for matterAssignmentChanges
       for(ma in matter.MatterAssignmentsExt) {
      
           if(assignmentF.assignmentChanged(ma)){
                    
               var lawFirmActionCode = contactF.getActionCode(ma.CounselLawFirmExt, ma)
               var leadAttorneyActionCode = contactF.getActionCode(ma.LeadCounselExt, ma)
              
               //if firm is a company
               if(lawFirmActionCode != null){
                 contacts.add(ma.CounselLawFirmExt)
               }
               if(leadAttorneyActionCode != null) {
                 contacts.add(ma.LeadCounselExt)
               }
               if(ma.isFieldChanged("LSSMatterID")){
                 messageContent = messageContent + buildLSSMatterIDchanged(ma)
               }
           }
           
           //Added Features
           if(!assignmentExpoF.getNewFeatures(ma).Empty){
               for(exp in assignmentExpoF.getNewFeatures(ma)){
                   messageContent = messageContent + LawFeatureTemplate.renderToString(exp, "A") 
                   adjusters.add(exp.Exposure.AssignedUser.Contact)
               }
           }
       
           //Deteled Features
           if(!assignmentExpoF.getDeletedFeatures(ma).Empty){
               for(exp in assignmentExpoF.getDeletedFeatures(ma)){
                   messageContent = messageContent + LawFeatureTemplate.renderToString(exp, "D") 
               }
           }
           
           //Changed Features
           if(!assignmentExpoF.getChangedFeatures(ma).Empty){
               for(exp in assignmentExpoF.getChangedFeatures(ma)){
                 messageContent += LawFeatureTemplate.renderToString(exp, "C")
               }
           }
       
           //Handle Opposing Counsel
           for(ae in ma.AssignmentExposuresExt){
               var oppLawFirmActionCode = contactF.getActionCode(ae.OpposingCounselFirmExt, ma)
               var oppLeadAttorneyActionCode = contactF.getActionCode(ae.OpposingLeadCounselExt, ma)
                    
               if(oppLawFirmActionCode != null){
                   contacts.add(ae.OpposingCounselFirmExt)
               }
               if(oppLeadAttorneyActionCode != null){
                 contacts.add(ae.OpposingLeadCounselExt)
               }
           }
         
       }//End MatterAssignments
       
       //Add Claimants
       messageContent += generateAllClaimantXML(matter)
       
       //Added Mediators
       if(!mediatorF.getNewMediators(matter).Empty){
           for(mediator in mediatorF.getNewMediators(matter)){
               messageContent = messageContent + LawMediationTemplate.renderToString(mediator, mediator.MediatorExt, "A") 
           }
       }
   
       //Deleted Mediators
       if(!mediatorF.getDeletedMediators(matter).Empty){
           for(mediator in mediatorF.getDeletedMediators(matter)){
               messageContent = messageContent + LawMediationTemplate.renderToString(mediator, mediator.MediatorExt, "D") 
           }
       }
   
       //Changed Mediators
       if(!mediatorF.getChangedMediators(matter).Empty){
           for(mediator in mediatorF.getChangedMediators(matter)){           
               messageContent = messageContent + LawMediationTemplate.renderToString(mediator, mediator.MediatorExt, "C") 
           }
       }
       
       if(FeatureClaimID != null){
         messageContent = messageContent + LawClaimFeatureIDTemplate.renderToString(FeatureClaimID, "C")
       }
       
       if(!adjusters.Empty){
         for(aj in adjusters){
           messageContent += AdjusterTemplate.renderToString(aj, "A")
         }
       }
       
       if (contacts.size() > 0){
          for (cont in contacts){
            if (cont == null) continue
            if (cont typeis Company){
              messageContent = messageContent + LawFirmTemplate.renderToString(cont, "A")
            } else if (cont typeis Person){
              messageContent = messageContent + AttorneyTemplate.renderToString(cont, "A")
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
    * Checks for all the Claimants that need to be output on any given MatterAssignmentExt.
    * 
    * @param ma the MatterAssignmentExt entity to check for changes.  Note this can overlap with the claimants on other MatterAssignmentExt on the same matter
    * @return String the output containing all the Claimant information.
    */
    private function generateAllClaimantXML(ma : MatterAssignmentExt) : String {

      var retVal : String = ""
      var claimantList = new HashSet<Contact>()
      
      for(ca in assignmentExpoF.getChangedFeatures(ma)){
        if (!claimantList.contains(ca.ClaimantExt)){
          claimantList.add(ca.ClaimantExt)
          retVal = retVal + LawClaimantTemplate.renderToString(ca.ClaimantExt, "E")
        }
      }
       for(da in assignmentExpoF.getDeletedFeatures(ma)){
        if (!claimantList.contains(da.ClaimantExt)){
          claimantList.add(da.ClaimantExt)
          retVal = retVal + LawClaimantTemplate.renderToString(da.ClaimantExt, "E")
        }
       }
      for(aa in assignmentExpoF.getNewFeatures(ma)){
        if (!claimantList.contains(aa.ClaimantExt)){
          claimantList.add(aa.ClaimantExt)
          retVal = retVal + LawClaimantTemplate.renderToString(aa.ClaimantExt, "A")
        }
      }
      return retVal;
    }
    
    /**
    * Checks for all the Claimants that need to be output on any given matter.
    * 
    * @param matter the Matter entity to check for changes.
    * @return String the output containing all the Claimant information.
    */
      private function generateAllClaimantXML(matter : Matter) : String {

      var retVal : String = ""
      var claimantList = new HashSet<Contact>()
      
      for(ca in assignmentExpoF.getChangedFeatures(matter)){
        if (!claimantList.contains(ca.ClaimantExt)){
          claimantList.add(ca.ClaimantExt)
          retVal = retVal + LawClaimantTemplate.renderToString(ca.ClaimantExt, "E")
        }
      }
       for(da in assignmentExpoF.getDeletedFeatures(matter)){
        if (!claimantList.contains(da.ClaimantExt)){
          claimantList.add(da.ClaimantExt)
          retVal = retVal + LawClaimantTemplate.renderToString(da.ClaimantExt, "E")
        }
       }
      for(aa in assignmentExpoF.getNewFeatures(matter)){
        if (!claimantList.contains(aa.ClaimantExt)){
          claimantList.add(aa.ClaimantExt)
          retVal = retVal + LawClaimantTemplate.renderToString(aa.ClaimantExt, "A")
        }
      }
      return retVal;
    }
        
    /**
    * Checks to see if specific fields have changed on the Matter entitiy.
    * 
    * @param matter the Matter entity to check for changes.
    * @return changed status of the Matter entity.
    */
    protected function matterFieldChanged(matter : Matter) : boolean {
        var fields = new String[] { "MatterType", "CaseTypeExt", "Name","StatusExt", "CountryExt", "StateExt",
         "CourtCounty", "CourtType", "FederalDistrictExt", "CourtExt", "JudgeFirstNameExt", "JudgeLastNameExt",
         "CaseCaption", "CoverageOrExtraContractSuitExt", "ClassActionExt", "DerivativeExt",
         "CreateTime", "SuitFiledDate", "ServiceDate", "AnswerDueDate", "AnswerFiledDate",
         "ArbitrationDate", "DiscoveryCloseDate", "TrialDate", "ExpertCloseDate", "MotionCloseDate",
         "GAICompanyRoleExt", "ExtraContractualAllegationExt", "OnlyECAllegationExt", "ReportedToCorpLegalExt",
         "KeyCoverageIssues", "IssuesSummary", "DidMediationOccurExt", "CorporateLegalRepresentative", "HearingDate",
          "AppealFilingDateExt", "AppealRespDueDateExt", "FinalHearingDateExt"};
     
        if (util.gaic.CommonFunctions.fieldFromListChanged(matter, fields)) {
            return true;
        }else{
            return false
        }
    }

  
    /**
    * Finds any added MatterAssignmentExt entities on a specific Matter entity
    * 
    * @param matter Matter entity to check for added MatterAssignmentExt entities.
    * @return the added MatterAssignmentExt entities.
    */
    protected function getNewAssignments(matter : Matter) : ArrayList<MatterAssignmentExt>{
         var originalMatter = matter.OriginalVersion as Matter
         var newAssignments = new ArrayList<MatterAssignmentExt>()
     
         for(assignment in matter.MatterAssignmentsExt){    
             if(!exists(ma in originalMatter.MatterAssignmentsExt where ma.ID == assignment.ID)){                 
                 newAssignments.add(assignment)
             }
         }        
         return newAssignments 
    }
    
    /**
    * Returns output from templates containing LSSMatteID except for LawMatterTemplate since that will be naturally triggered.
    * 
    * @param assignment MatterAssignmentExt entity to build return String of template messages to be output.
    * @return String of output from templates containing LSSMatterID.
    */  
    protected function buildLSSMatterIDchanged(assignment: MatterAssignmentExt) : String {
      var messageContent : String
      messageContent = LawClaimTemplate.renderToString(assignment, "C")
      messageContent = messageContent + LawPolicyTemplate.renderToString(assignment, "C")
      return(messageContent)
    }
    
      
    /**
    * Finds any changed MatterAssignmentExt entities on a specific Matter entity
    * 
    * @param matter Matter entity to check for changed MatterAssignmentExt entities.
    * @return the added MatterAssignmentExt entities.
    */
    protected function getChangedAssignments(matter : Matter) : ArrayList<MatterAssignmentExt>{ 
         var changedAssignments = new ArrayList<MatterAssignmentExt>()
 
         for(assignment in matter.MatterAssignmentsExt){       
             if(!assignment.New && assignmentF.assignmentChanged(assignment)){                 
                 changedAssignments.add(assignment)
             }
         }        
         return changedAssignments  
    }
  

    /**
    * Sends the message to LDM
    * 
    * @param messageContext
    * @param messageContent
    */
    protected function sendMessage(messageContext : MessageContext, messageContent : String){
       util.gaic.CommonFunctions.sendTemplateMessage(messageContext, messageContent);   
    }


  }//End LDMMattersFunctions