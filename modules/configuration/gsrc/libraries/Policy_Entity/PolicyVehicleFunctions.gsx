package libraries.Policy_Entity
uses java.util.ArrayList
//uses java.util.Iterator

enhancement PolicyVehicleFunctions : entity.Policy {
  function getAutomobiles() : List 
  {
    var resultList : List = new ArrayList() ;
    for (policyvehicle in this.Vehicles)
    {
      if (policyvehicle.Vehicle.Style!="boat"
          and policyvehicle.Vehicle.Style!="boatengine" 
          and policyvehicle.Vehicle.Style!="boattrailer") 
      {
         resultList.add(policyvehicle) ;
      }
    }
    return resultList ;
  }
 
  function getWatercraft() : List 
  {
    var resultList : List = new ArrayList() ;
    for (policyvehicle in this.Vehicles)
    {
      if (policyvehicle.Vehicle.Style=="boat"
          or policyvehicle.Vehicle.Style=="boatengine" 
          or policyvehicle.Vehicle.Style=="boattrailer") 
      {
         resultList.add(policyvehicle) ;
      }
    }
    return resultList ;
  }

  /* This function takes a list of contact roles and checks all the claim contacts
  /  and if a person is found to have that role, that claimcontactrole is added
  /  to the array.  This is was designed for ClaimDriversLV
  */
  function getClaimContactRolesByRoles(roles : ContactRole[] ) : ClaimContactRole[]{
    var driverName : String = ""
    var ContactRoleList : List = new ArrayList();
    //for(role in roles){
      for(contact in this.Claim.Contacts){
        for(cRole in contact.Roles){
         //if(cRole.Role == role){
           /*sprint 11 agri ER below: I added this so only to show a person with the 
           role of driver in the driversLV for NCW and policy&gt;drivers and operators
           12/8/09 erawe: defect 2644 This is where we display the contacts on the
           Drivers and Operators screen.  Do we show watercraft or not???
           //6/8/10 erawe - driver was the role used prior to changes for Agri 1/CA branch defect changes(below). 
           Now activedriver, excludeddriver, delelteddriver
         
           */
           if(cRole.Owner == cRole.Policy.PolicyNumber && (cRole.CoveredPartyType == "activedriver" || cRole.CoveredPartyType == "excludeddriver" || cRole.CoveredPartyType =="deleteddriver")){
           //if(cRole.Owner == cRole.Policy.PolicyNumber &amp;&amp; (cRole.CoveredPartyType == "driver" || cRole.CoveredPartyType == "vehicleoperator" || cRole.CoveredPartyType =="watercraftoprtr")){
             //if(cRole.Role == "driver" and cRole.Policy.Claim.Exposures.DriverExt !=null) {
              //if(cRole.ClaimContact.Contact.PublicID != driverName) {
                //driverName = cRole.ClaimContact.Contact.PublicID
                ContactRoleList.add( cRole )
                break
              }
            //}
          }
        //}
      //}
    }
    return ContactRoleList as entity.ClaimContactRole[];
  }
}
