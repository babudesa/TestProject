package util.TypeOfLoss;

class Subline620
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    var expType : ExposureType = exposure.ExposureType
    var riskState : State = util.TypeOfLoss.helperFunctions.getRiskState( exposure )
    
    switch(expType){
      case typekey.ExposureType.TC_AB_MEDPAY:
        if (riskState == typekey.State.TC_MA){
          codeList.add( TypeOfLossExt.TC_05_00439 ) //05 - Medical Payments
        } else {
          codeList.add( TypeOfLossExt.TC_97_00088 ) //97 - Garage Liab - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_02_00089 ) //02 - Garage Liab - Medical Payments
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_02_00130 ) //02 - Medical Payments
          codeList.add( TypeOfLossExt.TC_12_00236 ) //12 - Virginia Income Loss Coverage
          codeList.add( TypeOfLossExt.TC_11_00237 ) //11 - Virginia Medical Expense Payments (excl Garage)
        }
        break;
      case typekey.ExposureType.TC_AB_PIP:
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
          codeList.add( TypeOfLossExt.TC_70_00087 ) //70 - Garage Liab - BI - Reserves
          codeList.add( TypeOfLossExt.TC_97_00088 ) //97 - Garage Liab - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
        } else if (riskState == typekey.State.TC_MA){
          codeList.add( TypeOfLossExt.TC_14_00437 ) //14 - Bodily Injury to Others - Inter or Intra Company Reimbursements resulting from PIP (No-Fault) claims arising out of accidents occurring off the ways of the Commonwealth or claims out of Massachusetts
          codeList.add( TypeOfLossExt.TC_11_00438 ) //11 - Bodily Injury to Others - Inter or Intra Company Reimbursements resulting from PIP (No Fault) claims (excluding claims covered under Type of Loss code 14)
        } else {
          codeList.add( TypeOfLossExt.TC_97_00088 ) //97 - Garage Liab - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_23_00091 ) //23 - Garage Liab - No-Fault Losses afforded by virtue of Out-of-state Cvg or the Statutory Requirements of Another State - PD (MI only)
          codeList.add( TypeOfLossExt.TC_21_00090 ) //21 - Garage Liab - No-Fault Losses - Out-of-state Cvg - BI
          codeList.add( TypeOfLossExt.TC_04_00095 ) //04 - Garage Liab - Payments to Other Companies or Reserves under Reimbursement or Subrogation Rights of Another Insurer Which Paid PIP Benefits
          codeList.add( TypeOfLossExt.TC_07_00112 ) //07 - Garage Liab - Voluntary No-Fault - Death Benefit (AR Only)
          codeList.add( TypeOfLossExt.TC_06_00113 ) //06 - Garage Liab - Voluntary No-Fault - Income Disability (AR Only)
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_21_00145 ) //21 - No-Fault Losses - Out-of-state Cvg - BI
          codeList.add( TypeOfLossExt.TC_23_00146 ) //23 - No-Fault Losses afforded by virtue of Out-of-state Cvg or the Statutory Requirements of Another State - PD (MI only)
          codeList.add( TypeOfLossExt.TC_04_00181 ) //04 - Payments to Other Companies or Reserves under Reimbursement or Subrogation Rights of Another Insurer Which Paid PIP Benefits
          codeList.add( TypeOfLossExt.TC_07_00238 ) //07 - Voluntary No-Fault - Death Benefit (AR Only)
          codeList.add( TypeOfLossExt.TC_06_00239 ) //06 - Voluntary No-Fault - Income Disability (AR Only)
        }
        break;
      default:
        break;
    }
  }
}
