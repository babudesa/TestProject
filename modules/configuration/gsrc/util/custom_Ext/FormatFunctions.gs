package util.custom_Ext

uses java.text.DecimalFormat
uses java.lang.Integer
uses java.lang.StringBuffer

class FormatFunctions {

  construct() {

  }
  
  public static function formatCurrencyNumberString(stringToFormat:String):String{
    var decFormat:DecimalFormat = new DecimalFormat()
    var formattedString:StringBuffer = new StringBuffer()
    
    if(stringToFormat != null){
      formattedString.append("$")
      formattedString.append(decFormat.format(Integer.parseInt(stringToFormat)))
    }
    return formattedString.toString()
  }

}
