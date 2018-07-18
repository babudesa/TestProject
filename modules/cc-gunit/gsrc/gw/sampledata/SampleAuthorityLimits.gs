package gw.sampledata
uses gw.transaction.Bundle

@Export
class SampleAuthorityLimits extends SampleDataBase {

  construct(inCache : SampleDataCache) {
    super(inCache)
  }

  override property get Description() : String {
    return "Authority Limits"
  }
    
  override function testSampleData(bundle : Bundle) {
    new gw.api.databuilder.AuthorityLimitBuilder()
      .withLimitAmount(1000000)
      .withPublicId("demo_sample:1")
      .withLimitType("ctr")
      .onProfile(find(s in AuthorityLimitProfile where s.PublicID == "demo_sample:1").getFirstResult())
      .create(bundle)
    new gw.api.databuilder.AuthorityLimitBuilder()
      .withLimitAmount(1000000)
      .withPublicId("demo_sample:2")
      .withLimitType("cptd")
      .onProfile(find(s in AuthorityLimitProfile where s.PublicID == "demo_sample:1").getFirstResult())
      .create(bundle)
    new gw.api.databuilder.AuthorityLimitBuilder()
      .withLimitAmount(20000)
      .withPublicId("demo_sample:3")
      .withLimitType("ctr")
      .onProfile(find(s in AuthorityLimitProfile where s.PublicID == "demo_sample:2").getFirstResult())
      .create(bundle)
    new gw.api.databuilder.AuthorityLimitBuilder()
      .withLimitAmount(30000)
      .withPublicId("demo_sample:4")
      .withLimitType("cptd")
      .onProfile(find(s in AuthorityLimitProfile where s.PublicID == "demo_sample:2").getFirstResult())
      .create(bundle)
  }
}

