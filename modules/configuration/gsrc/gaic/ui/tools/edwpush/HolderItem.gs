package gaic.ui.tools.edwpush
uses java.lang.String
uses java.util.Date

class HolderItem {
  private var _uniqueid:long as readonly UniqueID;
  private var _message:String as Message;
  private var _transactionname:String as readonly TransactionName;
  private var _claimnumber:String as readonly ClaimNumber;
  private var _errormessage:String as readonly ErrorMessage;
  private var _ccupdatetime:Date as readonly UpdateTime;
  private var _hasTransaction:boolean as readonly HasTransaction;
  
  construct(uid:long, msg:String, tname:String, claim:String, error:String, uptime:Date, hasTrans:boolean) {
    _uniqueid = uid;
    _message = msg;
    _transactionname = tname;
    _claimnumber = claim;
    _errormessage = error;
    _ccupdatetime = uptime;
    _hasTransaction = hasTrans;
  }

}
