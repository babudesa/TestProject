package util.exposures;
uses java.util.ArrayList;
uses java.util.SortedMap;
uses java.util.TreeMap;
uses java.lang.StringBuilder;

class ExposureMenuUtils
{
  /*
   *Script Parameters Used
   *  ScriptParameters.FeatureMenu_MaxGroupMenuSize - how long the menu can get before needing to be split
   *  ScriptParameters.FeatureMenu_MaxGroupSize - once split, the size of each grouping of coverages/risks
   */
  construct()
  {
  }

  /*************************************************************************************************************
  * Exposure Menu Generation
  *
  *@param c The claim the feature menu will be generated on
  *@return  Array of ExposureMenuItems to create a screen based exposure menu
  */
  public static function getExposureMenu(c : Claim) : ExposureMenuItem[]{
    var featureMenu : List = new ArrayList(); 
    var LOB : LossType = c.LossType;
    var maxMenuLength = (ScriptParameters.FeatureMenu_MaxGroupMenuSize * ScriptParameters.FeatureMenu_MaxGroupSize);
    
    if(c.Policy != null and c.Policy.getNumOfRisksWCvgs() > maxMenuLength){
      gw.api.util.Logger.logDebug("The menu is too large to fit on screen : Now reducing the menu.");
      featureMenu = populateReducedMenu(featureMenu, c);
      setPolicyCoveragesByState(c, featureMenu);
      switch(LOB){
        case TC_EQUINE:
          featureMenu = util.exposures.ExposureMenuUtilsEQUINE.buildEquineMenu(featureMenu, c);
          break;
        case TC_AGRIAUTO:
          featureMenu = util.exposures.ExposureMenuUtilsAGRIAUTO.buildAgriAutoMenu(featureMenu, c);
          break;
        case TC_AGRILIABILITY:
          featureMenu = util.exposures.ExposureMenuUtilsAGRILIABILITY.buildAgriLiabilityMenu(featureMenu, c);
          break;
        case TC_AGRIPROPERTY:
          featureMenu = util.exposures.ExposureMenuUtilsAGRIPROPERTY.buildAgriPropertyMenu(featureMenu, c);
          break;
        case TC_PIMINMARINE:
          featureMenu = util.exposures.ExposureMenuUtilsPIMINMARINE.buildInlandMarineMenu(featureMenu, c);
          break;
        case TC_ALTMARKETSAUTO:
          featureMenu = util.exposures.ExposureMenuUtilsAGRIAUTO.buildAgriAutoMenu(featureMenu, c);
          break;
        case TC_SHSAUTO:
          featureMenu = util.exposures.ExposureMenuUtilsAGRIAUTO.buildAgriAutoMenu(featureMenu, c);
          break;
        case TC_TRUCKINGAUTO:
          featureMenu = util.exposures.ExposureMenuUtilsAGRIAUTO.buildAgriAutoMenu(featureMenu, c);
          break;
        default:
          break;
      }
      if(featureMenu.length > ScriptParameters.FeatureMenu_MaxGroupMenuSize ){
        gw.api.util.Logger.logDebug("Now Splitting the Feature Menu")
        featureMenu = splitMenu(featureMenu, c);  
      }
    } else {
      setPolicyCoveragesByState(c, featureMenu);
      switch(LOB){
        case TC_EQUINE:
          featureMenu = util.exposures.ExposureMenuUtilsEQUINE.buildEquineMenu(featureMenu, c);
          break;
        case TC_AGRIAUTO:
          featureMenu = util.exposures.ExposureMenuUtilsAGRIAUTO.buildAgriAutoMenu(featureMenu, c);
          break;
        case TC_AGRILIABILITY:
          featureMenu = util.exposures.ExposureMenuUtilsAGRILIABILITY.buildAgriLiabilityMenu(featureMenu, c);
          break;
        case TC_AGRIPROPERTY:
          featureMenu = util.exposures.ExposureMenuUtilsAGRIPROPERTY.buildAgriPropertyMenu(featureMenu, c);
          break;
        case TC_PIMINMARINE:
          featureMenu = util.exposures.ExposureMenuUtilsPIMINMARINE.buildInlandMarineMenu(featureMenu, c);
          break;
        case TC_ALTMARKETSAUTO:
          featureMenu = util.exposures.ExposureMenuUtilsAGRIAUTO.buildAgriAutoMenu(featureMenu, c);
          break;
        case TC_SHSAUTO:
          featureMenu = util.exposures.ExposureMenuUtilsAGRIAUTO.buildAgriAutoMenu(featureMenu, c);
          break;
        case TC_TRUCKINGAUTO:
          featureMenu = util.exposures.ExposureMenuUtilsAGRIAUTO.buildAgriAutoMenu(featureMenu, c);
          break;
        default:
          break;
      }
      
      if(featureMenu.length > ScriptParameters.FeatureMenu_MaxGroupMenuSize and featureMenu.length <= maxMenuLength){
        gw.api.util.Logger.logDebug("Now Splitting the Feature Menu")
        featureMenu = splitMenu(featureMenu, c);  
      }
    }
    
    return featureMenu as util.exposures.ExposureMenuItem[];
  }




//*************************************************************************************** 
//**************HELPER FUNCTIONS********************************************************* 
//*************************************************************************************** 

