package util.TypeOfLoss;

class Subline635
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    var expType : ExposureType = exposure.ExposureType
    var riskState : State = util.TypeOfLoss.helperFunctions.getRiskState( exposure )
    
    switch(expType){
      case "ab_MedPay":
        if(riskState=="HI"){
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_29_00134 ) //29 - No Fault Additional/Excess Benefits - All Other No-Fault
          codeList.add( TypeOfLossExt.TC_28_00135 ) //28 - No Fault Additional/Excess Benefits - Alternative Medicine
          codeList.add( TypeOfLossExt.TC_26_00136 ) //26 - No Fault Additional/Excess Benefits - Death Benefits
          codeList.add( TypeOfLossExt.TC_27_00137 ) //27 - No Fault Additional/Excess Benefits - Funeral Expenses
          codeList.add( TypeOfLossExt.TC_24_00138 ) //24 - No Fault Additional/Excess Benefits - Medical Expense - chiropractic
          codeList.add( TypeOfLossExt.TC_23_00139 ) //23 - No Fault Additional/Excess Benefits - Medical Expense - other than chiropractic
          codeList.add( TypeOfLossExt.TC_25_00140 ) //25 - No Fault Additional/Excess Benefits - Work Loss
          codeList.add( TypeOfLossExt.TC_16_00141 ) //16 - No Fault Basic Benefits - Medical Expense - chiropractic
          codeList.add( TypeOfLossExt.TC_11_00142 ) //11 - No Fault Basic Benefits - Medical Expense other than chiropractic
          codeList.add( TypeOfLossExt.TC_19_00133 ) //19 - No Fault - Non Split Reserves
        } else {
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_33_00148 ) //33 - No Fault Basic Benefits - Excess Benefits Portion (except NY OBEL coverage)
          codeList.add( TypeOfLossExt.TC_12_00143 ) //12 - No Fault Basic Benefits - Income Loss (including NY OBEL coverage)
          codeList.add( TypeOfLossExt.TC_11_00144 ) //11 - No Fault Basic Benefits - Medical Expense (For NY OBEL - excluding physical or occupational therapy and rehabilitaion)
          codeList.add( TypeOfLossExt.TC_19_00147 ) //19 - No Fault Reserves - Basic Benefits Portion Non-Split Reserves (including NY OBEL coverage)
          codeList.add( TypeOfLossExt.TC_59_00198 ) //59 - Subrogation - Basic Benefits Recoverable Under Tort Liability
          codeList.add( TypeOfLossExt.TC_69_00199 ) //69 - Subrogation - Excess Benefits Recoverable Under Tort Liability
          codeList.add( TypeOfLossExt.TC_13_00018 ) //13 - All Other No-Fault Basic Benefits (For NY OBEL - excluding physical or occupational therapy and rehabilitaion)
        }
        break;
      case "ab_PIP":
        if(riskState=="HI"){
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_29_00134 ) //29 - No Fault Additional/Excess Benefits - All Other No-Fault
          codeList.add( TypeOfLossExt.TC_28_00135 ) //28 - No Fault Additional/Excess Benefits - Alternative Medicine
          codeList.add( TypeOfLossExt.TC_26_00136 ) //26 - No Fault Additional/Excess Benefits - Death Benefits
          codeList.add( TypeOfLossExt.TC_27_00137 ) //27 - No Fault Additional/Excess Benefits - Funeral Expenses
          codeList.add( TypeOfLossExt.TC_24_00138 ) //24 - No Fault Additional/Excess Benefits - Medical Expense - chiropractic
          codeList.add( TypeOfLossExt.TC_23_00139 ) //23 - No Fault Additional/Excess Benefits - Medical Expense - other than chiropractic
          codeList.add( TypeOfLossExt.TC_25_00140 ) //25 - No Fault Additional/Excess Benefits - Work Loss
          codeList.add( TypeOfLossExt.TC_16_00141 ) //16 - No Fault Basic Benefits - Medical Expense - chiropractic
          codeList.add( TypeOfLossExt.TC_11_00142 ) //11 - No Fault Basic Benefits - Medical Expense other than chiropractic
          codeList.add( TypeOfLossExt.TC_19_00133 ) //19 - No Fault - Non Split Reserves
        } else {
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_33_00148 ) //33 - No Fault Basic Benefits - Excess Benefits Portion (except NY OBEL coverage)
          codeList.add( TypeOfLossExt.TC_12_00143 ) //12 - No Fault Basic Benefits - Income Loss (including NY OBEL coverage)
          codeList.add( TypeOfLossExt.TC_11_00144 ) //11 - No Fault Basic Benefits - Medical Expense (For NY OBEL - excluding physical or occupational therapy and rehabilitaion)
          codeList.add( TypeOfLossExt.TC_19_00147 ) //19 - No Fault Reserves - Basic Benefits Portion Non-Split Reserves (including NY OBEL coverage)
          codeList.add( TypeOfLossExt.TC_59_00198 ) //59 - Subrogation - Basic Benefits Recoverable Under Tort Liability
          codeList.add( TypeOfLossExt.TC_69_00199 ) //69 - Subrogation - Excess Benefits Recoverable Under Tort Liability
          codeList.add( TypeOfLossExt.TC_13_00018 ) //13 - All Other No-Fault Basic Benefits (For NY OBEL - excluding physical or occupational therapy and rehabilitaion)
        }
        break;
      default:
        break;
    }
  }
}
