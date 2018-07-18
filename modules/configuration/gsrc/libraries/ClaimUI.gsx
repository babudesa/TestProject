package libraries
uses java.util.ArrayList;
uses libraries.ClaimsUI.ClaimUIHelper

@Export
enhancement ClaimUI : entity.Claim
{
  
  /*
  * Property stores the Claim UI Helper Class
  *
  *@returns new ClaimUIHelper 
  */
  property get UIHelper(): ClaimUIHelper{
      return new ClaimUIHelper(this)
  }
  
  
  /*
   * Initialize any standard default values on a newly created claim. Used in the loss
   * details step of the new claim wizard
   */
  function setInitialValues() {
    if (this.LossType == "AUTO") {
      this.LOBCode = "auto"
    } else if (this.LossType == "TRAV" ) {
      this.LOBCode = "travel" 
    } else if (this.LossType == "GL") {
      this.LOBCode = "gl"
    } else if (this.LossType == "PR") {
      this.LOBCode = "pr"
    } else if (this.LossType == "WC") {
      this.ClaimWorkComp = new ClaimWorkComp(this);
      this.LOBCode = "wc" as LOBCode
      var claimInjuryIncident = this.ensureClaimInjuryIncident();
      claimInjuryIncident.GeneralInjuryType = "specific" as InjuryType;
      claimInjuryIncident.DetailedInjuryType = "59" as DetailedInjuryType;
      if (claimInjuryIncident.BodyParts.length == 0) {
        var newBodyPart = claimInjuryIncident.newBodyPart();
        newBodyPart.PrimaryBodyPart = "multiple" as BodyPartType;
        newBodyPart.DetailedBodyPart = "65" as DetailedBodyPartType;
        claimInjuryIncident.addToBodyParts( newBodyPart );
      }
      this.EmploymentData = new EmploymentData(this)
    }
    if(this.ReportedDate == null) {
      this.ReportedDate = gw.api.util.DateUtil.currentDate()
    }
    this.SIUStatus = "No_Referral"
    this.ReinsuranceStatus = "Does_Not_Apply"
    this.IncidentReport = false
  }

  function areInitialValuesSet() : boolean {
    return this.LOBCode != null
  }

  function cancelTrips(checkedTripRU : entity.TripRU[]) {
    for (eachTripRU in checkedTripRU){
      var newTripIncident = new TripIncident()
      newTripIncident.TripRU = eachTripRU
      this.addToIncidents( newTripIncident )
    }
  }
  function undoTripCancellation(checkedTripRU : entity.TripRU[]) {
    for (eachTripRU in checkedTripRU){
      for(eachTripIncident in this.TripIncidentsOnly)
      {
        if(eachTripIncident.TripRU == eachTripRU)
        {
          this.removeFromIncidents( eachTripIncident )
        }
      }
    }
  }

  function getClaimOfficeBranch() : String {
    var defaultValue = "Corporate Claims"
    var branch = getClaimOfficeBranchGroup();

    if ( branch != null) { 
      return branch.Name; 
    } else { 
      return defaultValue;
    } 
  }

  function getClaimOfficeBranchGroup() : Group {
  
    var group = this.AssignedGroup
    
    if (group == null)
      return null
    
    do {
      var type = group.GroupType
      /** Return the group name if the GroupType is of branch office or business unit */
      if (type == "branchoffice" || type == "busunit" || type =="nonclaimsbusunit") {
        return group
      }
      group = group.Parent
    }
    while(group != null)
    /** If we didn't have a group which was a branchoffice or business unit return "SCO" */
    return null
  }

  function getGAITypeOfLoss() : String {
    var defaultValue = ""
    var DueTo = this.ex_LossDueTo
    var Loc = this.ex_LossLocation
    
    if (DueTo == null or Loc == null) {
      return defaultValue
    } else {
      defaultValue = Loc.Code + DueTo.Code.charAt(0)
      return defaultValue
    }
  }


  /**
   * Used to check whether setInitialValues has already been called
   *
   *  This function grabs all the claim contacts and filters out agencies 
   *  so that they are not legal to be paid.
   *
   * Ryan Pampush 5/7/08
   */
  function getPayeeClaimContacts():List{
    var payeeList = new ArrayList();
    for(contact in this.Contacts){
      if(!contact.hasRole( "agency" )){
        payeeList.add(contact.Contact)
      }
    }
    return payeeList;
  }

  function setMainContact()
  {
    if( this.maincontact == this.Insured)  
      this.MainContactType = "self"

    if(this.maincontact == null)
      this.MainContactType = null 
  }

  /*  This function determines the business unit group that this claim is assigned to.
   *
   * Zach Thomas 9/21/09
   */
   function getClaimBusinessUnitGroup():Group{
     var businessUnitGroup : Group;
     var tempGroup : Group = this.AssignedGroup;
           
     while(tempGroup != tempGroup.RootGroup){
       businessUnitGroup = tempGroup;
       if(businessUnitGroup.GroupType == "busunit"){
         break;
       }
       tempGroup = tempGroup.Parent;
     }
   
     if(businessUnitGroup.GroupType != "busunit"){
       var q = find(var g in Group where g.Name == "GAIC Claims" and
       g.GroupType == GroupType.TC_BUSUNIT)
       businessUnitGroup = q.AtMostOneRow
     }
   
     return businessUnitGroup
   }
   
  function getAttorneys():List{
    var result:List = new ArrayList()
    for(contact in this.getRelatedContacts()){
      if(contact.Subtype=="Attorney" || contact.Subtype=="LawFirm"
          || contact.Subtype=="Ex_ForeignCoVenLawFrm" || contact.Subtype=="Ex_ForeignPerVndrAttny"){
          result.add(contact)   
      }
    }
    return result
  }
  
  /**
   *  This function defaults the Contact Prohibited field to Yes for Trucking Loss Types 
   *  Ashwini Kubatur
   *  9/7/16 erawe - Defect 8554, Corp Claims wants this to trigger by Producing BU not Claim BU
   *  On variable creation (ContactProhibited) in PersonContactInfoInputSet, I also did a null check because somehow in
   *  one test we received a null error on the variable ContactProhibited for the claim being null, but only once. 
   *  how claim would be null I do not know, but coding so no error message appears.
   */
  function setInitalValuesWC(){
     if (this.ProducingBusinessUnitExt!=null and this.ProducingBusinessUnitExt == BusinessUnitExt.TC_TK){  
       if (this.getClaimContact(this.claimant) != null){
         this.getClaimContact(this.claimant).ContactProhibited = true;
       }
     }
  }
}