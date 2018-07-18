package util;

/**
 * Factory class that contains methods for accessing groups and group supervisors used in rules. Allows
 * these values to be easily changed across all rules
 */
class RuleGroups
{
  construct () {
  }
  
  public function getWesternAutoGroup() : Group {
    var finder = find(g in Group where g.PublicID == "demo_sample:26" /*Western Auto Group*/ );
    return finder.getAtMostOneRow();
  }

  public function getHeadquartersSupervisor() : User {
    var finder = find(u in User where u.PublicID == "demo_sample:7" /*Super Visor*/ );
    return finder.getAtMostOneRow();
  }

  public function getWesternAutoGroupSupervisor() : User {
    var finder = find(u in User where u.PublicID == "demo_sample:3" /*Mike Maples*/ );
    return finder.getAtMostOneRow();
  }
  
  public function getAuto1TeamASupervisor() : User {
    var finder = find(u in User where u.PublicID == "demo_sample:2" /*Sue Smith*/ );
    return finder.getAtMostOneRow();
  }

  public function getAuto1TeamBSupervisor() : User {
    var finder = find(u in User where u.PublicID == "demo_sample:115" /*Rick Ralston*/ );
    return finder.getAtMostOneRow();
  }

  public function getAuto1TeamCSupervisor() : User {
    var finder = find(u in User where u.PublicID == "demo_sample:120" /*Kerrie Winslow*/ );
    return finder.getAtMostOneRow();
  }

  public function getHeadquarters() : Group {
    var finder = find(g in Group where g.PublicID == "demo_sample:5" /*Headquarters*/ );
    return finder.getAtMostOneRow();
  }
  
}
