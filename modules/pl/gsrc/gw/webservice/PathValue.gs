package gw.webservice;
uses gw.api.webservice.IPathValue;

/**
 * Represents the path and value to update.
 * <p/>
 * Used in conjunction with <code>IDataObjectAPI.setPathValues(String, String, InsertPathValue[], PathValue[], String[])</code>.
 */
@Deprecated("Part of IDataObjectAPI")
class PathValue implements IPathValue
{
  /**
   * Path from the root entity to the property to update.
   */
  var _path : String as Path
  
  /**
   * Path from the root entity to the property to update.
   */
  var _value : String as Value

  construct()
  {
  }
}
