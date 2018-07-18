package libraries.FixedPropertyIncident_Entity

enhancement FixedPropertyIncidentFunctions : entity.FixedPropertyIncident {
  /*Checks for disconnected features associated with the fixed property incident. 
    Sprint/Maintenance Release: EM 10 - Defect 1131
    Author: Zach Thomas
    Date: 07/22/08
  */
  function hasDisconnectedFeatures() : Boolean{
    var disconnectedFeatures : Boolean = false;
    if(exists(exp in this.Claim.Exposures where exp.FixedPropertyIncident.PublicID == this.PublicID and exp.ReconnectFailExt)){
      disconnectedFeatures = true;    
    }
    return disconnectedFeatures;
  }
  
  function setIncdVeterinarian (){
    if (this.VeterinarianExt != null)  {
      if (this.VeterinarianExt.CMFContactExt and (this.VeterinarianExt.Subtype == "PersonVendor" or this.VeterinarianExt.Subtype == "Ex_ForeignPersonVndr")){
        this.setContactByRole( "doctor",  this.VeterinarianExt) 
      } 
      if (this.VeterinarianExt.CMFContactExt and (this.VeterinarianExt.Subtype == "CompanyVendor" or this.VeterinarianExt.Subtype == "Ex_ForeignCoVendor")) {
        this.addRole( "hospital",  this.VeterinarianExt) 
      }
      if (this.VeterinarianExt.Subtype == "Doctor" or this.VeterinarianExt.Subtype == "Ex_ForeignPerVndrDoc"){
        this.doctor = (this.VeterinarianExt as Doctor)
      }
      if (this.VeterinarianExt.Subtype == "MedicalCareOrg" or this.VeterinarianExt.Subtype == "Ex_ForeignCoVenMedOrg") {
       this.addRole( "hospital",  this.VeterinarianExt)
      }      
    }
  }

  //Defect 6517 and 6667 - Doctor assigned Former Doctor when role changed to different party
  // 11/12/14 -Added code to remove doctor role when none selected
  function setFrmrVet (){
    if (this.Claim.State != "draft" and (this.OriginalVersion as FixedPropertyIncident).VeterinarianExt != this.VeterinarianExt) {
      for(claimcontact in (this.Claim.OriginalVersion as Claim).Contacts){
        if(claimcontact.Contact == (this.OriginalVersion as FixedPropertyIncident).VeterinarianExt) {
          for (contact in this.Claim.Contacts.where(\ c -> c == claimcontact )) {
          // Begin code for none selected
          for(role in claimcontact.Roles){
            if(role.Role == TC_DOCTOR or role.Role == TC_HOSPITAL){
              if (contact.Roles.contains(role))
                this.removeFromRoles(role)
            }
          }
          }
        if (claimcontact.Contact.Subtype == "Doctor" or claimcontact.Contact.Subtype == "Ex_ForeignPerVndrDoc") {
          this.Claim.addRole(ContactRole.TC_FORMERDOCTOR, claimcontact.Contact) 
        }

        if (claimcontact.Contact.Subtype == "MedicalCareOrg" or claimcontact.Contact.Subtype == "Ex_ForeignCoVenMedOrg") {
          this.Claim.addRole(ContactRole.TC_FORMERHOSPITAL, claimcontact.Contact)
        }
        }
      }
    }
  }
    //Defect 6517 and 6667 - Primary Trainer assigned Former Primary Trainer when role changed to different party
  function setFrmrTrainer (){
    if (this.Claim.State != "draft" and (this.OriginalVersion as FixedPropertyIncident).PrimaryTrainer != this.PrimaryTrainer)  {
      for(claimcontact in (this.Claim.OriginalVersion as Claim).Contacts){
        if(claimcontact.Contact == (this.OriginalVersion as FixedPropertyIncident).PrimaryTrainer){
          this.Claim.addRole(ContactRole.TC_FORMERPRIMARYTRAINER, claimcontact.Contact)  
        }
      }
    }
  }
  //Defect 6517 and 6667 - Alternate Trainer assigned Former Alternate Trainer when role changed to different party  
  function setFrmrAltTrainer (){
    if (this.Claim.State != "draft" and (this.OriginalVersion as FixedPropertyIncident).AlternateTrainer != this.AlternateTrainer)  {
      for(claimcontact in (this.Claim.OriginalVersion as Claim).Contacts){
        if(claimcontact.Contact == (this.OriginalVersion as FixedPropertyIncident).AlternateTrainer){
          this.Claim.addRole(ContactRole.TC_FORMERALTERNATETRAINER, claimcontact.Contact)  
        }
      }
    }
  }
}
