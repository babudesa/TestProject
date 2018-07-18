package libraries.ClaimContactRole_Entity
uses java.util.ArrayList
uses java.util.HashMap

enhancement ClaimContactRole : entity.ClaimContactRole {
  //Used to filter Type on Additional Interests List View.
  public function filterCoveredPartyType(partyType:String):boolean
  {
    var result = true
    if (partyType == "accountpayor" or partyType == "certholder")
    {
      result = false
    }
    else
    {
       result = true 
    }
  
    return result
  }
   // mwissel - 2/23/2009 - defect 1574 added claimant to function isRoleEditable to prevent the claimant role from
  // being removed in the "Parties Involved" screen in the New Claim Wizard

  function isRoleEditable() : Boolean{
    
    var uneditableRoles = new ArrayList<String>(){"checkpayee", "agency", "formerinsured", "underwriter", "coveredparty",
      "AdditionalInterestRisk", "lienholder", "claimant", "driver", "incidentclaimant", "beneficiary", "claimlosspayee"}
      
    var uneditableFeatureRoles = new ArrayList<String>(){ContactRole.TC_CLAIMANTDEP.Code,ContactRole.TC_MEDNONPHYSICIAN.Code,
      ContactRole.TC_VOCREHABSPECIALIST.Code, ContactRole.TC_OPPOSINGCOUNSEL as java.lang.String} 
    
    if(
      // Uneditable roles for Claim and Feature
      uneditableRoles.contains(this.Role)
      // Uneditable roles for Feature
      or (uneditableFeatureRoles.contains(this.Role) and not (this.Exposure == null))
      
      or ((this.Role == "PrimaryTrainer" or this.Role == "AlternateTrainer") and this.Owner == this.ClaimContact.Claim.Policy.PolicyNumber) or
        (this.Role.DisplayName != null and this.Role.DisplayName.toLowerCase().startsWith( "former" )) or
        (this.ClaimContact.Contact.VerifiedPolicyContactExt and this.Owner == this.ClaimContact.Claim.Policy.PolicyNumber)) {
        return false;
    }else if(this.Owner == this.Matter and !IsRoleEditableForMatter) {
      return false
    }else if(this.Owner == this.ClaimContact.Claim && ((this.Role == ContactRole.TC_INSURER || this.Role == ContactRole.TC_INSURERTPA) 
          && (exists(contact in this.ClaimContact.Claim.ThirdPartyAdminsExt*.InsurerTPA where contact.ID == this.Contact.ID)))){
          
          return false
     }else if(this.Owner == this.ClaimContact.Claim && this.Role == ContactRole.TC_CERTIFICATEHOLDER && 
             this.ClaimContact.Claim.CertHolderExt.ID == this.Contact.ID) {
          return false
      } 
    return true
  }

  //kmboyd - 3/13/09 - Function added to return the owner of a role, since the field is not directly accessable
  //sprzygocki - 5/18/11 - changed the function to return the role's Owner since the field is now directly accessible here. It is not accessible
  //  via the rules so this function is necessary until a better solution can be found
  function getOwnerExt() : Object{
    return this.Owner
  }

  /*
    Checks to see if current role is a former role.
    Sprint/Maintenance Release: EM 14 - Defect 836
    Author: Zach Thomas
    Date: 04/06/2009
    Updated: 9/17/2010 - Udated to switch between every former role in system.
    Updated: tnewcomb 03/23/2011 - Check that Role is not null before calling toLowerCase() on its Code.
  */
  function isFormerRole() : Boolean{
  //  var formerRole : Boolean = false;
  //  if(this.Role == "formeraddintrisk" || this.Role == "formeragency" || this.Role == "formerclaimant" ||
  //  this.Role == "formeragent" || this.Role == "formeralternatetrainer" || this.Role == "formercoveredparty" || 
  //  this.Role == "formerdoingbusinessas" || this.Role == "formerexcludedparty" || this.Role == "formerinsured" ||
  //  this.Role == "formerlienholder" || this.Role == "formerpolicyholder" || this.Role == "formerprimarytrainer" ||
  //  this.Role == "formerunderwriter"){
  //    formerRole = true;
  //  }
  //  return formerRole;
    var code : String = null;
  
    if(this.Role != null){
      code = this.Role.Code.toLowerCase();    
    }
    else{
      //Role is null and we can&apos;t check if it is a former
      return false;
    }
  
    switch ( code ){
      case "formeraccountant":
        return true;
      case "formeractivityowner":
        return true;
      case "formeraddintrisk":
        return true;
      case "formeragency":
        return true;
      case "formeragent":
        return true;
      case "formeragronomist":
        return true;
      case "formeraltcontact":
        return true;
      case "formeralternatetrainer":
        return true;
      case "formercatnursemanage":
        return true;
      case "formerclaimant":
        return true;
      case "formerclaimantdep":
        return true;
      case "formercodefendant":
        return true;
      case "formercoveragecounsel":
        return true;
      case "formercoveredparty":
        return true;
      case "formerdefendant":
        return true;
      case "formerdefensecounsel":
        return true;
      case "formerdoctor":
        return true;
      case "formerdoingbusinessas":
        return true;
      case "formerdriver":
        return true;
      case "formeremployer":
        return true;
      case "formerengineerbiomech":
        return true;
      case "formerexcludedparty":
        return true;
      case "formerfiledby":
        return true;
      case "formerhospital":
        return true;
      case "formerindadjuster":
        return true;
      case "formerinsured":
        return true;
      case "formerinjured":
        return true;
      case "formerinsuredrep":
        return true;
      case "formerinvestigator":
        return true;
      case "formerjudge":
        return true;
      case "formerlawenfcagcy":
        return true;
      case "formerlawenfcagcy":
        return true;
      case "formerleadparalegal":
        return true;
      case "formerlegalcasemgmt":
        return true;
      case "formerlienholder":
        return true;
      case "formermaincontact":
        return true;
      case "formermattermanager":
        return true;
      case "formermediator":
        return true;
      case "formernursecasemgmt":
        return true;
      case "formernursecasemgr":
        return true;
      case "formerocctherapist":
        return true;
      case "formerother":
        return true;
      case "formerpassenger":
        return true;
      case "formerphystherapist":
        return true;
      case "formerplaintiff":
        return true;
      case "formerplaintiffcounsel":
        return true;
      case "formerpolicyholder":
        return true;
      case "formerprimarytrainer":
        return true;
      case "formerrecoverycounsel":
        return true;
      case "formerrecoverypayer":
        return true;
      case "formerrepairshop":
        return true;
      case "formerreporter":
        return true;
      case "formersalvageservice":
        return true;
      case "formersubvendor":
        return true;
      case "formersupervisor":
        return true;
      case "formertowingagcy":
        return true;
      case "formerunderwriter":
        return true;
      case "formervendor":
        return true;
      case "formervenue":
        return true;
      case "formervocrehabspec":
        return true;
      case "formerwitness":
        return true;
      case "frmrcatnursecasemger":
        return true;
      case "frmrcauseolspecinvst":
        return true;
      case "frmrconsultingcounsel":
        return true;
      case "frmrcostcontrolvendor":
        return true;
      case "frmrdefcounselcumis":
        return true;
      case "frmrdefcounselmonitor":
        return true;
      case "frmrengrhumanfactor":
        return true;
      case "frmrengrstructsoil":
        return true;
      case "frmrinsdpersoncounsel":
        return true;
      case "frmrvehownclaimopen":
        return true;
      case "frmrvehownclaimclose":
        return true;
      case "frmrguardianadlitem":
        return true;
      case "formersalvagebuyer":
        return true;
      // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes
      case "formeropposingcounsel":
        return true;
      case "formerexpertplaintiff":
        return true;
      case "frmrpotentiallitigation":
        return true;
      case "frmrproseplaintiff":
        return true;
      case "frmrexpertdefense":
        return true;
      case "frmincidentclaimant":
        return true;
      // 11/9/2012 - kniese - Added for medicare reporting
      case "formerbeneficiary":
        return true;
      case "formerpowerofattorney":
        return true;
      case "formerguardian":
        return true;
      case "frmmonitoringcounsel":
        return true;
      // 3/7/2014 - kniese - Added for Bonds
      case "frmrclaimindemnitor":
        return true;
      case ContactRole.TC_FORMERARBITRATOR.Code :
        return true;
      case ContactRole.TC_FMRCERTIFICATEHOLDER.Code :
        return true;
      case ContactRole.TC_FMRCLMADDINSURED.Code :
        return true;
      case ContactRole.TC_FRMCLMNAMEDINSURED.Code :
        return true;
      case ContactRole.TC_FRMCLMADDNAMEDINSURED.Code :
        return true;
        //3-7-14 : cdmcdonald - Environmental dev
      case "frmretailbroker":
        return true;
      case "frmbuildingconsultant":
        return true;
      // 6/2/15 - kniese - Ocean Marine Avalon
      case ContactRole.TC_FRMRCOPRINCIPAL.Code :
        return true;
        //2-4-15 : cdmcdonald - Workers Comp
        case ContactRole.TC_FMRTHDPTYTORTFEASOR.Code:
          return true;
        case ContactRole.TC_FMRTPTORTFEASORCARR.Code:
          return true;
        case ContactRole.TC_FMRINSURERTPA.Code:
          return true;
        case ContactRole.TC_FMRINJWORKERSUPER.Code:
          return true;
        case ContactRole.TC_FMRCHIROPRACTOR.Code:
          return true;
        case ContactRole.TC_FORMERPHYSTHERAPIST.Code:
          return true;
        case "frmrmedcasemanager":
          return true;
        case "frmrmedcasemgmt":
          return true;
        case "frmrmednonphysician":
          return true;
        case "frmrphysocctherapist":
          return true;
      // 8/12/16 dnmiller - Aviation
        case ContactRole.TC_FRMRCLAIMLOSSPAYEE.Code:
          return true;
        case ContactRole.TC_FRMRPILOT.Code:
          return true;
        case ContactRole.TC_FRMRLEADCARRIER.Code:
          return true;
        case ContactRole.TC_FRMRPRIMARYPILOT.Code:
          return true;
      default:
        return false;
    }
  }

  /*
    Checks to see if current role is a role restricted from being merged.
    Sprint/Maintenance Release: Agri 0 - Defect 2929
    Author: Zach Thomas
    Date: 01/25/2010
  */
  function isRestrictedRole():Boolean{
    var hasRestrictedRole : Boolean = false;
    if(this.Role == "checkpayee" or this.Role == "recoverypayer" or 
    this.Role == "formercheckpayee" or this.Role == "activityowner"){
      hasRestrictedRole = true;
    }
    return hasRestrictedRole;
  }

  /*  This function looks to see if a driver is associated with an exposure. 
   *  so that they cannot be removed from the Drivers and Operators screen.
   *
   * Zach Thomas 9/18/09
   */
  function driverUsedByExposure():Boolean{
    var result : Boolean = false;
  
    if(exists(exp in this.ClaimContact.Claim.Exposures where exp.DriverExt == this.Contact)){
      result = true;
    }
  
    return result;
  }

  /* This function checks if the contact is a watercraft operator.  If so display the 
  contact on the Drivers and Operators screen but do NOT allow anyone to edit the name or covered party type.
  Part of defect 2644
  */
  function driverAndOperator():Boolean{
    var result : Boolean = false;
     //if(exists(cont in this.ClaimContact.Roles where cont.Role=="AdditionalInterestRisk" and cont.CoveredPartyType.Code=="watercraftoprtr")){
       if(this.CoveredPartyType=="watercraftoprtr"){
      result = true;
    }
    return result;
  }
  /*
    Checks to see if current role is a More Named Insured Role.
    Author: Zach Thomas
    Date: 12/3/2009
  */
  function isMNIClaimContact():Boolean{
    if(this.CoveredPartyType == "addnlnameinsured" or this.CoveredPartyType == "morenameinsureddba"){
      return true;
    }else{
      return false;
    }
  }

  /*
    Checks to see if current role is not a More Named Insured Role.
    Author: Zach Thomas
    Date: 12/3/2009
  */
  function isNonMNIClaimContact():Boolean{
    if(this.CoveredPartyType != "addnlnameinsured" and this.CoveredPartyType != "morenameinsureddba"){
      return true;
    }else{
      return false;
    }
  }

  /*12/30/09 erawe: This rule sets the owner to claimnumber if the role is driver.  I am only calling
  this function on the EditableClaimContactsRolesLV.pcf.  We should be able to add to this if we
  need to in the future.
  */
  function setRoleOwner(){
    if(this.Role == "driver" and this.Owner != this.ClaimContact.Claim.ClaimNumber){
      for(owner in this.ClaimContact.Claim.RoleOwners){
        if(owner == this.ClaimContact.Claim.ClaimNumber){
          this.Owner = owner;
        }
      }
    }
  }
    
  private property get IsRoleEditableForMatter() : boolean {
    return !{ContactRole.TC_DEFENSECOUNSEL,
             ContactRole.TC_DEFENSECOUNSELCUMIS,
             ContactRole.TC_CONSULTINGCOUNSEL,
             ContactRole.TC_DEFENSECOUNSELMONITOR,
             ContactRole.TC_COVERAGECOUNSEL,
             ContactRole.TC_RECOVERYCOUNSEL,
             ContactRole.TC_OPPOSINGCOUNSEL,
             ContactRole.TC_MEDIATOR,
             ContactRole.TC_INSUREDPERSONCOUNSEL,
             contactrole.TC_MONITORINGCOUNSEL}.contains(this.Role)
  }
  
  public static property get RestrictedRolesForMatters() : ContactRole[] {
    return ContactRoleCategory.TC_LITRESTRICTED.Categories.whereTypeIs(ContactRole)
  }

  /**
   * Use on the validation of [] so that this code will only fire on the final value being submitting, 
   * preventing the logic from firing when the field is changed and changed again.
   * 
   * Will set the changed role to Former, and will remove the former role from the updated value.
   *
  function validationUpdateRoleAndFormerRole() : String{
 
    var RolesWithFormerRoles = new HashMap<ContactRole,ContactRole>()
      RolesWithFormerRoles.put(ContactRole.TC_CLAIMANTDEP,ContactRole.TC_CLAIMANTDEP)
 
    // limit the function to the selected roles - only one of these is needed
    if (RolesWithFormerRoles.containsKey(this.Role) or RolesWithFormerRoles.containsValue(this.Role)){
      
      if (this.New){ // Newly added - Just ensure there is no leftover FormerDependent role
        removeFormerRoleFromNewClaimContact(this)
      }
      else { // Changed - Set the old Contact to FormerDependent, then ensure there is no leftover FormerDependent role 
        updateToFormerRole(this)
        removeFormerRoleFromNewClaimContact(this)
      }
    }
    return null
  }
  
      /**
       * TODO: JavaDoc
       *
      function updateToFormerRole(ccRole: ClaimContactRole){
        // Set the old value to former dependent
        var originalId = ccRole.getOriginalValue("ClaimContact") as Key

        // Set the original ClaimContact to Former Role, then remove the Role
        if (originalId!=null){
          var cc = ccRole.Bundle.loadByKey(originalId) as ClaimContact
    
          cc.Contact.createFormerRole(ccRole.ClaimContact.Claim, ccRole)
          ccRole.ClaimContact.Claim.removeRole(ccRole.Role, cc.Contact)
        }
      }

      /**
       * TODO: JavaDoc
       * TODO: need to add a way to get a ContactRole's former role, and add to the oldFormerRole line. 
       * Currently will only support ClaimantDependent as a result.
       *
      function removeFormerRoleFromNewClaimContact(ccRole : ClaimContactRole){

        // TODO make this work with other Roles
        var oldFormerRole = ccRole.ClaimContact.Roles.firstWhere(\ c -> c.Role.equals(ContactRole.TC_FORMERCLAIMANTDEP) 
          and (ccRole.Exposure == null
            ? c.Exposure == null  
            : c.Exposure.equals(ccRole.Exposure)
        ))
      
        if (oldFormerRole != null){
         oldFormerRole.removeRoleOnly() 
        }
      }
      */
}