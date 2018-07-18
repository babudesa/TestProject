package util.custom_Ext;

uses java.lang.Integer
uses java.math.BigDecimal

class ValidateCoverageAmounts
{
  construct()
  {
  }
  
  static function validateCoverageAmount(value : BigDecimal) : Boolean{
    var result : Boolean = true;
    if(value != null && (value.intValue() != value || (value.intValue() as java.lang.Integer).toString().length() > 9)){
      result = false;
    }
    return result;
  }
}
