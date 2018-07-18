package gw.entity;
uses gw.api.team.UserStatisticsUtil;
uses gw.api.database.Query

@ReadOnly
enhancement GWUserEnhancement : entity.User
{
  
  function getApproximateOpenActivities() : int {
    var result : int
    
    var stats = UserStatisticsUtil.getStatistics(this)
    
    if (stats.StatsUpdateTime > this.OffsetStatsUpdateTime) {
      result = stats.OpenActs;
    } else {
      result = stats.OpenActs + this.NewlyAssignedActivities;
    }
    return result 
  }
  
  function adjustApproximateOpenActivities(offset : int) {
    var stats = UserStatisticsUtil.getStatistics(this)
    
    if (stats.StatsUpdateTime > this.OffsetStatsUpdateTime) {
      this.NewlyAssignedActivities = 0;
      this.OffsetStatsUpdateTime = stats.StatsUpdateTime;  
    }
    
    this.NewlyAssignedActivities = this.NewlyAssignedActivities + offset;
  }

  static function queryUserByUsername(username : String) : User {
    var usr = Query.make(User).join("Credential")
          .compare("Credential.UserName", EQUALS, username)
          .select().AtMostOneRow
    return usr
  }
  
}
