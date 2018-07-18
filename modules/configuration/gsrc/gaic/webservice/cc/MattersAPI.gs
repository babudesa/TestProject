package gaic.webservice.cc
uses gaic.webservice.cc.util.MattersUtil

@WebService
class MattersAPI {
  
  
  function sendStaffingPlan(LSSmatterID : String, plan : StaffingPlanExt) : String {
    if (MattersUtil.invalidMatterID(LSSmatterID)) return "invalidMatterID"
    var mat : MatterAssignmentExt = find (matAssgn in MatterAssignmentExt where matAssgn.LSSMatterID == LSSmatterID).AtMostOneRow
    if (mat == null) return "matterNotFound";
    if (mat.StatusExt.equals(AssignmentStatusExt.TC_CLOSED)) return "matterClosed";
    var bundle = gw.transaction.Transaction.getCurrent();
    bundle.add(mat); 
    mat.StaffingPlanExt = plan
    
   //set leadcounsel from LSS
    var leadAttorney = plan.TimekeeperExt.where(\ t -> t.LeadAttorney == true)     
    this.createLeadCounsel(leadAttorney, mat)      
        
    bundle.commit();
    return "success"
  }
  
  function sendBudget(LSSmatterID : String, budget : BudgetExt) : String {
    if (MattersUtil.invalidMatterID(LSSmatterID)) return "invalidMatterID"
    var mat : MatterAssignmentExt = find (matAssgn in MatterAssignmentExt where matAssgn.LSSMatterID == LSSmatterID).AtMostOneRow
    if (mat == null) return "matterNotFound";
    if (mat.StatusExt.equals(AssignmentStatusExt.TC_CLOSED)) return "matterClosed";
    var bundle = gw.transaction.Transaction.getCurrent();
    bundle.add(mat);
    mat.BudgetExt = budget;
    bundle.commit();
    return "success"
  }
  
  function sendAttorneyAssignmentStatus(LSSmatterID : String, acceptanceStatus : String) : String {
    if (MattersUtil.invalidMatterID(LSSmatterID)) return "invalidMatterID"
    var mat : MatterAssignmentExt = find (matAssgn in MatterAssignmentExt where matAssgn.LSSMatterID == LSSmatterID).AtMostOneRow
    if (mat == null) return "matterNotFound";
    if (mat.StatusExt.equals(AssignmentStatusExt.TC_CLOSED)) return "matterClosed";
    var bundle = gw.transaction.Transaction.getCurrent();
    bundle.add(mat);
    
    mat.MatterAssignmentStatusExt = MatterAssignmentStatus.get(acceptanceStatus)
    
    //set defense accepted date to now if accepted else blank
    if (mat.MatterAssignmentStatusExt == MatterAssignmentStatus.TC_ACCEPTED){
        mat.DefenseAcceptedDate = now() as java.util.Date
    }else{
        mat.DefenseAcceptedDate = null
    }
    
    
    bundle.commit();
    return "success"
  } 
  
  
  
  
    
  /**
  * Creates a lead counsel contact from LSS
  */
  private function createLeadCounsel(leadAttorney:TimekeeperExt[], mat :MatterAssignmentExt){
      
      if(!leadAttorney.IsEmpty)
      {
           
           var name : String[] = leadAttorney.first().TimekeeperName.split(" ")
           var contactFound = false
           
           //If we receive a lead counsel without a middle initial           
           if((name.length == 2)) {             
                                                    
               //search claim contacts for existing match       
               for(c in mat.UIHelper.ValidPartiesInvolvedForLeadCounsel)
               {
                 
                     //if existing contact is found set that contact as lead counsel
                    if((typeof c == Attorney || typeof c == Ex_ForeignPerVndrAttny)
                        and ((c as Attorney).FirstName == name[0]
                        and (c as Attorney).LastName == name[1]))
                    {     
                        mat.LeadCounselExt = c
                        mat.LeadCounselFromLSS = true
                        contactFound = true       
                        break
                        
                    }else if((typeof c == LawFirm || typeof c == Ex_ForeignCoVenLawFrm)
                          and((c as LawFirm).Name == name.toString())){
                      
                      mat.LeadCounselExt = c
                      mat.LeadCounselFromLSS = true
                      contactFound = true       
                      break    
                 }
             }        

             //if an existing contact was not found then create a new claim contact
             // and set as lead counsel 
             if(contactFound == false){   
                  var newContact = new Attorney()              
                  newContact.FirstName = name[0]
                  newContact.LastName = name[1]
                  mat.Matter.Claim.createClaimContact(newContact)            
                  mat.LeadCounselExt = newContact
                  mat.LeadCounselFromLSS = true   
             } 
          
          //if name received from LSS has a middle initial
         }else if((name.length == 3)) {
 
               //search claim contacts for existing match       
               for(c in mat.UIHelper.ValidPartiesInvolvedForLeadCounsel){
                 
                  
                  if((typeof c == Attorney || typeof c == Ex_ForeignPerVndrAttny)
                      and ((c as Attorney).FirstName == name[0] and (c as Attorney).MiddleName == name[1] 
                      and (c as Attorney).LastName == name[2])){                    
                      mat.LeadCounselExt = c
                      mat.LeadCounselFromLSS = true
                      contactFound = true       
                      break
                  }else if((typeof c == LawFirm || typeof c == Ex_ForeignCoVenLawFrm)
                          and((c as LawFirm).Name == name.toString())){
                      
                      mat.LeadCounselExt = c
                      mat.LeadCounselFromLSS = true
                      contactFound = true       
                      break  
               }              
           }            
                            
          //if an existing contact was not found then create a new claim contact
          // and set as lead counsel
          if(contactFound == false){
              var newContact = new Attorney()
              newContact.FirstName = name[0]
              newContact.MiddleName = name[1]
              newContact.LastName = name[2]
              mat.Matter.Claim.createClaimContact(newContact)            
              mat.LeadCounselExt = newContact
              mat.LeadCounselFromLSS = true                   
         }                                
       }
     }
    
  }//end createLeadCounsel()
  
  
   /**
   * Sets the Initial Case Assessment Received Date on a MatterAssignmentExt entity given
   * the id. The id will be matched with the LSS matter ID or the public id.
   * 
   * @param id the publicID or LSSMatterID of the assignment.
   * @retrun the status of the webservice call.
   */
   function setInitialCaseAssessmentReceivedDate(id : String) : String {
       
       var assignment = find(ma in MatterAssignmentExt where ma.LSSMatterID == id || ma.PublicID == id).AtMostOneRow
     
       if(assignment != null){     
           assignment.InitlCaseAssessmentRcvdDate = now() as java.util.Date           
           return "success"           
       }else{
           return "assignmentNotFound"
       }
   }
   
   
   /**
   * Sets the Pre-Trial Report Received Date on a MatterAssignmentExt entity given
   * the id. The id will be matched with the LSS matter ID or the public id.
   * 
   * @param id the publicID or LSSMatterID of the assignment.
   * @retrun the status of the webservice call.
   */
   function setPreTrialReportReceivedDate(id : String) : String {
       
       var assignment = find(ma in MatterAssignmentExt where ma.LSSMatterID == id || ma.PublicID == id).AtMostOneRow
     
       if(assignment != null){     
           assignment.PreTrialReportReceivedDate = now() as java.util.Date           
           return "success"           
       }else{
           return "assignmentNotFound"
       }
   }    
 
    
      
}//End MattersAPI