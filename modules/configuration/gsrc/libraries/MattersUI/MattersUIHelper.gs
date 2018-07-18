package libraries.MattersUI

/*
*  The MattersUIHelper class contains functions used by the matters related 
*  user interface screens.
*/
class MattersUIHelper {

  private var _matter : Matter
  private var _updatePressed : boolean 
  private var _isWCLossType : boolean
  
  construct(matter : Matter) {
    this._matter = matter 
    this._updatePressed = false   
    this._isWCLossType = util.WCHelper.isWCLossType(_matter.Claim)   
  }
  
  
   /*
   * Initialize any standard default values on a newly created matter. Used in the new matter
   * page in the claim file
   */   
  function setInitialValues() {
    _matter.ValidationLevel = "newloss";
    _matter.StatusExt = typekey.MatterStatus.TC_OPEN
    if(_matter.Claim.Exposures.where(\ x -> x.ex_InSuit==true).HasElements){
      _matter.MatterType="Litigated"
    } else {
      _matter.MatterType="NonLitigated"
    }
  }  

 
 /*
 * Property stores valid values for the mediator dropdown from parties
 * involved /claim contacts
 */ 
  property get ValidPartiesInvolvedForMediator():Contact[]{
    
    return _matter.Claim.Contacts*.Contact.where(\ c -> typeof c == Attorney ||
                typeof c == Ex_ForeignPerVndrAttny || typeof c == LawFirm ||
                typeof c == Ex_ForeignCoVenLawFrm || typeof c == PersonVendor ||
                typeof c == CompanyVendor ||
                typeof c == Ex_ForeignPersonVndr ||
                typeof c == Ex_ForeignCoVendor ) 
  }
  
 /*
 * Property stores valid values for for the list of claimant/feature combinations
 * on the disposition screen
 */ 
  property get ValidAssignmentExposuresForDisposition():AssignmentExposureExt[]{
    
    return _matter.MatterAssignmentsExt*.AssignmentExposuresExt
               .where(\ a ->a.Assignment.MatterAssignmentStatusExt != typekey.MatterAssignmentStatus.TC_DECLINED) 
  }
  
   
 
 /*
 * Property stores valid values for for the dropdown list of Disposition types 
 * on the disposition screen. 
 */ 
  property get ValidDispositionTypes(): DispositionTypeExt[]{
    
     if(_matter.MatterType == typekey.MatterType.TC_LITIGATED){
         return typekey.DispositionTypeExt.TF_LITIGATED.TypeKeys.toTypedArray()
     }else {
         return typekey.DispositionTypeExt.getTypeKeys(false).toTypedArray()
      }
  }
  
  
  
 
 /*
  * Function creates a new matter Assignment and adds one empty row of 
  * in the claimant listview of the MatterDetailsDV.pcf
  * 
  * Defect 8071 - 12.9.15 - cmullin - added code to set the default StaffBudgetRequiredExt value to false for WC claims when
  * Case Type == TC_WORKERSCOMPANDOCCACC. This must be set here, when the new MatterAssignmentExt is created, in the 
  * case where Case Type has been set to TC_WORKERSCOMPANDOCCACC before any Matter Assignment has been created. There is
  * also an onChange function setStaffingPlan() (below) used for Case Type field on JurisdictionLitigationStatusDV.WORKCOMP 
  * which sets StaffBudgetRequiredExt to false if there are existing Matter Assignments and the Case Type value is changed 
  * to TC_WORKERSCOMPANDOCCACC. 
  */
  function createMatterAssignment():MatterAssignmentExt{
    
    var newAssignment = new MatterAssignmentExt()
    if(_matter.CaseTypeExt==CaseTypeExt.TC_WORKERSCOMPANDOCCACC && _isWCLossType){ // Added for Defect 8071
      newAssignment.StaffBudgetRequiredExt = false
      newAssignment.DefenseAcceptedDate = java.util.Date.CurrentDate
    }
    newAssignment.addToAssignmentExposuresExt(new AssignmentExposureExt())
    _matter.addToMatterAssignmentsExt(newAssignment)
    return newAssignment
  }
  
  
 /*
  * Defect 8071 - 12.9.15 - cmullin - onChange function used to set StaffBudgetRequiredExt value during the New Legal
  * Action / New Matter Assignment process, when the Matter Assignment is created by clicking the Counsel tab, and while
  * the Case Type might still be null. This function changes the StaffBudgetRequiredExt value on the new Matter 
  * Assignment only, and not on any prior, saved Matter Assignments.
  */

