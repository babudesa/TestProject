package libraries.MattersUI
uses java.util.ArrayList
uses java.util.HashSet
uses libraries.Matter_Entity.AttorneyTypeMapper
uses java.util.Set
uses util.custom_Ext.MatterActivator




/**
 *  The AssignmentUIHelper class contains functions used by the matter assingment
 *  related user interface screens.
 * 
 * @author kepage
 */
class AssignmentUIHelper  {

  private var _assignment : MatterAssignmentExt

  construct(assignment: MatterAssignmentExt) {
     this._assignment = assignment 
  }
  
  /*
   * Function to set defaultExposure assignments if only 1 exposure with legal expense is true
   */
  public function defaultAssignmentExpsoure(newAssignmentExposure: AssignmentExposureExt){
    var defaultExposure = _assignment.Matter.Claim.Exposures.where(\ e -> e.LegalExpenseExt == true )
    if(defaultExposure.Count == 1){
      newAssignmentExposure.Exposure = defaultExposure.first()
      newAssignmentExposure.ClaimantExt = defaultExposure.first().Claimant
      newAssignmentExposure.PrimaryClaimantExt = true
    }
  }
  
  /**
   * Gets the LSS Matter ID for display.
   * 
   * @return LSS matter ID for an assignment.
   */
  property get MatterDisplayID() : String {
    var activator : MatterActivator = new MatterActivator()
    if (activator.isLOBUsingLSS(_assignment.Matter.Claim.LossType)){
      return _assignment.LSSMatterID
    } else {
      return _assignment.Matter.PublicID;
    }
  }
    


  /**
   * Gets the filtered list of Attorney Types.
   * 
   * Property gets the attorney type list filtered for display on
   * MatterDetailsDV.pcf : If the same law firm is assigned twice to the 
   * same Legal Action, prevents same Attorney Type be selected multiple times
   * by removing the types from the list
   * 
   * @return Filterd list of Attorney Types
   */
   property get AttorneyTypeListDropdownDisplay(): List<LineCategory>{
   
     var mapper = new AttorneyTypeMapper()
     var attorneyTypes = mapper.AttorneyTypes
     var typesToRemove = new ArrayList<LineCategory>()
     
     //If there is an assigment already on this matter where 
     //the lawfirm on this assignment is used     
     if((exists(ma in _assignment.Matter.MatterAssignmentsExt where 
               ma.CounselLawFirmExt == _assignment.CounselLawFirmExt)) &&
               (_assignment.MatterAssignmentStatusExt != typekey.MatterAssignmentStatus.TC_DECLINED)){         
         
         // get all assignments where matter status is not declined or removed
         // and the counsel law firm is the same as the counsel law firm on this
         // assignment and the assignment is not this assigment
         var eligibleAssignments = _assignment.Matter.MatterAssignmentsExt
              .where(\ m -> m.MatterAssignmentStatusExt != typekey.MatterAssignmentStatus.TC_DECLINED 
                         && m.CounselLawFirmExt == _assignment.CounselLawFirmExt && m != _assignment)  
         
             //for each assignment in the list of eligibleAssignments
             for(ma in eligibleAssignments){
               
                 //if the type does not already exist in the type to remove list
                 //then add the type to the list of type to remove
                 if(!exists(type in typesToRemove where type == ma.AttorneyTypeExt)){
            
                    typesToRemove.add(ma.AttorneyTypeExt)                    
                 }             
             }         
      }     
       
      return attorneyTypes.subtract(typesToRemove).toList().sort()
   }
   
   
   
   /**
    * Gets top level budget line items for display. 
    * 
    * @return Top level budget line items for display.
    */
   property get TopLevelBudgetLineItems() : List<BudgetLineItemExt>{
     var retVal = new ArrayList<BudgetLineItemExt>();     
         
     for (x in _assignment.BudgetExt.BudgetLineItemExt){
       if (x.UTBMS.contains("00") && !x.UTBMS.contains("000")){
          retVal.add(x)
       }
     }
     return retVal;
   }
   
   