 /************************************************************************************************************
  *  @method populateReducedMenu Used to reduce the menus if they have gone over the complete maximum
  *  @param featureMenu The menu to be split up
  *  @return List the new feature menu, split up
  */
  private static function populateReducedMenu(featureMenu : List, c : Claim) : List {
    var risksMenu : List = new ArrayList();
    var policyCoverages : List = new ArrayList();
    //Policy Coverages
    if(c.Policy.Coverages.length>0){
      for(cvg in c.Policy.Coverages){
        policyCoverages.add(cvg)
      }
      featureMenu.add( new ExposureMenuItem( getReducedTitle( c.LossType, c.Policy.Coverages[0] ), policyCoverages as Coverage[] ) );
    }
    //Property Coverages
    for(prop in c.Policy.Properties){
      if (prop typeis PropertyRU){
      if(prop.Coverages.length>0){
        risksMenu.add(prop);
      }
    }
    if(risksMenu.length>0){
      featureMenu.add( new ExposureMenuItem( getReducedTitle( c.LossType, c.Policy.Properties*.Coverages[0] ), risksMenu as PropertyRU[] ) );
    }
      if (prop typeis JobsiteRUExt){
        if(prop.Coverages.length>0){
          risksMenu.add(prop);
        }
        if(risksMenu.length>0){
        featureMenu.add( new ExposureMenuItem( getReducedTitle( c.LossType, c.Policy.Properties*.Coverages[0] ), risksMenu as PropertyRU[] ) );
        }
      }
    }
    
    risksMenu.clear();
    //Vehicle Coverages
    for(veh in c.Policy.Vehicles){
      if(veh.Coverages.length>0){
        risksMenu.add(veh);
      }
    }
    if(risksMenu.length>0){
      featureMenu.add( new ExposureMenuItem( getReducedTitle( c.LossType, c.Policy.Vehicles*.Coverages[0] ), risksMenu as VehicleRU[] ) );
    }
    risksMenu.clear();
    
    return featureMenu;
  }
  
