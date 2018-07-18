package gw.sampledata
uses gw.transaction.Bundle

@Export
class SampleAggregateLimits extends SampleDataBase {

  construct(inCache : SampleDataCache) {
    super(inCache)
  }

  override property get Description() : String {
    return "Aggregate Limits"
  }
    
  override function testSampleData(bundle : Bundle) {
    var rayNewtonClaim = find(c in Claim where c.ClaimNumber == "235-53-365870").getAtMostOneRow()
    var period = rayNewtonClaim.Policy.PolicyPeriods.firstWhere( \ p -> p.PolicyPeriodType == "account")
    new gw.api.databuilder.AggregateLimitBuilder()
      .withLimitAmount(1000000)
      .withPublicId("demo_sample:90006")
      .withLimitType("lossdate")
      .onPolicyPeriod(period)
      .create(bundle)
  }
}
