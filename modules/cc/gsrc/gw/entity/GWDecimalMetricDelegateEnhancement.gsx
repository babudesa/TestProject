package gw.entity
uses java.math.BigDecimal
uses java.math.RoundingMode

enhancement GWDecimalMetricDelegateEnhancement : entity.DecimalMetricDelegate {
  
  function getApplicableDisplayValue(value : BigDecimal, displayScale : int) : String {
    var absValue = value.setScale(displayScale, RoundingMode.HALF_UP).abs().toString()
    return value < 0 ? displaykey.Web.Metric.NegativeValue(absValue) : absValue
  }

}
