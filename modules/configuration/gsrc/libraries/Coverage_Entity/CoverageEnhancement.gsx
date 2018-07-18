package libraries.Coverage_Entity
uses java.text.SimpleDateFormat

enhancement CoverageEnhancement : entity.Coverage {
  
  public function covTypeDisplayName():String{
    //if(this.CoverageTitleExt != null and this.Type.toString().toLowerCase().contains("manuscript")){
    if(this.CoverageTitleExt != null){
      return (this.Type.DisplayName + " - " + this.CoverageTitleExt)
    }else{
      return this.Type.toString()
    }
  }
  
  public function commAutoCoverageDescription(): String{
    var covString = this.Type.toString() + ", "
    if (this.Type.hasCategory(RiskType.TC_Policy)){
      covString = "Policy-Level, " + covString
    }
    if (this.State != null){
      // check for Risk State
      covString = covString + this.State.toString() + ", " 
    }
    if (this.SublineExt != null){
      // check for Subline 
      covString = covString + this.SublineExt.Code.toString() + ", " 
    }
    // Class Code
    if (this.ClassCodeExt != null){
      covString = covString + this.ClassCodeExt + " - "
    }
     // Class Code Description 
    if (this.ClassCodeDescExt != null){
    //check for Class Code Description
      covString = covString + this.ClassCodeDescExt + ", "
    }
    if (this.EffectiveDate != null){
      covString = covString + (new SimpleDateFormat("MM/dd/yyyy")).format(this.EffectiveDate) + "-"
    }
    if (this.ExpirationDate != null){
      covString = covString + (new SimpleDateFormat("MM/dd/yyyy")).format(this.ExpirationDate)
    }
    return covString
  }
}
