package libraries.Matter_Entity

class MatterRoleHelper {

  private var _matter : Matter
  private var _mapper : AttorneyTypeMapper
  
  construct(matter : Matter) {
     _matter = matter
     _mapper = new AttorneyTypeMapper()
  }
  
  
  public function setLawFirmFormer(matterAssignment : MatterAssignmentExt){
    
    //get role to set to former
    var roleToSetFormer =  _mapper.AttorneyTypeRoleMap.get(matterAssignment.AttorneyTypeExt)
   
   // If the law firm is not null and thc contact doesn't exist
   // anywhere else on the legal action with the same role
   // then set the firms role to former 
   if(matterAssignment.CounselLawFirmExt != null
       && !exists(ma in _matter.MatterAssignmentsExt where 
                   ma.CounselLawFirmExt == matterAssignment.CounselLawFirmExt
                  && roleToSetFormer == _mapper.AttorneyTypeRoleMap.get(ma.AttorneyTypeExt) 
                  && ma.ID != matterAssignment.ID)){       
    
     //set to former role
     this.setFormerRole(roleToSetFormer, matterAssignment.CounselLawFirmExt)
   }
  }
  
  
  public function setLeadCounselFormer(matterAssignment : MatterAssignmentExt){
  
    //get role to set to former
    var roleToSetFormer =  _mapper.AttorneyTypeRoleMap.get(matterAssignment.AttorneyTypeExt)

    // If the law firm is not null and thc contact doesn't exist
    // anywhere else on the legal action with the same role
    // then set the firms role to former 
    if(matterAssignment.LeadCounselExt != null
       && !exists(ma in _matter.MatterAssignmentsExt where 
                  ma.LeadCounselExt == matterAssignment.LeadCounselExt 
                  && roleToSetFormer == _mapper.AttorneyTypeRoleMap.get(ma.AttorneyTypeExt) 
                  && ma.ID != matterAssignment.ID) 
       && !exists(ma in _matter.MatterAssignmentsExt where 
                  ma.CounselLawFirmExt == matterAssignment.LeadCounselExt 
                  && roleToSetFormer == _mapper.AttorneyTypeRoleMap.get(ma.AttorneyTypeExt))) {  
          

     //set to former role
     this.setFormerRole(roleToSetFormer, matterAssignment.LeadCounselExt)
    }
  }
  
  
  
  public function setOpposingLawFirmFormer(assignmentExposure : AssignmentExposureExt){            
        
       // If the opposing law firm is not null and thc contact doesn't exist
       // anywhere else on the legal action with the opposing counsel role
       // then set the firms role to former before removing the assignment Exposure
       if(assignmentExposure.OpposingCounselFirmExt != null 
           && !exists(ae in _matter.MatterAssignmentsExt*.AssignmentExposuresExt where
                   ae.OpposingCounselFirmExt == assignmentExposure.OpposingCounselFirmExt
                   && ae.ID != assignmentExposure.ID)
           && !exists(ae in _matter.MatterAssignmentsExt*.AssignmentExposuresExt where
                   ae.OpposingLeadCounselExt  == assignmentExposure.OpposingCounselFirmExt)) {
              
              //set former role       
              this.setFormerRole(ContactRole.TC_OPPOSINGCOUNSEL,
                                   assignmentExposure.OpposingCounselFirmExt)
       }       
  }

  
  
  public function setOpposingLeadCounselFormer(assignmentExposure : AssignmentExposureExt){
       
       // If the opposing law firm is not null and thc contact doesn't exist
       // anywhere else on the legal action with the opposing counsel role
       // then set the firms role to former before removing the assignment Exposure
       if(assignmentExposure.OpposingLeadCounselExt != null 
           && !exists(ae in _matter.MatterAssignmentsExt*.AssignmentExposuresExt where
                   ae.OpposingLeadCounselExt == assignmentExposure.OpposingLeadCounselExt
                   && ae.ID != assignmentExposure.ID)
           && !exists(ae in _matter.MatterAssignmentsExt*.AssignmentExposuresExt where
                   ae.OpposingCounselFirmExt == assignmentExposure.OpposingLeadCounselExt)){
              
              //set former role       
              this.setFormerRole(ContactRole.TC_OPPOSINGCOUNSEL,
                                   assignmentExposure.OpposingLeadCounselExt)
       }                
  } 
  
  
  //Sets the former role of the contact on the matter based on a given current role & contact
  public function setFormerRole(CCRole : ContactRole, contact: Contact ){
    try{    
      var roleToAdd = ""
      var role:ContactRole = CCRole;
      var code = role.Code.toLowerCase()
      
      //Find the current role and set the former role based on current roll
      switch ( code ){      
    
        case "consultingcounsel":
          roleToAdd = "frmrconsultingcounsel";
          break;               
        case "coveragecounsel":
          roleToAdd = "formercoveragecounsel";
          break;                 
        case "defensecounsel":
          roleToAdd = "formerdefensecounsel";
          break;   
        case "defensecounselcumis":
          roleToAdd = "frmrdefcounselcumis";
          break;   
        case "defensecounselmonitor":
          roleToAdd = "frmrdefcounselmonitor";
          break;             
         case "recoverycounsel":
          roleToAdd = "formerrecoverycounsel";
          break;
         case "mediator":
          roleToAdd = "formermediator";
          break;
         case "insuredpersoncounsel":
          roleToAdd = "frmrinsdpersoncounsel";
          break;   
         case "opposingcounsel":
           roleToAdd = "formeropposingcounsel"
           break;
           case "monitoringcounsel":
           roleToAdd = "frmmonitoringcounsel"
           break;
      }
                
      //If former role is not null then add former role to contact on the matter and remove related current role
      if( roleToAdd != "" ){     
        _matter.addRole(roleToAdd, contact )
        _matter.removeRole(CCRole, contact)
      }

    }
    catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( this, "Class Extensions - Matter - MatterRoleFunctions", e, "Error in method setFormerRole" )  
    }   
  
  }

   
  
  //Removes the former role of contact on the matter based on a given former role & contact
  public function removeFormerRole(CCRole :ContactRole, contact: Contact ){
    try{    
      var roleToRemove = ""
      var role:ContactRole = CCRole
      var code = role.Code.toLowerCase()

      //Find the current role and set the former role based on current roll
      switch ( code ){      
    
        case "consultingcounsel":
          roleToRemove = "frmrconsultingcounsel";
          break;               
        case "coveragecounsel":
          roleToRemove= "formercoveragecounsel";
          break;                 
        case "defensecounsel":
          roleToRemove = "formerdefensecounsel";
          break;   
        case "defensecounselcumis":
          roleToRemove = "frmrdefcounselcumis";
          break;   
        case "defensecounselmonitor":
          roleToRemove = "frmrdefcounselmonitor";
          break;             
         case "recoverycounsel":
          roleToRemove = "formerrecoverycounsel";
          break;
         case "mediator":
          roleToRemove = "formermediator";
          break;
         case "insuredpersoncounsel":
          roleToRemove= "frmrinsdpersoncounsel";
          break;   
         case "opposingcounsel":
           roleToRemove = "formeropposingcounsel"
           break;
           case "monitoringcounsel":
             roleToRemove = "frmmonitoringcounsel"
           break;
      }
                
      //If role to remove is not null then remove former role from the contact 
        if( roleToRemove != "" ){        
        _matter.removeRole(roleToRemove, contact)       
      }

    }
    catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( this, "Class Extensions - Matter - MatterRoleFunctions", e, "Error in method removeFormerRole" )  
    }   
  
  }
  
  

}
