package gw.exposure.metric.financials
uses gw.api.exposure.metric.MoneyExposureMetricMethodsImpl
uses java.util.Date
uses gw.api.financials.FinancialsCalculationUtil
uses gw.api.metric.MetricUpdateHelper

@Export
class NetTotalIncurredExposureMetricMethodsImpl extends MoneyExposureMetricMethodsImpl {
  construct(netTotalIncurredExposureMetric : NetTotalIncurredExposureMetric) {
    super(netTotalIncurredExposureMetric)
  }

  override function updateMetricValue(helper : MetricUpdateHelper) : Date {
    if (helper.updateContainsChangesOfType(TransactionSet) 
        or helper.updateContainsChangesOfType( Payment )
        or Metric.New) {
      Metric.MoneyValue = FinancialsCalculationUtil.getTotalIncurredNet().getAmount(Metric.Exposure)
    }
    return null
  }  
}