  /* Defect 7716 - cmullin - 9.2.15 - added separate block for WC claims to list only
     those Policy Level Coverages where the state matches the state of the coverage 
     selected by the user on the particular WC claim.
  */
  /************************************************************************************************************
  * Helper function that finds all the policy level coverages that occur and 
  * groups them by state.  This function is to be used by feature menus that 
  * utilize the screen design, not the expandable menu.
  *
  * @param c           The claim this menu will be built on
  * @param featureMenu The List the policy coverages should be added to 
  */
  private static function setPolicyCoveragesByState(c : Claim, featureMenu : List) {
    var stateListHist : List<State> = new ArrayList<State>();   
    var coverages : List<Coverage> = new ArrayList<Coverage>();  
    var stateMenu : SortedMap = new TreeMap(new util.custom_Ext.AlphanumericSorting());
    var claimCoverageState = c.CoverageSelectedExt.State
    var isWCClaim : Boolean = util.WCHelper.isWCorELLossType(c)
    var stateString : String
    
    // Added this if block for WC claims: 
    if(isWCClaim){
      for(polCvg in c.Policy.Coverages){
        if(polCvg.State==claimCoverageState){
          coverages.add(polCvg)
          if(polCvg.State!=null){
            stateString = polCvg.State.DisplayName
          }else{
            stateString = "No State"
          }
          stateMenu.put( "Policy Level Coverage (" + stateString + ")", new ExposureMenuItem("Policy Level Coverage (" + stateString + ")", coverages as Coverage[]));
        }
      }
      coverages.clear()
    // All code below is unchanged from the original function.
    }else{ 
      for(polCvg in c.Policy.Coverages){
        if(!exists(state in stateListHist where state==polCvg.State)){
          stateListHist.add(polCvg.State);
        }
      }
      for(state in stateListHist){
        for(cvg in c.Policy.Coverages){ 
          if(cvg.State == state){
            coverages.add(cvg);
          }
        }
        if(state != null){
          stateMenu.put( "Policy Level Coverage (" + state.DisplayName + ")", new ExposureMenuItem("Policy Level Coverage (" + state.DisplayName + ")", coverages as Coverage[]));
        } else{
          stateMenu.put( "Policy Level Coverage", new ExposureMenuItem("Policy Level Coverage", coverages as Coverage[]));       
        }
        coverages.clear();
      }
    }
    featureMenu.addAll(stateMenu.Values);
    stateMenu.clear();
  }
  

  /************************************************************************************************************
  *  @method splitMenu Used to split the menus up if they have a lot of properties or coverages
  *  @param featureMenu The menu to be split up
  *  @return List the new feature menu, split up
  */
  private static function splitMenu(featureMenu : List, c: Claim) : List {
    var rebuiltMenu : List = new ArrayList();
    var counter = 0;
    var firstLetter : String = "";
    var polMenuOne = new ArrayList();
    var polMenuTwo = new ArrayList();
    var isPolCvgNoState = new ArrayList();
    var policyCoverages : SortedMap = new TreeMap(new util.custom_Ext.AlphanumericSorting());
    var propMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var vehMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    
    /***POLICY COVERAGE GROUPS***/
    for(menuItem in featureMenu as ExposureMenuItem[]){
      if(menuItem.Name.startsWith( "Policy Level Coverage" )){
        var i = menuItem.Name.indexOf( "(" );
        counter = counter + 1;
        if(i > 0){
          firstLetter = menuItem.Name.substring( i+1, i+2 ).toUpperCase()
          if(firstLetter>="A" and firstLetter<="M"){
            polMenuOne.add(menuItem);
          }
          if(firstLetter>="N" and firstLetter<="Z"){
            polMenuTwo.add(menuItem);
          }
        } else {
          var result : boolean = (menuItem.Name=="Watercrafts" || menuItem.Name=="Properties" || menuItem.Name=="Vehicles" || menuItem.Name=="Equipment" || menuItem.Name=="Premises" || menuItem.Name=="Policy Level Coverages")
          if(!result){
            isPolCvgNoState.add(menuItem);
          }
        }
      } 
    } 
    if(polMenuOne.length > ScriptParameters.FeatureMenu_MaxGroupSize || polMenuTwo.length > ScriptParameters.FeatureMenu_MaxGroupSize){
      if(c.Policy.Coverages.length>0){
        for(cvg in c.Policy.Coverages){
          policyCoverages.put(cvg, cvg);
        }
        rebuiltMenu.add( new ExposureMenuItem( getReducedTitle( c.LossType, c.Policy.Coverages[0] ), policyCoverages as Coverage[] ) );
      }
    } else {
      if(isPolCvgNoState.length > 0){
        rebuiltMenu.add( new ExposureMenuItem("Policy Coverages (No State) : ", isPolCvgNoState as ExposureMenuItem[]) );
        isPolCvgNoState.clear();
      }
      if(polMenuOne.length > 0){
        rebuiltMenu.add( new ExposureMenuItem("Policy Coverages AK - MT: ", polMenuOne as ExposureMenuItem[]) );
        polMenuOne.clear();
      }
      if(polMenuTwo.length > 0){
        rebuiltMenu.add( new ExposureMenuItem("Policy Coverages NE - WY: ", polMenuTwo as ExposureMenuItem[]) );
        polMenuTwo.clear();
      }
    }
    /***RISK COVERAGE GROUPS***/  
    if(featureMenu.length - counter + rebuiltMenu.length > ScriptParameters.FeatureMenu_MaxGroupMenuSize){
      switch(c.LossType){
        case TC_EQUINE:
          propMenu = util.exposures.ExposureMenuUtilsEQUINE.createPropertyGroups( featureMenu );
          rebuiltMenu.addAll(propMenu);
          break;
        case TC_AGRIAUTO:
          vehMenu = util.exposures.ExposureMenuUtilsAGRIAUTO.createVehicleGroups( featureMenu );
          rebuiltMenu.addAll(vehMenu);
          break;
        case TC_AGRILIABILITY:
          vehMenu = util.exposures.ExposureMenuUtilsAGRILIABILITY.createVehicleGroups( featureMenu );
          rebuiltMenu.addAll(vehMenu);
          break;
        case TC_AGRIPROPERTY:
          propMenu = util.exposures.ExposureMenuUtilsAGRIPROPERTY.createPropertyGroups( featureMenu );
          rebuiltMenu.addAll(propMenu);
          break;
        case TC_PIMINMARINE:
          propMenu = util.exposures.ExposureMenuUtilsPIMINMARINE.createPropertyGroups( featureMenu );
          rebuiltMenu.addAll(propMenu);
          vehMenu = util.exposures.ExposureMenuUtilsPIMINMARINE.createEquipmentGroups( featureMenu );
          rebuiltMenu.addAll(vehMenu);
          break;
        case TC_ALTMARKETSAUTO:
          vehMenu = util.exposures.ExposureMenuUtilsAGRIAUTO.createVehicleGroups( featureMenu );
          rebuiltMenu.addAll(vehMenu);
          break;
        case TC_SHSAUTO:
          vehMenu = util.exposures.ExposureMenuUtilsAGRIAUTO.createVehicleGroups( featureMenu );
          rebuiltMenu.addAll(vehMenu);
          break;
        case TC_TRUCKINGAUTO:
          vehMenu = util.exposures.ExposureMenuUtilsAGRIAUTO.createVehicleGroups( featureMenu );
          rebuiltMenu.addAll(vehMenu);
          break;
        default:
          break;
      }
    } else {
      for(item in featureMenu as ExposureMenuItem[]){
        if(item.PolicyProperty!=null || item.Name=="Properties" || item.Name=="Premises" || item.Name=="Jobsites"){
          rebuiltMenu.add(item);
        }
      }
      for(item in featureMenu as ExposureMenuItem[]){
        if(item.Children[0].PolicyVehicle!=null || (item.Name=="Watercrafts" || item.Name=="Vehicles" || item.Name=="Equipment")){
          rebuiltMenu.add(item);
        }
      }
    }
    return rebuiltMenu;
  }
  
