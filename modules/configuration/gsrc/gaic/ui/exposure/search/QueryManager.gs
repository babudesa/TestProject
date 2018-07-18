package gaic.ui.exposure.search
uses gw.api.database.Query
uses java.util.HashMap
uses java.util.Date
uses gw.api.financials.CurrencyAmount

uses java.util.HashSet
uses util.user.GroupsHelper
uses gw.api.database.Relop



/**
* Class handles the creation of the ExposureSearchView query for the
* Exposure Search Engine
* 
* @author kepage
*/
class QueryManager {
    
    static final private var ID = "ID"
    //Claim table related
    static final private var CLAIM_TABLE = "Claim"
    static final private var CLAIM_NUMBER_COLUMN = "ClaimNumber"
    static final private var LOSS_TYPE_COLUMN = "LossType"
    static final private var ASSIGNED_GROUP_COLUMN = "AssignedGroup"
    //Incident table related
    static final private var INCIDENT_TABLE = "Incident"
    static final private var SEVERITY_COLUMN = "Severity"
    //Policy table related
    static final private var POLICY_TABLE = "Policy"
    static final private var POLICY_NUMBER_COLUMN = "PolicyNumber"
    //Exposure table related
    static final private var EXPOSURE_TABLE = "Exposure"
    static final private var ASSIGNED_USER_COLUMN = "AssignedUser"
    static final private var CREATE_USER_COLUMN = "CreateUser"
    static final private var CLOSE_DATE_COLUMN = "CloseDate"
    static final private var CREATE_TIME_COLUMN = "CreateTime"
    static final private var JURISDICTION_STATE_COLUMN = "JurisdictionState"
    static final private var EXPOSURE_STATE_COLUMN = "State"
    static final private var ASSIGNMENT_STATUS_COLUMN = "AssignmentStatus"
    static final private var EXPOSURE_TYPE_COLUMN = "ExposureType"
    static final private var ASSIGNMENT_DATE_COLUMN = "AssignmentDate"
    
    //ExposureRpt table related 
    static final private var EXPOSURERPT_TABLE = "ExposureRpt"
    static final private var OPEN_RESERVES_COLUMN = "OpenReserves"
    static final private var REMAINING_RESERVES_COLUMN = "RemainingReserves"
    static final private var TOTAL_PAID_COLUMN = "TotalPayments"
    static final private var FUTURE_PAYMENTS_COLUMN = "FuturePayments"
    //Contact table related
    static final private var CONTACT_TABLE = "Contact"
    static final private var FIRST_NAME_COLUMN = "FirstName"
    static final private var LAST_NAME_COLUMN = "LastName"
    static final private var NAME_COLUMN  = "Name"
    static final private var TAXID_COLUMN = "TaxID"  
    static final private var ROLE_COLUMN = "Role"
    static final private var CLAIM_CONTACT_TABLE = "ClaimContact"
    //Vehicle table related      
    static final private var VEHICLE_TABLE = "Vehicle"
    static final private var VIN_COLUMN = "Vin"
    //Catastrophe table related
    static final private var CATASTROPHE_TABLE = "Catastrophe"
    static final private var CATASTROPHE_NUMBER_COLUMN = "CatastropheNumber"
    //Matter related
    static final private var MATTER_TABLE = "Matter"
    static final private var MATTER_TYPE_COLUMN = "MatterType"
    static final private var ASSIGNMENT_COLUMN = "Assignment"
    //User related
    static final private var USER_TABLE = "User"
    //Security related
    static final private var PERMISSION_COLUMN = "Permission"
    static final private var SECURITY_ZONE_TABLE = "SecurityZone"
    static final private var IGNORE_ACL_PERM = "ignoreacl"
    static final private var PERMISSION_REQUIRED_COLUMN ="PermissionRequired"
    
    private var _nameSearchTypeRoleMap : HashMap<ClaimSearchNameSearchType, ContactRole>
    private var _financialSearchFieldColumnMap : HashMap<FinancialSearchField, String>
    private var _criteria : ExposureSearchCriteria
    private var _query : Query
    
    
    construct() {
        this._nameSearchTypeRoleMap = this.createNameSearchTypeRoleMap()
        this._financialSearchFieldColumnMap = this.createFinancialSearchFieldDBColumnMap()
    }  
  
