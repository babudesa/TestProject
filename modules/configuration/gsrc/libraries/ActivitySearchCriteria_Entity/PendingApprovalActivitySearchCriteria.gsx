package libraries.ActivitySearchCriteria_Entity

enhancement PendingApprovalActivitySearchCriteria : entity.ActivitySearchCriteria {
 /* 
  * Set the default values of the Pending Approval Activity search screen.
  * Sprint/Maintenance Release: EM 16 - Defect 222
  * Author: Zach Thomas
  * Date: 11/11/09
  */
  function setPendingApprovalCriteria(){
    //Restrict returned activities to only open activities.
    this.ActivityStatus =  "open";
  
    //Restrict returned activities to only activities whose subject begins with "Review and approve"
    this.SubjectCriteria.SubjectSearchType = "contains";
    this.SubjectCriteria.Subject = "Review and approve";
  
  }
}
