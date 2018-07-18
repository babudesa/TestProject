package libraries.PropertyRU_Entity

enhancement FarmPropertyFunction : entity.PropertyRU {
  function updateLocationAddress(): void{
    var newLocation : boolean = true
    for(prop in this.Policy.Properties){
      if(this.Policy.Claim.LossType==TC_PIMINMARINE){
        if (prop typeis PropertyRU){
        if((prop as PropertyRU).PropertyNumberExt == this.PropertyNumberExt &&
           prop.Property.BuildingNumberExt == this.Property.BuildingNumberExt && prop != this){
          newLocation = false
          this.Property.Address = prop.Property.Address
          break
        }
        }
      } else {
        if((prop as PropertyRU).PropertyNumberExt == this.PropertyNumberExt && prop != this){
          newLocation = false
          this.Property.Address = prop.Property.Address
          break
        }
      }
    }
    if(newLocation){  
      this.Property.Address = null
    }
  }
  
  function validateRiskNumber(riskNumber : String): String {
    try {
      
      if(riskNumber.length >= 10)
        return "This value must be a whole number and contain less than 10 digits."
      
      this.Property.BuildingNumberExt = java.lang.Integer.parseInt(riskNumber)
      
    }
    catch (E) {
      if(!riskNumber.Numeric){
        var error : String = "This value must be a whole number and contain less than 10 digits."
        return error;
      }
    }  
    return null;
  }
  //need to move cov.length check to outside and add check for changing from 0 to another num
  function checkRiskType(): void{
//   try{
//      this.Property.BuildingNumberExt = java.lang.Integer.parseInt(this.Property.BuildingNumberExt)
//    }
//    catch (E){
//     if(!this.Property.BuildingNumberExt.Numeric){
//        var temp = this.Property.BuildingNumberExt
//        this.Property.BuildingNumberExt = null;
//        pcf.GeneralErrorWorksheet.goInWorkspace("Risk Number: "+ temp + ", this value must be a whole number and contain less than 10 digits.")
//        return;
//     }
//     else{
//        var temp = this.Property.BuildingNumberExt
//         this.Property.BuildingNumberExt = null;
//         pcf.GeneralErrorWorksheet.goInWorkspace("Risk Number: "+ temp + ", this value must be a whole number and contain less than 10 digits.")
//         return;
//     }
//    }
    
    if(this.Coverages.length == 0){
      if(this.Property.BuildingNumberExt == "0"){
        this.Property.RiskTypeExt = "FRMLOC"
      }else if(this.Property.RiskTypeExt == "FRMLOC"){
        this.Property.RiskTypeExt = null
      }
    }else{
      if(this.Property.OriginalVersion.getFieldValue( "BuildingNumberExt") as java.lang.String == "0") {
        this.Property.BuildingNumberExt = "0"
        pcf.GeneralErrorWorksheet.goInWorkspace("Changing the Risk Number from 0 to another value, also changes the Risk Type. Risk Type Changes are not permitted when a Coverage exists on the Risk.") 
      }else if(this.Property.BuildingNumberExt == "0") {
        this.Property.BuildingNumberExt = this.Property.OriginalVersion.getFieldValue( "BuildingNumberExt") as java.lang.String
        pcf.GeneralErrorWorksheet.goInWorkspace("Changing the Risk Number to 0, also changes the Risk Type to Farm Location. Risk Type Changes are not permitted when a Coverage exists on the Risk.") 
      }
    }
  }
  function checkRiskNumber(): void{
    if(this.Property.RiskTypeExt == "FRMLOC"){
      this.Property.BuildingNumberExt = "0"
    }else if(this.Property.BuildingNumberExt == "0"){
      this.Property.BuildingNumberExt = null
    }  
  }

  function riskValidate(): String{
    try{
      this.Property.BuildingNumberExt = java.lang.Integer.parseInt(this.Property.BuildingNumberExt)
      }
    catch (e){
         return "This value must be a whole number and contain less than 10 digits."
    }
    //Defect 3324 - zjthomas - 6/14/10, To replicate verified policies, we will allow multiple risk 0&apos;s with the same location number. 
    //However, only 1 coverage per risk 0 is allowed and only 1 risk 0 on the same location number with no coverages.
    if(this.Property.BuildingNumberExt == "0" and this.Coverages.length > 1){
      return displaykey.LV.Policy.Properties.FarmLocation.MultipleCoverages;
    }else if(this.Property.BuildingNumberExt == "0" and this.Coverages.length == 0 and 
        exists(loc in this.Policy.Properties where (loc as PropertyRU).PropertyNumberExt == this.PropertyNumberExt and 
        (this != loc) and (loc as PropertyRU).Property.BuildingNumberExt == "0" and loc.Coverages.length == 0)){
      return displaykey.LV.Policy.Properties.FarmLocation.MultipleNoCoverages;    
    }else{
      return null;
    }
  }
}
