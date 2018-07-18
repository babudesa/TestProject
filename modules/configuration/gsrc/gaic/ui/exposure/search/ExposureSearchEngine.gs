package gaic.ui.exposure.search

uses java.lang.Integer


/**
* Class used to facilitate custom exposure searches from
* the ClaimCenter UI Exposure search screens
* 
* @author kepage
*/
class ExposureSearchEngine  {
    
    static final private var MAX_SEARCH_RESUTLS = 300
 
    private var _criteriaValidator : CriteriaValidator
    private var _queryManager : QueryManager


    construct() {
       this._criteriaValidator = new CriteriaValidator()
       this._queryManager = new QueryManager()
    }
   
   
    /**
    * Creates new ExposureSearchCriteria
    * 
    * @return new Exposure search criteria
    */
    public function createNewSearchCriteria() : ExposureSearchCriteria{
    
        var criteria = new ExposureSearchCriteria()        
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
    * Performs the search for exposures given ExposureSearchCriteria
    *
    * @return the exposure search results 
    */  
    public function performSearch(criteria : ExposureSearchCriteria) : ExposureSearchViewQuery {
        
        this._criteriaValidator.performValidation(criteria)
        
        if(this._criteriaValidator.IsCriteriaValid){
          
            return this._queryManager.buildQuery(criteria).select()            
        
        }else{  
          
            return null
        }
    }    
    

 }//End ExposureSearchEngine class
