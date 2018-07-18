package libraries.Exposure_Entity

enhancement MedicalPayments : entity.Exposure {
  function getMedPayError(lineItem : LineCategory, costType : CostType) : String{

    if(this.IsMedicalPaymentExt and lineItem=="cost_control_vendors" and
       this.Coverage.State=="CA" and costType=="expense"){
      return displaykey.Validation.MedicalPayments.CaliforniaExpense
    } else if(this.IsMedicalPaymentExt and lineItem=="cost_control_vendors" and
              this.Coverage.State!="CA" and costType=="claimcost"){
      return displaykey.Validation.MedicalPayments.OtherLoss
    } else {
      return null 
    }

  }
}
