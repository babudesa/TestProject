package libraries.Exposure_Entity
uses java.util.Collections
uses java.util.ArrayList
uses java.util.LinkedHashSet
uses java.util.Set
uses java.util.TreeSet
uses java.util.Comparator


enhancement SwitchRiskFunctions : entity.Exposure {
  
  function getRiskPublicID(covT : CoverageType) : String {
    var ID = ""
    if(covT.hasCategory( RiskType.TC_VEHICLE )){
      ID = ((this.Coverage as VehicleCoverage).RiskUnit as VehicleRU).Vehicle.PublicID
    }
    if(covT.hasCategory( RiskType.TC_PROPERTY )){
      ID = ((this.Coverage as PropertyCoverage).RiskUnit as PropertyRU).Property.PublicID
    }
    if(covT.hasCategory( RiskType.TC_ENGINE )){
      ID = (this.Coverage as VehicleCoverage).EngineExt.PublicID
    }
    if(covT.hasCategory( RiskType.TC_TRAILER )){
      ID = (this.Coverage as VehicleCoverage).TrailerExt.PublicID
    }
    return ID
  }

  //POLICY COVERAGES*****************************************************************************
  function getAssignableCoverages() : List<Coverage> {
    
    var noDuplicates : Set<Coverage> = new TreeSet<Coverage>(new Comparator<Coverage>() {  
      public override function compare(o1 : Coverage, o2 : Coverage) : int {
        return o1.toString().compareTo(o2.toString())
      }
    })
    
    //Commercial Auto should ONLY display policy-level coverages
    if (util.CommAutoHelper.isCommAutoLossType(this.Claim)){
      noDuplicates.addAll(this.Claim.Policy.AllCoverages.where(\ c -> c.Type.hasCategory( RiskType.TC_POLICY )) as java.util.Collection<entity.Coverage>)
    } else {
      noDuplicates.addAll(this.Claim.Policy.AllCoverages as java.util.Collection<entity.Coverage>)
    }
      
    var assignableCoverages : List<Coverage> = noDuplicates.toList()
    
    Collections.sort(assignableCoverages)
    
    
    return assignableCoverages
  }
  

  function getPolicyCvgOptionLabel(cov : Coverage) : String {
    var title = ""
    // Comm Auto - Adding more detail to the coverage display key.
    if (util.CommAutoHelper.isCommAutoLossType(cov.Policy.Claim)){
        return cov.commAutoCoverageDescription()
    } else {
      if(cov.Type.hasCategory( RiskType.TC_POLICY )){
       title = cov.covTypeDisplayName()
      } else {
        if(this.ReconnectFailExt){
          if(cov.Subtype=="VehicleCoverage"){
            title = cov.covTypeDisplayName() + " (" + ((cov as VehicleCoverage).RiskUnit as VehicleRU).Vehicle + ")"
          } else {
            title = cov.covTypeDisplayName() + " (" + ((cov as PropertyCoverage).RiskUnit as PropertyRU).Property + ")"
          }
        } else {
          title = cov.covTypeDisplayName()
        }
      }
    }
    return title
  }

  //VEHICLES/WATERCRAFTS*****************************************************************************
  function getAssignableVehicles() : List<Vehicle> {
    
    var noDuplicates : Set<Vehicle> = new TreeSet<Vehicle>(new Comparator<Vehicle>() {  
      public override function compare(o1 : Vehicle, o2 : Vehicle) : int {
        return o1.toString().compareTo(o2.toString())
      }
    })
    
    noDuplicates.addAll(this.Claim.Policy.Vehicles*.Vehicle as java.util.Collection<entity.Vehicle>)
      
    var assignableVehicles : List<Vehicle> = noDuplicates.toList()
    
    Collections.sort(assignableVehicles)
    
    return assignableVehicles
  }
  
  
  function getAssignableVehicleCoverages(veh : Vehicle) : List<Coverage> {
    print("getAssignableVehicleCoverages()")
    
    var cvgs = new ArrayList<Coverage>()

    if (!util.CommAutoHelper.isCommAutoLossType(this.Claim)) {
      this.Claim.Policy.Coverages.where(\ c -> c.isAssignablePolicyCoverage(false, this.ExposureType))
    }

    var vehRU : VehicleRU
    
    if (veh!=null) {
      vehRU = veh.AssociatedPolicyInternal.Vehicles.firstWhere(\ vRU -> vRU.Vehicle == veh)
    }
      
    if (vehRU.Coverages.HasElements) {
      cvgs.addAll(vehRU.Coverages.where(\ c -> c.isAssignableRUCoverage(false, this.ExposureType)) as java.util.Collection<entity.Coverage>)
    }
    
    return cvgs
  }

  function getVehicleCvgOptionLabel(cov : Coverage) : String {
    var title=""
    // Comm Auto - Adding more detail to the coverage display key.
    if (cov.Policy.Claim.LossType == LossType.TC_ALTMARKETSAUTO || cov.Policy.Claim.LossType == LossType.TC_SHSAUTO || 
        cov.Policy.Claim.LossType == LossType.TC_TRUCKINGAUTO){
      return cov.commAutoCoverageDescription()
    }
    if(cov.Type.hasCategory( RiskType.TC_POLICY )){
      title = cov.covTypeDisplayName()
    } else {
      if(this.ReconnectFailExt){
        title = cov.covTypeDisplayName() + " (" + ((cov as VehicleCoverage).RiskUnit as VehicleRU).Vehicle + ")"
      } else {
        title = cov.covTypeDisplayName()
      }
    }
    return title
  }
  
  //ENGINES*****************************************************************************
  function getAssignableEngines() : List<EngineExt> {
    var engs : List<EngineExt> = new ArrayList<EngineExt>()
      for(veh in this.Claim.Policy.Vehicles){
        for(cov in veh.Coverages){
          for(subtype in CoverageSubtype.getTypeKeys(false)){
            if((cov as VehicleCoverage).EngineExt!=null and this.ExposureType.hasCategory( subtype ) and subtype.hasCategory( cov.Type ) && cov.Retired==false){
              engs.add((cov as VehicleCoverage).EngineExt)
            }
          }
        }
      }
      
    Collections.sort(engs)
    removeDuplicates(engs)
    
    return engs
  }

  function getAssignableEngineCoverages(eng : EngineExt) : List<Coverage> {
    var cvgs : List<Coverage> = new ArrayList<Coverage>()
    var vehRU : VehicleRU
    for(cov in this.Claim.Policy.Coverages){
      for(subtype in CoverageSubtype.getTypeKeys(false)){
        if(this.ExposureType.hasCategory( subtype ) and subtype.hasCategory( cov.Type ) && cov.Retired==false){
          cvgs.add(cov)
        }
      }
    }
    if(eng!=null){
      for(vehicle in eng.Vehicle.AssociatedPolicyInternal.Vehicles){
        if(vehicle.Vehicle == eng.Vehicle){
          vehRU = vehicle
        }
      }
      if(vehRU.Coverages.length > 0){
        for(cov in vehRU.Coverages){
          for(subtype in CoverageSubtype.getTypeKeys(false)){
            if((cov as VehicleCoverage).EngineExt!=null and (cov as VehicleCoverage).EngineExt==eng and
               this.ExposureType.hasCategory( subtype ) and subtype.hasCategory( cov.Type )){
              cvgs.add(cov)
            }
          }
        }
      }
    }
    return cvgs
  }

  function getEngineOptionLabel(eng : EngineExt) : String{
    var title = ""
    title = title + eng.Vehicle
    if(eng.Vehicle.SerialNumber!=null){
      title = title + " (SN: " + eng.Vehicle.SerialNumber + ")"
    } else {
      title = title + " (No SN Provided)"
    }
    title = title + " - " + eng
    return title
  }

  function getEngineCvgOptionLabel(cov : Coverage) : String {
    var title=""
    if(cov.Type.hasCategory( RiskType.TC_POLICY )){
      title = cov.covTypeDisplayName()
    } else {
      if(this.ReconnectFailExt){
        title = cov.covTypeDisplayName() + " (" + ((cov as VehicleCoverage).RiskUnit as VehicleRU).Vehicle + ")"
      } else {
        title = cov.covTypeDisplayName()
      }
    }
    return title
  }
  
  //TRAILERS*****************************************************************************
  function getAssignableTrailers() : List<TrailerExt> {
    var trailers : List<TrailerExt> = new ArrayList<TrailerExt>()
      for(veh in this.Claim.Policy.Vehicles){
        for(cov in veh.Coverages){
          for(subtype in CoverageSubtype.getTypeKeys(false)){
            if((cov as VehicleCoverage).TrailerExt!=null and this.ExposureType.hasCategory( subtype ) and subtype.hasCategory( cov.Type ) && cov.Retired==false){
              trailers.add((cov as VehicleCoverage).TrailerExt)
            }
          }
        }
      }
    
    Collections.sort(trailers)
    removeDuplicates(trailers)
    
    return trailers
  }

  function getAssignableTrailerCoverages(trailer : TrailerExt) : List {
    var cvgs : List = new ArrayList()
    var veh : Vehicle
    var vehRU : VehicleRU
    for(v in this.Claim.Policy.Vehicles){
      if(v.Vehicle.TrailerExt!=null and v.Vehicle.TrailerExt==trailer){
        veh = v.Vehicle
        vehRU = v
      }
    }
    for(cov in this.Claim.Policy.Coverages){
      for(subtype in CoverageSubtype.getTypeKeys(false)){
        if(this.ExposureType.hasCategory( subtype ) and subtype.hasCategory( cov.Type ) && cov.Retired==false){
          cvgs.add(cov)
        }
      }
    }
    if(trailer!=null and vehRU.Coverages.length > 0){
      for(cov in vehRU.Coverages){
        for(subtype in CoverageSubtype.getTypeKeys(false)){
          if((cov as VehicleCoverage).TrailerExt!=null and (cov as VehicleCoverage).TrailerExt==trailer and
             this.ExposureType.hasCategory( subtype ) and subtype.hasCategory( cov.Type )){
            cvgs.add(cov)
          }
        }
      }
    }
    
    return cvgs
  }

  function getTrailerOptionLabel(trailer : TrailerExt) : String{
    var title = ""
    var veh : Vehicle
    for(v in this.Claim.Policy.Vehicles){
      if(v.Vehicle.TrailerExt!=null and v.Vehicle.TrailerExt==trailer){
        veh = v.Vehicle
      }
    }
    
    title = title + veh
    if(veh.SerialNumber!=null){
      title = title + " (SN: " + veh.SerialNumber + ")"
    } else {
      title = title + " (No SN Provided)"
    }
    title = title  + " - " + trailer
    return title
  }

  function getTrailerCvgOptionLabel(cov : Coverage) : String {
    var title=""
    if(cov.Type.hasCategory( RiskType.TC_POLICY )){
      title = cov.covTypeDisplayName()
    } else {
      if(this.ReconnectFailExt){
        title = cov.covTypeDisplayName() + " (" + ((cov as VehicleCoverage).RiskUnit as VehicleRU).Vehicle  + ")"
      } else {
        title = cov.covTypeDisplayName()
      }
    }
    return title
  }
  
  //PROPERTIES*****************************************************************************
  function getAssignableProperties() : List<PolicyLocation> {
    var props : List<PolicyLocation> = new ArrayList<PolicyLocation>()
    for(prop in this.Claim.Policy.Properties){
      for(cov in prop.Coverages){
        for(subtype in CoverageSubtype.getTypeKeys(false)){
         // dnmiller - added Aug. 2014 for Builder's Risk Coverages - jobsites instead of properties
          if(prop typeis JobsiteRUExt){
            if(this.ExposureType.hasCategory( subtype ) and subtype.hasCategory( cov.Type ) and !exists(p in props where p==((cov as PropertyCoverage).RiskUnit as JobsiteRUExt).Property && cov.Retired==false)){
              props.add(((cov as PropertyCoverage).RiskUnit as JobsiteRUExt).Property)
            }
          }else if(this.ExposureType.hasCategory( subtype ) and subtype.hasCategory( cov.Type ) and !exists(p in props where p==((cov as PropertyCoverage).RiskUnit as PropertyRU).Property && cov.Retired==false)){
            props.add(((cov as PropertyCoverage).RiskUnit as PropertyRU).Property)
          }
        }
      }
    }
    
    Collections.sort(props)
    removeDuplicates(props)
    
    return props
  }

  function getAssignablePropertyCoverages(prop : PolicyLocation) : List {
    var cvgs : List = new ArrayList()
    var propRU : PropertyRU
    var jobRU : JobsiteRUExt
    for(cov in this.Claim.Policy.Coverages){
      for(subtype in CoverageSubtype.getTypeKeys(false)){
        if(this.ExposureType.hasCategory( subtype ) and subtype.hasCategory( cov.Type ) && cov.Retired==false){
          cvgs.add(cov)
        }
      }
    }
    if(prop!=null){
      for(propty in prop.Policy.Properties){
        if(propty.Property==prop){
          if (propty typeis JobsiteRUExt){
            jobRU = propty
          }
          else{
          propRU = propty as PropertyRU
        }
      }
      }
      if(propRU != null && propRU.Coverages.length>0){
        for(cov in propRU.Coverages){
          for(subtype in CoverageSubtype.getTypeKeys(false)){
            if(this.ExposureType.hasCategory( subtype ) and subtype.hasCategory( cov.Type )){
              cvgs.add(cov)
            }
          }
        }
      }
      if (jobRU != null && jobRU.Coverages.length>0){
        for(cov in jobRU.Coverages){
          for (subtype in CoverageSubtype.getTypeKeys (false)){
            if(this.ExposureType.hasCategory( subtype) and subtype.hasCategory( cov.Type)){
              cvgs.add(cov)
            }
          }
        }
      }
    }
    return cvgs
  }

  function getPropOptionLabel(propty : PolicyLocation) : String {
    var title : String = ""
    var prop : PropertyRU
    var jobsite : JobsiteRUExt
    for(prpty in this.Claim.Policy.Properties){
      if(prpty.Property==propty){
        if (prpty typeis JobsiteRUExt){
          jobsite = prpty
        }
        else{
        prop = prpty as PropertyRU
      }
    }

    }
    if(this.Claim.LossType==TC_AGRIPROPERTY){
      title = title + "Location " + prop.PropertyNumberExt
      title = title + (prop.Property.Address==null ? " (No Address Found) - " : " (" + prop.Property.Address + ") - ")
      if(prop.Property.RiskTypeExt!=TC_FRMLOC){
        title = title + prop.Property.RiskTypeExt.DisplayName + " - " + (prop.Property.BuildingNumberExt==null ? "No Risk Number Provided" : prop.Property.BuildingNumberExt)
      } else {
        title = title + prop.Property.RiskTypeExt.DisplayName
      }
      title = title + (prop.Property.LocationNumber==null ? "" : " (" + prop.Property.LocationNumber + ")")
    } else 
    if(this.Claim.LossType==TC_EQUINE){
      title = title + (prop.Property.LocationNumber == null ? "No Desc. Found " : (prop.Property.LocationNumber + " "))
    } else
    if(this.Claim.LossType==TC_PIMINMARINE){
      //dnmiller - added Aug 2014 for Builder's Risk Coverages, adding jobsites option.
      if (jobsite != null){
        title = title + "Jobsite " + jobsite.JobsiteNumberExt
        title = title + (jobsite.Property.Address==null ? " (No Address Found) - " : " (" + jobsite.Property.Address + ") - ")
        title = title + jobsite.Property.RiskTypeExt.DisplayName + " - "
        title = title + ((jobsite.Property.RiskNumberExt==null || jobsite.Property.RiskNumberExt.toString()=="") ? "No Risk Number Provided" : jobsite.Property.RiskNumberExt.toString())
      } else{
      title = title + "Premises " + prop.PropertyNumberExt
      if(prop.Property.RiskTypeExt!=TC_PRM){
        title = title + (prop.Property.BuildingNumberExt==null ? "No Building Number Provided" : " - Building " + prop.Property.BuildingNumberExt)
        title = title + (prop.Property.Address==null ? " (No Address Found) - " : " (" + prop.Property.Address + ") - ")
        title = title + prop.Property.RiskTypeExt.DisplayName + " - " 
        title = title + ((prop.Property.RiskNumberExt==null || prop.Property.RiskNumberExt.toString()=="") ? "No Risk Number Provided" : prop.Property.RiskNumberExt.toString())
      } else {
        title = title + prop.Property.RiskTypeExt.DisplayName
        title = title + (prop.Property.Address==null ? " (No Address Found) - " : " (" + prop.Property.Address + ")")       
      }
      title = title + (prop.Property.LocationNumber==null ? "" : " (" + prop.Property.LocationNumber + ")")
    }
    }
    return title
  }

  function getPropertyCvgOptionLabel(cov : Coverage) : String {
    var title=""
    if(cov.Type.hasCategory( RiskType.TC_POLICY )){
      title = cov.covTypeDisplayName()
    } else {
      if(this.ReconnectFailExt){
        title = cov.covTypeDisplayName() + " (" + ((cov as PropertyCoverage).RiskUnit as PropertyRU).Property + ")"
      } else {
        title = cov.covTypeDisplayName()
      }
    }
    return title
  }
  
  
  function removeDuplicates(listWithDupes : List){
    var iter = listWithDupes.iterator()
    
    while(iter.hasNext()){
      var item = iter.next()
      if(listWithDupes.countWhere(\ o -> o.toString().equals(item.toString())) > 1){
        iter.remove() 
      }
    } 
  }
  
  function filterPolicyCoverages(cov:Coverage):Boolean{
    if (this.getPossibleCoverageSubtypes( cov.Type).HasElements){
      return true
    }
    return false
  }
  

    
}
