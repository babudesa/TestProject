package util.gaic.CMS.validation

class FeatureCloseValidation extends CMSValidationBase{
  
  var closeMessage = " before this Feature can be closed: "
  
  construct(exposure : Exposure) {
    super(exposure)
    doInit()
  }
  
  override property get ValidationMessage() : String{
    var message = super.ValidationMessage
    if(message != "")    
      message = Prefix + ClaimantPerson.DisplayName + closeMessage + message
      
    return message
  }

  override function doInit() {
    this.DoReportingData = true       
    
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
