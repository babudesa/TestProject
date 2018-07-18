package gw.webservice.cc.queues.dto
//uses javax.jws.WebService
//uses gw.xml.ws.annotation.WsiExportable

final class WorkerQueueData {
  var available_count:int as Available
  var checkedout_count:int as CheckedOut
  var failed_count:int as Failed
  var run:boolean as Running
}
