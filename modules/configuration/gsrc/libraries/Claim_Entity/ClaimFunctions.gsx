package libraries.Claim_Entity

uses com.gaic.integration.cc.gscript.independentadjusters.IndependentAdjusterFactory;
uses com.gaic.integration.cc.gscript.independentadjusters.exception.IndependentAdjusterException;
uses java.util.ArrayList;
uses com.gaic.integration.cc.gscript.independentadjusters.IndependentAdjuster

enhancement ClaimFunctions : entity.Claim {
  function getAgencies():List{
    var agencies:List = new ArrayList()
    //var i=0
   
    for(contact in this.Contacts){
      if(exists(role in contact.Roles where role.Role=="Agency")){
        agencies.add(contact.ex_Agency)
      }
    }
    return agencies
  }

  function getOrganizations():List{
    var contlist = new ArrayList();
    for(contact in this.RelatedCompanyArray){
      if(contact.Subtype != "ex_Agency"){
        contlist.add(contact)
      }
    }
    return contlist
  }

  function getClaimantsExt() : List{
    var list : List = new ArrayList()
    for(contact in this.Contacts){
      if(exists( role in contact.Roles where role.Role.Code == "claimant")){
        list.add(contact.Contact)
      }
    }
    return list
  }

  public function getAsAdjusterString(adjusterName : String, withoutHeaderFooter : Boolean) : String {
    var returnString = "";

    var ia : IndependentAdjuster;
    try {
      ia = IndependentAdjusterFactory.createIndependentAdjuster( adjusterName );
     ia.transform(this, withoutHeaderFooter);
      returnString = ia.getHTMLString();
    }
    catch (e) {
      e.printStackTrace();
      if (e typeis IndependentAdjusterException) {
        returnString = e.toHTML();
      }      else {
        returnString = "A system error occurred";
     }
    }
    return returnString;
  }

  public function loadIndepAdjuster (adjusterName:String) : IndepAdjusterExt{
    var adjuster : IndepAdjusterExt = null
    if(adjusterName == "GAB"){ 
      for( ia in this.IndepAdjustersExt){
        if(ia.Subtype == "IAGABExt") {
          adjuster = ia
        }
      }
    }
    else if (adjusterName == "crawford"){ 
      for( ia in this.IndepAdjustersExt){
        if(ia.Subtype == "IACrawfordExt") {
          adjuster = ia
        }
      }
    }
    else { 
      for( ia in this.IndepAdjustersExt){
        if(ia.Subtype == "IAOtherExt") {
          adjuster = ia
        }
      }
    }
  
    return adjuster!=null ? adjuster : newIndepAdjuster(adjusterName)
  }

  public function newIndepAdjuster (adjusterName:String) : IndepAdjusterExt
  {
    var ia : IndepAdjusterExt = null;
  
    if(adjusterName == "GAB")
      { ia = new IAGABExt() }
    else if (adjusterName == "crawford")
      { ia = new IACrawfordExt() }
    else //if (adjusterName == "other")
      { ia = new IAOtherExt() }
  
    this.addToIndepAdjustersExt( ia ); 
    return ia;
  }

  public function deleteIndepAdjuster (ia : IndepAdjusterExt)
  {
      this.removeFromIndepAdjustersExt(ia);
  }

  public function hasDisconnectedFeatures():boolean{
  
   if ( this.Policy.Verified == true) { 
  
       for ( exp in this.Exposures) { 
      
          if ( exp.FixedPropertyIncident.Property.PhysicalPropertyEBIInstExt == null or exp.Coverage.CoverageEBIExt == null)
            {
              //print("we found a disconnected feature ");
              //print("::" + exp);
              return true ;
         
            }
       
       }
   
   } 
 
     return false;
 
  }

  //This function is used to filter the type of evaluation available to the user based on the loss type and exposure type. 
  //jlm 8/19/2008
  public function determineEvalType(inClaim:Claim, inEvalType:String):boolean
  {
    var ltype = inClaim.LossType
    var expType : ExposureType[] = determineExposureType(inClaim.Exposures) 
  
    if(ltype == "AGRIPROPERTY" && (inEvalType == "prop" || inEvalType == "sett"))
    {
       return true 
    }
  
    if(ltype == "AGRILIABILITY")
    {  
     for(type in expType)
     {
        if((type != "ab_EngineDamage") &&
        (type != "ab_BoatDamage") && 
        (type != "ab_TrailerDamage"))
        {
          if(inEvalType == "liab" || inEvalType == "sett")
          {
            return true
          }
        }
        else if((type ==  "ab_EngineDamage") || (type == "ab_BoatDamage") || (type == "ab_TrailerDamage"))
           {  
               if(inEvalType == "prop" || inEvalType == "sett")
              {
                return true
              }     
           }
      }
     }
     if(ltype == "AGRIAUTO")
     {
       for(type in expType)
       {
        //  if(type == "ab_BodilyInjury" || type == "ab_PropertyDamage" || type == "ab_AutoPropDam" || type == "ab_MedPay" || type == "ab_PIP")
        if(type != "ab_PhysicalDamage")
          {
            if(inEvalType == "liab" || inEvalType == "sett")
            {
               return true 
            }
          }
          else if(type == "ab_PhysicalDamage")
          {
            if(inEvalType == "prop" || inEvalType == "sett") 
            {
              return true
            }
          }
       }
      }
   
     if(ltype == "EQUINE")
     {
         if(inEvalType == "prop" || inEvalType == "sett")
         {
            return true 
         }
     }
   
    
    return false
  }

  public function determineExposureType(inExp:Exposure[]): ExposureType[]
  {
     var expTypeList = new ArrayList()
     for (exp in inExp) {
       expTypeList.add( exp.ExposureType )
     }
    return expTypeList as typekey.ExposureType[]
  }

  // 2/16/2009 - zthomas - Defect 1054, Function adds property contact to claim with policy as the owner of the given role.
  // 2/20/2009 - zthomas - Defect 1054, Modified function to look at role owner as well.
  public function addPropertyContact(role:ContactRole, contact:Contact) : ClaimContactRole{
    var CCR:ClaimContactRole = null;
  
    for(owner in this.RoleOwners){
      if(owner == this.Policy.PolicyNumber){
        if(!exists(cont in this.Contacts where cont.Contact == contact)
        or (exists(cont in this.Contacts where cont.Contact == contact
        and !exists(role1 in cont.Roles where role1.Role == role and role1.Owner == owner)))){
          CCR = this.addRole( role, contact );
          CCR.Owner = owner
        }
      }
    }
  
    return CCR;
  }

  public function removePropertyContact(role:ContactRole, contact:Contact){
    if(this.State == "draft"){
      for(cont in this.Contacts){
        if(cont.Contact == contact){
          for(role2 in cont.Roles){
            if(role2.Role == role){
              cont.removeFromRoles( role2 )
            }
          }
          if(cont.Roles == null or cont.Roles.length == 0){
            this.removeFromContacts( cont )
          }
        }
      }  
    }
  }

  public function getRelatedPersonsPlusAgency(): Contact[] {
    var contactList : List = new ArrayList()
    for (cont in this.RelatedContacts){
      if ((cont typeis Person) or (cont typeis ex_Agency)){ 
        contactList.add( cont )
      }
    }
       return contactList as Contact[] 
    }

  public function setRoleOwner(role:ClaimContactRole, owner:String){
      for (roleOwner in this.RoleOwners){
         if(role.Owner != owner && roleOwner == owner){
           role.Owner = roleOwner
           break
         }
          
      }
    }
  public function validateDeathDate(): java.lang.String {
    if (this.DeathDate != null){
    if (gw.api.util.DateUtil.compareIgnoreTime(this.DeathDate, this.LossDate)<0){
      return displaykey.Libraries.ClassExt.Claim.DeathDatePriorToLossError(util.custom_Ext.DateTime.formatDate(this.DeathDate) , util.custom_Ext.DateTime.formatDate(this.LossDate))
    }else if (gw.api.util.DateUtil.compareIgnoreTime(gw.api.util.DateUtil.currentDate(), this.DeathDate)<0){
      return displaykey.Java.Validation.Date.ForbidFuture
    }else{
      return null  
    }  
    }else {
      return null
  }
  }

  public function checkAwaitingSubFinalPayment(reserveLine:ReserveLine):Boolean{
    var result : Boolean = false;  
    for(trans in this.TransactionsQuery.iterator()){
      if((trans as TransactionDefaultView).Transaction.Subtype == "Payment"){
        var pmt = ((trans as TransactionDefaultView).Transaction as Payment);
        if(pmt.PaymentType == "final" and pmt.Status == "awaitingsubmission" and 
        (pmt.ReserveLine == reserveLine or reserveLine == null)){
          result = true;
        }
      }
    }
  
    return result;
  }

  /*  This function determines if the claim has a check pending.
   *
   * Zach Thomas 9/24/09
   */
   function hasPendingPayments():Boolean{
     var result:Boolean = false;
     
     for(trans in this.TransactionsQuery.iterator()){
      if((trans as TransactionDefaultView).Transaction.Subtype == "Payment"){
         var pmt = ((trans as TransactionDefaultView).Transaction as Payment);
         if(pmt.Status == "draft" || pmt.Status == "pendingapproval" || pmt.Status == "awaitingsubmission"){
           result = true;
         }
       }
     }
   
     return result;
   }
 
   /*  This function returns all claimcontacts with the given covered party type.
   *
   * Zach Thomas 12/3/09
   */
   function getContactsByCoveredPartyType(coveredPartyType : String):Contact[]{
     var coveredPartyList : List = new ArrayList();
   
     for(cont in this.Contacts){
       for(role in cont.Roles){
         if(role.CoveredPartyType == coveredPartyType){
           coveredPartyList.add( cont.Contact );         
         }
       }
     }
   
     return (coveredPartyList.toArray() as Contact[]);
   }
 
  /*12/8/10 erawe - Defect 3556 - This function returns the RoleStatusExt value 
   * for the latest role on a claimcontact
   */
  function getRoleStatus(inCont: Contact) : String {
   var returnValue : String;
   for(clmCont in this.Contacts){
     if(clmCont.Contact == inCont){
       for(clmContRole in clmCont.Roles){
         //if(clmContRole.Role == inRole){
         returnValue = clmContRole.RoleStatusExt.DisplayName
         //}
       }
     }
   }
   return returnValue
  }
  
  /*1/25/13 erawe, using this function to check for FidCrime QSC, XSC policy symbol or Excess (Lead)
   or Quota Share (Participant) on any other coverages for all other FidCrime symbols. 
   Turn off all Underlying tabs for Prod, Cert, UAT, Int2 util further notice.  Prod deployment May 2013
   2/22/13 erawe, update req. show OtherCoverage tab for ExcessLiab/ExcessAuto, FidCrime
   4/4/2013 EM50 llynch, modified function setUnderlyingVisible() to enable FidCrime as it is going live in May 2013
   4/15/2013 EM50 llynch, enabling other coverage for FidCrime May2013
   5/22/14 kniese - added a filter to not show Other Coverage on Bonds Policies. It is needed for CRP
   9/16/14 dnmiller - added a filter to SHOW Other Coverage tab for PIM BR when the policy is IMP or MAC 
                      and the policy is written in Canadian dollars
   2/17/17 kniese - Defect 8658 - Show other coverage for Specialty E&S Inland Marine
   */
      
   
  function setUnderlyingVisible() : Boolean {
    var env = gw.api.system.server.ServerUtil.getEnv();
    if(this.LossType == LossType.TC_SPECIALTYES and this.Policy.PolicyType == PolicyType.TC_IMP){
     return true 
    }
    if (this.Policy.PolicyType == PolicyType.TC_MAC || this.Policy.PolicyType == PolicyType.TC_IMP){
      if(this.Policy.CurrencyTypeExt == "cad"){
        return true
      }
      else {
        return false
      }
    }else{
    if(this.Policy.PolicyType.hasCategory(PolicyTab.TC_UNDERLYING) and this.Claim.LossType != typekey.LossType.TC_COMMBONDS){
        return true
    }
    else{
       return false
    }
  }
  }
  //Function to filter the Loss Cause based on Claim Type for PLD.
  function getCauses() : List<LossCause>{
 if(this.ClaimTypeExt!=null){
   return LossCause.getTypeKeys(false).where(\ l -> l.hasCategory(this.LossType) && l.hasCategory(this.ClaimTypeExt))
 }else{
   return LossCause.getTypeKeys(false).where(\ l -> l.hasCategory(this.LossType))
 }
}

/* 6/18/13 erawe - for defect 6263 moved this method from ExposureFunctions.gsx to accomodate for
   the new incidentclaimant field.  On ExposureFunctions.gsx just made a call to this method.
*/
function getFeatureContacts():List{
      var contacts:ClaimContact[] = this.Claim.Contacts;
      var returnedContacts:List = new ArrayList();

          for(contact in contacts){
              if(!exists(role in contact.Roles where role.Role== "Agency" or role.Role=="agent") and
                  !exists(role in contact.Roles where role.Role== "underwriter") and
                  !exists(role in contact.Roles where role.Role== "formerunderwriter" ) and
                  !exists(role in contact.Roles where contact.Contact typeis PersonVendor) and
                  !exists(role in contact.Roles where contact.Contact typeis CompanyVendor))
              {
                if(contact.Contact.Name != "Great American Insurance"){            
                  returnedContacts.add(contact.Contact);
                }
              }
          }

      return returnedContacts;
  }

/*
Defect 6713 - jjesudhasan - 5/15/14 - Function to check the latest update time of reserves and note topic "reserves".
If either the reserves or the "reserves" note topic or both the  reserves and note topic "reserves" exists on the claim.
*/  
  function getLatestDate():DateTime{
    var reserveUpdateTime:DateTime = this.CreateTime
    var noteUpdateTime:DateTime = this.CreateTime
    var latestUpdate:DateTime = this.CreateTime
    var reserveLine=this.ReserveLines
    var notes=this.Notes.where(\ n ->n.Topic=="reserves" )
  
  for (reserve in reserveLine){
     
    // if reservers are there but reserve note topic is not there
    if( reserve.UpdateTime > latestUpdate && notes.Isempty ) {
    latestUpdate = reserve.UpdateTime
    }}
   
  for (note  in notes){
    // if reserve note topic is there but reservers are not there 
    if (reserveLine.IsEmpty && note.UpdateTime > latestUpdate ){
     latestUpdate = note.UpdateTime 
    }}
    
     // if both reserves and reserve note topic are there
  for(r in reserveLine){
   if ( r.UpdateTime > reserveUpdateTime )
    reserveUpdateTime = r.UpdateTime
    }
    

  for ( n in notes){
    if (n.UpdateTime > noteUpdateTime) 
      noteUpdateTime = n.UpdateTime   
     }
  
  if (reserveUpdateTime > noteUpdateTime) { 
  latestUpdate = reserveUpdateTime }
  else { latestUpdate = noteUpdateTime}
  return latestUpdate
   }
  //Defect 6517 and 6667 - Main Contact assigned Former Main Contact when role changed to different party 
  function setFrmrMainContact() {
    if (this.State !="draft" and (this.OriginalVersion as Claim).maincontact != null
    and (this.OriginalVersion as Claim).maincontact != this.maincontact) {
      this.addRole(ContactRole.TC_FORMERMAINCONTACT, (this.OriginalVersion as Claim).maincontact)  
    }
  }
  //Defect 6517 and 6667 - Reporter assigned Former Primary Reporter when role changed to different party
  function setFrmrReporter() {
    if (this.State !="draft" and (this.OriginalVersion as Claim).reporter != null
    and (this.OriginalVersion as Claim).reporter != this.reporter) {
      this.addRole(ContactRole.TC_FORMERREPORTER, (this.OriginalVersion as Claim).reporter)  
    }
  } 
  
  /* Workers Comp: Function to set the Selected Coverage on the claim as well as update all Exposures based on this value. */
  function setSelectedCoverage(cov: Coverage){
    // OLD - this.SelectedCovNumExt = num
    this.CoverageSelectedExt = cov
    if (!this.Exposures.IsEmpty){
      for (exp in this.Exposures){
        // Set the previous coverage on the exposure
        exp.PreviousCoverageExt = exp.Coverage 
        // Set the coverage on the exposure to the newly selected coverage
        exp.Coverage = cov
        // Update the CoveragSubType for the exposure
        if(exp.ExposureType=="wc_vocational_rehab"){
          exp.CoverageSubType = cov.Type + "_vr" 
        }else if(exp.ExposureType=="wc_medical_details"){
          exp.CoverageSubType = cov.Type + "_md"
        }else if(exp.ExposureType=="wc_indemnity_timeloss"){
          exp.CoverageSubType = cov.Type + "_in"
        }else if(exp.ExposureType=="wc_employers_liability"){
          exp.CoverageSubType = cov.Type + "_em"
        }
      }
    }
  }

    /* Workers Comp: Return a string verison of a coverage including Coverage Type, Location #, Risk State,
     Class Code, Class Code Suffix, Class Code Description, and Governing Law */
     //  akubatur - Defect 7825 - removed duplicate class code-suffix string to the displayed string.
  public function formatWCCoverageString(cov: Coverage):String{
    if (cov == null || !this.Policy.Coverages.contains((cov as PolicyCoverage))){
      this.CoverageSelectedExt = null
      return ""
    }
    else {
      if (this.CoverageSelectedExt != null){
        var covString: String
        covString = cov.Type.toString() + ", " 
        if (cov.LocationNumExt != null){
        // check for Location #
          covString = covString + cov.LocationNumExt.toString() + ", " 
        }
        if (cov.State != null){
        // check for Risk State
          covString = covString + cov.State.toString() + ", " 
        }
        // create the class code-suffix string
        if (cov.ClassCodeExt != null){
          covString = covString + cov.ClassCodeExt
        }
        if (cov.ClassCodeSuffixExt != null){
          covString = covString + "-" + cov.ClassCodeSuffixExt
        }
        //covString = covString + getClassCodeWithSuffix(cov)
        if (cov.ClassCodeDescExt != null){
        //check for Class Code Description
          covString = covString + ", " + cov.ClassCodeDescExt
        }
        if(cov.GoverningLawExt != null){
        // check for Governing Law
          covString = covString + ", " + cov.GoverningLawExt.Description
        }
        return covString
      }else{
        return ""
      }
    }
  }
  
  /* Workers Comp: This function returns a String containing the Class Code with the Suffix added to the end.
   Separated out from the above getSelectedCoverage function because only the Class Code with the
   Suffix is needed to display as the Employment Code on the Loss Deatils page. */
  // 9.4.15 - cmullin - Defect 7737 - added Class Code Description to the displayed string.
  function getClassCodeWithSuffix(cov: Coverage): String{
    var string: String = ""
    if (cov.ClassCodeExt != null){
      string = cov.ClassCodeExt
    }
    if (cov.ClassCodeSuffixExt != null){
      string = string + "-" + cov.ClassCodeSuffixExt
    }
    if (cov.ClassCodeDescExt != null){
      string = string + " " + cov.ClassCodeDescExt
    }
    return string
  }
   
  /*
    For Workers' Comp: There are only three possible features for Workers' Comp Loss Types. If any of the three has
    not automatically or manually been created, then the New Feature Action Menu is available. If all three have already
    been created, then the claim has no features available to create and the New Feature Action Menu is not visible.
    [Called on ClaimMenuActions.]
  */
   
  function hasFeaturesAvailable() : Boolean{
    return this.OrderedExposures.length < 3
  }
  
  /**
   * Workers' Comp claims do not have a generic "Feature" screen and do not use ClaimExposures.pcf. So for 
   * Workers' Comp claims, on the pages that call ClaimExposures.go(Claim) for afterCancel and/or afterCommit, 
   * this function will send the user to ClaimSummary.pcf instead of ClaimExposures.pcf.
   * 
   * @param the claim
   * @returns A Gosu .go instruction for afterCommit and afterCancel calls for Workers' Comp claims
   */
   
  function goToExposureOrSummaryScreen(){
    if (util.WCHelper.isWCorELLossType(this)){
       pcf.ClaimSummary.go(this) 
    }else{ 
       pcf.ClaimExposures.go(this)
    }
  }
  
  //Defect 8002 - cmullin - 12.3.15 - added two functions below to properly format the 
  //CLEE dropdown and saved CLEE display on CLEEInputSet
  function formatCLEEDropdownValues(clee : CLEEExt) : String {    
    var result : String = "" 
    var stringRa : ArrayList<String> = new java.util.ArrayList<String>()
     
    if(clee!=null){
      if(clee.CodeExt!=null){
        stringRa.add(clee.CodeExt.toString())
      }
      if(clee.CLEELocationExt!=null){
        stringRa.add(clee.CLEELocationExt.toString())
      }
      if(clee.DescriptionOneExt!=null){
        stringRa.add(clee.DescriptionOneExt.toString())
      }
      if(clee.DescriptionTwoExt!=null){
        stringRa.add(clee.DescriptionTwoExt.toString())
      }
      if(clee.DescriptionThreeExt!=null){
        stringRa.add(clee.DescriptionThreeExt.toString())
      }
    }
    if(stringRa.length > 1){
      for(str in stringRa){
        result+=str + ", "
      }
      result = result.substring(0,result.length-2)
    }else if(stringRa.length==1){
      result = stringRa[0].toString()
    }
    if(clee.EndDateExt!=null && (clee.EndDateExt < gw.api.util.DateUtil.currentDate())){
      result = result + " (ret " + clee.EndDateExt.formatDate(SHORT) + ")"
    }
    return result
  }
  
  function formatSavedCLEEValue(clee : CLEEExt): String {
    var result : String = ""
    if(clee.EndDateExt!=null && (clee.EndDateExt < gw.api.util.DateUtil.currentDate())){
      result = clee.CodeExt + " (ret " + clee.EndDateExt.formatDate(SHORT) + ")"
    }else{
      result = clee.CodeExt
    }
    return result
  }
  
  // Defect 8102 - cmullin - 12.11.15 - display only the first 20 characters 
  // of Injury Type on Financials > Transactions screens (or display the full 
  // String if String length is less than 20 characters).  
  
  function formatInjuryType(str : String) : String{
    var retString = ""
    if(str!=null){
      retString = str.substring(0,java.lang.Math.min(str.length(), 20))
    }
    return retString
  }
  
  function getDoctorContacts() : Contact[] {
     var contList = new java.util.ArrayList() 
 
     for(con in this.getContactsByRole(ContactRole.TC_DOCTOR)){
       if(!contList.contains(con))
        contList.add(con)
     }
     for(con in this.getContactsByRole(ContactRole.TC_FORMERDOCTOR)){
       if(!contList.contains(con))
        contList.add(con)
     }
     for(con in this.getContactsByRole(ContactRole.TC_FRMRFIRSTINTAKEDOCTOR)){
       if(!contList.contains(con))
         contList.add(con) 
     }
     if(this.FirstIntakeDoctor != null){
       if(!contList.contains(this.FirstIntakeDoctor))
        contList.add(this.FirstIntakeDoctor) 
     }
 
     return contList as Contact[]
  }

  function getHospitalContacts() : Contact[] {
     var contList = new java.util.ArrayList() 
 
     for(con in this.getContactsByRole(ContactRole.TC_HOSPITAL)){
       if(!contList.contains(con))
         contList.add(con)
     }
     for(con in this.getContactsByRole(ContactRole.TC_FORMERHOSPITAL)){
        if(!contList.contains(con)) 
         contList.add(con)
     }
     for(con in this.getContactsByRole(ContactRole.TC_FRMRFIRSTINTAKEHOSP)){
      if(!contList.contains(con))
        contList.add(con) 
     }
     if(this.firstintakehospital != null){
      if(!contList.contains(this.firstintakehospital))
        contList.add(this.firstintakehospital) 
     }
 
     return contList as Contact[]
    }
  
  /**
   * Gets all of the PersonVendors and CompanyVendors on the Claim except for legacy vendors
   * and the agency.
   */
  function getVendorContacts() : Contact[] {
    return this.getContacts().where(\ c -> 
      (c.Contact typeis CompanyVendor or c.Contact typeis PersonVendor) and 
      not (c.Contact typeis LegacyVendorCompanyExt) and 
       c.Contact != this.Policy.ex_Agency
       )*.Contact
  }
  
  // Defect 7778 - Converted WC claims may have a default Injured Worker SSN value of "333-33-3333". 
  // If so, the claim's ISO Enabled flag will be set to "false" during the conversion process. 
  // During the conversion process, Claim Preupdate rule CPUWC2310 will trigger an activity which alerts
  // the adjuster to change the SSN to a valid value. When the user changes the SSN from the invalid 
  // default to a valid value, the function below will flip the ISOEnabled flag to "true".
  
  function setISOEnabled(contact : Contact){
    if(this.isConvertedExt() && (contact.OriginalVersion as Person).TaxID=="333333333" && contact.validateTaxID()==null && this.ISOEnabled==false){
      this.ISOEnabled=true
    }
  }
  
  function setMinorChildIndicator(){
    if(this.InjuredWorker.MinorWorkerExt != null){
      for(exp in this.Exposures){
        exp.MinorChildExt = this.InjuredWorker.MinorWorkerExt
      }
    }
  }
  
  public static function latestNoteIfExists(noteArr:Note[]):String{
    if(noteArr.HasElements){
      var note:String
      noteArr = noteArr.sortBy(\ n -> n.CreateTime)
      note = noteArr.last().Body
      return note   
    }
    return null 
  }
  
  public function getRelatedPersons(): Person[] {
    var contactList : List = new ArrayList()
    var contacts:ClaimContact[] = this.Claim.Contacts;
    
    for (cont in contacts){
      if (cont.Contact typeis Person &&
          !exists(role in cont.Roles where role.Role== "Agency" or role.Role=="agent") &&
          !exists(role in cont.Roles where role.Role== "underwriter") &&
          !exists(role in cont.Roles where role.Role== "formerunderwriter")){
        contactList.add( cont.Contact )
      }
    }
    return contactList as Person[] 
  }
  
  // Added for Aviation: preserve the pilot detail fields when the primary pilot is changed.
  public function resetPilotFields(newPilot: Person, oldPilot: Person){
    if (newPilot !=null){
      if (oldPilot != null){
        // transfer old pilot fields to new pilot
        newPilot.PilotTypeExt = oldPilot.PilotTypeExt
        newPilot.PilotsTotalHoursExt = oldPilot.PilotsTotalHoursExt
        newPilot.PilotsHoursInMakeExt = oldPilot.PilotsHoursInMakeExt
        newPilot.Pilot65Ext = oldPilot.Pilot65Ext
        newPilot.PilotTransitionExt = oldPilot.PilotTransitionExt
      }
    }
    if (oldPilot != null){
      //remove values from old pilot when the newPilot is <none selected> or after the newPilot fields have been updated
      oldPilot.PilotTypeExt = null
      oldPilot.PilotsTotalHoursExt = null
      oldPilot.PilotsHoursInMakeExt = null
      oldPilot.Pilot65Ext = null
      oldPilot.PilotTransitionExt = null
    }
  }

} // end ClaimFunctions
