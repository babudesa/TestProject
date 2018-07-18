package libraries.ActivitySearchView_Entity

enhancement PendingApprovalActivitySearchView : entity.ActivitySearchView {
  /* 
  * Restrict the activity patterns that are visible on Pending Approval Activity search screen.
  * Sprint/Maintenance Release: EM 16 - Defect 222
  * Author: Zach Thomas
  * Date: 11/11/09
  */
  function pendingApprovalActivityVisible():Boolean{
    if(this.Activity.ActivityPattern ==  util.custom_Ext.finders.findActivityPattern("approve_payment") or 
      this.Activity.ActivityPattern == util.custom_Ext.finders.findActivityPattern("approve_reserve_change")){
      return true;
    }else{
      return false;
    }
  }
}
