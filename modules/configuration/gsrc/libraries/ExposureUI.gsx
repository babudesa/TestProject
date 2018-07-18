package libraries

uses java.util.ArrayList
uses libraries.ExposuresUI.ExposureUIHelper

@Export
enhancement ExposureUI : entity.Exposure
{
  
  /*
  *  Property stores the Exposures UI Helper Class
  */
  property get UIHelper(): ExposureUIHelper{
      return new ExposureUIHelper(this)
  }
  
 
  /*
   * Initialize any standard default values on a newly created exposure. Used in the new exposure
   * pages in the claim file and in the new claim wizard
   */
  function setInitialValues() {
    // Defect 8500 - for WC claims set the exposure jurisdiction state equal to the claim jurisdiction state
    if(!this.Claim.isWCclaim){
      this.JurisdictionState = this.Claim.LossLocation.State
    } 
    if(this.Claim.isWCclaim){
     this.JurisdictionState = this.Claim.JurisdictionState 
    }
    this.ValidationLevel =  "newloss";
    if (this.Claim.LossType =="EQUINE"){
        this.Claimant = this.Claim.Insured;
        this.ClaimantType = "insured";  
    }
    
    // Defect 6178. 5/15/13. Craig Mullin. For ELD only: Added code to set defaults for ReservedFileExt and LegalExpenseExt (both set to True).
    // Adding PLD 5/21/13 - anicely
	// Defect 6350 - 8/21/13 anicely - Legal Expense should default to No for ELD.  Removing the PLD default as part of this defect
    if(this.Claim.LossType=="EXECLIABDIV" || this.Claim.LossType == LossType.TC_MERGACQU || this.Claim.LossType == LossType.TC_SPECIALHUMSERV){
      this.ReservedFileExt = true;
      this.LegalExpenseExt = false;
    }
    
    if(this.Claim.LevelOfReserveExt!=null){
      if(this.Claim.LevelOfReserveExt == TC_UNDER_EQUAL_10K){
        this.ReservedFileExt = false
      } else {
        this.ReservedFileExt = true
      }
    }
  }
  
  function getAttorneys():List{
    var result:List = new ArrayList()
    for(contact in this.Claim.getRelatedContacts()){
      if(contact.Subtype=="Attorney" || contact.Subtype=="LawFirm"
          || contact.Subtype=="Ex_ForeignCoVenLawFrm" || contact.Subtype=="Ex_ForeignPerVndrAttny"){
          result.add(contact)   
      }
    }
    return result
  }

  /*
   * Used to initialize the incident for a new exposure when it is created in the UI. For exposure
   * types where the user is allowed to pick the incident explicitly, makes an initial guess at the
   * best incident then leaves the choice to the user. For other exposure types just creates a
   * brand new incident of the appropriate type
   */
  function initializeIncident() : Incident {
    var incident : Incident = null;
    if (this.ExposureType == ExposureType.TC_VEHICLEDAMAGE
        || this.ExposureType == ExposureType.TC_PROPERTYDAMAGE
        || this.ExposureType == ExposureType.TC_THEFT
        || this.ExposureType == ExposureType.TC_TOWONLY) {
      // Explicit incident; try to get from coverage, otherwise guess
      var coverage = this.Coverage;
      if (coverage != null) {
        incident = coverage.findOrCreateIncident(this.ExposureType);
      }
      if (incident == null) {
        incident = this.findBestIncidentForNewExposure();
      }
    } else {
      // Implicit incident; always create new
      incident = this.newIncident();
    }
    this.Incident = incident;
    return incident;
  }
  /*
   * Looks through the existing incidents on the exposure&apos;s claim for the incident that looks
   * to be the best match for this exposure. This incident is pre-filled in the new exposure UI
   * as the initial guess for which incident should be used with this exposure, though the user
   * can always override it.
   *
   * Only incidents of the appropriate type for this exposure are considered; if there are no
   * incidents of the appropriate type this method returns null.
   *
   * An incident is considered a good choice if
   * 1) it is suitable for the exposure, as decided by the incident isSuitableForExposure method
   * 2) it is not already in use by another exposure
   * 3) if it relates to a vehicle or property on the policy.
   *
   * Only suitable incidents are considered, but after that being unused takes priority. For
   * example if there are two incidents, the first already used but relating to a vehicle on the
   * policy, the second unused but not relating to a vehicle on the policy, then the second will
   * be chosen.
   *
   * If all else fails (e.g. if none of the incidents were in use and they all related to
   * a vehicle/property on the policy) then this method just uses the one with the earliest
   * display name (by alphanumeric sorting)
   *
   * Returns the incident that looks to be the best match for this exposure or null if there
   * are no suitable incidents on the claim
   */
  function findBestIncidentForNewExposure() : Incident {
    var possible = this.PossibleIncidents;
    var best : Incident = null;
    for (incident in possible) {
      if (incident.isSuitableForExposure(this) and (best == null or incident.isBetterForNewExposure(best))) {
        best = incident;
      }
    }
    return best;
  }
  /*
   * Returns all vehicle incidents on this exposure&apos;s claim which have the given loss party.
   * Includes any incidents which have a null loss party and includes all incidents if
   * the given loss party is null. Used in the incident picker on the vehicle damage exposure page
   * so it only shows the vehicle incidents suitable for the current exposure
   */
  function getVehicleIncidentsWithMatchingLossParty(lossParty : LossPartyType) : VehicleIncident[] {
    var incidents = this.Claim.VehicleIncidentsOnly;    
    var result = new java.util.ArrayList<VehicleIncident>();
    for (incident in incidents) {
      if (lossParty == null || incident.VehicleLossParty == null || incident.VehicleLossParty == lossParty) {
        result.add(incident);
      }
    }
    return result.toTypedArray();
  }

  function checkIncidentExistsforFeature() : Boolean {
    //var horseonFeature = (this.Coverage as PropertyCoverage).Property.location
    // 2/14/08 - zthomas - Defect 789, use FixedPropertyIncident
    var horseonFeature = this.FixedPropertyIncident.Property.LocationNumber
    for (injuredanimal in this.Claim.FixedPropertyIncidentsOnly) { 
          if (injuredanimal.Property.LocationNumber == horseonFeature)
          return true
    }
    return false
  }

  function getFeatureStaffingStatus() : String {
    var expStaffingStatus:String
    
    if (this.getFeatureFinancialStatus() == "Closed" &&
    !exists (act in this.Claim.Activities where (act.Exposure == this && act.Status =="open"))) {
      expStaffingStatus = "Closed"
    }
    else {
      expStaffingStatus = "Open"
    }
    return expStaffingStatus
  }

  /* create financial status 9/5/07  def 312
  updated erawe 10/29/12 to check for null on OpenReserve and OpenRecovryReserves
  */
  function getFeatureFinancialStatus() : String {
    var expFinancialStatus:String
    
    if ((this.ExposureRpt.OpenReserves == 0 or this.ExposureRpt.OpenReserves == null) && (this.ExposureRpt.OpenRecoveryReserves == 0 or this.ExposureRpt.OpenRecoveryReserves == null)) {
      expFinancialStatus = "Closed"
    }
    else {
      expFinancialStatus = "Open"
    }
    return expFinancialStatus
  }
   
  function getFeatureFinancialReserveStatus() : String {
    var expFinancialStatus:String
    
    if ((this.ExposureRpt.OpenReserves == 0 or this.ExposureRpt.OpenReserves == null)) {
      expFinancialStatus = "Closed"
    }
    else {
      expFinancialStatus = "Open"
    }
    return expFinancialStatus
  }

function getFeatureFinancialReserveRecoveryStatus() : String {
    var expFinancialStatus:String
    
    if ( (this.ExposureRpt.OpenRecoveryReserves == 0 or this.ExposureRpt.OpenRecoveryReserves == null)) {
      expFinancialStatus = "Closed"
    }
    else {
      expFinancialStatus = "Open"
    }
    return expFinancialStatus
  }   
    
  /*determine first party loss or third party loss for ab_MedPay on the feature screen, 12/26/07 ER 
  At this time the ONLY Agri coverage code ab_AUTO_calc will show as a First Party loss type
  for ab_MedPay.  Liabilities using ab_MedPay will show as Third Party loss type on the feature screen
  */

  //function setFeatureLossPartyMedPay()   {
  //    if(this.Coverage.Type.Code=="ab_AUTO_calc" || this.Coverage.Type.Code=="ab_LIAB_amp"){
  //       this.LossParty="insured"
  //    }
  //     else{
  //        this.LossParty="third_party"
  //     }  
  //}

  //function setFeatureLossPartyBIPD()   {
  //    if(this.Coverage.Type.Code== "ab_LIAB_unmbi"|| this.Coverage.Type.Code=="ab_LIAB_unmbipd"
  //    || this.Coverage.Type.Code=="ab_LIAB_unmpd" || this.Coverage.Type.Code=="ab_LIAB_undermbi"
  //    || this.Coverage.Type.Code=="ab_LIAB_undermbipd"){
  //       this.LossParty="insured"
  //    }
  //     else{
  //        this.LossParty="third_party"
  //     }  
  //}

  function setFeatureLossParty()   {
          if (this.ExposureType !=ExposureType.TC_IM_DATACOMP  && this.Coverage!=null and(this.Coverage.Type.hasCategory( typekey.LossPartyType.TC_INSURED ))){
        this.LossParty = "insured"
      }
      if (this.Coverage!=null and this.ExposureType !=ExposureType.TC_IM_DATACOMP and(this.Coverage.Type.hasCategory( typekey.LossPartyType.TC_THIRD_PARTY ))){
        this.LossParty = "third_party"
        }
      if (this.Coverage!=null and((this.Coverage.Type.hasCategory( typekey.LossPartyType.TC_THIRD_PARTY )&&  
         (this.Coverage.Type.Code=="ab_LIAB_calcnnssel" ||
         this.Coverage.Type.Code=="ab_LIAB_calcnssemp" ||
         this.Coverage.Type.Code=="ab_LIAB_calcnssvol" ||
         this.Coverage.Type.Code== "ab_AUTOcalc_NSSEMP" ||
         this.Coverage.Type.Code== "ab_AUTOcalc_PART" ||
         this.Coverage.Type.Code== "ab_AUTOcalc_SSEMP" ||
         this.Coverage.Type.Code== "ab_AUTOcalc_SSVOL" ||
         this.Coverage.Type.Code== "ab_AUTOcalc_DOCP" ||
         this.Coverage.Type.Code== "ab_AUTOcalc_HCAR" ||
         this.Coverage.Type.Code== "ab_AUTOcalc_VEH")
         && this.ExposureType.Code=="ab_MedPay"))) {
        this.LossParty = "insured"
      }
      if (this.ExposureType=="ab_PIP" && this.ReciprocatePIPExt==false){
        this.LossParty = "insured"
      } else if(this.ExposureType=="ab_PIP" && this.ReciprocatePIPExt==true){
        this.LossParty = "third_party"
      }
      //11/18/08 - Defect 1544 - erawe - AgriGuard Umbrella coverage is now Third-Party unless the detail is
      // underinsured or uninsured, then it&apos;s insured (first part).  This is a change to defect 1379.
      if(this.ExposureDetailsExt=="underinsured_mot"|| this.ExposureDetailsExt=="uninsured_mot"){ 
        this.LossParty = "insured"
      }
      if(this.ExposureType == ExposureType.TC_SP_IDENTITY_THEFT){
          this.LossParty = LossPartyType.TC_INSURED
      }
      // 11.10.15 - Defect 7991 - Loss Party on all WC & EL features will automatically be set to "third party".
      if(util.WCHelper.isWCorELLossType(this.Claim)){
          this.LossParty = LossPartyType.TC_THIRD_PARTY
      }
  }
  
  
  /* create feature status 1/11/08 Def 595*/
  function getFeatureStatus() : String {
  
    if(this.Closed == true){
      return "Closed"
    }else{
      return "Open"
    }
  }

  /*Zero out reserves on current Exposure - kmboyd defect 654*/
  /* kniese - 8/16/16 - Defect 6688 - Stop Review Rejected Request activity from generating.
   * The function setAvailableReserves() creates a new Reserve for the amount that you are
   * trying to decrease the reserve amount. That reserve then creates an approval activity
   * which gets rejected on a final payment. Added code to approve the reserve and delete
   * the approval activity behind the scenes.
  */
  function zeroOutReserves() : void {
    
    /* kmboyd Defect 654 - Moved from Exposure Pre-Update to extend Exposure itself since this is now going to be
     used more than one place. */
 
    // kso def 486 - remove try catch, fix later with def 652   12/11/07
    // kso def 486 - add try catch 12/10/07
    //set open reserves to 0
    var foundPending:Boolean = false;
  
    for(each in this.ReserveLines){
      for(payment in this.PaymentsQuery.iterator()){    
        if((payment as PaymentView).Status == "pendingapproval" and ((payment as PaymentView).Transaction as Payment).ReserveLine == each){
          each.CloseOnFinalExt = true;
          foundPending = true;  
        }
      }
      if(!foundPending){
        if(this.getAvailableReserves(each.CostType, each.CostCategory) != 0){
          var newRes = this.setAvailableReserves(each.CostType, each.CostCategory, 0, this.Claim.AssignedGroup.Supervisor)
          // Go through and approve the new reserve that was created through setAvailableReserves()
          if(newRes.TransactionSet != null){  
            newRes.TransactionSet.ApprovalStatus = ApprovalStatus.TC_APPROVED
            newRes.TransactionSet.ApprovalHandler.approvalStarted();
            newRes.TransactionSet.ApprovalHandler.approved()
           }
           //Cycle through the activities and remove the approval activity that was created for the setAvailableReserves() function  
           for(act in this.Claim.Activities){
             if(act.ActivityPattern.Code == "approve_reserve_change" and act.Status == ActivityStatus.TC_OPEN and act.Exposure == this){
               act.remove()
             }
           }
        }
      }
        each.CloseOnFinalExt = false;
      }
      foundPending = false;
    }
     //set open recovery reserves (estimates) to 0
    //Defect #6016-->While creating a final payment on the feature and feture have open recovery Estmates,The Recovery Estimate will remain open.
    /*for(eachRec in this.getRecoveryReservesIterator(false )) {
       var recreserve = eachRec as RecoveryReserve;
       this.setOpenRecoveryReserves(recreserve.CostType, recreserve.CostCategory, recreserve.RecoveryCategory, 0, this.UpdateUser)
    }*/

  
  /*Create Open Reserves - Replaces Exposure.Exposurerpt.OpenReserves - kmboyd defect 654
    6/3/08 - Adjusted the function to take into account pending reserves/payments and supplementals - kmboyd defect 484
    6/25/08 - Made another adjustment to the function to take into account that there are two reserve lines being added together
              It now takes all expense reserves and subtracts the expense payments and all the loss reserves and subtracts the loss payments
              then returns the number of these two adjusted payments. Number will never be negative (all negatives turn into positives)*/
  function openReserves() : double{
    var retReserves : double = 0
    var expReserves : double = 0
    var lossReserves : double = 0
    var adjExpReserves : double = 0
    var adjLossReserves : double = 0
    var expPayments : double = 0
    var lossPayments : double = 0
    var tempTrans : TransactionDefaultView
    
    for(trans in this.TransactionsQuery.iterator()){
      tempTrans = trans as TransactionDefaultView;
      //Add reserves to the reserves variable only if they are approved
      if(tempTrans.TransactionSubtype == "Reserve" and !tempTrans.Transaction.NotApproved){
        if(tempTrans.CostType ==  "claimcost"){
          lossReserves = lossReserves + tempTrans.Amount.Amount as double
        }else{
          expReserves = expReserves + tempTrans.Amount.Amount as double
        }
      }
    
      //Add payments only if they are approved and not supplmental
      if(tempTrans.TransactionSubtype == "Payment" and !tempTrans.Transaction.NotApproved and (tempTrans.Transaction as Payment).PaymentType != "supplement"){
        if(tempTrans.CostType ==  "claimcost"){
          lossPayments = lossPayments + tempTrans.Amount.Amount as double
        }else{
          expPayments = expPayments + tempTrans.Amount.Amount as double
        }
      }
    }
  
    adjExpReserves = expReserves - expPayments
    adjLossReserves = lossReserves - lossPayments
  
    if(adjExpReserves < 0 and adjLossReserves < 0){
      retReserves = 0
    }else if(adjLossReserves < 0){
      retReserves = 0 + adjExpReserves
    }else if(adjExpReserves < 0){
      retReserves = 0 + adjLossReserves
    }else{
      retReserves = adjExpReserves + adjLossReserves
    }
  
    //If reserves are less than 0 return 0, otherwise return the amount
    return retReserves;
  }
  
  function getAllSmillarpaidFeaturesPayments(expType:ExposureType,costType:CostType):double{
     var exp=this.Claim.Exposures
    var totalLossRes:double=0
    
     for(e in exp index i){
      // var rlines:Reservelines=this.Claim.Exposures
        for(reserveLine in e.ReserveLines){
           if(e.ExposureType==expType){
             if(reserveLine.CostType==costType){
               totalLossRes=totalLossRes+ e.getPaidPayments(reserveLine.CostType, reserveLine.CostCategory)
               }
             }
            }
        }
         return totalLossRes
     }
  
     
  function getAllSimillarFeaturesReserves(expType:ExposureType,costType:CostType):double{
    var exp=this.Claim.Exposures
    var totalLossRes:double=0
    
     for(e in exp index i){
       //var rlines:Reservelines=this.Claim.Exposures
        for(reserveLine in e.ReserveLines){
           if(e.ExposureType==expType){
             if(reserveLine.CostType==costType){
               totalLossRes=totalLossRes+e.getAvailableReserves(reserveLine.CostType, reserveLine.CostCategory)
               }
             }
            }
        }
         return totalLossRes
}


  function getExposureDetailVisibility(coverage : CoverageType):boolean{
    var showDetails:boolean = true
    var applicableTypeKeys : List = new ArrayList()
  
    for(key in ExposureDetails.getTypeKeys(false)){
      if(key.hasCategory( coverage ) && key.hasCategory( this.ExposureType)){
        applicableTypeKeys.add(key)
      }
    }
  
    for(key in applicableTypeKeys){
      if(key.toString()=="Not Applicable"){
        showDetails = false
      }
    }
    return showDetails 
  }

  function getSublimitVisibility(coverage : CoverageType):boolean{
    var showSublimits:boolean = true
    var applicableTypeKeys : List = new ArrayList()
  
    for(key in Sublimits.getTypeKeys(false)){
      if(key.hasCategory( coverage ) && key.hasCategory( this.ExposureType )){
        applicableTypeKeys.add(key)
      }
    }
    if(applicableTypeKeys.length>0){
      for(key in applicableTypeKeys){
        if(key.toString()=="Not Applicable"){
          showSublimits = false
        }
      }
    } else {
      showSublimits = false
    }
    return showSublimits 
  }

  //3-7-08 sprzygocki - sets the claimant default to the insured if the loss party is first party
  //9/3/09 erawe - made this.claimant==null, it was !=null.  When you entered a new claimant in NCW
  //and clicked ok, then went back into the feature it was setting it back to the insured and you 
  //new claimant was gone
  function setClaimant(){
    if(this.LossParty=="insured" and this.Claimant==null){
      this.Claimant = this.Claim.Insured;
      this.ClaimantType = "insured";
    }
  }

  //this function returns the office/business unit attached to the exposure

  function getClaimOfficeBranchGroup() : Group {
  
    var group = this.AssignedGroup
    
    if (group == null)
      return null
    
    do {
      var type = group.GroupType
      /** Return the group name if the GroupType is of branch office or business unit */
      if (type == "branchoffice" || type == "busunit" || type == "nonclaimsbusunit") {
        return group
      }
      group = group.Parent
    }
    while(group != null)
    /** If we didn&apos;t have a group which was a branchoffice or business unit return "SCO" */
    return null
  }
 
  /*Function that will return coverages that are applicable to current feature - kmboyd - 1/12/09*/
  function getApplicableCvgs():Coverage[]{
    var cvgs:List = new ArrayList()
    var prop : PolicyLocation = null
    var coverages : List = new ArrayList()
    
    for(cvg in this.Claim.Policy.Coverages){
      if(validCvgForExposure(cvg)){
        cvgs.add(cvg);
      }
    }
      
    if(this.FixedPropertyIncident != null){
      prop = this.FixedPropertyIncident.Property
      for(coverage in this.Claim.Policy.AllCoverages){
        if(coverage.Subtype=="PropertyCoverage" and ((coverage as PropertyCoverage).RiskUnit as PropertyRU).Property == prop){
          coverages.add(coverage)
        }
      }
     for(cvg in coverages){
        if(validCvgForExposure(cvg as Coverage)){
          cvgs.add(cvg);
        }
     }
    }else{
      for(pty in this.Claim.Policy.Properties){
        prop = pty.Property
        for(coverage in this.Claim.Policy.AllCoverages){
          if(coverage.Subtype=="PropertyCoverage" and ((coverage as PropertyCoverage).RiskUnit as PropertyRU).Property == prop){
            coverages.add(coverage)
          }
        }
        for(cvg in coverages){
          if(validCvgForExposure(cvg as Coverage)){
            cvgs.add(cvg);
          }
        }
      }
    }
    return cvgs as Coverage[];
  }
  function validCvgForExposure(cvg:Coverage) : boolean{
    for(subType in CoverageSubtype.getTypeKeys(false)){
      if(subType.hasCategory( cvg.Type ) and this.ExposureType.hasCategory( subType )){
        return true;  
      }
    }
    return false;
  }
  function removeGlassOnlyOnchange(){
  if(!(this.GlassOnlyClaimIndExt)==false){
    this.BodyShopPaymentIndExt=NULL
    this.TotalDamageIndExt=NULL
    this.ReinspectedIndExt=NULL
    this.ReinspectionresultExt=NULL
  }
  }
  
  function removeBodyPaymentOnchange(){
    if(!(this.BodyShopPaymentIndExt)==true){
      this.TotalDamageIndExt=NULL
      this.ReinspectedIndExt=NULL
      this.ReinspectionresultExt=NULL
    }
  }
  
  function removeTotalDamageOnchange(){
    if(!(this.TotalDamageIndExt)==true){
      this.ReinspectedIndExt=NULL
      this.ReinspectionresultExt=NULL
    }
  }
  
  function removeReinspectOnchange(){
    if(!(this.ReinspectedIndExt)==true){
      this.ReinspectionresultExt=NULL
    }
  }
  
  function removeTotalLossOnChange(){
  
  if(!(this.TotalLossIndExt)==false )
  this.GlassOnlyClaimIndExt=NULL
  this.BodyShopPaymentIndExt=NULL
  this.TotalDamageIndExt=NULL
  this.ReinspectedIndExt=NULL
  this.ReinspectionresultExt=NULL
  
}
function getDeductibleText(deduct : DeductibleExt): String {
  if(deduct==null){
  return null
  } else{
    return (gw.api.util.StringUtil.formatNumber(deduct.Deductible as java.lang.Double, "$###,###") + " - " + (deduct.DeductLimitAppExt.DisplayName))
  }
  }
  

  
function checkForValidExpFor180MedReminder() : boolean
{
   if(this.ExposureType  == "ab_BodilyInjury" || // Bodily Injury
     this.ExposureType  == "ab_AGG_auto_BodInjury" || //Agri Auto
     this.ExposureType ==   "ab_AGG_gl_BodInjury" || //Agri Liab
     this.ExposureType == "ab_PersonalInjury" || //PI (3rd party)
     this.ExposureType == "ex_auto_BodInjury" || //Exc/Umb Auto BI
     this.ExposureType == "ex_excess_BodInjury" || //Exc/Umb Auto BI
     this.ExposureType == "sp_bodily_injury" || //Added New Exposure type
    (this.Claim.LossType == "EXECLIABDIV" && // Executive Liability (where BI/Emotional Distress = Yes)
     this.Claim.BodilyInjuryExt == true && //Executive Liability (where BI/Emotional Distress = Yes)
     this.ExposureType != "el_LossAdjustExp") || 
     this.Claim.LossType =="AGRIXSUMBAUTO" || //Agri Liab Exc/Umb Auto BI
     this.Claim.LossType == "AGRIXSUMBLIAB" || //Agri Liab Exc/Umb BI
    (this.ExposureType =="en_Bodilyinjury" && // Environmental BI
     this.Claim.LossType == "ENVLIAB")|| // Environmental BI
     this.Claim.LossType.DisplayName.contains("Employers' Liability") || // Employer's Liability
    ((this.Claim.LossType == LossType.TC_MERGACQU || this.Claim.LossType == LossType.TC_SPECIALHUMSERV) && // Mergers & Acquisitions or SHS (where BI/Emotional Distress = Yes)
     this.Claim.BodilyInjuryExt == true && //Mergers & Acquisitions  (where BI/Emotional Distress = Yes)
     this.ExposureType == ExposureType.TC_EL_INDEMNITY)) //Non-Duty to Defend only
    {
      return true
    }
    return false
  }
  
}