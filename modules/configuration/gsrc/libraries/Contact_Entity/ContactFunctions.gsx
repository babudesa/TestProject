package libraries.Contact_Entity
uses java.util.ArrayList
uses gw.api.util.DisplayableException

enhancement ContactFunctions : entity.Contact {
  /*
  *  Checks if contact is of type PersonVendor or CompanyVendor. 
  *  Sprint/Maintenance Release: EM 13 - Defect 930
  *  Author: Zach Thomas
  *  Date: 02/05/2009
  */
  function isVendorContact():Boolean{
    if((this typeis PersonVendor) or (this typeis CompanyVendor)){
      return true
    }else if((this typeis NonVendorPayeeCompanyExt or this typeis NonVendorPayeePersonExt) and (User.util.getCurrentUser().hasUserRole("Non-Vendor Payee Admin"))){
      return true
    }
    return false;
  }

  /*
  * Creates the corresponding former role for a given role
  * removes the original role during the process
  * @author Ryan Pampush
  */
  public function createFormerRole( c: Claim, CCRole : ClaimContactRole ){
    try{    
      var roleToAdd = ""
      var role:ContactRole = CCRole.Role;
      var code = role.Code.toLowerCase()
      switch ( code ){
        case "agency": 
          roleToAdd = "formeragency";
          break;
        case "coveredparty":
          roleToAdd = "formercoveredparty";
          break;
        case "doingbusinessas":
          roleToAdd = "formerdoingbusinessas";
          break;
        case "excludedparty":
          roleToAdd = "formerexcludedparty";
          break;
        case "insured":
          roleToAdd = "formerinsured";
          break;
        case "policyholder":
          roleToAdd = "formerpolicyholder";
          break;
        case "underwriter":
          roleToAdd = "formerunderwriter";
          break;
        case "lienholder":
          roleToAdd = "formerlienholder";
          break;
        case "additionalinterestrisk":
          roleToAdd = "formeraddintrisk";
          break;
        case "primarytrainer":
          roleToAdd = "formerprimarytrainer";
          break;
        case "alternatetrainer":
          roleToAdd = "formeralternatetrainer";
          break;
        case "claimant":
          roleToAdd = "formerclaimant";
          break;
        case "other":
          roleToAdd = "formerother";
          break;
        case "recoverypayer":
          roleToAdd = "formerrecoverypayer";
          break;
        case "vendor":
          roleToAdd = "formervendor";
          break;
        case "activityowner":
          roleToAdd = "formeractivityowner";
          break;  
        case "coveredparty":
          roleToAdd = "formercoveredparty";
          break;
        case "excludedparty":
          roleToAdd = "formerexcludedparty";
          break;
        case "filedby":
          roleToAdd = "formerfiledby";
          break;  
        case "venue":
          roleToAdd = "formervenue";
          break;
        case "passenger":
          roleToAdd = "formerpassenger";
          break;
        case "witness":
          roleToAdd = "formerwitness";
          break;    
        case "mattermanager":
          roleToAdd = "formermattermanager";
          break;  
        case "codefendant":
          roleToAdd = "formercodefendant";
          break;
        case "defendant":
          roleToAdd = "formerdefendant";
          break;  
        case "judge":
          roleToAdd = "formerjudge";
          break;       
        case "leadparalegal":
          roleToAdd = "formerleadparalegal";
          break;  
        case "plaintiff":
          roleToAdd = "formerplaintiff";
          break;  
        case "injured":
          roleToAdd = "formerinjured";
          break;  
        case "supervisor":
          roleToAdd = "formersupervisor";
          break;  
        case "claimantdep":
          roleToAdd = "formerclaimantdep";
          break;  
        case "altcontact":
          roleToAdd = "formeraltcontact";
          break;
        case "doctor":
          roleToAdd = "formerdoctor";
          break;   
        case "occtherapist":
          roleToAdd = "formerocctherapist";
          break;  
        case "phystherapist":
          roleToAdd = "formerphystherapist";
          break;  
        case "driver":
          roleToAdd = "formerdriver";
          break;   
        case "employer":
          roleToAdd = "formeremployer";
          break;   
        case "hospital":
          roleToAdd = "formerhospital";
          break;  
        case "maincontact":
          roleToAdd = "formermaincontact";
          break;  
        case "nursecasemgr":
          roleToAdd = "formernursecasemgr";
          break;  
        case "reporter":
          roleToAdd = "formerreporter";
          break;  
        case "repairshop":
          roleToAdd = "formerrepairshop";
          break;  
        case "towingagcy":
          roleToAdd = "formertowingagcy";
          break;  
        case "insuredrep":
          roleToAdd = "formerinsuredrep";
          break;
        case "lawenfcagcy":
          roleToAdd = "formerlawenfcagcy";
          break;  
        case "salvageservice":
          roleToAdd = "formersalvageservice";
          break;
        case "accountant":
          roleToAdd = "formeraccountant";
          break;
        case "agronomist":
          roleToAdd = "formeragronomist";
          break;
        case "catnursecasemanage":
          roleToAdd = "formercatnursemanage";
          break; 
        case "catnursecasemanager":
          roleToAdd = "frmrcatnursecasemger";
          break;   
        case "causeoflossspecinvst":
          roleToAdd = "frmrcauseolspecinvst";
          break;        
        case "consultingcounsel":
          roleToAdd = "frmrconsultingcounsel";
          break;  
        case "costcontrolvendor":
          roleToAdd = "frmrcostcontrolvendor";
          break;        
        case "coveragecounsel":
          roleToAdd = "formercoveragecounsel";
          break;                 
        case "defensecounsel":
          roleToAdd = "formerdefensecounsel";
          break;   
        case "defensecounselcumis":
          roleToAdd = "frmrdefcounselcumis";
          break;   
        case "defensecounselmonitor":
          roleToAdd = "frmrdefcounselmonitor";
          break;                     
        case "engineerbiomechanical":
          roleToAdd = "formerengineerbiomech";
          break;   
        case "engineerhumanfactor":
          roleToAdd = "frmrengrhumanfactor";
          break;               
        case "engineerstructsoil":
          roleToAdd = "frmrengrstructsoil";
          break;   
        case "independentadjuster":
          roleToAdd = "formerindadjuster";
          break;   
        case "insuredpersoncounsel":
          roleToAdd = "frmrinsdpersoncounsel";
          break;   
        case "investigator":
          roleToAdd = "formerinvestigator";
          break;  
        case "legalcasemanagement":
          roleToAdd = "formerlegalcasemgmt";
          break;  
        case "mediator":
          roleToAdd = "formermediator";
          break;               
        case "nursecasemanagement":
          roleToAdd = "formernursecasemgmt";
          break;  
        case "plaintiffcounsel":
          roleToAdd = "formerplaintiffcounsel";
          break;         
        case "recoverycounsel":
          roleToAdd = "formerrecoverycounsel";
          break;   
        case "subrogationvendor":
          roleToAdd = "formersubvendor";
          break;    
        case "vocrehabspecialist":
          roleToAdd = "formervocrehabspec";
          break;   
        case "recoverycounsel":
          roleToAdd = "formerrecoverycounsel";
          break;
        case "lawenfcagcy":
          roleToAdd = "formerlawenfcagcy"
          break;
        case "vehownclaimopen":
          roleToAdd = "frmrVehOwnClaimOpen"
          break;
        case "vehownclaimclose":
          roleToAdd = "frmrVehOwnClaimClose"
          break;
        case "guardianadlitem":
          roleToAdd = "frmrguardianadlitem"
          break;
        case "checkpayee":
          roleToAdd = "formercheckpayee"
          break;
        case "salvagebuyer":
          roleToAdd = "formersalvagebuyer"
          break;
        // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes  
        case "expertplaintiff":
          roleToAdd = "formerexpertplaintiff"
          break;
        case "opposingcounsel":
          roleToAdd = "formeropposingcounsel"
        break;
        case "potentiallitigation":
          roleToAdd = "frmrpotentiallitigation"
        break;
        case "proseplaintiff":
          roleToAdd = "frmrproseplaintiff"
        break;
        case "expertdefense":
          roleToAdd = "frmrexpertdefense"
        break;
        case "incidentclaimant":
          roleToAdd = "frmincidentclaimant"
        break;
       // 5/3/2013 - kniese - added for medicare
       case "powerofattorneyrole" :
         roleToAdd = "formerpowerofattorney"
       break;
       case "guardian" :
         roleToAdd = "formerguardian"
       break;
       case "beneficiary" :
         roleToAdd = "formerbeneficiary"
         break;
       case "monitoringcounsel":
        roleToAdd = "frmmonitoringcounsel"
          break;
       // 3/7/2014 - kniese - Adding new roles for Bonds
       case "claimindemnitor":
         roleToAdd = "frmrclaimindemnitor"
         break;
       //5/8/2013 - kepage -Added as part of new E&S development
       case ContactRole.TC_ARBITRATOR.Code :
         roleToAdd = ContactRole.TC_FORMERARBITRATOR.Code
         break
       case ContactRole.TC_CERTIFICATEHOLDER.Code :
         roleToAdd = ContactRole.TC_FMRCERTIFICATEHOLDER.Code
         break 
       case ContactRole.TC_CLAIMADDITIONALINSURED.Code :
         roleToAdd = ContactRole.TC_FMRCLMADDINSURED.Code
         break
       case ContactRole.TC_CLAIMNAMEDINSURED.Code :
         roleToAdd = ContactRole.TC_FRMCLMNAMEDINSURED.Code
         break
       case ContactRole.TC_CLAIMADDNAMEDINSURED.Code :
         roleToAdd = ContactRole.TC_FRMCLMADDNAMEDINSURED.Code
         break  
       case "retailbroker":
        roleToAdd = "frmretailbroker"
        break;
       case "buildingconsultant":
        roleToAdd = "frmbuildingconsultant"
        break;  
       // 6/2/15 - kniese - Ocean Marine Avalon
       case ContactRole.TC_COPRINCIPAL.Code : 
        roleToAdd = ContactRole.TC_FRMRCOPRINCIPAL.Code
        break;       
       // 3.26.15 - cmullin - Workers' Comp codes
       case "thdptytortfeasor":
        roleToAdd = "fmrthdptytortfeasor"
        break;
       case "tptortfeasorcarr":
        roleToAdd = "fmrtptortfeasorcarr"
        break;        
       case "insurertpa":
        roleToAdd = "fmrinsurertpa"
        break;
       case "injworkersuper":
        roleToAdd = "fmrinjworkersuper"
        break;        
       case "chiropractor":
        roleToAdd = "fmrchiropractor"
        break;
       case "medcasemanager":
        roleToAdd = "frmrmedcasemanager"
        break;        
       case "medcasemgmt":
        roleToAdd = "frmrmedcasemgmt"
        break;
       case "mednonphysician":
        roleToAdd = "frmrmednonphysician"
        break;        
       case "physocctherapist":
        roleToAdd = "frmrphysocctherapist"
        break;
       // 8/12/16 dnmiller - Aviation
       case ContactRole.TC_CLAIMLOSSPAYEE.Code:
        roleToAdd = ContactRole.TC_FRMRCLAIMLOSSPAYEE.Code
        break;        
       case ContactRole.TC_PILOT.Code:
        roleToAdd = ContactRole.TC_FRMRPILOT.Code
        break;
       case ContactRole.TC_LEADCARRIER.Code:
        roleToAdd = ContactRole.TC_FRMRLEADCARRIER.Code
        break;
       case ContactRole.TC_PRIMARYPILOT.Code:
        roleToAdd = ContactRole.TC_FRMRPRIMARYPILOT.Code
        break;
      }
    if( roleToAdd != "" ){
      if(CCRole.Exposure != null){
        CCRole.Exposure.addRole( roleToAdd, this )
      }
      // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes
       else if(CCRole.Matter != null){
        CCRole.Matter.addRole(roleToAdd, this)
      }
      else{
        c.addRole( roleToAdd, this )
      }
    }
    else{
      gw.api.util.Logger.logError( "Former role not found for: " + role )
      if(java.lang.System.getProperty("gw.cc.env") != "prod"){
        util.Email.sendMail( "ClaimCenterTesting@gaig.com", "Former role not found in development: ("+java.lang.System.getProperty("gw.cc.env")+")", "Former role not found for: " + role + " for the following contact: " + this + " on claim: " + c.ClaimNumber )
      }
      else{
        util.Email.sendMail( "ClaimCenterSupport@gaig.com", "Former role not found in production", "Former role not found for: " + role + " for the following contact: " + this + " on claim: " + c.ClaimNumber)
      }
    }
    }
    catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( c, "Class Extensions - Contact - ContactFunctions", e, "Error in method createFormerRole" )  
    }
    //c.removeRole( Role, this )  
  }

  // 8/3/2009 - zjthomas - Defect 2247, Added function to mask non foreign vendor phone input fields.
  function getPhoneMask() : String{
    var mask:String = null;
  
    if(this.Subtype == "Ex_ForeignCoVendor" or this.Subtype == "Ex_ForeignPersonVndr" or 
      this.Subtype == "Ex_ForeignCoVenMedOrg" or this.Subtype == "Ex_ForeignCoVenLawFrm" or 
      this.Subtype == "Ex_ForeignPerVndrAttny" or this.Subtype == "Ex_ForeignPerVndrDoc" or this.Subtype=="FrgnAutoRepairShopExt"){
      mask = "+###-#################### x##########";
    }else{
      mask = "###-###-#### x####";
    }
    return mask;
  }

  function getFaxPhoneMask() : String{
    var mask:String = null;
  
    if(this.Subtype == "Ex_ForeignCoVendor" or this.Subtype == "Ex_ForeignPersonVndr" or 
      this.Subtype == "Ex_ForeignCoVenMedOrg" or this.Subtype == "Ex_ForeignCoVenLawFrm" or 
      this.Subtype == "Ex_ForeignPerVndrAttny" or this.Subtype == "Ex_ForeignPerVndrDoc" or this.Subtype=="FrgnAutoRepairShopExt"){
      mask = "+###-####################";
    }else{
      mask = "###-###-####";
    }
    return mask;
  }

  //sprzygocki 2/22/10 - Will grab the phone number that exists on the Contact in case you have a reflect that needs to see
  //the contact&apos;s phone number, but you could enter any one of the three. 
  function getPhoneNumber() : String {
    var phoneNumber = "";
  
    if(this.TollFreeNumberExt!=null){
      phoneNumber = this.TollFreeNumberExt;
    } else if(this.WorkPhone!=null){
      phoneNumber = this.WorkPhone;
    } else if(this.FaxPhone!=null){
      phoneNumber = this.FaxPhone;
    }
  
    return phoneNumber;
  }
  // 8/3/2009 - zjthomas - Defect 2247, Added function to validate non foreign vendor phone input fields.
  function isPhoneValid(phone : String) : Boolean{
    var result : Boolean = true;
  
    if(phone !=null and this.Subtype != "Ex_ForeignCoVendor" and this.Subtype != "Ex_ForeignPersonVndr" and 
      this.Subtype != "Ex_ForeignCoVenMedOrg" and this.Subtype != "Ex_ForeignCoVenLawFrm" and 
      this.Subtype != "Ex_ForeignPerVndrAttny" and this.Subtype != "Ex_ForeignPerVndrDoc" and
      this.Subtype != "FrgnAutoRepairShopExt"){
      if(phone.contains(".")){
      result = false;
      }
      phone = phone.replaceAll( "[.]", "" );
      if(!phone.matches( "[0-9]{3}-[0-9]{3}-[0-9]{4}( x[0-9]{1,4})?" )){  
        result = false;
      }
    }
      
    return result;
  }
  
  
    // 8/28/2009 - dcarson2 - Defect 6830, Added function to validate foreign vendor phone input fields.
    function isIntlPhoneValid(phone : String) : Boolean{
      var result : Boolean = true;
      if(phone !=null and( this.Subtype == "Ex_ForeignCoVendor" or this.Subtype == "Ex_ForeignPersonVndr" or 
      this.Subtype == "Ex_ForeignCoVenMedOrg" or this.Subtype == "Ex_ForeignCoVenLawFrm" or 
      this.Subtype == "Ex_ForeignPerVndrAttny" or this.Subtype == "Ex_ForeignPerVndrDoc" or
      this.Subtype == "FrgnAutoRepairShopExt")){
      phone = phone.replaceAll( "[.]", "" );
      
      if(!phone.matches( "^\\+[0-9]{1,3}-[0-9]{1,20}( x[0-9]{1,10})?" )){

       result = false;
      }
    }
    return result;
  }

  // 9/25/2014 - kotteson - Defect 6831, Added function to determine if phone number is valid - foreign or domestic.
  function isPhoneValidEDW(phone : String) : Boolean{
     return(isPhoneValid(phone) and isIntlPhoneValid(phone)) 
  }


  // 1/4/2011 - zjthomas - Defect 3602, Function will remove all the elements in the UserModifiedFieldsExt array.
  // 1/24/2011 - zjthomas - Updated: prevent CMS fields from being removed from array
  function resetUserModifiedFields(){
    for(item in this.UserModifiedFieldsExt){
      if(!item.isCMSUserModifiedField()){
        this.removeFromUserModifiedFieldsExt( item );
      }
    }
  
  }

  // 1/24/2011 - zjthomas - Defect 3602, Checks for user updated CMS fields on a contact.
  function hasNonCMSUserModifiedFields():Boolean{
    if(this.UserModifiedFieldsExt.length > 0 and 
       exists(item in this.UserModifiedFieldsExt where !item.isCMSUserModifiedField())){
      return true;
    }else{
      return false;
    }
  }
  
  function isNewYorkRepairShop() : Boolean{
    if(this.PrimaryAddress.State != null and this.PrimaryAddress.State.Code == "NY"){
      return true
    }else{
      return false
    }
  }
  
  function isValidDMVFacNumber() : Boolean {
    if(isNewYorkRepairShop()){ 
      if(this typeis AutoRepairShop and this.DMVFacilityNumberExt != null and
          this.DMVFacilityNumberExt.matches("[0-9]{7}")){
        return true
      }else{
        return false
      }
    }else{
      return true
    }
  }
  
  function isValidSalesTaxNumber() : Boolean {
    if(isNewYorkRepairShop()){
      if(this typeis AutoRepairShop and this.SalesTaxNumberExt != null and
          this.SalesTaxNumberExt.matches("[A-Za-z0-9]{9,11}")){
        return true
      }else{
        return false
      }
    }else{
      return true
    }
  }
  
  function updateCloseIndicator() {
    if(this.CloseDateExt == null){
      this.CloseIndicatorExt = "0000-00-00 00:00:00:000"
        
        if(this typeis CompanyVendor  || this typeis PersonVendor )
          {
          this.VendorCloseReasonExt =""
          } 
    }
    else{
      // Add the calander year
     this.CloseIndicatorExt = this.CloseDateExt.format("yyyy-MM-dd HH:mm:ss:SSS")
      
    }
    
  }
  
  // 9/2/2015 - kniese - Added for defect 7619 for partial SSN and to clean up SSN validation code
  function isSameNumberTaxID() : Boolean {
    if(this.TaxID.matches("[0]{9}") or this.TaxID.matches("[1]{9}") or this.TaxID.matches("[2]{9}") or this.TaxID.matches("[3]{9}")
           or this.TaxID.matches("[4]{9}") or this.TaxID.matches("[5]{9}") or this.TaxID.matches("[6]{9}") or this.TaxID.matches("[7]{9}") or this.TaxID.matches("[8]{9}")
            or this.TaxID.matches("[9]{9}")){
             return true 
   }
   return false 
  }
  
  // Defect 7778 - cmullin - This function allows an otherwise invalid SSN value of 333-33-333 for converted claims only. 
  // Once the conversion default SSN is changed to a valid value, 333-33-3333 is no longer allowed.
  function isConvertedDefaultSSN(claim : Claim) : Boolean{
    return (claim.isConvertedExt() && (this.OriginalVersion as Person).TaxID=="333333333" && this.TaxID=="333333333")
  }

   function validateTaxID():String{
    var str : String  = null
    
    if(this.TaxID == null){ 
      if(this.checkContactTaxStatus())
        str = displaykey.Web.ContactDetail.Name.TaxID.EIN.Required    
    }else{
      if(!this.TaxID.matches("[0-9]{9}") or this.isSameNumberTaxID()){
          str = displaykey.Web.ContactDetail.Name.TaxID.EIN.Invalid 
      } else if(this typeis Person && this.TaxID.toString().startsWith("9") && (this.BelowThresholdExt==true||this.RefuseProvideExt==true)){
          str=displaykey.Web.ContactDetail.Name.TaxID.MedEligible
      } else if(this typeis Person && this.TaxID.toString().startsWith("9") && this.HICNExt!=null){
          str=displaykey.Web.ContactDetail.Name.TaxID.MedEligible
      } else{
        str = null
      }
    }
    return str
  }
  
  function isValidZeroSSN() : Boolean{
    if(this.TaxID.matches("[0]{1}[1-9]{1}[0-9]{7}") or this.TaxID.matches("[0]{2}[1-9]{1}[0-9]{6}")){
      return true
    }
    return false
  }
      
  function isValidPartialSSN() : Boolean{
    if(this.TaxID.startsWith("0")){
      if(this.TaxID.matches("[0]{3}[1-9]{1}[0-9]{5}") or this.TaxID.matches("[0-9]{5}[0]{4}")){
        return false
      }else{
        return true
      }
    }
    return false
  }
  
  function validatePersonTaxID() : String {
    var str : String = null
    if(this.TaxID != null){
      if(this.TaxID.toString().startsWith("0") && !this.isValidZeroSSN() and !this.isValidPartialSSN() && this.Ex_TaxStatusCode == TaxStatusCode.TC_3){
            str = displaykey.Web.ContactDetail.Name.TaxID.EIN.InvalidPartial
      }
    }
    return str
  }
  
  function validateTaxStatus() : String {
   var str : String = null
   if(this.TaxID != null){
     if(this.TaxID.toString().startsWith("0") && !this.isValidZeroSSN()
         && this.Ex_TaxStatusCode != TaxStatusCode.TC_3 && !this.isSameNumberTaxID()){
           str = displaykey.Web.ContactDetail.Name.TaxID.EIN.PersonPartial
     }
   }
   return str 
  }
  
  // Defect 9109- validation to change error message to business friendly manner
   function validateContactTaxID(){
    
    if(this.TaxID == null || this.Ex_TaxStatusCode == null){
      throw new DisplayableException(displaykey.Validation.Contact.TaxIDorTaxStatus)
      
      }
   
   }
   
   function validateMailingAddressCount(){
     if(this.AllAddresses.where(\ a -> a.AddressType == AddressType.TC_MAILING ).length > 20){
       throw new DisplayableException("The number of mailing addresses exceeds 20. Additional mailing addresses may be added to the contact on the Related Contacts tab in Address Book.")
     }
   }

  
  function hasClaimantRole(claim : Claim) : Boolean {
    var isWCClaim : Boolean = util.WCHelper.isWCorELLossType(claim)
    var result : Boolean = false
    if(isWCClaim){
      if(claim.claimant != null and claim.claimant == this){
        result = true
      }
    }else{
      for(exp in claim.Exposures){
        if(exp.Claimant == this){
          result = true 
        }
      }
    }
    return result
  }
  
  // Defect 7778 - moved long, page-level validationExpression to this function, which is called on WC Injured Worker 
  // SSN fields. The added block - isConvertedDefaultSSN - will cause the SSN validation to skip the SSN
  // in the case where a converted WC claim has the default Injured Worker SSN value of "333-33-3333". 
  function isValidInjuredWorkerSSN(claim : Claim) : String{
    var result : String = null
    if(this.isConvertedDefaultSSN(claim)){
      result = null
    }else{
      if(this.hasClaimantRole(claim) && this.validateTaxID()==null){
        if(this.validatePersonTaxID()==null){
          if(this.validateTaxStatus()==null){
            result = null
          }else{
            result = this.validateTaxStatus()
          }
        }else{
          result = this.validatePersonTaxID()
        }
      }else{
        result = this.validateTaxID()
      }
    }
    return result
  }
  
  
  public static function getFormerRole(role : ContactRole) : ContactRole{
    if (role == null){
      return null
    }
    switch(role){
      case ContactRole.TC_AGENCY:
        return ContactRole.TC_FORMERAGENCY;
      case ContactRole.TC_COVEREDPARTY:
        return ContactRole.TC_FORMERCOVEREDPARTY;
      case ContactRole.TC_DOINGBUSINESSAS:
        return ContactRole.TC_FORMERDOINGBUSINESSAS;
      case ContactRole.TC_EXCLUDEDPARTY:
        return ContactRole.TC_FORMEREXCLUDEDPARTY;
      case ContactRole.TC_INSURED:
        return ContactRole.TC_FORMERINSURED;
      case ContactRole.TC_POLICYHOLDER:
        return ContactRole.TC_FORMERPOLICYHOLDER;
      case ContactRole.TC_UNDERWRITER:
        return ContactRole.TC_FORMERUNDERWRITER;
      case ContactRole.TC_LIENHOLDER:
        return ContactRole.TC_FORMERLIENHOLDER;
      case ContactRole.TC_ADDITIONALINTERESTRISK:
        return ContactRole.TC_FORMERADDINTRISK;
      case ContactRole.TC_PRIMARYTRAINER:
        return ContactRole.TC_FORMERPRIMARYTRAINER;
      case ContactRole.TC_ALTERNATETRAINER:
        return ContactRole.TC_FORMERALTERNATETRAINER;
      case ContactRole.TC_CLAIMANT:
        return ContactRole.TC_FORMERCLAIMANT;
      case ContactRole.TC_OTHER:
        return ContactRole.TC_FORMEROTHER;
      case ContactRole.TC_RECOVERYPAYER:
        return ContactRole.TC_FORMERRECOVERYPAYER;
      case ContactRole.TC_VENDOR:
        return ContactRole.TC_FORMERVENDOR;
      case ContactRole.TC_ACTIVITYOWNER:
        return ContactRole.TC_FORMERACTIVITYOWNER;
      case ContactRole.TC_COVEREDPARTY:
        return ContactRole.TC_FORMERCOVEREDPARTY;
      case ContactRole.TC_EXCLUDEDPARTY:
        return ContactRole.TC_FORMEREXCLUDEDPARTY;
      case ContactRole.TC_FILEDBY:
        return ContactRole.TC_FORMERFILEDBY;
      case ContactRole.TC_VENUE:
        return ContactRole.TC_FORMERVENUE;
      case ContactRole.TC_PASSENGER:
        return ContactRole.TC_FORMERPASSENGER;
      case ContactRole.TC_WITNESS:
        return ContactRole.TC_FORMERWITNESS;
      case ContactRole.TC_MATTERMANAGER:
        return ContactRole.TC_FORMERMATTERMANAGER;
      case ContactRole.TC_CODEFENDANT:
        return ContactRole.TC_FORMERCODEFENDANT
      case ContactRole.TC_DEFENDANT:
        return ContactRole.TC_FORMERDEFENDANT
      case ContactRole.TC_JUDGE:
        return ContactRole.TC_FORMERJUDGE
      case ContactRole.TC_LEADPARALEGAL:
        return ContactRole.TC_FORMERLEADPARALEGAL
      case ContactRole.TC_PLAINTIFF:
        return ContactRole.TC_FORMERPLAINTIFF
      case ContactRole.TC_INJURED:
        return ContactRole.TC_FORMERINJURED
      case ContactRole.TC_SUPERVISOR:
        return ContactRole.TC_FORMERSUPERVISOR
  //Defect 8591 sdhakal - Instead of injworkersuper adding formerinjuredworkersupersior for workerscomp claim
       case ContactRole.TC_INJWORKERSUPER:
        return ContactRole.TC_FMRINJWORKERSUPER 
      case ContactRole.TC_CLAIMANTDEP:
        return ContactRole.TC_FORMERCLAIMANTDEP
      case ContactRole.TC_ALTCONTACT:
        return ContactRole.TC_FORMERALTCONTACT
      case ContactRole.TC_DOCTOR:
        return ContactRole.TC_FORMERDOCTOR
      case ContactRole.TC_OCCTHERAPIST:
        return ContactRole.TC_FORMEROCCTHERAPIST
      case ContactRole.TC_PHYSTHERAPIST:
        return ContactRole.TC_FORMERPHYSTHERAPIST
      case ContactRole.TC_DRIVER:
        return ContactRole.TC_FORMERDRIVER
      case ContactRole.TC_EMPLOYER:
        return ContactRole.TC_FORMEREMPLOYER
      case ContactRole.TC_HOSPITAL:
        return ContactRole.TC_FORMERHOSPITAL
      case ContactRole.TC_MAINCONTACT:
        return ContactRole.TC_FORMERMAINCONTACT
      case ContactRole.TC_NURSECASEMGR:
        return ContactRole.TC_FORMERNURSECASEMGR
      case ContactRole.TC_REPORTER:
        return ContactRole.TC_FORMERREPORTER
      case ContactRole.TC_REPAIRSHOP:
        return ContactRole.TC_FORMERREPAIRSHOP
      case ContactRole.TC_TOWINGAGCY:
        return ContactRole.TC_FORMERTOWINGAGCY
      case ContactRole.TC_INSUREDREP:
        return ContactRole.TC_FORMERINSUREDREP
      case ContactRole.TC_LAWENFCAGCY:
        return ContactRole.TC_FORMERLAWENFCAGCY
      case ContactRole.TC_SALVAGESERVICE:
        return ContactRole.TC_FORMERSALVAGESERVICE
      case ContactRole.TC_ACCOUNTANT:
        return ContactRole.TC_FORMERACCOUNTANT
      case ContactRole.TC_AGRONOMIST:
        return ContactRole.TC_FORMERAGRONOMIST
      case ContactRole.TC_CATNURSECASEMANAGE:
        return ContactRole.TC_FORMERCATNURSEMANAGE
      case ContactRole.TC_CATNURSECASEMANAGER:
        return ContactRole.TC_FRMRCATNURSECASEMGER
      case ContactRole.TC_CAUSEOFLOSSSPECINVST:
        return ContactRole.TC_FRMRCAUSEOLSPECINVST
      case ContactRole.TC_CONSULTINGCOUNSEL:
        return ContactRole.TC_FRMRCONSULTINGCOUNSEL
      case ContactRole.TC_COSTCONTROLVENDOR:
        return ContactRole.TC_FRMRCOSTCONTROLVENDOR
      case ContactRole.TC_COVERAGECOUNSEL:
        return ContactRole.TC_FORMERCOVERAGECOUNSEL
      case ContactRole.TC_DEFENSECOUNSEL:
        return ContactRole.TC_FORMERDEFENSECOUNSEL
      case ContactRole.TC_DEFENSECOUNSELCUMIS:
        return ContactRole.TC_FRMRDEFCOUNSELCUMIS
      case ContactRole.TC_DEFENSECOUNSELMONITOR:
        return ContactRole.TC_FRMRDEFCOUNSELMONITOR
      case ContactRole.TC_ENGINEERBIOMECHANICAL:
        return ContactRole.TC_FORMERENGINEERBIOMECH
      case ContactRole.TC_ENGINEERHUMANFACTOR:
        return ContactRole.TC_FRMRENGRHUMANFACTOR
      case ContactRole.TC_ENGINEERSTRUCTSOIL:
        return ContactRole.TC_FRMRENGRSTRUCTSOIL
      case ContactRole.TC_INDEPENDENTADJUSTER:
        return ContactRole.TC_FORMERINDADJUSTER
      case ContactRole.TC_INSUREDPERSONCOUNSEL:
        return ContactRole.TC_FRMRINSDPERSONCOUNSEL
      case ContactRole.TC_INVESTIGATOR:
        return ContactRole.TC_FORMERINVESTIGATOR
      case ContactRole.TC_LEGALCASEMANAGEMENT:
        return ContactRole.TC_FORMERLEGALCASEMGMT
      case ContactRole.TC_MEDIATOR:
        return ContactRole.TC_FORMERMEDIATOR
      case ContactRole.TC_NURSECASEMANAGEMENT:
        return ContactRole.TC_FORMERNURSECASEMGMT
      case ContactRole.TC_PLAINTIFFCOUNSEL:
        return ContactRole.TC_FORMERPLAINTIFFCOUNSEL
      case ContactRole.TC_RECOVERYCOUNSEL:
        return ContactRole.TC_FORMERRECOVERYCOUNSEL
      case ContactRole.TC_SUBROGATIONVENDOR:
        return ContactRole.TC_FORMERSUBVENDOR
      case ContactRole.TC_VOCREHABSPECIALIST:
        return ContactRole.TC_FORMERVOCREHABSPEC
      case ContactRole.TC_RECOVERYCOUNSEL:
        return ContactRole.TC_FORMERRECOVERYCOUNSEL
      case ContactRole.TC_LAWENFCAGCY:
        return ContactRole.TC_FORMERLAWENFCAGCY
      case ContactRole.TC_VEHOWNCLAIMOPEN:
        return ContactRole.TC_FRMRVEHOWNCLAIMOPEN
      case ContactRole.TC_VEHOWNCLAIMCLOSE:
        return ContactRole.TC_FRMRVEHOWNCLAIMCLOSE
      case ContactRole.TC_GUARDIANADLITEM:
        return ContactRole.TC_FRMRGUARDIANADLITEM
      case ContactRole.TC_CHECKPAYEE:
        return ContactRole.TC_FORMERCHECKPAYEE
      case ContactRole.TC_SALVAGEBUYER:
        return ContactRole.TC_FORMERSALVAGEBUYER
      // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes  
      case ContactRole.TC_EXPERTPLAINTIFF:
        return ContactRole.TC_FORMEREXPERTPLAINTIFF
      case ContactRole.TC_OPPOSINGCOUNSEL:
        return ContactRole.TC_FORMEROPPOSINGCOUNSEL
      case ContactRole.TC_POTENTIALLITIGATION:
        return ContactRole.TC_FRMRPOTENTIALLITIGATION
      case ContactRole.TC_PROSEPLAINTIFF:
        return ContactRole.TC_FRMRPROSEPLAINTIFF
      case ContactRole.TC_EXPERTDEFENSE:
        return ContactRole.TC_FRMREXPERTDEFENSE
      case ContactRole.TC_INCIDENTCLAIMANT:
        return ContactRole.TC_FRMINCIDENTCLAIMANT
       // 5/3/2013 - kniese - added for medicare
      case ContactRole.TC_POWEROFATTORNEYROLE :
         return ContactRole.TC_FORMERPOWEROFATTORNEY
      case ContactRole.TC_GUARDIAN :
        return ContactRole.TC_FORMERGUARDIAN
      case ContactRole.TC_BENEFICIARY :
        return ContactRole.TC_FORMERBENEFICIARY
      case ContactRole.TC_MONITORINGCOUNSEL:
        return ContactRole.TC_FRMMONITORINGCOUNSEL
       // 3/7/2014 - kniese - Adding new roles for Bonds
      case ContactRole.TC_CLAIMINDEMNITOR:
        return ContactRole.TC_FRMRCLAIMINDEMNITOR
       //5/8/2013 - kepage -Added as part of new E&S development
      case ContactRole.TC_ARBITRATOR :
        return ContactRole.TC_FORMERARBITRATOR
      case ContactRole.TC_CERTIFICATEHOLDER :
        return ContactRole.TC_FMRCERTIFICATEHOLDER
      case ContactRole.TC_CLAIMADDITIONALINSURED :
        return ContactRole.TC_FMRCLMADDINSURED
      case ContactRole.TC_CLAIMNAMEDINSURED :
        return ContactRole.TC_FRMCLMNAMEDINSURED
      case ContactRole.TC_CLAIMADDNAMEDINSURED :
        return ContactRole.TC_FRMCLMADDNAMEDINSURED
      case ContactRole.TC_RETAILBROKER:
        return ContactRole.TC_FRMRETAILBROKER
      case ContactRole.TC_BUILDINGCONSULTANT:
        return ContactRole.TC_FRMBUILDINGCONSULTANT
       // 6/2/15 - kniese - Ocean Marine Avalon
       case ContactRole.TC_COPRINCIPAL : 
        return ContactRole.TC_FRMRCOPRINCIPAL
       // 3.26.15 - cmullin - Workers' Comp codes
      case ContactRole.TC_THDPTYTORTFEASOR:
        return ContactRole.TC_FMRTHDPTYTORTFEASOR
      case ContactRole.TC_TPTORTFEASORCARR:
        return ContactRole.TC_FMRTPTORTFEASORCARR
      case ContactRole.TC_INSURERTPA:
        return ContactRole.TC_FMRINSURERTPA
      case ContactRole.TC_INJWORKERSUPER:
        return ContactRole.TC_FMRINJWORKERSUPER
      case ContactRole.TC_CHIROPRACTOR:
        return ContactRole.TC_FMRCHIROPRACTOR
      case ContactRole.TC_MEDCASEMANAGER:
        return ContactRole.TC_FRMRMEDCASEMANAGER
      case ContactRole.TC_MEDCASEMGMT:
        return ContactRole.TC_FRMRMEDCASEMGMT
      case ContactRole.TC_MEDNONPHYSICIAN:
        return ContactRole.TC_FRMRMEDNONPHYSICIAN
      case ContactRole.TC_PHYSOCCTHERAPIST:
        return ContactRole.TC_FRMRPHYSOCCTHERAPIST
      // 8/12/16 dnmiller - AVIATION
      case ContactRole.TC_CLAIMLOSSPAYEE:
        return ContactRole.TC_FRMRCLAIMLOSSPAYEE
      case ContactRole.TC_PILOT:
        return ContactRole.TC_FRMRPILOT
      case ContactRole.TC_LEADCARRIER:
        return ContactRole.TC_FRMRLEADCARRIER
      case ContactRole.TC_PRIMARYPILOT:
        return ContactRole.TC_FRMRPRIMARYPILOT
    }
    return null
  }
  
  public static function getFormerRoles(roles : List):List<ContactRole>{
    var formerRoles = new ArrayList<ContactRole>();
    for (role in roles){
      var formerRole = getFormerRole(role as ContactRole)
      if (formerRole != null)
        formerRoles.add(formerRole)
    }
    return formerRoles
  }
  
  public function insuredAddressValidation():String{
    if (this.PrimaryAddress != null){ 
      if ((this.PrimaryAddress.Country=="US" || this.PrimaryAddress.Country=="CA")){
        if ((this.PrimaryAddress.AddressLine1 == null || this.PrimaryAddress.City == null || this.PrimaryAddress.State == null || this.PrimaryAddress.PostalCode == null)){
        return "Insured Address, when entered, must contain Line1, City , State and Zip."
        }
      }else {
        if (this.PrimaryAddress.AddressLine1 == null || this.PrimaryAddress.City == null){
        return "Insured Address, when entered, must contain Line1 and City."
        }
      }
    }
    return null
  }
}