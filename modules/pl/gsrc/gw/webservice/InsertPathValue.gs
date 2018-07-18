package gw.webservice;
uses gw.api.webservice.IInsertPathValue;

/**
 * <p>
 * Represents the location and type of an entity to insert. Used in conjunction with 
 * <code>IDataObjectAPI.setPathValues(String,String,InsertPathValue[],PathValue[],String[])</code>.</p>
 */
@Deprecated("Part of IDataObjectAPI")
class InsertPathValue implements IInsertPathValue
{
  /**
   * Path from root entity to location where to insert this new entity. The leaf
   * of the path must null or refer to an array or a foreign key link. If the
   * path is null then a new "rootless" entity will be inserted.
   */
  var _path : String as Path

  /**
   * RefId of this newly inserted entity. The RefId is defined by the caller and
   * is used to set properties on the newly inserted entity.
   */
  var _refId : String as RefId

  /**
   * Type of entity to insert at the location. If the type is null then it is
   * inferred from the location. For example, if the location is an array, then
   * the entity created will be of the array's element type. However, if the
   * location refers to an abstract type, then this value must be specified.
   */
  var _entityName : String as EntityName

  construct()
  {
    
  }
}
