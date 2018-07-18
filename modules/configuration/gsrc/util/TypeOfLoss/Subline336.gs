package util.TypeOfLoss;

class Subline336
{
  construct()
  {
  }
  
   public static function returnList(codeList : List, exposure : Exposure) {
    var sublimit : Sublimits = exposure.SublimitsExt
    var expType : ExposureType = exposure.ExposureType
    
    switch(expType){
      case "ab_MedPay":
      case "ab_PersonalInjury":
        codeList.add( TypeOfLossExt.TC_11_00057 ) //11 - Cumulative Injury BI
        codeList.add( TypeOfLossExt.TC_12_00167 ) //12 - Other than Cumulative BI - due to all other BI
        codeList.add( TypeOfLossExt.TC_23_00164 ) //23 - Other than Cumulative BI - due to Construction Defects
        codeList.add( TypeOfLossExt.TC_28_00165 ) //28 - Other than Cumulative BI - due to Fungi or Bacteria (Mold) Liability
        codeList.add( TypeOfLossExt.TC_47_00166 ) //47 - Other than Cumulative BI - due to Silica and Silica Related Dust
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
          codeList.add( TypeOfLossExt.TC_24_00168 ) //24 - Other than Cumulative PD - due to Construction Defects
          codeList.add( TypeOfLossExt.TC_29_00169 ) //29 - Other than Cumulative PD - due to Fungi or Bacteria
          codeList.add( TypeOfLossExt.TC_48_00170 ) //48 - Other than Cumulative PD - due to Silica and Silica Related Dust
          codeList.add( TypeOfLossExt.TC_86_00208 ) //86 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_87_00209 ) //87 - Terrorism PD Losses (Including Med Expenses) - ALL Other acts that are Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_96_00210 ) //96 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_85_00211 ) //85 - Terrorism PD Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        } else {
          codeList.add( TypeOfLossExt.TC_24_00178 ) //24 - PD due to Construction Defects
          codeList.add( TypeOfLossExt.TC_29_00179 ) //29 - PD due to Fungi or Bacteria (Mold) Liability
          codeList.add( TypeOfLossExt.TC_48_00180 ) //48 - PD due to Silica and Silica Related Dust
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
          codeList.add( TypeOfLossExt.TC_23_00164 ) //23 - Other than Cumulative BI - due to Construction Defects
          codeList.add( TypeOfLossExt.TC_28_00165 ) //28 - Other than Cumulative BI - due to Fungi or Bacteria (Mold) Liability
          codeList.add( TypeOfLossExt.TC_47_00166 ) //47 - Other than Cumulative BI - due to Silica and Silica Related Dust
          codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        } else {
          codeList.add( TypeOfLossExt.TC_23_00029 ) //23 - BI due to Construction Defects
          codeList.add( TypeOfLossExt.TC_28_00030 ) //28 - BI due to Fungi or Bacteria (Mold) Liability
          codeList.add( TypeOfLossExt.TC_47_00031 ) //47 - BI due to Silica and Silica Related Dust
          codeList.add( TypeOfLossExt.TC_83_00200 ) //83 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_84_00202 ) //84 - Terrorism BI Losses (Including Med Expenses) - All Other Acts - Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_95_00204 ) //95 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - NOT Nuclear, Biological or Chemical
          codeList.add( TypeOfLossExt.TC_82_00206 ) //82 - Terrorism BI Losses (Including Med Expenses) - under the Terrorism Risk Insurance Act - Nuclear, Biological or Chemical
        }
        break;
      default:
        break;
    }
    if(exposure.Claim.LossType == LossType.TC_SPECIALTYES){
        codeList.add( TypeOfLossExt.TC_11_00057 ) //11 - Cumulative Injury BI
        codeList.add( TypeOfLossExt.TC_12_00167 ) //12 - Other than Cumulative BI - due to All Other BI      
        codeList.add( TypeOfLossExt.TC_21_00058 ) //21 - Cumulative Injury PD
        codeList.add( TypeOfLossExt.TC_22_00171 ) //22 - Other than Cumulative PD - due to all other PD
        codeList.add( TypeOfLossExt.TC_23_00029 ) //23 - BI due to Construction Defects
        codeList.add( TypeOfLossExt.TC_23_00164 ) //23 - Other than Cumulative BI - due to Construction Defects
        codeList.add( TypeOfLossExt.TC_24_00168 ) //24 - Other than Cumulative PD - due to Construction Defects
        codeList.add( TypeOfLossExt.TC_24_00178 ) //24 - PD due to Construction Defects
        codeList.add( TypeOfLossExt.TC_28_00030 ) //28 - BI due to Fungi or Bacteria (Mold) Liability
        codeList.add( TypeOfLossExt.TC_28_00165 ) //28 - Other than Cumulative BI - due to Fungi or Bacteria (Mold) Liability
        codeList.add( TypeOfLossExt.TC_29_00169 ) //29 - Other than Cumulative PD - due to Fungi or Bacteria
        codeList.add( TypeOfLossExt.TC_29_00179 ) //29 - PD due to Fungi or Bacteria (Mold) Liability
        codeList.add( TypeOfLossExt.TC_30_00182 ) //30 - Pollution Liability (MD only) - BI -  for Hazards of Lead Expenses included in a qualified offer - Medical Expenses
        codeList.add( TypeOfLossExt.TC_47_00031 ) //47 - BI due to Silica and Silica Related Dust
        codeList.add( TypeOfLossExt.TC_47_00166 ) //47 - Other than Cumulative BI - due to Silica and Silica Related Dust
        codeList.add( TypeOfLossExt.TC_48_00170 ) //48 - Other than Cumulative PD - due to Silica and Silica Related Dust
        codeList.add( TypeOfLossExt.TC_48_00180 ) //48 - PD due to Silica and Silica Related Dust
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
