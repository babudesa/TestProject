package gw.api.database
uses gw.lang.reflect.MethodCallValidator
uses gw.lang.parser.IBlockSymbol

enhancement GWIQueryResultEnhancement<QT extends KeyableBean, RT> : gw.api.database.IQueryResult<QT, RT>
{
  @MethodCallValidator("gw.api.database.QueryOrderByParser")
  function orderBy(column : block(row:QT):Object) : IQueryResult<QT,RT> {
    QueryOrderByParser.orderBy( this, column as IBlockSymbol, true, true )
    return this
  }
    
  @MethodCallValidator("gw.api.database.QueryOrderByParser")
  function orderByDescending(column : block(row:QT):Object) : IQueryResult<QT,RT> {
    QueryOrderByParser.orderBy( this, column as IBlockSymbol, true, false )
    return this
  }
  
  @MethodCallValidator("gw.api.database.QueryOrderByParser")
  function thenBy(column : block(row:QT):Object) : IQueryResult<QT,RT> {
    QueryOrderByParser.orderBy( this, column as IBlockSymbol, false, true )
    return this
  }
  
  @MethodCallValidator("gw.api.database.QueryOrderByParser")
  function thenByDescending(column : block(row:QT):Object) : IQueryResult<QT,RT> {
    QueryOrderByParser.orderBy( this, column as IBlockSymbol, false, false )
    return this
  }
}
