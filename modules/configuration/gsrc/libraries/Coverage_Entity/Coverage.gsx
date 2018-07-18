package libraries.Coverage_Entity

enhancement Coverage : entity.Coverage {
  function showReinsuranceStatus():String{
    if(this.ReinsurancesExt.length == 0){
      return "No"
    }   
    else{
      return  "Yes"
    }
  }

  /* added 01/27/2011 llynch Defect: 3745 This function is called in ReserveReinsurancesExtLV.pcf
     It is used for showing the ceded loss percentages on the detailed reinsurance screen.
  */
  function getCvgReinsPercentage() :String{
    var reinsPercentage :String = null;
  
    for(reins in this.ReinsurancesExt){
      if(reins.Coverage == this){
        reinsPercentage = reins.ReinsPercentageExt + "%";
        break;
      }
    } 
    return reinsPercentage;
  }

  function policyCoveragedates() {
     if(!this.Policy.Verified and this.EffectiveDate ==null and this.New){
      this.EffectiveDate = this.Policy.EffectiveDate
     }
     if(!this.Policy.Verified and this.ExpirationDate==null and this.New){
      this.ExpirationDate = this.Policy.ExpirationDate
     }
  }

  //sprzygocki 4/11/2011 - Updated the accessed Property and Vehicle to RiskUnit
  function getDescriptiveName() : String{
    var coverageDesc:String = ""
    if(this.Subtype ==  "PolicyCoverage"){
      coverageDesc = this.covTypeDisplayName()
    }
    else if(this.Subtype == "PropertyCoverage"){
      coverageDesc = (this as PropertyCoverage).RiskUnit + " - " + this.covTypeDisplayName()
    }
    else if(this.Subtype == "VehicleCoverage"){
      coverageDesc = (this as VehicleCoverage).RiskUnit + " - " + this.covTypeDisplayName()
    }
    return coverageDesc;
  }

  function setSubline(){
    /*if(this.Policy.Claim.LossType == "Equine"){
      if(this.Policy.insured.PrimaryAddress.Country=="US"){
        this.SublineExt = "920"
      } else {
        this.SublineExt = "0"
      }
    }*/
  }

  /*Function to be run for a validationExpression to check expiration date against policy dates
  Author: Kris Boyd
  Date: 8/28/2008
  Updated: -
  */
  function expDateError() : boolean{
    if(util.custom_Ext.DateTime.isDateBefore(this.ExpirationDate, this.Policy.EffectiveDate) or util.custom_Ext.DateTime.isDateAfter(this.ExpirationDate, this.Policy.ExpirationDate)){
      return true;
    }else{
      return false;
    }
  }

  /*Function to be run for onChange to check expiration date against policy dates
  Author: Kris Boyd
  Date: 8/28/2008
  Updated: -
  */
  function expDateWarn(){
  if(this.Policy.Claim.ClaimsMadePolicyExt == false){
    if(util.custom_Ext.DateTime.isDateAfter(this.Policy.Claim.LossDate, this.ExpirationDate)){
          var hasError = false
      for(exp in this.Policy.Claim.Exposures){
        if(exp.Coverage == this){
        
          if (!(exists(hist in this.Policy.Claim.History where hist.Description == "Warning for Loss Date outside of Coverage dates has been previously displayed for feature: "+exp.DisplayName))){
      	        hasError = true
        		//this.Policy.Claim.createCustomHistoryEvent("DataChange", "Warning for Loss Date outside of Coverage dates has been previously displayed for feature: "+exp.DisplayName); 
        	}
        }
      }
      if(hasError){
        pcf.GeneralErrorWorksheet.goInWorkspace(displaykey.Libraries.ClassExt.PolCovDateError(util.custom_Ext.DateTime.formatDate(this.Policy.Claim.LossDate), this.Type.DisplayName, util.custom_Ext.DateTime.formatDateString( this.EffectiveDate, this.ExpirationDate )));
      }
    }
  }
 }
 

  /*Function to be run for a validationExpression to check effective date against policy dates
  Author: Kris Boyd
  Date: 8/28/2008
  Updated: -
  */
  function effDateError() : boolean{
    if(util.custom_Ext.DateTime.isDateBefore(this.EffectiveDate, this.Policy.EffectiveDate) or util.custom_Ext.DateTime.isDateAfter(this.EffectiveDate, this.Policy.ExpirationDate)){
      return true;
    }else{
      return false;
    }
  }

  /*Function to be run for onChange to check effective date against policy dates
  Author: Kris Boyd
  Date: 8/28/2008
  Updated: -
  */
  function effDateWarn(){
   if(this.Policy.Claim.ClaimsMadePolicyExt == false){
    if(util.custom_Ext.DateTime.isDateBefore(this.Policy.Claim.LossDate, this.EffectiveDate)){
      var hasError = false
      for(exp in this.Policy.Claim.Exposures){
        if(exp.Coverage == this){
        
          if (!(exists(hist in this.Policy.Claim.History where hist.Description == "Warning for Loss Date outside of Coverage dates has been previously displayed for feature: "+exp.DisplayName))){
      	        hasError = true
        		//this.Policy.Claim.createCustomHistoryEvent("DataChange", "Warning for Loss Date outside of Coverage dates has been previously displayed for feature: "+exp.DisplayName); 
        	}
        }
      }
      if(hasError){
        pcf.GeneralErrorWorksheet.goInWorkspace(displaykey.Libraries.ClassExt.PolCovDateError(util.custom_Ext.DateTime.formatDate(this.Policy.Claim.LossDate), this.Type.DisplayName, util.custom_Ext.DateTime.formatDateString( this.EffectiveDate, this.ExpirationDate )));
      }
    }
  }
  }

  function isSPP():boolean{
  
    return ( this.Type=="ab_SCPROP_camera" || this.Type=="ab_SCPROP_coins" || this.Type=="ab_SCPROP_finearte" ||
             this.Type=="ab_SCPROP_finearti" || this.Type=="ab_SCPROP_furs" || this.Type=="ab_SCPROP_golfequip" ||
             this.Type=="ab_SCPROP_guns" || this.Type=="ab_SCPROP_jewelry" || this.Type=="ab_SCPROP_miscperprp" ||
             this.Type=="ab_SCPROP_musicinst" || this.Type=="ab_SCPROP_silverware" || this.Type=="ab_SCPROP_sportequip" ||
             this.Type=="ab_SCPROP_stamps")
  }

  function isSFPP():boolean{

    return ( this.Type=="ab_FPE_hsf" || this.Type=="ab_FPE_machsched" || this.Type=="ab_FPE_machblkt" || 
           this.Type=="ab_FPE_grain" || this.Type=="ab_FPE_produce" || this.Type=="ab_FPE_livestock" || 
           this.Type=="ab_FPE_noc" || this.Type=="ab_FPE_tobacco" || 
           this.Type=="ab_FPE_suffocation" || this.Type=="ab_FPE_cab_gl" || this.Type=="ab_FPE_ref_frm_prop" || 
           this.Type=="ab_FPE_ext_exp" || this.Type=="ab_FPE_trans_damg" || this.Type=="ab_FPE_farm_record" || 
           this.Type=="ab_FPE_comp_hdwr" || this.Type=="ab_FPE_comp_sftwr" || this.Type=="ab_FPE_coll_stock" || 
           this.Type=="ab_FPE_quake" || this.Type=="ab_FPE_sheep_dogs" || this.Type=="ab_FPE_peak_hsf" || 
           this.Type=="ab_FPE_peak_grain" || this.Type=="ab_FPE_peak_produce" || this.Type=="ab_FPE_peak_lvstock" || 
           this.Type=="ab_FPE_peak_noc" || this.Type=="ab_FPE_hsopenlimit")
  }

  //def 5087 function to prevent duplicate coverages for an AGB risk type
  function isAGBPol():boolean{
  
    return ( this.Type=="ab_POLSFPP_cov_e_grain" || this.Type=="ab_POLEVALRPTG_grain" || this.Type=="ab_POLSFPP_hsf" ||
             this.Type=="ab_POLEVALRPTG_hsf" || this.Type=="ab_POLSFPP_livestock" || this.Type=="ab_EVALRPTG_livestock" ||
             this.Type=="ab_POLSFPPSUM_produce" || this.Type=="ab_POLEVALRPTG_produce")
  }
  
  //function to prevent 
  function noLienDuplicates(): boolean{
    var count : int
    for(newLien in this.HighValueItemExt.getAddedArrayElements("Lienholders_Ext")){
      count = 0
      for(lien in this.HighValueItemExt.Lienholders_Ext){
        if (lien.Lienholder == (newLien as LienholderExt).Lienholder){
          count = count + 1
        }
      }
      if(count > 1){
        return false;
      }
    }
    for(changedLien in this.HighValueItemExt.getChangedArrayElements("Lienholders_Ext")){
      count = 0
      for(lien in this.HighValueItemExt.Lienholders_Ext){
        if (lien.Lienholder == (changedLien as LienholderExt).Lienholder){
          count = count + 1
        }
      }
      if(count > 1){
        return false;
      }
    }
    return true;
  }
  //Defect 2052 - blawless - add function to check exposures for this coverage
  function notUsedOnExposure() : boolean {
    //function checks that Coverage is not used on any Exposures
    return(!exists(exp in this.Policy.Claim.Exposures where this == exp.Coverage))
  }
}
