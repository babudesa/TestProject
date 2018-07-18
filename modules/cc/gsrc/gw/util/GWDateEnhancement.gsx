package gw.util
uses java.util.Date
uses gw.api.util.DateUtil

enhancement GWDateEnhancement : Date {

  static function getTodayOrNextBusinessDay(address : Address) : Date {
    var today = Date.Today
    return DateUtil.isBusinessDay(today, address) ? today : DateUtil.addBusinessDays(today, 1, address)
  }

}
