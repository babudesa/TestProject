package libraries.Claim_Entity

enhancement ClaimEnhancement : entity.Claim {
  
  function isClaimUpdated(daysLimit:int):Boolean{
    var clmUpdated :util.custom_Ext.ClaimUpdateTime = new util.custom_Ext.ClaimUpdateTime()
    var updateTime = clmUpdated.getClaimUpdateTime(this.ClaimNumber).LastUpdateTime
    
    if(updateTime == null and gw.api.util.DateUtil.daysBetween(this.CreateTime, gw.api.util.DateUtil.currentDate())>=daysLimit){
      return false
    }else{
      return true
    }
  }
  
  function isClaimIdle(daysLimit:int):Boolean{

    if(!this.isClaimUpdated(daysLimit)){
      return true
    }else{
      var clmUpdated :util.custom_Ext.ClaimUpdateTime = new util.custom_Ext.ClaimUpdateTime()
      var updateTime = clmUpdated.getClaimUpdateTime(this.ClaimNumber).LastUpdateTime
      
      if(updateTime != null and gw.api.util.DateUtil.daysBetween(updateTime, gw.api.util.DateUtil.currentDate())>=daysLimit){
        return true
      }else{
        return false
      }
    }
  }

  function filterDetailedLossCause(value:String, str1:String, str2:String):Boolean{
    if (value==str1 || value==str2){
       return false 
    } else {
      return true
    }
  }
  
  function setClaimsMadeIndicator(){
    if(this.ClaimsMadeUsedExt){
      this.ClaimsMadePolicyExt = true
  }else{
      this.ClaimsMadePolicyExt = false
  }
 }
 
 function validateCat(): java.lang.String {
    if(this.LossDate!=null and ((this.Catastrophe.Ex_EarliestStartDate!=null and gw.api.util.DateUtil.compareIgnoreTime(this.LossDate,this.Catastrophe.Ex_EarliestStartDate)<0) 
	|| (this.Catastrophe.Ex_LatestEndDate!=null and gw.api.util.DateUtil.compareIgnoreTime(this.LossDate,this.Catastrophe.Ex_LatestEndDate)>0)))
    {
	return	"The loss date must fall within the catastrophe effective dates.  Please correct the loss date or select the correct catastrophe.";
    } 
    //Defect # 6413 : Validation for ISO Catastrophe.     
    else if(this.Catastrophe.Type=="iso" and this.AddressOwner.Address.City==null){
        return " Loss Location City is required if an ISO Catastrophe is selected."
    } else if(this.Catastrophe.Type=="iso" and (this.AddressOwner.Address.Country=="US" or this.AddressOwner.Address.Country=="CA")and this.AddressOwner.Address.PostalCode==null){
       return "Loss Location Zip Code is required if an ISO Catastrophe is selected."
    } else  if(this.Catastrophe.Type=="iso" and this.AddressOwner.Address.Country=="CA"&& find(z in Zone where z.ZoneType == ZoneType.TC_POSTALCODE 
               && z.Country == "CA"&& z.Name == this.AddressOwner.Address.PostalCode).Count == 0){                                            
      return "Loss Location Zip Code must be valid if an ISO Catastrophe is selected."                                        
    } 
    //Defect6888 dcarson2 5/16/14 Added function to allow validation of first 5 digits of zip code 
    else  if(this.Catastrophe.Type=="iso" and this.AddressOwner.Address.Country=="US"&& find(z in Zone where z.ZoneType == ZoneType.TC_ZIP
               && z.Country == "US"&& z.Name == removeExtensionZip(this.AddressOwner.Address.PostalCode)).Count == 0){ 
      return "Loss Location Zip Code must be valid if an ISO Catastrophe is selected."                                 
    } else if(this.Catastrophe != null and this.LossLocation.County == null and this.LossLocation.Country.Code == "US"){
	return "Loss Location must have County set for Catastrophe."
    }  else {
      return null;    
    }
}

 /**
  * As part of the Manual Claims Conversion Project isConvertedExt, 
  * isUpdatedExt or isNativeORUpdatedExt should replace all instances 
  * of LoadCommandID.
  * 
  * @return TRUE = converted claim and FALSE = natively created claim
  */
  function isConvertedExt(): Boolean
  {
    if(this.LoadCommandID != null)
    {
      return true
    }
    return false
  }
  /**
  * As part of the Manual Claims Conversion Project isConvertedExt, 
  * isUpdatedExt or isNativeORUpdatedExt should replace all instances 
  * of LoadCommandID.
  * 
  * @return TRUE = updated converted claim and FALSE = native claim or untouched
  */
  function isUpdatedExt(): Boolean
  {
    var retValue = true 
    if (this.isConvertedExt() && 
        (this.LoadCommandID.equals(ScriptParameters.CurrentConversionLoadCommandID) || 
         this.LoadCommandID.equals(ScriptParameters.GOSULoadCommandID)))
    {
      retValue = false
    }
    return retValue
  }
  /**
  * As part of the Manual Claims Conversion Project isConvertedExt, 
  * isUpdatedExt or isNativeORUpdatedExt should replace all instances 
  * of LoadCommandID.
  * 
  * @return TRUE = native claim or updated converted claim and FALSE = untouched converted claim
  */
  function isNativeORUpdatedExt(): Boolean{
    if(this.isUpdatedExt()==true or this.isConvertedExt()==false){return true}
    return false}
    
  function getSIR() : Exposure[] {
  	return this.Policy.PolicyType != "EEL"  ? this.Exposures : {}
   
}
  
    
  // kniese - Used to pull the Obligee in FormFieldsEnterprise.xml  
  function getObligee() : ClaimContact{
   for(clCont in this.Contacts){
    if(clCont.Roles.where(\ c -> c.Role == ContactRole.TC_OBLIGEE ).Count != 0){
     return clCont
    }
   }
   return null 
  }
  
  // kniese - 6/9/14 - used to pull the Indemnitor in FormFieldsEnterprise.xml
  function getIndemnitor() : ClaimContact{
   for(clCont in this.Contacts){
    if(clCont.Roles.where(\ c -> c.Role == ContactRole.TC_INDEMNITOR ).Count != 0){
     return clCont
    }
   }
   return null 
  }
  
  /**
   * Defect6888 dcarson2 5/16/14
   * added function to return only 5 digits for zip code validation
   */
  function removeExtensionZip (zipcode: String) : String {
    if (zipcode.length >= 5){
      return zipcode.substring(0,5)
    } 
   return zipcode
  }
  
  /* 
  * kniese - Defect 2149 and 7142 
  * Added a function on the claim to retrieve the total incurred value that is 
  * displayed on the Financials Summary PCF
  */
  function getTotalIncurred(): java.math.BigDecimal {
    var finExp : gw.api.financials.FinancialsExpression
    var totalIncurred : java.math.BigDecimal = 0.0

    // Get the financial expression for the total incurred
    finExp = gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetRecoveriesExpression().minus(gw.api.financials.FinancialsCalculationUtil.getOpenRecoveryReservesExpression())

    // Get the financial Calculation of the total incurred
    totalIncurred = gw.api.financials.FinancialsCalculationUtil.getFinancialsCalculation(finExp).getAmount(this).Amount

    return totalIncurred
  }
  
  /* 
  * akubatur - Defect 7220 
  * Added a function on the claim to validate ECU loss causes for 
  * Specialty ES and Excess Liability claims 
  */
 function filterSpecialtyESandExcessLiabLoss(code : String) : boolean {
  if(this.getClaimBusinessUnitGroup() == util.custom_Ext.finders.getGroupID( "Environmental Claims Unit" ))   {
     if(code == LossCause.TC_ASBESTOS.DisplayName or
        code == LossCause.TC_TOXICPOLLUTION.DisplayName or
        code == LossCause.TC_TOXICTORT.DisplayName){
            return true
       } 
       return false   
   }
    return true
 }
 /* 
  * akubatur : Defect# 6956 
  * Restricting the option to create Review Incident Only activity for non incident claims
  */
function getPatterns(actPatternss: ActivityPattern[]): ActivityPattern[]{
 var newActPatts= new java.util.ArrayList()
  for(actPatern in actPatternss){
    if(!(this.IncidentReport==false && actPatern.Code=="review_incidentonly")){
      newActPatts.add(actPatern)
    }
  }
     return newActPatts as ActivityPattern[]
}

/*
* kniese : Defect 7448 :
* Set DOL Indicator to Loss Date outside of policy period
*/
function setDOLIndicator(){
    var startDate = this.Policy.EffectiveDate
  var endDate = this.Policy.ExpirationDate
  
  if(this.Policy.CancellationDate != null and this.Policy.ex_ReinstatementDate == null){
    endDate = this.Policy.CancellationDate
  }  
  
  if(this.LossDate.compareIgnoreTime(endDate)>0 or
        this.LossDate.compareIgnoreTime(startDate)<0){ 
    this.DOLOutsideIndExt = true 
  } else{
    this.DOLOutsideIndExt = false
  }
}

property get isWCclaim(): Boolean{
  if (this.LossType == LossType.TC_PIMINMARINEWC or this.LossType == LossType.TC_PIMINMARINEEL or 
        this.LossType == LossType.TC_SPECIALTYESWC or this.LossType == LossType.TC_SPECIALTYESEL or
        this.LossType == LossType.TC_STRATEGICCOMPWC or this.LossType == LossType.TC_STRATEGICCOMPEL or
        this.LossType == LossType.TC_TRUCKINGWC or this.LossType == LossType.TC_TRUCKINGEL or
        this.LossType == LossType.TC_ALTMARKETSWC or this.LossType == LossType.TC_ALTMARKETSEL or
        this.LossType == LossType.TC_AGRIWC or this.LossType == LossType.TC_AGRIEL or
        this.LossType == LossType.TC_OMWC or this.LossType == LossType.TC_OMEL or
        this.LossType == LossType.TC_ECUWC or this.LossType == LossType.TC_ECUEL){
          return true
   }
  return false
}

property get injuredWorkers(): InjuredWorkerExt[]{
  var returnList = new java.util.ArrayList<InjuredWorkerExt>()
  for (person in this.RelatedPersonArray){
    if (person typeis InjuredWorkerExt){
      returnList.add(person)
    }
  }
  return returnList as InjuredWorkerExt[]
}

property get ProducingBusinessUnitExt():BusinessUnitExt {
  var gaibu = this.Policy.ex_Agency.ProducingBusinessUnitExt;
  if (gaibu == null || gaibu.BusinessUnit == null) {
    return this.NCWOnlyBusinessUnitExt;
  }
  return gaibu.BusinessUnit;
}

property get ProducingBusinessUnitNameForDisplayExt():String {
  var gaibu = this.Policy.ex_Agency.ProducingBusinessUnitExt;
  if (gaibu == null) {
    return this.NCWOnlyBusinessUnitExt.DisplayName;
  }
  return gaibu.Name;
}

/* 
* dnmiller - Aviation
* Added function to default the underwriter on the Policy
*/
function setDefaultUnderwriter() {
  var otherContact: Contact
  if (this.Policy.Verified && this.Policy.underwriter == null){
    // each loss type could have their own default underwriter
    switch(this.LossType){ 
      case typekey.LossType.TC_AVIATION:
        //AVIATION - Craig Gately
        otherContact = User.finder.findUserByUserName("cgately").Contact
        break
      case typekey.LossType.TC_MERGACQU:
        //Mergers and Acquisitions - Garry Gordon
        otherContact = User.finder.findUserByUserName("ggordon").Contact
        break
      default:
        otherContact = null
    }
    if (otherContact != null){
      // Copy the user to avoid shared contacts
      this.Bundle.add(otherContact) //gw.transaction.Transaction.getCurrent()
      this.Policy.underwriter = otherContact.shallowCopy() as Person
        
      /*Copy any arrays that you care about*/ 
      /*copy contact addresses */
      if(this.Policy.underwriter !=null and this.Policy.underwriter.AllAddresses!=null){
        if(this.Policy.underwriter.AllAddresses.length <= otherContact.AllAddresses.length){
          for(addy in otherContact.AllAddresses){
            if(!exists(ad in this.Policy.underwriter.AllAddresses where ad.AddressType==addy.AddressType && 
              (ad.AddressLine1==addy.AddressLine1 && ad.City==addy.City && ad.State==addy.State))){
              this.Policy.underwriter.addAddress(addy.shallowCopy() as Address)
            }
        /** Copy any foreign keys that you care about **/
        var copiedPrimaryAddy = otherContact.PrimaryAddress.shallowCopy() as Address
        this.Policy.underwriter.PrimaryAddress = copiedPrimaryAddy
        }
      }
    }
  }
}
} // ends setDefaultUnderwriter
} // ends ClaimEnhancement