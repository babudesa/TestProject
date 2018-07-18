package util.exposures;
uses java.util.ArrayList;
uses java.util.SortedMap;
uses java.util.TreeMap;
uses java.lang.StringBuilder;

class ExposureMenuUtilsAGRIAUTO
{
  construct()
  {
  }
  
  /************************************************************************************************************
  *  @method buildAgriAutoMenu
  *  @param featureMenu    The currently built feature menu that vehicles will be added to
  *         c              The claim this feature menu belongs to
  *  @returns              The feature menu with added on vehicles
  */
  public static function buildAgriAutoMenu(featureMenu : List, c : Claim) : List {
    if(c.Policy.Vehicles.length>0 && exists(veh in c.Policy.Vehicles where veh.Coverages.length>0)){
      featureMenu = buildVehicleMenu( featureMenu, c );
    }
    
    return featureMenu;
  }
 
  public static function buildVehicleMenu(featureMenu : List, c : Claim) : List {
    var equipMenu : SortedMap = new TreeMap(new util.custom_Ext.AlphanumericSorting())
    
    for(item in c.Policy.Vehicles){
      if (item typeis VehicleRU && item.Coverages.length > 0) {
        var carDesc = item.DisplayName + (item.Vehicle.Vin == null ? " (No VIN Provided)" : " (VIN: " + item.Vehicle.Vin + ")");
        equipMenu.put( carDesc, new ExposureMenuItem(carDesc.toString() == "" ? "No Details: Vehicle" : carDesc.toString(), item));
      }
    }
    featureMenu.addAll(equipMenu.Values);
    equipMenu.clear();
    
    return featureMenu;
  }
  
  /************************************************************************************************************
  *  @method createVehicleGroups
  *  @param menuList The list of vehicles to be put into groups
  *  @returns a new list where the vehicles are grouped
  */
  public static function createVehicleGroups(featureMenu : List) : List<ExposureMenuItem> {
    var vehiclesMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var risksMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var counter = 0;
    var maxGroupSize = ScriptParameters.FeatureMenu_MaxGroupSize;
    
    for(menuItem in featureMenu as ExposureMenuItem[]){
      if(menuItem.PolicyVehicle!=null and !exists(expMenuItem in risksMenu where expMenuItem==menuItem)){
        risksMenu.add(menuItem);
        counter = counter + 1;
        if((counter % maxGroupSize) == 0){
          vehiclesMenu.add( new ExposureMenuItem("Vehicle " + (counter - maxGroupSize + 1) + " to " + counter, risksMenu));
          risksMenu.clear();  
        }
      }
    }
    if(risksMenu.length > 0){
      vehiclesMenu.add( new ExposureMenuItem("Vehicle " + (counter - risksMenu.length + 1) + " to " + counter, risksMenu));
      risksMenu.clear();    
    }
    
    return vehiclesMenu;
  }
  
  /************************************************************************************************************
  *  @method getTitleAgriAuto
  *  @param veh     Vehicle we're building the title off of if one exists (Equipment)
  *  @returns a new list where the equipment are grouped
  */
  public static function getTitleAgriAuto(veh : VehicleRU) : String{
    var title : StringBuilder = new StringBuilder(veh.DisplayName);
    
    if(veh.Vehicle.Vin!=null){
      title.append(" (VIN: " + veh.Vehicle.Vin + ")");
    } else {
      title.append(" (No VIN Provided)");
    }
    title.append(" - " + veh.DisplayName);
    
    return title.toString();
  }
}
