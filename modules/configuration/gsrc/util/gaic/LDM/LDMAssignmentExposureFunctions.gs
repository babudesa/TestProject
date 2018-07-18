package util.gaic.LDM
uses java.util.ArrayList

/**
* This class performs the functions to check for changes to the AssignmentExposureExt 
* entity.
* 
* @author kepage
* @since 2013-01-22
*/
class LDMAssignmentExposureFunctions {

    private construct() {

    }
    
  
    /**
    * Gets a new instance of the LDMAssignmentExposureFunctions class.
    * 
    * @return a new instance of LDMAssignmentExposureFunctions class.
    */
    static function getInstance() : LDMAssignmentExposureFunctions {
        return new LDMAssignmentExposureFunctions();
    }

    
    /**
    * Returns true if the AssignmentExposureExt entity has changed.
    * 
    * @param assignmentExpo AssignmentExposureExt entity to check for changes.
    * @return changed status of the AssignmentExposureExt entity.
    */
    function assignmentExpoChanged(assignmentExpo : AssignmentExposureExt) : boolean {
    
        if(this.assignmentExpoFieldChanged(assignmentExpo)){
            return true;
        }else{
            return false
        }    
    }
  
    
    /**
    * Checks to see if specific fields have changed on the AssignmentExposureExt entitiy.
    * 
    * @param assignmentExpo AssignmentExposureExt entity to check for changes.
    * @return changed status of the AssignmentExposureExt entity.
    */
    private function assignmentExpoFieldChanged(assignmentExpo : AssignmentExposureExt) : boolean {
         var fields = new String[] {"ClaimantExt","Exposure","DispositionDateExt", "DispositionTypeExt","OpposingCounselFirmExt",
         "OpposingLeadCounselExt"};
         
        if (util.gaic.CommonFunctions.fieldFromListChanged(assignmentExpo, fields)) {
            return true;
        }else{
            return false
        }
    }
    
    
    /**
    * Finds any newly added features on the AssignmentExposureExt entity array of a 
    * specific MatterAssignmentExt entity
    * 
    * @param assignment MatterAssignmentExt entity to check for added features.
    * @return the new Features added to the MatterAssignmentExt entity.
    */
    protected function getNewFeatures(assignment : MatterAssignmentExt) : ArrayList<AssignmentExposureExt> {
        var originalAssignment = assignment.OriginalVersion as MatterAssignmentExt 
        var newFeatures = new ArrayList<AssignmentExposureExt>()      
   
         for(assignmentExpo in assignment.AssignmentExposuresExt){     
             if(!exists(ae in originalAssignment.AssignmentExposuresExt where ae.Exposure == assignmentExpo.Exposure)){               
                  newFeatures.add(assignmentExpo)
             }
         }      
         return newFeatures
    }  
    
