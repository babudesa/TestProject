package libraries.TransactionSet_Entity
uses java.math.BigDecimal

enhancement TransactionSetEnhancement : entity.TransactionSet {
  
  // Function that compares two values to see if the difference is 100,000 or greater
  // if so then create 100k Update Monthly Report activity
  function create100kUpdateMonthlyReport(value1:BigDecimal, value2:BigDecimal):void {
    if (value1 - value2 >= 100000 || value2 - value1 >= 100000){
      var ap = util.custom_Ext.finders.findActivityPattern("reserve_payment_report")
  
      // target date should be current month end minus 10 days or today if this is in the past
      var dayOfMonth = gw.api.util.DateUtil.getDayOfMonth(gw.api.util.DateUtil.currentDate())
      var currMonth = gw.api.util.DateUtil.getMonth(gw.api.util.DateUtil.currentDate())
      var monthEndMin10 = 21
      // if the last day of the month is not 31, set the month end minus 10 based on the current month
      if (currMonth == 4 || currMonth == 6 || currMonth == 9 || currMonth == 11) {
        monthEndMin10 = 20
      }
      else if (currMonth == 2) {
        monthEndMin10 = 18
      }
      // set the target date for 10 days before the month end, if this date is not in the past
      if (monthEndMin10 > dayOfMonth){
        var daysTilDue = monthEndMin10 - dayOfMonth
        var target = gw.api.util.DateUtil.addDays(gw.api.util.DateUtil.currentDate(), daysTilDue)
        this.Claim.createActivity(null, ap, null, null, null, null, target, null)
      }
      else {
        // the target date is today
        this.Claim.createActivityFromPattern(null, ap)
      }
    }
  }
  function escalateAllChecksForFeature(payment:Payment){
    var claim=this.Claim
    var otherChecks :List<Check> = claim.getChecksIterator(false).toList() as List<Check>
    
    for(ch in otherChecks){
      for(pay in ch.Payments){
        if(pay.Exposure==payment.Exposure and pay.Check.BulkInvoiceItemInfo.ID == null){
          if(ch.Bundle.ReadOnly){
            gw.transaction.Transaction.getCurrent().add(ch)
          }
          ch.requestCheck()
         // ch.sendSCONotificationOver500K(ch)
          break
        }
        
      }
    
    }
  }

}
