package util.TypeOfLoss;

class Subline618
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    var expType : ExposureType = exposure.ExposureType
    var riskState : State = util.TypeOfLoss.helperFunctions.getRiskState( exposure )
    
    switch(expType){
      case typekey.ExposureType.TC_AB_PHYSICALDAMAGE:
      if (riskState == typekey.State.TC_MA){
        codeList.add( TypeOfLossExt.TC_10_00449 ) //10 - Collision Without Waiver of Deductible - Collision loss payment when deductible is applied of Limited Collision with a deductible
        codeList.add( TypeOfLossExt.TC_11_00450 ) //11 - Collision With Waiver of Deductible - Collision loss payment when deductible is applied
        codeList.add( TypeOfLossExt.TC_12_00451 ) //12 - Collision With Waiver of Deductible - Collision loss payment when deductible is waived or Limited Collision with full coverage
        codeList.add( TypeOfLossExt.TC_07_00452 ) //07 - Flood and Rising Water
        codeList.add( TypeOfLossExt.TC_06_00453 ) //06 - Other Than Collision - Cyclone, Earthquake, Explosion, Hail, Tornado, Water Damage and Windstorm
        codeList.add( TypeOfLossExt.TC_01_00154 ) //01 - Other Than Collision - Fire
        codeList.add( TypeOfLossExt.TC_03_00454 ) //03 - Other Than Collision - Glass
        codeList.add( TypeOfLossExt.TC_97_00455 ) //97 - Other Than Collision Loss Due to Acts of Terrorism
        codeList.add( TypeOfLossExt.TC_05_00158 ) //05 - Other Than Collision - Malicious Mischief and Vandalism
        codeList.add( TypeOfLossExt.TC_02_00161 ) //02 - Other Than Collision - Theft
        codeList.add( TypeOfLossExt.TC_08_00456 ) //08 - Towing and Labor Cost
        codeList.add( TypeOfLossExt.TC_09_00457 ) //09 - All other types - excluding Collision
      }
      else {
      //older value before 06/01/2016
       if(exposure.Claim.LossDate <ScriptParameters.LossTypeSelectionDate)
       {
        codeList.add( TypeOfLossExt.TC_00_00045 ) //00 - Collision
        codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
        codeList.add( TypeOfLossExt.TC_01_00131 ) //01 - Michigan Broadened Collision - All Other Broad Form Collision Losses
        codeList.add( TypeOfLossExt.TC_02_00132 ) //02 - Michigan Broadened Collision - Total Collision Loss Pmt - Deductible is Waived
        codeList.add( TypeOfLossExt.TC_09_00152 ) //09 - Other Than Collision - All Other Types - excluding Collision (Including Citizen's Band Radio)
        codeList.add( TypeOfLossExt.TC_01_00154 ) //01 - Other Than Collision - Fire
        codeList.add( TypeOfLossExt.TC_07_00155 ) //07 - Other Than Collision - Flood and Rising Water
        codeList.add( TypeOfLossExt.TC_13_00156 ) //13 - Other Than Collision - Glass (Comp only) Deductible has been applied
        codeList.add( TypeOfLossExt.TC_23_00157 ) //23 - Other Than Collision - Glass (Comp only) Full Coverage (No glass deductible or glass deductible waived)
        codeList.add( TypeOfLossExt.TC_05_00158 ) //05 - Other Than Collision - Malicious Mischief and Vandalism
        codeList.add( TypeOfLossExt.TC_10_00159 ) //10 - Other Than Collision - Mechanical Breakdown (Tx Only)
        codeList.add( TypeOfLossExt.TC_04_00160 ) //04 - Other Than Collision - Personal Effects
        codeList.add( TypeOfLossExt.TC_02_00161 ) //02 - Other Than Collision - Theft
        codeList.add( TypeOfLossExt.TC_08_00162 ) //08 - Other Than Collision - Towing and Labor Costs
        codeList.add( TypeOfLossExt.TC_06_00163 ) //06 - Other Than Collision - Windstorm, Earthquake, Hail, Explosion and Water Damage
        
        }
        //New values Deductable Applied TRUE)
      if(exposure.DeductibleAppliedExt==typekey.DeductibleAppliedExt.TC_DEDUCTIBLEHASBEENAPPLIED and exposure.Claim.LossDate >=ScriptParameters.LossTypeSelectionDate)
       {
        codeList.add( TypeOfLossExt.TC_50_00408 ) //50 - Collision
        
        codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
        codeList.add( TypeOfLossExt.TC_01_00131 ) //01 - Michigan Broadened Collision - All Other Broad Form Collision Losses
        
        codeList.add( TypeOfLossExt.TC_19_00410) //19 - Other Than Collision - All Other Types - excluding Collision (Including Citizen's Band Radio)
        codeList.add( TypeOfLossExt.TC_21_00430 ) //21 - Other Than Collision - Animal Collision
        codeList.add( TypeOfLossExt.TC_11_00412 ) //11 - Other Than Collision - Fire
        codeList.add( TypeOfLossExt.TC_17_00414 ) //17 - Other Than Collision - Flood and Rising Water
        codeList.add( TypeOfLossExt.TC_13_00416 ) //13 - Other Than Collision - Glass (Comp only)
        codeList.add( TypeOfLossExt.TC_15_00418) //15 - Other Than Collision - Malicious Mischief and Vandalism 
        codeList.add( TypeOfLossExt.TC_20_00420 ) //20 - Other Than Collision - Mechanical Breakdown
        codeList.add( TypeOfLossExt.TC_14_00422 ) //14 - Other Than Collision - Personal Effects 
        codeList.add( TypeOfLossExt.TC_12_00424 ) //12 - Other Than Collision - Theft 
        codeList.add( TypeOfLossExt.TC_18_00426 ) //18 - Other Than Collision - Towing and Labor Costs 
        codeList.add( TypeOfLossExt.TC_16_00428 ) //16 - Other Than Collision - Windstorm, Earthquake, Hail, Explosion and Water Damage 
        
       }
        if(exposure.DeductibleAppliedExt==typekey.DeductibleAppliedExt.TC_DEDUCTIBLEHASBEENWAIVED and exposure.Claim.LossDate >=ScriptParameters.LossTypeSelectionDate ) {
          //New values Deductable Applied FALSE
          codeList.add( TypeOfLossExt.TC_60_00409 ) //60 - Collision
          codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
          codeList.add( TypeOfLossExt.TC_01_00131 ) //01 - Michigan Broadened Collision - All Other Broad Form Collision Losses
          codeList.add( TypeOfLossExt.TC_02_00132 ) //02 - Michigan Broadened Collision - Total Collision Loss Pmt - Deductible is Waived
          codeList.add( TypeOfLossExt.TC_39_00411) //39 - Other Than Collision - All Other Types - excluding Collision (Including Citizen's Band Radio)
          codeList.add( TypeOfLossExt.TC_41_00431 ) //41 - Other Than Collision - Animal Collision
          codeList.add( TypeOfLossExt.TC_31_00413) //31 - Other Than Collision - Fire
          codeList.add( TypeOfLossExt.TC_37_00415 ) //37 - Other Than Collision - Flood and Rising Water
          codeList.add( TypeOfLossExt.TC_23_00417 ) //23 - Other Than Collision - Glass (Comp only)
          codeList.add( TypeOfLossExt.TC_35_00419) //35 - Other Than Collision - Malicious Mischief and Vandalism 
          codeList.add( TypeOfLossExt.TC_40_00421 ) //40 - Other Than Collision - Mechanical Breakdown
          codeList.add( TypeOfLossExt.TC_34_00423 ) //34 - Other Than Collision - Personal Effects 
          codeList.add( TypeOfLossExt.TC_32_00425 ) //32 - Other Than Collision - Theft 
          codeList.add( TypeOfLossExt.TC_38_00427 ) //38 - Other Than Collision - Towing and Labor Costs 
          codeList.add( TypeOfLossExt.TC_36_00429 ) //36 - Other Than Collision - Windstorm, Earthquake, Hail, Explosion and Water Damage 
        }
      }
        break;
      case typekey.ExposureType.TC_AB_PIP:
        codeList.add( TypeOfLossExt.TC_00_00045 ) //00 - Collision
        codeList.add( TypeOfLossExt.TC_97_00124 ) //97 - Losses Due to Acts of Terrorism
        codeList.add( TypeOfLossExt.TC_01_00131 ) //01 - Michigan Broadened Collision - All Other Broad Form Collision Losses
        codeList.add( TypeOfLossExt.TC_02_00132 ) //02 - Michigan Broadened Collision - Total Collision Loss Pmt - Deductible is Waived
        codeList.add( TypeOfLossExt.TC_09_00152 ) //09 - Other Than Collision - All Other Types - excluding Collision (Including Citizen's Band Radio)
        codeList.add( TypeOfLossExt.TC_01_00154 ) //01 - Other Than Collision - Fire
        codeList.add( TypeOfLossExt.TC_07_00155 ) //07 - Other Than Collision - Flood and Rising Water
        codeList.add( TypeOfLossExt.TC_13_00156 ) //13 - Other Than Collision - Glass (Comp only) Deductible has been applied
        codeList.add( TypeOfLossExt.TC_23_00157 ) //23 - Other Than Collision - Glass (Comp only) Full Coverage (No glass deductible or glass deductible waived)
        codeList.add( TypeOfLossExt.TC_05_00158 ) //05 - Other Than Collision - Malicious Mischief and Vandalism
        codeList.add( TypeOfLossExt.TC_10_00159 ) //10 - Other Than Collision - Mechanical Breakdown (Tx Only)
        codeList.add( TypeOfLossExt.TC_04_00160 ) //04 - Other Than Collision - Personal Effects
        codeList.add( TypeOfLossExt.TC_02_00161 ) //02 - Other Than Collision - Theft
        codeList.add( TypeOfLossExt.TC_08_00162 ) //08 - Other Than Collision - Towing and Labor Costs
        codeList.add( TypeOfLossExt.TC_06_00163 ) //06 - Other Than Collision - Windstorm, Earthquake, Hail, Explosion and Water Damage
        break;
        
        case typekey.ExposureType.TC_AB_PROPERTYDAMAGE:
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
        break;
       case typekey.ExposureType.TC_AB_BODILYINJURY:  
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
          break;
       case typekey.ExposureType.TC_AB_AUTOPROPDAM:
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
        break;
        
      default:
        break;
    }
  }
}
