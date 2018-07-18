package libraries.Incident_Entity

enhancement IncdVeterinarian : entity.Incident {
  // def 855 by KSO on 02/21/2008
  // accept a contact and assign it the appropriate role

  //def 1886 by blawless on 6/19/2009
  // add role of doctor or hospital for PersonVendor or CompanyVendor if they are from CMF load and set as Vet

  //def 1886 by blawless on 6/22/2009 
  // change 2: foreign versions should model domestic and all doctor and MCOs can now be vet even without vet specialty

//  Function moved to FixedPropertyIncident_Entity enhancement
//  function setIncdVeterinarian (vetcontact : Contact){
//    if (vetcontact != null)  {
//      if (vetcontact.CMFContactExt and (vetcontact.Subtype == "PersonVendor" or vetcontact.Subtype == "Ex_ForeignPersonVndr")){
//        this.addRole( "doctor",  vetcontact) 
//      } 
//      if (vetcontact.CMFContactExt and (vetcontact.Subtype == "CompanyVendor" or vetcontact.Subtype == "Ex_ForeignCoVendor")) {
//        this.addRole( "hospital",  vetcontact) 
//      }
//      if (vetcontact.Subtype == "Doctor" or vetcontact.Subtype == "Ex_ForeignPerVndrDoc"){
//        if(this typeis FixedPropertyIncident){
//          this.doctor = (this.VeterinarianExt as Doctor)
//        } 
//      }
//      if (vetcontact.Subtype == "MedicalCareOrg" or vetcontact.Subtype == "Ex_ForeignCoVenMedOrg") {
//       this.addRole( "hospital",  vetcontact)
//      }      
//    }
//  }

  //defect 4126 erawe 5/26/11
  //Travis N. found in guidwire 6.0 documentation where AddRole will have issues if the contactrole is exclusive, as is
  //the case for &apos;doctor&apos;.  Instead use setContactByRole(). 
  function setIncdVeterinarian (vetcontact : Contact) {
    if (vetcontact != null)  {
      if (vetcontact.Subtype == "Doctor" || (vetcontact.CMFContactExt
      && (vetcontact.Subtype == "PersonVendor"
      || vetcontact.Subtype == "Ex_ForeignPersonVndr"))) {
        this.setContactByRole( "doctor", vetcontact ) 
      } else {
        if (vetcontact.Subtype == "MedicalCareOrg" || (vetcontact.CMFContactExt
        && (vetcontact.Subtype == "CompanyVendor" or vetcontact.Subtype == "Ex_ForeignCoVendor"))) {
          this.addRole( "hospital",  vetcontact) 
        } else {
          if (vetcontact.Subtype == "Ex_ForeignPerVndrDoc") {
            this.setContactByRole( "doctor", vetcontact ) 
          } else {
            if (vetcontact.Subtype == "Ex_ForeignCoVenMedOrg") {
              this.addRole( "hospital",  vetcontact) 
            }
          }
        }
      }
    }
  }
}
