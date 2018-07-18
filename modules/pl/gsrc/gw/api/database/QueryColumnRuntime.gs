package gw.api.database
uses gw.lang.parser.IExpressionRuntime
uses gw.lang.parser.expressions.IFieldAccessExpression

class QueryColumnRuntime implements IExpressionRuntime {
  private var _element   : IFieldAccessExpression as Element
  
  override function evaluate() : Object {
    if ("row.A" == _element as String) {
      return 10
    }
    if ("row.E.E" == _element as String) {
      return 100
    }
    if ("row.E.F.F" == _element as String) {
      return 1000
    }
    if ("row.A" == _element as String) {
      return 10
    }
    throw "foobar"
  }
}