   /**
    * Gets valid values for the lead counsel dropdown from parties
    * involved /claim contacts
    * 
    * @return Valid contacts for the Lead Counsel
    */   
   property get ValidPartiesInvolvedForLeadCounsel():Contact[]{
      
      var contacts =_assignment.Matter.Claim.Contacts*.Roles
          .where(\ r -> r.Role == typekey.ContactRole.TC_COVERAGECOUNSEL ||                   
                        r.Role == typekey.ContactRole.TC_FORMERCOVERAGECOUNSEL||
                        r.Role == typekey.ContactRole.TC_DEFENSECOUNSEL||
                        r.Role == typekey.ContactRole.TC_FORMERDEFENSECOUNSEL||
                        r.Role == typekey.ContactRole.TC_INSUREDPERSONCOUNSEL ||
                        r.Role == typekey.ContactRole.TC_FRMRINSDPERSONCOUNSEL ||
                        r.Role == typekey.ContactRole.TC_RECOVERYCOUNSEL||
                        r.Role == typekey.ContactRole.TC_FORMERRECOVERYCOUNSEL||
                        r.Role == typekey.ContactRole.TC_CONSULTINGCOUNSEL ||
                        r.Role == typekey.ContactRole.TC_FRMRCONSULTINGCOUNSEL||
                        r.Role == typekey.ContactRole.TC_MONITORINGCOUNSEL ||
                        r.Role == typekey.ContactRole.TC_FRMMONITORINGCOUNSEL )*.Contact                             
     
     return this.removeDuplicatesFromList(contacts as java.util.ArrayList<java.lang.Object>) as Contact[]    
   }
  
  

 /**
  * Gets indicator as to whether or not the
  * law firm field is editable on MatterDetailsDV.pcf
  * 
  * @return Indicator as to whether or not the lawfirm field is editable.
  */     
  property get IsLawFirmEditable() : boolean{
     
     var originalAssignment = _assignment.OriginalVersion as MatterAssignmentExt
     
     //if the assignment has been saved then the law firm cannot be edited
     if(exists(ma in originalAssignment.Matter.MatterAssignmentsExt where ma == _assignment)){               
       return false
     }else{
        return true
     }
  }
  
  

  /**
   * Gets valid values for the law firm dropdown from parties
   * involved /claim contacts.
   * 
   * @return Valid contacts for Law Firm
   */  
  property get ValidPartiesInvolvedForLawFirm():Contact[]{
          
      //get all valid contacts with the taxid's
      var claimContacts : ClaimContact[] =_assignment.Matter.Claim.Contacts.where(\ c->c.Contact.TaxID != null)
      var contacts : Contact [] = claimContacts*.Roles
          .where(\ r -> r.Role == typekey.ContactRole.TC_COVERAGECOUNSEL ||
                        r.Role == typekey.ContactRole.TC_FORMERCOVERAGECOUNSEL||
                        r.Role == typekey.ContactRole.TC_DEFENSECOUNSEL||
                        r.Role == typekey.ContactRole.TC_FORMERDEFENSECOUNSEL||
                        r.Role == typekey.ContactRole.TC_INSUREDPERSONCOUNSEL ||
                        r.Role == typekey.ContactRole.TC_FRMRINSDPERSONCOUNSEL ||
                        r.Role == typekey.ContactRole.TC_RECOVERYCOUNSEL||
                        r.Role == typekey.ContactRole.TC_FORMERRECOVERYCOUNSEL||
                        r.Role == typekey.ContactRole.TC_CONSULTINGCOUNSEL ||
                        r.Role == typekey.ContactRole.TC_FRMRCONSULTINGCOUNSEL||
                        r.Role == typekey.ContactRole.TC_MONITORINGCOUNSEL||
                        r.Role == typekey.ContactRole.TC_FRMMONITORINGCOUNSEL)*.Contact 
                        
                             
     
     return this.removeDuplicatesFromList(contacts as java.util.ArrayList<java.lang.Object>) as Contact[]                 
  }
  
  
 
  /**
   * Gets valid values for the opposing law firm dropdown from parties
   * involved /claim contacts.
   * 
   * @return Valid contacts for Opposing Law Firm
   */  
  property get ValidPartiesInvolvedForOpposingLawFirm():Contact[]{
  
    return _assignment.Matter.Claim.Contacts*.Contact.where(\ c -> typeof c == Attorney ||
                typeof c == Ex_ForeignPerVndrAttny || typeof c == LawFirm ||
                typeof c == Ex_ForeignCoVenLawFrm ) 
  }
          
  
  /**
   * Gets valid values for the opposing lead counsel dropdown from parties
   * involved /claim contacts.
   * 
   * @return Valid contacts for Opposing Lead Cousnel
   */  
  property get ValidPartiesInvolvedForOpposingLeadCounsel():Contact[]{
  
    return _assignment.Matter.Claim.Contacts*.Contact.where(\ c -> typeof c == Attorney ||
                typeof c == Ex_ForeignPerVndrAttny) 
  }
  
  
  
