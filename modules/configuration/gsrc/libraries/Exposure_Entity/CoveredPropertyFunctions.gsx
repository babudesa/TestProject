package libraries.Exposure_Entity

enhancement CoveredPropertyFunctions : entity.Exposure {
  //Ensures that all the coverage fields are properly filled out
  //2/22/10 - sprzygocki - updated so that TOL nulls out each and every time. Sublimits and Exposure Details also null out now.
  //  Defect 2909
  function setNewCoverage(cov : Coverage, nullTOL : boolean){
    this.Coverage = cov;
    if(this.Coverage!=null and nullTOL){
      this.resetTypeofLoss()
      this.ExposureDetailsExt = null;
      this.SublimitsExt = null;
    }
    this.PreviousCoverageExt = cov
    this.PrimaryCoverage = cov.Type
    this.CoverageSubType = this.getPossibleCoverageSubtypes( cov.Type )[0]
    this.ReconnectFailExt = false
    this.createReconnectSuccessEvent( false )
  }

  /*Defect 1536 - Sets the exposure&apos;s incident to be an existing incident or just overwrites the property (depending on if an
  existing incident was found or not.
  kmboyd
  3/3/09
  */
  function setEquineIncident(prop : LocationBasedRU){
    var incFound = false;
    //Check all incidents to see if there are any matches on existing incidents. If there is one set the FixedPropertyIncident to
    //point to this existing incident
    for(incident in this.Claim.FixedPropertyIncidentsOnly){
      if(incident.Property == prop.Property){
        this.FixedPropertyIncident = incident
        incFound = true;
        break;
      }
    }
    //If no existing incidents are found, using the exposure&apos;s incident that it has temporarily created and just assign it a property
    if(!incFound){
      this.FixedPropertyIncident.Property = prop.Property
    }
  
    //Was a problem witn "Unknown"s appearing in the Injured Animal area, this will remove them when setting up a new incident.
    for(fixedProp in this.Claim.FixedPropertyIncidentsOnly){
        if(fixedProp.Property.LocationNumber == null and !fixedProp.UsedByExposure){
          this.Claim.removeFromIncidents( fixedProp )
        }
    }
  }

  /*Covered Property changes - kmboyd - 3/9/09
   * Created this function to return the property depending on the state of the feature. This will either get the property off of the incident or 
   * off of the coverage itself. If nothing is found it will return null
   */
  function returnProperty() : LocationBasedRU{
    var prop : LocationBasedRU = null
    if(this.FixedPropertyIncident.Property != null){
      for(locRU in this.Claim.Policy.Properties){
        if(locRU.Property == this.FixedPropertyIncident.Property){
          prop = locRU;
        }
      }
    }else{
      if(this.Coverage.Subtype == "PropertyCoverage"){
        prop = ((this.Coverage as PropertyCoverage).RiskUnit as LocationBasedRU);
      }else if(this.Coverage.Subtype == "PolicyCoverage"){
        //If there is existing features return the property off the first feature so that all properties are the same.
        if(this.Claim.Exposures.length > 1){
          for(locRU in this.Claim.Policy.Properties){
            if(locRU.Property == this.Claim.Exposures[0].FixedPropertyIncident.Property){
              prop = locRU;
            }
          }
        }
      }
    }
    return prop;
  }  
}
