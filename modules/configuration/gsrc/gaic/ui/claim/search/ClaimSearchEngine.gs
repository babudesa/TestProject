package gaic.ui.claim.search

uses java.lang.Integer
uses gaic.ui.claim.search.CustomClaimSearch


/**
* Class used to facilitate custom Claim searches from
* the ClaimCenter UI claim search screens
* 
* @author kniese
*/
class ClaimSearchEngine  {
    
    static final private var MAX_SEARCH_RESUTLS = 300
 
    private var _criteriaValidator : ClaimCriteriaValidator
    private var _claimSearch : CustomClaimSearch


    construct() {
       this._criteriaValidator = new ClaimCriteriaValidator()
       this._claimSearch = new CustomClaimSearch()
    }
   
   
    /**
    * Creates new ClaimSearchCriteria
    * 
    * @return new Claim search criteria
    */
    public function createNewSearchCriteria() : ClaimSearchCriteria{
    
        var criteria = new ClaimSearchCriteria()        
        return criteria
    }

    
    /**
    * Gets the max number of results this search engine should return
    * 
    * @return the max number of results this search engine should return
    */
    public property get MaxSearchResults() : Integer {
        return MAX_SEARCH_RESUTLS
    }
  
  
    /**
    * Performs the search for claims given ClaimSearchCriteria
    *
    * @return the claim search results 
    */  
    public function performSearch(criteria : ClaimSearchCriteria) : ClaimSearchViewQuery {
        
        this._criteriaValidator.performValidation(criteria)
        
        if(this._criteriaValidator.IsCriteriaValid){
            
            return this._claimSearch.buildQuery(criteria).select()            
        
        }else{  
          
            return null
        }
    }    
    

 }//End ClaimSearchEngine class