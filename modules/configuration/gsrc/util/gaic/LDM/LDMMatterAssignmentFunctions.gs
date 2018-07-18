package util.gaic.LDM
uses java.util.ArrayList


/**
* This class performs the functions to check for changes to the MatterAssignmentExt
* entity.
* 
* @author kepage
* @since 2013-01-22
*/
class LDMMatterAssignmentFunctions {

    private var assignmentExpoF = LDMFunctionsFactory.getAssignmentExposureFunctions()
  
    private construct() {

    }
    
    
    /**
    * Gets a new instance of the LDMMatterAssignmentFunctions class.
    * 
    * @return a new instance of LDMMatterAssignmentFunctions class.
    */
    static function getInstance() : LDMMatterAssignmentFunctions {
        return new LDMMatterAssignmentFunctions();
    }  

  
    /**
    * Returns true if the MatterAssignmentExt entity has changed.
    * 
    * @param assignment MatterAssignmentExt entity to check for changes.
    * @return changed status of the MatterAssignmentExt entity.
    */
    protected function assignmentChanged(assignment : MatterAssignmentExt) : boolean {
      
        if(this.matterAssignmentFieldChanged(assignment)){
              return true;
        }else{
            return false
        }     
    }  
  
  
    /**
    * Checks to see if specific fields have changed on the MatterAssignmentExt entitiy.
    * 
    * @param assignment the MatterAssignmentExt entity to check for changes.
    * @return changed status of the MatterAssignmentExt entity.
    */
    private function matterAssignmentFieldChanged(matterAssignment : MatterAssignmentExt) : boolean {
         var fields = new String[] {"LeadCounselExt", "CounselLawFirmExt", "AttorneyTypeExt", "BillSharePrctExt",
         "MatterAssignmentStatusExt", "PreTrialReportReceivedDate", "InitlCaseAssessmentRcvdDate", "StatusExt", "LSSMatterID", 
         "DefenseApptDate", "PreTrialReportDueDate", "InitlCaseAssessmentDueDate", "DefenseAcceptedDate", "WorkOnContingency",
          "ContingencyPct", "CounselBillingAddressExt", "StaffBudgetRequiredExt"};    
     
        if (util.gaic.CommonFunctions.fieldFromListChanged(matterAssignment, fields)) {
            return true;
        }else{
            return false
        }
    }
    
    /**
    * Finds any changed Claimant Contact entities on a specific MatterAssignmentExt entity
    * 
    * @param assignment MatterAssignmentExt entity to check.
    * @return the added Contact entities.
    */
    protected function getChangedMatterAssignmentClaimants(ma : MatterAssignmentExt) : ArrayList<Contact>{
         var contacts = new ArrayList<Contact>()
         var fields = new String[] {"OpposingCounselFirmExt", "OpposingLeadCounselExt", "ClaimantExt"}
     
         for(ae in ma.AssignmentExposuresExt){
           var originalAssignment = ae.Assignment.OriginalVersion as MatterAssignmentExt
           if(util.gaic.CommonFunctions.fieldFromListChanged(ae, fields) || ae.Assignment.LSSMatterID != originalAssignment.LSSMatterID){
             contacts.add(ae.ClaimantExt)
           }
         }
         return contacts 
    }
  
    /**
    * Finds any added AssignmentExposureExt entities on a specific MatterAssignmentExt entity
    * 
    * @param assignment MatterAssignmentExt entity to check for added AssignmentExposureExt entities.
    * @return the added AssignmentExposureExt entities.
    */
    protected function getNewAssignmentExposures(assignment : MatterAssignmentExt) : ArrayList<AssignmentExposureExt>{
         var originalAssignment = assignment.OriginalVersion as MatterAssignmentExt
         var newAssignmentExpos = new ArrayList<AssignmentExposureExt>()
     
         for(assignmentExpo in assignment.AssignmentExposuresExt){       
             if(!exists(ae in originalAssignment.AssignmentExposuresExt where ae.ID == assignmentExpo.ID)){                 
                 newAssignmentExpos.add(assignmentExpo)
             }
         }        
         return newAssignmentExpos 
    }
  
  
    /**
    * Finds any deleted AssignmentExposureExt entities on a specific MatterAssignmentExt entity
    * 
    * @param assignment MatterAssignmentExt entity to check for deleted AssignmentExposureExt entities.
    * @return the deleted AssignmentExposureExt entities.
    */
    protected function getDeletedAssignmentExposures(assignment : MatterAssignmentExt) : ArrayList<AssignmentExposureExt>{
         var originalAssignment = assignment.OriginalVersion as MatterAssignmentExt
         var deletedAssignmentExpos = new ArrayList<AssignmentExposureExt>()
     
         for(assignmentExpo in originalAssignment.AssignmentExposuresExt){       
             if(!exists(ae in assignment.AssignmentExposuresExt where ae.ID == assignmentExpo.ID)){                 
                 deletedAssignmentExpos.add(assignmentExpo)
             }
         }        
         return deletedAssignmentExpos
    }
  
  
    /**
    * Finds any changed AssignmentExposureExt entities on a specific MatterAssignmentExt entity
    * 
    * @param assignment MatterAssignmentExt entity to check for changed AssignmentExposureExt entities.
    * @return the changed AssignmentExposureExt entities.
    */
    protected function getChangedAssignmentExposures(assignment : MatterAssignmentExt) : ArrayList<AssignmentExposureExt>{       
         var changedAssignmentExpos = new ArrayList<AssignmentExposureExt>()
     
         for(assignmentExpo in assignment.AssignmentExposuresExt){       
             if(!assignmentExpo.New && (assignmentExpoF.assignmentExpoChanged(assignmentExpo) || assignmentExpo.OpposingCounselFirmExt.Changed || assignmentExpo.OpposingLeadCounselExt.Changed))  {                 
                 changedAssignmentExpos.add(assignmentExpo)
             }
         }               
         return changedAssignmentExpos
    }
  
  
}//End LDMMatterAssignmentFunctions class
