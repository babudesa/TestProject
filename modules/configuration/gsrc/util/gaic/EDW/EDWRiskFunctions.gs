package util.gaic.EDW;

class EDWRiskFunctions {
  
  private construct() {
  }

  static function getInstance() : EDWRiskFunctions {
    return new EDWRiskFunctions();
  }

  function getPropertyIncidentRU(theproperty : PolicyLocation, thepolicy : Policy) : PropertyRU {
    var propertyIncidentRU : PropertyRU = null;
    if (theproperty != null && thepolicy != null) {
      for (item in thepolicy.Properties) {
        if (item.Property == theproperty && item typeis PropertyRU) {
          propertyIncidentRU = item;
          break;
        }
      }
    }
    
    return propertyIncidentRU;
  }
}
