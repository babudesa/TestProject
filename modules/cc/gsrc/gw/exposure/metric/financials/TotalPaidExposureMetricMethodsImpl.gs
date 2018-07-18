package gw.exposure.metric.financials
uses gw.api.exposure.metric.MoneyExposureMetricMethodsImpl
uses gw.api.financials.FinancialsCalculationUtil
uses java.util.Date
uses gw.api.metric.MetricUpdateHelper

@Export
class TotalPaidExposureMetricMethodsImpl extends MoneyExposureMetricMethodsImpl {
 construct(totalPaidExposureMetric : TotalPaidExposureMetric) {
    super(totalPaidExposureMetric)
  }

  override function updateMetricValue(helper : MetricUpdateHelper) : Date {
    if (helper.updateContainsChangesOfType(Payment) 
        or helper.updateContainsChangesOfType( TransactionLineItem )
        or Metric.New) {
      Metric.MoneyValue = FinancialsCalculationUtil.getTotalPayments().getAmount(Metric.Exposure) 
    }
    return null
  }
}
