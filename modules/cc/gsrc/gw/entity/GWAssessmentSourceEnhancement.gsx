package gw.entity;

@Export
enhancement GWAssessmentSourceEnhancement : entity.AssessmentSource
{
  function ensureContactIsClaimContact(mycontact : Contact) {
    
     if (NOT exists (contact in this.Incident.Claim.Contacts where contact.Contact == mycontact)) {
        var newClaimContact = new ClaimContact( mycontact );  
        newClaimContact.Claim = this.Incident.Claim ;
        newClaimContact.Contact = mycontact ;
        var element = new ClaimContactRole( mycontact );
        // Will need to add a new role
        element.Role = "assessor";
        element.Incident = this.Incident;
        newClaimContact.addToRoles( element );
     }  
  }
  
}
