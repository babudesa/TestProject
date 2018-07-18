package gw.sampledata

uses java.util.Calendar
uses java.util.Date
uses java.util.HashMap

/**
 * Caches values that are used repeatedly when loading sample data
 */
@ReadOnly
class SampleDataCache {

  private var _baseDate : Date as readonly BaseDate
  private var _activityPatternsByCode = new HashMap<String,ActivityPattern>()
  private var _usersByUserName = new HashMap<String,User>()
  private var _groupsByName = new HashMap<String,Group>()
  private var _securityZonesByName = new HashMap<String,SecurityZone>()

  construct() {
    _baseDate  = "today" as Date
    if(_baseDate.DayOfWeek != Calendar.TUESDAY && _baseDate.DayOfWeek > Calendar.TUESDAY) {
      _baseDate = _baseDate.addDays(Calendar.TUESDAY - _baseDate.DayOfWeek)
    } else {
       _baseDate = _baseDate.addDays(-7 + (Calendar.TUESDAY - _baseDate.DayOfWeek))
    }
  }
  
  function findActivityPatternByCode(code : String) : ActivityPattern {
    var activityPattern = _activityPatternsByCode[code]
    if (activityPattern == null) {
      activityPattern = find (ap in ActivityPattern where ap.Code == code).getAtMostOneRow()
      _activityPatternsByCode[code] = activityPattern
    }
    return activityPattern
  }

  function findUserByUserName(userName : String) : User {
    var user = _usersByUserName[userName]
    if (user == null) {
      user = find (credential in User.Credential where credential.UserName == userName).getAtMostOneRow()
      _usersByUserName[userName] = user
    }
    return user
  }

  function findGroupByName(groupName : String) : Group {
    var group = _groupsByName[groupName]
    if (group == null) {
      group = find (group in Group where group.Name == groupName).getAtMostOneRow()
      _groupsByName[groupName] = group
    }
    return group
  }

  function findSecurityZoneByName(securityZoneName : String) : SecurityZone {
    var securityZone = _securityZonesByName[securityZoneName]
    if (securityZone == null) {
      securityZone = find (zone in SecurityZone where zone.Name == securityZoneName).getAtMostOneRow()
      _securityZonesByName[securityZoneName] = securityZone
    }
    return securityZone
  }

}
