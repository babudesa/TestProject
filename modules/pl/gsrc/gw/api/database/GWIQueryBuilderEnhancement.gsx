package gw.api.database
uses gw.entity.IEntityPropertyInfo
uses gw.entity.IEntityType
uses gw.entity.IQueryablePropertyInfo
uses gw.lang.reflect.IType
uses gw.entity.ILinkPropertyInfo
uses gw.lang.reflect.MethodCallValidator
uses gw.lang.parser.IBlockSymbol

enhancement GWIQueryBuilderEnhancement<QT extends KeyableBean> : IQueryBuilder<QT>
{
  /**
   * Compares a column against a value given an operation type.
   *
   * Value types of Key, Bean, and typekeys are accepted
   *
   * A value type of DBFunction is handled as well.
   *
   * @param column The column to compare
   * @param op The operation
   * @param value The value
   * @return this.  Used for the builder pattern
   */
  function compare(column : String, op : Relop, value : Object) : Restriction<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "compare", {IQueryablePropertyInfo, Relop, Object}).CallHandler.handleCall(
        this, {PropertyResolver.getProperty(this.EntityType, column), op, value}) as Restriction<QT>
  }
  
  /**
   * Compares a column against a range.
   *
   * @param column The column to compare
   * @param range the range to compare against.  The range may be upper or lower bounder, or a complete range.
   * @return this.  Used for the builder pattern
   */
  function compare(column : String, value : Range) : Restriction<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "compare", {IQueryablePropertyInfo, Range}).CallHandler.handleCall(
        this, {PropertyResolver.getProperty(this.EntityType, column), value}) as Restriction<QT>
  }
  
  /**
   * Compares a column against two values using a between clause.
   * This will throw an exception if either startValue or endValue, or both are null.
   *
   * Value types of Key, Bean, and typekeys are accepted
   *
   * A value type of DBFunction is handled as well.
   *
   * @param column The column to compare
   * @param startValue The start value of the between
   * @param endValue The end value of the between
   * @return this.  Used for the builder pattern
   */
  function between(column : String, startValue : Object, endValue : Object) : Restriction<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "between", {IQueryablePropertyInfo, Object, Object}).CallHandler.handleCall(
        this, {PropertyResolver.getProperty(this.EntityType, column), startValue, endValue}) as Restriction<QT>
  }
  
  /**
   * Compares a column against a range of values using an in clause
   *
   * @param column The column to compare
   * @param values The values to compare using an in clause
   * @return this.  Used for the builder pattern
   */
  function compareIn(column : String, values : Object[]) : Restriction<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "compareIn", {IQueryablePropertyInfo, Object[]}).CallHandler.handleCall(
        this, {PropertyResolver.getProperty(this.EntityType, column), values}) as Restriction<QT>
  }
  
  /**
   * Compares a column against a range of values using a not in clause
   *
   * @param column The column to compare
   * @param values The values to compare using a not in clause
   * @return this.  Used for the builder pattern
   */
  function compareNotIn(column : String, values : Object[]) : Restriction<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "compareNotIn", {IQueryablePropertyInfo, Object[]}).CallHandler.handleCall(
        this, {PropertyResolver.getProperty(this.EntityType, column), values}) as Restriction<QT>
  }
  
  /**
   * Compares a varchar column against a string value using a starts-with clause (i.e. column='string%'
   *
   * @param column The column to compare
   * @param values The values to compare using an in clause
   * @param ignoreCase True to do a case-insensitive search, false if not
   * @return this.  Used for the builder pattern
   */
  function startsWith(column : String, value : String, ignoreCase : boolean) : Restriction<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "startsWith", {IQueryablePropertyInfo, String, boolean}).CallHandler.handleCall(
        this, {PropertyResolver.getProperty(this.EntityType, column), value, ignoreCase}) as Restriction<QT>
  }
  
  /**
   * Compares a varchar column against a string value using a contains clause (i.e. column='%string%'
   *
   * @param column The column to compare
   * @param values The values to compare using an in clause
   * @param ignoreCase True to do a case-insensitive search, false if not
   * @return this.  Used for the builder pattern
   */
  function contains(column : String, value : String, ignoreCase : boolean) : Restriction<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "contains", {IQueryablePropertyInfo, String, boolean}).CallHandler.handleCall(
        this, {PropertyResolver.getProperty(this.EntityType, column), value, ignoreCase}) as Restriction<QT>
  }
  
  /**
   * Joins a table with this table using a sub-select clause.
   *
   * Two columns are required, a column in the current table and a column in the join table.
   *
   * This will generate an IN clause if the operation is <i>CompareIn</i>.
   *
   * This will generate a NOT EXISTS clause if the operation is <i>CompareNotIn</i>
   *
   * @param columnInThisTable the column in the current table to compare against
   * @param op the in clause operation
   * @param columnInJoinTable the column in the joining table
   * @return this.  Used for the builder pattern
   */
  function subselect(columnInThisTable : String, op : InOperation, typeToJoinTo : IEntityType, columnInJoinTable : String) : Table<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "subselect", {IEntityPropertyInfo, InOperation, IEntityPropertyInfo}).CallHandler.handleCall(
        this, {PropertyResolver.getProperty(this.EntityType, columnInThisTable), op, PropertyResolver.getProperty(typeToJoinTo, columnInJoinTable)}) as Table<QT>
  }
  
  /**
   * Joins a table with this table using a sub-select clause.
   *
   * Two columns are required, a column in the current table and a column in the join table.
   *
   * This will generate an IN clause if the operation is <i>CompareIn</i>.
   *
   * This will generate a NOT EXISTS clause if the operation is <i>CompareNotIn</i>
   *
   * @param dbFunction a DB function wrapping a column in the current table
   * @param op the in clause operation
   * @param columnInJoinTable the column in the joining table
   * @return this.  Used for the builder pattern
   */
  function subselect(columnInThisTable : String, op : InOperation, joinFunction : DBFunction) : Table<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "subselect", {IEntityPropertyInfo, InOperation, DBFunction}).CallHandler.handleCall(
        this, {PropertyResolver.getProperty(this.EntityType, columnInThisTable), op, joinFunction}) as Table<QT>
  }
  
  /**
   * Joins a table with this table using a sub-select clause.
   *
   * Two columns are required, a column in the current table and a column in the join table.
   *
   * This will generate an IN clause if the operation is <i>CompareIn</i>.
   *
   * This will generate a NOT EXISTS clause if the operation is <i>CompareNotIn</i>
   *
   * @param columnInThisTable the column in the current table to compare against
   * @param op the in clause operation
   * @param columnInJoinTable the column in the joining table
   * @return this.  Used for the builder pattern
   */
  function subselect(thisTableFunction : DBFunction, op : InOperation,  typeToJoinTo : IEntityType, columnInJoinTable : String) : Table<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "subselect", {DBFunction, InOperation, IEntityPropertyInfo}).CallHandler.handleCall(
        this, {thisTableFunction, op, PropertyResolver.getProperty(typeToJoinTo, columnInJoinTable)}) as Table<QT>
  }
  
  /**
   * Joins a column from table with a column from another query.
   *
   * This will generate an IN clause if the operation is <i>CompareIn</i>.
   *
   * This will generate a NOT EXISTS clause if the operation is <i>CompareNotIn</i>
   *
   * @param columnInThisTable the column in the current table to compare against
   * @param op the in clause operation
   * @param queryToJoinTo the joining query
   * @param columnInQuery the joining column in the query
   * @return this.  Used for the builder pattern
   */
  function subselect(columnInThisTable : String, op : InOperation, queryToJoinTo : IQuery, columnInQuery : String) : Table<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "subselect", {IEntityPropertyInfo, InOperation, IQuery, IEntityPropertyInfo}).CallHandler.handleCall(
        this, {PropertyResolver.getProperty(this.EntityType, columnInThisTable), op, queryToJoinTo, PropertyResolver.getProperty(queryToJoinTo.EntityType, columnInQuery)}) as Table<QT>
  }
  
  /**
   * Joins a column wrapped by a function from table with a column from another query.
   *
   * This will generate an IN clause if the operation is <i>CompareIn</i>.
   *
   * This will generate a NOT EXISTS clause if the operation is <i>CompareNotIn</i>
   *
   * @param columnInThisTable the column in the current table to compare against
   * @param op the in clause operation
   * @param queryToJoinTo the joining query
   * @param columnInQuery the joining column in the query
   * @return this.  Used for the builder pattern
   */
  function subselect(columnInThisTable : String, op : InOperation, queryToJoinTo : IQuery, columnInQuery : DBFunction) : Table<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "subselect", {IEntityPropertyInfo, InOperation, IQuery, DBFunction}).CallHandler.handleCall(
        this, {PropertyResolver.getProperty(this.EntityType, columnInThisTable), op, queryToJoinTo, columnInQuery}) as Table<QT>
  }
  
  /**
   * Joins a column from table with a column wrapped by a function from another query.
   *
   * This will generate an IN clause if the operation is <i>CompareIn</i>.
   *
   * This will generate a NOT EXISTS clause if the operation is <i>CompareNotIn</i>
   *
   * @param columnInThisTable the column in the current table to compare against
   * @param op the in clause operation
   * @param queryToJoinTo the joining query
   * @param columnInQuery the joining column in the query
   * @return this.  Used for the builder pattern
   */
  function subselect(columnInThisTable : DBFunction, op : InOperation, queryToJoinTo : IQuery, columnInQuery : String) : Table<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "subselect", {DBFunction, InOperation, IQuery, IEntityPropertyInfo}).CallHandler.handleCall(
        this, {columnInThisTable, op, queryToJoinTo, PropertyResolver.getProperty(queryToJoinTo.EntityType, columnInQuery)}) as Table<QT>
  }

  /**
   * Used to join this table to another table via a foreign key in this table
   *
   * The FK will be joined with the ID of the corresponding table
   *
   * @param columnOnThisTable the FK to join through
   * @return this.  Used for builder pattern
   */
  function join(columnOnThisTable : String) : Table<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "join", {ILinkPropertyInfo}).CallHandler.handleCall( this, {PropertyResolver.getProperty(this.EntityType, columnOnThisTable)}) as Table<QT>
  }

  /**
   * Used to join this table to another table via a foreign key in another table.
   *
   * The FK will be joined with the ID of the corresponding table
   *
   * @param columnOnOtherTable the FK to join through
   * @return this.  Used for builder pattern
   */
  function join(type : IType, columnOnOtherTable : String) : Table<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "join", {ILinkPropertyInfo}).CallHandler.handleCall( this, {PropertyResolver.getProperty(type, columnOnOtherTable)}) as Table<QT>
  }

  /**
   * Used to join this table to another table via a foreign key in this table using an outer join
   *
   * The FK will be joined with the ID of the corresponding table
   *
   * @param columnOnThisTable the FK to join through
   * @return this.  Used for builder pattern
   */
  function outerJoin(columnOnThisTable : String) : Table<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "outerJoin", {ILinkPropertyInfo}).CallHandler.handleCall( this, {PropertyResolver.getProperty(this.EntityType, columnOnThisTable)}) as Table<QT>
  }

  /**
   * Used to join this table to another table via a foreign key in another table using an outer join
   *
   * The FK will be joined with the ID of the corresponding table
   *
   * @param columnOnOtherTable the FK to join through
   * @return this.  Used for builder pattern
   */
  function outerJoin(type : IType, columnOnOtherTable : String) : Table<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "outerJoin", {ILinkPropertyInfo}).CallHandler.handleCall( this, {PropertyResolver.getProperty(type, columnOnOtherTable)}) as Table<QT>
  }

  /**
   * Used to join another query as an inline view.  This will produce a query with the inlineViewQuery as a inline view and will automatically select
   * all referenced columns from that query in the select statement.  For example:
   * <code>
   * var viewQuery = Query.make(TestA)
   *
   * var outerQuery = Query.make(TestE)
   * var inlineView = outerQuery.inlineView("ID", viewQuery, "E")
   * outerQuery.compare("E", GreaterThan, inlineView.getColumnRef(DBFunction.Max("A")))
   *
   * print(outerQuery.select().AtMostOneRow.ID)
   * </code>
   *
   * This would print the id of a TestE where TestE.E > MAX(all TestA's related to this TestE) and would generate the SQL
   * <code>
   *   select * from TestE INNER JOIN (select E, Max(A) MAX_A from TestA) testA_view GROUP BY E ON TestE.ID = testA_view.E AND TestE.E > testA_view.MAX_A
   * </code>
   */
  function inlineView(joinColumnOnThisTable : String, inlineViewQuery : Query, joinColumnOnViewTable : String) : Table<QT> {
    return IQueryBuilder.Type.TypeInfo.getMethod( "inlineView", {IEntityPropertyInfo, Query, IEntityPropertyInfo}).CallHandler.handleCall( this,
    {PropertyResolver.getProperty(this.EntityType, joinColumnOnThisTable), inlineViewQuery, PropertyResolver.getProperty(inlineViewQuery.EntityType, joinColumnOnViewTable)}) as Table<QT>
  }

  /**
   * Returns a reference to the given column
   * @param column the column to get a reference from.  The column must be on this table
   * @return a reference to the given column
   */
  function getColumnRef(column : String) : ColumnRef {
    return IQueryBuilder.Type.TypeInfo.getMethod( "getColumnRef", {IEntityPropertyInfo}).CallHandler.handleCall( this, {PropertyResolver.getProperty(this.EntityType, column)}) as ColumnRef
  }

  @MethodCallValidator("gw.api.database.QueryColumnParser")
  function select<RT>(columns : block(row : QT) : RT) : IQueryResult<QT, RT> {
    var res = QueryColumnParser.select<QT,RT>( this, columns as IBlockSymbol)
    return res
  }

}