  /************************************************************************************************************
  * Gets the coverage subtypes for a given coverage
  * and returns the subtypes as PageExposureMenuItems
  * To be used with screen type feature menus, not expanding
  * menus.
  *
  *@param c The coverage to create the PageExposureMenuItems for
  *@return Array of PageExposureMenuItems, one for each coverage subtype
  */
//  public static function getExposureTypesForCoverage(c : Coverage) : PageExposureMenuItem[]{
//    var PEMI : List<PageExposureMenuItem> = new ArrayList<PageExposureMenuItem>();
//    for(cSubtype in CoverageSubtype.getTypeKeys(false)){
//      if(cSubtype.hasCategory(c.Type)){
//        for(expType in ExposureType.getTypeKeys(false)){
//          if(cSubtype.hasCategory( expType )){
//            if(exists(cat in expType.Categories where cat typeis LossType)){
//              if(expType.hasCategory(c.Policy.Claim.LossType)){
//                PEMI.add(new PageExposureMenuItem(c, cSubtype, expType));
//              }
//            }else{
//              PEMI.add(new PageExposureMenuItem(c, cSubtype, expType));
//            }
//          }
//        }  
//      }
//    }
//
//    return PEMI as PageExposureMenuItem[];
//  }


  /*
   * 1/12/15 - cmullin - added function to filter WC coverages on the ExposureSelectionDV (New Feature Action Menu). 
   * This function gets all available Exposure Types for each Coverage on the Policy from getExposureTypesForCoverage 
   * and compares the list of all available ExposureTypes with those Exposures currently on the Claim. 
   * This function returns a new list which includes only those Exposure Types that are available on the Coverage, but 
   * which have not already been created. (Workers' Comp allows only one Feature of each Exposure Type on any given claim.)
   */

