package gw.webservice.cc.queues

uses gw.api.database.Query
uses gw.entity.IEntityType
uses gw.webservice.cc.queues.dto.WorkerQueueData

@WebService

class QueueMonitorAPI {

  construct() {}
  
  /******************************************** 
  function: findInQueueCount
  Find a count of available and checkedout QueueItems for a given Queue
  @param queueName - [String] The Queue Nanme           
  ***********************************************/
  public function getQueueData(batchType:BatchProcessType):WorkerQueueData {
    var worker = new gw.api.web.tools.WorkQueueInfoPage()
    var queueitem =  worker.getWorkQueueList().firstWhere( \ w -> w.QueueType == batchType);

    var data:WorkerQueueData = new WorkerQueueData();
    data.Available =  queueitem.AvailableCount
    data.CheckedOut = queueitem.CheckedOutCount
    data.Failed = queueitem.FailedCount
    data.Running = isQueueRunning(batchType);
  
    return data;
  }

  /*
  public function isQueueRunning(batchType:BatchProcessType):boolean {
    var wqip = new gw.api.web.tools.WorkQueueInfoPage();
    var queue = wqip.WorkQueueList.findFirst( \ w -> w.QueueType == batchType);
    var running = queue.BatchProcess.ProcessRunning;
    if (running) return true;
    var workers = wqip.getWorkQueueWorkerInfoArray(queue);
    for (var worker in workers) {
      if (!worker.ActiveStatus) continue;
      var runs = wqip.getWorkerRunInfoArray(worker);
      for (var run in runs) {
        running = running || (run.EndTime == null);
      }
    }
    return running;
  }
  */

  public function isQueueRunning(batchType:BatchProcessType):boolean {
    //check the batch
    var running = com.guidewire.pl.system.dependency.PLDependencies.getBatchProcessManager().batchProcessStatus(batchType).getRunning();
    if (running) return true;
  
    //check the workers
    var worker = Query.make(InstrumentedWorker);
    worker.compare("EndTime", Equals, null); //is Active
    worker.compare("WorkQueueId", Equals, batchType);
    var task = worker.subselect("ID", CompareIn, InstrumentedWorkerTask as IEntityType, "InstrumentedWorker");
    task.compare("InstrumentedWorker", Equals, worker.getColumnRef("ID"));
    task.compare("EndTime", Equals, null); //is Active
  
    var result = worker.select().FirstResult;
    if (result != null) return true;
    
    //check the gap between the workers and the batch
    var name = getQueueWorkItemEntityName(batchType);
    if (name != null) {
      var count = countWorkItemsRemaining(name);
      if (count > 0) return true;
    }
    
    return false;
  }

  /**
   * This is here for cert testing, this method may not work correctly.
   */
  public function isQueueRunningLiveOnThisServer(batchType:BatchProcessType):boolean {
    var dwm = com.guidewire.pl.system.dependency.PLDependencies.getDistributedWorkerManager();
    for (var w in dwm.getWorkers(batchType.Code)) {
      if (w.isRunning() and !w.isSuspended()) return true;
    }
    return false;
  }

  public function getQueueWorkItemEntityName(batchType:BatchProcessType):String {
    for (var s in com.guidewire.pl.system.dependency.PLDependencies.getDistributedWorkerManager().getConfiguredQueues()) {
      if (s.QueueType == batchType) {
        return s.WorkItemType.Name;
      }
    }
    return null;
  }

  public function countWorkItemsRemaining(workItemEntityName:String):int {
    var q = Query.make(IEntityType.forName(workItemEntityName) as IEntityType);
    q.compare("status", NotEquals, WorkItemStatusType.TC_FAILED);
    return q.select().Count;
  }

}
