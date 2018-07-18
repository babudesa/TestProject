package gw.api.database

uses gw.entity.IEntityType

enhancement GWQueryEnhancement<QT extends KeyableBean> : Query<QT>
{  
  static function make<T extends KeyableBean>(type : Type<T>) : Query<T> {
    var query = Query.Type.TypeInfo.getConstructor( {IEntityType} ).Constructor.newInstance({type}) as Query<T>
    query.setRootName("gRoot")
    return query
  }
}
