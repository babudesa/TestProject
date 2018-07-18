package util.TypeOfLoss;

class Subline325
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    var sublimit : Sublimits = exposure.SublimitsExt
    var expType : ExposureType = exposure.ExposureType
    //Defect 8396 - added Electronic Data Liability coverage
    if(exposure.Claim.LossType == LossType.TC_AGRILIABILITY && exposure.Coverage.Type == CoverageType.TC_AB_FGL_ELECDATA){
      codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
    } else {
      switch(expType){
        case "ab_AGG_auto_BodInjury":
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
        case "ab_AGG_gl_BodInjury":
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
        case "ab_AGG_auto_PropDamage":
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
        case "ab_AGG_gl_PropDamage":
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
        case "ab_BodilyInjury":
        case "ab_PersonalInjury":
          if(sublimit=="027"){ //027 - Products and Completed Operations
            codeList.add( TypeOfLossExt.TC_11_00057 ) //11 - Cumulative Injury BI
            codeList.add( TypeOfLossExt.TC_12_00167 ) //12 - Other than Cumulative BI - due to all other BI
            codeList.add( TypeOfLossExt.TC_23_00164 ) //23 - Other than Cumulative BI - due to Construction Defects
            codeList.add( TypeOfLossExt.TC_47_00166 ) //47 - Other than Cumulative BI - due to Silica and Silica Related Dust
            codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
          } else {
            codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
            codeList.add( TypeOfLossExt.TC_23_00029 ) //23 - BI due to Construction Defects
            codeList.add( TypeOfLossExt.TC_23_00164 ) //23 - Other than Cumulative BI - due to Construction Defects
            codeList.add( TypeOfLossExt.TC_47_00166 ) //47 - Other than Cumulative BI - due to Silica and Silica Related Dust
            codeList.add( TypeOfLossExt.TC_16_00172 ) //16 - Other than Pollution, Mold, Construction Defects, or Silica and Silica-Related Dust  Liability - BI
            codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
            codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
            codeList.add( TypeOfLossExt.TC_30_00182 ) //30 - Pollution Liability (MD only) - BI -  for Hazards of Lead Expenses included in a qualified offer - Medical Expenses
            codeList.add( TypeOfLossExt.TC_91_00184 ) //91 - Pollution Liability (MD only) - BI - for Hazards of Lead Expenses included in a qualified offer - Relocation, Rent Subsidy and other incidental expenses
            codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI - Other Than for Hazards of Lead
            codeList.add( TypeOfLossExt.TC_90_00387 ) //90 - Residential Fuel Tank Coverage (Massachusetts Only) - All Other
            codeList.add( TypeOfLossExt.TC_15_00388 ) //15 - Residential Fuel Tank Coverage (Massachusetts Only) - BI
            codeList.add( TypeOfLossExt.TC_27_00389 ) //27 - Residential Fuel Tank Coverage (Massachusetts Only) - Response Action Costs
            codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
    	  	  codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act -  NOT Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
    	  	}
          break;  
        case "ab_MedPay":
          codeList.add( TypeOfLossExt.TC_20_00129 ) //20 - Medical Expenses
          codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
          codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
          break;
        case "ab_PropertyDamage":
          if(sublimit=="027"){ //027 - Products and Completed Operations
            codeList.add( TypeOfLossExt.TC_21_00058 ) //21 - Cumulative Injury PD
            codeList.add( TypeOfLossExt.TC_22_00171 ) //22 - Other than Cumulative PD - due to all other PD
            codeList.add( TypeOfLossExt.TC_24_00168 ) //24 - Other than Cumulative PD - due to Construction Defects
            codeList.add( TypeOfLossExt.TC_48_00170 ) //48 - Other than Cumulative PD - due to Silica and Silica Related Dust 
            codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
          } else {
            codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
            codeList.add( TypeOfLossExt.TC_48_00180 ) //48 - PD due to Silica and Silica Related Dust          
            codeList.add( TypeOfLossExt.TC_27_00189 ) //27 - Pollution Liability - Clean-up (excl MD)
            codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl MD) - PD
            codeList.add( TypeOfLossExt.TC_26_00190 ) //26 - Property Damage
            codeList.add( TypeOfLossExt.TC_90_00387 ) //90 - Residential Fuel Tank Coverage (Massachusetts Only) - All Other
            codeList.add( TypeOfLossExt.TC_25_00390 ) //25 - Residential Fuel Tank Coverage (Massachusetts Only) - PD
            codeList.add( TypeOfLossExt.TC_27_00389 ) //27 - Residential Fuel Tank Coverage (Massachusetts Only) - Response Action Costs
            codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
           }
          break;
        case "en_bodilyinjury" :
            codeList.add( TypeOfLossExt.TC_23_00029 ) //23 - BI due to Construction Defects
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
            codeList.add( TypeOfLossExt.TC_15_00388 ) //15 - Residential Fuel Tank Coverage (Massachusetts Only) - BI
            codeList.add( TypeOfLossExt.TC_27_00389 ) //27 - Residential Fuel Tank Coverage (Massachusetts Only) - Response Action Costs
            codeList.add( TypeOfLossExt.TC_90_00387 ) //90 - Residential Fuel Tank Coverage (Massachusetts Only) - All Other
            codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
            codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
          break;
        case "en_propertydamage" :
        case "en_cleanup" :
            codeList.add( TypeOfLossExt.TC_72_00050 ) //72 - Commercial Auto PD (Auto PD Feature only)
            codeList.add( TypeOfLossExt.TC_21_00058 ) //21 - Cumulative Injury PD
            codeList.add( TypeOfLossExt.TC_73_00059 ) //73 - Employer's Liability (GL PD Feature only)
            codeList.add( TypeOfLossExt.TC_24_00168 ) //24 - Other than Cumulative PD - due to Construction Defects
            codeList.add( TypeOfLossExt.TC_29_00169 ) //29 - Other Than Cumulative PD - due to Fungi or Bacteria (Mold) Liability
            codeList.add( TypeOfLossExt.TC_48_00170 ) //48 - Other than Cumulative PD - due to Silica and Silica Related Dust 
            codeList.add( TypeOfLossExt.TC_22_00171 ) //22 - Other than Cumulative PD - due to all other PD
            codeList.add( TypeOfLossExt.TC_27_00189 ) //27 - Pollution Liability - Cleanup (excl MD)
            codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl MD) - PD
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
      //cmullin - 2.19.14 - adding default codes for E&S testing only. Actual codes to be added/updated later....
      if(exposure.Claim.LossType == LossType.TC_SPECIALTYES and exposure.Claim.Policy.PolicyType != PolicyType.TC_PRX){
          codeList.add( TypeOfLossExt.TC_11_00057 ) //11 - Cumulative Injury BI        
          codeList.add( TypeOfLossExt.TC_12_00167 ) //12 - Other than Cumulative BI - due to all other BI
          codeList.add( TypeOfLossExt.TC_15_00187 ) //15 - Pollution Liability (except MD) - BI - other than MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_15_00185 ) //15 - Pollution Liability (MD only) - BI for Hazards of Lead other than expenses included in a qualified offer
          codeList.add( TypeOfLossExt.TC_15_00183 ) //15 - Pollution Liability (MD only) - BI for other than Hazards of Lead
          codeList.add( TypeOfLossExt.TC_15_00388 ) //15 - Residential Fuel Tank Coverage (Massachusetts Only) - BI
          codeList.add( TypeOfLossExt.TC_16_00172 ) //16 - Other than Pollution, Mold, Construction Defects, or Silica and Silica-Related Dust  Liability - BI
          codeList.add( TypeOfLossExt.TC_18_00186 ) //18 - Pollution Liability (except MD) - BI - MA Lead Poisoning, NJ Hazards of Lead Loss, and RI Lead Poisoning
          codeList.add( TypeOfLossExt.TC_20_00129 ) //20 - Medical Expenses
          codeList.add( TypeOfLossExt.TC_21_00058 ) //21 - Cumulative Injury PD
          codeList.add( TypeOfLossExt.TC_22_00171 ) //22 - Other than Cumulative PD - due to all other PD
          codeList.add( TypeOfLossExt.TC_23_00029 ) //23 - BI Due to Construction Defects
          codeList.add( TypeOfLossExt.TC_23_00164 ) //23 - Other than Cumulative BI - due to Construction Defects
          codeList.add( TypeOfLossExt.TC_24_00168 ) //24 - Other than Cumulative PD - due to Construction Defects
          codeList.add( TypeOfLossExt.TC_25_00188 ) //25 - Pollution Liability (excl Maryland) - PD
          codeList.add( TypeOfLossExt.TC_25_00390 ) //25 - Residential Fuel Tank Coverage (Massachusetts Only) - PD
          codeList.add( TypeOfLossExt.TC_26_00190 ) //26 - Property Damage
          codeList.add( TypeOfLossExt.TC_27_00189 ) //27 - Pollution Liability - Clean-up (excl Maryland)
          codeList.add( TypeOfLossExt.TC_27_00389 ) //27 - Residential Fuel Tank Coverage (Massachusetts Only) - Response Action Costs
          codeList.add( TypeOfLossExt.TC_30_00182 ) //30 - Pollution Liability (MD only) - BI for Hazards of Lead Expenses incl in a qualified offer-Medical Expense
          codeList.add( TypeOfLossExt.TC_47_00166 ) //47 - Other than Cumulative BI - due to Silica and Silica Related Dust
          codeList.add( TypeOfLossExt.TC_48_00170 ) //48 - Other than Cumulative PD - due to Silica and Silica Related Dust
          codeList.add( TypeOfLossExt.TC_48_00180 ) //48 - PD due to Silica and Silica Related Dust           
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
          codeList.add( TypeOfLossExt.TC_90_00387 ) //90 - Residential Fuel Tank Coverage (Massachusetts Only) - All Other
          codeList.add( TypeOfLossExt.TC_91_00184 ) //91 - Pollution Liability (MD only) - BI for Hazards of Lead Expenses incl in a qualified offer-Relocation, Rent Subsidy, other incidental exp
          codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
      }
      
      if(exposure.Claim.Policy.PolicyType == PolicyType.TC_PRX){
        codeList.add( TypeOfLossExt.TC_94_00432 ) //94 - Reimbursement for expenses incurred because of a product recall or product tampering
      }
      
      if(exposure.Claim.LossType == LossType.TC_MERGACQU){
        codeList.add( TypeOfLossExt.TC_90_00017 ) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
      }
      if(exposure.Claim.LossType == LossType.TC_EXECLIABDIV and (expType == ExposureType.TC_EL_DUTYDEFOTSDLIMITS or expType == ExposureType.TC_EL_DUTYDEFWTHNLIMITS or expType == ExposureType.TC_EL_INDEMNITY
        or expType == ExposureType.TC_EL_LOSSADJUSTEXP)){
          codeList.add(TypeOfLossExt.TC_90_00017) //90 - All Other Losses - including but not limited to Personal or Advertising Injury, Fire Damage Liability and E-Commerce
      }
    }
  }
}