package util.TypeOfLoss;

class Subline156
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    if(exposure.Claim.LossCause=="mold"){
      codeList.add( TypeOfLossExt.TC_51_00051 ) //51 - Consequential Fungus, Wet Rot, Dry Rot, or Bacteria (Mold) Property Losses caused by Fire and Lightning
      codeList.add( TypeOfLossExt.TC_56_00052 ) //56 - Consequential Fungus, Wet Rot, Dry Rot, or Bacteria (Mold) Property Losses caused by Freezing
      codeList.add( TypeOfLossExt.TC_54_00053 ) //54 - Consequential Fungus, Wet Rot, Dry Rot, or Bacteria (Mold) Property Losses caused by Sprinkler Leakage
      codeList.add( TypeofLossExt.TC_53_00054 ) //53 - Consequential Fungus, Wet Rot, Dry Rot, or Bacteria (Mold) Property Losses caused by Vandalism and Malicious Mischief
      codeList.add( TypeOfLossExt.TC_55_00055 ) //55 - Consequential Fungus, Wet Rot, Dry Rot, or Bacteria (Mold) Property Losses caused by Water Damage
      codeList.add( TypeOfLossExt.TC_52_00056 ) //52 - Consequential Fungus, Wet Rot, Dry Rot, or Bacteria (Mold) Property Losses caused by Wind and Hail
      codeList.add( TypeOfLossExt.TC_59_00011 ) //59 - All Other Consequential Fungus, Wet Rot, Dry Rot, or Bacteria (Mold) Property Losses
      codeList.add( TypeOfLossExt.TC_09_00013 ) //09 - All Other Losses
    } else {
      codeList.add( TypeOfLossExt.TC_67_00042 ) //67 - Collapse Due to other covered causes, including Sinkhole Collapse
      codeList.add( TypeOfLossExt.TC_66_00041 ) //66 - Collapse Due to Weight of Snow, Ice, Sleet
      codeList.add( TypeOfLossExt.TC_65_00046 ) //65 - Collision
      codeList.add( TypeOfLossExt.TC_03_00060 ) //03 - Explosion
      codeList.add( TypeOfLossExt.TC_41_00066 ) //41 - Fire
      codeList.add( TypeOfLossExt.TC_72_00114 ) //72 - Hail
      codeList.add( TypeOfLossExt.TC_71_00118 ) //71 - Lightning
      codeList.add( TypeOfLossExt.TC_22_00128 ) //22 - Losses due to Acts of Terrorism (Terrorism Risk Insurance Act)
      codeList.add( TypeOfLossExt.TC_07_00213 ) //07 - Theft (including Mysterious Disappearance under Farm Coverage)
      codeList.add( TypeOfLossExt.TC_05_00232 ) //05 - Vandalism and Malicious Mischief
      codeList.add( TypeOfLossExt.TC_42_00244 ) //42 - Wind
      codeList.add( TypeOfLossExt.TC_23_00020 ) //23 - All Other Terrorism Losses
    }
  }
}
