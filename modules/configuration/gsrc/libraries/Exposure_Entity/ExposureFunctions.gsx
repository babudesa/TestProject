package libraries.Exposure_Entity
uses java.util.ArrayList
uses gw.api.financials.CurrencyAmount

enhancement ExposureFunctions : entity.Exposure {

  //8/10/10 erawe - commented out above getFeatureContacts() per new requirements from Karen from 8/9/10.
  //Opening up claimant to all contacts unless an agent or agency, underwriter or vendor (personvendor or companyvendor)
  //This applies to both 1st and 3rd party types, so I also removed the if condition around LossParty, not needed any longer.
  //Updated: tnewcomb 03/29/2011 - Prevent the "Great American Insurance" contact from being added to the returned list 
  // 6/18/13 erawe - moved this function to ClaimFunctions.gsx so we can use list on IncidentClaimant also.
  function getFeatureContacts():List{
    return this.Claim.getFeatureContacts()
  }


  function getDoctors():List{
    var doctors:List = new ArrayList() 
  
    for(contact in this.Claim.getRelatedContacts()){
      if(contact.Subtype== "Doctor"|| contact.Subtype=="Ex_ForeignCoVenMedOrg" ||
         contact.Subtype== "MedicalCareOrg"|| contact.Subtype=="Ex_ForeignPerVndrDoc"){
        doctors.add(contact)   
      }
    }
  
    return doctors
  }

  function isMinorChildFeature() : boolean {
    /**
      Feature types that require Minor Child? and DOB field:
    
      AgriGuard Auto Bodily Injury (Third Party) (Liability)
      AgriGuard Auto Bodily Injury (First Party) (Liability)
      AgriGuard Gen Liab Bodily Injury (Third Party) (Liability)
      Bodily Injury (Third Party) (Liability)
      Medical Payment (Third Party) (Liability)
      Personal Injury (Third Party) (Liability)
      Bodily Inury (Third Party) (Auto)
      Bodiliy Injury (First Party (Auto)
      Medical Payment (First Party) (Auto)
      Pesonal Injury Protection (First Party) (Auto)
      Product Withdrawal (Third Party) (Liability)
      AgriGuard Auto Bodily Injury (First Party) (Auto)
      AgriGuard Auto Bodily Injury (Third Party) (Auto)
      AgriGuard Gen Liab Bodily Injury (Third Party) (Auto)
      Specialty E&S Bodily Injury
      Specialty E&S Medical Payment, Bodily Injury, Personal Injury, Product Withdrawal, Personal Ingury
      Personal Auto Bodily Injury, Medical Payment, Personal Injury Protection
      All Workers' Comp features.
    */
  
    if((this.Claim.LossType == "AGRILIABILITY" and this.LossParty == "third_party" and this.ExposureType == "ab_AGG_auto_BodInjury") or
        (this.Claim.LossType == "AGRILIABILITY" and this.LossParty == "insured" and this.ExposureType == "ab_AGG_auto_BodInjury") or 
        (this.Claim.LossType == "AGRILIABILITY" and this.LossParty == "third_party" and this.ExposureType == "ab_AGG_gl_BodInjury") or 
        (this.Claim.LossType== "AGRILIABILITY" and this.LossParty == "third_party" and this.ExposureType =="ab_BodilyInjury") or
        (this.Claim.LossType== "AGRILIABILITY" and this.LossParty == "third_party" and this.ExposureType =="ab_MedPay") or 
        (this.Claim.LossType== "AGRILIABILITY" and this.LossParty == "third_party" and this.ExposureType =="ab_PersonalInjury") or 
        (this.Claim.LossType== "AGRILIABILITY" and this.LossParty == "third_party" and this.ExposureType =="ab_ProdWithdrawal") or 
        (this.Claim.LossType==  "AGRIAUTO" and this.LossParty == "third_party" and this.ExposureType =="ab_BodilyInjury") or 
        (this.Claim.LossType==  "AGRIAUTO" and this.LossParty == "insured" and this.ExposureType =="ab_BodilyInjury") or 
        (this.Claim.LossType==  "AGRIAUTO" and this.LossParty == "insured" and this.ExposureType =="ab_MedPay") or 
        (this.Claim.LossType==  "AGRIAUTO" and this.LossParty == "insured" and this.ExposureType == "ab_PIP") or
        (this.Claim.LossType==  "AGRIAUTO" and this.LossParty == "insured" and this.ExposureType == "ab_AGG_auto_BodInjury") or 
        (this.Claim.LossType== "AGRIAUTO"  and this.LossParty == "third_party" and  this.ExposureType == "ab_AGG_auto_BodInjury") or 
        (this.Claim.LossType== "AGRIAUTO"  and this.LossParty == "third_party" and this.ExposureType == "ab_AGG_gl_BodInjury") or
        (this.Claim.LossType == LossType.TC_SPECIALTYES and this.ExposureType == ExposureType.TC_SP_BODILY_INJURY) or
        (this.Claim.LossType == LossType.TC_SPECIALTYES and this.ExposureType == ExposureType.TC_SP_MEDICAL_PAYMENT)or
        (this.Claim.LossType== "ENVLIAB"  and this.LossParty == "third_party" and this.ExposureType == "en_bodilyinjury") or
	(this.Claim.LossType== LossType.TC_PERSONALAUTO and (this.ExposureType == ExposureType.TC_PE_BODILYINJURY || this.ExposureType == ExposureType.TC_PE_MEDPAY ||
        this.ExposureType == ExposureType.TC_PE_PRSNINJURYPROT)) or
        this.ExposureType == ExposureType.TC_AV_BODILYINJURY or 
        this.ExposureType == ExposureType.TC_AV_MEDPAY or
        (this.Claim.LossType==  LossType.TC_ALTMARKETSAUTO and this.LossParty == LossPartyType.TC_THIRD_PARTY and this.ExposureType == ExposureType.TC_AB_BODILYINJURY) or 
        (this.Claim.LossType==  LossType.TC_ALTMARKETSAUTO and this.LossParty == LossPartyType.TC_INSURED and this.ExposureType == ExposureType.TC_AB_BODILYINJURY) or 
        (this.Claim.LossType==  LossType.TC_ALTMARKETSAUTO and this.LossParty == LossPartyType.TC_INSURED and this.ExposureType == ExposureType.TC_AB_MEDPAY) or 
        (this.Claim.LossType==  LossType.TC_ALTMARKETSAUTO and this.LossParty == LossPartyType.TC_INSURED and this.ExposureType == ExposureType.TC_AB_PIP) or
        (this.Claim.LossType==  LossType.TC_SHSAUTO and this.LossParty == LossPartyType.TC_THIRD_PARTY and this.ExposureType == ExposureType.TC_AB_BODILYINJURY) or 
        (this.Claim.LossType==  LossType.TC_SHSAUTO and this.LossParty == LossPartyType.TC_INSURED and this.ExposureType == ExposureType.TC_AB_BODILYINJURY) or 
        (this.Claim.LossType==  LossType.TC_SHSAUTO and this.LossParty == LossPartyType.TC_INSURED and this.ExposureType == ExposureType.TC_AB_MEDPAY) or 
        (this.Claim.LossType==  LossType.TC_SHSAUTO and this.LossParty == LossPartyType.TC_INSURED and this.ExposureType == ExposureType.TC_AB_PIP) or
        (this.Claim.LossType==  LossType.TC_TRUCKINGAUTO and this.LossParty == LossPartyType.TC_THIRD_PARTY and this.ExposureType == ExposureType.TC_AB_BODILYINJURY) or 
        (this.Claim.LossType==  LossType.TC_TRUCKINGAUTO and this.LossParty == LossPartyType.TC_INSURED and this.ExposureType == ExposureType.TC_AB_BODILYINJURY) or 
        (this.Claim.LossType==  LossType.TC_TRUCKINGAUTO and this.LossParty == LossPartyType.TC_INSURED and this.ExposureType == ExposureType.TC_AB_MEDPAY) or 
        (this.Claim.LossType==  LossType.TC_TRUCKINGAUTO and this.LossParty == LossPartyType.TC_INSURED and this.ExposureType == ExposureType.TC_AB_PIP) or
        util.WCHelper.isWCorELLossType(this.Claim))
          return true
        else
          return false
  }
  
  // 11/19/12 - kniese - this function is added to control what feature types medicare fields (Medicare Eligible Flag
  // and the Date of Death field) appear on
  // Updated to point to the other property that checks the same thing. I did not realize we had two versions that did
  // this same thing until now. The references should be fixed at some point... 
  function isMedicareFeature(exp:Exposure) : boolean {
      return this.IsMedicareExposureExt    
  } 
  
  // ***********************
  // 1/8/15 c mullin - Function added to filter the Type Of Organization typelist for Workers' Comp Vocational Rehab.
  // ***********************
  function filterOrgType(orgType : String):Boolean{
     return (orgType == "private" or orgType == "state")
  }
  
  //Note for Merge:  This file already exists in Agribusiness.
  //Add the functions in this file to the bottom of the Agribusiness version.

  /*  This function returns all possible first party claimants.
   *
   * Zach Thomas 11/20/09
   */
   function getFirstPartyClaimantContacts():Contact[]{
     var claimantContacts:List = new ArrayList();
   
     if(this.Claim.Policy.insured != null){
       claimantContacts.add( this.Claim.Policy.insured );
     }
     if(this.Claim.Policy.doingbusinessas != null){
       claimantContacts.add( this.Claim.Policy.doingbusinessas );
     }
     for(ccRole in this.Claim.Policy.getMNICoveredParties()){
       claimantContacts.add( ccRole.Contact )
     }
   
     return (claimantContacts.toArray() as Contact[])
   }

  /*  This function checks in the incoming contact is a checkpayee, and if so identifies the role to be made a former role.
   *
   * Zach Thomas 12/08/10
   */
  function updateRolesOnCheckPayee(inCont:Contact, inRole:ContactRole){
    var inClmCont:ClaimContact = this.Claim.getClaimContact( inCont );
    if(inClmCont != null and inClmCont.hasRole("checkpayee")){
      for(clmContRole in inClmCont.Roles){
        if(clmContRole.Role == inRole){
          inCont.createFormerRole( this.Claim, clmContRole );
        }
      }
    }
  }

  /*  Checks if the current instance&apos;s vehicle incident vehicle is a policy vehicle by comparing Vin numbers.
   *  tnewcomb 03/22/2011
   */
  function isVehicleAListedPolicyVehicle() : boolean{   
    for(policyVehicle in this.Claim.Policy.Vehicles){
      if(this.VehicleIncident.Vehicle.Vin != null and
         policyVehicle.Vehicle.Vin != null and
         (this.VehicleIncident.Vehicle.Vin == policyVehicle.Vehicle.Vin)){
        return true;
      } 
    }   
    return false;   
  }

  /*  Returns the contacts related to the Claim sans the "Great American Insurance" Contact 
   *  added for EM29 Total Loss Reporting.
   *  Author: tnewcomb
   *  Date: 03/28/2011
   */
  function removeGAIContactAndGetRelatedContacts() : Contact[]{
  
    var relContacts : Contact[] = this.Claim.getRelatedContacts(); 
    var cleanContacts : List = new ArrayList();
  
    for(relCont in relContacts){
      if(relCont.Name != "Great American Insurance"){
        cleanContacts.add(relCont); 
      }
    }
  
    if(cleanContacts.size() > 0){
      return cleanContacts as entity.Contact[]; 
    }
    else{
      return this.Claim.getRelatedContacts(); 
    }
  }

  /*  Needed to get a valueRange for TotalLossInputSet salvagebuyer that excludes the value of AtAccident, if any.
   *
   */
  function getSalvageBuyerValueRange() : Contact[]{
    var relContacts : Contact[] = this.removeGAIContactAndGetRelatedContacts();
    var salvageBuyerValueRange : List = new ArrayList();
    
    if(this.VehicleIncident.OwnLienAtAccidentExt != null){
      for(relCont in relContacts){
        if(relCont != this.VehicleIncident.OwnLienAtAccidentExt){
          salvageBuyerValueRange.add(relCont);  
        }
      }
    }
  
    if(salvageBuyerValueRange != null && salvageBuyerValueRange.size() > 0){
      return salvageBuyerValueRange as entity.Contact[]; 
    }
    else{
      return relContacts; 
    }
  }

  /*  Needed to get a valueRange for TotalLossInputSet AtAccident that excludes the value of salvage buyer, if any.
   *
   */
  function getOwnerAtAccidentValueRange() : Contact[]{
    var relContacts : Contact[] = this.removeGAIContactAndGetRelatedContacts();
    var ownerAtAccidentValueRange : List = new ArrayList();
    
    if(this.VehicleIncident.salvagebuyer != null){
      for(relCont in relContacts){
        if(relCont != this.VehicleIncident.salvagebuyer){
          ownerAtAccidentValueRange.add(relCont);  
        }
      }
    }
  
    if(ownerAtAccidentValueRange != null && ownerAtAccidentValueRange.size() > 0){
      return ownerAtAccidentValueRange as entity.Contact[]; 
    }
    else{
      return relContacts; 
    }
  }
  
  /*
  *  Returns the claim assignment group if the exposure assignment group is null
  */
  function getAssignmentGroup():Group{
    if(this.AssignedGroup != null){
      return this.AssignedGroup
    }else{
      return this.Claim.AssignedGroup
    }
  }
  
  /*
  *  Returns the age of the horse if the FixedPropertyIncident is not null.
  */
  function getPropertyAge():String{
    if(this.FixedPropertyIncident.Property != null){
      return this.FixedPropertyIncident.Property.getAge().toString();
    }else{
      return null;
    }
  }

  function isCoverageAPolicyCoverage() : boolean{
    var coverageIsAPolicyCoverage : boolean = false;
    for(policyCov in this.Claim.Policy.Coverages){
      if(this.Coverage == policyCov){
        coverageIsAPolicyCoverage = true;
        break;
      }
    }
    return coverageIsAPolicyCoverage;
  }

  function synchVehicleIncidentInUI(){
  
    if(this.ExposureType == ExposureType.TC_AB_AUTOPROPDAM
        or this.ExposureType == ExposureType.TC_AB_PHYSICALDAMAGE
        or this.ExposureType == ExposureType.TC_PE_AUTOPROPDAMAGE
        or this.ExposureType == ExposureType.TC_PE_PROPDAMAGE
        or this.ExposureType == ExposureType.TC_PE_PHYSICALDAMAGE){
    
      //changing from first party policy level to vehicle level coverage
      if(this.Incident.Subtype == "VehicleIncident" 
          and this.Coverage.Subtype == "VehicleCoverage"
    	and this.LossParty != LossPartyType.TC_THIRD_PARTY){
        
          this.VehicleIncident.Vehicle = ((this.Coverage as VehicleCoverage).RiskUnit as VehicleRU).Vehicle;
      //changing from first party policy level to vehicle level coverage
      } else if(this.Incident.Subtype == "VehicleIncident"
                and (this.OriginalVersion as Exposure).Coverage.Subtype == "VehicleCoverage"
                and this.Coverage.Subtype == "PolicyCoverage"        
                and this.LossParty == LossPartyType.TC_INSURED){  	      	      
              this.VehicleIncident.Vehicle = new Vehicle();
      }
    }
  }
  
  /*returns false if there is already an auto acknowledgement letter created for this exposure OR if there is another exposure
  on the claim that has the same claimaint.  So for feature level autoack you get 1 set of documents per claimant.  returns true otherwise */
  function shouldCreateAutoAcknowledgementLetter() : boolean {
    var precondition: boolean = false
    if (this.Documents.where(\ d -> d.ex_SubType == "Claim Acknowledgement" and util.document.AutoACKLetter.isAutoAckByFormID(d.FormIDExt)
    and d.Exposure == this).IsEmpty){
      precondition = true
    }
    var documents = this.Claim.Documents.where(\ d -> d.ex_SubType == "Claim Acknowledgement" and util.document.AutoACKLetter.isAutoAckByFormID(d.FormIDExt))
    if (documents.HasElements){
      if (documents.where(\ d -> d.Exposure.Claimant == this.Claimant).HasElements){
        precondition = false
      }
    } 
                                                    
    if(this.Claim.LossType == LossType.TC_PIMINMARINE){
      return !(this.Claim.LevelOfReserveExt == null) && precondition
    }
    return precondition
  }
  
  // This function checks all the Exposures associated with all the Matters for the claim to see if the current exposure has a matter
// associated with it. If a matter exists for this exposure, return true, otherwise return false.
function doesMatterExistForFeature() : boolean {
  return (this.Claim.Matters*.MatterAssignmentsExt*.AssignmentExposuresExt*.Exposure.contains(this))?true : false;
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
    return this.LoadCommandID!=null
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
    return this.isUpdatedExt() || !this.isConvertedExt()}

  //Defect 6517 and 6667 - Driver assigned Former Driver when role changed to new party
  function setFrmrDriver() {
    if (!this.New && !this.Closed &&(this.OriginalVersion as Exposure).DriverExt != null &&
    (this.OriginalVersion as Exposure).DriverExt !=this.DriverExt) {
      this.addRole(ContactRole.TC_FORMERDRIVER, (this.OriginalVersion as Exposure).DriverExt)  
    }  
  }
    //Defect 6517 and 6667 - Salvage Buyer assigned Former Salvage Buyer when role changed to new party
  function setFrmrSalvBuyer() {
    if (!this.New && !this.Closed &&(this.OriginalVersion as Exposure).salvagebuyer != null &&
    (this.OriginalVersion as Exposure).salvagebuyer !=this.salvagebuyer) {
      this.addRole(ContactRole.TC_FORMERSALVAGEBUYER, (this.OriginalVersion as Exposure).salvagebuyer)  
    }  
  }

  //Defect 6517 and 6667 - Vehicle Owner Claim Open assigned Former Vehicle Owner Claim Open when role changed to different party
  function setFrmrOwnerOpen () {
    if (this.State != "draft" and (this.VehicleIncident.OriginalVersion as VehicleIncident).OwnLienAtAccidentExt!=null and (this.VehicleIncident.OriginalVersion as VehicleIncident).OwnLienAtAccidentExt!= this.VehicleIncident.OwnLienAtAccidentExt){ 
      this.addRole(ContactRole.TC_FRMRVEHOWNCLAIMOPEN, (this.VehicleIncident.OriginalVersion as VehicleIncident).OwnLienAtAccidentExt) 
    }
  }
  //Defect 6517 and 6667 - Vehicle Owner Claim Close assigned Former Vehicle Owner Claim Close when role changed to different party
  function setFrmrOwnerClose () {
    if (this.State != "draft" and (this.VehicleIncident.OriginalVersion as VehicleIncident).OwnLienAtClaimCloseExt!=null and (this.VehicleIncident.OriginalVersion as VehicleIncident).OwnLienAtClaimCloseExt!= this.VehicleIncident.OwnLienAtClaimCloseExt){ 
      this.addRole(ContactRole.TC_FRMRVEHOWNCLAIMCLOSE, (this.VehicleIncident.OriginalVersion as VehicleIncident).OwnLienAtClaimCloseExt) 
    }
  }
  
  function isNegativeTotalIncurred(trans : Transaction) : boolean{
    var expIncurred : gw.api.financials.FinancialsSummaryRow[]
    expIncurred = (new gw.api.financials.FinancialsSummaryModel(this.Claim, gw.api.financials.FinancialsSummaryLevel.EXPOSURE, gw.api.financials.FinancialsSummaryLevel.COSTTYPE, new gw.api.financials.FinancialsExpression[] { gw.api.financials.FinancialsCalculationUtil.getRemainingReservesExpression(), gw.api.financials.FinancialsCalculationUtil.getOpenReservesExpression(), gw.api.financials.FinancialsCalculationUtil.getFuturePaymentsExpression(), gw.api.financials.FinancialsCalculationUtil.getTotalPaymentsExpression(), gw.api.financials.FinancialsCalculationUtil.getTotalRecoveriesExpression(), gw.api.financials.FinancialsCalculationUtil.getOpenRecoveryReservesExpression(), gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetRecoveriesExpression(), gw.api.financials.FinancialsCalculationUtil.getPendingApprovalReservesExpression(), gw.api.financials.FinancialsCalculationUtil.getPendingApprovalPaymentsExpression(), gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetRecoveriesExpression().minus(gw.api.financials.FinancialsCalculationUtil.getOpenRecoveryReservesExpression()) }, false)).getFinancialsSummaryRows() as gw.api.financials.FinancialsSummaryRow[]

    for(fsRow in expIncurred){
      var totalIncurred = fsRow.getValue(gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetRecoveriesExpression().minus(gw.api.financials.FinancialsCalculationUtil.getOpenRecoveryReservesExpression())) 
      
      if(totalIncurred.Amount < 0.0 and fsRow.Level.Level != 2){
        if(trans.Subtype == "reserve" or trans.Subtype == "payment"){
          if(trans.Amount + totalIncurred.Amount < 0){
           return true 
          }
        }
        if(trans.Subtype != "reserve" and trans.Subtype != "payment"){
          return true
        }
      }
     }
     
     return false
  }

  
  //Added below validation rule functions to ensure the  Beneficiary Date of Birth, Beneficiary Dependency code and Beneficiary Relationship code
  //are not Null at Ability to pay validation level
  //Developer:Asaikumar Date:06/09/2015   

  static function BenDateOfBirthVal(ex:Exposure){
     var clm=ex.Claim
     for(cont in clm.Contacts){
       for(contCont in cont.Contact.AllContactContacts){
         if(new util.lvwrapper.ClaimContactContactLVWrapper(contCont, cont.Contact, clm).RelatedBidiRel=="beneficiary"){
             var cp=contCont.RelatedContact
     
       
        if(cp typeis Person && cp.DateOfBirth==null)
        {
          ex.reject( "payment", " Date of Birth of the Beneficiary:"+contCont.RelatedContact+ " of " + cont.Contact+" is required for Ability to Pay", null, null)
         
        } 
      }
    }
   }
  }
  
  static function BeneficiaryDepndVal(ex:Exposure){
    var clm=ex.Claim
     for(cont in clm.Contacts){
       for(contCont in cont.Contact.AllContactContacts){
         if(new util.lvwrapper.ClaimContactContactLVWrapper(contCont, cont.Contact, clm).RelatedBidiRel=="beneficiary"){
      if(contCont.BeneficiaryDepndExt==null){
        ex.reject("payment", "Beneficiary Dependency code on Related Contact "+contCont.RelatedContact+ " of "+cont.Contact+
        " is required for Ability to Pay", null, null)
            }
         }
         
       }
     }
   }
 
  static function BeneficiaryRelatnVal(ex:Exposure){
    
     var clm=ex.Claim
     for(cont in clm.Contacts){
       for(contCont in cont.Contact.AllContactContacts){
         if(new util.lvwrapper.ClaimContactContactLVWrapper(contCont, cont.Contact, clm).RelatedBidiRel=="beneficiary"){
      if(contCont.BeneficiaryRelatnExt==null){
        clm.rejectField("Contacts", "payment", "Beneficiary Relationship code on Related Contact "+contCont.RelatedContact+ " of "
        +cont.Contact+" is required for Ability to Pay", null, null)
            }
         }
         
       }
     }
   }
   
   // Added for Aviation - Loss Payee field on Physical Damage feature screen
   function getPersonOrCompany():List{
    var returnList:List = new ArrayList() 
  
    for(contact in this.Claim.getRelatedContacts()){
      if(contact.Subtype== "Person"|| contact.Subtype=="Company"){
        returnList.add(contact)   
      }
    }
  
    return returnList
  }
  
  // Added for Aviation - Function to null out the claim loss payee when the indicator is set to no
  function resetLossPayee(){
    if (this.LossPayeeIndicatorExt == false){
      // Remove Role and add former
      if (this.LossPayeeExt != null){
        for(con in this.Claim.Contacts){
          if (con.Contact == (this.LossPayeeExt)){
            for (r in con.Roles){
              if (r.Role == "claimlosspayee"){
                this.LossPayeeExt.createFormerRole(this.Claim, r)
                this.removeRole(r)
              }
            }
          }
        }
        // Remove the current Loss Payee from the exposure
        this.LossPayeeExt = null
      }
    }
  }
}
