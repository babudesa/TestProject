package libraries.JobsiteRUExt_Entity

enhancement PolicyJobsite : entity.JobsiteRUExt {
  
  function updateLocationAddress(): void{
    var newLocation : boolean = true
    for(job in this.Policy.Jobsites){
      if(this.Policy.Claim.LossType==TC_PIMINMARINE){
        if(job.JobsiteNumberExt == this.JobsiteNumberExt && job != this){
          newLocation = false
          this.Property.Address = job.Property.Address
          break
        }
      }
    }
    if(newLocation){  
      this.Property.Address = null
    }
  }
  
  function checkRiskTypeUsingRiskNum(){
    
    if(this.Coverages.length == 0){
      if(this.Property.RiskNumberExt == 0){
      }else if(this.Property.RiskTypeExt == EDWRiskType.TC_JOBSITE){
        this.Property.RiskTypeExt = null
      }
    }else{
      if(this.Property.OriginalVersion.getFieldValue("RiskNumberExt") != null &&
        this.Property.OriginalVersion.getFieldValue( "RiskNumberExt").equals(0) &&
        this.Property.RiskNumberExt != 0){
        this.Property.RiskNumberExt = 0
        pcf.GeneralErrorWorksheet.goInWorkspace("Changing the Risk Number from 0 to another value, also changes the Risk Type. Risk Type Changes are not permitted when a Coverage exists on the Risk.") 
      }
    }
  }

  function checkRiskNumberForPIM(): void{
    if(this.Property.RiskTypeExt == EDWRiskType.TC_JOBSITE){
      this.Property.RiskNumberExt = 0
    }
  }
}