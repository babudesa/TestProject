package util.gaic.checkstatusreport
uses java.util.Date

class SuspectCheck {
  
  private var _publicID : String as PublicID
  private var _condition : SuspectCheckCondition as Condition
  private var _statusChangeDate : Date as StatusChangeDate
  private var _scheduledSendDate : Date as ScheduledSendDate
  
  construct(checkPublicID : String, suspectCondition : SuspectCheckCondition, checkStatusChangeDate : Date, checkScheduledSendDate : Date) {
    _publicID = checkPublicID
    _condition = suspectCondition
    _statusChangeDate = checkStatusChangeDate
    _scheduledSendDate = checkScheduledSendDate
  }
}
