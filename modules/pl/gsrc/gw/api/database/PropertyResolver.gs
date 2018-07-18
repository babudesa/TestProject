package gw.api.database
uses gw.entity.IEntityPropertyInfo
uses gw.lang.reflect.IType
uses java.lang.IllegalArgumentException

internal class PropertyResolver
{
  private construct()
  {
  }
  
  public static function getProperty(type : IType, column : String) : IEntityPropertyInfo {
    var dotIndex = column.indexOf( "." )
    if (dotIndex != -1) {
      var columnPart = column.substring(dotIndex+1)
      if (column.substring( 0, dotIndex ) != type.RelativeName || columnPart.indexOf( "." ) != -1) {
        throw new IllegalArgumentException("Property path must be of the form \"" + type.RelativeName + ".Property\" or just \"Property\"")
      }
      column = columnPart
    }
    var prop = type.TypeInfo.getProperty( column )
    if (prop == null) {
      throw new IllegalArgumentException("Column not found: " + column)
    } else if (!(prop typeis IEntityPropertyInfo)) {
      throw new IllegalArgumentException("Column must be a database column: " + column)
    }
    return prop as IEntityPropertyInfo
  }

}
