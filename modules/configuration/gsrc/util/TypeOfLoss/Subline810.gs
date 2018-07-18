package util.TypeOfLoss

class Subline810 {

    construct() {

    }
    
    public static function returnList(codeList : List, exposure : Exposure) {
      
      if(util.WCHelper.isWCorELLossType(exposure.Claim)){
            codeList.add( TypeOfLossExt.TC_03_00810 ) // 03 - Cumulative Injury Other Than Disease
            codeList.add( TypeOfLossExt.TC_02_00810 ) // 02 - Occupational Disease       
            codeList.add( TypeOfLossExt.TC_01_00810 ) // 01 - Trauma 

             
     }  
   }
   
    public static function returnList(codeList : List, claim : Claim) {
      
      if(util.WCHelper.isWCorELLossType(claim)){
            codeList.add( TypeOfLossExt.TC_03_00810 ) // 03 - Cumulative Injury Other Than Disease
            codeList.add( TypeOfLossExt.TC_02_00810 ) // 02 - Occupational Disease       
            codeList.add( TypeOfLossExt.TC_01_00810 ) // 01 - Trauma 
     }  
   }
}
