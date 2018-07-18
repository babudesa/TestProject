package gaic.ui.exposure.search

uses com.guidewire.pl.web.controller.UserDisplayableException;


/**
* Class handles all validation for the Exposure Search Engine
* 
* @author kepage
*/
class CriteriaValidator {
    
    private var _criteria : ExposureSearchCriteria
    private var _isCriteriaValid : boolean
    
    construct() {
        this._criteria = null
        this._isCriteriaValid = true
    }
    
    
    /**
    * Performs validation and triggers any user displayable errors 
    * if needed
    */
    public function performValidation(criteria : ExposureSearchCriteria){
        
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
    * Checks to see if the required serach criteria is entered for the search.
    * If all of the fields are null that are stored on the ExposureSearchRequiredInputSet.pcf
    * then the required search criteria is not populated.
    * 
    * @return whether of not the required search criteria is valid
    */
    private function isRequiredCriteriaPopulated() : boolean {
      
        if((this._criteria.NameSearchType == null || (this._criteria.NameCriteria.FirstName == null &&
           this._criteria.NameCriteria.LastName == null && this._criteria.NameCriteria.TaxId == null &&
           this._criteria.NameCriteria.CompanyName == null)) && this._criteria.ClaimNumber == null &&
           this._criteria.PolicyNumber == null && this._criteria.AssignedToGroup == null &&
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
        
        if(this._criteria.DateFieldToSearch != null && this._criteria.DateSearchType == DateSearchType.TC_ENTEREDRANGE){
          
             if(this._criteria.StartDate != null && this._criteria.EndDate  != null){               
                 return true
             }else{
                 this.throwMissingDateToFromCriteriaError()
                 return false
             }
                         
         }else if(this._criteria.DateFieldToSearch != null && this._criteria.DateSearchType == DateSearchType.TC_FROMLIST){
             
             if(this._criteria.DateRangeChoice != null){
                 return true
             }else{
                 this.throwMissingDateRangeCriteriaError()
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
    
        if(this._criteria.FinancialSearchField != null){
        
            if(this._criteria.AmountStart != null && this._criteria.AmountEnd  != null){
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
        throw new UserDisplayableException(displaykey.Exposure.Search.ErrorMessages.NotEnoughInfo)   
    }
    
    
    /**
    * Throws a user displayable error indicating that person and company criteria can't 
    * both be entered in the search 
    */
    private function throwPersonCompanyError(){
        throw new UserDisplayableException(displaykey.Exposure.Search.ErrorMessages.CompanyPerson) 
    }
    
    
    /**
    * Throws a user displayable error indicating that a range value needs to be selected
    * the "Date Criteria" section
    */
    private function throwMissingDateToFromCriteriaError(){
        throw new UserDisplayableException(displaykey.Exposure.Search.ErrorMessages.DateToFromCriteria) 
    }
    
    
    /**
    * Throws a user displayable error indicating that both to and from values need
    * to be entered in the "Date Criteria" section
    */
    private function throwMissingDateRangeCriteriaError(){
        throw new UserDisplayableException(displaykey.Exposure.Search.ErrorMessages.DateRangeCriteria) 
    }
    
    
    /**
    * Throws a user displayable error indicating that both to and from values need
    * to be entered in the "Financial Criteria" section
    */
    private function throwMissingFinancialCriteriaError(){
        throw new UserDisplayableException(displaykey.Exposure.Search.ErrorMessages.FinancialCriteria) 
    }    
    

}//End CriteriaValidator Class
