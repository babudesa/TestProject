package util.exposures;
uses java.util.ArrayList;
uses java.lang.Integer;
uses java.util.SortedMap;
uses java.util.TreeMap;
uses java.lang.StringBuilder;
uses java.util.Collections;

class ExposureMenuUtilsPIMINMARINE
{
  
  construct()
  {
  }
  
  /************************************************************************************************************
  *  @method buildInlandMarineMenu
  *  @param featureMenu    The currently built feature menu that properties and items will be added to
  *         c              The claim this feature menu belongs to
  *  @returns              The feature menu with added on properties and items
  */
  public static function buildInlandMarineMenu(featureMenu : List, c : Claim) : List {
    if(c.Policy.Properties.length>0 && exists(prop in c.Policy.Properties where prop.Coverages.length>0 && prop typeis PropertyRU)){
      featureMenu = buildPropertyMenu( featureMenu, c );
    }
    if(c.Policy.Properties.length>0 && exists(prop in c.Policy.Properties where prop.Coverages.length>0 && prop typeis JobsiteRUExt)){
      featureMenu = buildJobsiteMenu(featureMenu, c);
    }
    if(c.Policy.Vehicles.length>0 && exists(veh in c.Policy.Vehicles where veh.Coverages.length>0)){
      featureMenu = buildEquipmentMenu( featureMenu, c );
    }
    
    return featureMenu;
  }
  /************************************************************************************************************
   *  @method getPluralName
   *  @param  riskType       EDW Risk type 
   *  @returns              The Plural name of the risk type
   *  author  akubatur
   */
  public static function getPluralName(riskType : EDWRiskType) : String{
      switch(riskType){
        case EDWRiskType.TC_TIMELEMENT:
          return "Time Elements"
        case EDWRiskType.TC_BLDG:
          return "Buildings"
        case EDWRiskType.TC_PERSPROP:
          return "Personal Property"
        case EDWRiskType.TC_PRM:
          return "Premises"
        case EDWRiskType.TC_EBOPS:
          return "Equipment Breakdown Operations"
        case EDWRiskType.TC_EQPT:
          return "Equipment"
        case EDWRiskType.TC_COVPROP:
          return "Covered Property"
        case EDWRiskType.TC_SBPOPS:
        return "Select Business Property Operations"
        case EDWRiskType.TC_JOBSITE:
        return "Jobsites"
        default:
          return riskType.DisplayName
      }
    }
  
