package util.exposures;
uses java.util.ArrayList;
uses java.lang.StringBuilder;
uses java.util.SortedMap;
uses java.util.TreeMap;

class ExposureMenuUtilsAGRILIABILITY
{
  construct()
  {
  }
  
  /************************************************************************************************************
  *  @method buildVehicleMenu
  *  @param featureMenu    The currently built feature menu that vehicles will be added to
  *         c              The claim this feature menu belongs to
  *  @returns              The feature menu with added on vehicles
  */
  public static function buildAgriLiabilityMenu(featureMenu : List, c : Claim) : List {
    if(c.Policy.Vehicles.length>0){
      featureMenu = buildWatercraftMenu( featureMenu, c );
    }
    
    return featureMenu;
  }
 
  public static function buildWatercraftMenu(featureMenu : List, c : Claim) : List {
    var risksMenu : List = new ArrayList();
    var engMenu : SortedMap = new TreeMap(new util.custom_Ext.AlphanumericSorting());
    var watercraftMenu : SortedMap = new TreeMap(new util.custom_Ext.AlphanumericSorting());
    
    for(item in c.Policy.Vehicles){
      if (item typeis VehicleRU && item.Coverages.length > 0) {
        var boatDesc = item.DisplayName + (item.Vehicle.SerialNumber == null ? " (No SN Provided)" : " (SN: " + item.Vehicle.SerialNumber + ")");
        if(exists(cov in item.Coverages where (cov as VehicleCoverage).EngineExt==null && (cov as VehicleCoverage).TrailerExt==null)) {
          risksMenu.add( new ExposureMenuItem( boatDesc.toString() == "" ? "No Details: Watercraft" : boatDesc.toString(), item) );
        }
        if(item.Vehicle.EnginesExt.length > 0){
          for(eng in item.Vehicle.EnginesExt){
            if(exists(cov in item.Coverages where (cov as VehicleCoverage).EngineExt == eng)){
              engMenu.put( eng.DisplayName, new ExposureMenuItem(eng.DisplayName, item, eng));
            }
          }
        }
        risksMenu.addAll( engMenu.Values );
        if (item.Vehicle.TrailerExt != null){
          if (exists(cov in item.Coverages where (cov as VehicleCoverage).TrailerExt == item.Vehicle.TrailerExt)){
            risksMenu.add( new ExposureMenuItem(item.Vehicle.TrailerExt.DisplayName, item, item.Vehicle.TrailerExt));
          }
        }
        if(risksMenu.length > 0){
          watercraftMenu.put( boatDesc.toString() == "" ? "No Details: Watercraft" : boatDesc.toString(), new ExposureMenuItem(boatDesc.toString() == "" ? "No Details: Watercraft" : boatDesc.toString(), (risksMenu as ExposureMenuItem[])));
        }
        engMenu.clear();
        risksMenu.clear();
      }
    }

    featureMenu.addAll( watercraftMenu.Values );

    return featureMenu
  }
  
  /************************************************************************************************************
  *  @method createVehicleGroups
  *  @param menuList The list of vehicles to be put into groups
  *  @returns a new list where the vehicles are grouped
  */
  public static function createVehicleGroups(featureMenu : List) : List<ExposureMenuItem> {
    var newMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var risksMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var counter = 0;
    var maxGroupSize = ScriptParameters.FeatureMenu_MaxGroupSize;
    
    for(menuItem in featureMenu as ExposureMenuItem[]){
      for(item in menuItem.Children){
        if(item.PolicyVehicle!=null and !exists(expMenuItem in risksMenu where expMenuItem==menuItem)){
          risksMenu.add(menuItem);
          counter = counter + 1;
          if((counter % maxGroupSize) == 0){
            newMenu.add( new ExposureMenuItem("Watercraft " + (counter - maxGroupSize + 1) + " to " + counter, risksMenu));
            risksMenu.clear();  
          }
        }
      }
    }
    if(risksMenu.length > 0){
      newMenu.add( new ExposureMenuItem("Watercraft " + (counter - risksMenu.length + 1) + " to " + counter, risksMenu));
      risksMenu.clear();    
    }
    
    return newMenu;
  }
  
  /************************************************************************************************************
  *  @method getTitleAgriLiability
  *  @param cov     Coverage the title will go off of
  *         veh     Vehicle we're building the title off of if one exists (Watercraft)
  *  @returns a new list where the equipment are grouped
  */
  public static function getTitleAgriLiability(cov : Coverage, veh : VehicleRU) : String {
    var title : StringBuilder = new StringBuilder(veh.DisplayName);
    //Engine
    if((cov as VehicleCoverage).EngineExt!=null){
      var eng = (cov as VehicleCoverage).EngineExt;
      title.append(" - " + eng);
    }
    //Trailer
    if((cov as VehicleCoverage).TrailerExt!=null){
      var trailer = (cov as VehicleCoverage).TrailerExt;
      title.append(" - " + trailer);
    }
    //Vehicle
    if((cov as VehicleCoverage).TrailerExt==null and (cov as VehicleCoverage).EngineExt==null){
      if(veh.Vehicle.SerialNumber!=null){
        title.append(" (SN: " + veh.Vehicle.SerialNumber + ")");
      } else {
        title.append(" (No SN Provided)");
      }
      title.append(" - " + veh.DisplayName);
    }
    return title.toString();
  }
}
