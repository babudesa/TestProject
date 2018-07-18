package util.exposures;
uses java.util.ArrayList;
uses java.util.SortedMap;
uses java.util.TreeMap;

class ExposureMenuUtilsEQUINE
{
  construct()
  {
  }
  /************************************************************************************************************
  *  @method buildEquineMenu
  *  @param featureMenu    The currently built feature menu that properties will be added to
  *         c              The claim this feature menu belongs to
  *  @returns              The feature menu with added on properties
  */
  public static function buildEquineMenu(featureMenu : List, c : Claim) : List {
    if(c.Policy.Properties.length>0){
      featureMenu = buildPropertyMenu( featureMenu, c );
    }
    return featureMenu;
  }
 
  public static function buildPropertyMenu(featureMenu : List, c : Claim) : List {
    var horseMenu : SortedMap = new TreeMap(new util.custom_Ext.AlphanumericSorting());
    var horseDesc = null
    for(item in c.Policy.Properties){
      if(item.Coverages.length > 0){
         if(item typeis PropertyRU){
           horseDesc = item.Property.LocationNumber == null ? "No Desc. Found " : (item.Property.LocationNumber + " " + "(" + item.PropertyNumberExt + ", "+item.Property.ex_AnimalUse.DisplayName + ")");
         }
        var key  = horseDesc+item.Property.PublicID 
         horseMenu.put( key, new ExposureMenuItem( horseDesc, item ));
      }
    }
    featureMenu.addAll( horseMenu.Values );
    horseMenu.clear();  
    
    return featureMenu;
  }
  
  
    /************************************************************************************************************
  *  @method createPropertyGroups
  *  @param menuList The list of properties to be put into groups
  *  @returns a new list where the properties are grouped
  */
  public static function createPropertyGroups(featureMenu : List) : List<ExposureMenuItem> {
    var horseMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var risksMenu : List<ExposureMenuItem> = new ArrayList<ExposureMenuItem>();
    var counter = 0;
    var maxGroupSize = ScriptParameters.FeatureMenu_MaxGroupSize;
    
    for(menuItem in featureMenu as ExposureMenuItem[]){
      if(menuItem.PolicyProperty!=null){
        risksMenu.add(menuItem);
        counter = counter + 1;
        if((counter % maxGroupSize) == 0){
          horseMenu.add( new ExposureMenuItem("Property " + (counter - maxGroupSize + 1) + " to " + counter, risksMenu))
          risksMenu.clear();  
        }
      }
    }
    if(risksMenu.length > 0){
      horseMenu.add( new ExposureMenuItem("Property " + (counter - risksMenu.length + 1) + " to " + counter, risksMenu))
      risksMenu.clear();    
    }

    return horseMenu;
  }
  
  /************************************************************************************************************
  *  @method getTitleEquine
  *  @param prop    Property we're building the title of off if one exists
  *  @returns a new list where the equipment are grouped
  */
  public static function getTitleEquine( prop : LocationBasedRU ) : String {
    return prop.Property.LocationNumber == null ? "No Desc. Found " : (prop.Property.LocationNumber + " ");
  }
}
