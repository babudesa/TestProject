package libraries.Claim_Entity
uses java.util.ArrayList;

enhancement Driver : entity.Claim {
  //Updated 7/20/09 by sprzygocki
  //Added a check to make sure the insured is a person to prevent blanks in the dropdown (defect 1587)

  function getDrivers():List{
    var drivers = new ArrayList()
  
    for(contact in this.Contacts){
      if(exists(role in contact.Roles where ((role.Role=="coveredparty" and role.CoveredPartyType=="driver") || 
      (role.Role=="coveredparty" and role.CoveredPartyType=="activedriver") ||
      (role.Role=="coveredparty" and role.CoveredPartyType=="deleteddriver") ||
      (role.Role=="coveredparty" and role.CoveredPartyType=="excludeddriver") ||
      (role.Role=="insured" and contact.Contact.Subtype=="Person")))){ //|| 
      //(role.Role=="coveredparty" and role.CoveredPartyType=="vehicleoperator") ||
      //(role.Role=="AdditionalInterestRisk" and role.CoveredPartyType=="watercraftoprtr")))){
        drivers.add(contact.Person)
      }
    }
   
    return drivers
  }
}
