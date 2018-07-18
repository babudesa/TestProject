package util.TypeOfLoss;

class Subline970
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    codeList.add( TypeOfLossExt.TC_01_00253 ) //01 - Boiler and Pressure Vessels/Pressure or Vacuum Equipment
    codeList.add( TypeOfLossExt.TC_04_00256 ) //04 - Diagnostic Equipment
    codeList.add( TypeOfLossExt.TC_02_00254 ) //02 - Mechanical and Electrical Equipment
    codeList.add( TypeOfLossExt.TC_03_00255 ) //03 - Production Machinery
    codeList.add( TypeOfLossExt.TC_09_00257 ) //09 - All Other
  }
}
