package util.exposures;
uses java.util.ArrayList;
uses java.lang.Integer;
uses java.util.TreeMap;
uses java.lang.StringBuilder
uses java.util.Collections


class ExposureMenuUtilsAGRIPROPERTY
{
  construct()
  {
  }
  
  /************************************************************************************************************
  *  @method buildAgriPropertyMenu
  *  @param featureMenu    The currently built feature menu that properties will be added to
  *         c              The claim this feature menu belongs to
  *  @returns              The feature menu with added on properties
  */
  public static function buildAgriPropertyMenu(featureMenu : List, c : Claim) : List {
    if(c.Policy.Properties.length>0){
      featureMenu = buildPropertyMenu( featureMenu, c );
    }
    return featureMenu
  }
  
  /**
   * There is undoubtedly a better way to do this.
   */
  public static function getPluralName(riskType : EDWRiskType) : String{
    switch(riskType){
      case EDWRiskType.TC_CAMERA:
        return "Cameras"
      case EDWRiskType.TC_FRMDWL:
        return "Dwellings"
      case EDWRiskType.TC_FRMLOC:
        return "Farm Locations"
      case EDWRiskType.TC_FRMSTRUCT:
        return "Farm Structures"
      case EDWRiskType.TC_MUSICINST:
        return "Musical Instruments"
      default:
        return riskType.DisplayName
    }
  }
  
  //public static function splitRiskTypeGroups(riskTypeMenu : ExposureMenuItem) : TreeMap<String, ExposureMenuItem>{
     //var 
  //}
  
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
                                
      //before clearing the riskType list, correct for large group sizes
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
      //If you don't do this piece outside of the above curly brace, this method will fail in a 
      //spectacular way.
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
      
      //no idea what this block is trying to accomplish; scared to remove it
      if(!exists(struc in listOfLocations where (struc as PropertyRU).Property.RiskTypeExt=="FRMLOC")){
        locationDesc.append("Location " + num)
        for(structure in listOfLocations as PropertyRU[]){
          addy = structure.Property.Address!=null ? structure.Property.Address : null
        }
        locationDesc.append((prop.Coverages.length>0 ? "" : (prop.Property.LocationNumber == null ? "" : " - " + prop.Property.LocationNumber)))
        locationDesc.append(" (" + (addy == null ? "No Address Found" : addy) + ")")
      }//end no idea block
      
      /******************************************************************************************************************************************
       7/25/2016 erawe - Test case QA found that should never occur, but if it does the code inside this block we believe will fix it.
       So if AgriProp claim, Prooperties has location# without a Risk Number of 0 (zero) and an additional location# (not same as first location)
       where this does have a Risk Number of 0(zero). i.e. location#1, risk number 8, location#2, risk number 0.  Currently to create a feature it 
       will NOT build the location 1 display properly.  If this happens try the following
       
       Comment out whole block above where //no idead what this block does.  Then change for(building loop below to match what is added here,
       and add new // this is if there are other locations that are NOT FRMLOC >if (prop.Property.RiskTypeExt != "FRMLOC" and !descPop) { below...
       
       var count : int = 1;  
      var descPop : boolean = false  
      for(building in coveredBuildings){
        prop = (building as PropertyRU);
        if(prop.Property.RiskTypeExt=="FRMLOC" and count == 1 and !descPop){
          locationDesc.append("Location " + prop.PropertyNumberExt + (prop.Coverages.length>0 ? "" : (prop.Property.LocationNumber == null ? "" : " - " + prop.Property.LocationNumber)));
          locationDesc.append(" (" + (prop.Property.Address == null ? "No Address Found" : prop.Property.Address) + ")");
          count++;
          descPop = true
        }
        
        // this is if there are other locations that are NOT FRMLOC
        if (prop.Property.RiskTypeExt != "FRMLOC" and !descPop) {
          locationDesc.append("Location " + num)
          addy = prop.Property.Address !=null ? prop.Property.Address : null
          locationDesc.append((prop.Coverages.length>0 ? "" : (prop.Property.LocationNumber == null ? "" : " - " + prop.Property.LocationNumber)))
          locationDesc.append(" (" + (addy == null ? "No Address Found" : addy) + ")")
          descPop = true
        }    
        then var riskDesc as it is now       
       ******************************************************************************************************************************************/
      