    /**
    * Builds the query given the search criteria
    * 
    * @return the query built from the search criteria
    */
    public function buildQuery(criteria : ExposureSearchCriteria) : Query {
       
        this._criteria = criteria
        this._query = Query.make(ExposureSearchView)        
        this._query.withDistinct(true)
        this._query.withFindRetired(false)

        this.doClaimNumberSearch()
        this.doExposureSeveritySearch()
        this.doPolicyNumberSearch()
        this.doLossTypeSearch()
        this.doAssignedToUserSearch()
        this.doCreatedByUserSearch()
        this.doJurisdictionStateSearch()
        this.doExposureSeveritySearch()
        this.doLitigationStatusSearch()
        this.doPendingAssignmentSearch()
        this.doExposureStateSearch()
        this.doDateSearch()
        this.doFinancialSearch()
        this.doPartySearch()
        this.doCatastropheSearch()
        this.doVinSearch()
        this.doAssignedGroupSearch()
        this.doExposureTypeSearch()
        this.applySecurity()
        return this._query
    }
    
    
    /**
    * Creates a map between ClaimSearchNameSearchType and ContactRole
    * 
    * @return a map between ClaimSearchNameSearchType and ContactRole types
    */
    private function createNameSearchTypeRoleMap() : HashMap<ClaimSearchNameSearchType, ContactRole> {
        
        var newMap = new HashMap<ClaimSearchNameSearchType, ContactRole>()
        
        newMap.put(ClaimSearchNameSearchType.TC_ADDINSURED, ContactRole.TC_COVEREDPARTY)
        newMap.put(ClaimSearchNameSearchType.TC_ANY, null)
        newMap.put(ClaimSearchNameSearchType.TC_CLAIMANT, ContactRole.TC_CLAIMANT)
        newMap.put(ClaimSearchNameSearchType.TC_INSURED, ContactRole.TC_INSURED)
        
        return newMap        
    }
    
    
    /**
    * Creates a map between FinancialSearchField and the name of a Database 
    * column to search
    * 
    * @return a map between financialSearchFields and database columns
    */
    private function createFinancialSearchFieldDBColumnMap() : HashMap<FinancialSearchField, String>{
      
        var newMap = new HashMap<FinancialSearchField, String>()
        
        newMap.put(FinancialSearchField.TC_FUTUREPAYMENTS, FUTURE_PAYMENTS_COLUMN)        
        newMap.put(FinancialSearchField.TC_OPENRESERVES, OPEN_RESERVES_COLUMN)
        newMap.put(FinancialSearchField.TC_REMAININGRESERVE, REMAINING_RESERVES_COLUMN)
        newMap.put(FinancialSearchField.TC_TOTALPAID, TOTAL_PAID_COLUMN)
        
        return newMap
    }
    
    
    /**
    * Handles the Security restrictions applied by Claim Access Levels
    */
    private function applySecurity() {
        var currentUser = gw.plugin.util.CurrentUserUtil.getCurrentUser().User
        var userGroup = GroupsHelper.getUsersGroup(currentUser)
        var usersSecurityZone = userGroup.SecurityZone

        if(!User.util.getCurrentUser().hasPermission(IGNORE_ACL_PERM)){    
            this._query 
                .join(CLAIM_TABLE)         
                .or(\ or1 ->{
                      //User has permission in claim access table to view the claim
                      or1.subselect(ID, CompareIn, ClaimAccess, CLAIM_TABLE)
                         .compare(USER_TABLE, Relop.Equals, currentUser)
                         .compare(PERMISSION_COLUMN, Relop.Equals, ClaimAccessType.TC_VIEW)                    
                      //or User is in a security zone associated with the claim
                      or1.subselect(ID, CompareIn, ClaimAccess, CLAIM_TABLE)
                         .compare(SECURITY_ZONE_TABLE, Equals, usersSecurityZone)
                 })        
        }    
    }
    
     
    /**
    * Adds the Claim Number criteria to the query 
    */
    private function doClaimNumberSearch(){
        
        if(this._criteria.ClaimNumber != null){     
            this._query
                  .join(CLAIM_TABLE)
                  .compare(CLAIM_NUMBER_COLUMN, Equals, this._criteria.ClaimNumber)  
        }
    }


    /**
    * Adds the Exposure Severity criteria to the query 
    */
    private function doExposureSeveritySearch(){
        
        if(this._criteria.ExposureSeverity != null){
            this._query
                .join(INCIDENT_TABLE)
                .compare(SEVERITY_COLUMN, Equals, this._criteria.ExposureSeverity)     
        }
    }


