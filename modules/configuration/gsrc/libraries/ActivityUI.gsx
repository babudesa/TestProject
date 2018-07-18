package libraries
uses java.math.BigDecimal
uses java.lang.StringBuilder
uses java.util.ArrayList

@Export
enhancement ActivityUI : entity.Activity
{
  function setInitialValues() {
    // Activities are initialized from a pattern; don't overwrite fields already set by pattern
    if (this.Importance == null) {
      this.Importance = "notOnCalendar";
    }
  }
  
  //8/14/08 erawe - used on activities when we generate the approval emails for payments or reserves activities
  // for the payment CheckNumber
  function getApprovalCheckNumber () :String {
    if(this.TransactionSet.Subtype=="ReserveSet") {
     return ""
    }
    if(this.TransactionSet.Subtype=="CheckSet") {
     return (this.TransactionSet as CheckSet).PrimaryCheck.CheckNumber
    }
    else
    return 0 as java.lang.String
  }
   
   //Naga - BulkInvoice issue#34 - return amount for check/reserve/BulkInvoice Approval
   function getApprovalCheckAmount () :BigDecimal{
    if(this.TransactionSet.Subtype=="ReserveSet" or this.TransactionSet.Subtype=="CheckSet" && (this.BulkInvoice==null)) {
     return this.TransactionSet.Amount
    }
    if(this.BulkInvoice!=null) {
     return this.BulkInvoice.BulkInvoiceTotal
    }
    else
    return 0 as java.math.BigDecimal
  }
  
  //kotteson - defect 1768 - return group for activity template
  function getClaimOfficeBranchGroup() : Group {
  
    var group = this.AssignedGroup
    
    if (group == null)
      return null
    
    do {
      var type = group.GroupType
      /** Return the group name if the GroupType is of branch office or business unit */
      if (type == "branchoffice" || type == "busunit" || type == "nonclaimsbusunit") {
        return group
      }
      group = group.Parent
    }
    while(group != null)
    /** If we didn&amp;apos;t have a group which was a branchoffice or business unit return &amp;quot;SCO&amp;quot; */
    return null
  }

  // 6/15/2009 - zjthomas - Defect 1600, this function checks that the current activity is in the existing activities on the claim.
  function isActivityInWorkplan() : Boolean{
    var result:Boolean = true;
    if(!exists(act in this.Claim.Activities where this.PublicID == act.PublicID)){
      result = false;
    }
    return result;
  }

  /* 4/20/10 - erawe - defect 2829, New permission to have the authority to reject reserve/payment activities
  not assigned to you.  Reject button is available if you have the rejectauthority permission or the activity
  is assigned to the logged in user
  */
  function canRejectActivity() : Boolean {
    if((perm.System.rejectauthority) or (this.AssignedUser.PublicID == User.util.getCurrentUser().PublicID)){
      return true
    }else{
      return false
    }
  }
  
  
   /* 7/08/14 - akubatur - defect 6999, including Feature name and Feature number to the 
    Reserve Approved/Rejected Activity Notification.
    */
    function getFeatureNames():String{
      var resultStr:String = ""
      var order:int = 0
      var count:int = this.TransactionSet.Transactions.Count
      if(this.BulkInvoice==null){
      for(exp in this.TransactionSet.Transactions.orderByDescending(\ t ->t.Exposure.ClaimOrder).reverse()){
        if(order != exp.Exposure.ClaimOrder){
         
         resultStr+= "("+exp.Exposure.ClaimOrder+") "+exp.Exposure.ExposureType.DisplayName
         count--
        if(count != 0 and order != exp.Exposure.ClaimOrder){
         resultStr+=", "
        }
        order=exp.Exposure.ClaimOrder
        }
      }
      if(resultStr.trim().endsWith(",")){
        var len = resultStr.trim().length
        resultStr = resultStr.substring(0,(len-1))
      }
      }else{
      resultStr=""
      }
      return resultStr
    }
    
     function getCostType():String {
       var costTypes:List = new ArrayList()
       for(exp in this.TransactionSet.Transactions){
         if(!costTypes.contains(exp.CostType.DisplayName)){
            costTypes.add(exp.CostType.DisplayName)
         }
       }
       var str:StringBuilder = new StringBuilder()
       var it = costTypes.iterator()
       while(it.hasNext()){
         str.append(it.next())
         if(it.hasNext()){
           str.append(", ")
         }
       }   
      return str as java.lang.String
     }

}