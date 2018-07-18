package gw.exposure.metric.financials
uses gw.api.exposure.metric.PercentExposureMetricMethodsImpl
uses java.util.Date
uses gw.api.financials.FinancialsCalculationUtil
uses java.math.BigDecimal
uses gw.api.metric.MetricUpdateHelper

@Export
class PercentPaidLossCostsExposureMetricMethodsImpl extends PercentExposureMetricMethodsImpl {
  
  construct(percentPaidLossCostsExposureMetric : PercentPaidLossCostsExposureMetric) {
    super(percentPaidLossCostsExposureMetric)
  }
  
  override function updateMetricValue(helper : MetricUpdateHelper) : Date {
    var exposure = Metric.Exposure
    
    if (helper.updateContainsChangesOfType(Payment) or Metric.New) {
      var totalPaymentsCalculator = FinancialsCalculationUtil.getTotalPayments()
      var claimCostPayment = totalPaymentsCalculator.getAmount( exposure, CostType.TC_CLAIMCOST )
      var totalPayment = totalPaymentsCalculator.getAmount( exposure )
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
