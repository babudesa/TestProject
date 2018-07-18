package util.gaic.LDM

uses templates.messaging.LDM.LawAttorneyRating.LawAttorneyRatingTemplate
uses templates.messaging.LDM.LawAttorneyRating.LawAttorneyRatingCommentsTemplate
uses templates.messaging.LDM.LawAttorneyRating.LawAttorneyRatingIntangiblesTemplate
uses templates.messaging.LDM.LawAttorneyRating.LawAttorneyActionDescriptionTemplate
uses templates.messaging.LDM.LawMatterTemplate
uses templates.messaging.LDM.commons.TransactionBaseTemplate
uses templates.messaging.LDM.LawFirmTemplate
uses templates.messaging.LDM.AttorneyTemplate
uses java.util.ArrayList
uses java.util.Date
uses java.util.GregorianCalendar

/**
* This class performs the functions to build and send attorney rating changes to LDM
* 
*  @since 2013-01-22
*/
class LDMAttorneyRatingFunctions {

    private construct() {

    }
    
  
    /**
    * Gets a new instance of the LDMAttorneyRatingFunctions class.
    * 
    * @return a new instance of LDMAttorneyRatingFunctions class.
    */
    static function getInstance() : LDMAttorneyRatingFunctions {
      return new LDMAttorneyRatingFunctions();
    }

    /**
    * Builds attorney rating changed messages and sends message to LDM
    * 
    * @param messageContext the context of the message.
    * @param matter the matter where the attorney rating changed.
    */
    function sendAttorneyRatingChanges(messageContext : MessageContext, matter : Matter) {
      var cutoffDate : Date = (new GregorianCalendar(2013,3,2)).getTime();
      if (matter.CreateTime.compareTo(cutoffDate) == -1) return;
        var message = this.buildAttorneyRatingChangedMessage(matter)
    
        if(message != null && message != ""){
          sendMessage(messageContext,buildAttorneyRatingChangedMessage(matter))
        } 
    }

    /**
    * Build CC outbound message to LDM for Attorney rating change event.
    * 
    * @param matter the matter where the attorney rating changed.
    * @return the completed attorney rating changed message.
    */
    protected function buildAttorneyRatingChangedMessage(matter : Matter) : String {
      var messageContent : String
      for(ma in matter.MatterAssignmentsExt){
        if(attorneyRatingChanged(ma)){
          if(attorneyRatingNew(ma)){
            messageContent = buildAttorneyRatingMessage(ma,"A")
          } else {
            messageContent = buildAttorneyRatingMessage(ma,"C")
          }
          messageContent = messageContent + LawMatterTemplate.renderToString(ma, "E")
          if(ma.LeadCounselExt typeis Company){
            messageContent = messageContent + LawFirmTemplate.renderToString(ma.LeadCounselExt, "E")
          }else if(ma.LeadCounselExt typeis Person){          
            messageContent = messageContent + AttorneyTemplate.renderToString(ma.LeadCounselExt, "E")
          }
        }
      }
      if(messageContent != null){
          messageContent  = TransactionBaseTemplate.renderToString(messageContent)
      }
      return messageContent
    }
    
    /**
    * Returns a string of the current Attorney Rating values to be exported
    * 
    * @param ma the MatterAssignmentExt that has the lead attorney that will have values exported.
    * @param ActionDesc, the action description of the values exported, "A" for add, "C" for changed or updated.
    * 
    * @return string of the current Attorney Rating values to be exported
    */  
    public function buildAttorneyRatingMessage(ma : MatterAssignmentExt, ActionDesc : String) : String {
      var messageContent : String
      
      messageContent = LawAttorneyActionDescriptionTemplate.renderToString(ActionDesc, ma)
      var currentReview = ma.LeadCounselExt.Reviews.where(\ x -> x.MatterAssignmentExt == ma) 
      var answerb = currentReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID=="AREEQuestion:1")
      messageContent = messageContent + LawAttorneyRatingTemplate.renderToString(answerb.first().Score, ma,  "AttorneyRating-ExpertiseExperience")
          