  function setStaffBudgetRequired(){
    if(_matter.CaseTypeExt==CaseTypeExt.TC_WORKERSCOMPANDOCCACC && _isWCLossType){
      for(each in _matter.MatterAssignmentsExt){
        if(each.New){
          each.StaffBudgetRequiredExt = false
          each.DefenseAcceptedDate = java.util.Date.CurrentDate
        }
      }
    }
  }

  
  /*
  * Functions resets the required fields for 
  * Is this a Coverage or Extra-Contractual Suit?  when
  * the value is false. Used on JurisdictionLitigationStatusDV.pcf
  */
  function resetExtraContractual(){  
    if(_matter.CoverageOrExtraContractSuitExt == false){
    
      _matter.GAICompanyRoleExt = null
      _matter.ExtraContractualAllegationExt = false
      _matter.OnlyECAllegationExt = false
      _matter.ReportedToCorpLegalExt = false
      _matter.CorporateLegalRepresentative = null
      _matter.KeyCoverageIssues = null
      _matter.IssuesSummary = null    
    }
  }
  
    
  
  /*
  * Function closes the matter. Used on MatterDetailsScreen.pcf
  * and ClaimMatters.pcf
  */
  function initiateCloseMatter(){
    
      _matter.close(null, null)
      _matter.commit()
  }

  
  /*
  * Function reopens the matter. Used on MatterDetailsScreen.pcf
  */
  function initiateReopenMatter(){
    _matter.reopen(null, null)
    _matter.StatusExt = MatterStatus.TC_OPEN
    _matter.commit()

  }  
  
  
  
    
  
  function beforeCommit(){
     this._updatePressed = true
      if(!this.areFieldsRequired() && !_matter.MatterAssignmentsExt.IsEmpty){
          
         var onlyAssignment = _matter.MatterAssignmentsExt.first() 
            
             //remove blank assignment
             onlyAssignment.remove()      
                          
      }        
   }
   
   
   
   
   /**
   * Checks to see if the fields on MatterDetailsDV.pcf are required.
   * 
   * The function is used to set the required fields dynamically.  This allows 
   * the user to leave the assignment screen blank and save the legal action. If
   * the assignment is blank the system will remove the empty assignment before
   * the commit.
   * 
   * @return Are fields required.
   */
  function areFieldsRequired() : boolean {
      
      if(_matter.MatterAssignmentsExt.Count == 1 && this._updatePressed && _matter.New){
      
          var onlyAssignment = _matter.MatterAssignmentsExt.first()
          
          if((onlyAssignment.OriginalVersion as MatterAssignmentExt).BeanVersion == null &&
              onlyAssignment.ChangedFields.Count == 2 && onlyAssignment.isFieldChanged("AssignmentExposuresExt")
              && onlyAssignment.isFieldChanged("Matter") &&
              !exists(ae in onlyAssignment.AssignmentExposuresExt where ae.ClaimantExt != null || ae.Exposure != null ||
                       ae.OpposingCounselFirmExt != null || ae.OpposingLeadCounselExt != null)){ 
                                       
                   this._updatePressed = false     
                   return false                           
          }      
      }else if(_matter.MatterAssignmentsExt.IsEmpty){
          return false   
      }      
     return true
  
  }
   
  function litigationDatesAvailable() : boolean {
    if(_matter.MatterType!= typekey.MatterType.TC_NONLITIGATED or util.WCHelper.isWCLossType(_matter.Claim)){
      return true
    }else{
      return false
    }
  }
}