  /************************************************************************************************************
     *  @method buildPropertyMenu
     *  @param featureMenu    The currently built feature menu that properties will be added to
     *         c              The claim this feature menu belongs to
     *  @returns              The feature menu with added on properties
     */
    public static function buildPropertyMenu(featureMenu : List, c : Claim) : List {
      var listOfLocationNumbers : List<Integer> = new ArrayList<Integer>();
      var listOfLocations : List<LocationBasedRU> = new ArrayList<LocationBasedRU>();
      var coveredBuildings : List<LocationBasedRU> = new ArrayList<LocationBasedRU>();
      var addy : Address;
      var prop : PropertyRU;
      var menuListOfRisks = Collections.synchronizedMap(new TreeMap<String, ExposureMenuItem>(new util.custom_Ext.AlphanumericSorting()))
      var menuListOfRiskTypes = Collections.synchronizedMap(new TreeMap<String, ExposureMenuItem>(new util.custom_Ext.AlphanumericSorting()))
      var menuListOfLocations = Collections.synchronizedMap(new TreeMap<String, ExposureMenuItem>(new util.custom_Ext.AlphanumericSorting()))
      var maxGroupSize = ScriptParameters.FeatureMenu_MaxGroupSize
      /* Defect# 7405
       * Changer : akubatur
       * Splitting up the property menu based on risk type. 
       */      
      var addToRiskTypes = \ riskMenuItem : ExposureMenuItem -> {
        var theRiskType : EDWRiskType = (riskMenuItem.PolicyProperty as PropertyRU).Property.RiskTypeExt
        var riskTypeMenu = menuListOfRiskTypes.get(getPluralName(theRiskType))
        if(riskTypeMenu.Children.HasElements){
        riskTypeMenu.Children.add(riskMenuItem) 
        }else{
          menuListOfRiskTypes.put(getPluralName(theRiskType), new ExposureMenuItem(getPluralName(theRiskType), {riskMenuItem})) 
        }
      }
      var postInnerLoop = \ locationDesc : String ->{
        menuListOfRisks.eachValue(\ riskMenuItem -> addToRiskTypes(riskMenuItem) )            
        menuListOfRisks.clear()
        var riskTypeMenuIter = menuListOfRiskTypes.Values.iterator()
        var newMenuListOfRiskTypes = new TreeMap<String, ExposureMenuItem>(new util.custom_Ext.AlphanumericSorting())
        while(riskTypeMenuIter.hasNext()){
          var riskTypeMenu = riskTypeMenuIter.next()
          var menuLen = riskTypeMenu.Children.length        
          if(menuLen > maxGroupSize){          
            var startInd = 0
            var endInd = startInd + maxGroupSize
            var keyString = ""
            var procCount = 0
            while(procCount < menuLen){
              keyString = riskTypeMenu.Name + " " + (startInd + 1) + " to " + (endInd)
              var subList = riskTypeMenu.Children.subList(startInd, endInd)
              newMenuListOfRiskTypes.put(keyString, new ExposureMenuItem(keyString, subList))
              procCount = procCount + (endInd - startInd)
              startInd = endInd
              endInd = (menuLen - procCount) > maxGroupSize ? procCount + maxGroupSize : procCount + (menuLen - procCount)
            }
            riskTypeMenuIter.remove()          
          }
        }
        if(newMenuListOfRiskTypes.Values.HasElements){
          menuListOfRiskTypes.putAll(newMenuListOfRiskTypes)
          newMenuListOfRiskTypes.clear()
        }
      }
      for(item in c.Policy.Properties){
        if (item typeis PropertyRU && item.Coverages.length > 0) {
          listOfLocations.add(item);
          if(!exists(num in listOfLocationNumbers where num==item.PropertyNumberExt)){
            listOfLocationNumbers.add(item.PropertyNumberExt);
          }
        }
      }
      for(num in listOfLocationNumbers){
        var locationDesc : StringBuilder = new StringBuilder("");
        for(item in listOfLocations){
          if (item typeis PropertyRU && item.PropertyNumberExt==num) {
            coveredBuildings.add(item);
          }
        }
      if(!exists(struc in listOfLocations where (struc as PropertyRU).Property.RiskTypeExt=="PRM")){
          locationDesc.append("Premises " + num)
          for(structure in listOfLocations as PropertyRU[]){
            addy = structure.Property.Address!=null ? structure.Property.Address : null
          }
          locationDesc.append((prop.Coverages.length>0 ? "" : (prop.Property.LocationNumber == null ? "" : " - " + prop.Property.LocationNumber)))
       }
      var count : int = 1;    
        for(building in coveredBuildings){
          prop = (building as PropertyRU);
          if(prop.Property.RiskTypeExt=="PRM" and count == 1){
            locationDesc.append("Premises " + prop.PropertyNumberExt);
            locationDesc.append("Location " + prop.PropertyNumberExt + (prop.Coverages.length>0 ? "" : (prop.Property.LocationNumber == null ? "" : " - " + prop.Property.LocationNumber)));
            locationDesc.append(" (" + (prop.Property.Address == null ? "No Address Found" : prop.Property.Address) + ")");
            count++;
          }    
        var riskDesc : StringBuilder = new StringBuilder(prop.Property.RiskTypeExt!="PRM" ? prop.Property.BuildingNumberExt==null ? prop.Property.RiskTypeExt.DisplayName + " - No Risk Number Provided" : prop.Property.RiskTypeExt.DisplayName + " - " + prop.Property.BuildingNumberExt : "");
          riskDesc.append((prop.Property.RiskTypeExt=="PRM" ? "Premises" : ""));
          riskDesc.append(" (" + (prop.Property.Address == null ? "No Address Found" : prop.Property.Address) + ")");
          menuListOfRisks.put(riskDesc.toString(), new ExposureMenuItem(riskDesc.toString(), prop) );        
        }
        postInnerLoop(locationDesc.toString())
        menuListOfLocations.put(locationDesc.toString(), new ExposureMenuItem(locationDesc.toString(), menuListOfRiskTypes.Values as ExposureMenuItem[]))
        menuListOfRiskTypes.clear()
        coveredBuildings.clear()
     }
      listOfLocations.clear();
      featureMenu.addAll(menuListOfLocations.Values);
      menuListOfLocations.clear();
      return featureMenu
    }
   // dnmiller - added Aug. 2014 for PIM Builder's Risk Coverages
    /************************************************************************************************************
   *  @method buildJobsiteMenu
   *  @param featureMenu    The currently built feature menu that jobsites will be added to
   *         c              The claim this feature menu belongs to
   *  @returns              The feature menu with added on jobsites
   */
    public static function buildJobsiteMenu(featureMenu : List, c : Claim) : List {
    var listOfLocationNumbers : List<Integer> = new ArrayList<Integer>();
    var listOfLocations : List<LocationBasedRU> = new ArrayList<LocationBasedRU>();
    var coveredJobsites : List<LocationBasedRU> = new ArrayList<LocationBasedRU>();
    var job : JobsiteRUExt;
    var menuListOfRisks : SortedMap = new TreeMap(new util.custom_Ext.AlphanumericSorting());
    var menuListOfLocations : SortedMap = new TreeMap(new util.custom_Ext.AlphanumericSorting());
    
    for(item in c.Policy.Properties){
      if (item typeis JobsiteRUExt && item.Coverages.length > 0) {
        listOfLocations.add(item);
        if(!exists(num in listOfLocationNumbers where num==item.JobsiteNumberExt)){
          listOfLocationNumbers.add(item.JobsiteNumberExt);
        }
      }
    }
    for(num in listOfLocationNumbers){
      var locationDesc : StringBuilder = new StringBuilder("");
      for(item in listOfLocations){
        if (item typeis JobsiteRUExt && item.JobsiteNumberExt==num) {
          coveredJobsites.add(item);
        }
      }
      locationDesc.append("Jobsite " + num);
      for(building in coveredJobsites){
        job = (building as JobsiteRUExt) 
        if(job.Coverages.length>0){
          var riskDesc : StringBuilder = new StringBuilder("");
          riskDesc.append(job.Property.RiskTypeExt == null ? " (No Risk Type Found) " : " " + job.Property.RiskTypeExt.DisplayName);
          riskDesc.append(job.Property.RiskNumberExt == null ? " (No Risk Number Found) " : " - " + job.Property.RiskNumberExt);
          riskDesc.append(job.Property.Address == null ? " (No Address Found)" : " (" + job.Property.Address + ")");
          menuListOfRisks.put( riskDesc, new ExposureMenuItem(riskDesc.toString(), job) );
        }
      }
      menuListOfLocations.put( locationDesc, new ExposureMenuItem(locationDesc.toString(), menuListOfRisks.Values as ExposureMenuItem[]));
      menuListOfRisks.clear();
      coveredJobsites.clear();
    }
    listOfLocations.clear();
    featureMenu.addAll(menuListOfLocations.Values);
    menuListOfLocations.clear();
    
    return featureMenu;
   }
  
