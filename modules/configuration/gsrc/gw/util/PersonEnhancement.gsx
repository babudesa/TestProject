package gw.util
//uses org.springframework.core.style.ToStringCreator

enhancement PersonEnhancement : entity.Person {
  function setMedicare() {
  if((this.TaxID==null || this.TaxID=="") && this.HICNExt==null ){ 
     this.MedicareEligibleExt = false
  }else if(this.TaxID!=null && this.TaxID.toString().startsWith("9")){
    this.MedicareEligibleExt = false
  }
  else if(this.TaxID==null || this.TaxID=="" && this.HICNExt!=null){
    this.MedicareEligibleExt = true
   }
 if(this.BelowThresholdExt or this.RefuseProvideExt){
  this.MedicareEligibleExt = true 
 }  
  if(this.TaxID!=null && !this.TaxID.toString().startsWith("9")&& this.HICNExt!=null){
    this.MedicareEligibleExt = true 
  }
  
  }
  
  function isMediEditable() : boolean {
      	var result : boolean = false
      	if(this.TaxID!=null){
      		if(!this.TaxID.toString().startsWith("9") and this.HICNExt==null){
      			result = true
      		}      	
      	} else {
      		if(this.HICNExt==null){
      			result =  true
      		}
      	}
      	return result
      }
      
      function setMediFields() {
      	if(this.HICNExt!="" and this.HICNExt!=null){
      		this.MedicareEligibleExt = true
      	}
      	if((this.HICNExt==null || this.HICNExt=="")&&this.TaxID==null){
      	  this.MedicareEligibleExt=false
      	}
      }
      
  
  function validateInjuredWorkerTaxID() : String{
    var str : String  = null
    if(this.TaxID!=null){
      if(!this.TaxID.matches("[0-9]{9}")){
        str = displaykey.Web.ContactDetail.Name.TaxID.EIN.Invalid
      }else if(this.TaxID.startsWith("0000")){
        if(this.FirstName==null or this.LastName==null or this.Gender==null or this.DateOfBirth==null){
          str = "First Name, Last Name, Gender, and Date of Birth are required before a partial SSN can be entered."
        }
      }
    }else{
      str = null
    }
   return str
  }
  /*
added new function to set Stop Querying Party for CMS? value based on Medicare Eligible
for defect # 6534 - If Medicare Eligible = Yes, set Stop Querying Party for CMS? to Yes
by gyemula July 21st 2015*/

function setStopSendToCMS(): void{
  if((this.HICNExt != null and this.MedicareEligibleExt != null and this.MedicareEligibleExt) or this.MedicareEligibleExt 
      or(this.isFieldChanged("HICNExt") and this.isFieldChanged("MedicareEligibleExt") and this.MedicareEligibleExt))
      {
        this.StopSendPartyToCMSExt = true
      }
    else{
      this.StopSendPartyToCMSExt= null
      }
}
  /*
  *Defect: 7608
  *Description: If there is no feature, or if the Feature or Claim Close Reason field is 'Claim Denied' the Date of Birth should not be required.
  */
  function setDOBRequired(claim: Claim): boolean{
    var isDOBRequired: boolean = true;
    if(((null==claim.Exposures) or (null!=claim.Exposures && claim.Exposures.size<1)) or claim.ClosedOutcome=="claimdenied"){
      isDOBRequired = false
    
    }
    if(!isDOBRequired){
      for(exp in claim.Exposures ){
        if(exp.ClosedOutcome=="claimdenied"){
          isDOBRequired = false
          break
        }
    
      }
    }  
    return isDOBRequired
  }  

  property get isUndocumentedWorker(): Boolean {
    if (this typeis InjuredWorkerExt){
      if (this.UndocumentedWorkerExt == true){
        return true
      }
    }
    return false
  }
  
}