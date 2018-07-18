package libraries.Recovery_Entity

enhancement Recovery : entity.Recovery {
  function checkDateRecovery() : String {
    if ((this.ex_recoverycheckdate <= gw.api.util.DateUtil.currentDate()) || (this.ex_recoverycheckdate  == null))
      return null
    else
      return "The issue date of this check is after today.  Please select another date"
  }
  
  function validateForRecovery(lineItem : LineCategory, costType : CostType) : String {
    var message : String = ""
    if(this.Exposure != null){
      if(this.Exposure.ValidationLevel!="payment"){
        message = displaykey.Java.Financials.CheckWizard.Error.ExposureValidationFailed + "\n" 
      } else {
        if(this.Exposure.Coverage.State!=null and this.Exposure.Coverage.SublineExt!=null and this.Exposure.Coverage.SublineExt!="0" and this.Exposure.Coverage.SublineExt!="NR"){
          if(this.Exposure.typeOfLossIsIncomplete()){
            message = message + displaykey.NVV.Financials.LossDueTo(this.Exposure) + "\n" 
          }
        }
        if(this.Exposure.getMedPayError( lineItem, costType )!=null){
          message = message + this.Exposure.getMedPayError( lineItem, costType ) + "\n"
        }
      }
      if(this.Claim.ValidationLevel!="payment"){
        message = message + displaykey.Java.Financials.CheckWizard.Error.ClaimValidationFailed + "\n" 
      }  
    }
    //print("MESSAGE: " + message)
    return message=="" ? null : message
  }  
}
