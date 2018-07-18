package util
uses java.util.Comparator

class JobSiteComparator implements Comparator<JobsiteRUExt>   {

  /**
   * takes both jobsite number and risk type into account
   */
  override function compare(p0 : JobsiteRUExt, p1 : JobsiteRUExt) : int {
    //note that second param is used first, which is different than how these are normally implemented
    var jobSitePriority = p1.JobsiteNumberExt - p0.JobsiteNumberExt
    
    if(jobSitePriority == 0){
      //if both jobsites have the same number, then look at their risk type to determine which should display first  
      if(p0.Property.RiskTypeExt == EDWRiskType.TC_JOBSITE){
        jobSitePriority = -1  
      }else if(p1.Property.RiskTypeExt == EDWRiskType.TC_JOBSITE){
        jobSitePriority = 1 
      }
    }
    
    return jobSitePriority
    
  }
}
