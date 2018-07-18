package libraries.Policy_Entity

enhancement DateFunctions : entity.Policy {
  function get3monthExpDate(): DateTime {
    return gw.api.util.DateUtil.addDays( this.ExpirationDate, 90 )
  }
  
  function get12monthExpDate(): DateTime {
    return gw.api.util.DateUtil.addYears( this.ExpirationDate, 1 )
  }
}
