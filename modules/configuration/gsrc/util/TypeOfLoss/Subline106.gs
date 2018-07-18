package util.TypeOfLoss;

class Subline106
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    /* If condition added for Agri Orchard and Vineyard coverage, 4/27/16 erawe */
    if(exposure.CoverageSubType == typekey.CoverageSubtype.TC_AB_ORCHVINE_PD or exposure.CoverageSubType ==typekey.CoverageSubtype.TC_AB_ORCHARDVINEYARD_PD){
        codeList.add( TypeOfLossExt.TC_77_00036 ) //77 - Collapse Due to Other Covered Causes (including Sinkhole)
        codeList.add( TypeOfLossExt.TC_76_00039 ) //76 - Collapse Due to Weight of Ice, Snow or Sleet
        codeList.add( TypeOfLossExt.TC_75_00047 ) //75 - Collision
        codeList.add( TypeOfLossExt.TC_23_00062 ) //23 - Explosion
        codeList.add( TypeOfLossExt.TC_51_00067 ) //51 - Fire
        codeList.add( TypeOfLossExt.TC_82_00115 ) //82 - Hail
        codeList.add( TypeOfLossExt.TC_81_00119 ) //81 - Lightning
        codeList.add( TypeOfLossExt.TC_59_00122 ) //59 - Losses Due To Acts of Terrorism
        codeList.add( TypeOfLossExt.TC_78_00126 ) //78 - Losses Due to Consequential Mold
        codeList.add( TypeOfLossExt.TC_27_00215 ) //27 - Theft (including Mysterious Disappearance)
        codeList.add( TypeOfLossExt.TC_25_00234 ) //25 - Vandalism and Malicious Mischief
        codeList.add( TypeOfLossExt.TC_52_00245 ) //52 - Wind
        codeList.add( TypeOfLossExt.TC_29_00015 ) //29 - All Other Losses
    } else {
    
      switch(exposure.LossAppToExt){
        case "building":
          codeList.add( TypeOfLossExt.TC_67_00035 ) //67 - Collapse Due to Other Covered Causes (including Sinkhole)
          codeList.add( TypeOfLossExt.TC_66_00038 ) //66 - Collapse Due to Weight of Ice, Snow or Sleet
          codeList.add( TypeOfLossExt.TC_65_00046 ) //65 - Collision
          codeList.add( TypeOfLossExt.TC_13_00061 ) //13 - Explosion
          codeList.add( TypeOfLossExt.TC_41_00066 ) //41 - Fire
          codeList.add( TypeOfLossExt.TC_72_00114 ) //72 - Hail
          codeList.add( TypeOfLossExt.TC_71_00118 ) //71 - Lightning
          codeList.add( TypeOfLossExt.TC_58_00121 ) //58 - Losses Due To Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_68_00125 ) //68 - Losses Due to Consequential Mold
          codeList.add( TypeOfLossExt.TC_17_00214 ) //17 - Theft (including Mysterious Disappearance)
          codeList.add( TypeOfLossExt.TC_15_00233 ) //15 - Vandalism and Malicious Mischief
          codeList.add( TypeOfLossExt.TC_42_00244 ) //42 - Wind
          codeList.add( TypeOfLossExt.TC_19_00014 ) //19 - All Other Losses
          break;
        case "contents":
          codeList.add( TypeOfLossExt.TC_77_00036 ) //77 - Collapse Due to Other Covered Causes (including Sinkhole)
          codeList.add( TypeOfLossExt.TC_76_00039 ) //76 - Collapse Due to Weight of Ice, Snow or Sleet
          codeList.add( TypeOfLossExt.TC_75_00047 ) //75 - Collision
          codeList.add( TypeOfLossExt.TC_23_00062 ) //23 - Explosion
          codeList.add( TypeOfLossExt.TC_51_00067 ) //51 - Fire
          codeList.add( TypeOfLossExt.TC_82_00115 ) //82 - Hail
          codeList.add( TypeOfLossExt.TC_81_00119 ) //81 - Lightning
          codeList.add( TypeOfLossExt.TC_59_00122 ) //59 - Losses Due To Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_78_00126 ) //78 - Losses Due to Consequential Mold
          codeList.add( TypeOfLossExt.TC_27_00215 ) //27 - Theft (including Mysterious Disappearance)
          codeList.add( TypeOfLossExt.TC_25_00234 ) //25 - Vandalism and Malicious Mischief
          codeList.add( TypeOfLossExt.TC_52_00245 ) //52 - Wind
          codeList.add( TypeOfLossExt.TC_29_00015 ) //29 - All Other Losses
          break;
        case "time":
          codeList.add( TypeOfLossExt.TC_87_00037 ) //87 - Collapse Due to Other Covered Causes (including Sinkhole)
          codeList.add( TypeOfLossExt.TC_86_00040 ) //86 - Collapse Due to Weight of Ice, Snow or Sleet
          codeList.add( TypeOfLossExt.TC_85_00048 ) //85 - Collision
          codeList.add( TypeOfLossExt.TC_33_00063 ) //33 - Explosion
          codeList.add( TypeOfLossExt.TC_61_00068 ) //61 - Fire
          codeList.add( TypeOfLossExt.TC_92_00116 ) //92 - Hail
          codeList.add( TypeOfLossExt.TC_91_00120 ) //91 - Lightning
          codeList.add( TypeOfLossExt.TC_60_00123 ) //60 - Losses Due To Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_88_00127 ) //88 - Losses Due to Consequential Mold
          codeList.add( TypeOfLossExt.TC_37_00216 ) //37 - Theft (including Mysterious Disappearance)
          codeList.add( TypeOfLossExt.TC_35_00235 ) //35 - Vandalism and Malicious Mischief
          codeList.add( TypeOfLossExt.TC_62_00246 ) //62 - Wind
          codeList.add( TypeOfLossExt.TC_39_00016 ) //39 - All Other Losses
          break;
        default:
          break;
      }
    }
  }
}
