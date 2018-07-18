package gw.claim.metric.financials
uses gw.api.financials.FinancialsCalculationUtil
uses java.util.Date
uses java.math.BigDecimal
uses gw.api.claim.metric.PercentClaimMetricMethodsImpl
uses gw.api.metric.MetricUpdateHelper

@Export
class PercentPaidLossCostsClaimMetricMethodsImpl extends PercentClaimMetricMethodsImpl {
  
  construct(percentPaidLossCostsClaimMetric : PercentPaidLossCostsClaimMetric) {
    super(percentPaidLossCostsClaimMetric, "ClaimFinancialsMetrics")
  }
  
  override function updateMetricValue(helper : MetricUpdateHelper) : Date {
    var claim = Metric.Claim
    
    if (helper.updateContainsChangesOfType(Payment) or Metric.New) {
      var totalPaymentsCalculator = FinancialsCalculationUtil.getTotalPayments()
      var claimCostPayment = totalPaymentsCalculator.getAmount( claim, CostType.TC_CLAIMCOST )
      var totalPayment = totalPaymentsCalculator.getAmount( claim )
      if (totalPayment == null or totalPayment.Amount.IsZero) {
        Metric.PercentValue = null
      } else if (claimCostPayment == null) {
        Metric.PercentValue = BigDecimal.valueOf(0)
      } else {
        setValueToRatio(claimCostPayment.Amount, totalPayment.Amount)
      }
    }
    return null
  }

  override property get AscendingLimitOrder() : boolean {
    return false
  }
}
