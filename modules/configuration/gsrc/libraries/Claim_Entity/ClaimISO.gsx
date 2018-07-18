package libraries.Claim_Entity

enhancement ClaimISO : entity.Claim {
  function checkISORequiredFields(claim:Claim)
  {
    var sent = false
    //check ISO required claim level fields for changes
    if(claim.Policy.Changed || 
       (claim.getOriginalValue( "LOBCode" ) != claim.LOBCode )||
       (claim.getOriginalValue( "claimNumber" ) != claim.ClaimNumber) ||
       (claim.getOriginalValue( "LossDate" ) !=   claim.LossDate) ||
       claim.LossLocation.Changed ||
       (claim.getOriginalValue( "Description" ) !=  claim.Description) ||
       (claim.getOriginalValue( "LossCause" ) !=  claim.LossCause))
      {
         claim.reSendToISO( claim )
         sent = true 
      } 
    //check ISO required contact information for changes
    for(party in claim.Contacts)
    {
       if((party.getOriginalValue( "DisplayName" ) != party.DisplayName) ||
           party.Contact.PrimaryAddress.Changed || 
           party.isArrayElementChanged("Roles"))
       {
         if(sent == false)
         {
           claim.reSendToISO( claim )
           sent = true  
         }
       }   
    }
    //check ISO required feature level fields for changes
    for (exp in claim.Exposures)
    {
       if((exp.getOriginalValue( "CoverageSubType" ) != exp.CoverageSubType) ||
            (exp.VehicleIncident.Vehicle.getOriginalValue( "Vin" ) != exp.VehicleIncident.Vehicle.Vin) ||
            (exp.VehicleIncident.Vehicle.getOriginalValue( "Year" ) != exp.VehicleIncident.Vehicle.Year) ||
            (exp.Coverage.getOriginalValue( "IncidentLimit" ) != exp.Coverage.IncidentLimit) ||
            (exp.VehicleIncident.Vehicle.getOriginalValue( "Make" ) != exp.VehicleIncident.Vehicle.Make) )
           {
             if(sent == false)
             {
               claim.reSendToISO( claim )
               sent = true  
             }
           }
       if (exp.VehicleIncident.Vehicle.Style == "boat" && 
          (exp.VehicleIncident.Vehicle.getOriginalValue( "SerialNumber" ) != exp.VehicleIncident.Vehicle.SerialNumber))
           {
             if(sent == false)
             {
               claim.reSendToISO( claim )
               sent = true  
             }
           }      
    }
  
  }

  function reSendToISO(claim:Claim)
  {
    for (exp in claim.Exposures)
    {
      if (exp.Closed == false)
      {  
          gw.api.exposure.ExposureUtil.sendToISO(exp)
      }
    }
  }
  
  // Defect#7478 checks if the claim is of ELD, PLD, Spec E&S or ENV type
  property get ShouldSendOriginalLossDate() : boolean{
    var lossTypesWhichUseClaimsMade = {LossType.TC_EXECLIABDIV, 
                                       LossType.TC_PROFLIABDIV, 
                                       LossType.TC_SPECIALTYES,
                                       LossType.TC_ENVLIAB,
                                       LossType.TC_SPECIALHUMSERV}
    return lossTypesWhichUseClaimsMade.contains(this.LossType)                                       
  }
  
  // Defect 9219 - Missimg CMS Required Field Activity
  // Moving to see if the activity will create an EDW ActivityAdded message from this location when created.
  function createCMSErrorActivity(claimant: Contact){
  try{
    var ap = util.custom_Ext.finders.findActivityPattern("missing_cms_field")
    if (this.Activities.where(\a -> a.ActivityPattern.equals(ap) && a.Claimant == claimant && a.Status == "open").IsEmpty){
      var activity = this.createActivityFromPattern(null, ap)
      //Add the claimant name to the Activity Description
      if (claimant != null){
        activity.Claimant = claimant
        activity.Description = displaykey.Rules.Activities.ISO.CMS.MissingCMSField(claimant)
      }
      // add event for EDW Push
      activity.addEvent("ActivityAdded")
    }
  }catch(e){
       gw.api.util.Logger.logInfo( "An error occurred ClaimISO createCMSErrorActivity")
    }
  }
}
