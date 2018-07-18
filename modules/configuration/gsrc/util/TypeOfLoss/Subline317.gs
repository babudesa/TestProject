package util.TypeOfLoss;

class Subline317
{
  construct()
  {
  }
  
    public static function returnList(codeList : List, exposure : Exposure) {

      var expType : ExposureType = exposure.ExposureType
    
      switch(expType){
        //Defect 6380 - ELD and PLD Subline 317: Remove all TOL codes, except 80 - anicely 7.30.13
        case "el_Indemnity":
        case "el_DutyDefWthnLimits":
        case "el_DutyDefOtsdLimits":
        case "el_LossAdjustExp":
        case "pl_eo":
  	  codeList.add( TypeofLossExt.TC_80_00396 ) //80 - Professional Liability (excluding Management Protection Program Coverages)
        break;
        default:
          codeList.add( TypeOfLossExt.TC_51_00391 ) //51 - Side A Coverage Form (Type of Policy Codes 05, 06, 0F, 0G only)
  	  codeList.add( TypeOfLossExt.TC_54_00392 ) //54 - Fiduciary Liability Coverage Part (Type of Policy Codes 04 and 0E only)
  	  codeList.add( TypeOfLossExt.TC_51_00393 ) //51 - Other Than Side A Coverage Form and Fiduciary Liability Coverage Part (Type of Policy Codes 01, 02, 03, 21, 22, 0B, 0C, 0D, 2B, and 2C) - Losses attributable to Coverage A only
  	  codeList.add( TypeofLossExt.TC_52_00394 ) //52 - Other Than Side A Coverage Form and Fiduciary Liability Coverage Part (Type of Policy Codes 01, 02, 03, 21, 22, 0B, 0C, 0D, 2B, and 2C) - Losses attributable to Coverage B only
  	  codeList.add( TypeofLossExt.TC_53_00395 ) //53 - Other Than Side A Coverage Form and Fiduciary Liability Coverage Part (Type of Policy Codes 02, 03, 22, 0C, 0D, and 2C) - Losses attributable to Coverage C only
  	  codeList.add( TypeofLossExt.TC_80_00396 ) //80 - Professional Liability (excluding Management Protection Program Coverages)
         break;

      }
   }
}
