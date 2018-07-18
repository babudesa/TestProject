package gaic.ui.claim.search

uses com.guidewire.pl.web.controller.UserDisplayableException;


/**
* Class handles all validation for the Claim Search Engine
* 
* @author kniese
*/
class ClaimCriteriaValidator {
    
    private var _criteria : ClaimSearchCriteria
    private var _isCriteriaValid : boolean
    
    construct() {
        this._criteria = null
        this._isCriteriaValid = true
    }
    
    
    /**
    * Performs validation and triggers any user displayable errors 
    * if needed
    */
    public function performValidation(criteria : ClaimSearchCriteria){
        
        this._criteria = criteria
        
        if(!this.isRequiredCriteriaPopulated()){            
            
            this._isCriteriaValid = false
            this.throwRequiredFieldsError()
                        
        }else if(this.isPersonAndCompanyDataPopulated()){
            
            this._isCriteriaValid = false
            this.throwPersonCompanyError()        
        
        }else if(!this.isDateCriteriaValid()){
            
            this._isCriteriaValid = false
            
        }else if(!this.isFinancialCriteriaValid()){
            
            this._isCriteriaValid = false
            this.throwMissingFinancialCriteriaError()
        
        }else{
            this._isCriteriaValid = true
        }
    }
    
    
    public property get IsCriteriaValid() : boolean {
        return this._isCriteriaValid
    }
    
    
    /**
    * Checks to see if both Person and Company data is entered in the name search criteria
    * 
    * @return indicaiton as to whether both Person and Company data have been entered
    */
    private function isPersonAndCompanyDataPopulated() : boolean {
        
        if((this._criteria.NameCriteria.FirstName != null || this._criteria.NameCriteria.LastName != null) &&
            this._criteria.NameCriteria.CompanyName != null){
            
            return true
            
         }else{
           return false
         }    
    }
    
    
    /**
    * Checks to see if the required search criteria is entered for the search.
    * If all of the fields are null that are stored on the ClaimSearchRequiredInputSet.pcf
    * then the required search criteria is not populated.
    * 
    * @return whether of not the required search criteria is valid
    */
    private function isRequiredCriteriaPopulated() : boolean {
      
        if((this._criteria.NameSearchTypeExt == null || (this._criteria.NameCriteria.FirstName == null &&
           this._criteria.NameCriteria.LastName == null && this._criteria.NameCriteria.TaxId == null &&
           this._criteria.NameCriteria.CompanyName == null)) && this._criteria.ClaimNumber == null &&
           this._criteria.PolicyNumber == null && this._criteria.AssignedToGroup.AssignedToGroup == null &&
           this._criteria.AssignedToUser == null && this._criteria.CreatedByUser == null &&
           this._criteria.Catastrophe == null && this._criteria.vinNumber == null){
             
            return false   
           
        }else{
            return true
        }
    } 
    
    
    /**
    * Checks to see if the To and From values are populated in the Date Criteria section
    * 
    * @return indicaiton as to whether To and From values are populated in the Date Criteria section
    */
    private function isDateCriteriaValid() : boolean {
        
        if(this._criteria.DateCriterionChoice.ChosenOption != null && this._criteria.DateCriterionChoice.DateSearchType == DateSearchType.TC_ENTEREDRANGE){
          
             if(this._criteria.DateCriterionChoice.StartDate != null && this._criteria.DateCriterionChoice.EndDate  != null){               
                 return true
             }else{
                 this.throwMissingDateToFromCriteriaError()
                 return false
             }

             
         }else{
             return true  
         }
    }
    
    
    /**
    * Checks to see if the To and From values are populated in the Financial Search Criteria section
    * 
    * @return indicaiton as to whether To and From values are populated in the Financial Criteria section
    */
    private function isFinancialCriteriaValid() : boolean {
    
        if(this._criteria.FinancialCriterion.ChosenOption != null){
        
            if(this._criteria.FinancialCriterion.AmountStart != null && this._criteria.FinancialCriterion.AmountEnd  != null){
                return true
            }else{
                return false
            }
            
        }else{
            return true
        }
    }
  
      
    /**
    * Throws a user displayable error indicating that not enough information was entered
    * in order to perform the search
    */
    private function throwRequiredFieldsError(){
        throw new UserDisplayableException(displaykey.Claim.Search.ErrorMessages.InsufficientInfo)   
    }
    
    
    /**
    * Throws a user displayable error indicating that person and company criteria can't 
    * both be entered in the search 
    */
    private function throwPersonCompanyError(){
        throw new UserDisplayableException(displaykey.Claim.Search.ErrorMessages.CompanyPerson) 
    }
    
    
    /**
    * Throws a user displayable error indicating that a range value needs to be selected
    * the "Date Criteria" section
    */
    private function throwMissingDateToFromCriteriaError(){
        throw new UserDisplayableException(displaykey.Claim.Search.ErrorMessages.DateToFromCriteria) 
    }
    
    
    /**
    * Throws a user displayable error indicating that both to and from values need
    * to be entered in the "Date Criteria" section
    */
    private function throwMissingDateRangeCriteriaError(){
        throw new UserDisplayableException(displaykey.Claim.Search.ErrorMessages.DateRangeCriteria) 
    }
    
    
    /**
    * Throws a user displayable error indicating that both to and from values need
    * to be entered in the "Financial Criteria" section
    */
    private function throwMissingFinancialCriteriaError(){
        throw new UserDisplayableException(displaykey.Claim.Search.ErrorMessages.FinancialCriteria) 
    }    
    

}//End CriteriaValidator Class
