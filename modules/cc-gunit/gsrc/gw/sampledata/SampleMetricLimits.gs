package gw.sampledata
uses gw.transaction.Bundle
uses java.lang.Integer
uses gw.lang.reflect.TypeSystem
uses gw.api.util.CurrencyUtil
uses java.lang.IllegalStateException
uses gw.api.testdata.TestDataUtil

@Export
class SampleMetricLimits extends SampleDataBase {
  
  /**
   * Nested class for creating Claim metric limits. The addLimits() method
   * is effectively a terse description of all the limits we add. It could
   * also be replaced by code that reads in values from a spreadsheet.
   */
  private class ClaimMetricLimits {

    private var _bundle : Bundle
    
    construct(bundle : Bundle) {
      _bundle = bundle
    }
    
    function addLimits() {
      add("comp", "DaysOpenClaimMetric", null, 3, 2, 5)
      add("comp", "DaysOpenClaimMetric", "medicalonly", 45, 40, 90)
      add("comp", "DaysOpenClaimMetric", "indemnity", 90, 80, 150)
      add("comp", "DaysOpenClaimMetric", "el", 180, 165, 270)
      add("auto_per", "DaysOpenClaimMetric", null, 30, 25, 60)
      add("auto_per", "DaysOpenClaimMetric", "low", 10, 8, 20)
      add("auto_per", "DaysOpenClaimMetric", "high", 150, 140, 180)
      add("homeowners", "DaysOpenClaimMetric", null, 90, 80, 120)
      add("homeowners", "DaysOpenClaimMetric", "low", 30, 25, 40)
      add("homeowners", "DaysOpenClaimMetric", "high", 180, 160, 200)
      add("gen_liability", "DaysOpenClaimMetric", null, 250, 200, 300)
      add("gen_liability", "DaysOpenClaimMetric", "low", 50, 40, 80)
      add("gen_liability", "DaysOpenClaimMetric", "high", 500, 400, 750)
      add("businessowners", "DaysOpenClaimMetric", null, 90, null, null)
      add("auto_comm", "DaysOpenClaimMetric", null, 60, null, null)
      add("prop_comm", "DaysOpenClaimMetric", null, 180, null, null)
      add("farmowners", "DaysOpenClaimMetric", null, 60, null, null)
      add("travel_per", "DaysOpenClaimMetric", null, 30, null, null)
      add("comp", "DaysInitialContactWithInsuredClaimMetric", null, 1, 1, 2)
      add("auto_per", "DaysInitialContactWithInsuredClaimMetric", null, 1, 1, 2)
      add("homeowners", "DaysInitialContactWithInsuredClaimMetric", null, 1, 1, 2)
      add("gen_liability", "DaysInitialContactWithInsuredClaimMetric", null, 1, 1, 2)
      add("businessowners", "DaysInitialContactWithInsuredClaimMetric", null, 1, 1, 2)
      add("auto_comm", "DaysInitialContactWithInsuredClaimMetric", null, 1, 1, 2)
      add("prop_comm", "DaysInitialContactWithInsuredClaimMetric", null, 1, 1, 2)
      add("farmowners", "DaysInitialContactWithInsuredClaimMetric", null, 1, 1, 2)
      add("travel_per", "DaysInitialContactWithInsuredClaimMetric", null, 1, 1, 2)
      add("comp", "TimeToFirstPaymentClaimMetric", null, 20, 17, 30)
      add("comp", "TimeToFirstPaymentClaimMetric", "el", 60, 50, 120)
      add("comp", "DaysLastViewedByAdjusterClaimMetric", null, 10, 8, 20)
      add("comp", "DaysLastViewedByAdjusterClaimMetric", "indemnity", 15, 12, 25)
      add("comp", "DaysLastViewedByAdjusterClaimMetric", "el", 20, 17, 40)
      add("auto_per", "DaysLastViewedByAdjusterClaimMetric", null, 10, 8, 15)
      add("auto_per", "DaysLastViewedByAdjusterClaimMetric", "high", 20, 18, 30)
      add("homeowners", "DaysLastViewedByAdjusterClaimMetric", null, 12, 10, 20)
      add("homeowners", "DaysLastViewedByAdjusterClaimMetric", "high", 20, 25, 40)
      add("gen_liability", "DaysLastViewedByAdjusterClaimMetric", null, 30, 25, 50)
      add("gen_liability", "DaysLastViewedByAdjusterClaimMetric", "low", 20, 25, 40)
      add("businessowners", "DaysLastViewedByAdjusterClaimMetric", null, 30, 25, 50)
      add("auto_comm", "DaysLastViewedByAdjusterClaimMetric", null, 20, 25, 40)
      add("prop_comm", "DaysLastViewedByAdjusterClaimMetric", null, 30, 25, 50)
      add("farmowners", "DaysLastViewedByAdjusterClaimMetric", null, 20, 25, 40)
      add("travel_per", "DaysLastViewedByAdjusterClaimMetric", null, 12, 10, 20)
      add("comp", "DaysLastViewedBySupervisorClaimMetric", null, 20, 17, 40)
      add("comp", "DaysLastViewedBySupervisorClaimMetric", "indemnity", 30, 25, 45)
      add("comp", "DaysLastViewedBySupervisorClaimMetric", "el", 20, 17, 40)
      add("auto_per", "DaysLastViewedBySupervisorClaimMetric", null, 20, 16, 40)
      add("auto_per", "DaysLastViewedBySupervisorClaimMetric", "high", 30, 25, 50)
      add("homeowners", "DaysLastViewedBySupervisorClaimMetric", null, 20, 16, 40)
      add("homeowners", "DaysLastViewedBySupervisorClaimMetric", "high", 30, 25, 50)
      add("gen_liability", "DaysLastViewedBySupervisorClaimMetric", null, 60, 50, 100)
      add("gen_liability", "DaysLastViewedBySupervisorClaimMetric", "low", 30, 25, 50)
      add("businessowners", "DaysLastViewedBySupervisorClaimMetric", null, 60, 50, 100)
      add("auto_comm", "DaysLastViewedBySupervisorClaimMetric", null, 30, 25, 50)
      add("prop_comm", "DaysLastViewedBySupervisorClaimMetric", null, 60, 50, 100)
      add("farmowners", "DaysLastViewedBySupervisorClaimMetric", null, 30, 25, 50)
      add("travel_per", "DaysLastViewedBySupervisorClaimMetric", null, 20, 16, 40)
      add("comp", "OverdueActivitiesClaimMetric", null, null, 2, 3)
      add("comp", "OverdueActivitiesClaimMetric", "indemnity", null, 3, 5)
      add("comp", "OverdueActivitiesClaimMetric", "el", null, 3, 6)
      add("auto_per", "OverdueActivitiesClaimMetric", null, null, 2, 3)
      add("homeowners", "OverdueActivitiesClaimMetric", null, null, 2, 3)
      add("gen_liability", "OverdueActivitiesClaimMetric", null, null, 2, 3)
      add("businessowners", "OverdueActivitiesClaimMetric", null, null, 2, 3)
      add("auto_comm", "OverdueActivitiesClaimMetric", null, null, 2, 3)
      add("prop_comm", "OverdueActivitiesClaimMetric", null, null, 2, 3)
      add("farmowners", "OverdueActivitiesClaimMetric", null, null, 2, 3)
      add("travel_per", "OverdueActivitiesClaimMetric", null, null, 2, 3)
      add("comp", "OpenEscalatedActivitiesClaimMetric", null, 0, null, 1)
      add("comp", "OpenEscalatedActivitiesClaimMetric", "indemnity", 0, 1, 2)
      add("comp", "OpenEscalatedActivitiesClaimMetric", "el", 0, 1, 2)
      add("auto_per", "OpenEscalatedActivitiesClaimMetric", null, 0, null, 1)
      add("homeowners", "OpenEscalatedActivitiesClaimMetric", null, 0, null, 1)
      add("gen_liability", "OpenEscalatedActivitiesClaimMetric", null, 0, null, 1)
      add("businessowners", "OpenEscalatedActivitiesClaimMetric", null, 0, null, 1)
      add("auto_comm", "OpenEscalatedActivitiesClaimMetric", null, 0, null, 1)
      add("prop_comm", "OpenEscalatedActivitiesClaimMetric", null, 0, null, 1)
      add("farmowners", "OpenEscalatedActivitiesClaimMetric", null, 0, null, 1)
      add("travel_per", "OpenEscalatedActivitiesClaimMetric", null, 0, null, 1)
      add("comp", "AllEscalatedActivitiesClaimMetric", null, 1, 1, 2)
      add("comp", "AllEscalatedActivitiesClaimMetric", "indemnity", 2, 2, 3)
      add("comp", "AllEscalatedActivitiesClaimMetric", "el", 3, 2, 4)
      add("auto_per", "AllEscalatedActivitiesClaimMetric", null, 1, 1, 2)
      add("homeowners", "AllEscalatedActivitiesClaimMetric", null, 1, 1, 2)
      add("gen_liability", "AllEscalatedActivitiesClaimMetric", null, 1, 1, 2)
      add("comp", "ReserveChangeCountClaimMetric", "medicalonly", 3, 2, 4)
      add("comp", "ReserveChangeCountClaimMetric", "indemnity", 4, 3, 5)
      add("comp", "ReserveChangeCountClaimMetric", "el", 5, 4, 6)
      add("comp", "NetTotalIncurredClaimMetric", null, 9000, null, null)
      add("comp", "NetTotalIncurredClaimMetric", "incidentreport", 0, null, 1)
      add("comp", "NetTotalIncurredClaimMetric", "medicalonly", 6000, null, null)
      add("comp", "NetTotalIncurredClaimMetric", "indemnity", 12000, null, null)
      add("comp", "NetTotalIncurredClaimMetric", "el", 10000, null, null)
      add("auto_per", "NetTotalIncurredClaimMetric", null, 8000, null, null)
      add("auto_per", "NetTotalIncurredClaimMetric", "low", 500, null, null)
      add("auto_per", "NetTotalIncurredClaimMetric", "high", 20000, null, null)
      add("homeowners", "NetTotalIncurredClaimMetric", null, 5000, null, null)
      add("homeowners", "NetTotalIncurredClaimMetric", "low", 1500, null, null)
      add("homeowners", "NetTotalIncurredClaimMetric", "high", 25000, null, null)
      add("gen_liability", "NetTotalIncurredClaimMetric", null, 10000, null, null)
      add("gen_liability", "NetTotalIncurredClaimMetric", "low", 2000, null, null)
      add("gen_liability", "NetTotalIncurredClaimMetric", "high", 50000, null, null)
    }
    
