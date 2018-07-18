package gaic.ui.claim.search

uses gw.api.database.Query
uses java.util.HashMap
uses java.util.Date
uses gw.api.financials.CurrencyAmount

uses java.util.HashSet
uses util.user.GroupsHelper
uses gw.api.database.Relop

class CustomClaimSearch {

    static final private var ID = "ID"
    //Claim table related
    static final private var CLAIM_TABLE = "Claim"
    static final private var CLAIM_NUMBER_COLUMN = "ClaimNumber"
    static final private var LOSS_TYPE_COLUMN = "LossType"
    static final private var LOB_COLUMN = "LOBCode"
    static final private var ASSIGNED_GROUP_COLUMN = "AssignedGroup"
    static final private var ASSIGNED_USER_COLUMN = "AssignedUser"
    static final private var CREATE_USER_COLUMN = "CreateUser"
    static final private var CLOSE_DATE_COLUMN = "CloseDate"
    static final private var CREATE_TIME_COLUMN = "CreateTime"
    static final private var LOSS_DATE_COLUMN = "LossDate"
    static final private var REPORTED_DATE_COLUMN = "ReportedDate"
    static final private var JURISDICTION_STATE_COLUMN = "JurisdictionState"
    static final private var CLAIM_STATE_COLUMN = "State"
    static final private var ASSIGNMENT_STATUS_COLUMN = "AssignmentStatus"
    static final private var ASSIGNMENT_DATE_COLUMN = "AssignmentDate"
    static final private var INCIDENT_REPORT_COLUMN = "IncidentReport"
    static final private var COVERAGE_IN_QUESTION_COLUMN = "CoverageInQuestion"
    static final private var FLAGGED_COLUMN = "Flagged"
    static final private var BROKER_POLICY_NUM_COLUMN = "BrokerPolicyNumberExt"
    static final private var CODE_NAME_COLUMN = "CodeNameExt"
    //Policy table related
    static final private var POLICY_TABLE = "Policy"
    static final private var POLICY_NUMBER_COLUMN = "PolicyNumber"
    //ClaimRpt table related 
    static final private var CLAIMRPT_TABLE = "ClaimRpt"
    static final private var OPEN_RESERVES_COLUMN = "OpenReserves"
    static final private var REMAINING_RESERVES_COLUMN = "RemainingReserves"
    static final private var TOTAL_PAID_COLUMN = "TotalPayments"
    static final private var FUTURE_PAYMENTS_COLUMN = "FuturePayments"
    static final private var GROSS_TOTAL_INCURRED = "TotalPayments"
    static final private var NET_TOTAL_INCURRED = "TotalPayments"
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
    //User related
    static final private var USER_TABLE = "User"
    //Security related
    static final private var PERMISSION_COLUMN = "Permission"
    static final private var SECURITY_ZONE_TABLE = "SecurityZone"
    static final private var IGNORE_ACL_PERM = "ignoreacl"
    static final private var PERMISSION_REQUIRED_COLUMN ="PermissionRequired"
    
    private var _nameSearchTypeRoleMap : HashMap<ClaimSearchNameSearchExt, ContactRole>
    private var _financialSearchFieldColumnMap : HashMap<FinancialSearchField, String>
    private var _criteria : ClaimSearchCriteria
    private var _query : Query

  construct() {
        this._nameSearchTypeRoleMap = this.createNameSearchExtRoleMap()
        this._financialSearchFieldColumnMap = this.createFinancialSearchFieldDBColumnMap()
  }
  