  /**
   * Gets the the budget status for display on BudgetStatusDV.pcf
   * 
   * @return Budget status for UI display.
   */
   property get BudgetStatusDisplay():String {
      return convertStringForDisplay(_assignment.BudgetExt.BudgetStatus)
   } 
  
  
  

  /**
   * Gets the the staffing plan status for display on StaffingDetailsDV.pcf
   * 
   * @return Staffing status for UI display.
   */
   property get StaffingStatusDisplay():String {
     var displayString = convertStringForDisplay(_assignment.StaffingPlanExt.StaffingStatus)    
     return displayString
   }
   
     
  
  /**
   * Gets the claimants who are eligible to be displayed in the Claimants list
   * on the MatterDetailDV.pcf 
   * 
   * @return Eligible claimant contacts
   */
   property get EligibleClaimants() : Set<Contact> {
    var expoArray = _assignment.Matter.Claim.Exposures.where(\ expo -> expo.LegalExpenseExt
                     && !expo.Closed)
    return expoArray*.Claimant.toSet()
   }   
  
  
   
  /**
   * Resets the contact and billing address for the lawfirm associated with the 
   * assignment.  Used on MatterDetailsDV.pcf
   */
  function resetAddresses(){
    _assignment.CounselContactAddressOwner.Address = null
    _assignment.CounselBillingAddressOwner.Address = null
  }  


   
  /**
   * Gets staffing plan timekeeper line item review status in display format. 
   * 
   * @param reviewStatus The original review status string to convert.
   * @return Staffing plan timekeeper line item review status.
   */  
   function getTimekeeperReviewStatusDisplay(reviewStatus: String):String {
     var displayString = convertStringForDisplay(reviewStatus)
     return displayString
   }



  /**
   * Gets budget line item review status in display format.
   * 
   * @param reviewStatus The original review status string to convert.
   * @return Budget line item review status.
   */  
   function getBudgetReviewStatusDisplay(reviewStatus: String):String {
     var displayString = convertStringForDisplay(reviewStatus)
     return displayString
   }
  
  
   
  /**
   * Gets indicator as to whether or not a claimant in the list is displayable.
   * 
   * Used to filter the claimant dropdown list as claimants are selected on the MatterDetailsDV.pcf
   * This helps facilitate the picking of a claimant before a feature.
   * 
   * @param claimant The claimant to check for display eligibility.
   * @return Indicator as to whether or not a claimant is displayable.
   */  
  function isClaimantDisplayable(claimant : Contact) : boolean {
      var useCount = _assignment.AssignmentExposuresExt*.Exposure.where(\ e -> e.Claimant == claimant).Count
      var featCount = _assignment.Matter.Claim.Exposures.where(\ e -> e.Claimant == claimant 
                        && !e.Closed && e.LegalExpenseExt).Count
  
      if(useCount == 0 || (featCount > 1 && featCount > useCount))
        return true
      else
        return false
  }
 
 
  
  /**
   * Gets exposures eligible to be selected for a specific claimant in the
   * claimants list view on the MatterDetailsDV.pcf
   * 
   * This helps facilitate the picking of a claimant before a feature.
   * 
   * @param assignmentExposure The assignment exposures to get eligible exposure for
   * @return List of eligible exposures.
   */ 
  function getEligibleExposures(assignmentExposure : AssignmentExposureExt): Exposure[] {
    
      var claimant = assignmentExposure.ClaimantExt    
      var exposure = assignmentExposure.Exposure
      var eligibleExposures = _assignment.Matter.Claim.Exposures.where(\ e -> e.Claimant == claimant 
                               && !e.Closed && e.LegalExpenseExt)  
      var assignmentExposures = _assignment.AssignmentExposuresExt.where(\ e -> e.ClaimantExt == claimant
                                && e != assignmentExposure)*.Exposure                              
         var filteredList = eligibleExposures.subtract(assignmentExposures)
    
      if(exposure != null && eligibleExposures.contains(exposure)){
        filteredList.add(exposure)
      }
      return filteredList.toTypedArray()
  }
   
   
  
  /**
   * Sets the primary claimant on the matter assignment based on the selection
   * in claimants list view on the MatterDetailsDV.pcf
   * 
   * This helps facilitate the picking of a claimant before a feature.
   * 
   * @param assignmentExposure The assignment exposures to set as the primary claimant
   */ 
   function setPrimaryClaimant(assignmentExposure :AssignmentExposureExt) {
       
       //remove primary claimant indicator for all other claimants
       //on the assignment
       for(claimant in _assignment.AssignmentExposuresExt){
         claimant.PrimaryClaimantExt = false
       }
       assignmentExposure.PrimaryClaimantExt = true
   }


   
  /**
   * Sets the initial valies of a new claimant list view row 
   * when called from MatterDetailsDV.pcf as a claimant is selected
   * 
   * This helps facilitate the picking of a claimant before a feature.
   * 
   * @param assignmentExposure The assignment exposures to set as the primary claimant
   * @return New assignment exposure
   */ 
   function initClaimantRow(assignmentExposure:AssignmentExposureExt): Exposure[]{
       setDefaultExposure(assignmentExposure)
       setDefaultPrimaryClaimant()       
       return this.getEligibleExposures(assignmentExposure)      
   }
   
   
   
