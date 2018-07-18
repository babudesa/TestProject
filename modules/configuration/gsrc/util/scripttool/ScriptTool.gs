package util.scripttool

uses com.guidewire.pl.system.service.LocalServiceFactory
uses com.guidewire.pl.system.service.RemoteScriptHostService
uses gw.api.util.Logger //Added for logging in Debug - SR
uses com.gaic.claims.env.Environment

class ScriptTool{
  
  var _startWrapper = ""
  var _endWrapper =  ""
  var _scriptService : RemoteScriptHostService
  var _history : ScriptToolHistoryExt
  var _results : String[]
  
  construct() {
    _scriptService = LocalServiceFactory.instance().getService(RemoteScriptHostService) as RemoteScriptHostService    
  }
  
  function invokeGosu(gosuString : String, commentStr : String, ticketNum : String, scriptUser : String){
    try{
      
      //the untouched string will be passed to the history function, just as it was typed in
      var historyPublicID : String = initHistory(gosuString, commentStr, ticketNum).PublicID       
      _startWrapper = "gw.transaction.Transaction.runWithNewBundle(\\bundle->\r\n{var cbh = new util.scripttool.ScriptToolCallbackHandler(\"" + historyPublicID + "\")\r\n"
        + "bundle.addBundleTransactionCallback(cbh)\r\n"
      _endWrapper = "\r\n},\""+scriptUser+"\")" // executing user is set on Script Tool page
      gosuString = _startWrapper + gosuString + _endWrapper     
      _results = _scriptService.evaluate(gosuString)
      
      //retrieve the previously created history object to set the remaining fields
      _history = (gw.transaction.Transaction.getCurrent().loadByPublicId(ScriptToolHistoryExt, historyPublicID) as ScriptToolHistoryExt)
      //_history.Script = gosuString
      _history.StdErrOut = OutputStream
    }catch(e){
      //changed to logging in Debug - SR
      Logger.logDebug("An error has occurred..." + e)
    }finally{
      if(Environment.getInstance() != Environment.LOCAL){
        sendAuditEmail()
      }
    }
  }
  
  /*
    The history object must be initialized here while there is easy access to the current user. I cannot figure out how to
    pass a reference to a newly created history object back to this class from the callback handler.
  */
  function initHistory(gosuString : String, commentStr : String, ticketNum : String) : ScriptToolHistoryExt {
    var hist : ScriptToolHistoryExt
    gw.transaction.Transaction.runWithNewBundle(\ bundle ->
    {
      hist = new ScriptToolHistoryExt()
      hist.Script = gosuString
      hist.Comments = commentStr
      hist.TicketNum = ticketNum
      hist.ExecutingUser = gw.plugin.util.CurrentUserUtil.getCurrentUser().User
    })
    
    return hist
  }
  
  function sendAuditEmail(){
    var body = templates.email.ScriptToolAudit.renderToString(_history)
    var emailAddys:String[] = ScriptParameters.ScriptToolAuditEmail.toString().split(",")
    util.Email.sendMail(emailAddys, "Script tool used in "+ gw.api.system.server.ServerUtil.getEnv(), body) 
  }
  
  property get ReturnValue() : String {
    return _results[0] 
  }
  
  property get OutputStream() : String {
    return _results[1] 
  }
  
  property get Comments() : String {
    return _history.Comments
  }
  
  property set Comments(commentsStr : String) {
    _history.Comments = commentsStr
  }
  
  property get TicketNo() : String {
    return _history.TicketNum
  }
  
  property set TicketNo(ticketNum : String) {
    _history.TicketNum = ticketNum 
  }
  
}
