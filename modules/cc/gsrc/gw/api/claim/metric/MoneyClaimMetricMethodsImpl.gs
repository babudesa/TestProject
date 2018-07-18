package gw.api.claim.metric
uses gw.api.metric.MetricLimitMatchQuality
uses java.math.BigDecimal
uses gw.api.metric.MetricLimitMethods
uses java.lang.Comparable
uses gw.api.financials.CurrencyAmount

@ReadOnly
class MoneyClaimMetricMethodsImpl extends ClaimMetricMethodsImpl {  
  
  construct(decimalClaimMetric : MoneyClaimMetric, category : ClaimMetricCategory) {
    super(decimalClaimMetric, category)
  }
  
  construct(decimalClaimMetric : MoneyClaimMetric) {
    this(decimalClaimMetric, "ClaimFinancialsMetrics")
  }
  
  override property get Metric() : MoneyClaimMetric {
    return super.Metric as MoneyClaimMetric
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
    return new MoneyClaimMetricLimit() {
      :ClaimMetricType = Metric.Subtype,
      :ClaimMetricCategory = Metric.ClaimMetricCategory,
      :MetricUnit = Unit,
      :AscendingLimitOrder = AscendingLimitOrder
    }
  }  

  override property get Unit() : MetricUnit {
    return "currency"
  }
  
  override function qualityOfLimitMatch(claimLimit : ClaimMetricLimit) : MetricLimitMatchQuality {
    var result = MetricLimitMatchQuality.NoMatch
    if (claimLimit.ClaimMetricType == Metric.Subtype) {
      if (claimLimit.ClaimTier == Metric.Claim.ClaimTier and claimLimit.Currency == Metric.Claim.Currency) {
        result = ExactMatch
      } else if (claimLimit.ClaimTier == null and claimLimit.Currency == Metric.Claim.Currency) {
        result = DefaultMatch
      }
    }
    return result
  }  
}
