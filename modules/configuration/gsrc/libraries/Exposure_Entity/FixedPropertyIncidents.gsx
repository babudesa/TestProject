package libraries.Exposure_Entity

enhancement FixedPropertyIncidents : entity.Exposure {
  /*
   * 2/11/2008 - zthomas - Defect 789, Function loops through FixedPropertyIncidents and set the exposures FixedPropertyIncident 
   * to the appropriate FixedPropertyIncident.  Then loops though FixedPropertyIncidents and removes any that show up &quot;unknown&quot; 
   * and aren&apos;t associated with an exposure
   * 3/9/2009 - kmboyd - Removed the policy coverage area because most of it is being handled elsewhere or on the PCF itself.
   */
 
  function setFixedPropertyIncident(){  
    // 2/27/2008 - zthomas - Defect 789, added if check to only change the value of injured animal if there currently isn&apos;t an injured selected or the selected value is &quot;unknown&quot;.
    if(this.FixedPropertyIncident == null or this.FixedPropertyIncident.Property.LocationNumber == null){
    for(fixedProp in this.Claim.FixedPropertyIncidentsOnly){
      if((this.Coverage typeis PropertyCoverage) and ((this.Coverage as PropertyCoverage).RiskUnit typeis PropertyRU) and 
        ((this.Coverage as PropertyCoverage).RiskUnit as PropertyRU).Property.PublicID == fixedProp.Property.PublicID ){
        this.FixedPropertyIncident = fixedProp;
        break;
      }
       /*Due to new functionality in the feature screens and how they set up incidents, this is no longer needed
      if(this.Coverage typeis PolicyCoverage and fixedProp.Property.Location != null){
        this.FixedPropertyIncident = fixedProp;
        break;
        }*/
    }
  
    for(fixedProp in this.Claim.FixedPropertyIncidentsOnly){
      if(fixedProp.Property.LocationNumber == null and !fixedProp.UsedByExposure){
        this.Claim.removeFromIncidents( fixedProp )
      }
    }  
    }  
  }  
}