      answerb = currentReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID=="ARAEQuestion:1") 
      messageContent = messageContent + LawAttorneyRatingTemplate.renderToString(answerb.first().Score, ma, "AttorneyRating-AnalysisEvaluation")
          
      answerb = currentReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID=="ARSFQuestion:1") 
      messageContent = messageContent + LawAttorneyRatingTemplate.renderToString(answerb.first().Score, ma, "AttorneyRating-StrategyForesight")
   
      answerb = currentReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID=="ARCCQuestion:1") 
      messageContent = messageContent + LawAttorneyRatingTemplate.renderToString(answerb.first().Score, ma, "AttorneyRating-CollaborationCommunication")
       
      answerb = currentReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID=="ARTRMQuestion:1") 
      messageContent = messageContent + LawAttorneyRatingTemplate.renderToString(answerb.first().Score, ma, "AttorneyRating-TimeManagementCostEffectiveness")
        
      answerb = currentReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID=="ARTEQuestion:1") 
      messageContent = messageContent + LawAttorneyRatingTemplate.renderToString(answerb.first().Score, ma, "AttorneyRating-TempoExecution")
    
      answerb = currentReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID=="ARADQuestion:1") 
      messageContent = messageContent + LawAttorneyRatingTemplate.renderToString(answerb.first().Score, ma, "AttorneyRating-Advocacy")
      
      answerb = currentReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID=="ARTPQuestion:1") 
      messageContent = messageContent + LawAttorneyRatingTemplate.renderToString(answerb.first().Score, ma, "AttorneyRating-TrialPerformance")
          
      answerb = currentReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID=="ARREQuestion:1") 
      messageContent = messageContent + LawAttorneyRatingTemplate.renderToString(answerb.first().Score, ma, "AttorneyRating-ResultEffectiveness")
          
      answerb = currentReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID=="ARINQuestion:1")
      messageContent = messageContent + LawAttorneyRatingIntangiblesTemplate.renderToString(answerb.first().Score, ma, "AttorneyRating-Intangibles")
      
      messageContent = messageContent + LawAttorneyRatingCommentsTemplate.renderToString(currentReview.first().Comments, ma)

      return(messageContent)
    }
    
    /**
    * Returns a boolean value indicating if the attorney rating is new
    * 
    * @param ma the MatterAssignmentExt to check.
    * @return the boolean value true if the attorney rating is new.
    */  
  public function attorneyRatingNew(ma : MatterAssignmentExt) : boolean
  {
    if(ma.LeadCounselExt == null)
      return(false)
    var originalMatter = ma.Matter.OriginalVersion as Matter
    var origAssignment =  originalMatter.MatterAssignmentsExt.where(\ x -> x.ID == ma.ID)
    if((origAssignment.first().LeadCounselExt != null) && exists(rev in origAssignment.first().LeadCounselExt.Reviews where rev.MatterAssignmentExt == ma)) {
      var originalReview = origAssignment.first().LeadCounselExt.Reviews.where(\ x -> x.MatterAssignmentExt == origAssignment.first())
      var ratingName = new ArrayList<String>(){"AREEQuestion:1", "ARAEQuestion:1" ,"ARSFQuestion:1" ,"ARCCQuestion:1" ,"ARTRMQuestion:1" ,"ARTEQuestion:1" ,"ARADQuestion:1" ,"ARTPQuestion:1" ,"ARREQuestion:1" ,"ARINQuestion:1"}
      for(y in ratingName){
        if(originalReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID==y).first().Score !=null)
          return false
      }
      return(true)
    } else {
      return(true)
    }
  }
  
    /**
    * Returns a boolean value indicating if the attorney rating has changed
    * 
    * @param ma the MatterAssignmentExt to check.
    * @return the boolean value true if the attorney rating changed.
    */
  private function attorneyRatingChanged(ma : MatterAssignmentExt) : boolean
  {
     var originalMatter = ma.Matter.OriginalVersion as Matter
     var origAssignment =  originalMatter.MatterAssignmentsExt.where(\ x -> x.ID == ma.ID)
    
     if(ma.LeadCounselExt != null && exists(rev in ma.LeadCounselExt.Reviews where rev.MatterAssignmentExt == ma)) {
       if(origAssignment != null && origAssignment.first().LeadCounselExt != null && exists(rev in origAssignment.first().LeadCounselExt.Reviews where rev.MatterAssignmentExt == origAssignment.first())) {
         var currentReview = ma.LeadCounselExt.Reviews.where(\ x -> x.MatterAssignmentExt == ma)
         var originalReview = origAssignment.first().LeadCounselExt.Reviews.where(\ x -> x.MatterAssignmentExt == origAssignment.first())
         var ratingName = new ArrayList<String>(){"AREEQuestion:1", "ARAEQuestion:1" ,"ARSFQuestion:1" ,"ARCCQuestion:1" ,"ARTRMQuestion:1" ,"ARTEQuestion:1" ,"ARADQuestion:1" ,"ARTPQuestion:1" ,"ARREQuestion:1" ,"ARINQuestion:1"}
         for(y in ratingName){
           if((currentReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID==y).first().Score != originalReview*.QuestionAnswerSets*.AnswerSet*.Answers.where(\ x -> x.Question.PublicID==y).first().Score))
             return(true)
         }
         if(currentReview.first().Comments != originalReview.first().Comments)
           return(true)         
       }
     }
    return(false) 
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

}//End LDMAttorneyRatingFunctions class