  public static function getExposureTypesForWCCoverage(cov : Coverage, clm : Claim) : PageExposureMenuItem[]{
 
    var fullExposureList : List<PageExposureMenuItem> = getExposureTypesForCoverage(cov) as java.util.List<util.exposures.PageExposureMenuItem>
    var filteredExposureList : List<PageExposureMenuItem> = new ArrayList<PageExposureMenuItem>();
    var currentClaimExposures = clm.Exposures*.ExposureType
    for(each in fullExposureList){
      if(!currentClaimExposures.contains(each.ExposureType) && !filteredExposureList.contains(each)){
        if(!clm.TimeLossReport and each.ExposureType != ExposureType.TC_WC_INDEMNITY_TIMELOSS and each.ExposureType != ExposureType.TC_WC_MEDICAL_DETAILS){
          filteredExposureList.add(each)      
        }
        if(clm.TimeLossReport){
         filteredExposureList.add(each) 
        }
      }
    }
    return filteredExposureList as PageExposureMenuItem[];
  }


  public static function getExposureTypesForCoverage(c : Coverage) : PageExposureMenuItem[]{
    var PEMI : List<PageExposureMenuItem> = new ArrayList<PageExposureMenuItem>();
    for(cSubtype in CoverageSubtype.getTypeKeys(false)){
      if(cSubtype.hasCategory(c.Type)){
        for(expType in ExposureType.getTypeKeys(false)){
          if(exists(cat in cSubtype.Categories where cat typeis LossType)){
            if(!cSubtype.hasCategory(c.Policy.Claim.LossType)){
            continue;
            }
          }                             
          if(cSubtype.hasCategory( expType )){
            if(exists(cat in expType.Categories where cat typeis LossType)){
              if(expType.hasCategory(c.Policy.Claim.LossType)){
                PEMI.add(new PageExposureMenuItem(c, cSubtype, expType));
              }
              }else{
                PEMI.add(new PageExposureMenuItem(c, cSubtype, expType));
              }
          }
        }  
      }
    }
    return PEMI as PageExposureMenuItem[];
  }


  
  /************************************************************************************************************
  *  @method containsReducedItem  Tells the user if this menu has been reduced in some way
  *  @param menuItems   The menuItems to check for splitting
  *  @return boolean    If the menu contains split items
  */
  public static function containsReducedItem( menuItems : ExposureMenuItem[] ) : boolean {
    var result : boolean = false;
    for(item in menuItems){
      if(item.Name=="Watercrafts" || item.Name=="Properties" || item.Name=="Vehicles" || 
         item.Name=="Equipment" || item.Name=="Policy Level Coverages"){
        result = true;
      }
    }
    
    return result;
  }
  /************************************************************************************************************
   *  @method getTitleForNewExposure
   *  @param cov    The coverage we're getting the exposure title for
   *  @returns      A string which is populated for the exposure title
   */
  public static function getTitleForNewExposure(cov : Coverage, menuType : String) : String {
    var title : StringBuilder = new StringBuilder("\n");
    var state = cov.State==null ? "(No State)" : "(" + cov.State.DisplayName + ")";
    var prop : LocationBasedRU;
    var veh : VehicleRU;
    
    if(menuType.equalsIgnoreCase("reduced menu")){
      title.append(getReducedTitle( cov.Policy.Claim.LossType, cov ));
    } else {
      if(cov.Subtype=="PolicyCoverage"){
        title.append("Policy Level Coverage " + state);
      } else {
        if(cov.Subtype=="PropertyCoverage"){
          for(prpty in cov.Policy.Properties){
            if(prpty.Property==((cov as PropertyCoverage).RiskUnit as LocationBasedRU).Property){
              prop = prpty;
            }
          }
        } else if(cov.Subtype=="VehicleCoverage"){
          for(auto in cov.Policy.Vehicles){
            if(auto.Vehicle==((cov as VehicleCoverage).RiskUnit as VehicleRU).Vehicle){
              veh = auto;
            }
          }
        }
        switch(cov.Policy.Claim.LossType){
          case TC_EQUINE:
            title.append(util.exposures.ExposureMenuUtilsEQUINE.getTitleEquine( prop ));
            break;
          case TC_AGRIAUTO:
            title.append(util.exposures.ExposureMenuUtilsAGRIAUTO.getTitleAgriAuto( veh ));
            break;
          case TC_AGRILIABILITY:
            title.append(util.exposures.ExposureMenuUtilsAGRILIABILITY.getTitleAgriLiability( cov, veh ));            
            break;
          case TC_AGRIPROPERTY:
            title.append(util.exposures.ExposureMenuUtilsAGRIPROPERTY.getTitleAgriProperty( prop ));
            break;
          case TC_PIMINMARINE:
            title.append(util.exposures.ExposureMenuUtilsPIMINMARINE.getTitleInlandMarine( cov, prop, veh ));
            break;
          case TC_ALTMARKETSAUTO:
            title.append(util.exposures.ExposureMenuUtilsAGRIAUTO.getTitleAgriAuto( veh ));
            break;
          case TC_SHSAUTO:
            title.append(util.exposures.ExposureMenuUtilsAGRIAUTO.getTitleAgriAuto( veh ));
            break;
          case TC_TRUCKINGAUTO:
            title.append(util.exposures.ExposureMenuUtilsAGRIAUTO.getTitleAgriAuto( veh ));
            break;
          default:
            break;
        }
      }
    }
    return title.toString();
  }
  
