package gw.api.metric

/**
 * Utility methods for all MetricLimits; these methods need access to the Currency property which is why
 * they are in an enhancement on MetricLimit.
 */
@ReadOnly
enhancement GWMetricLimitEnhancement : gw.api.metric.MetricLimit {
  
  property get UnitLabel() : String {
    return this.Unit == "currency"
            ? displaykey.Web.Admin.EditMetricLimitRowSet.MoneyMetricLimit.Unit(this.Unit.DisplayName, this.Currency.DisplayName)
            : this.Unit.DisplayName
  }
  
}