        /**
    * Finds any newly added features on the AssignmentExposureExt entity array of a 
    * specific Matter entity
    * 
    * @param matter Matter entity to check for added features.
    * @return the new Features added to the MatterAssignmentExt entity.
    */
    protected function getNewFeatures(matter : Matter) : ArrayList<AssignmentExposureExt> {
        var originalMatter = matter.OriginalVersion as Matter 
        var newFeatures = new ArrayList<AssignmentExposureExt>()      
   
         for(assignmentExpo in matter.MatterAssignmentsExt*.AssignmentExposuresExt){     
             if(!exists(ae in originalMatter.MatterAssignmentsExt*.AssignmentExposuresExt where ae.Exposure == assignmentExpo.Exposure)){               
                  newFeatures.add(assignmentExpo)
             }
         }      
         return newFeatures
    }  
    
  
    /**
    * Finds any changed features on the AssignmentExposureExt entity array of a 
    * specific MatterAssignmentExt entity
    * 
    * @param assignment MatterAssignmentExt entity to check for deleted features.
    * @return the Exposures deleted from the MatterAssignmentExt entity.
    */
    protected function getChangedFeatures(assignment : MatterAssignmentExt) : ArrayList<AssignmentExposureExt> {
        var originalAssignment = assignment.OriginalVersion as MatterAssignmentExt 
        var fields = new String[] {"OpposingCounselFirmExt","OpposingLeadCounselExt","ClaimantExt", "DispositionDateExt", "DispositionTypeExt"};
        
        var changedFeatures = new ArrayList<AssignmentExposureExt>()
       
         for(assignmentExpo in assignment.AssignmentExposuresExt){
           if(exists(ae in originalAssignment.AssignmentExposuresExt where ae.Exposure == assignmentExpo.Exposure)){
             //var originalExposure = assignmentExpo.Exposure
             if(util.gaic.CommonFunctions.fieldFromListChanged(assignmentExpo, fields) || assignmentExpo.Exposure.isFieldChanged("State") 
               || assignmentExpo.Assignment.LSSMatterID != originalAssignment.LSSMatterID || assignment.Matter.isFieldChanged("ClaimantRepDateExt")){           
                changedFeatures.add(assignmentExpo)
             }  
           } 
         }
         return changedFeatures 
    }      
    
    
    /**
    * Finds any changed features on the AssignmentExposureExt entity array of a 
    * specific Matter entity
    * 
    * @param matter Matter entity to check for deleted features.
    * @return the Exposures deleted from the MatterAssignmentExt entity.
    */
    protected function getChangedFeatures(matter : Matter) : ArrayList<AssignmentExposureExt> {
        var originalMatter = matter.OriginalVersion as Matter
        var fields = new String[] {"OpposingCounselFirmExt","OpposingLeadCounselExt","ClaimantExt", "DispositionDateExt", "DispositionTypeExt"};
        
        var changedFeatures = new ArrayList<AssignmentExposureExt>()
       
         for(assignmentExpo in matter.MatterAssignmentsExt*.AssignmentExposuresExt){
           if(exists(ae in originalMatter.MatterAssignmentsExt*.AssignmentExposuresExt where ae.Exposure == assignmentExpo.Exposure)){
             //var originalExposure = assignmentExpo.Exposure
             //Defect # 8893
             //A new transaction came in on a Add Legal Action that didn't have claimant data on it.  This caused an LDM push error. 
             var originalAssignment = assignmentExpo.Assignment.OriginalVersion as MatterAssignmentExt
             if(util.gaic.CommonFunctions.fieldFromListChanged(assignmentExpo, fields) || assignmentExpo.Exposure.isFieldChanged("State")
              || assignmentExpo.Assignment.LSSMatterID != originalAssignment.LSSMatterID || assignmentExpo.Assignment.Matter.isFieldChanged("ClaimantRepDateExt")){          
                changedFeatures.add(assignmentExpo)
             }  
           } 
         }
         return changedFeatures 
    }      
  
    /**
    * Finds any removed features on the AssignmentExposureExt entity array of a 
    * specific MatterAssignmentExt entity
    * 
    * @param assignment MatterAssignmentExt entity to check for deleted features.
    * @return the Exposures deleted from the MatterAssignmentExt entity.
    */
    protected function getDeletedFeatures(assignment : MatterAssignmentExt) : ArrayList<AssignmentExposureExt> {
        var originalAssignment = assignment.OriginalVersion as MatterAssignmentExt 
        var deletedFeatures = new ArrayList<AssignmentExposureExt>()
       
         for(assignmentExpo in originalAssignment.AssignmentExposuresExt){       
             if(!exists(ae in assignment.AssignmentExposuresExt where ae.Exposure == assignmentExpo.Exposure)){                 
                deletedFeatures.add(assignmentExpo)
             }
         }
         return deletedFeatures 
    }    

    /**
    * Finds any removed features on the AssignmentExposureExt entity array of a 
    * specific Matter entity
    * 
    * @param matter Matter entity to check for deleted features.
    * @return the Exposures deleted from the MatterAssignmentExt entity.
    */
    protected function getDeletedFeatures(matter : Matter) : ArrayList<AssignmentExposureExt> {
       // var originalMatter = matter.OriginalVersion as Matter 
        var deletedFeatures = new ArrayList<AssignmentExposureExt>()
        
        for(ma in matter.MatterAssignmentsExt){
          var originalAssignment = ma.OriginalVersion as MatterAssignmentExt
       
          for(assignmentExpo in originalAssignment.AssignmentExposuresExt){       
             if(!exists(ae in ma.AssignmentExposuresExt where ae.Exposure == assignmentExpo.Exposure)){                 
                deletedFeatures.add(assignmentExpo)
             }
         }
       
        }
  
         return deletedFeatures 
    }   

  
}//End LDMAssignmentExposureFunctions