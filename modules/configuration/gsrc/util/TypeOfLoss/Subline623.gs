package util.TypeOfLoss;

class Subline623
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    var expType : ExposureType = exposure.ExposureType
    var riskState : State = util.TypeOfLoss.helperFunctions.getRiskState( exposure )
    
    switch(expType){
      case "ab_BodilyInjury":
      case "ab_MedPay":
        codeList.add( TypeOfLossExt.TC_97_00088 ) //97 - Garage Liab - Losses Due to Acts of Terrorism
        codeList.add( TypeOfLossExt.TC_05_00106 ) //05 - Garage Liab - Uninsured Motorists - All Other BI
        codeList.add( TypeOfLossExt.TC_35_00110 ) //35 - Garage Liab - Uninsured Motorists - Statutory Cvg - Death (NY or TX)
        codeList.add( TypeOfLossExt.TC_05_00111 ) //05 - Garage Liab - Uninsured Motorists - Statutory Cvg - Excl Death (NY or TX)
        codeList.add( TypeOfLossExt.TC_40_00108 ) //40 - Garage Liab - Uninsured Motorists - SUM Cvg - Death Limit (NY Only) BI
        codeList.add( TypeOfLossExt.TC_39_00109 ) //39 - Garage Liab - Uninsured Motorists - SUM Cvg - Excl Death (NY Only) BI
        codeList.add( TypeOfLossExt.TC_45_00102 ) //45 - Garage Liab - Underinsured Motorists - All Other BI
        codeList.add( TypeOfLossExt.TC_42_00104 ) //42 - Garage Liab - Underinsured Motorists - SUM Cvg - Death Limit - (NY Only) BI
        codeList.add( TypeOfLossExt.TC_41_00105 ) //41 - Garage Liab - Underinsured Motorists - SUM Cvg - Excl Death - (NY Only) BI
        codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
        codeList.add( TypeOfLossExt.TC_45_00221 ) //45 - Underinsured Motorists - All Other BI
        codeList.add( TypeOfLossExt.TC_42_00223 ) //42 - Underinsured Motorists - SUM Cvg - Death Limit - (NY Only) BI
        codeList.add( TypeOfLossExt.TC_41_00224 ) //41 - Underinsured Motorists - SUM Cvg - Excl Death - (NY Only) BI
        codeList.add( TypeOfLossExt.TC_49_00225 ) //49 - Underinsured Motorists BI - Death (TX Only)
        codeList.add( TypeOfLossExt.TC_05_00226 ) //05 - Uninsured Motorists - All Other BI
        codeList.add( TypeOfLossExt.TC_35_00230 ) //35 - Uninsured Motorists - Statutory Cvg - Death (NY or TX)
        codeList.add( TypeOfLossExt.TC_05_00231 ) //05 - Uninsured Motorists - Statutory Cvg - Excl Death (NY or TX)
        codeList.add( TypeOfLossExt.TC_40_00228 ) //40 - Uninsured Motorists - SUM Cvg - Death Limit (NY Only) BI
        codeList.add( TypeOfLossExt.TC_39_00229 ) //39 - Uninsured Motorists - SUM Cvg - Excl Death (NY Only) BI
        break;
      case "ab_PIP":
        if(riskState==typekey.State.TC_HI){
          codeList.add( TypeOfLossExt.TC_86_00001 ) //86 - $5,000 - $5,999 - BI Payments - Paid Losses Only - WITH reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_87_00002 ) //87 - $6,000 - $6,999 - BI Payments - Paid Losses Only - WITH reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_88_00003 ) //88 - $7,000 - $7,999 - BI Payments - Paid Losses Only - WITH reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_89_00004 ) //89 - $8,000 - $8,999 - BI Payments - Paid Losses Only - WITH reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_90_00005 ) //90 - $9,000 - $9,999 - BI Payments - Paid Losses Only - WITH reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_91_00006 ) //91 - $10,000 - $10,999 - BI Payments - Paid Losses Only - WITH reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_38_00025 ) //38 - BI Liability - Hawaii JUP Servicing Carriers
          codeList.add( TypeOfLossExt.TC_01_00021 ) //01 - BI - Payments - Paid Losses only - W/O reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_86_00076 ) //86 - Garage Liab - $5,000 - $5,999 - BI Payments - Paid Losses Only - WITH reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_87_00077 ) //87 - Garage Liab - $6,000 - $6,999 - BI Payments - Paid Losses Only - WITH reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_88_00078 ) //88 - Garage Liab - $8,000 - $7,999 - BI Payments - Paid Losses Only - WITH reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_89_00079 ) //89 - Garage Liab - $8,000 - $8,999 - BI Payments - Paid Losses Only - WITH reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_90_00080 ) //90 - Garage Liab - $9,000 - $9,999 - BI Payments - Paid Losses Only - WITH reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_91_00081 ) //91 - Garage Liab - $10,000 - $10,999 - BI Payments - Paid Losses Only - WITH reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_70_00086 ) //70 - Garage Liab - BI Payments - Paid Losses Only - W\O reduction due to PIP benefit incurred
          codeList.add( TypeOfLossExt.TC_97_00088 ) //97 - Garage Liab - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
        } else {
          codeList.add( TypeOfLossExt.TC_97_00088 ) //97 - Garage Liab - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_23_00091 ) //23 - Garage Liab - No-Fault Losses afforded by virtue of Out-of-state Cvg or the Statutory Requirements of Another State - PD (MI only)
          codeList.add( TypeOfLossExt.TC_21_00090 ) //21 - Garage Liab - No-Fault Losses - Out-of-state Cvg - BI
          codeList.add( TypeOfLossExt.TC_04_00095 ) //04 - Garage Liab - Payments to Other Companies or Reserves under Reimbursement or Subrogation Rights of Another Insurer Which Paid PIP Benefits
          codeList.add( TypeOfLossExt.TC_07_00112 ) //07 - Garage Liab - Voluntary No-Fault - Death Benefit (AR Only)
          codeList.add( TypeOfLossExt.TC_06_00113 ) //06 - Garage Liab - Voluntary No-Fault - Income Disability (AR Only)
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_23_00146 ) //23 - No-Fault Losses afforded by virtue of Out-of-state Cvg or the Statutory Requirements of Another State - PD (MI only)
          codeList.add( TypeOfLossExt.TC_21_00145 ) //21 - No-Fault Losses - Out-of-state Cvg - BI
          codeList.add( TypeOfLossExt.TC_04_00181 ) //04 - Payments to Other Companies or Reserves under Reimbursement or Subrogation Rights of Another Insurer Which Paid PIP Benefits
          codeList.add( TypeOfLossExt.TC_07_00238 ) //07 - Voluntary No-Fault - Death Benefit (AR Only)
          codeList.add( TypeOfLossExt.TC_06_00239 ) //06 - Voluntary No-Fault - Income Disability (AR Only)
		}
        break;
      case "ab_AutoPropDam":
      case "ab_PropertyDamage":      
        codeList.add( TypeOfLossExt.TC_98_00094 ) //98 - Garage Liab - PD Terrorism Loss (including UM and UIM PD)
        codeList.add( TypeOfLossExt.TC_46_00103 ) //46 - Garage Liab - Underinsured Motorists - PD
        codeList.add( TypeOfLossExt.TC_06_00107 ) //06 - Garage Liab - Uninsured Motorists - PD
        codeList.add( TypeOfLossExt.TC_98_00177 ) //98 - PD Terrorism Loss (including UM and UIM PD)
        codeList.add( TypeOfLossExt.TC_46_00222 ) //46 - Underinsured Motorists - PD
        codeList.add( TypeOfLossExt.TC_06_00227 ) //06 - Uninsured Motorists - PD
        break;
      default:
        break;
    }
  }
}