    /**
    * Builds the query given the search criteria
    * 
    * @return the query built from the search criteria
    */
    public function buildQuery(criteria : ClaimSearchCriteria) : Query {
       
        this._criteria = criteria
        this._query = Query.make(ClaimSearchView)        
        this._query.withDistinct(true)
        this._query.withFindRetired(false)

        this.doClaimNumberSearch()
        this.doPolicyNumberSearch()
        this.doLossTypeSearch()
        this.doAssignedToUserSearch()
        this.doCreatedByUserSearch()
        this.doJurisdictionStateSearch()
        this.doPendingAssignmentSearch()
        this.doClaimStateSearch()
        this.doDateSearch()
        this.doFinancialSearch()
        this.doPartySearch()
        this.doCatastropheSearch()
        this.doVinSearch()
        this.doAssignedGroupSearch()
        this.doLOBSearch()
        this.doIncidentReportSearch()
        this.doCoverageInQuestionSearch()
        this.doFlaggedTypeSearch()
        this.doBrokerPolicyNumberSearch()
        this.doCodeNameSearch()
        this.applySecurity()
        this.doExactMatchSearch()
        
        return this._query
    }
    
    /** kniese - 9/18/14
    * Creates a map between ClaimSearchNameSearchExt and ContactRole
    *
    * @return a map between ClaimSearchNameSearchExt and ContactRole types
    */
    private function createNameSearchExtRoleMap() : HashMap<ClaimSearchNameSearchExt, ContactRole> {
    	
    	var newMap = new HashMap<ClaimSearchNameSearchExt, ContactRole>()
    	
    	newMap.put(ClaimSearchNameSearchExt.TC_ADDINSURED, ContactRole.TC_COVEREDPARTY)
        newMap.put(ClaimSearchNameSearchExt.TC_ANY, null)
        newMap.put(ClaimSearchNameSearchExt.TC_CLAIMANT, ContactRole.TC_CLAIMANT)
        newMap.put(ClaimSearchNameSearchExt.TC_INSURED, ContactRole.TC_INSURED)
        newMap.put(ClaimSearchNameSearchExt.TC_INCIDENTCLAIMANT, ContactRole.TC_INCIDENTCLAIMANT)
    	
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
        newMap.put(FinancialSearchField.TC_GROSSCHECKAMOUNT, GROSS_TOTAL_INCURRED)
        newMap.put(FinancialSearchField.TC_TOTALINCURREDNET, NET_TOTAL_INCURRED)
        
        return newMap
    }
    
   
    /**
    * Adds the Claim Number criteria to the query 
    */
    private function doClaimNumberSearch(){
        
        if(this._criteria.ClaimNumber != null){     
            this._query
                  .compare(CLAIM_NUMBER_COLUMN, Equals, this._criteria.ClaimNumber)  
        }
    }

    /**
    * Adds the Policy Number criteria to the query 
    */
    private function doPolicyNumberSearch(){
        
        if(this._criteria.PolicyNumber != null){
            this._query
                 .join(POLICY_TABLE)
                 .compare(POLICY_NUMBER_COLUMN, Equals, this._criteria.PolicyNumber)
        }
    }    
    
   
    /**
    * Adds the Loss Type criteria to the query
    */ 
    private function doLossTypeSearch(){
        
        if(this._criteria.LossType != null){
            this._query
                .compare(LOSS_TYPE_COLUMN, Equals, this._criteria.LossType)
        }     
    }
    
