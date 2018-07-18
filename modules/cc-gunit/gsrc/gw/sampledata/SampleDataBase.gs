package gw.sampledata

uses gw.transaction.Bundle
uses java.util.Date
uses gw.api.util.DateUtil

@ReadOnly
abstract class SampleDataBase {

  private var _cache : SampleDataCache as readonly Cache

  construct(inCache : SampleDataCache) {
    _cache = inCache
  }
  
  /** Describes the sample data set */
  abstract property get Description() : String
  
  /** Loads the test version of the sample data set */
  abstract function testSampleData(bundle : Bundle)

  /** Loads the demo version of the sample data set */
  function demoSampleData(bundle : Bundle) {
    testSampleData(bundle)
  }

  /** Base implementation does nothing. */
  function minimalTestSampleData(bundle : Bundle) {
  }

  property get BaseDate() : Date {
    return _cache.BaseDate
  }

  function findActivityPatternByCode(code : String) : ActivityPattern {
    return _cache.findActivityPatternByCode(code)
  }

  function findUserByUserName(userName : String) : User {
    return _cache.findUserByUserName(userName)
  }

  function findGroupByName(groupName : String) : Group {
    return _cache.findGroupByName(groupName)
  }

  property get AndyApplegate() : User {
    return findUserByUserName("aapplegate")
  }

  property get Auto1TeamA() : Group {
    return findGroupByName("Auto1 - TeamA")
  }

  property get AutoPropertySecurityZone() : SecurityZone {
    return _cache.findSecurityZoneByName("Auto and Property")
  }

  property get WorkersCompSecurityZone() : SecurityZone {
    return _cache.findSecurityZoneByName("Workers Comp")
  }

  property get TravelSecurityZone() : SecurityZone {
    return _cache.findSecurityZoneByName("Travel")
  }

  /** Start of day 1/1/xxxx where xxxx is the current year plus the given offset (which may be negative) */
  function getYearStart(yearOffset : int) : Date {
    return createDate(yearOffset, 1, 1)
  }

  /** Start of day 12/31/xxxx where xxxx is the current year plus the given offset (which may be negative) */
  function getYearEnd(yearOffset : int) : Date {
    return createDate(yearOffset, 12, 31)
  }
  
  function createDate(yearOffset : int, month : int, day : int) : Date {
    return DateUtil.createDateInstance(month, day, Date.Today.YearOfDate + yearOffset)
  }

}
