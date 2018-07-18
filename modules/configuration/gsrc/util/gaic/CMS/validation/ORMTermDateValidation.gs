package util.gaic.CMS.validation

class ORMTermDateValidation extends CMSValidationBase {

  construct(contactISO : ContactISOMedicareExt) {
    this.ConISO = contactISO
    doInit()
  }

  override property get ValidationMessage() : String {
    var message = super.ValidationMessage
    if(message != "")
      message = "\tORM Termination Date has been entered, " + message + " must also be entered."
    
    return message 
  }

  override function doInit() {
    DoReportingData = true
    ICD9Flag = true
    ORMFlag = true
  }

}
