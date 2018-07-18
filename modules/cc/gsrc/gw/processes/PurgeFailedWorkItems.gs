package gw.processes
uses java.util.Date
uses gw.api.util.DateUtil
uses gw.api.webservice.cc.maintenanceTools.CCMaintenanceToolsImpl

@Exportable
public class PurgeFailedWorkItems extends BatchProcessBase {
  var _queues : String[]
  var _lastDate : Date
  var _api = new CCMaintenanceToolsImpl()
  
  public construct() {
    super("PurgeFailedWorkItems")
    _queues = _api.getWorkQueueNames()
    _lastDate = _api.getLastRunDateForBatchProcess(Type.Code)
    var today = DateUtil.currentDate().trimToMidnight()
    if (_lastDate == null) {
      _lastDate = today.addMonths(-1)
    }
    else if (!_lastDate.before(today)) {
      _lastDate = today;
    }
  }
  
  override function doWork() {
    for (queueName in _queues) {
       _api.purgeFailedWorkItems(queueName, _lastDate)
    }
  }

}
