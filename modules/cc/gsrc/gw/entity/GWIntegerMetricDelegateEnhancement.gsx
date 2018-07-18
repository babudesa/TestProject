package gw.entity
uses java.lang.Integer
uses gw.api.util.Math

enhancement GWIntegerMetricDelegateEnhancement : entity.IntegerMetricDelegate {
  
  function getApplicableDisplayValue(value : Integer) : String {
    var absValue = Math.abs(value) as String
    return value < 0 ? displaykey.Web.Metric.NegativeValue(absValue) : absValue
  }

}
