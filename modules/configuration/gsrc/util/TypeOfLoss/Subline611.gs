package util.TypeOfLoss;

class Subline611
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    var expType : ExposureType = exposure.ExposureType
    var riskState : State = util.TypeOfLoss.helperFunctions.getRiskState( exposure )
    
    switch(expType){
      case typekey.ExposureType.TC_AB_BODILYINJURY:
        if(riskState==typekey.State.TC_HI){
          codeList.add( TypeOfLossExt.TC_01_00022 ) //01 - BI - Reserves
          codeList.add( TypeOfLossExt.TC_38_00025 ) //38 - BI Liability - Hawaii JUP Servicing Carriers
          codeList.add( TypeOfLossExt.TC_86_00001 ) //86 - $5,000 - $5,999 - BI - Payments - Paid Losses only - WITH reduction due to PIP benefit incurred.
          codeList.add( TypeOfLossExt.TC_87_00002 ) //87 - $6,000 - $6,999 - BI - Payments - Paid Losses only - WITH reduction due to PIP benefit incurred.
          codeList.add( TypeOfLossExt.TC_88_00003 ) //88 - $7,000 - $7,999 - BI - Payments - Paid Losses only - WITH reduction due to PIP benefit incurred.
          codeList.add( TypeOfLossExt.TC_89_00004 ) //89 - $8,000 - $8,999 - BI - Payments - Paid Losses only - WITH reduction due to PIP benefit incurred.
          codeList.add( TypeOfLossExt.TC_90_00005 ) //90 - $9,000 - $9,999 - BI - Payments - Paid Losses only - WITH reduction due to PIP benefit incurred.
          codeList.add( TypeOfLossExt.TC_91_00006 ) //91 - $10,000  BI - Payments - Paid Losses only - WITH reduction due to PIP benefit incurred.
          codeList.add( TypeOfLossExt.TC_70_00087 ) //70 - Garage Liab - BI - Reserves
          codeList.add( TypeOfLossExt.TC_86_00076 ) //86 - Garage Liab - $5,000 - $5,999 - BI - Payments - Paid Losses only - WITH reduction due to PIP benefit incurred.
          codeList.add( TypeOfLossExt.TC_87_00077 ) //87 - Garage Liab - $6,000 - $6,999 - BI - Payments - Paid Losses only - WITH reduction due to PIP benefit incurred.
          codeList.add( TypeOfLossExt.TC_88_00078 ) //88 - Garage Liab - $7,000 - $7,999 - BI - Payments - Paid Losses only - WITH reduction due to PIP benefit incurred.
          codeList.add( TypeOfLossExt.TC_89_00079 ) //89 - Garage Liab - $8,000 - $8,999 - BI - Payments - Paid Losses only - WITH reduction due to PIP benefit incurred.
          codeList.add( TypeOfLossExt.TC_90_00080 ) //90 - Garage Liab - $9,000 - $9,999 - BI - Payments - Paid Losses only - WITH reduction due to PIP benefit incurred.
          codeList.add( TypeOfLossExt.TC_91_00081 ) //91 - Garage Liab - $10,000 - Payments - Paid Losses only - WITH reduction due to PIP benefit incurred.
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
        }
        else if (util.CommAutoHelper.isCommAutoLossType(exposure.Claim) and riskState == typekey.State.TC_MA){
          codeList.add( TypeOfLossExt.TC_06_00458 ) //06 - Bodily Injury Caused by an Uninsured Automobile
          codeList.add( TypeOfLossExt.TC_07_00459 ) //07 - Bodily Injury Caused by an Underinsured Automobile
          codeList.add( TypeOfLossExt.TC_97_00433 ) //97 - Bodily Injury Loss Due to Acts of Terrorism (includes Bodily Injury Caused by an Uninsured Automobile, Bodily Injury Caused by an Underinsured Automobile and Medical Payments)                                      
          codeList.add( TypeOfLossExt.TC_01_00434 ) //01 - Bodily Injury to Others - Excluding claims covered under Type of Loss Code 02
          codeList.add( TypeOfLossExt.TC_02_00435 ) //02 - Bodily Injury to Others - Guest claims, claims arising out of accidents occurring off the ways of the Commonwealth or claims out of Massachusetts  
          codeList.add( TypeOfLossExt.TC_09_00436 ) //09 - Pollution Liability - Bodily Injury
        }
        else {
          codeList.add( TypeOfLossExt.TC_01_00023 ) //01 - BI Liability - All Other
          codeList.add( TypeOfLossExt.TC_34_00024 ) //34 - BI Liability - Death Limit Clms (NY and TX only)
          codeList.add( TypeOfLossExt.TC_52_00026 ) //52 - BI Liability - Non-Cargo Pollution
          codeList.add( TypeOfLossExt.TC_53_00027 ) //53 - BI Liability - Supplemental Spousal BI Cvg (NY only)
          codeList.add( TypeOfLossExt.TC_70_00082 ) //70 - Garage Liab - Automobile - All Other BI
          codeList.add( TypeOfLossExt.TC_80_00084 ) //80 - Garage Liab - Automobile BI Death
          codeList.add( TypeOfLossExt.TC_53_00083 ) //53 - Garage Liab - Automobile - Supplemental Spousal BI Cvg (NY only)
          codeList.add( TypeOfLossExt.TC_97_00088 ) //97 - Garage Liab - Losses Due To Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_74_00096 ) //74 - Garage Liab - Premises Liab - All Other BI
          codeList.add( TypeOfLossExt.TC_82_00097 ) //82 - Garage Liab - Premises Liab - BI Death
          codeList.add( TypeOfLossExt.TC_72_00099 ) //72 - Garage Liab - Products and Completed Operations - All Other BI
          codeList.add( TypeOfLossExt.TC_81_00100 ) //81 - Garage Liab - Products and Completed Operations - BI Death
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_09_00012 ) //09 - All Other Liability Cvgs (Death Indemnity, Total Disability, etc)
        }
        break;
      case typekey.ExposureType.TC_AB_PIP:
        if(riskState==typekey.State.TC_HI){
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
        else if (util.CommAutoHelper.isCommAutoLossType(exposure.Claim) and riskState == typekey.State.TC_MA){
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
          codeList.add( TypeOfLossExt.TC_23_00146 ) //23 - No-Fault Losses afforded by virtue of Out-of-state Cvg or the Statutory Requirements of Another State - PD (MI only)
          codeList.add( TypeOfLossExt.TC_21_00145 ) //21 - No-Fault Losses - Out-of-state Cvg - BI
          codeList.add( TypeOfLossExt.TC_04_00181 ) //04 - Payments to Other Companies or Reserves under Reimbursement or Subrogation Rights of Another Insurer Which Paid PIP Benefits
          codeList.add( TypeOfLossExt.TC_07_00238 ) //07 - Voluntary No-Fault - Death Benefit (AR Only)
          codeList.add( TypeOfLossExt.TC_06_00239 ) //06 - Voluntary No-Fault - Income Disability (AR Only)
          
          
        }
        break;
      case typekey.ExposureType.TC_AB_MEDPAY:
        if (util.CommAutoHelper.isCommAutoLossType(exposure.Claim) and riskState == typekey.State.TC_MA) {
          codeList.add( TypeOfLossExt.TC_05_00439 ) //05 - Medical Payments
        }
        else {
          codeList.add( TypeOfLossExt.TC_97_00088 ) //97 - Garage Liab - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_02_00089 ) //02 - Garage Liab - Medical Payments
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_02_00130 ) //02 - Medical Payments
          codeList.add( TypeOfLossExt.TC_12_00236 ) //12 - Virginia Income Loss Coverage
          codeList.add( TypeOfLossExt.TC_11_00237 ) //11 - Virginia Medical Expense Payments (excl Garage)
        }
        break;
      // dnmiller June 2017 - Physical Damage added for Comm Auto Plus Endorsement coverage.
      case typekey.ExposureType.TC_AB_PHYSICALDAMAGE:
        codeList.add( TypeOfLossExt.TC_03_00173 ) //03 - PD Liability - All other
        break;
      case typekey.ExposureType.TC_AB_AUTOPROPDAM:
      case typekey.ExposureType.TC_AB_PROPERTYDAMAGE:      
        if (util.CommAutoHelper.isCommAutoLossType(exposure.Claim) and riskState == typekey.State.TC_MA) {
          codeList.add( TypeOfLossExt.TC_03_00440 ) //03 -  Damage to Someone Else's Property (Property Damage Liability)
          codeList.add( TypeOfLossExt.TC_10_00441 ) //10 - Pollution Liability � Property Damage              
          codeList.add( TypeOfLossExt.TC_98_00442 ) //98 - Property Damage Loss Due to Acts of Terrorism

        }
        else {
          codeList.add( TypeOfLossExt.TC_71_00085 ) //71 - Garage Liab - Automobile PD
          codeList.add( TypeOfLossExt.TC_08_00092 ) //08 - Garage Liab - PD - Property Protection Coverage (MI only)
          codeList.add( TypeOfLossExt.TC_98_00094 ) //98 - Garage Liab - PD Terrorism Loss (including UM and UIM PD)
          codeList.add( TypeOfLossExt.TC_43_00093 ) //43 - Garage Liab - PD - Towed Vehicle Coverage
          codeList.add( TypeOfLossExt.TC_75_00098 ) //75 - Garage Liab - Premises Liab - PD
          codeList.add( TypeOfLossExt.TC_73_00101 ) //73 - Garage Liab - Products and Completed Operations - PD
          codeList.add( TypeOfLossExt.TC_03_00173 ) //03 - PD Liability - All other
          codeList.add( TypeOfLossExt.TC_36_00174 ) //36 - PD Liability - Non-Cargo Pollution
          codeList.add( TypeOfLossExt.TC_08_00175 ) //08 - PD Liability - Property Protection Coverage (MI only)
          codeList.add( TypeOfLossExt.TC_43_00176 ) //43 - PD Liability - Towed Vehicle Coverage
          codeList.add( TypeOfLossExt.TC_98_00177 ) //98 - PD Terrorism Loss (including UM and UIM PD)
        }
        break;
      default:
        break;
    }
  }
}
