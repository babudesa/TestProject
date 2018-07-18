package gw.api.database
uses gw.entity.IEntityPropertyInfo
uses gw.entity.IEntityType
uses java.lang.Integer
uses java.math.BigDecimal

enhancement GWDBFunctionEnhancement : DBFunction
{
  /**
   * @param column the column to wrap
   * @return the sum value for the given column
   */
  static function Sum(type : IEntityType, column : String) : DBFunction {
    return DBFunction.Type.TypeInfo.getMethod( "Sum", {IEntityPropertyInfo}).CallHandler.handleCall( 
      null, {PropertyResolver.getProperty( type, column )}) as DBFunction
  }
  /**
   * @param column the column to wrap
   * @return the sum value for the given column
   */
  static function Sum<T extends java.lang.Number>(protoValue : T) : T {
    return protoValue
  }
  /**
   * @param column the column to wrap
   * @return the sum value for the given column
   */
  static function Sum<T extends java.lang.Number>(protoValue : T[]) : T {
    return null
  }
  /**
   * @param column the column to wrap
   * @return the max value for the given column
   */
  static function Max(type : IEntityType, column : String) : DBFunction {
    return DBFunction.Type.TypeInfo.getMethod( "Max", {IEntityPropertyInfo}).CallHandler.handleCall( 
      null, {PropertyResolver.getProperty( type, column )}) as DBFunction
  }

  /**
   * @param column the column to wrap
   * @return the max value for the given column
   */
  static function Max<T extends java.lang.Number>(protoValue : T) : T {
    return protoValue
  }
  /**
   * @param column the column to wrap
   * @return the max value for the given column
   */
  static function Max<T extends java.lang.Number>(protoValue : T[]) : T {
    return null
  }
  /**
   * @param column the column to wrap
   * @return the max value for the given column
   */
  static function Max(protoValue : Key) : Key {
    return protoValue
  }
  /**
   * @param column the column to wrap
   * @return the max value for the given column
   */
  static function Max(protoValue : Key[]) : Key {
    return null
  }
  /**
   * @param column the column to wrap
   * @return the min value for the given column
   */
  static function Min(type : IEntityType, column : String) : DBFunction {
    return DBFunction.Type.TypeInfo.getMethod( "Min", {IEntityPropertyInfo}).CallHandler.handleCall( 
      null, {PropertyResolver.getProperty( type, column )}) as DBFunction
  }
  /**
   * @param column the column to wrap
   * @return the min value for the given column
   */
  static function Min<T extends java.lang.Number>(protoValue : T) : T {
    return protoValue
  }
  /**
   * @param column the column to wrap
   * @return the min value for the given column
   */
  static function Min<T extends java.lang.Number>(protoValue : T[]) : T {
    return null
  }
  /**
   * @param column the column to wrap
   * @return the min value for the given column
   */
  static function Min(protoValue : Key) : Key {
    return protoValue
  }
  /**
   * @param column the column to wrap
   * @return the min value for the given column
   */
  static function Min(protoValue : Key[]) : Key {
    return null
  }
  /** 
   * @param column the column to wrap
   * @return the average value for the given column
   */
  static function Avg(type : IEntityType, column : String) : DBFunction {
    return DBFunction.Type.TypeInfo.getMethod( "Avg", {IEntityPropertyInfo}).CallHandler.handleCall( 
      null, {PropertyResolver.getProperty( type, column )}) as DBFunction
  }
  /**
   * @param column the column to wrap
   * @return the average value for the given column
   */
  static function Avg<T extends java.lang.Number>(protoValue : T) : BigDecimal {
    return protoValue
  }
  /**
   * @param column the column to wrap
   * @return the average value for the given column
   */
  static function Avg<T extends java.lang.Number>(protoValue : T[]) : BigDecimal {
    return null
  }
  /**
   * @param column the column to wrap
   * @return the count value for the given column
   */
  static function Count(type : IEntityType, column : String) : DBFunction {
    return DBFunction.Type.TypeInfo.getMethod( "Count", {IEntityPropertyInfo}).CallHandler.handleCall( 
      null, {PropertyResolver.getProperty( type, column )}) as DBFunction
  }
  /**
   * @param column the column to wrap
   * @return the count value for the given column
   */
  static function Count(protoValue : Object) : Integer {
    return 0
  }
  /**
   * @param column the column to wrap
   * @return the count value for the given column
   */
  static function Count(protoValue : Object[]) : Integer {
    return null
  }
}
