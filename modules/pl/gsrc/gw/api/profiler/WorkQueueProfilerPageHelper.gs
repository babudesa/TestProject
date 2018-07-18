package gw.api.profiler
uses gw.api.database.Query

class WorkQueueProfilerPageHelper {
  static function getQuery() : InstrumentedWorkerQuery {
    var q = Query.make(InstrumentedWorker)
    q.or(\ restriction -> {
      restriction.compare("ProfilerData", NotEquals, null)
      var subselect = restriction.subselect("ID", CompareIn, InstrumentedWorkerTask, "InstrumentedWorker")
      subselect.compare("ProfilerData", NotEquals, null)
    })
    return q.select()
  }
}
