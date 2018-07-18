package libraries.PropertyRU_Entity

enhancement PolicyProperty : entity.PropertyRU {
  
  function checkRiskTypeUsingRiskNum(){
    
    if(this.Coverages.length == 0){
      if(this.Property.RiskNumberExt == 0 && this.Property.BuildingNumberExt == "0"){
        this.Property.RiskTypeExt = EDWRiskType.TC_PRM
      }else if(this.Property.RiskTypeExt == EDWRiskType.TC_PRM){
        this.Property.RiskTypeExt = null
      }
    }else{
      if(this.Property.OriginalVersion.getFieldValue("RiskNumberExt") != null &&
        this.Property.OriginalVersion.getFieldValue( "RiskNumberExt").equals(0) &&
        this.Property.RiskNumberExt != 0 &&
        this.Property.BuildingNumberExt != null &&
        this.Property.BuildingNumberExt == "0") {
        this.Property.RiskNumberExt = 0
        pcf.GeneralErrorWorksheet.goInWorkspace("Changing the Risk Number from 0 to another value when Building Number is 0, also changes the Risk Type. Risk Type Changes are not permitted when a Coverage exists on the Risk.") 
      }else if(this.Property.RiskNumberExt == 0 && this.Property.BuildingNumberExt != null &&
              this.Property.BuildingNumberExt == "0") {
        this.Property.RiskNumberExt = this.Property.OriginalVersion.getFieldValue( "RiskNumberExt") as int
        pcf.GeneralErrorWorksheet.goInWorkspace("Changing the Risk Number to 0 when Building Number is 0, also changes the Risk Type to Premises. Risk Type Changes are not permitted when a Coverage exists on the Risk.") 
      }
    }
  }

  function checkRiskTypeUsingBuildingNum(){
    try{
      this.Property.BuildingNumberExt = java.lang.Integer.parseInt(this.Property.BuildingNumberExt) as java.lang.String
    }
    catch (E){
      if(!this.Property.BuildingNumberExt.Numeric){
        var temp = this.Property.BuildingNumberExt
        this.Property.BuildingNumberExt = null;
        pcf.GeneralErrorWorksheet.goInWorkspace("Building Number: "+ temp + ", this value must be a whole number and contain less than 10 digits.")
        return;
      }else{
        var temp = this.Property.BuildingNumberExt
        this.Property.BuildingNumberExt = null;
        pcf.GeneralErrorWorksheet.goInWorkspace("Building Number: "+ temp + ", this value must be a whole number and contain less than 10 digits.")
        return;
      }
    }
    
    if(this.Coverages.length == 0){
      if(this.Property.BuildingNumberExt == "0" && this.Property.RiskNumberExt == 0){
        this.Property.RiskTypeExt = EDWRiskType.TC_PRM
      }else if(this.Property.RiskTypeExt == EDWRiskType.TC_PRM){
        this.Property.RiskTypeExt = null
      }
    }else{
      if(this.Property.OriginalVersion.getFieldValue("BuildingNumberExt") != null &&
        this.Property.OriginalVersion.getFieldValue( "BuildingNumberExt").equals("0") &&
        this.Property.RiskNumberExt != null &&
        this.Property.RiskNumberExt == 0) {
         this.Property.BuildingNumberExt = "0"
         pcf.GeneralErrorWorksheet.goInWorkspace("Changing the Building Number from 0 to another value when Risk Number is 0, also changes the Risk Type. Risk Type Changes are not permitted when a Coverage exists on the Risk.") 
      }else if(this.Property.BuildingNumberExt == "0" && 
              this.Property.RiskNumberExt != null &&
              this.Property.RiskNumberExt == 0) {
        this.Property.BuildingNumberExt = this.Property.OriginalVersion.getFieldValue( "BuildingNumberExt") as java.lang.String
        pcf.GeneralErrorWorksheet.goInWorkspace("Changing the Building Number to 0 when Risk Number is 0, also changes the Risk Type to Premises. Risk Type Changes are not permitted when a Coverage exists on the Risk.") 
      }
    }
  }
  
  function checkRiskNumberForPIM(): void{
    if(this.Property.RiskTypeExt == EDWRiskType.TC_PRM){
      this.Property.BuildingNumberExt = "0"
      this.Property.RiskNumberExt = 0
    }else if(this.Property.BuildingNumberExt == "0" && this.Property.RiskNumberExt == 0){
      this.Property.BuildingNumberExt = null
      this.Property.RiskNumberExt = null
    }  
  }
}
