package util.TypeOfLoss

class Subline469 {

  construct() {

  }
   public static function returnList(codeList : List, exposure : Exposure) {
    var expType : ExposureType = exposure.ExposureType
    //cmullin - 2.19.14 - adding default codes for E&S testing only. Actual codes to be added/updated later....
    if(exposure.Claim.LossType == LossType.TC_SPECIALTYES){
          codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
          codeList.add( TypeOfLossExt.TC_48_00180 ) //48 - PD due to Silica and Silica Related Dust          
          codeList.add( TypeOfLossExt.TC_27_00189 ) //27 - Pollution Liability - Clean-up (excl MD)
          codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl MD) - PD
          codeList.add( TypeOfLossExt.TC_26_00190 ) //26 - Property Damage
    }
   }

}