package gw.processes

uses gw.api.database.Query

class CustomScriptRunningProcess extends BatchProcessBase {
  private var _env = gw.api.system.server.ServerUtil.getEnv()
  private var _log = gw.api.util.Logger

  construct() {
    super(BatchProcessType.TC_CUSTOMSCRIPTRUNNING)
  }       
                                                                                                         
  override function doWork(){  
  // Resetting Unsuccessfully Voided Check to resolve DB inconsistency
    _log.logInfo("*************************************")
    _log.logInfo("Started running Custom Script in "+ _env)
    try{
      _log.logInfo("*************************************")
    }catch(e){
      _log.logInfo("Exception generating CustomScriptRunning")
      e.printStackTrace()
    }
  } // end doWork
}