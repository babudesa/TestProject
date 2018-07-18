package util

uses gw.api.util.DateUtil;
uses java.util.ArrayList
uses gw.api.claim.NewClaimWizardInfo
uses java.lang.Exception

class CommAutoHelper {

  construct() {
  }
  
  
  // Returns true if the claim has one of the 4 Commercial Auto loss types
  static function isCommAutoLossType(claim : Claim) : Boolean {
    try{
      return claim.LossType == LossType.TC_AGRIAUTO or claim.LossType == LossType.TC_ALTMARKETSAUTO or 
        claim.LossType == LossType.TC_SHSAUTO or claim.LossType == LossType.TC_TRUCKINGAUTO
   }catch(e){
     //only print the exception if the passed in 'claim' is actually a Key. This will prevent many ClassCastExceptions from being printed in the logs.
     if(!(claim typeis Key)){
       print(e)
     }
   }
   return null
  }

  // Returns an error if both the MA Town Code and Out-of-State Town Codes are filled in. Sets the town code on the claim.
  static function setMATownCode(townCodeMA: MATownCodeExt, townCodeOOS: MATownCodeExt, claim:Claim) : String{
    if (townCodeMA != null and townCodeOOS != null){
      return "Select either MA Town or City or Out-of-State Town, both values cannot be selected."
    }
    else if (townCodeOOS != null and claim.LossLocation.State == typekey.State.TC_MA){
      return displaykey.Rules.Validation.CommAuto.MATown
    } 
    else if (townCodeMA != null){
      claim.MAAccidentLocationExt = townCodeMA
    }
    else if (townCodeOOS != null){
      claim.MAAccidentLocationExt = townCodeOOS
    }
    else if (townCodeMA == null and townCodeOOS == null){
      claim.MAAccidentLocationExt = null
    }
    return null
  }
  
  static function validateOOSTownCode(townCodeMA: MATownCodeExt, townCodeOOS: MATownCodeExt, claim: Claim) : String{
    if (townCodeMA != null and townCodeOOS == null and claim.LossLocation.State != typekey.State.TC_MA){
      return displaykey.Rules.Validation.CommAuto.OOSTown
    }
  return null  
  }

  // Function to determine if any of the coverages on the policy have a risk state of Massachusetts
  static function isMAAutoPolicy(policy: Policy): Boolean{
    if (policy.Coverages.where(\ c -> c.State == State.TC_MA).HasElements){
      return true
    }
    if (policy.RiskUnits != null){
      for ( ru in policy.RiskUnits.where(\ ru -> ru typeis VehicleRU )){
        if (ru.Coverages.where(\ c -> c.State == State.TC_MA).HasElements){
          return true
        }
      }
    }
    return false
  }
  
  // Function to determine Accident Town visiblity on the Loss Details screen
  // Returns true if there are no exposures on the claim and it has a MA Policy
  // Retunrs true if there is an exposure on the claim that has a risk state of MA on the coverage
  static function showAccidentTown(claim: Claim, inEditMode: Boolean): Boolean{
    if (isCommAutoLossType(claim)){
      if (claim.Exposures.IsEmpty){
        return isMAAutoPolicy(claim.Policy)
      } else if (claim.Exposures.where(\ e -> e.Coverage.State == typekey.State.TC_MA).HasElements){
        return true
      }
    }
    // If we are not showing the field, wipe out the existing value
    if (inEditMode && claim.MAAccidentLocationExt != null){
      claim.MAAccidentLocationExt = null
    }
    return false
    
  }
 
}