  /*
  * Function removes a row from the assignment exposure array, resets the 
  * primary claimant indicator, and removes opposing counsel roles
  * when called from MatterDetailsDV.pcf 
  */ 
   function removeAssignmentExposure(assignmentExposure : AssignmentExposureExt){
       
       var roleHelper = new libraries.Matter_Entity.MatterRoleHelper(_assignment.Matter)
       roleHelper.setOpposingLawFirmFormer(assignmentExposure)
       roleHelper.setOpposingLeadCounselFormer(assignmentExposure)
       
       _assignment.removeFromAssignmentExposuresExt(assignmentExposure)
       this.setDefaultPrimaryClaimant()
   }
  
  
  
   /*
  * Function used on MatterDetailsDV.pcf. to populate the Opposing Law Firm field
  * after the selection of a claimant/feature combination.
  * If the claimant/feature combination already exists on the legal action
  * this function returns the already associated Opposing Law Firm
  */
  function setExistingOpposingCounsel(assignmentExposure : AssignmentExposureExt) {
     
     //get all assignmens where the assignment is not this assignment
     //and the exposure & claimants are the same
     var assignmentList = _assignment.Matter.MatterAssignmentsExt*.AssignmentExposuresExt
         .where(\ a -> a.Assignment != _assignment
          && a.Exposure == assignmentExposure.Exposure
          && a.ClaimantExt == assignmentExposure.ClaimantExt
          && a.OpposingCounselFirmExt != null)
     
     //it the assignment list is not empty then a claimant/exposure match
     //was found. Set the opposing counsel on the passed in assignment to
     //the opposing counsel of the first claimant/feature in the list  
     if(!assignmentList.IsEmpty){       
        assignmentExposure.OpposingCounselFirmExt = assignmentList.sort().first().OpposingCounselFirmExt
     //set opposing counsel to null if no matches are found
     }else {
         assignmentExposure.OpposingCounselFirmExt = null
     }   
  }  
   
   
  
  /*
  * Function returns the review from the lead counsel review array that is 
  * associated with the assignment
  */  
  property get LeadCounselReview(): Review {     
     
     if(exists(rev in _assignment.LeadCounselExt.Reviews where rev.MatterAssignmentExt == _assignment)){
        
        return _assignment.LeadCounselExt.Reviews
                        .where(\ r -> r.MatterAssignmentExt == _assignment).first()
         
     }else{
       return null
     }     
  }
  
  
  
  property get AppropriateQuestionSet() : QuestionSet[] {
    
    var questionSetTypes = new ArrayList<QuestionSetType>()
    questionSetTypes.add("attyrating")    

    var query = find (q in QuestionSet where q.QuestionSetType in (questionSetTypes as typekey.QuestionSetType[]))   
    var questionSets = new ArrayList<QuestionSet>()
    for (questionSet in query) {
      questionSets.add(questionSet)
    }
    return questionSets.toTypedArray()
  }
  
      
        
  /*
  * Function sets default primary claimant
  */    
   protected function setDefaultPrimaryClaimant(){
       if(!exists(ae in _assignment.AssignmentExposuresExt where ae.PrimaryClaimantExt == true)
           && _assignment.AssignmentExposuresExt.IsEmpty == false){
           _assignment.AssignmentExposuresExt.first().PrimaryClaimantExt = true 
       }
   }
   
   
  
  /*
  * Function sorts the list of eligible exposures and sets the default exposure
  * Update 1/11/16 : kniese - Defect 8162 - Do not select an Exposure if more than
  * one exposure is on the claim with Legal Expense = yes. 
  */  
   protected function setDefaultExposure(assignmentExposure :AssignmentExposureExt) {
     
     if(this.getEligibleExposures(assignmentExposure).Count == 1){
      assignmentExposure.Exposure = this.getEligibleExposures(assignmentExposure).last()
     }else{ 
       assignmentExposure.Exposure = null
     }
   }  
   
   
      
