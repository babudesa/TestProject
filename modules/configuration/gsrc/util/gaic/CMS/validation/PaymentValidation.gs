package util.gaic.CMS.validation

class PaymentValidation extends CMSValidationBase {
  
  var finalPaymentMessage = " on Parties Involved before a final or supplemental payment can be made: "
  var _payment : Payment as Pmt
  
  construct(payment : Payment) {
    super(payment.Exposure)
    _payment = payment
    doInit()
    if(_payment.PaymentType == PaymentType.TC_PARTIAL){
       this.DoQueryData = false 
    }
  }
  
  override property get ValidationMessage() : String{
    var message = super.ValidationMessage
    if(message != "")    
      message = Prefix + ClaimantPerson.DisplayName + finalPaymentMessage + message
    
    return message 
  }

  override function doInit() {
    if(!this.ClaimantPerson.MedicareEligibleExt){
      return
    }
      this.DoReportingData = true       
    //defect 8182 - cprakash - below changes were made based on the issues raised as part of 8182
    if(this.Expo.IsORMExposure){
      //Medpay or PIP
        this.ORMFlag = true
        this.ICD9Flag = true 
    }else{
      //BI or PI
      if(this.Expo.HasLossPayment){
        this.TPOCFlag = true
        this.ICD9Flag = true 
      }
    }
  }

}
