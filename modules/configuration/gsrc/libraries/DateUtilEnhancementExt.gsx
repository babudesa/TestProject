package libraries
uses java.util.Date
uses gw.api.util.DateUtil

enhancement DateUtilEnhancementExt : gw.api.util.DateUtil {

  /**
   * Determines if a date is in the future.
   * @param date
   * @returns - True if the date is after today's date. False if the date is null or not after
   * today.
   */  
  static function futureDate(date : Date) : boolean {
    return date == null or DateUtil.compareIgnoreTime(date,DateUtil.currentDate()) > 0
  }
  
  /**
   * Call <b>gw.api.util.DateUtil.validateNonFutureDate(VALUE)</b> in a date field's <i>RequestvalidationExpression</i>
   * or <i>ValidationExpression</i> to show a validation error when the VALUE is a future date.
   * @param date
   * @returns Null if If the the Date is null or a non future date. Otherwise, returns 
   * displaykey.Java.Validation.Date.ForbidFuture.
   */
  static function validateNonFutureDate(date : Date) : String {
    return DateUtil.futureDate(date) 
      ? displaykey.Java.Validation.Date.ForbidFuture
      : null
  }
}