  /************************************************************************************************************
   *  @method buildItemMenu
   *  @param featureMenu    The currently built feature menu that equipment will be added to
   *         c              The claim this feature menu belongs to
   *  @returns              The feature menu with added on equipment (vehicles entity)
   */
  public static function buildEquipmentMenu(featureMenu : List, c : Claim) : List {
    var itemMenu : SortedMap = new TreeMap(new util.custom_Ext.AlphanumericSorting());
    
    for(item in c.Policy.Vehicles){
      if (item typeis VehicleRU and item.Coverages.length>0) {
        var itemDesc = item.DisplayName + (item.Vehicle.SerialNumber == null ? " (No VIN/SN Provided)" : " (VIN/SN: " + item.Vehicle.SerialNumber + ")");
        itemMenu.put( itemDesc, new ExposureMenuItem(itemDesc.toString()=="" ? "No Details: Equipment" : itemDesc.toString(), item) );
      }
    }
    featureMenu.addAll(itemMenu.Values);
    itemMenu.clear();
    
    return featureMenu;
  }
  
  /************************************************************************************************************
  *  @method createPropertyGroups
  *  @param menuList The list of properties to be put into groups
  *  @returns a new list where the properties are grouped
  */
  public static function createPropertyGroups(featureMenu : List) : List<ExposureMenuItem> {
    var premisesMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var risksMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var counter : Integer = 0;
    var maxGroupSize = ScriptParameters.FeatureMenu_MaxGroupSize;
    
    for(menuItem in featureMenu as ExposureMenuItem[]){
      for(item in menuItem.Children){
        if(!exists(expMenuItem in risksMenu where expMenuItem==menuItem)){
          risksMenu.add(menuItem);
          counter = counter + 1;
          if((counter % maxGroupSize) == 0){
            premisesMenu.add( new ExposureMenuItem("Premises " + (counter - maxGroupSize + 1) + " to " + counter, risksMenu) );
            risksMenu.clear();  
          }
        }
      }
    }
    if(risksMenu.length > 0){
      premisesMenu.add( new ExposureMenuItem("Premises " + (counter - risksMenu.length + 1) + " to " + counter, risksMenu) );
      risksMenu.clear();    
    }
    return premisesMenu;
  }
  
