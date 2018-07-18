package util.TypeOfLoss

class Subline496 {

  construct() {

  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    var expType : ExposureType = exposure.ExposureType
    
    switch(expType){
      case "ab_MedPay":
        codeList.add( TypeOfLossExt.TC_20_00129 ) //20 - Medical Expenses
        codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act -  NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
        break;
      case "ab_PersonalInjury":
        codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act -  NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - Including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
        break;
      case "ab_AGG_gl_PropDamage":
      case "ab_AGG_auto_PropDamage":  
        if(expType == "ab_AGG_auto_PropDamage"){
          codeList.add( TypeOfLossExt.TC_72_00050 ) //72 - Commercial Auto PD
        }
        codeList.add( TypeOfLossExt.TC_21_00058 ) //21 - Cumulative Injury PD
        if(expType == "ab_AGG_gl_PropDamage"){
          codeList.add( TypeOfLossExt.TC_73_00059 ) //73 - Employer's Liability
        }
        codeList.add( TypeOfLossExt.TC_22_00171 ) //22 - Other than Cumulative PD - due to all other PD
        codeList.add( TypeOfLossExt.TC_24_00168 ) //24 - Other than Cumulative PD - due to Construction Defects
        codeList.add( TypeOfLossExt.TC_48_00170 ) //48 - Other than Cumulative PD - due to Silica and Silica Related Dust
        codeList.add( TypeOfLossExt.TC_27_00189 ) //27 - Pollution Liability - Clean-up (excl Maryland)
        codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl Maryland) - PD
        codeList.add( TypeOfLossExt.TC_26_00190 ) //26 - Property Damage
        codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
        break;
      case "ab_AGG_gl_BodInjury":
      case "ab_AGG_auto_BodInjury":
        codeList.add( TypeOfLossExt.TC_23_00029 ) //23 - BI Due to Construction Defects
        if(expType == "ab_AGG_auto_BodInjury"){
          codeList.add( TypeOfLossExt.TC_71_00049 ) //71 - Commercial Auto BI
        }
        codeList.add( TypeOfLossExt.TC_11_00057 ) //11 - Cumulative Injury BI
        if(expType == "ab_AGG_gl_BodInjury"){
          codeList.add( TypeOfLossExt.TC_73_00059 ) //73 - Employer's Liability
        }
        codeList.add( TypeOfLossExt.TC_12_00167 ) //12 - Other than Cumulative BI - due to all other BI
        codeList.add( TypeOfLossExt.TC_23_00164 ) //23 - Other than Cumulative BI - due to Construction Defects
        codeList.add( TypeOfLossExt.TC_47_00166 ) //47 - Other than Cumulative BI - due to Silica and Silica Related Dust
        codeList.add( TypeOfLossExt.TC_16_00172 ) //16 - Other than Pollution, Mold, Construction Defects, or Silica and Silica-Related Dust  Liability - BI
        codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
        codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
        codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead Other than expenses included in a qualified offer
        codeList.add( TypeOfLossExt.TC_30_00182 ) //30 - Pollution Liability (MD only) - BI -  for Hazards of Lead Expenses included in a qualified offer - Medical Expenses
        codeList.add( TypeOfLossExt.TC_91_00184 ) //91 - Pollution Liability (MD only) - BI - for Hazards of Lead Expenses included in a qualified offer - Relocation, Rent Subsidy and other incidental expenses
        codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI - Other Than for Hazards of Lead
        codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
        break;
      case "ex_auto_BodInjury":
        codeList.add( TypeOfLossExt.TC_23_00029 ) //23 - BI Due to Construction Defects
        codeList.add( TypeOfLossExt.TC_71_00049 ) //71 - Commercial Auto BI
        codeList.add( TypeOfLossExt.TC_11_00057 ) //11 - Cumulative Injury BI
        codeList.add( TypeOfLossExt.TC_12_00167 ) //12 - Other than Cumulative BI - due to all other BI
        codeList.add( TypeOfLossExt.TC_23_00164 ) //23 - Other than Cumulative BI - due to Construction Defects
        codeList.add( TypeOfLossExt.TC_47_00166 ) //47 - Other than Cumulative BI - due to Silica and Silica Related Dust
        codeList.add( TypeOfLossExt.TC_16_00172 ) //16 - Other than Pollution, Mold, Construction Defects, or Silica and Silica-Related Dust  Liability - BI
        codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
        codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
        codeList.add( TypeOfLossExt.TC_30_00182 ) //30 - Pollution Liability (MD only) - BI -  for Hazards of Lead Expenses included in a qualified offer - Medical Expenses
        codeList.add( TypeOfLossExt.TC_91_00184 ) //91 - Pollution Liability (MD only) - BI - for Hazards of Lead Expenses included in a qualified offer - Relocation, Rent Subsidy and other incidental expenses
        codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI - Other Than for Hazards of Lead
        codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead Other than expenses included in a qualified offer
        codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
        break;
      case "ex_excess_BodInjury":
        codeList.add( TypeOfLossExt.TC_23_00029 ) //23 - BI Due to Construction Defects
        codeList.add( TypeOfLossExt.TC_11_00057 ) //11 - Cumulative Injury BI
        codeList.add( TypeOfLossExt.TC_73_00059 ) //73 - Employer's Liability
        codeList.add( TypeOfLossExt.TC_12_00167 ) //12 - Other than Cumulative BI - due to all other BI
        codeList.add( TypeOfLossExt.TC_23_00164 ) //23 - Other than Cumulative BI - due to Construction Defects
        codeList.add( TypeOfLossExt.TC_47_00166 ) //47 - Other than Cumulative BI - due to Silica and Silica Related Dust
        codeList.add( TypeOfLossExt.TC_16_00172 ) //16 - Other than Pollution, Mold, Construction Defects, or Silica and Silica-Related Dust  Liability - BI
        codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
        codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
        codeList.add( TypeOfLossExt.TC_30_00182 ) //30 - Pollution Liability (MD only) - BI -  for Hazards of Lead Expenses included in a qualified offer - Medical Expenses
        codeList.add( TypeOfLossExt.TC_91_00184 ) //91 - Pollution Liability (MD only) - BI - for Hazards of Lead Expenses included in a qualified offer - Relocation, Rent Subsidy and other incidental expenses
        codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI - Other Than for Hazards of Lead
        codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead Other than expenses included in a qualified offer
        codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
        break;
      case "ex_auto_PropDamage":
        codeList.add( TypeOfLossExt.TC_72_00050 ) //72 - Commercial Auto PD
        codeList.add( TypeOfLossExt.TC_21_00058 ) //21 - Cumulative Injury PD
        codeList.add( TypeOfLossExt.TC_22_00171 ) //22 - Other than Cumulative PD - due to all other PD
        codeList.add( TypeOfLossExt.TC_24_00168 ) //24 - Other than Cumulative PD - due to Construction Defects
        codeList.add( TypeOfLossExt.TC_48_00170 ) //48 - Other than Cumulative PD - due to Silica and Silica Related Dust
        codeList.add( TypeOfLossExt.TC_27_00189 ) //27 - Pollution Liability - Clean-up (excl Maryland)
        codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl Maryland) - PD
        codeList.add( TypeOfLossExt.TC_26_00190 ) //26 - Property Damage
        codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
        break;
      case "ex_excess_PropDamage":
        codeList.add( TypeOfLossExt.TC_21_00058 ) //21 - Cumulative Injury PD
        codeList.add( TypeOfLossExt.TC_73_00059 ) //73 - Employer's Liability
        codeList.add( TypeOfLossExt.TC_22_00171 ) //22 - Other than Cumulative PD - due to all other PD
        codeList.add( TypeOfLossExt.TC_24_00168 ) //24 - Other than Cumulative PD - due to Construction Defects
        codeList.add( TypeOfLossExt.TC_48_00170 ) //48 - Other than Cumulative PD - due to Silica and Silica Related Dust
        codeList.add( TypeOfLossExt.TC_27_00189 ) //27 - Pollution Liability - Clean-up (excl Maryland)
        codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl Maryland) - PD
        codeList.add( TypeOfLossExt.TC_26_00190 ) //26 - Property Damage
        codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
        break;
      default:
        break;
    }

    if(exposure.Claim.LossType == LossType.TC_SPECIALTYES){
        codeList.add( TypeOfLossExt.TC_11_00057 ) //11 - Cumulative Injury BI
        codeList.add( TypeOfLossExt.TC_12_00167 ) //12 - Other than Cumulative BI - due to all other BI
        codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI - Other Than for Hazards of Lead
        codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead Other than expenses included in a qualified offer
        codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
        codeList.add( TypeOfLossExt.TC_16_00172 ) //16 - Other than Pollution, Mold, Construction Defects, or Silica and Silica-Related Dust  Liability - BI
        codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
        codeList.add( TypeOfLossExt.TC_20_00129 ) //20 - Medical Expenses
        codeList.add( TypeOfLossExt.TC_21_00058 ) //21 - Cumulative Injury PD
        codeList.add( TypeOfLossExt.TC_22_00171 ) //22 - Other than Cumulative PD - due to all other PD
        codeList.add( TypeOfLossExt.TC_23_00029 ) //23 - BI Due to Construction Defects
        codeList.add( TypeOfLossExt.TC_23_00164 ) //23 - Other than Cumulative BI - due to Construction Defects
        codeList.add( TypeOfLossExt.TC_24_00168 ) //24 - Other than Cumulative PD - due to Construction Defect
        codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl Maryland) - PD
        codeList.add( TypeOfLossExt.TC_26_00190 ) //26 - Property Damage
        codeList.add( TypeOfLossExt.TC_27_00189 ) //27 - Pollution Liability - Clean-up (excl Maryland)
        codeList.add( TypeOfLossExt.TC_30_00182 ) //30 - Pollution Liability (MD only) - BI -  for Hazards of Lead Expenses included in a qualified offer - Medical Expenses
        codeList.add( TypeOfLossExt.TC_47_00166 ) //47 - Other than Cumulative BI - due to Silica and Silica Related Dust
        codeList.add( TypeOfLossExt.TC_48_00170 ) //48 - Other than Cumulative PD - due to Silica and Silica Related Dust
        codeList.add( TypeOfLossExt.TC_71_00049 ) //71 - Commercial Auto BI
        codeList.add( TypeOfLossExt.TC_72_00050 ) //72 - Commercial Auto PD
        codeList.add( TypeOfLossExt.TC_73_00059 ) //73 - Employer's Liability
        codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
        codeList.add( TypeOfLossExt.TC_91_00184 ) //91 - Pollution Liability (MD only) - BI - for Hazards of Lead Expenses included in a qualified offer - Relocation, Rent Subsidy and other incidental expenses
        codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act -  NOT Nuclear, Biological or Chemical
        codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
    }
  }
}
