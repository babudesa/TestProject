package util.TypeOfLoss;

class Subline338
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    var sublimit : Sublimits = exposure.SublimitsExt
    var expType : ExposureType = exposure.ExposureType
    
    switch(expType){
      case "ab_MedPay":
        codeList.add( TypeOfLossExt.TC_20_00129 ) //20 - Medical Expenses
        codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
        break;
      case "ab_PersonalInjury":
        codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
        break;
      case "ab_PropertyDamage":
      case "ab_AutoPropDam":
        if(sublimit=="027"){ //027 - Products and Completed Operations
          codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl MD) - PD
          codeList.add( TypeOfLossExt.TC_26_00190 ) //26 - Property Damage
          codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        } else {
          codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl MD) - PD
          codeList.add( TypeOfLossExt.TC_26_00190 ) //26 - Property Damage
          codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
        }
        break;
      case "ab_BodilyInjury":
        if(sublimit=="027"){ //027 - Products and Completed Operations
          codeList.add( TypeOfLossExt.TC_37_00032 ) //37 - BI from Accident Involving Animals, Falls, Bites, Goring, Kicking, Trampling and Mauling
          codeList.add( TypeOfLossExt.TC_17_00028 ) //17 - BI from Accident Involving Vehicles, Machinery, Mechanical Apparatus or Electric Shock
          codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead Other than expenses included in a qualified offer
          codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI - Other Than for Hazards of Lead
          codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act -  NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_16_00019 ) //16 - All Other Non-Pollution BI
        } else {
          codeList.add( TypeOfLossExt.TC_37_00032 ) //37 - BI from Accident Involving Animals, Falls, Bites, Goring, Kicking, Trampling and Mauling
          codeList.add( TypeOfLossExt.TC_17_00028 ) //17 - BI from Accident Involving Vehicles, Machinery, Mechanical Apparatus or Electric Shock
          codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead Other than expenses included in a qualified offer
          codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI - Other Than for Hazards of Lead
          codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
          codeList.add( TypeOfLossExt.TC_16_00019 ) //16 - All Other Non-Pollution BI
        }
        break;
      default:
        break;
    }
  }
}
