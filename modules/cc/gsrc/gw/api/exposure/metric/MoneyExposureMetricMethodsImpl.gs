package gw.api.exposure.metric

uses java.math.BigDecimal
uses gw.api.metric.MetricLimitMethods
uses java.lang.Comparable
uses gw.api.financials.CurrencyAmount
uses gw.api.metric.MetricLimitMatchQuality

@ReadOnly
class MoneyExposureMetricMethodsImpl extends ExposureMetricMethodsImpl {
  
  construct(decimalExposureMetric : MoneyExposureMetric) {
    super(decimalExposureMetric)
  }
  
  override property get Metric() : MoneyExposureMetric {
    return super.Metric as MoneyExposureMetric
  }
    
  override property get Value() : CurrencyAmount {
    return Metric.MoneyValue
  }

  override property get LimitValue() : CurrencyAmount {
    return Applicable ? Value : 0
  }
  
  override property get ApplicableDisplayValue() : String {
    return Metric.getApplicableDisplayValue(Value)
  }

  override property get NotApplicableDisplayValue() : String {
    return Metric.ZeroDisplayValue
  }
  
  override property get IsNegative() : boolean {
    return Value < 0
  }

  override function formatTargetValue(targetValue : Comparable) : String {
    return Metric.getApplicableDisplayValue(targetValue as BigDecimal)
  }

  override function createDefaultLimit() : MetricLimitMethods {
    return new MoneyExposureMetricLimit() {
      :ExposureMetricType = Metric.Subtype,
      :MetricUnit = Unit,
      :AscendingLimitOrder = AscendingLimitOrder
    }
  }  

  override property get Unit() : MetricUnit {
    return "currency"
  }
  
  override function qualityOfLimitMatch(exposureLimit : ExposureMetricLimit) : MetricLimitMatchQuality {
    var result = MetricLimitMatchQuality.NoMatch
    if (exposureLimit.ExposureMetricType == Metric.Subtype) {
      if (exposureLimit.ExposureTier == Metric.Exposure.ExposureTier and exposureLimit.Currency == Metric.Exposure.Claim.Currency) {
        result = ExactMatch
      } else if (exposureLimit.ExposureTier == null and exposureLimit.Currency == Metric.Exposure.Claim.Currency) {
        result = DefaultMatch
      }
    }
    return result
  }  
}  
  