    private function add(policyType : PolicyType, metricType : typekey.ClaimMetric, tier : ClaimTier, target : Integer, yellow : Integer, red : Integer) {
      var limit = createLimitForType(metricType)
      limit.PolicyTypeMetricLimits = PolicyTypeMetricLimits.cache.limitsForPolicyType(policyType)
      limit.ClaimTier = tier
      limit.Currency = CurrencyUtil.getDefaultCurrency()
      if (limit typeis IntegerClaimMetricLimit) {
        limit.IntegerTargetValue = target
        limit.IntegerYellowValue = yellow
        limit.IntegerRedValue = red
      } else if (limit typeis PercentClaimMetricLimit) {
        limit.PercentTargetValue = target
        limit.PercentYellowValue = yellow
        limit.PercentRedValue = red
      } else if (limit typeis MoneyClaimMetricLimit) {
        limit.MoneyTargetValue = target
        limit.MoneyYellowValue = yellow
        limit.MoneyRedValue = red
      } else {
        throw new IllegalStateException("Unexpected ClaimMetricLimit type: " + typeof limit)
      }
    }
    
    private function createLimitForType(metricType : typekey.ClaimMetric) : ClaimMetricLimit {
      var result : ClaimMetricLimit
      TestDataUtil.runWithExistingBundleNoCommit(_bundle, \ -> {
        var type = TypeSystem.getByFullName("entity." + metricType.Code)
        var metric = type.TypeInfo.getConstructor({}).Constructor.newInstance({}) as ClaimMetric
        result = metric.createDefaultLimit() as ClaimMetricLimit
        metric.remove()
      })
      return result
    }
  }

