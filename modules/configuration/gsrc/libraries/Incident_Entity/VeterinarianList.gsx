package libraries.Incident_Entity
uses java.util.ArrayList

enhancement VeterinarianList : entity.Incident {
  // def 855 by KSO on 02/20/2008
  // return a list of doctors and MCOs that are related to the Claim - potential veterinarians
  // Since the foreign versions are subtypes of Doctor and MCO, they will show on the list also
  function getVeterinarianList(): List{
    var vetList : List = new ArrayList();
  
    for(doc in this.Claim.RelatedDoctorArray)
    {
      if (doc.DoctorSpecialty == "veterinarian"){
        vetList.add(doc);
      }    
    }
    for(mco in this.Claim.RelatedMedicalCareOrgArray) 
    {
      if (mco.MedicalOrgSpecialty == "veterinarian"){
        vetList.add(mco);
      }    
    }
     
    return vetList;
  
  }
}
