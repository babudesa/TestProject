package libraries.Exposure_Entity

enhancement TotalLoss : entity.Exposure {
  function needsTotalLossReporting() : boolean {
    var needsReporting = this.TotalLossIndExt ? true : false
    if(this.Coverage == null){
      needsReporting = false;  
    } else if((!(this.ExposureType == ExposureType.TC_AB_PHYSICALDAMAGE || this.ExposureType == ExposureType.TC_AB_AUTOPROPDAM || 
                 this.ExposureType == ExposureType.TC_PE_AUTOPROPDAMAGE || this.ExposureType == ExposureType.TC_PE_PHYSICALDAMAGE) ||
                 this.CoverageSubType=="ab_AGG_aut_liab_pd") || (this.Claim.LossType!="AGRIAUTO" and this.Claim.LossType!="PERSONALAUTO" and this.Claim.LossType!=LossType.TC_ALTMARKETSAUTO and 
                 this.Claim.LossType!=LossType.TC_SHSAUTO and this.Claim.LossType!=LossType.TC_TRUCKINGAUTO)){
      needsReporting =  false
    }  
    return needsReporting
  }

  /* Changed LossType and ExposureType strings to reference the respective TypeList Code value.
     Removed AgriGuard ExposureType per Total Loss Reporting Analysis and Design Document v2.0
     Sprint: EM29
     Updated By: tnewcomb
     Date: 03/21/2011
  */
  function totalLossIsRequired() : boolean{
    var totalLossRequired = false
  
    if((this.Claim.LossType==LossType.TC_AGRIAUTO and (this.ExposureType==ExposureType.TC_AB_PHYSICALDAMAGE || this.ExposureType==ExposureType.TC_AB_AUTOPROPDAM)) ||
       (this.Claim.LossType==LossType.TC_PERSONALAUTO) and (this.ExposureType==ExposureType.TC_PE_PHYSICALDAMAGE OR this.ExposureType==ExposureType.TC_PE_AUTOPROPDAMAGE) OR
      (this.Claim.LossType==LossType.TC_ALTMARKETSAUTO and (this.ExposureType==ExposureType.TC_AB_PHYSICALDAMAGE OR this.ExposureType==ExposureType.TC_AB_AUTOPROPDAM)) OR
      (this.Claim.LossType==LossType.TC_SHSAUTO and (this.ExposureType==ExposureType.TC_AB_PHYSICALDAMAGE OR this.ExposureType==ExposureType.TC_AB_AUTOPROPDAM)) OR
      (this.Claim.LossType==LossType.TC_TRUCKINGAUTO and (this.ExposureType==ExposureType.TC_AB_PHYSICALDAMAGE OR this.ExposureType==ExposureType.TC_AB_AUTOPROPDAM))) {
      totalLossRequired = true
    }
    //3/31/10 erawe - added the below logic per defect 2894, stat compliance requires TLI filled in if a feature has previously been closed
    if(this.ExposureType==ExposureType.TC_AB_BOATDAMAGE || this.ExposureType==ExposureType.TC_AB_ENGINEDAMAGE || this.ExposureType==ExposureType.TC_AB_TRAILERDAMAGE ||
       this.Claim.LossType==LossType.TC_AGRIPROPERTY){
      if(exists(trans in this.TransactionsQuery.iterator() where (trans as TransactionDefaultView).Transaction.Subtype=="Payment" 
        and (trans as TransactionDefaultView).Transaction.CostType=="claimcost" and ((this.Closed || this.ReOpenDate!=null) OR
        (((trans as TransactionDefaultView).Transaction as Payment).PaymentType=="final" || 
        ((trans as TransactionDefaultView).Transaction as Payment).PaymentType=="supplement")))){
       totalLossRequired = true
      }
    }
    return totalLossRequired
  }

  /* Changed LossType and ExposureType strings to reference the respective TypeList Code value.
     Removed AgriGuard ExposureType per Total Loss Reporting Analysis and Design Document v2.0
     Sprint: EM29
     Updated By: tnewcomb
     Date: 03/16/2011
  */
  function totalLossIsVisible() : boolean{
    var totalLossVisible = false
  
    if((this.Claim.LossType==LossType.TC_AGRIAUTO and (this.ExposureType==ExposureType.TC_AB_PROPERTYDAMAGE ||this.ExposureType==ExposureType.TC_AB_PHYSICALDAMAGE || this.ExposureType==ExposureType.TC_AB_AUTOPROPDAM)) ||
       (this.ExposureType==ExposureType.TC_AB_BOATDAMAGE || this.ExposureType==ExposureType.TC_AB_ENGINEDAMAGE || this.ExposureType==ExposureType.TC_AB_TRAILERDAMAGE) ||
        (this.Claim.LossType==LossType.TC_AGRIPROPERTY and this.CoverageSubType!=typekey.CoverageSubtype.TC_AB_ORCHVINE_PD) || (this.Claim.LossType==LossType.TC_PERSONALAUTO and (this.ExposureType==ExposureType.TC_PE_PROPDAMAGE || this.ExposureType==ExposureType.TC_PE_AUTOPROPDAMAGE ||
        this.ExposureType==ExposureType.TC_PE_PHYSICALDAMAGE)) || (this.Claim.LossType==LossType.TC_ALTMARKETSAUTO and (this.ExposureType==ExposureType.TC_AB_PROPERTYDAMAGE ||this.ExposureType==ExposureType.TC_AB_PHYSICALDAMAGE || this.ExposureType==ExposureType.TC_AB_AUTOPROPDAM)) ||
        (this.Claim.LossType==LossType.TC_SHSAUTO and (this.ExposureType==ExposureType.TC_AB_PROPERTYDAMAGE ||this.ExposureType==ExposureType.TC_AB_PHYSICALDAMAGE || this.ExposureType==ExposureType.TC_AB_AUTOPROPDAM)) ||
        (this.Claim.LossType==LossType.TC_TRUCKINGAUTO and (this.ExposureType==ExposureType.TC_AB_PROPERTYDAMAGE ||this.ExposureType==ExposureType.TC_AB_PHYSICALDAMAGE || this.ExposureType==ExposureType.TC_AB_AUTOPROPDAM))){
      totalLossVisible = true
    }
  
    return totalLossVisible
  }

  function totalLossNeededForPymt() : boolean{
    var neededForPymt = false
  
    if(this.LossParty=="insured" and
      totalLossIsVisible() and !this.Coverage.Type.Description.startsWith( "LIAB-Uninsured" ) and 
      this.CoverageSubType!="ab_AGG_aut_liab_pd" and this.Claim.LossType!="AGRIAUTO"){
      neededForPymt = true
    }
  
    return neededForPymt
  }

  // tnewcomb 03/21/2011 - EM29 requires that if Total Loss is no, any previously entered values
  // for the below fields be removed from storage.
  function nullOutTotalLossFields(){
    if(this.TotalLossIndExt == false){
      this.VehicleIncident.OwnLienAtAccidentExt = null;
      this.VehicleIncident.OwnLienAtClaimCloseExt = null;
      //this.VehicleIncident.IsOwnerRetainingExt = null;
      this.VehicleIncident.salvagebuyer = null;		  	  
    }
  
    if(this.VehicleIncident.Vehicle == null){
    
    }
  }
}