    /**
    * Adds the LOB criteria to the query
    */ 
    private function doLOBSearch(){
        
        if(this._criteria.LOBCode != null){
            this._query
                .compare(LOB_COLUMN, Equals, this._criteria.LOBCode)
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
    * Adds the Claim State/Status to the search query
    */
    private function doClaimStateSearch(){
    
        if(this._criteria.ClaimState != null) {
            this._query
                .compare(CLAIM_STATE_COLUMN, Equals, this._criteria.ClaimState)   
        }    
    }
    
    
    /**
    * Adds Pending Assignment criteria to the search query
    */
    private function doPendingAssignmentSearch(){

        if(this._criteria.pendingAssignment != null){
            if(this._criteria.pendingAssignment == false){
                this._query
                    .compare(ASSIGNMENT_STATUS_COLUMN, Equals, AssignmentStatus.TC_ASSIGNED)
            }else{
                this._query
                     .compare(ASSIGNMENT_STATUS_COLUMN, NotEquals, AssignmentStatus.TC_ASSIGNED)
            }
        }
    }

    /**
    * Adds Incident Report criteria to the search query
    */
    private function doIncidentReportSearch(){

        if(this._criteria.IncidentReport != null){
            if(this._criteria.IncidentReport == true){
                this._query
                    .compare(INCIDENT_REPORT_COLUMN, Equals, true)
            }else{
                this._query
                     .compare(INCIDENT_REPORT_COLUMN, NotEquals, true)
            }
        }
    }      
    
    /**
    * Adds Coverage in Question criteria to the search query
    */
    private function doCoverageInQuestionSearch(){

        if(this._criteria.CoverageInQuestion != null){
            if(this._criteria.CoverageInQuestion == true){
                this._query
                    .compare(COVERAGE_IN_QUESTION_COLUMN, Equals, true)
            }else{
                this._query
                     .compare(COVERAGE_IN_QUESTION_COLUMN, NotEquals, true)
            }
        }
    }   
    
    /**
    * Adds the Date criteria to the search query
    */
    private function doDateSearch() {
       
        if((this._criteria.DateCriterionChoice.ChosenOption != null && this._criteria.DateCriterionChoice.DateSearchType != null) && 
            (this._criteria.DateCriterionChoice.StartDate != null || this._criteria.DateCriterionChoice.EndDate != null || this._criteria.DateCriterionChoice.DateRangeChoice != null)){
            
            var columnToSearch : String = null
            var today = gw.api.util.DateUtil.currentDate()
            var startDate : Date = null
            var endDate : Date = null            
            
            if(this._criteria.DateCriterionChoice.ChosenOption == "Java.Criterion.Option.Claim.CloseDate"){
                columnToSearch = CLOSE_DATE_COLUMN               
            }else if(this._criteria.DateCriterionChoice.ChosenOption == "Java.Criterion.Option.Claim.CreateDate"){
                columnToSearch = CREATE_TIME_COLUMN
            }else if(this._criteria.DateCriterionChoice.ChosenOption == "Java.Criterion.Option.Claim.ClaimAssignedDate"){
                columnToSearch = ASSIGNMENT_DATE_COLUMN
            }else if(this._criteria.DateCriterionChoice.ChosenOption == "Java.Criterion.Option.Claim.LossDate"){
                columnToSearch = LOSS_DATE_COLUMN
            }else if(this._criteria.DateCriterionChoice.ChosenOption == "Java.Criterion.Option.Claim.ReportedDate"){
                columnToSearch = REPORTED_DATE_COLUMN
            }
        
            //Date search type is list
            if(this._criteria.DateCriterionChoice.DateSearchType == DateSearchType.TC_FROMLIST){
                switch (this._criteria.DateCriterionChoice.DateRangeChoice){
                    case DateRangeChoiceType.TC_N0:
                        startDate = today
                        endDate = today
                        break
                    case DateRangeChoiceType.TC_N7:
                        startDate = today.addDays(-8)
                        endDate = today
                        break
                    case DateRangeChoiceType.TC_N14:
                        startDate = today.addDays(-15)
                        endDate = today
                        break
                    case DateRangeChoiceType.TC_N30:
                        startDate = today.addDays(-31)
                        endDate = today
                        break
                    case DateRangeChoiceType.TC_N90:
                        startDate = today.addDays(-91)
                        endDate = today
                        break
                    case DateRangeChoiceType.TC_N180:
                        startDate = today.addDays(-181)
                        endDate = today
                        break
                    case DateRangeChoiceType.TC_N365:
                        startDate = today.addDays(-366)
                        endDate = today
                        break
                    default:
                        break
                }
            }  
                    
            //Date search with use enterted dates
            if(this._criteria.DateCriterionChoice.DateSearchType == DateSearchType.TC_ENTEREDRANGE){
          
                if(this._criteria.DateCriterionChoice.StartDate == null){
                    startDate = today.addYears(-5)
                }else{
                    startDate = this._criteria.DateCriterionChoice.StartDate
                }
        
                if(this._criteria.DateCriterionChoice.EndDate == null){
                    endDate = today
                }else{
                    endDate = this._criteria.DateCriterionChoice.EndDate               
                }           
            }
        
            this._query.between(columnToSearch, startDate, endDate)
        }
    }  
    
    
    /**
    * Adds the Financial criteria to the search query
    */
    private function doFinancialSearch(){
      
        if(this._criteria.FinancialCriterion.ChosenOption != null && 
           (this._criteria.FinancialCriterion.AmountStart != null || this._criteria.FinancialCriterion.AmountEnd != null)){  
             
            var chosenOption : FinancialSearchField
            
            if(this._criteria.FinancialCriterion.ChosenOption == "Java.Criterion.Option.Claim.OpenReserves"){
             chosenOption =  FinancialSearchField.TC_OPENRESERVES
            } else if(this._criteria.FinancialCriterion.ChosenOption == "Java.Criterion.Option.Claim.RemainingReserves"){
             chosenOption =  FinancialSearchField.TC_REMAININGRESERVE
            }else if(this._criteria.FinancialCriterion.ChosenOption == "Java.Criterion.Option.Claim.TotalPayments"){
             chosenOption =  FinancialSearchField.TC_TOTALPAID
            }else if(this._criteria.FinancialCriterion.ChosenOption == "Java.Criterion.Option.Claim.FuturePayments"){
             chosenOption =  FinancialSearchField.TC_FUTUREPAYMENTS
            }else if(this._criteria.FinancialCriterion.ChosenOption == "Java.Criterion.Option.Claim.TotalIncurredGross"){
             chosenOption =  FinancialSearchField.TC_GROSSCHECKAMOUNT
            }else{
             chosenOption = FinancialSearchField.TC_TOTALINCURREDNET 
            }
            
            var startAmount = this._criteria.FinancialCriterion.AmountStart != null ? new CurrencyAmount(this._criteria.FinancialCriterion.AmountStart) : new CurrencyAmount(0)
            var endAmount = this._criteria.FinancialCriterion.AmountEnd != null ? new CurrencyAmount(this._criteria.FinancialCriterion.AmountEnd) : new CurrencyAmount(0)
            var columnToSearch : String = this._financialSearchFieldColumnMap.get(chosenOption)
           
            this._query
              .join(CLAIMRPT_TABLE)
              .between(columnToSearch, startAmount, endAmount)
        }
    }

    /**
    * Adds the Flagged Type criteria to the search query
    */
    private function doFlaggedTypeSearch(){
      
        if(this._criteria.FlaggedType != null) {
          this._query
                .compare(FLAGGED_COLUMN, Equals, this._criteria.FlaggedType)  
        }
    } 
  
    /**
    * Adds party search criteria to search query
    * kniese - 9/18/14 - changing from NameSearchType to NameSearchTypeExt
    */
    private function doPartySearch(){
       
        if(this._criteria.NameSearchTypeExt != null){          

            var role : ContactRole = this._nameSearchTypeRoleMap.get(this._criteria.NameSearchTypeExt)
       
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
    
    /** cdmcdonald - 7/2015 - defect 7607 - first and last name search should only bring exact match */
    
    private function doExactMatchSearch(){
    	if (this._criteria.NameSearchTypeExt == TC_ANY){
    	
    	var role : ContactRole = this._nameSearchTypeRoleMap.get(this._criteria.NameSearchTypeExt)
    	
    		if (this._criteria.NameCriteria.FirstName  != null && this._criteria.NameCriteria.LastName != null){
    			this.doPersonSearch(FIRST_NAME_COLUMN, this._criteria.NameCriteria.FirstName , role)
    			this.doPersonSearch(LAST_NAME_COLUMN, this._criteria.NameCriteria.LastName, role)}
    		else{
    			if(this._criteria.NameCriteria.FirstName  != null){ 
                this.doPersonSearch(FIRST_NAME_COLUMN, this._criteria.NameCriteria.FirstName , role)}
                if(this._criteria.NameCriteria.LastName != null){
                this.doPersonSearch(LAST_NAME_COLUMN, this._criteria.NameCriteria.LastName, role)} 
            	}
        }
    }
    /**
    * Adds Person Claim Contact specific criteria to the search query
    */
    private function doPersonSearch(searchColumn : String, valueToSearch : String, contactRole : ContactRole){
      
        if(contactRole != null){
        
            this._query
                .subselect(ID, CompareIn, ClaimContact, CLAIM_TABLE)
                .join(CONTACT_TABLE).cast(Person)
                .contains(searchColumn, valueToSearch, true) 
                .subselect(ID, CompareIn, ClaimContact, CONTACT_TABLE)
                .subselect(ID, CompareIn, ClaimContactRole, CLAIM_CONTACT_TABLE)
                .compare(ROLE_COLUMN, Equals, contactRole) 
        
        }else{
          
            this._query
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
                .subselect(ID, CompareIn, ClaimContact, CLAIM_TABLE)
                .join(CONTACT_TABLE).cast(Company)
                .contains(searchColumn, valueToSearch, true)
                .subselect(ID, CompareIn, ClaimContact, CONTACT_TABLE)
                .subselect(ID, CompareIn, ClaimContactRole, CLAIM_CONTACT_TABLE)               
                .compare(ROLE_COLUMN, Equals, contactRole)
        }else{
            this._query
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
                .subselect(ID, CompareIn, ClaimContact, CLAIM_TABLE)
                .join(CONTACT_TABLE)
                .compare(TAXID_COLUMN, Equals, taxID) 
                .subselect(ID, CompareIn, ClaimContact, CONTACT_TABLE)
                .subselect(ID, CompareIn, ClaimContactRole, CLAIM_CONTACT_TABLE)               
                .compare(ROLE_COLUMN, Equals, contactRole)
        }else{
          
            this._query
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
                    //.or(\ or1 -> {
                        //.compare(ASSIGNED_GROUP_COLUMN, Equals, this._criteria.AssignedToGroup.AssignedToGroup)
                        .compareIn(ASSIGNED_GROUP_COLUMN, this.getAllChildGroups(this._criteria.AssignedToGroup.AssignedToGroup, new HashSet<Group>()).toArray())
                           
                    //})                              
            }else{
              
                this._query
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
                .join(Incident, CLAIM_TABLE).cast(VehicleIncident)
                .join(VEHICLE_TABLE)
                .compare(VIN_COLUMN, Equals, this._criteria.vinNumber)
        }    
    }
    
    /**
    * Adds Broker Policy criteria to the search query
    */
    private function doBrokerPolicyNumberSearch(){
    
        if(this._criteria.BrokerPolicyNumberExt != null){
            this._query
                .compare(BROKER_POLICY_NUM_COLUMN, Equals, this._criteria.BrokerPolicyNumberExt)
        }    
    }

    /**
    * Adds Code Name criteria to the search query
    */
    private function doCodeNameSearch(){
    
        if(this._criteria.CodeNameExt != null){
            this._query
                .compare(CODE_NAME_COLUMN, Equals, this._criteria.CodeNameExt)
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
    
    /**
    * Handles the Security restrictions applied by Claim Access Levels
    */
    private function applySecurity() {
        var currentUser = gw.plugin.util.CurrentUserUtil.getCurrentUser().User
        var userGroup = GroupsHelper.getUsersGroup(currentUser)
        var usersSecurityZone = userGroup.SecurityZone

        if(!User.util.getCurrentUser().hasPermission(IGNORE_ACL_PERM)){  
            this._query      
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
   

}
