package libraries.ClaimContact_Entity
//uses org.w3c.dom.Entity;
uses java.util.ArrayList;
uses java.util.Collections;
uses java.util.HashSet

enhancement ClaimContactRoles : entity.ClaimContact {
  public function getCoveredPartyTypes() : List {
    var CPTs : List = new ArrayList();
    for(role in this.Roles){
      if(role.CoveredPartyType != null){
        CPTs.add( role.CoveredPartyType )
      }
    }
    return CPTs;
  }
  
  public function getCoveredPartyTypeNames() : List {
    var CPTs : List = new ArrayList();
    
    //get attorney types from matter assignments for party type display
    CPTs.addAll(this.Claim.Matters*.MatterAssignmentsExt
                    .where(\ m -> m.CounselLawFirmExt == this.Contact ||
                             m.LeadCounselExt == this.Contact)*.AttorneyTypeExt*.DisplayName as java.util.Collection<java.lang.Object>)                                                               
    
    for(role in this.Roles){
      if(role.CoveredPartyType != null){
        CPTs.add( role.CoveredPartyType.DisplayName )
      }
    }
    
    //remove duplicates
    var newSet = new HashSet(CPTs)
    CPTs.clear()
    CPTs.addAll(newSet)
    
    return CPTs;
  }

  //Check to see if role exists in contact
  public function hasRole(role : String) : boolean{
    for(contactRole in this.Roles){
      if(contactRole.Role == role){
        return true
      }
    }
    return false     
  }
  
  //Add Beneficiary role if relationship is Beneficiary 
  public function formatBenRoleDisplay():String{
    var isWCClaim : Boolean = util.WCHelper.isWCorELLossType(this.Claim)
    //var isWCClaim : Boolean = util.WCHelper.isWCorELLossType(this.Claim)
    var clmContRoles : ArrayList = new ArrayList();
    var tempSet : HashSet = new HashSet(); 
    for(ccr in this.Roles)
    {

   if(isWCClaim &&exists(cc in this.Contact.AllContactContacts where this.Contact == cc.RelatedContact)){
        clmContRoles.add(ContactRole.TC_BENEFICIARY.DisplayName) 
        clmContRoles.add(ccr.DisplayName)
    }
    }
tempSet.addAll(clmContRoles);
    clmContRoles.clear();
    clmContRoles.addAll(tempSet);
    Collections.sort( clmContRoles, String.CASE_INSENSITIVE_ORDER )
    return util.StringUtils.formatCollection(clmContRoles)
  }

  
  //11.5.15 - cmullin - added code to remove duplicates and removed multiple calls to util.WCHelper.isWCorELLossType.
  public function formatRolesDisplay():String{
    var isWCClaim : Boolean = util.WCHelper.isWCorELLossType(this.Claim)
    var clmContRoles : ArrayList = new ArrayList();
    var tempSet : HashSet = new HashSet();
    for(ccr in this.Roles){
      if((this.Claim.LossType == typekey.LossType.TC_COMMBONDS or this.Claim.LossType == typekey.LossType.TC_OMAVALON) and ccr.Role.Code == ContactRole.TC_INSURED ){
        clmContRoles.add("Principal")
      }
        //WCOMP Development: To reflect Supervisor fields to Injured Worker Supervisor and Doctor fields to Doctoe role VocRehabSpecialist to Medical Provider Non-Phyisician role
        //Date : 04/29/2015
        //Developer : Amulya Saikumar
      else if(isWCClaim && ccr.Role.Code == ContactRole.TC_SUPERVISOR){
         clmContRoles.add(ContactRole.TC_INJWORKERSUPER.DisplayName)      
      }
    //  else if(isWCClaim && exists(cc in this.Contact.AllContactContacts where this.Contact == cc.RelatedContact)){
       //  clmContRoles.add(ContactRole.TC_BENEFICIARY.DisplayName) 
        // clmContRoles.add(ccr.DisplayName)
     // }
      //else if(isWCClaim && ccr.Role.Code == ContactRole.TC_FirstIntakeDoctor){    
         //clmContRoles.add(ContactRole.TC_DOCTOR.DisplayName)     
      //}  
      else{
         clmContRoles.add(ccr.DisplayName)
 
      }
    }
    tempSet.addAll(clmContRoles);
    clmContRoles.clear();
    clmContRoles.addAll(tempSet);
    Collections.sort( clmContRoles, String.CASE_INSENSITIVE_ORDER )
    return util.StringUtils.formatCollection(clmContRoles)
  }
}
