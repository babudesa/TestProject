package util.gaic.CMS.validation

class GeneralCMSValidation extends CMSValidationBase{
  
  var generalMessage = ": "
  
  construct() {

  }
  
  construct(exposure : Exposure){
    super(exposure)
    doInit()
  }
  
  override property get ValidationMessage() : String{
    var message = super.ValidationMessage
    if(message != "")
      message = this.Prefix + this.ClaimantPerson.DisplayName + generalMessage + message
      
    return message
  }
  
  override function doInit() {
    if(!this.ClaimantPerson.MedicareEligibleExt){
      return  
    }
    
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
