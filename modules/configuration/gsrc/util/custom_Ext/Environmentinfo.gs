package util.custom_Ext

class EnvironmentInfo {

  construct() {

  }
 //  //for testing change env. to local, but be sure to change it back to cert, uat, prod
  static  function showField() :Boolean{
     var flag = false;
     var env = gw.api.system.server.ServerUtil.getEnv();   
     if((env ==  "prod" || env =="cert"))
         flag = false;         
     else
         flag = true;
    return flag    
  }
}