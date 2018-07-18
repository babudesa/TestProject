package gw.entity
uses java.math.BigDecimal
uses java.text.NumberFormat
uses gw.datatype.DataTypes
uses gw.api.util.Math

enhancement GWPercentMetricDelegateEnhancement : entity.PercentMetricDelegate {

  function getApplicableDisplayValue(value : BigDecimal) : String {
    var absValue = value.abs()
    // Force scale to 2 for this last division; Java percent format only shows 2 digits
    var absRatio : Object = absValue.divide(BigDecimal.valueOf(100 as long), 2, HALF_UP)
    var percentValue = NumberFormat.getPercentInstance().format(absRatio)
    return value < 0 ? displaykey.Web.Metric.NegativeValue(percentValue) : percentValue
  }
  
  function fractionToPercentage(numerator : BigDecimal, denominator : BigDecimal) : BigDecimal {
    var percentageDecScale = DataTypes.percentagemetric().asConstrainedDataType().getScale( null, null )
    var ratio = numerator.divide(denominator, 2 + Math.Nz( percentageDecScale ), HALF_UP)
    return ratio.movePointRight( 2 )
  }

}
