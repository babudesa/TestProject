package libraries.Exposure_Entity
uses java.util.ArrayList

enhancement Drivers : entity.Exposure {
  function getDrivers():List{
    var drivers:List = new ArrayList()
  
    for(contact in this.Claim.Contacts) {
      //6/30/08 erawe - removed role of insured from the driver dropdown list on the feature
      //7/30/10 erawe - per request added role of insured back in to list, also
      //morenameedinsured, additionalinsured if a Person (we do that with the add(contact.Person)
      //*8/2/10 But need to test addins and morenameind where they are company
      if(exists(role in contact.Roles where (role.Role=="insured" and contact.Contact typeis Person and role.Role=="driver") ||
         (role.Role== "driver" ) ||
         (role.Role=="coveredparty" and role.CoveredPartyType=="addnlinsured" and contact.Contact typeis Person and role.Role=="driver") ||
         (role.Role=="coveredparty" and role.CoveredPartyType=="addnlnameinsured" and contact.Contact typeis Person and role.Role=="driver") ||
         (role.Role=="coveredparty" and role.CoveredPartyType=="driver") || 
         (role.Role=="coveredparty" and role.CoveredPartyType=="activedriver"))){ //||
         //(role.Role=="coveredparty" and role.CoveredPartyType=="deleteddriver") ||
         //(role.Role=="coveredparty" and role.CoveredPartyType=="excludeddriver"))){ 
       
        drivers.add( contact.Person )
        }
      }
   return drivers
  }


  /* 7/1/10 erawe - created this function to clear the driver type field if the driver field is blank
  */
  function clearDriverType() {
    if(this.DriverExt==null)
      this.DriverTypeExt=null
  }

  // 7/28/10 erawe - used to warn user that they have selected an Excluded Driver
  function displayDriverWarning(){
    var displayWarning: boolean=false
    var message = "You have selected an Excluded Driver"
    for(contact in this.Claim.Contacts){
      if(this.DriverExt==contact.Contact and
      exists(role in contact.Roles where role.Role=="coveredparty" and
      role.CoveredPartyType=="excludeddriver")){
        displayWarning=true;
      }
    }
    if(displayWarning){
      //throw new gw.api.util.DisplayableException("You have selected an Excluded Driver");
      pcf.GeneralErrorWorksheet.goInWorkspace(message)
    }
  
  }

  /* 2/3/11 erawe - used on the DriverExt field to determine it&apos;s role.  If a coveredpartytype driver
  then do not create an email, note, etc...If anyone else in the dropdown list we should be creating
  an eamil for unlisted driver, a note, etc..Used in Exposure Pre-Update for New Driver Added rule.
  */
  function contactHasDriverRole() : Boolean{
    if(exists(role in this.Claim.getClaimContact( this.DriverExt ).Roles where
         (role.Role=="coveredparty" and role.CoveredPartyType=="activedriver") ||
         (role.Role=="coveredparty" and role.CoveredPartyType=="deleteddriver") ||
         (role.Role=="coveredparty" and role.CoveredPartyType=="excludeddriver"))){ 
          return true;
    }else{
      return false;
    }
  }
}
