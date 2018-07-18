package libraries.TransactionSet_Entity
uses java.util.ArrayList

enhancement TransactionSetExtensions : entity.TransactionSet {
  public function getLastApprovingGroup():Group
  {
    var lastActivity:Activity
    lastActivity=Null
  
    for (act in this.Claim.Activities)
    {
      if (act.TransactionSet==this and act.Status=="complete" and act.Approved and act.CloseDate>lastActivity.CloseDate)
      {
        lastActivity=act
      }
    }
    return lastActivity.AssignedGroup
  }

  public function getLastApprovingUserExt():User
  {
    var lastActivity:Activity
    lastActivity=Null
  
    for (act in this.ApprovalHistory)
    {
      if (lastActivity == Null)
      {
        lastActivity= act as Activity
      }
      if ((act as Activity).Status=="complete" and (act as Activity).Approved and (act as Activity).CloseDate>lastActivity.CloseDate)
      {
        lastActivity= act as Activity
      }
    }
    return lastActivity.UpdateUser
  }

  /*Reject any pending Reserves if final payment is recieved 1/16/08 Def 483*/
  function removePendingReserves() : void {
    for(trans in this.Transactions){
      var pay = trans as Payment;

      if(pay.PaymentType == "final" and
       (pay.Status == "awaitingsubmission" or pay.Status == "submitted" or pay.Status == "submitting")){
        for(act in this.Claim.Activities){
          if(act.Status ==  "open" and act.ActivityPattern == util.custom_Ext.finders.findActivityPattern("approve_reserve_change")
           and act.Exposure == pay.Exposure){
             if(act.AssignedUser == User.util.CurrentUser){
               act.ApprovalRationale ="Final Payment received.";
             }
             act.reject();
          }
        }
      }
    }
  }

  /*zthomas - 1/16/2009 - Defect 1600, Determine if TransactionSet contains Exposures with different Assigned Users*/
  function hasDifferentOrNoExpOwners():Boolean{
    var result:Boolean = false;
    for(exp in this.Exposures){
      for(exp2 in this.Exposures){
        if(exp.AssignedUser != exp2.AssignedUser){
          result = true;
          break;
        }
      }
      if(result){
        break;
      }
    }
    if(!result){
      if(!exists(exp in this.Exposures where exp.AssignedUser != null)){
        result = true;
      }
    }
    return result;
  }

  /*zthomas - 1/16/2009 - Defect 1600, Determine if TransactionSet contains Exposures with different Assigned Users*/
  /* 10/13/11 erawe - Defect 4654, updated so if the only scoassist on a claim is at claim level it will use that assigned 
  user.  If there is a scoassist for a specific feature and the check/payment is for that feature it will use that user.
  */
  function getSCOAssistUser():User{
    var scoAssist:User = null;
    
// See if an sco assist exists 
    //if(exists(assign in this.Claim.RoleAssignments where assign.Role =="scoassist")){
// look through all role assignments
       for(assign in this.Claim.RoleAssignments){
             // if an active sco assist exists on the claim then assign it
             if(assign.Role.Code == "scoassist" and assign.Active and assign.Exposure == null){
               scoAssist = assign.AssignedUser
               }

         }
         for(exp in this.Claim.Exposures.sortBy(\ e -> e.ClaimOrder) ){
           for (assign in exp.RoleAssignments){
         if (scoAssist == null){
             if(assign.Role.Code == "scoassist" and assign.Active and assign.Exposure != null){  
               scoAssist = assign.AssignedUser
           }
         }

          }
      }
     
      return scoAssist
}

 function conditionToCreateClaimActivity(c:Claim): boolean {
     var results = false
       if (c.AssignmentStatus == AssignmentStatus.TC_ASSIGNED and
           c.IncidentReport == false and
           !c.Closed and
           c.State != ClaimState.TC_DRAFT) {
             
             results = true
           }
           return results
 }
 
 function attorneyRepNoCodes(lineitem:TransactionLineItem): boolean{
   var lineCategoryForAttorneyNo = {LineCategory.TC_ATTORNEY_PLAINTIFF,
         LineCategory.TC_APPELLATECOUNSEL,LineCategory.TC_ATTORNEY_CONSULTING,
         LineCategory.TC_ATTORNEY_MONITORING,LineCategory.TC_ATTORNEY_CUMIS,
         LineCategory.TC_ATTORNEY_REPINS_NOTCMS,LineCategory.TC_ATTORNEY_RECOVERY,
         LineCategory.TC_ATTORNEY_REP_GAI_COV,LineCategory.TC_ATTORNEY_REP_GAI_BDFTH,
         LineCategory.TC_ATTORNEY_GAI_INTERNAL,LineCategory.TC_ATTORNEY_REP_GAI_NOTCV,
         LineCategory.TC_ATTREPGAISURETYDEFENSE,LineCategory.TC_ATTORNEY_REP_GAI_TRANS}
   return lineCategoryForAttorneyNo.contains(lineitem.LineCategory)
 }


function checkOver500k():Boolean{
   var historyEvents:ArrayList = new ArrayList();
   for(historyEvent in this.Claim.History)
   {
     if(historyEvent.Description != null)
     {
       historyEvents.add(historyEvent.Description)
      }
   }
   if(!exists(a in historyEvents where (a as String).equals("Large Loss Notification email sent on check "+((this as CheckSet).PrimaryCheck).CheckNumber))){
      return true;
   }
   else
     return false;
}

}



