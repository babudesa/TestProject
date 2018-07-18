package libraries.Claim_Entity

enhancement ClaimRelatedContactFunctions : entity.Claim {
  /*
  *  This function creates a Claim Contact from the More Insured DBA added to a contact's Related Contacts.
  *  Sprint/Maintenance Release: EM 17 
  *  Author: Zach Thomas
  *  Date: 12/29/09
  */
  function createMNIRelatedDBAClaimContact(){
    for(cont in this.Contacts){
      if(cont.Contact.AllContactContacts.length > 0){
        for(contCont in cont.Contact.getContactContactsByRelationship( "morenamedinsureddba" )){
          if(!exists(cc in this.Contacts where cc.Contact == contCont.SourceContact) or exists(cc in this.Contacts where cc.Contact == contCont.SourceContact and 
             !exists(role in cc.Roles where role.Role == "coveredparty" and role.CoveredPartyType == "morenameinsureddba") and
             !exists(role in cc.Roles where role.Role == "formercoveredparty" and role.CoveredPartyType == "morenameinsureddba"))){
            var CCR : ClaimContactRole;
            CCR = this.Policy.addRole( "coveredparty", contCont.SourceContact )
            CCR.CoveredPartyType = "morenameinsureddba";
          }
        }
      }
    }
  }
 
   /*
  *  This function creates a Claim Contact from the More Insured DBA added to a contact's Related Contacts.
  *  Sprint/Maintenance Release: EM 17 
  *  Author: Zach Thomas
  *  Date: 12/29/09
  */
   function hasRelatedMNIDBAContact(cont:Contact):Boolean{  
     if(cont != null){
       if(exists(role in this.getClaimContact( cont ).Roles where role.Role == "coveredparty" and role.CoveredPartyType == "addnlnameinsured") and
         cont.AllContactContacts.length != 0 and cont.getContactContactsByRelationship( "morenamedinsureddba" ).length != 0){
         return true;
       }else{
         return false;
       }
     }else{
       return false;
     }
   }
 
    /*
  *  This function sets the relationship of More Named Insured DBA related to More Named Insured.
  *  Sprint/Maintenance Release: EM 17 
  *  Author: Zach Thomas
  *  Date: 01/07/10
  */
   function setRelatedMNIDBARelationship(){
     for(clmCont in this.Contacts){
       for(contCont in clmCont.Contact.AllContactContacts){
         if(exists(cc in this.Contacts where cc.Contact == contCont.RelatedContact and 
           exists(role in cc.Roles where role.Role == "coveredparty" and role.CoveredPartyType == "morenameinsureddba"))){
             contCont.setBidiRel( clmCont.Contact, "morenamedinsureddba" )
         }
       }
     }
   }
}
