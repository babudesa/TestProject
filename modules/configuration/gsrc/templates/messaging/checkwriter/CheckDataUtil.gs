package templates.messaging.checkwriter

class CheckDataUtil {

  construct() {

  }
  
  
  
  static function fixTaxID(taxID : String) : String{
    if(taxID.length > 9){
      return taxID.replaceAll("-", "")
    }
    return taxID
  }
  
  static function getAddressLineForPayToLine(payToLine : String, theCheck : Check) : String{
    if (payToLine != null and payToLine.length() != 0){
      if (theCheck.getDisplayNameWithoutFormerAndClosed(payToLine).length() > 40) {
        return "<![CDATA[" + theCheck.getDisplayNameWithoutFormerAndClosed(payToLine).substring(0, 40) + "]]>"
      }else{ 
        return "<![CDATA[" + theCheck.getDisplayNameWithoutFormerAndClosed(payToLine) + "]]>"
      }
    }
    	
    return ""
  }
}