  /************************************************************************************************************
  *  @method getReducedTitle Used to get the title of the exposure menu piece
  *  @param LOB   The line of business we need this menu name for
  *         cov   The coverage this menu name is tied to for determining the subtype
  *  @return String The title we need for the menu
  */
  public static function getReducedTitle(LOB : LossType, cov : Coverage) : String {
    var title : StringBuilder = new StringBuilder("");
    if(cov.Subtype=="PolicyCoverage"){
      title.append("Policy Level Coverages");
    } else {
      switch(LOB){
        case TC_EQUINE:
        case TC_AGRIPROPERTY:
          title.append("Properties");
          break;
        case TC_AGRIAUTO:
          title.append("Vehicles");
          break;
        case TC_AGRILIABILITY:
          title.append("Watercrafts");
          break;
        case TC_PIMINMARINE:
          if(cov.Subtype=="PropertyCoverage")
            title.append("Properties");
          if(cov.Subtype=="VehicleCoverage")
            title.append("Equipment");
          break;
        case TC_ALTMARKETSAUTO:
          title.append("Vehicles");
          break;
        case TC_SHSAUTO:
          title.append("Vehicles");
          break;
        case TC_TRUCKINGAUTO:
          title.append("Vehicles");
          break;
        default:
          break;
      }
    }
    return title.toString();
  }
  //Debugging Help:
  /*print("-------------------------------- "+featureMenu.length);
  for(k in featureMenu){
    print((k as ExposureMenuItem).displaylabel)
    for(m in (k as ExposureMenuItem).Children){
      print("---" + m.displaylabel)
      for(n in m.Children){
        print("------" + n.displaylabel)
      }
    }
  }*/
  
  /**
   * Returns the New Feature Actions Menu on Claim.pcf. This function was
   * moved here from the code section of the Claim.pcf page as part of the 
   * changes required for Workers Comp. No changes were made to this function.
   * 
   * @param claim  the claim used to generate the menu
   */
  public static function getGAICCoverageMenu(claim : Claim) : util.exposures.ExposureMenuItem[] {
    var valueInDB = gw.api.exposure.NewExposureMenuUtil.getPolicyChecksum(claim);
    var currentLocale = User.util.CurrentLocale;
    var menuItemsChecksum : Object
    var menuItemsCacheValue : util.exposures.ExposureMenuItem[]
    var localeCache : gw.i18n.ILocale
    
    if (menuItemsChecksum != valueInDB || currentLocale != localeCache) {
      menuItemsCacheValue = util.exposures.ExposureMenuUtils.getExposureMenu(claim);
      menuItemsChecksum = valueInDB;
      localeCache = currentLocale;
    }
    return menuItemsCacheValue;
  }
}
