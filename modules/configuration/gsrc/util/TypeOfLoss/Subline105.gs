package util.TypeOfLoss;

class Subline105
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    var lossAppTo : LossApplicableTo = exposure.LossAppToExt
    //var riskState : State = util.TypeOfLoss.helperFunctions.getRiskState( exposure )
    
    switch(lossAppTo){
      case "building":
        codeList.add( TypeOfLossExt.TC_13_00061 ) //13 - Explosion
        codeList.add( TypeOfLossExt.TC_11_00070 ) //11 - Fire and Lightning
        codeList.add( TypeOfLossExt.TC_58_00121 ) //58 - Losses Due To Acts of Terrorism
        codeList.add( TypeOfLossExt.TC_68_00125 ) //68 - Losses Due to Consequential Mold
        codeList.add( TypeOfLossExt.TC_14_00193 ) //14 - Riot and Civil Commotion
        codeList.add( TypeOfLossExt.TC_17_00214 ) //17 - Theft (including Mysterious Disappearance)
        codeList.add( TypeOfLossExt.TC_15_00233 ) //15 - Vandalism and Malicious Mischief
        codeList.add( TypeOfLossExt.TC_18_00241 ) //18 - Water Damage
        codeList.add( TypeOfLossExt.TC_12_00250 ) //12 - Wind and Hail
        codeList.add( TypeOfLossExt.TC_19_00014 ) //19 - All Other Losses
        break;
      case "contents":
        codeList.add( TypeOfLossExt.TC_23_00062 ) //23 - Explosion
        codeList.add( TypeOfLossExt.TC_21_00071 ) //21 - Fire and Lightning
        codeList.add( TypeOfLossExt.TC_59_00122 ) //59 - Losses Due To Acts of Terrorism
        codeList.add( TypeOfLossExt.TC_78_00126 ) //78 - Losses Due to Consequential Mold
        codeList.add( TypeOfLossExt.TC_24_00194 ) //24 - Riot and Civil Commotion
        codeList.add( TypeOfLossExt.TC_27_00215 ) //27 - Theft (including Mysterious Disappearance)
        codeList.add( TypeOfLossExt.TC_25_00234 ) //25 - Vandalism and Malicious Mischief
        codeList.add( TypeOfLossExt.TC_28_00242 ) //28 - Water Damage
        codeList.add( TypeOfLossExt.TC_22_00251 ) //22 - Wind and Hail
        codeList.add( TypeOfLossExt.TC_29_00015 ) //29 - All Other Losses
        break;
      case "time":
        codeList.add( TypeOfLossExt.TC_33_00063 ) //33 - Explosion
        codeList.add( TypeOfLossExt.TC_31_00072 ) //31 - Fire and Lightning
        codeList.add( TypeOfLossExt.TC_60_00123 ) //60 - Losses Due To Acts of Terrorism
        codeList.add( TypeOfLossExt.TC_88_00127 ) //88 - Losses Due to Consequential Mold
        codeList.add( TypeOfLossExt.TC_34_00195 ) //34 - Riot and Civil Commotion
        codeList.add( TypeOfLossExt.TC_37_00216 ) //37 - Theft (including Mysterious Disappearance)
        codeList.add( TypeOfLossExt.TC_35_00235 ) //35 - Vandalism and Malicious Mischief
        codeList.add( TypeOfLossExt.TC_38_00243 ) //38 - Water Damage
        codeList.add( TypeOfLossExt.TC_32_00252 ) //32 - Wind and Hail
        codeList.add( TypeOfLossExt.TC_39_00016 ) //39 - All Other Losses
        break;
      default:
        break;
    }
  }
}
