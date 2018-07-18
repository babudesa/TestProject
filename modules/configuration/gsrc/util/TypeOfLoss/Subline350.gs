package util.TypeOfLoss;

class Subline350
{
  construct()
  {
  }
  
   public static function returnList(codeList : List, exposure : Exposure) {
    var sublimit : Sublimits = exposure.SublimitsExt
    var expType : ExposureType = exposure.ExposureType
    
    switch(expType){
      case "ab_MedPay":
        codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
        codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
        codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead Other than expenses included in a qualified offer
        codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI - Other Than for Hazards of Lead
        codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act -  NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        break;
      case "ab_PersonalInjury":
        codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
        codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
        codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead Other than expenses included in a qualified offer
        codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI - Other Than for Hazards of Lead
        codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act -  NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        break;
      case "ab_PropertyDamage":
      case "ab_AutoPropDam":
        if(sublimit=="027"){ //027 - Products and Completed Operations
          codeList.add( TypeOfLossExt.TC_27_00189 ) //27 - Pollution Liability - Clean-up (excl MD)
          codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl MD) - PD
          codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        } else {
          codeList.add( TypeOfLossExt.TC_27_00189 ) //27 - Pollution Liability - Clean-up (excl MD)
          codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl MD) - PD
          codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        }
        break;
      case "ab_BodilyInjury":
        if(sublimit=="027"){ //027 - Products and Completed Operations
          codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead Other than expenses included in a qualified offer
          codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI - Other Than for Hazards of Lead
          codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act -  NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        } else {
          codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead Other than expenses included in a qualified offer
          codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI - Other Than for Hazards of Lead
          codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act -  NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        }
        break;
      case "en_bodilyinjury" :
          codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead 
          codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead Other than expenses included in a qualified offer
          codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI - Other Than for Hazards of Lead
          codeList.add( TypeOfLossExt.TC_15_00388 ) //15 - Residential Fuel Tank Coverage (MA Only)
          codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act -  NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        break;
      case "en_propertydamage" :
      case "en_cleanup" :
          codeList.add( TypeOfLossExt.TC_27_00189 ) //27 - Pollution Liability - Cleanup (excl MD)
          codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl MD) - PD
          codeList.add( TypeOfLossExt.TC_25_00390 ) //25 - Residential Fuel Tank Coverage (MA Only)
          codeList.add( TypeOfLossExt.TC_27_00389 ) //27 - Residential Fuel Tank Coverage(MA Only)
          codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        break; 
        default:
        break;
    }
      if(exposure.Claim.LossType == LossType.TC_SPECIALTYES){
          codeList.add( TypeOfLossExt.TC_1A_00248 ) //1A - Wind and Hail
          codeList.add( TypeOfLossExt.TC_1B_00191 ) //1B - Property Damage Liability (Part II)
          codeList.add( TypeOfLossExt.TC_11_00064 ) //11 - Fire
          codeList.add( TypeOfLossExt.TC_12_00150 ) //12 - Other Extended Coverage Perils, V and MM and Earthquake
          codeList.add( TypeOfLossExt.TC_13_00219 ) //13 - Transportation Perils
          codeList.add( TypeOfLossExt.TC_14_00033 ) //14 - Burglary, Robbery, Including Hijacking
          codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead Other than expenses included in a qualified offer
          codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI for other than Hazards of Lead
          codeList.add( TypeOfLossExt.TC_15_00217 ) //15 - Theft, Non-Delivery, Mysterious Disappearance, Pilferage and Shortage (excluding Burglary, Robbery and Hijacking)
          codeList.add( TypeOfLossExt.TC_16_00007 ) //16 - All Marine Perils including Sinking, Stranding, General Average and Salvage
          codeList.add( TypeOfLossExt.TC_17_00043 ) //17 - Collapse, Subsidence, Landslide or Breakage
          codeList.add( TypeOfLossExt.TC_18_00073 ) //18 - Flood/Water Damage including Sprinkler Leakage
          codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_19_00009 ) //19 - All Other
          codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl Maryland) - PD
          codeList.add( TypeOfLossExt.TC_27_00189 ) //27 - Pollution Liability - Clean-up (excl Maryland)              
          codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical        
    }
   }
}
