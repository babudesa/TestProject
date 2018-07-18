package gw.util

uses gw.processes.BatchProcessBase
uses java.util.Date
uses gw.api.admin.MessagingUtil
uses java.lang.Integer
uses gw.api.system.CCConfigParameters

class PurgeMessageHistory extends BatchProcessBase {

  var _ageInDays : int
  
  construct(arguments : Object[]) {
    super(BatchProcessType.TC_PURGEMESSAGEHISTORY)
    if (arguments.length == 1 and arguments[0] typeis Integer) {
      _ageInDays = arguments[0] as Integer
    } else {
      _ageInDays = CCConfigParameters.KeepCompletedMessagesForDays.Value
    }
  }

  override function doWork() {
    var before = Date.CurrentDate.addDays(-_ageInDays)
    MessagingUtil.removeMessageHistory(before)
  }

}