  /**
   * Nested class for creating Exposure metric limits. The add limits method is
   * just following the prescription: "For all 11 Policy types, for Initial
   * Contact with Claimant (Days) set a default target of 1 day, Yellow of 1 day
   * and Red of 2 days"
   */
  private class ExposureMetricLimits {

    var _bundle : Bundle
    
    construct(bundle : Bundle) {
      _bundle = bundle
    }
    
    function addLimits() {
      for (policyType in PolicyType.getTypeKeys(false)) {
        add(policyType, "DaysInitialContactWithClaimantExposureMetric", null, 1, 1, 3)
      }
    }

    private function add(policyType : PolicyType, metricType : typekey.ExposureMetric, tier : ExposureTier, target : Integer, yellow : Integer, red : Integer) {
      var limit = createLimitForType(metricType)
      limit.PolicyTypeMetricLimits = PolicyTypeMetricLimits.cache.limitsForPolicyType(policyType)
      limit.ExposureTier = tier
      limit.Currency = CurrencyUtil.getDefaultCurrency()
      if (limit typeis IntegerExposureMetricLimit) {
        limit.IntegerTargetValue = target
        limit.IntegerYellowValue = yellow
        limit.IntegerRedValue = red
      } else if (limit typeis PercentExposureMetricLimit) {
        limit.PercentTargetValue = target
        limit.PercentYellowValue = yellow
        limit.PercentRedValue = red
      } else if (limit typeis MoneyExposureMetricLimit) {
        limit.MoneyTargetValue = target
        limit.MoneyYellowValue = yellow
        limit.MoneyRedValue = red
      } else {
        throw new IllegalStateException("Unexpected ExposureMetricLimit type: " + typeof limit)
      }
    }
    
    private function createLimitForType(metricType : typekey.ExposureMetric) : ExposureMetricLimit {
      var result : ExposureMetricLimit
      TestDataUtil.runWithExistingBundleNoCommit(_bundle, \ -> {
        var type = TypeSystem.getByFullName("entity." + metricType.Code)
        var metric = type.TypeInfo.getConstructor({}).Constructor.newInstance({}) as ExposureMetric
        result = metric.createDefaultLimit() as ExposureMetricLimit
        metric.remove()
      })
      return result
    }
  }

  construct(inCache : SampleDataCache) {
    super(inCache)
  }

  override property get Description() : String {
    return "Claim and exposure metric limits"
  }

  override function testSampleData( bundle : Bundle ) {
    // Tests create their own metric limits
  }

  override function demoSampleData(bundle : Bundle) {
    var claimMetricLimits = new ClaimMetricLimits(bundle)
    claimMetricLimits.addLimits()
    var exposureMetricLimits = new ExposureMetricLimits(bundle)
    exposureMetricLimits.addLimits()
  }
}
