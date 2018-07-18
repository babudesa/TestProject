
package gaic.webservice.cc
uses gw.api.util.DateUtil

@WebService
class ClaimAPI {
  function getClaimByPublicID(publicID : String) : Claim {
    return find (c in Claim where c.PublicID == publicID).AtMostOneRow
  }
  
  function getAssignedAdjuster(exp : Exposure) : String {
    var fullExposure = find(e in Exposure where e.PublicID == exp.PublicID).AtMostOneRow
    return (fullExposure.AssignedUser != null) ? fullExposure.AssignedUser.PublicID : null;
  }
  
  /** Get the claim business unit */
  function getClaimBU(publicID : String):String{
   var clm = getClaimByPublicID(publicID);
     var defaultValue = "Corporate Claims";
    var group : Group;


      group = clm.AssignedGroup;
     
    if (group == null)
      return defaultValue
    
    do {
      var type = group.GroupType
      /** Return the group name if the GroupType is of branch office or business unit */
      if (type == "branchoffice" || type == "busunit" || type == "nonclaimsbusunit") {
        return group.Name
      }
      group = group.Parent
    }
    while(group != null)
    /** If we didn't have a group which was a branchoffice or business unit return "SCO" */
    return defaultValue
  
  }  
  function createISOMatchReportActivity(claimPublicID : String, documentPublicID : String) { 
    
    var claim = find(c in Claim where c.PublicID == claimPublicID).AtMostOneRow
    var document = find(d in Document where  d.PublicID == documentPublicID).AtMostOneRow
    
    if(claim.LossType == LossType.TC_SPECIALTYES ) {    
      if(claim.AssignmentStatus == AssignmentStatus.TC_ASSIGNED && claim.IncidentReport == false &&
        claim.State != ClaimState.TC_CLOSED && claim.State!= ClaimState.TC_DRAFT 
        && claim.LoadCommandID == null && !claim.checkDisconnectedFeatures()) {
                
          var bundle = gw.transaction.Transaction.getCurrent();
          bundle.add(claim); 
          var pattern = util.custom_Ext.finders.findActivityPattern("iso_match_received_spec")
          var newAct = claim.createActivity(null,
                     pattern, pattern.Subject, pattern.Description, pattern.Priority, pattern.Mandatory, null, null)
          newAct.AssignedUser = claim.AssignedUser
          //set custom target date 
          newAct.TargetDate = DateUtil.currentDate().trimToMidnight()
          newAct.addLinkedDocument(document)
          bundle.commit()
          
      }
    }
  }
  
  
    /**
   * Given the claim number returns the value selected for the claim
   * from the LSS Admin Screen for Enable LitAdvisor Fees?
   * 
   * @param id the claim number
   * @return should we generate LitAdvisor fees for this claim
   */
  function generateLitAdvisorFees(claimNumber : String) : Boolean {
    var claimToCheck : Claim = find (c in Claim where c.ClaimNumber == claimNumber).AtMostOneRow 
    // Defect # 8910
    //The LitAdvisor monthly deployment for MR85 was not validated prior deploying; 
    //subsequent production error messages generated.
    if(claimToCheck!=null){
    var lssAdminValue : LSSAdminExt = find (l in LSSAdminExt where l.LossTypeExt == claimToCheck.LossType).AtMostOneRow        
    return lssAdminValue.EnableLitAdvisorFees
    }
    else
    return false
  }
  
    
  function shouldMarkCheckReturnToOffice(claimPublicID : String) : boolean {
    return false
  }
 
}//End ClaimAPI
