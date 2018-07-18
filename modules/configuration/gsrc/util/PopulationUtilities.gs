package util

class PopulationUtilities {

  construct() {

  }

  static function getCheckSummaryTextUtility(aCheck : Check) : String {
    var result =""; 
    var i = 0;
    var x = 0;

    if (aCheck.Claim.LOBCode == "equine"){
      if(exists(payment in aCheck.Payments where payment.CostType == "claimcost")){
         for(pay in aCheck.Payments){
            if(pay.CostType == "claimcost"){
              i = i + 1
            }
            for(line in pay.LineItems){
              if(line.LineCategory != null and result.indexOf(line.LineCategory.DisplayName) < 0){
                result = result + line.LineCategory.DisplayName + ", "
              }
            }
          }
          if(i > 1){
            result = (aCheck.CheckSet.Exposures[0].FixedPropertyIncident.Property.LocationNumber + " : " +  " Payments for " + aCheck.Claim.LossCause.DisplayName + " - " + aCheck.Claim.ex_DetailLossCause.DisplayName) + ", " + result;
          }else{
            result = (aCheck.CheckSet.Exposures[0].FixedPropertyIncident.Property.LocationNumber + " : " + aCheck.FirstPayment.PaymentType.DisplayName + " Payment for " + aCheck.Claim.LossCause.DisplayName + " - " + aCheck.Claim.ex_DetailLossCause.DisplayName) + ", " + result;
          }
          result = result.subSequence( 0, result.length() - 2 ).toString()
      }else{
        result = forString(aCheck)
      }
    }
    //DEFECT 2341 - Restrict FOR to 120 characters - sprzygocki 8/13/09 - Equine UAT
    //print(result)
    if(result.length()>120){
      x = result.length()-120
      result = result.subSequence( 0, result.length() - x ).toString()
    }
    return result;
  }

  static function forString(aCheck : Check) : String{
    var result : String = "";
    for(pay in aCheck.Payments){
      for(line in pay.LineItems){
        if( result.indexOf(line.LineCategory.DisplayName) < 0){
          result = result + line.LineCategory.DisplayName + ", "
        }
      }
    }
    result = result.subSequence( 0, result.length() - 2 ).toString()
    return result;
  }

}
