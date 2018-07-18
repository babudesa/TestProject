package libraries.Policy_Entity
uses java.util.ArrayList

enhancement PolicyEnhancement : entity.Policy {
  
  property get Jobsites() : List<JobsiteRUExt>{
    return this.RiskUnits.where(\ ru -> ru.Subtype == typekey.RiskUnit.TC_JOBSITERUEXT) as List<JobsiteRUExt>
  }
  
  //SPRZYGOCKI 4/12/11 - MOVED THESE FROM POLICYUI - WAS NOT GETTING ERRORS AND MUST RESOLVE
  function setProfitCenter() :String
    {
    this.ex_Agency.ex_AgencyProfitCenter = "3550"
    return this.ex_Agency.ex_AgencyProfitCenter
    }

  function setNAICSCode() {
    if (this.NAICSCodeExt == null and this.PolicyType == "AMP") {
      this.NAICSCodeExt = "112990";}
    }

  function getCurrency() :String  
    { var cur = "USD"
    return cur
    }

  function removeDriver (Driver:Contact){
   var i=0
   for (person in this.Contacts){ 
     if(person.Contact==Driver){
    var roles:ClaimContactRole[]=new ClaimContactRole[person.Roles.length-1]
    for (each in person.Roles) {
      if(each.Role.DisplayName=="Driver") {
      continue
      }
      else {
      roles[i]= each 
      i=i+1
        }
    }
      person.Roles=roles
       } 
     }
 
  }

  function validateDates(): String{
    var errorString : String = ""
 
    if(this.Claim.ClaimsMadePolicyExt == false){
    if(this.EffectiveDate > this.Claim.LossDate or this.ExpirationDate < this.Claim.LossDate){
      errorString = displaykey.Libraries.ClassExt.Policy.PolicyUI.LossDateError(util.custom_Ext.DateTime.formatDate(this.Claim.LossDate), util.custom_Ext.DateTime.formatDateString(this.EffectiveDate, this.ExpirationDate)) + "\n"
    }
    if(util.custom_Ext.DateTime.isDateAfter( this.EffectiveDate, this.Claim.LossDate ) or util.custom_Ext.DateTime.isDateBefore( this.ExpirationDate, this.Claim.LossDate )){
      return displaykey.Libraries.ClassExt.PolCovDateError( util.custom_Ext.DateTime.formatDate(this.Claim.LossDate),"policy", util.custom_Ext.DateTime.formatDateString( this.EffectiveDate, this.ExpirationDate ))
    }
  }
  return null;
 }
  
  function validatePolDates() : String{
    if(this.Claim.ClaimsMadePolicyExt == false){
    if(util.custom_Ext.DateTime.isDateAfter( this.EffectiveDate, this.ExpirationDate )){
      return displaykey.Web.Dates.EffDateAfterExpDate
    }
    if(util.custom_Ext.DateTime.isDateAfter( this.EffectiveDate, this.Claim.LossDate ) or util.custom_Ext.DateTime.isDateBefore( this.ExpirationDate, this.Claim.LossDate )){
      return displaykey.Libraries.ClassExt.PolCovDateError( util.custom_Ext.DateTime.formatDate(this.Claim.LossDate),"policy", util.custom_Ext.DateTime.formatDateString( this.EffectiveDate, this.ExpirationDate ))
    }
   }
      return null;
 }

  //New function to throw a warning in NCW if there is a new exposure with coverage dates outside the policy dates
  function covDatesWarning(){
    foreach(cov in this.AllCoverages){
      if(exists(exp in this.Claim.Exposures where cov == exp.Coverage)){
        cov.effDateWarn()
        cov.expDateWarn()
      }
    }
  }

  //8/31/09 erawe: Defect 1370 created to only display the Insured in the insured field on the policy screen.  Discussed with
  //Linda, decided to leave dropdown for now anyway on the PCF&apos;s, she seemed okay as is.
  function policyInsuredList():List{
    var contlist = new ArrayList();
    for(contact in this.Claim.getRelatedContacts()){
      if(contact == this.insured){
      contlist.add(contact)
      }
    }
    return contlist
  }

  function safeValidate(): gw.api.validation.ValidationResult{
    // added by blawless - 9/8/09
    // warnings called by validate function are not displayed on screen.  This function sets a session variable 
    // to indicate that the validation was called by the function.  This prevents messages that only display a given number
    // of times from counting an occurence when they are created by the validate function.
     var currentUser : User = gw.plugin.util.CurrentUserUtil.getCurrentUser().User;
    
     try{
       var calledByValidate session : List;
       var valResult : gw.api.validation.ValidationResult;
   
       if (calledByValidate == null){
         calledByValidate = new ArrayList();
       }
       calledByValidate.add(this.Claim.ClaimNumber);
       valResult = this.validate();
       calledByValidate.remove(this.Claim.ClaimNumber);
       if(calledByValidate.length == 0){
         calledByValidate = null;
       }   
       return valResult;
     }catch(e){
       gw.api.util.Logger.logDebug("PolicyEnhancement safeValidate - " + currentUser)
       return this.validate();
     }
  }

  function getNumOfRisksWCvgs() : int {
    var result = 0
    var locationList : List = new ArrayList()
    var policyList : List = new ArrayList()
    //Policy Coverage Risks
    for(cov in this.Coverages){
      if(!exists(state in policyList where (cov.State!=null and state==cov.State) || cov.State==null)){
        if(cov.State!=null){
          policyList.add(cov.State.Code.toString())
        } else {
          policyList.add("NULL")
        }
      }
    }
    result = result + policyList.length
    //Property Coverage Risks
    if(this.Claim.LossType=="EQUINE"){
      for(prop in this.Properties){
        if(prop.Coverages.length > 0){
          result = result + 1
        }
      }
    } else {
      for(item in this.Properties){
        if(item typeis PropertyRU) {
          if(item.Coverages.length>0 and
             !exists(number in locationList where number==item.RUNumber)){
            locationList.add(item.RUNumber)
          }
        }
      }
      result = result + locationList.length
    }
    //Vehicle Coverage Risks
    for(veh in this.Vehicles){
      if(veh.Coverages.length > 0){
        result = result + 1
      }
      if(exists(cov in veh.Coverages where (cov as VehicleCoverage).TrailerExt==veh.Vehicle.TrailerExt)){
        result = result + 1
      }
      for(eng in veh.Vehicle.EnginesExt){
        if(exists(cov in veh.Coverages where (cov as VehicleCoverage).EngineExt==eng)){
          result = result + 1
        }
      }
    }
    return result
  }

  function policyDoingBusinessAsList():List{
    var contlist = new ArrayList();
    for(contact in this.Claim.RelatedCompanyArray){
      if(contact != this.insured and contact.Subtype != "ex_Agency"){
        contlist.add(contact)
      }
    }
    return contlist
  }  
}
