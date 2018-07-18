package gw.sampledata
uses gw.transaction.Bundle
uses gw.api.util.ConfigAccess
uses java.io.File
uses gw.api.webservice.importTools.ImportToolsImpl
uses java.util.Date
uses gw.api.util.DateUtil

@Export
class SampleCSVRefTables extends SampleDataBase {

  construct(inCache : SampleDataCache) {
    super(inCache)
  }

  override property get Description() : String {
    return "WC ref Tables, ICD Codes"
  }
    
  // use builders for the test data, don't include ICD Codes
  override function testSampleData(bundle : Bundle) {

    new gw.api.databuilder.ref_WC_PD_benefitsBuilder()
      .withPD_MaxBenefit(200)
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2004))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2004))
      .withPD_MinBenefit(105)
      .withPublicId("wc_pd_ben:2004_69")
      .withRateComments("CA states max of $300 and min is $157 prior to applying 2/3 factor")
      .withMin_DisabilityPercent(1)
      .withJurisdictionState("CA")
      .withMax_DisabilityPercent(69)
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_benefitsBuilder()
      .withPD_MaxBenefit(250)
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2004))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2004))
      .withPD_MinBenefit(105)
      .withPublicId("wc_pd_ben:2004_70")
      .withRateComments("CA states max of $375 and min of $157 prior to applying 2/3 factor")
      .withMin_DisabilityPercent(70)
      .withJurisdictionState("CA")
      .withMax_DisabilityPercent(99)
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_benefitsBuilder()
      .withPD_MaxBenefit(220)
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2005))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_MinBenefit(105)
      .withPublicId("wc_pd_ben:2005_69")
      .withRateComments("CA states max of $330 and min of $157 prior to applying 2/3 factor")
      .withMin_DisabilityPercent(1)
      .withJurisdictionState("CA")
      .withMax_DisabilityPercent(69)
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_benefitsBuilder()
      .withPD_MaxBenefit(270)
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2005))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_MinBenefit(105)
      .withPublicId("wc_pd_ben:2005_70")
      .withRateComments("CA states max of $405 and min of $157 prior to applying 2/3 factor")
      .withMin_DisabilityPercent(70)
      .withJurisdictionState("CA")
      .withMax_DisabilityPercent(99)
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_benefitsBuilder()
      .withPD_MaxBenefit(230)
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2006))
      .withPD_MinBenefit(130)
      .withPublicId("wc_pd_ben:2006_69")
      .withRateComments("CA states max of $345 and min of $195 prior to applying 2/3 factor")
      .withMin_DisabilityPercent(1)
      .withJurisdictionState("CA")
      .withMax_DisabilityPercent(69)
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_benefitsBuilder()
      .withPD_MaxBenefit(270)
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2006))
      .withPD_MinBenefit(130)
      .withPublicId("wc_pd_ben:2006_70")
      .withRateComments("CA states max of $405 and min of $195 prior to applying 2/3 factor")
      .withMin_DisabilityPercent(70)
      .withJurisdictionState("CA")
      .withMax_DisabilityPercent(99)
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_benefitsBuilder()
      .withPD_MaxBenefit(230)
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2007))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_MinBenefit(130)
      .withPublicId("wc_pd_ben:2007_69")
      .withRateComments("CA states max of $345 and min of $195 prior to applying 2/3 factor")
      .withMin_DisabilityPercent(1)
      .withJurisdictionState("CA")
      .withMax_DisabilityPercent(69)
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_benefitsBuilder()
      .withPD_MaxBenefit(270)
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2007))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_MinBenefit(130)
      .withPublicId("wc_pd_ben:2007_70")
      .withRateComments("CA states max of $405 and min of $195 prior to applying 2/3 factor")
      .withMin_DisabilityPercent(70)
      .withJurisdictionState("CA")
      .withMax_DisabilityPercent(99)
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_benefitsBuilder()
      .withPD_MaxBenefit(230)
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2008))
      .withPD_MinBenefit(130)
      .withPublicId("wc_pd_ben:2008_69")
      .withRateComments("CA states max of $345 and min of $195 prior to applying 2/3 factor")
      .withMin_DisabilityPercent(1)
      .withJurisdictionState("CA")
      .withMax_DisabilityPercent(69)
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_benefitsBuilder()
      .withPD_MaxBenefit(270)
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2008))
      .withPD_MinBenefit(130)
      .withPublicId("wc_pd_ben:2008_70")
      .withRateComments("CA states max of $405 and min of $195 prior to applying 2/3 factor")
      .withMin_DisabilityPercent(70)
      .withJurisdictionState("CA")
      .withMax_DisabilityPercent(99)
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_benefitsBuilder()
      .withPD_MaxBenefit(230)
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2009))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_MinBenefit(130)
      .withPublicId("wc_pd_ben:2009_69")
      .withRateComments("Rates will need to be confirmed & updated; ")
      .withMin_DisabilityPercent(1)
      .withJurisdictionState("CA")
      .withMax_DisabilityPercent(69)
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_benefitsBuilder()
      .withPD_MaxBenefit(270)
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2009))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_MinBenefit(130)
      .withPublicId("wc_pd_ben:2009_70")
      .withRateComments("See http://www.leginfo.ca.gov/cgi-bin/displaycode?section=lab&group=04001-05000&file=4451-4459")
      .withMin_DisabilityPercent(70)
      .withJurisdictionState("CA")
      .withMax_DisabilityPercent(99)
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(3)
      .withDisabilityPercent(1)
      .withPublicId("wc_pd_limit:1")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(6)
      .withDisabilityPercent(2)
      .withPublicId("wc_pd_limit:2")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(9)
      .withDisabilityPercent(3)
      .withPublicId("wc_pd_limit:3")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(12)
      .withDisabilityPercent(4)
      .withPublicId("wc_pd_limit:4")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(15)
      .withDisabilityPercent(5)
      .withPublicId("wc_pd_limit:5")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(18)
      .withDisabilityPercent(6)
      .withPublicId("wc_pd_limit:6")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(21)
      .withDisabilityPercent(7)
      .withPublicId("wc_pd_limit:7")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(24)
      .withDisabilityPercent(8)
      .withPublicId("wc_pd_limit:8")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(27)
      .withDisabilityPercent(9)
      .withPublicId("wc_pd_limit:9")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(40)
      .withDisabilityPercent(10)
      .withPublicId("wc_pd_limit:10")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(44)
      .withDisabilityPercent(11)
      .withPublicId("wc_pd_limit:11")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(48)
      .withDisabilityPercent(12)
      .withPublicId("wc_pd_limit:12")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(52)
      .withDisabilityPercent(13)
      .withPublicId("wc_pd_limit:13")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(56)
      .withDisabilityPercent(14)
      .withPublicId("wc_pd_limit:14")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(60)
      .withDisabilityPercent(15)
      .withPublicId("wc_pd_limit:15")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(64)
      .withDisabilityPercent(16)
      .withPublicId("wc_pd_limit:16")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(68)
      .withDisabilityPercent(17)
      .withPublicId("wc_pd_limit:17")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(72)
      .withDisabilityPercent(18)
      .withPublicId("wc_pd_limit:18")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(76)
      .withDisabilityPercent(19)
      .withPublicId("wc_pd_limit:19")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(100)
      .withDisabilityPercent(20)
      .withPublicId("wc_pd_limit:20")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(105)
      .withDisabilityPercent(21)
      .withPublicId("wc_pd_limit:21")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(110)
      .withDisabilityPercent(22)
      .withPublicId("wc_pd_limit:22")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(115)
      .withDisabilityPercent(23)
      .withPublicId("wc_pd_limit:23")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(120)
      .withDisabilityPercent(24)
      .withPublicId("wc_pd_limit:24")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(150)
      .withDisabilityPercent(25)
      .withPublicId("wc_pd_limit:25")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(156)
      .withDisabilityPercent(26)
      .withPublicId("wc_pd_limit:26")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(162)
      .withDisabilityPercent(27)
      .withPublicId("wc_pd_limit:27")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(168)
      .withDisabilityPercent(28)
      .withPublicId("wc_pd_limit:28")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(174)
      .withDisabilityPercent(29)
      .withPublicId("wc_pd_limit:29")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(210)
      .withDisabilityPercent(30)
      .withPublicId("wc_pd_limit:30")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(217)
      .withDisabilityPercent(31)
      .withPublicId("wc_pd_limit:31")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(224)
      .withDisabilityPercent(32)
      .withPublicId("wc_pd_limit:32")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(231)
      .withDisabilityPercent(33)
      .withPublicId("wc_pd_limit:33")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(238)
      .withDisabilityPercent(34)
      .withPublicId("wc_pd_limit:34")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(245)
      .withDisabilityPercent(35)
      .withPublicId("wc_pd_limit:35")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(252)
      .withDisabilityPercent(36)
      .withPublicId("wc_pd_limit:36")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(259)
      .withDisabilityPercent(37)
      .withPublicId("wc_pd_limit:37")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(266)
      .withDisabilityPercent(38)
      .withPublicId("wc_pd_limit:38")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(273)
      .withDisabilityPercent(39)
      .withPublicId("wc_pd_limit:39")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(280)
      .withDisabilityPercent(40)
      .withPublicId("wc_pd_limit:40")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(287)
      .withDisabilityPercent(41)
      .withPublicId("wc_pd_limit:41")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(294)
      .withDisabilityPercent(42)
      .withPublicId("wc_pd_limit:42")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(301)
      .withDisabilityPercent(43)
      .withPublicId("wc_pd_limit:43")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(308)
      .withDisabilityPercent(44)
      .withPublicId("wc_pd_limit:44")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(315)
      .withDisabilityPercent(45)
      .withPublicId("wc_pd_limit:45")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(322)
      .withDisabilityPercent(46)
      .withPublicId("wc_pd_limit:46")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(329)
      .withDisabilityPercent(47)
      .withPublicId("wc_pd_limit:47")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(336)
      .withDisabilityPercent(48)
      .withPublicId("wc_pd_limit:48")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(343)
      .withDisabilityPercent(49)
      .withPublicId("wc_pd_limit:49")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(400)
      .withDisabilityPercent(50)
      .withPublicId("wc_pd_limit:50")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(408)
      .withDisabilityPercent(51)
      .withPublicId("wc_pd_limit:51")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(416)
      .withDisabilityPercent(52)
      .withPublicId("wc_pd_limit:52")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(424)
      .withDisabilityPercent(53)
      .withPublicId("wc_pd_limit:53")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(432)
      .withDisabilityPercent(54)
      .withPublicId("wc_pd_limit:54")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(440)
      .withDisabilityPercent(55)
      .withPublicId("wc_pd_limit:55")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(448)
      .withDisabilityPercent(56)
      .withPublicId("wc_pd_limit:56")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(456)
      .withDisabilityPercent(57)
      .withPublicId("wc_pd_limit:57")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(464)
      .withDisabilityPercent(58)
      .withPublicId("wc_pd_limit:58")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(472)
      .withDisabilityPercent(59)
      .withPublicId("wc_pd_limit:59")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(480)
      .withDisabilityPercent(60)
      .withPublicId("wc_pd_limit:60")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(488)
      .withDisabilityPercent(61)
      .withPublicId("wc_pd_limit:61")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(496)
      .withDisabilityPercent(62)
      .withPublicId("wc_pd_limit:62")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(504)
      .withDisabilityPercent(63)
      .withPublicId("wc_pd_limit:63")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(512)
      .withDisabilityPercent(64)
      .withPublicId("wc_pd_limit:64")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(520)
      .withDisabilityPercent(65)
      .withPublicId("wc_pd_limit:65")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(528)
      .withDisabilityPercent(66)
      .withPublicId("wc_pd_limit:66")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(536)
      .withDisabilityPercent(67)
      .withPublicId("wc_pd_limit:67")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(544)
      .withDisabilityPercent(68)
      .withPublicId("wc_pd_limit:68")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(552)
      .withDisabilityPercent(69)
      .withPublicId("wc_pd_limit:69")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(630)
      .withDisabilityPercent(70)
      .withPublicId("wc_pd_limit:70")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(639)
      .withDisabilityPercent(71)
      .withPublicId("wc_pd_limit:71")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(648)
      .withDisabilityPercent(72)
      .withPublicId("wc_pd_limit:72")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(657)
      .withDisabilityPercent(73)
      .withPublicId("wc_pd_limit:73")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(666)
      .withDisabilityPercent(74)
      .withPublicId("wc_pd_limit:74")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(675)
      .withDisabilityPercent(75)
      .withPublicId("wc_pd_limit:75")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(684)
      .withDisabilityPercent(76)
      .withPublicId("wc_pd_limit:76")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(693)
      .withDisabilityPercent(77)
      .withPublicId("wc_pd_limit:77")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(702)
      .withDisabilityPercent(78)
      .withPublicId("wc_pd_limit:78")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(711)
      .withDisabilityPercent(79)
      .withPublicId("wc_pd_limit:79")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(720)
      .withDisabilityPercent(80)
      .withPublicId("wc_pd_limit:80")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(729)
      .withDisabilityPercent(81)
      .withPublicId("wc_pd_limit:81")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(738)
      .withDisabilityPercent(82)
      .withPublicId("wc_pd_limit:82")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(747)
      .withDisabilityPercent(83)
      .withPublicId("wc_pd_limit:83")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(756)
      .withDisabilityPercent(84)
      .withPublicId("wc_pd_limit:84")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(765)
      .withDisabilityPercent(85)
      .withPublicId("wc_pd_limit:85")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(774)
      .withDisabilityPercent(86)
      .withPublicId("wc_pd_limit:86")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(783)
      .withDisabilityPercent(87)
      .withPublicId("wc_pd_limit:87")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(792)
      .withDisabilityPercent(88)
      .withPublicId("wc_pd_limit:88")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(801)
      .withDisabilityPercent(89)
      .withPublicId("wc_pd_limit:89")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(810)
      .withDisabilityPercent(90)
      .withPublicId("wc_pd_limit:90")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(819)
      .withDisabilityPercent(91)
      .withPublicId("wc_pd_limit:91")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(828)
      .withDisabilityPercent(92)
      .withPublicId("wc_pd_limit:92")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(837)
      .withDisabilityPercent(93)
      .withPublicId("wc_pd_limit:93")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(846)
      .withDisabilityPercent(94)
      .withPublicId("wc_pd_limit:94")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(855)
      .withDisabilityPercent(95)
      .withPublicId("wc_pd_limit:95")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(864)
      .withDisabilityPercent(96)
      .withPublicId("wc_pd_limit:96")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(873)
      .withDisabilityPercent(97)
      .withPublicId("wc_pd_limit:97")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(882)
      .withDisabilityPercent(98)
      .withPublicId("wc_pd_limit:98")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withPD_NumWeeks(891)
      .withDisabilityPercent(99)
      .withPublicId("wc_pd_limit:99")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(3)
      .withDisabilityPercent(1)
      .withPublicId("wc_pd_limit:102")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(6)
      .withDisabilityPercent(2)
      .withPublicId("wc_pd_limit:103")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(9)
      .withDisabilityPercent(3)
      .withPublicId("wc_pd_limit:104")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(12)
      .withDisabilityPercent(4)
      .withPublicId("wc_pd_limit:105")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(15)
      .withDisabilityPercent(5)
      .withPublicId("wc_pd_limit:106")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(18)
      .withDisabilityPercent(6)
      .withPublicId("wc_pd_limit:107")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(21)
      .withDisabilityPercent(7)
      .withPublicId("wc_pd_limit:108")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(24)
      .withDisabilityPercent(8)
      .withPublicId("wc_pd_limit:109")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(27)
      .withDisabilityPercent(9)
      .withPublicId("wc_pd_limit:110")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(40)
      .withDisabilityPercent(10)
      .withPublicId("wc_pd_limit:111")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(44)
      .withDisabilityPercent(11)
      .withPublicId("wc_pd_limit:112")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(48)
      .withDisabilityPercent(12)
      .withPublicId("wc_pd_limit:113")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(52)
      .withDisabilityPercent(13)
      .withPublicId("wc_pd_limit:114")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(56)
      .withDisabilityPercent(14)
      .withPublicId("wc_pd_limit:115")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(60)
      .withDisabilityPercent(15)
      .withPublicId("wc_pd_limit:116")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(64)
      .withDisabilityPercent(16)
      .withPublicId("wc_pd_limit:117")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(68)
      .withDisabilityPercent(17)
      .withPublicId("wc_pd_limit:118")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(72)
      .withDisabilityPercent(18)
      .withPublicId("wc_pd_limit:119")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(76)
      .withDisabilityPercent(19)
      .withPublicId("wc_pd_limit:120")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(100)
      .withDisabilityPercent(20)
      .withPublicId("wc_pd_limit:121")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(105)
      .withDisabilityPercent(21)
      .withPublicId("wc_pd_limit:122")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(110)
      .withDisabilityPercent(22)
      .withPublicId("wc_pd_limit:123")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(115)
      .withDisabilityPercent(23)
      .withPublicId("wc_pd_limit:124")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(120)
      .withDisabilityPercent(24)
      .withPublicId("wc_pd_limit:125")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(150)
      .withDisabilityPercent(25)
      .withPublicId("wc_pd_limit:126")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(156)
      .withDisabilityPercent(26)
      .withPublicId("wc_pd_limit:127")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(162)
      .withDisabilityPercent(27)
      .withPublicId("wc_pd_limit:128")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(168)
      .withDisabilityPercent(28)
      .withPublicId("wc_pd_limit:129")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(174)
      .withDisabilityPercent(29)
      .withPublicId("wc_pd_limit:130")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(210)
      .withDisabilityPercent(30)
      .withPublicId("wc_pd_limit:131")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(217)
      .withDisabilityPercent(31)
      .withPublicId("wc_pd_limit:132")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(224)
      .withDisabilityPercent(32)
      .withPublicId("wc_pd_limit:133")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(231)
      .withDisabilityPercent(33)
      .withPublicId("wc_pd_limit:134")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(238)
      .withDisabilityPercent(34)
      .withPublicId("wc_pd_limit:135")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(245)
      .withDisabilityPercent(35)
      .withPublicId("wc_pd_limit:136")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(252)
      .withDisabilityPercent(36)
      .withPublicId("wc_pd_limit:137")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(259)
      .withDisabilityPercent(37)
      .withPublicId("wc_pd_limit:138")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(266)
      .withDisabilityPercent(38)
      .withPublicId("wc_pd_limit:139")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(273)
      .withDisabilityPercent(39)
      .withPublicId("wc_pd_limit:140")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(280)
      .withDisabilityPercent(40)
      .withPublicId("wc_pd_limit:141")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(287)
      .withDisabilityPercent(41)
      .withPublicId("wc_pd_limit:142")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(294)
      .withDisabilityPercent(42)
      .withPublicId("wc_pd_limit:143")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(301)
      .withDisabilityPercent(43)
      .withPublicId("wc_pd_limit:144")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(308)
      .withDisabilityPercent(44)
      .withPublicId("wc_pd_limit:145")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(315)
      .withDisabilityPercent(45)
      .withPublicId("wc_pd_limit:146")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(322)
      .withDisabilityPercent(46)
      .withPublicId("wc_pd_limit:147")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(329)
      .withDisabilityPercent(47)
      .withPublicId("wc_pd_limit:148")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(336)
      .withDisabilityPercent(48)
      .withPublicId("wc_pd_limit:149")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(343)
      .withDisabilityPercent(49)
      .withPublicId("wc_pd_limit:150")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(400)
      .withDisabilityPercent(50)
      .withPublicId("wc_pd_limit:151")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(408)
      .withDisabilityPercent(51)
      .withPublicId("wc_pd_limit:152")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(416)
      .withDisabilityPercent(52)
      .withPublicId("wc_pd_limit:153")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(424)
      .withDisabilityPercent(53)
      .withPublicId("wc_pd_limit:154")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(432)
      .withDisabilityPercent(54)
      .withPublicId("wc_pd_limit:155")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(440)
      .withDisabilityPercent(55)
      .withPublicId("wc_pd_limit:156")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(448)
      .withDisabilityPercent(56)
      .withPublicId("wc_pd_limit:157")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(456)
      .withDisabilityPercent(57)
      .withPublicId("wc_pd_limit:158")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(464)
      .withDisabilityPercent(58)
      .withPublicId("wc_pd_limit:159")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(472)
      .withDisabilityPercent(59)
      .withPublicId("wc_pd_limit:160")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(480)
      .withDisabilityPercent(60)
      .withPublicId("wc_pd_limit:161")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(488)
      .withDisabilityPercent(61)
      .withPublicId("wc_pd_limit:162")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(496)
      .withDisabilityPercent(62)
      .withPublicId("wc_pd_limit:163")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(504)
      .withDisabilityPercent(63)
      .withPublicId("wc_pd_limit:164")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(512)
      .withDisabilityPercent(64)
      .withPublicId("wc_pd_limit:165")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(520)
      .withDisabilityPercent(65)
      .withPublicId("wc_pd_limit:166")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(528)
      .withDisabilityPercent(66)
      .withPublicId("wc_pd_limit:167")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(536)
      .withDisabilityPercent(67)
      .withPublicId("wc_pd_limit:168")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(544)
      .withDisabilityPercent(68)
      .withPublicId("wc_pd_limit:169")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(552)
      .withDisabilityPercent(69)
      .withPublicId("wc_pd_limit:170")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(630)
      .withDisabilityPercent(70)
      .withPublicId("wc_pd_limit:171")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(639)
      .withDisabilityPercent(71)
      .withPublicId("wc_pd_limit:172")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(648)
      .withDisabilityPercent(72)
      .withPublicId("wc_pd_limit:173")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(657)
      .withDisabilityPercent(73)
      .withPublicId("wc_pd_limit:174")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(666)
      .withDisabilityPercent(74)
      .withPublicId("wc_pd_limit:175")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(675)
      .withDisabilityPercent(75)
      .withPublicId("wc_pd_limit:176")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(684)
      .withDisabilityPercent(76)
      .withPublicId("wc_pd_limit:177")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(693)
      .withDisabilityPercent(77)
      .withPublicId("wc_pd_limit:178")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(702)
      .withDisabilityPercent(78)
      .withPublicId("wc_pd_limit:179")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(711)
      .withDisabilityPercent(79)
      .withPublicId("wc_pd_limit:180")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(720)
      .withDisabilityPercent(80)
      .withPublicId("wc_pd_limit:181")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(729)
      .withDisabilityPercent(81)
      .withPublicId("wc_pd_limit:182")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(738)
      .withDisabilityPercent(82)
      .withPublicId("wc_pd_limit:183")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(747)
      .withDisabilityPercent(83)
      .withPublicId("wc_pd_limit:184")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(756)
      .withDisabilityPercent(84)
      .withPublicId("wc_pd_limit:185")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(765)
      .withDisabilityPercent(85)
      .withPublicId("wc_pd_limit:186")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(774)
      .withDisabilityPercent(86)
      .withPublicId("wc_pd_limit:187")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(783)
      .withDisabilityPercent(87)
      .withPublicId("wc_pd_limit:188")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(792)
      .withDisabilityPercent(88)
      .withPublicId("wc_pd_limit:189")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(801)
      .withDisabilityPercent(89)
      .withPublicId("wc_pd_limit:190")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(810)
      .withDisabilityPercent(90)
      .withPublicId("wc_pd_limit:191")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(819)
      .withDisabilityPercent(91)
      .withPublicId("wc_pd_limit:192")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(828)
      .withDisabilityPercent(92)
      .withPublicId("wc_pd_limit:193")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(837)
      .withDisabilityPercent(93)
      .withPublicId("wc_pd_limit:194")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(846)
      .withDisabilityPercent(94)
      .withPublicId("wc_pd_limit:195")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(855)
      .withDisabilityPercent(95)
      .withPublicId("wc_pd_limit:196")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(864)
      .withDisabilityPercent(96)
      .withPublicId("wc_pd_limit:197")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(873)
      .withDisabilityPercent(97)
      .withPublicId("wc_pd_limit:198")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(882)
      .withDisabilityPercent(98)
      .withPublicId("wc_pd_limit:199")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withPD_NumWeeks(891)
      .withDisabilityPercent(99)
      .withPublicId("wc_pd_limit:200")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(3)
      .withDisabilityPercent(1)
      .withPublicId("wc_pd_limit:203")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(6)
      .withDisabilityPercent(2)
      .withPublicId("wc_pd_limit:204")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(9)
      .withDisabilityPercent(3)
      .withPublicId("wc_pd_limit:205")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(12)
      .withDisabilityPercent(4)
      .withPublicId("wc_pd_limit:206")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(15)
      .withDisabilityPercent(5)
      .withPublicId("wc_pd_limit:207")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(18)
      .withDisabilityPercent(6)
      .withPublicId("wc_pd_limit:208")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(21)
      .withDisabilityPercent(7)
      .withPublicId("wc_pd_limit:209")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(24)
      .withDisabilityPercent(8)
      .withPublicId("wc_pd_limit:210")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(27)
      .withDisabilityPercent(9)
      .withPublicId("wc_pd_limit:211")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(40)
      .withDisabilityPercent(10)
      .withPublicId("wc_pd_limit:212")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(44)
      .withDisabilityPercent(11)
      .withPublicId("wc_pd_limit:213")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(48)
      .withDisabilityPercent(12)
      .withPublicId("wc_pd_limit:214")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(52)
      .withDisabilityPercent(13)
      .withPublicId("wc_pd_limit:215")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(56)
      .withDisabilityPercent(14)
      .withPublicId("wc_pd_limit:216")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(60)
      .withDisabilityPercent(15)
      .withPublicId("wc_pd_limit:217")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(64)
      .withDisabilityPercent(16)
      .withPublicId("wc_pd_limit:218")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(68)
      .withDisabilityPercent(17)
      .withPublicId("wc_pd_limit:219")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(72)
      .withDisabilityPercent(18)
      .withPublicId("wc_pd_limit:220")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(76)
      .withDisabilityPercent(19)
      .withPublicId("wc_pd_limit:221")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(100)
      .withDisabilityPercent(20)
      .withPublicId("wc_pd_limit:222")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(105)
      .withDisabilityPercent(21)
      .withPublicId("wc_pd_limit:223")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(110)
      .withDisabilityPercent(22)
      .withPublicId("wc_pd_limit:224")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(115)
      .withDisabilityPercent(23)
      .withPublicId("wc_pd_limit:225")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(120)
      .withDisabilityPercent(24)
      .withPublicId("wc_pd_limit:226")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(150)
      .withDisabilityPercent(25)
      .withPublicId("wc_pd_limit:227")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(156)
      .withDisabilityPercent(26)
      .withPublicId("wc_pd_limit:228")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(162)
      .withDisabilityPercent(27)
      .withPublicId("wc_pd_limit:229")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(168)
      .withDisabilityPercent(28)
      .withPublicId("wc_pd_limit:230")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(174)
      .withDisabilityPercent(29)
      .withPublicId("wc_pd_limit:231")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(210)
      .withDisabilityPercent(30)
      .withPublicId("wc_pd_limit:232")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(217)
      .withDisabilityPercent(31)
      .withPublicId("wc_pd_limit:233")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(224)
      .withDisabilityPercent(32)
      .withPublicId("wc_pd_limit:234")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(231)
      .withDisabilityPercent(33)
      .withPublicId("wc_pd_limit:235")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(238)
      .withDisabilityPercent(34)
      .withPublicId("wc_pd_limit:236")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(245)
      .withDisabilityPercent(35)
      .withPublicId("wc_pd_limit:237")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(252)
      .withDisabilityPercent(36)
      .withPublicId("wc_pd_limit:238")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(259)
      .withDisabilityPercent(37)
      .withPublicId("wc_pd_limit:239")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(266)
      .withDisabilityPercent(38)
      .withPublicId("wc_pd_limit:240")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(273)
      .withDisabilityPercent(39)
      .withPublicId("wc_pd_limit:241")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(280)
      .withDisabilityPercent(40)
      .withPublicId("wc_pd_limit:242")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(287)
      .withDisabilityPercent(41)
      .withPublicId("wc_pd_limit:243")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(294)
      .withDisabilityPercent(42)
      .withPublicId("wc_pd_limit:244")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(301)
      .withDisabilityPercent(43)
      .withPublicId("wc_pd_limit:245")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(308)
      .withDisabilityPercent(44)
      .withPublicId("wc_pd_limit:246")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(315)
      .withDisabilityPercent(45)
      .withPublicId("wc_pd_limit:247")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(322)
      .withDisabilityPercent(46)
      .withPublicId("wc_pd_limit:248")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(329)
      .withDisabilityPercent(47)
      .withPublicId("wc_pd_limit:249")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(336)
      .withDisabilityPercent(48)
      .withPublicId("wc_pd_limit:250")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(343)
      .withDisabilityPercent(49)
      .withPublicId("wc_pd_limit:251")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(400)
      .withDisabilityPercent(50)
      .withPublicId("wc_pd_limit:252")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(408)
      .withDisabilityPercent(51)
      .withPublicId("wc_pd_limit:253")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(416)
      .withDisabilityPercent(52)
      .withPublicId("wc_pd_limit:254")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(424)
      .withDisabilityPercent(53)
      .withPublicId("wc_pd_limit:255")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(432)
      .withDisabilityPercent(54)
      .withPublicId("wc_pd_limit:256")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(440)
      .withDisabilityPercent(55)
      .withPublicId("wc_pd_limit:257")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(448)
      .withDisabilityPercent(56)
      .withPublicId("wc_pd_limit:258")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(456)
      .withDisabilityPercent(57)
      .withPublicId("wc_pd_limit:259")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(464)
      .withDisabilityPercent(58)
      .withPublicId("wc_pd_limit:260")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(472)
      .withDisabilityPercent(59)
      .withPublicId("wc_pd_limit:261")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(480)
      .withDisabilityPercent(60)
      .withPublicId("wc_pd_limit:262")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(488)
      .withDisabilityPercent(61)
      .withPublicId("wc_pd_limit:263")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(496)
      .withDisabilityPercent(62)
      .withPublicId("wc_pd_limit:264")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(504)
      .withDisabilityPercent(63)
      .withPublicId("wc_pd_limit:265")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(512)
      .withDisabilityPercent(64)
      .withPublicId("wc_pd_limit:266")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(520)
      .withDisabilityPercent(65)
      .withPublicId("wc_pd_limit:267")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(528)
      .withDisabilityPercent(66)
      .withPublicId("wc_pd_limit:268")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(536)
      .withDisabilityPercent(67)
      .withPublicId("wc_pd_limit:269")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(544)
      .withDisabilityPercent(68)
      .withPublicId("wc_pd_limit:270")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(552)
      .withDisabilityPercent(69)
      .withPublicId("wc_pd_limit:271")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(630)
      .withDisabilityPercent(70)
      .withPublicId("wc_pd_limit:272")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(639)
      .withDisabilityPercent(71)
      .withPublicId("wc_pd_limit:273")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(648)
      .withDisabilityPercent(72)
      .withPublicId("wc_pd_limit:274")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(657)
      .withDisabilityPercent(73)
      .withPublicId("wc_pd_limit:275")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(666)
      .withDisabilityPercent(74)
      .withPublicId("wc_pd_limit:276")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(675)
      .withDisabilityPercent(75)
      .withPublicId("wc_pd_limit:277")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(684)
      .withDisabilityPercent(76)
      .withPublicId("wc_pd_limit:278")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(693)
      .withDisabilityPercent(77)
      .withPublicId("wc_pd_limit:279")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(702)
      .withDisabilityPercent(78)
      .withPublicId("wc_pd_limit:280")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(711)
      .withDisabilityPercent(79)
      .withPublicId("wc_pd_limit:281")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(720)
      .withDisabilityPercent(80)
      .withPublicId("wc_pd_limit:282")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(729)
      .withDisabilityPercent(81)
      .withPublicId("wc_pd_limit:283")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(738)
      .withDisabilityPercent(82)
      .withPublicId("wc_pd_limit:284")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(747)
      .withDisabilityPercent(83)
      .withPublicId("wc_pd_limit:285")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(756)
      .withDisabilityPercent(84)
      .withPublicId("wc_pd_limit:286")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(765)
      .withDisabilityPercent(85)
      .withPublicId("wc_pd_limit:287")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(774)
      .withDisabilityPercent(86)
      .withPublicId("wc_pd_limit:288")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(783)
      .withDisabilityPercent(87)
      .withPublicId("wc_pd_limit:289")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(792)
      .withDisabilityPercent(88)
      .withPublicId("wc_pd_limit:290")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(801)
      .withDisabilityPercent(89)
      .withPublicId("wc_pd_limit:291")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(810)
      .withDisabilityPercent(90)
      .withPublicId("wc_pd_limit:292")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(819)
      .withDisabilityPercent(91)
      .withPublicId("wc_pd_limit:293")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(828)
      .withDisabilityPercent(92)
      .withPublicId("wc_pd_limit:294")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(837)
      .withDisabilityPercent(93)
      .withPublicId("wc_pd_limit:295")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(846)
      .withDisabilityPercent(94)
      .withPublicId("wc_pd_limit:296")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(855)
      .withDisabilityPercent(95)
      .withPublicId("wc_pd_limit:297")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(864)
      .withDisabilityPercent(96)
      .withPublicId("wc_pd_limit:298")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(873)
      .withDisabilityPercent(97)
      .withPublicId("wc_pd_limit:299")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(882)
      .withDisabilityPercent(98)
      .withPublicId("wc_pd_limit:300")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_PD_WeeksAndLimitsBuilder()
      .withPD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2012))
      .withPD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withPD_NumWeeks(891)
      .withDisabilityPercent(99)
      .withPublicId("wc_pd_limit:301")
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_TDBuilder()
      .withTD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2004))
      .withTD_Min(126)
      .withPublicId("wc_td_ben:1")
      .withTD_Max(728)
      .withRateComments("Stated max of $1092 and min of $189 prior to 2/3 multiplier")
      .withTD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2004))
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_TDBuilder()
      .withTD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2005))
      .withTD_Min(126)
      .withPublicId("wc_td_ben:2")
      .withTD_Max(840)
      .withRateComments("Stated max of $1260 and min of $189 prior to 2/3 multiplier")
      .withTD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2005))
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_TDBuilder()
      .withTD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2006))
      .withTD_Min(126)
      .withPublicId("wc_td_ben:3")
      .withTD_Max(840)
      .withRateComments("Stated max of $1260 and min of $189 prior to 2/3 multiplier")
      .withTD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2006))
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_TDBuilder()
      .withTD_BenefitEndDate(getYearEnd(-1))
      .withTD_Min(132.25)
      .withPublicId("wc_td_ben:4")
      .withTD_Max(881.66)
      .withRateComments("Stated max of $1322.50 and min of $198.37 prior to 2/3 multiplier")
      .withTD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2007))
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_TDBuilder()
      .withTD_BenefitEndDate(DateUtil.createDateInstance(12, 31, 2008))
      .withTD_Min(137.45)
      .withPublicId("wc_td_ben:5")
      .withTD_Max(916.33)
      .withRateComments("Stated max of $1374.50 and min of $206.17 prior to 2/3 multiplier")
      .withTD_BenefitStartDate(getYearStart(0))
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.ref_WC_TDBuilder()
      .withTD_BenefitEndDate(Date.createDateInstance(12, 31, 2019))
      .withTD_Min(137.45)
      .withPublicId("wc_td_ben:6")
      .withTD_Max(916.33)
      .withRateComments("Rates will need to be confirmed & updated; See http://www.leginfo.ca.gov/cgi-bin/displaycode?section=lab&group=04001-05000&file=4451-4459")
      .withTD_BenefitStartDate(DateUtil.createDateInstance(1, 1, 2009))
      .withJurisdictionState("CA")
      .create(bundle)


    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-CT")
      .withTargetDaysFromLoss(28)
      .withJurisdictionState("CT")
      .withTargetIncludeDays("elapsed")
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterLossDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-DC")
      .withTargetDaysFromLoss(14)
      .withJurisdictionState("DC")
      .withTargetIncludeDays("elapsed")
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterLossDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-DE")
      .withTargetDaysFromLoss(15)
      .withJurisdictionState("DE")
      .withTargetIncludeDays("elapsed")
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterLossDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-FL")
      .withTargetDaysFromLoss(14)
      .withJurisdictionState("FL")
      .withTargetIncludeDays("elapsed")
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterLossDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-GA")
      .withTargetDaysFromLoss(21)
      .withJurisdictionState("GA")
      .withTargetIncludeDays("elapsed")
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterLossDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-MD")
      .withTargetDaysFromLoss(21)
      .withJurisdictionState("MD")
      .withTargetIncludeDays("elapsed")
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterLossDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-NC")
      .withJurisdictionState("NC")
      .withTargetIncludeDays("elapsed")
      .withTargetDaysFromNotice(14)
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterNoticeDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-NJ")
      .withTargetDaysFromLoss(30)
      .withJurisdictionState("NJ")
      .withTargetIncludeDays("elapsed")
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterLossDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-NY")
      .withJurisdictionState("NY")
      .withTargetIncludeDays("elapsed")
      .withTargetDaysFromNotice(25)
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterNoticeDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-PA")
      .withJurisdictionState("PA")
      .withTargetIncludeDays("elapsed")
      .withTargetDaysFromNotice(21)
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterNoticeDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-TN")
      .withJurisdictionState("TN")
      .withTargetIncludeDays("elapsed")
      .withTargetDaysFromNotice(15)
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterNoticeDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-SC")
      .withJurisdictionState("SC")
      .withTargetIncludeDays("elapsed")
      .withTargetDaysFromLoss(30)
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterLossDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-VA")
      .withTargetDaysFromLoss(30)
      .withJurisdictionState("VA")
      .withTargetIncludeDays("elapsed")
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterLossDate")
      .create(bundle)

    new gw.api.databuilder.WCDenialPeriodBuilder()
      .withPublicId("denialperiod:2008-IL")
      .withTargetDaysFromLoss(3)
      .withJurisdictionState("IL")
      .withTargetIncludeDays("elapsed")
      .withExpiryDate(Date.createDateInstance(12, 31, 2008))
      .withEffectiveDate(Date.createDateInstance(1, 1, 2008))
      .withDueDateFormula("AfterLossDate")
      .create(bundle)
  }
  
  // load demo data from the csv/xml sources
  override function demoSampleData(bundle : Bundle) {
    importCSVFile( "wc_ref_data.csv" )
    importCSVFile( "icd9_2009.csv" )
  }

  private function importCSVFile(filename : String) {
    var api = new ImportToolsImpl()
    var file = new File(ConfigAccess.getModuleRoot("cc") + "/config/referencedata/", filename)
    var csvData = file.read()
    api.importCsvData( csvData, 0, false, false )
  }

}
