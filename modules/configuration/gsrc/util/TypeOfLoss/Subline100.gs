package util.TypeOfLoss;

class Subline100
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    codeList.add( TypeOfLossExt.TC_03_00060 ) //03 - Explosion
    codeList.add( TypeOfLossExt.TC_01_00069 ) //01 - Fire and Lightning
    codeList.add( TypeOfLossExt.TC_10_00075 ) //10 - Freezing
    codeList.add( TypeOfLossExt.TC_19_00149 ) //19 - Other - Property  
    codeList.add( TypeOfLossExt.TC_04_00196 ) //04 - Riot, Civil Commotion
    codeList.add( TypeOfLossExt.TC_06_00197 ) //06 - Sprinkler Leakage
    codeList.add( TypeOfLossExt.TC_07_00212 ) //07 - Theft
    codeList.add( TypeOfLossExt.TC_05_00232 ) //05 - Vandalism and Malicious Mischief
    codeList.add( TypeOfLossExt.TC_08_00240 ) //08 - Water Damage  
    codeList.add( TypeOfLossExt.TC_02_00247 ) //02 - Wind and Hail
  }
}
