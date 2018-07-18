package libraries.Claim_Entity
uses java.util.ArrayList;

enhancement VetFunctions : entity.Claim {
  //Defect 1593 - kmboyd - 3/18/09 - Ran if the doctor role has been removed from the contact and that role is part of an injured animal.
  function removeDoctorFromVets(){
    //Grab only doctors on the claim
    for(doc in this.getRelatedContacts(Doctor)){
      //var docArray : List = new ArrayList()
      //Check to see if the doctor is a vet
      if(doc.Doctor.DoctorSpecialty == "veterinarian"){
        //Loop through all roles that have been removed from the contact if any
        for(remRole in this.getClaimContact(doc).getRemovedArrayElements("Roles")){       
          var contactRole : ClaimContactRole = remRole as ClaimContactRole
          //If the role removed is a doctor role and the role owner is a fixed property incident
          if(contactRole.Owner typeis FixedPropertyIncident){
            //Check to see if the vet on the incident is the vet role being romeved, if it is remove the vet from the incident
            if(contactRole.Owner.VeterinarianExt == doc){
              contactRole.Owner.VeterinarianExt = null;
            }
          }
        }
      }
    }
  
    //Grab only mcos on the claim
    for(mco in this.getRelatedContacts(MedicalCareOrg)){
      //var docArray : List = new ArrayList()
      //Check to see if the doctor is a vet
      if(mco.MedicalCareOrg.MedicalOrgSpecialty == "veterinarian"){
        //Loop through all roles that have been removed from the contact if any
        for(remRole in this.getClaimContact(mco).getRemovedArrayElements("Roles")){       
          var contactRole : ClaimContactRole = remRole as ClaimContactRole
          //If the role removed is a doctor role and the role owner is a fixed property incident
          if(contactRole.Owner typeis FixedPropertyIncident){
            //Check to see if the vet on the incident is the vet role being romeved, if it is remove the vet from the incident
            if(contactRole.Owner.VeterinarianExt == mco){
              contactRole.Owner.VeterinarianExt = null;
            }
          }
        }
      }
    }
  }

  //Defect 1593 - kmboyd - 3/18/09 - Ran if the doctor role&apos;s owner was change to an existing incident or from an existing incident, removes or adds the vet where necessary
  function doctorRoleOwnerChanged(){
    //Grab only doctors on the claim
    for(doc in this.getRelatedContacts(Doctor)){
      //Loop through the roles to find one that is a doctor and has had an incident change
      for(role in this.getClaimContact( doc ).Roles){
        if(role.Changed and role.ChangedFields.contains("Incident") and doc.Doctor.DoctorSpecialty=="veterinarian"){
          //If the owner was set to an existing incident
          if(role.Incident != null){
            if(role.Incident.OriginalVersion != null){
              this.removeVetFromIncident((role.OriginalVersion as ClaimContactRole).Incident as FixedPropertyIncident);
            }
            //Check to see if the vet isn&apos;t already filled out, if it isn&apos;t set this contact to be the new vet
            if((role.Incident as FixedPropertyIncident).VeterinarianExt == null){
              (role.Incident as FixedPropertyIncident).VeterinarianExt = doc
            }
           //if the incident is null, then the user has changed the owner to something else FROM an incident
          }else if(role.Incident == null){
            //If the doctor was set on an incident as the vet
            if(((role.OriginalVersion as ClaimContactRole).Incident as FixedPropertyIncident).VeterinarianExt == doc){
              //Loop through all incidents and find the incident related to this change and remove the vet from that incident
              this.removeVetFromIncident((role.OriginalVersion as ClaimContactRole).Incident as FixedPropertyIncident);
            }
          }
        }
      }
    }
  
    //Grab only mco&apos;s on the claim
    for(mco in this.getRelatedContacts(MedicalCareOrg)){
      //Loop through the roles to find one that is a doctor and has had an incident change
      for(role in this.getClaimContact( mco ).Roles){
        if(role.Changed and role.ChangedFields.contains("Incident") and mco.MedicalCareOrg.MedicalOrgSpecialty == "veterinarian"){
          //If the owner was set to an existing incident
          if(role.Incident != null){
            if(role.Incident.OriginalVersion != null){
              this.removeVetFromIncident((role.OriginalVersion as ClaimContactRole).Incident as FixedPropertyIncident);
            }
            //Check to see if the vet isn&apos;t already filled out, if it isn&apos;t set this contact to be the new vet
            if((role.Incident as FixedPropertyIncident).VeterinarianExt == null){
              (role.Incident as FixedPropertyIncident).VeterinarianExt = mco
            }
           //if the incident is null, then the user has changed the owner to something else FROM an incident
          }else if(role.Incident == null){
            //If the doctor was set on an incident as the vet
            if(((role.OriginalVersion as ClaimContactRole).Incident as FixedPropertyIncident).VeterinarianExt == mco){
              //Loop through all incidents and find the incident related to this change and remove the vet from that incident
              this.removeVetFromIncident((role.OriginalVersion as ClaimContactRole).Incident as FixedPropertyIncident);
            }
          }
        }
      }
    }
  }

  function removeVetFromIncident(incident : FixedPropertyIncident){
    for(fixedIncident in this.FixedPropertyIncidentsOnly){
      if(incident == fixedIncident){
        fixedIncident.VeterinarianExt = null
      }
    }
  }
}
