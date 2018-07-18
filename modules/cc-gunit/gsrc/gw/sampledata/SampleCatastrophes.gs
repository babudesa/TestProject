package gw.sampledata

uses gw.transaction.Bundle
uses java.util.Date

@Export
class SampleCatastrophes extends SampleDataBase {

  construct(inCache : SampleDataCache) {
    super(inCache)
  }

  override property get Description() : String {
    return "Catastrophe, CatastrophePeril, and CatastropheZone"
  }

  override function testSampleData(bundle : Bundle) {
    var hurricaneReginaStartDate = "5/1/2001" as Date
    new gw.api.databuilder.CatastropheBuilder()
      .withName("Hurricane Regina")
      .withDescription("Hurricane Regina")
      .withActive(true)
      .withType("iso")
      .withNumber("074")
      .withPublicId("demo_sample:1")
      .withValidFrom(hurricaneReginaStartDate)
      .withValidTo(hurricaneReginaStartDate.addDays(4))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("waterdamage")
        .withPublicId("demo_sample:1")
        .withLossType("PR"))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("FallingObject")
        .withPublicId("demo_sample:2")
        .withLossType("AUTO"))
      .withZone( "FL", "state", "US" )
      .create(bundle)

    var mississippiFloodStartDate = "1/2/2002" as Date
    new gw.api.databuilder.CatastropheBuilder()
      .withName("Mississippi Flood")
      .withDescription("Mississippi Flood of 2002")
      .withActive(true)
      .withType("iso")
      .withNumber("082")
      .withPublicId("demo_sample:2")
      .withValidFrom(mississippiFloodStartDate)
      .withValidTo(mississippiFloodStartDate.addDays(5))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("waterdamage")
        .withPublicId("demo_sample:3")
        .withLossType("PR"))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("vandalism")
        .withPublicId("demo_sample:4")
        .withLossType("AUTO"))
      .withZone( "MI", "state", "US" )
      .create(bundle)

    var tropicalStormBettyStartDate = "9/5/2002" as Date
    new gw.api.databuilder.CatastropheBuilder()
      .withName("Tropical Storm Betty")
      .withDescription("Tropical Storm Betty")
      .withActive(true)
      .withType("iso")
      .withNumber("153")
      .withPublicId("demo_sample:3")
      .withValidFrom(tropicalStormBettyStartDate)
      .withValidTo(tropicalStormBettyStartDate.addDays(5))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("waterdamage")
        .withPublicId("demo_sample:5")
        .withLossType("PR"))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("glassbreakage")
        .withPublicId("demo_sample:6")
        .withLossType("AUTO"))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("wind")
        .withPublicId("demo_sample:7")
        .withLossType("PR"))
      .withZone( "FL", "state", "US" )
      .create(bundle)

    var nePowerOutageStartDate = "8/7/2003" as Date
    new gw.api.databuilder.CatastropheBuilder()
      .withName("NE Power Outage")
      .withDescription("NE Power Outage of Aug 2003")
      .withActive(true)
      .withType("iso")
      .withNumber("157")
      .withPublicId("demo_sample:4")
      .withValidFrom(nePowerOutageStartDate)
      .withValidTo(nePowerOutageStartDate.addDays(5))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("riotandcivil")
        .withPublicId("demo_sample:8")
        .withLossType("PR"))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("fire")
        .withPublicId("demo_sample:9")
        .withLossType("AUTO"))
      .withZone( "NY", "state", "US" )
      .withZone( "NJ", "state", "US" )
      .create(bundle)


    var laEarthquakeStartDate = "9/6/2003" as Date
    new gw.api.databuilder.CatastropheBuilder()
      .withName("LA earthquake")
      .withDescription("LA earthquake of Sept 2003")
      .withActive(true)
      .withType("iso")
      .withNumber("163")
      .withPublicId("demo_sample:5")
      .withValidFrom(laEarthquakeStartDate)
      .withValidTo(laEarthquakeStartDate.addDays(5))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("earthquake")
        .withPublicId("demo_sample:10")
        .withLossType("PR"))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("FallingObject")
        .withPublicId("demo_sample:11")
        .withLossType("AUTO"))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("fire")
        .withPublicId("demo_sample:12")
        .withLossType("AUTO"))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("glassbreakage")
        .withPublicId("demo_sample:13")
        .withLossType("AUTO"))
      .withPeril(new gw.api.databuilder.CatastrophePerilBuilder()
        .withLossCause("vandalism")
        .withPublicId("demo_sample:14")
        .withLossType("AUTO"))
      .withZone( "CA", "state", "US" )
      .create(bundle)
  }
}
