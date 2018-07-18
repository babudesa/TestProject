package util.gaic.CMS.validation

class CMSIntegrationValidation extends CMSValidationBase {

  construct(exposure : Exposure) {
    super(exposure)
    doInit()
  }

  override function doInit() {
    this.DoReportingData = true       
    this.ICD9Flag = true
    if(this.Expo.IsORMExposure){
      //Medpay or PIP
      this.ORMFlag = true   
    }else{
      //BI or PI
      this.TPOCFlag = true
    }
  }

}