  /*
  * Function removes duplicates from a list  
  */
   protected function removeDuplicatesFromList(list : ArrayList):ArrayList{
     
       var newSet = new HashSet(list)
       list.clear()
       list.addAll(newSet)
     return list
   }
      
      
   
   /**
    * Converts text from LSS webservice proper format for UI display.
    * 
    * Some strings from XML enumerations sent through the webservice are
    * received in all CAPS with underscores in place of spaces.
    * 
    * @param String to convert.
    * @return Converted string.
    */
   public function convertStringForDisplay(string : String) :String{    
      var space = " "
      var displayString : String = ""
      
      //remove underscores
      var stringArray :String[] =  string.replace("_", " ").split(" ")
      //Capitalize each word in the string array      
      for(str in stringArray){
       str = str.substring(0,1).toUpperCase() + str.substring(1).toLowerCase() 
       displayString = displayString + str + space
      }       
       return displayString
    }     
    
 
    
    /**
     * Gets valid values for for the list of claimant/feature combinations on DispositionDV.pcf
     * 
     * @return Valid list of claimant/feature combinations.
     */
    property get ValidAssignmentExposuresForDisposition():AssignmentExposureExt[]{
    
      return _assignment.AssignmentExposuresExt
                 .where(\ a ->a.Assignment.MatterAssignmentStatusExt != typekey.MatterAssignmentStatus.TC_DECLINED)   
    }  
  
  
  
  /**
   * Gets Billing address location string for display only
   * on the counseltab of MatterDetailDV.pcf
   * 
   * @return Error string if validation fails.
   */
  property get BillingAddress(): Address {
  
     //If there is a billing address return that address else return tax address or null
     if(exists(address in _assignment.CounselLawFirmExt.AllAddresses where
        address.AddressType == AddressType.TC_BILLING)){
         
          return  _assignment.CounselLawFirmExt.AllAddresses
          .firstWhere(\ a -> a.AddressType == AddressType.TC_BILLING)          
          
        }else if (exists(address in _assignment.CounselLawFirmExt.AllAddresses where
          address.AddressType == AddressType.TC_TAX)){              
          
          return  _assignment.CounselLawFirmExt.AllAddresses
          .firstWhere(\ a -> a.AddressType == AddressType.TC_TAX) 
          
        }else{
            return null
        }
  }
  
  
  
  /**
   * Validates Billing Share field on MatterDetailDV.pcf
   * 
   * @return Error string if validation fails.
   */
  function validateBillingShare():String{ 
      
     if(_assignment.BillSharePrctExt != null){       
       if(_assignment.BillSharePrctExt.toString().matches("[1-9][0-9]|[1][0][0]|[1-9]")){          
          var billShare = java.lang.Integer.parseInt(_assignment.BillSharePrctExt)
                    
          if(billShare > 100 || billShare < 1){
              return displaykey.Validator.BillingSharePercent.trim()
          }
       }else{
         return displaykey.Validator.BillingSharePercent.trim()  
       }    
     }else{ 
         return displaykey.Validator.BillingSharePercent.trim()         
     }
     return null
  }
  
  
  
  /**
   * Gets the assignment title line for display on DispositionDV.pcf
   * 
   * @return Title for the disposition line items on DispositionDV.pcf
   */
   property get AssignmentTitleLineDisplay(): String {
     
     if(_assignment.CounselLawFirmExt != null && _assignment.AttorneyTypeExt != null){
         return "Assignment:  " + _assignment.CounselLawFirmExt + " - " + _assignment.AttorneyTypeExt.DisplayName
     }else {
       return "Assignment:  "
     }   
   } 

  function validateContingencyPercentage():String{ 
      
     if(_assignment.ContingencyPct != null){       
       if(_assignment.ContingencyPct.toString().matches("[1-9][0-9]|[1][0][0]|[0-9]")){          
          var contPercentage = java.lang.Integer.parseInt(_assignment.ContingencyPct)
                    
          if(contPercentage > 100 || contPercentage < 0){
              return displaykey.Validator.ContingencyPercentage
          }
       }else{
         return displaykey.Validator.ContingencyPercentage
       }    
     }else{ 
         return displaykey.Validator.ContingencyPercentage        
     }
     return null
  }

 function resetContPercentage() {
   if(_assignment.WorkOnContingency == false){
     _assignment.ContingencyPct = null
   }
 }
 
 function staffAndBudgetRequired() {
   if(_assignment.WorkOnContingency == true){
     _assignment.StaffBudgetRequiredExt = false
     _assignment.DefenseAcceptedDate = java.util.Date.CurrentDate
   }
 }
 


}//End AssignmentUIHelper