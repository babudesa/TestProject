package gaic.webservice.cc
uses gw.lang.ScriptParameters
uses java.lang.Exception
uses gw.api.util.Logger
uses gw.transaction.Transaction
uses gw.lang.reflect.IPropertyInfo
uses gw.api.admin.ScriptParameterUtil

@WebService
class IScriptParametersAPI {
  
  /**
  * Gets the Script Parameter value based on the Script Parameter Name passed
  * @param parameterName
  *         Name of the Script Parameter for which value has to be retrieved
  *         
  **/
  function getValue(parameterName: String) : String 
  {
    var param : java.lang.Class<Object>[] = {new String().Class};
    var c = java.lang.Class.forName("gw.lang.ScriptParameters");
    var m = c.getDeclaredMethod("getScriptValue", param);
    return m.invoke(null, new Object[]{parameterName}) as java.lang.String;
  }
  
  /**
  * Sets the Script Parameter based on the value passed
  * @param paramName
  *         Name of the Script Parameter for which value has to be set
  * @param paramValue
  *         Value to be set for the specific Script Parameter         
  **/
  function setITClaimsITOnly(paramName : String, paramValue : String)
  {
    try
    {
      Logger.logInfo("Inside the set Value method for Setting Script Parameter")
    
      var propInfos = new java.util.ArrayList<gw.lang.reflect.IPropertyInfo>(ScriptParameters.Type.TypeInfo.Properties)
                                                             .sortBy(\ s -> s.Name)
                                                             .toArray( new gw.lang.reflect.IPropertyInfo[0])
      var matchedPropInfo = propInfos.where(\ i -> i.Name.equals(paramName)).first()
      var scriptParam = gw.api.admin.ScriptParameterUtil.getOrCreateScriptParameter(matchedPropInfo)
      
      Transaction.runWithNewBundle(\ bundle ->
      {
        scriptParam = bundle.add(scriptParam)        
        scriptParam.BitValue = paramValue as java.lang.Boolean
        bundle.commit()
      }, "su")
    }
    catch (e : Exception)
    {
      Logger.logError("Exception while updating the Script Paramater with the exception message "+e.printStackTrace())
    }
  }
  
  /**
  * Sets the Script Parameter for the Current Conversion Load Command ID based on the value passed
  * @param paramName
  *         Name of the Script Parameter for which value has to be set
  * @param paramValue
  *         Value to be set for the specific Script Parameter         
  **/
  function setCurrentConversionLoadCommandID (paramName : String, paramValue : String)
  {
    try
    {
      Logger.logInfo("Inside the set Load Command ID method for Setting Script Parameter with the value "+paramValue)
    
      var propInfos = new java.util.ArrayList<gw.lang.reflect.IPropertyInfo>(ScriptParameters.Type.TypeInfo.Properties)
                                                             .sortBy(\ s -> s.Name)
                                                             .toArray( new gw.lang.reflect.IPropertyInfo[0])
      var matchedPropInfo = propInfos.where(\ i -> i.Name.equals(paramName)).first()
      var scriptParam = gw.api.admin.ScriptParameterUtil.getOrCreateScriptParameter(matchedPropInfo)
      
      Transaction.runWithNewBundle(\ bundle ->
      {
        scriptParam = bundle.add(scriptParam)        
        scriptParam.IntegerValue = paramValue as java.lang.Integer
        bundle.commit()
      }, "su")
    }
    catch (e : Exception)
    {
      Logger.logError("Exception while updating the Script Paramater with the exception message "+e.printStackTrace())
    }
  }
  
  /**
  * Sets the Script Parameter for the Current Conversion Load Command ID by fetching the latest LoadCommandID 
  * from CC_LoadCommand table
  * 
  * @param paramName
  *         Name of the Script Parameter for which value has to be set      
  **/
  function setCurrentLoadCommandID (paramName : String)
  {
    try
    {
      Logger.logInfo("Fecthing the latest Load Command ID from CC_LoadCommand table")
      var loadCommandQuery = gw.api.database.Query.make(entity.LoadCommand)
      var loadCommand = loadCommandQuery.compare("CommandType", Equals,LoadCommandType.TC_SOURCELOADED).select()
                                        .thenByDescending(\ l -> l.ID).FirstResult
                                        
      Logger.logInfo("Latest LoadCommand ID fetched is "+loadCommand.ID)                                        
      setCurrentConversionLoadCommandID(paramName, loadCommand.ID as java.lang.String)                                      
    }
    catch(e : Exception)
    {
      Logger.logError("Exception while fetching the latest Loadcommand ID from CC_LoadCommand "+e.printStackTrace())
    }
  }
}