  /************************************************************************************************************
  *  @method createEquipmentGroups
  *  @param menuList The list of equipment to be put into groups
  *  @returns a new list where the equipment are grouped
  */
  public static function createEquipmentGroups(featureMenu : List) : List<ExposureMenuItem> {
    var equipMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var risksMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var counter : Integer = 0;
    var maxGroupSize = ScriptParameters.FeatureMenu_MaxGroupSize;
    
    for(menuItem in featureMenu as ExposureMenuItem[]){
      if(menuItem.PolicyVehicle!=null and !exists(expMenuItem in risksMenu where expMenuItem==menuItem)){
        risksMenu.add(menuItem);
        counter = counter + 1;
        if((counter % maxGroupSize) == 0){
          equipMenu.add( new ExposureMenuItem("Equipment " + (counter - maxGroupSize + 1) + " to " + counter, risksMenu) )
          risksMenu.clear();  
        }
      }
    }
    if(risksMenu.length > 0){
      equipMenu.add( new ExposureMenuItem("Equipment " + (counter - risksMenu.length + 1) + " to " + counter, risksMenu) )
      risksMenu.clear();    
    }
    return equipMenu;
  }
  
  /************************************************************************************************************
  *  @method getTitleInlandMarine
  *  @param cov     Coverage the title will go off of
  *         prop    Property we're building the title of off if one exists
  *         veh     Vehicle we're building the title off of if one exists (Equipment)
  *  @returns a new list where the equipment are grouped
  */
  public static function getTitleInlandMarine( cov : Coverage, prop : LocationBasedRU, veh : VehicleRU ) : String {
    var title : StringBuilder = new StringBuilder("");
    if(cov.Subtype=="PropertyCoverage"){
      //dnmiller - added Aug 2014 for PIM Builder's Risk Coverages - title for Jobsite Feature
      if (prop typeis JobsiteRUExt){
        title.append("Jobsite " + prop.JobsiteNumberExt);
        title.append((prop.Property.Address==null ? " (No Address Found) - " : " (" + prop.Property.Address + ") - "));
        title.append(prop.Property.RiskTypeExt.DisplayName + " - ");
        title.append(((prop.Property.RiskNumberExt==null || prop.Property.RiskNumberExt.toString()=="") ? "No Risk Number Provided" : prop.Property.RiskNumberExt.toString()));
      }else{
      title.append("Premises " + (prop typeis PropertyRU ? prop.PropertyNumberExt : prop.RUNumber));
      if(prop.Property.RiskTypeExt!=TC_PRM){
        title.append((prop.Property.BuildingNumberExt==null ? "No Building Number Provided" : " - Building " + prop.Property.BuildingNumberExt));
        title.append((prop.Property.Address==null ? " (No Address Found) - " : " (" + prop.Property.Address + ") - "));
        title.append(prop.Property.RiskTypeExt.DisplayName + " - ");
        title.append(((prop.Property.RiskNumberExt==null || prop.Property.RiskNumberExt.toString()=="") ? "No Risk Number Provided" : prop.Property.RiskNumberExt.toString()));
      } else {
        title.append(prop.Property.RiskTypeExt.DisplayName);
        title.append((prop.Property.Address==null ? " (No Address Found) - " : " (" + prop.Property.Address + ")")); 
      }
      title.append((prop.Property.LocationNumber==null ? "" : " (" + prop.Property.LocationNumber + ")"));
      }
    } else {
      title.append(veh.DisplayName);
      if(veh.Vehicle.SerialNumber!=null){
        title.append(" (VIN/SN: " + veh.Vehicle.SerialNumber + ")");
      } else {
        title.append(" (No VIN/SN Provided)");
      }
      title.append(" - " + veh.DisplayName);
    }
    return title.toString()
  }
}
