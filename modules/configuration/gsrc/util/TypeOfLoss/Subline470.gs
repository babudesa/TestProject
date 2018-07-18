package util.TypeOfLoss;

class Subline470
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    if(exposure.SPP_LossLocationExt=="insured"){
      codeList.add( TypeOfLossExt.TC_16_00007 ) //16 - All Marine Perils including Sinking, Stranding, General Average and Salvage
      codeList.add( TypeOfLossExt.TC_14_00033 ) //14 - Burglary, Robbery, Including Hijacking
      codeList.add( TypeOfLossExt.TC_17_00043 ) //17 - Collapse, Subsidence, Landslide or Breakage
      codeList.add( TypeOfLossExt.TC_11_00064 ) //11 - Fire
      codeList.add( TypeOfLossExt.TC_18_00073 ) //18 - Flood/Water Damage including Sprinkler Leakage
      codeList.add( TypeOfLossExt.TC_12_00150 ) //12 - Other Extended Coverage Perils, V and MM and Earthquake
      codeList.add( TypeOfLossExt.TC_1B_00191 ) //1B - Property Damage Liability (Part II)
      codeList.add( TypeOfLossExt.TC_15_00217 ) //15 - Theft, Non-Delivery, Mysterious Disappearance, Pilferage and Shortage (excluding Burglary, Robbery and Hijacking)
      codeList.add( TypeOfLossExt.TC_13_00219 ) //13 - Transportation Perils
      codeList.add( TypeOfLossExt.TC_1A_00248 ) //1A - Wind and Hail
      codeList.add( TypeOfLossExt.TC_19_00009 ) //19 - All Other
    } else {
      codeList.add( TypeOfLossExt.TC_26_00008 ) //26 - All Marine Perils including Sinking, Stranding, General Average and Salvage
      codeList.add( TypeOfLossExt.TC_24_00034 ) //24 - Burglary, Robbery, Including Hijacking
      codeList.add( TypeOfLossExt.TC_27_00044 ) //27 - Collapse, Subsidence, Landslide or Breakage
      codeList.add( TypeOfLossExt.TC_21_00065 ) //21 - Fire
      codeList.add( TypeOfLossExt.TC_28_00074 ) //28 - Flood/Water Damage including Sprinkler Leakage
      codeList.add( TypeOfLossExt.TC_22_00151 ) //22 - Other Extended Coverage Perils, V and MM and Earthquake
      codeList.add( TypeOfLossExt.TC_2B_00192 ) //2B - Property Damage Liability (Part II)
      codeList.add( TypeOfLossExt.TC_25_00218 ) //25 - Theft, Non-Delivery, Mysterious Disappearance, Pilferage and Shortage (excluding Burglary, Robbery and Hijacking)
      codeList.add( TypeOfLossExt.TC_23_00220 ) //23 - Transportation Perils
      codeList.add( TypeOfLossExt.TC_2A_00249 ) //2A - Wind and Hail
      codeList.add( TypeOfLossExt.TC_29_00010 ) //29 - All Other
    }
  }
}
