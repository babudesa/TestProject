package util.exposures;
uses java.util.ArrayList;

class ExposureMenuItem
{
  private var _coverage : Coverage;
  private var _name : String;
  private var _children : List<ExposureMenuItem>
  private var _coverageSubType : CoverageSubtype;
  private var _locationBasedRU : LocationBasedRU;
  private var _coverages : Coverage[];
  private var _vehicleRU : VehicleRU;
  private var _engine : EngineExt;
  private var _trailer : TrailerExt;
  private var _locationBasedRUs : LocationBasedRU[];
  private var _vehicleRUs : VehicleRU[];
  
  construct()
  {
  }
  construct(nom : String, cvg : Coverage, cn : ExposureMenuItem[]){
    _name = nom;
    _coverage = cvg;
    _children = cn;
  }
  construct(nom : String, cn : ExposureMenuItem[]){
    _name = nom;
    _children = cn; 
  }
  construct(nom : String, cvg : Coverage, CST : CoverageSubtype){
    _name = nom;
    _coverage = cvg;
    _coverageSubType = CST;  
  }
  construct( nom : String, p : LocationBasedRU ){
    _name = nom;
    _locationBasedRU = p;  
    _coverages = _locationBasedRU.Coverages;
  }
  construct( nom : String, v : VehicleRU ){
    _name = nom;
    _vehicleRU = v;
    var covs : List<Coverage> = new ArrayList<Coverage>();
    for (cov in v.Coverages){
      if ((cov as VehicleCoverage).EngineExt == null and (cov as VehicleCoverage).TrailerExt == null){
        covs.add(cov);
      }
    }
    _coverages = covs.toArray() as Coverage[];
  }
  construct( nom : String, props : LocationBasedRU[]){
    _name = nom;
    _locationBasedRUs = props;
    var covs : List<Coverage> = new ArrayList<Coverage>();
    for(prop in _locationBasedRUs){
      for(cov in prop.Coverages){
        covs.add(cov);
      }
    }
    _coverages = covs.toArray() as Coverage[];
  }
  construct( nom : String, vehs : VehicleRU[]){
    _name = nom;
    _vehicleRUs = vehs;
    var covs : List<Coverage> = new ArrayList<Coverage>();
    for(veh in _vehicleRUs){
      for(cov in veh.Coverages){
        covs.add(cov);
      }
    }
    _coverages = covs.toArray() as Coverage[];
  }
  construct( nom : String, items : List<ExposureMenuItem>){
    _name = nom;
    _children = items as ExposureMenuItem[];
  }
  construct( nom : String, v : VehicleRU, e : EngineExt ){
    _name = nom;
    _engine = e;
    _vehicleRU = v;
    var covs : List<Coverage> = new ArrayList<Coverage>();
    for (cov in v.Coverages){
      if ((cov as VehicleCoverage).EngineExt == e){
        covs.add(cov);
      }
    }
    _coverages = covs.toArray() as Coverage[];
  }
  construct( nom : String, v : VehicleRU, t : TrailerExt ){
    _name = nom;
    _trailer = t;
    _vehicleRU = v;
    var covs : List<Coverage> = new ArrayList<Coverage>();
    for (cov in v.Coverages){
      if ((cov as VehicleCoverage).TrailerExt == t){
        covs.add(cov);
      }
    }
    _coverages = covs.toArray() as Coverage[];
  }
  
  construct( nom : String, c : Coverage[]){
    _name = nom;
    _coverages = c;  
  }
  function lazyLoadCoverage(c : Claim) : Coverage{
    for(cov in c.Policy.AllCoverages){
      if(cov == _coverage){
        return cov;
      }
    }
    return null;
  }
  function loadCoverageFromBundle( c : Claim) : Coverage{
    return lazyLoadCoverage(c);  
  }
  public property get Name() : String{
    return _name;
  }
  public property get Children() : List<ExposureMenuItem>{
    return _children;  
  }
  public property get CoverageType() : CoverageType{
    return _coverage.Type;
  }
  public property get CoverageSubType() : CoverageSubtype{
    return _coverageSubType;
  }
  public property get Coverage() : Coverage{
    return _coverage;
  }
  public property get PolicyProperty() : LocationBasedRU{
    return _locationBasedRU; 
  }
  public property get PolicyProperties() : LocationBasedRU[]{
    return _locationBasedRUs;
  }
  public property get PolicyVehicle() : VehicleRU{
    return _vehicleRU;
  }
  public property get PolicyVehicles() : VehicleRU[]{
    return _vehicleRUs;
  }
  public property get Coverages() : Coverage[]{
    return _coverages;  
  }
  public property get displayLabel() : String{
    if(_name != null){
      return _name;
    }
    else{
      return "Name Not Set";
    }
  }
  public property set displayLabel(value : String){
    _name = value;  
  }
}
