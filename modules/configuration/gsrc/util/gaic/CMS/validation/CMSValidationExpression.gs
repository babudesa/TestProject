package util.gaic.CMS.validation

class CMSValidationExpression {

  construct() {

  }
  
  static function exhaustDate(contactISO : ContactISOMedicareExt) : String{
    var message : String
    if(contactISO.CMSIncidentDateExt != null){
      message =  contactISO.ExhaustDateExt == null || (gw.api.util.DateUtil.compareIgnoreTime(contactISO.ExhaustDateExt, gw.api.util.DateUtil.currentDate()) <= 0 and gw.api.util.DateUtil.compareIgnoreTime(contactISO.ExhaustDateExt, contactISO.CMSIncidentDateExt) > 0) ? null : displaykey.Java.Validation.Date.ForbidFuture + " Date must be greater than the CMS Date of Incident." 
    }
    
    return message
  }

}