    /**
    * Adds the Policy Number criteria to the query 
    */
    private function doPolicyNumberSearch(){
        
        if(this._criteria.PolicyNumber != null){
            this._query
                 .join(CLAIM_TABLE).join(POLICY_TABLE)
                 .compare(POLICY_NUMBER_COLUMN, Equals, this._criteria.PolicyNumber)
        }
    }    
    
   
    /**
    * Adds the Loss Type criteria to the query
    */ 
    private function doLossTypeSearch(){
        
        if(this._criteria.LossType != null){
            this._query
                .join(CLAIM_TABLE)
                .compare(LOSS_TYPE_COLUMN, Equals, this._criteria.LossType)
        }     
    }
    
    
    /**
    * Adds the Assigned To User criteria to the query
    */
    private function doAssignedToUserSearch(){
        
        if(this._criteria.AssignedToUser != null){
            this._query
                .compare(ASSIGNED_USER_COLUMN, Equals, this._criteria.AssignedToUser)
        }   
    }
    
    
    /**
    * Adds the Created By User criteria to the query
    */
    private function doCreatedByUserSearch(){
        
        if(this._criteria.CreatedByUser != null){
            this._query
                .compare(CREATE_USER_COLUMN, Equals, this._criteria.CreatedByUser)          
        }
    }
    
    
    /**
    * Adds the Jurisdiction State to the search query
    */
    private function doJurisdictionStateSearch(){
        
        if(this._criteria.JurisdictionState != null){
            this._query
                .compare(JURISDICTION_STATE_COLUMN, Equals, this._criteria.JurisdictionState)          
        }    
    }
    
    
    /**
    * Adds the Exposure State/Status to the search query
    */
    private function doExposureStateSearch(){
    
        if(this._criteria.ExposureState != null) {
            this._query
                .compare(EXPOSURE_STATE_COLUMN, Equals, this._criteria.ExposureState)   
        }    
    }
    
    
    /**
    * Adds Litigation Status criteria to the seach query
    */
    private function doLitigationStatusSearch(){
        
        if(this._criteria.LitigationStatus != null){
            this._query
                .subselect(ID, CompareIn, AssignmentExposureExt, EXPOSURE_TABLE)
                .subselect(ASSIGNMENT_COLUMN, CompareIn, MatterAssignmentExt, ID)
                .join(MATTER_TABLE)
                .compare(MATTER_TYPE_COLUMN, Equals, this._criteria.LitigationStatus)                
        }
    }
    
    
    /**
    * Adds Pending Assignment criteria to the search query
    */
    private function doPendingAssignmentSearch(){

        if(this._criteria.pendingAssignment != null){
            if(this._criteria.pendingAssignment == true){
                this._query
                    .compare(ASSIGNMENT_STATUS_COLUMN, Equals, AssignmentStatus.TC_PENDINGASSIGNMENT)
            }else{
                this._query
                     .compare(ASSIGNMENT_STATUS_COLUMN, NotEquals, AssignmentStatus.TC_PENDINGASSIGNMENT)
            }
        }
    }
      
    
    /**
    * Adds the Date criteria to the search query
    */
    private function doDateSearch() {
       
        if((this._criteria.DateFieldToSearch != null && this._criteria.DateSearchType != null) && 
            (this._criteria.StartDate != null || this._criteria.EndDate != null || this._criteria.DateRangeChoice != null)){
            
            var columnToSearch : String = null
            var today = gw.api.util.DateUtil.currentDate()
            var startDate : Date = null
            var endDate : Date = null            
            
            if(this._criteria.DateFieldToSearch == DateFieldsToSearchType.TC_CLOSED){
                columnToSearch = CLOSE_DATE_COLUMN               
            }else if(this._criteria.DateFieldToSearch == DateFieldsToSearchType.TC_CREATE){
                columnToSearch = CREATE_TIME_COLUMN
            }else if(this._criteria.DateFieldToSearch == DateFieldsToSearchType.TC_FEATUREASSIGNED){
                columnToSearch = ASSIGNMENT_DATE_COLUMN
            }
        
            //Date search type is list
            if(this._criteria.DateSearchType == DateSearchType.TC_FROMLIST){
                switch (this._criteria.DateRangeChoice){
                    case DateRangeChoiceType.TC_N0:
                        startDate = today
                        endDate = today
                        break
                    case DateRangeChoiceType.TC_N7:
                        startDate = today.addDays(-7)
                        endDate = today
                        break
                    case DateRangeChoiceType.TC_N14:
                        startDate = today.addDays(-14)
                        endDate = today
                        break
                    case DateRangeChoiceType.TC_N30:
                        startDate = today.addDays(-30)
                        endDate = today
                        break
                    case DateRangeChoiceType.TC_N90:
                        startDate = today.addDays(-90)
                        endDate = today
                        break
                    case DateRangeChoiceType.TC_N180:
                        startDate = today.addDays(-180)
                        endDate = today
                        break
                    case DateRangeChoiceType.TC_N365:
                        startDate = today.addDays(-365)
                        endDate = today
                        break
                    default:
                        break
                }
            }  
                    
            //Date search with use enterted dates
            if(this._criteria.DateSearchType == DateSearchType.TC_ENTEREDRANGE){
          
                if(this._criteria.StartDate == null){
                    startDate = today.addYears(-5)
                }else{
                    startDate = this._criteria.StartDate
                }
        
                if(this._criteria.EndDate == null){
                    endDate = today
                }else{
                    endDate = this._criteria.EndDate               
                }           
            }
        
            this._query.between(columnToSearch, startDate, endDate)
        }
    }  
    
    
    /**
    * Adds the Financial criteria to the search query
    */
    private function doFinancialSearch(){
      
        if(this._criteria.FinancialSearchField != null && 
           (this._criteria.AmountStart != null || this._criteria.AmountEnd != null)){        
       
            var startAmount = this._criteria.AmountStart != null ? new CurrencyAmount(this._criteria.AmountStart) : new CurrencyAmount(0)
            var endAmount = this._criteria.AmountEnd != null ? new CurrencyAmount(this._criteria.AmountEnd) : new CurrencyAmount(0)
            var columnToSearch : String = this._financialSearchFieldColumnMap.get(this._criteria.FinancialSearchField)
            
            this._query
                .join(EXPOSURERPT_TABLE)
                .between(columnToSearch, startAmount, endAmount)
        }
    }
  
  
    /**
    * Adds party search criteria to search query
    */
    private function doPartySearch(){
       
        if(this._criteria.NameSearchType != null){          

            var role : ContactRole = this._nameSearchTypeRoleMap.get(this._criteria.NameSearchType)
       
            if(this._criteria.NameCriteria.FirstName  != null){ 
                this.doPersonSearch(FIRST_NAME_COLUMN, this._criteria.NameCriteria.FirstName , role)
            }                 
    
            if(this._criteria.NameCriteria.LastName != null){
                this.doPersonSearch(LAST_NAME_COLUMN, this._criteria.NameCriteria.LastName, role)      
            }
            
            if(this._criteria.NameCriteria.CompanyName != null){
                this.doCompanySearch(NAME_COLUMN, this._criteria.NameCriteria.CompanyName, role) 
            }
    
            if(this._criteria.NameCriteria.TaxId != null){
                this.doTaxIdSearch(this._criteria.NameCriteria.TaxId, role)    
            }                     
        }
    }
    
    
    /**
    * Adds Person Claim Contact specific criteria to the search query
    */
    private function doPersonSearch(searchColumn : String, valueToSearch : String, contactRole : ContactRole){
      
        if(contactRole != null){
        
            this._query
                .join(CLAIM_TABLE)
                .subselect(ID, CompareIn, ClaimContact, CLAIM_TABLE)
                .join(CONTACT_TABLE).cast(Person)
                .contains(searchColumn, valueToSearch, true) 
                .subselect(ID, CompareIn, ClaimContact, CONTACT_TABLE)
                .subselect(ID, CompareIn, ClaimContactRole, CLAIM_CONTACT_TABLE)
                .compare(ROLE_COLUMN, Equals, contactRole) 
        
        }else{
          
            this._query
                .join(CLAIM_TABLE)
                .subselect(ID, CompareIn, ClaimContact, CLAIM_TABLE)
                .join(CONTACT_TABLE).cast(Person)
                .contains(searchColumn, valueToSearch, true)  
        }
    }
    
    
    /**
    * Adds Company Claim Contact specific criteria to the search query
    */
    private function doCompanySearch(searchColumn : String, valueToSearch : String, contactRole : ContactRole){
        
        if(contactRole != null){
            this._query
                .join(CLAIM_TABLE)
                .subselect(ID, CompareIn, ClaimContact, CLAIM_TABLE)
                .join(CONTACT_TABLE).cast(Company)
                .contains(searchColumn, valueToSearch, true)
                .subselect(ID, CompareIn, ClaimContact, CONTACT_TABLE)
                .subselect(ID, CompareIn, ClaimContactRole, CLAIM_CONTACT_TABLE)               
                .compare(ROLE_COLUMN, Equals, contactRole)
        }else{
            this._query
                .join(CLAIM_TABLE)
                .subselect(ID, CompareIn, ClaimContact, CLAIM_TABLE)
                .join(CONTACT_TABLE).cast(Company)
                .contains(searchColumn, valueToSearch, true)        
        }
    }
    
    
    /**
    * Adds Tax ID Claim Contact criteria to the search query 
    */
    private function doTaxIdSearch(taxID : String, contactRole : ContactRole){
        
        if(contactRole != null){
          
            this._query
                .join(CLAIM_TABLE)
                .subselect(ID, CompareIn, ClaimContact, CLAIM_TABLE)
                .join(CONTACT_TABLE)
                .compare(TAXID_COLUMN, Equals, taxID) 
                .subselect(ID, CompareIn, ClaimContact, CONTACT_TABLE)
                .subselect(ID, CompareIn, ClaimContactRole, CLAIM_CONTACT_TABLE)               
                .compare(ROLE_COLUMN, Equals, contactRole)
        }else{
          
            this._query
                .join(CLAIM_TABLE)
                .subselect(ID, CompareIn, ClaimContact, CLAIM_TABLE)
                .join(CONTACT_TABLE)
                .compare(TAXID_COLUMN, Equals, taxID)         
        }    
    }
    
    
    /**
    * Adds Assigned Group criteria to the search query
    */
    private function doAssignedGroupSearch(){
      
        if(this._criteria.AssignedToGroup.AssignedToGroup != null){       
      
            if(this._criteria.AssignedToGroup.IncludeSubGroups == true){
                          
                this._query
                    .join(CLAIM_TABLE)                
                    .or(\ or1 -> {
                        or1.compare(ASSIGNED_GROUP_COLUMN, Equals, this._criteria.AssignedToGroup.AssignedToGroup)
                        or1.compareIn(ASSIGNED_GROUP_COLUMN, this.getAllChildGroups(this._criteria.AssignedToGroup.AssignedToGroup, new HashSet<Group>()).toArray())
                           
                    })                              
            }else{
              
                this._query
                    .join(CLAIM_TABLE)
                    .compare(ASSIGNED_GROUP_COLUMN, Equals, this._criteria.AssignedToGroup.AssignedToGroup)
            }
        }        
    }
    
    
    /**
    * Adds Catastrophe criteria to the search query
    */
    private function doCatastropheSearch(){
      
        if(this._criteria.Catastrophe != null){
            this._query
                .join(CLAIM_TABLE)
                .join(CATASTROPHE_TABLE)
                .compare(CATASTROPHE_NUMBER_COLUMN, Equals, this._criteria.Catastrophe.CatastropheNumber)
        } 
    }
    
    
    /**
    * Adds VIN criteria to the search query
    */
    private function doVinSearch(){
    
        if(this._criteria.vinNumber != null){
            this._query
                .join(INCIDENT_TABLE).cast(VehicleIncident)
                .join(VEHICLE_TABLE)
                .compare(VIN_COLUMN, Equals, this._criteria.vinNumber)
        }    
    }
    

    /**
    * Adds Exposure Type criteria to the search query
    */
    private function doExposureTypeSearch(){
        
        if(this._criteria.ExposureType != null){
            this._query
                .compare(EXPOSURE_TYPE_COLUMN, Equals, this._criteria.ExposureType)
        }    
    }
    
    
    /**
    * Recuresively searches for Child Groups of a given group
    * 
    * @return set of groups
    */
    private function getAllChildGroups(group : Group, list : HashSet<Group>) : HashSet<Group>{
        
        var groups = list
        groups.add(group)
        
        for(gr in group.ChildGroups){
       
            groups.add(gr)
                
            if(gr.ChildGroups.HasElements){
                this.getAllChildGroups(gr, groups)
            }
        }
        
        return groups    
    }   
   


}//End QueryManager Class
