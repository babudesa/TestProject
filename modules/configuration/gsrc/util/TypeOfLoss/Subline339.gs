package util.TypeOfLoss;

class Subline339
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    var sublimit : Sublimits = exposure.SublimitsExt
    var expType : ExposureType = exposure.ExposureType
    
    switch(expType){
      case "ab_MedPay":
        codeList.add( TypeOfLossExt.TC_11_00057 ) //11 - Cumulative Injury BI
        codeList.add( TypeOfLossExt.TC_12_00167 ) //12 - Other than Cumulative BI - due to all other BI
        codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        break;
      case "ab_PersonalInjury":
        codeList.add( TypeOfLossExt.TC_11_00057 ) //11 - Cumulative Injury BI
        codeList.add( TypeOfLossExt.TC_12_00167 ) //12 - Other than Cumulative BI - due to all other BI
        codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        break;
      case "ab_PropertyDamage":
      case "ab_AutoPropDam":
        if(sublimit=="027"){ //027 - Products and Completed Operations
          codeList.add( TypeOfLossExt.TC_21_00058 ) //21 - Cumulative Injury PD
          codeList.add( TypeOfLossExt.TC_22_00171 ) //22 - Other than Cumulative PD - due to all other PD
          codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        } else {
          codeList.add( TypeOfLossExt.TC_21_00058 ) //21 - Cumulative Injury PD
          codeList.add( TypeOfLossExt.TC_22_00171 ) //22 - Other than Cumulative PD - due to all other PD
          codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        }
        break;
      case "ab_BodilyInjury":
        if(sublimit=="027"){ //027 - Products and Completed Operations
          codeList.add( TypeOfLossExt.TC_11_00057 ) //11 - Cumulative Injury BI
          codeList.add( TypeOfLossExt.TC_12_00167 ) //12 - Other than Cumulative BI - due to all other BI
          codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        } else {
          codeList.add( TypeOfLossExt.TC_11_00057 ) //11 - Cumulative Injury BI
          codeList.add( TypeOfLossExt.TC_12_00167 ) //12 - Other than Cumulative BI - due to all other BI
          codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        }
        break;
      default:
        break;
    }
  }
}
