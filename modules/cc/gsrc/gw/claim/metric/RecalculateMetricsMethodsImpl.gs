package gw.claim.metric
uses java.util.Date
uses gw.api.claim.metric.RecalculateMetrics

/**
 * Used when a claim's ClaimMetricRecalculationTime object indicates that it is
 * time to recalculate metrics.
 */
class RecalculateMetricsMethodsImpl implements RecalculateMetrics {
  
  var _recalculationTime : ClaimMetricRecalculationTime

  construct(recalculationTime : ClaimMetricRecalculationTime) {
    _recalculationTime = recalculationTime
  }
  
  /**
   * Called when a claim's ClaimMetricRecalculationTime object indicates that it is
   * time to recalculate metrics. There is a small chance that this method will be
   * called multiple times so it should always check that the next recalculation time
   * has actually passed before it does anything.
   * <p>
   * The implementation recalculates all the metrics and indicators that implement
   * the RecalculatableClaimMetric interface and then updates the NextRecalculationTime
   * field appropriately.
   * <p>
   * The result returned from this particular implementation of recalculate is always
   * null, because it updates the recalculation time internally if it needs to.
   */
  override function recalculate() : Date {
    if (_recalculationTime.NextRecalculationTime != null
        and _recalculationTime.NextRecalculationTime <= Date.CurrentDate) {
      gw.transaction.Transaction.runWithNewBundle( \ bundle -> {
        var recalculationTime = bundle.add(_recalculationTime)
        var earliestTime : Date = null
        for (metric in recalculationTime.findMetricsToRecalculate()) {
          var time = metric.recalculate()
          if (time != null and (earliestTime == null || earliestTime > time)) {
            earliestTime = time
          }
        }
        recalculationTime.NextRecalculationTime = earliestTime
      })
    }
    return null
  }

}
