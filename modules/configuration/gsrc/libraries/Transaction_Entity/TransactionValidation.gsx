package libraries.Transaction_Entity

enhancement TransactionValidation : entity.Transaction {
  function validateForRecode() : String {
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
      }
      if(this.Claim.ValidationLevel!="payment"){
        message = message + displaykey.Java.Financials.CheckWizard.Error.ClaimValidationFailed + "\n" 
      }  
    }
    //print("MESSAGE: " + message)
    return message=="" ? null : message
  }

  function costTypeCodeRequired() : boolean {
    var isRequired:boolean = false;
     if(this.CostType == CostType.TC_CLAIMCOST or this.CostType == CostType.TC_GAIASTPALOSS) { // If Cost Type is 'Loss' or 'GAI as TPA Loss' or 
      if(exists(Payee in (this as Payment).Check.Payees where Payee.PayeeType=="Vendor") ||    // If any Payee on the check is a Vendor or 
         this.Exposure.IsMedicalPaymentExt==true ||                                            // If Exposure.IsMedicalPaymentExt or     
         this.Exposure.ExposureType==ExposureType.TC_WC_MEDICAL_DETAILS){                      // If this Exposure is WC Medical Details, then Loss/Expense Code is required                                             
        isRequired = true                                                                      
      } else {
        isRequired = false
      } 
    } else {
      isRequired = true
    }
    return isRequired;
  }
}
