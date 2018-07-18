package libraries.MatterAssignmentExt_Entity

/*
*  The AttorneyRatingHelper class contains functions used to create
*  attorney rating reviews for the lead counsel
*/
class AttorneyRatingHelper {
  
  private var _assignment : MatterAssignmentExt
  private static var REVIEW_TYPE : String = "ARReviewType:1"
  
  construct(assignment : MatterAssignmentExt) {
    _assignment = assignment  
  }
  
 
  /*
  * Function is used to create the initial empty review for the lead counsel
  * on the assignment. 
  */
  public function createLeadCounselReview(){

     //If the the lead counsel doesn't have an existing review linked to the assignment then
     //create a new empty review and add it to the contacts review array
     if(!exists(rev in _assignment.LeadCounselExt.Reviews where rev.MatterAssignmentExt == _assignment)
         && _assignment.LeadCounselExt!= null){        
        
        //get review type
        var reviewType = find(rt in ReviewType where rt.PublicID == REVIEW_TYPE).AtMostOneRow    
        
        if(reviewType != null){
           //create review
           var review = gw.api.contact.ReviewUtil.createNewReview(reviewType,
                            _assignment.LeadCounselExt, _assignment.Matter.Claim)
            
            //associate review with assignment                      
            review.MatterAssignmentExt = _assignment 
                                
            //create the ReviewQAnswerSets for each category in the attorney rating review categories
            //typelist filter      
            for(rc in ReviewCategory.TF_ATTORNEYRATING.TypeKeys){
               
              var questionSet = find(qs in QuestionSet where qs.PublicID contains rc.Code).FirstResult
              
              //create ReviewQAnswerSet
              review.addToQuestionAnswerSets(createReviewQAnswerSet(review,questionSet,rc))
            }       
          }     
      }      
   }
   
   
  /*
  * Property stores the value indicating if comments are required for the review
  */ 
   property get AreCommentsRequired() : boolean {
           
      if(CurrentReview != null){
           
          var answer = CurrentReview.QuestionAnswerSets*.AnswerSet*.Answers
                   .where(\ a -> a.Question.PublicID == "ARINQuestion:1").first()
       
           if(answer.Score == 1 || answer.Score == 3){
               return true    
           }          
       }        
      return false
   }
   
  
  /*
  * Property stores the value indicating if comments are present for the assignment
  */    
   property get AreCommentsPresent() : boolean {     
     
     if(CurrentReview !=null){  
         if(CurrentReview.Comments == null){
          return false
         }
     }
     return true
   }
      
   
  /*
  * Property stores the value indicating if the review for the assignment is complete
  */   
   property get RatingsComplete() : boolean {
              
      if(CurrentReview != null){
               
         //this checks to ensure the Answers have been created already
         var populated = CurrentReview.QuestionAnswerSets*.AnswerSet*.Answers
                     .where(\ a -> a.Score != null)
         //this checks that the answers are all filled in              
         var answer = CurrentReview.QuestionAnswerSets*.AnswerSet*.Answers
                     .where(\ a -> a.Score == null)
         
         if(populated.IsEmpty){
            return false
         }
                  
         if((!answer.IsEmpty) or (!AreCommentsPresent and AreCommentsRequired)){
           return false
         }
      }       
    return true      
  }

   
  /*
  * Function creates and returns a ReviewQAnswerSet 
  */
  private function createReviewQAnswerSet(review : Review, questionSet : QuestionSet, 
                                          category : ReviewCategory): ReviewQAnswerSet{
                                                     
         var rqas = new ReviewQAnswerSet()
         rqas.Review = review
         rqas.ReviewCategory = category
         rqas.QuestionSet = questionSet
         rqas.AnswerSet = new AnswerSet()
         rqas.AnswerSet.QuestionSet = rqas.QuestionSet
         rqas.ElementOrder = rqas.QuestionSet.Priority
               
         return rqas
  }
  
  
  /*
  * Property returns the review for current assignment
  */
  private property get CurrentReview(): Review{
      
    if(exists(rev in _assignment.LeadCounselExt.Reviews where rev.MatterAssignmentExt == _assignment)
       && _assignment.LeadCounselExt!= null){
         return  _assignment.LeadCounselExt.Reviews.where(\ r -> r.MatterAssignmentExt == _assignment).first()
       }else{
           return null
       }
  }



}//end class
