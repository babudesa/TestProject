package gw.entity
uses gw.api.util.DateUtil

enhancement GWCheckSetEnhancement : entity.CheckSet {

  function validateAllScheduledSendDatesOnBusinessDays() {
    for (check in this.Checks) {
      var sendDate = check.ScheduledSendDate
      if (sendDate != null and
          !DateUtil.isBusinessDay(sendDate, check.getBusinessCalendarAddress())) {
        this.reject(ValidationLevel.TC_PAYMENT, displaykey.Rules.Validation.Transaction.ScheduledSendDateNotWeekendOrHoliday(check.ScheduledSendDate.format("short")),  null, null)
      }
    }
  }

}