      var count : int = 1;    
      for(building in coveredBuildings){
        prop = (building as PropertyRU);
        if(prop.Property.RiskTypeExt=="FRMLOC" and count == 1){
          locationDesc.append("Location " + prop.PropertyNumberExt + (prop.Coverages.length>0 ? "" : (prop.Property.LocationNumber == null ? "" : " - " + prop.Property.LocationNumber)));
          locationDesc.append(" (" + (prop.Property.Address == null ? "No Address Found" : prop.Property.Address) + ")");
          count++;
        }    

        var riskDesc : StringBuilder = new StringBuilder(prop.Property.RiskTypeExt!="FRMLOC" ? prop.Property.BuildingNumberExt==null ? prop.Property.RiskTypeExt.DisplayName + " - No Risk Number Provided" : prop.Property.RiskTypeExt.DisplayName + " - " + prop.Property.BuildingNumberExt : "");
        riskDesc.append((prop.Property.RiskTypeExt=="FRMLOC" ? "Farm Location" : ""));
        riskDesc.append((prop.Property.LocationNumber == null ? "" : " (" + prop.Property.LocationNumber + ")"));
        menuListOfRisks.put(riskDesc.toString(), new ExposureMenuItem(riskDesc.toString(), prop) );        
      }
      
      //moved a ton of junk to an anonymous function, just so I could minimize clutter here...
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
  
  /************************************************************************************************************
  *  @method createPropertyGroups
  *  @param menuList The list of properties to be put into groups
  *  @returns a new list where the properties are grouped
  */
  public static function createPropertyGroups(featureMenu : List) : List<ExposureMenuItem> {
    var propertyMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var risksMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var counter = 0;
    var maxGroupSize = ScriptParameters.FeatureMenu_MaxGroupSize;
    
    for(menuItem in featureMenu as ExposureMenuItem[]){
      for(item in menuItem.Children){
        if(!exists(expMenuItem in risksMenu where expMenuItem==menuItem)){
          risksMenu.add(menuItem);
          counter = counter + 1;
          if((counter % maxGroupSize) == 0){
            propertyMenu.add( new ExposureMenuItem("Property " + (counter - maxGroupSize + 1) + " to " + counter, risksMenu));
            risksMenu.clear();  
          }
        }
      }
    }
    if(risksMenu.length > 0){
      propertyMenu.add( new ExposureMenuItem("Property " + (counter - risksMenu.length + 1) + " to " + counter, risksMenu));
      risksMenu.clear();    
    }
    return propertyMenu;
  }
  
  /************************************************************************************************************
  *  @method getTitleAgriProperty
  *  @param prop    Property we're building the title of off if one exists
  *  @returns a new list where the equipment are grouped
  */
  public static function getTitleAgriProperty(prop : LocationBasedRU) : String{
    var title : StringBuilder = new StringBuilder("");
    if(prop typeis PropertyRU) {
      title.append("Location " + prop.PropertyNumberExt.toString());
      title.append(prop.Property.Address==null ? " (No Address Found) - " : " (" + prop.Property.Address + ") - ");
      title.append(prop.Property.RiskTypeExt.DisplayName);
      if(prop.Property.RiskTypeExt!="FRMLOC"){
        title.append(" - " + (prop.Property.BuildingNumberExt==null ? "No Risk Number Provided" : prop.Property.BuildingNumberExt));
      }
      title.append(prop.Property.LocationNumber==null ? "" : " (" + prop.Property.LocationNumber + ")");
    }
    return title.toString();
  }
}
