package util.custom_Ext;
uses java.util.ArrayList

class getStates
{
  construct()
  {
  }
  
  static function getUSStatesOnly():List{
    var states:List = new ArrayList()
    
    for(state in State.getTypeKeys(false)){
      if(state.hasCategory( Country.TC_US )){
        states.add(state)
      }
    }
    
    return states    
  }
  
  static function getUSCanadaStates():List{
    var states:List = new ArrayList()
    
    for(state in State.getTypeKeys(false)){
      if(state.hasCategory( Country.TC_US ) || state.hasCategory( Country.TC_CA )){
        states.add(state)
      }
    }
    
    return states
  }

  /*
  *  Verify that the stateCode contains the category of the countryCode for filtering
  *  a state typelist based on a country.
  *  Sprint/Maintenance Release: EM 10
  *  Author: Zach Thomas
  *  Date: 4/25/08
  */
  static function filterStateFromCountry ( countryCode:String, stateCode:String) : Boolean {
    var result:Boolean = false;
    
    if(countryCode != null){
      for(countryKey in Country.getTypeKeys(false)){
        if(countryKey.Code == countryCode){
          for(stateKey in State.getTypeKeys(false)){
            if(stateKey.Code == stateCode and stateKey.hasCategory( countryKey )){
              result = true;
              break;
            }
          }
          break;
        }
      }  
    }else{
      result = true;
    }
    return result;
  }
}
