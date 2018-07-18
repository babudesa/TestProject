package libraries.Exposure_Entity
uses java.util.ArrayList
uses gw.api.util.Logger //Added for logging in Debug - SR

enhancement GetDisplayNames : entity.Exposure {
  //sprzygocki - 4/12/11 - updated to use Risk Units
  function getTrailerName() : String{
  var trailer:TrailerExt = ((this.Coverage as VehicleCoverage).RiskUnit as VehicleRU).Vehicle.TrailerExt
  var name:String = ""
  var names:List = new ArrayList()
  
  names.add( trailer.Year )
  names.add( trailer.Manufacturer )
  names.add( trailer.Model )
  
  for(n in names){
    //changed to logging in Debug - SR
    Logger.logDebug(n)
    if(n!=null){
      name = name + n.toString() + " "
    }
  }
  if(name=="" || name==null){
    name = "Unknown Trailer"
  }

  return name  
}

function getEngineNames() : List{
  var engineNames:List = new ArrayList()
  var name:String = "Unknown Engine(s)"
  var policyEngines = ((this.Coverage as VehicleCoverage).RiskUnit as VehicleRU).Vehicle.EnginesExt
  
  if(policyEngines.length>0){
    for(engine in policyEngines){
      if(engine.Manufacturer!=null){
        name = engine.Year + " " + engine.Manufacturer + " " + engine.Model
      } else {
        name = engine.Year + " " + engine.Model
      }
      engineNames.add( name )
    }
  }
  engineNames.add( "Unknown Engine(s)" )

  return engineNames
}

function getEngineName() : String{
  var cov : VehicleCoverage = this.Coverage as VehicleCoverage
  var engine : EngineExt = cov.EngineExt
  var name : String = "Unknown Engine"
  if(engine.Manufacturer!=null){
    name = engine.Year + " " + engine.Manufacturer + " " + engine.Model
  } else {
    name = engine.Year + " " + engine.Model
  }
  return name
}
}
