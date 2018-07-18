package gw.processes

uses gw.api.system.PLConfigParameters
uses gw.api.util.DateUtil

@Export
class WorkQueueInstrumentationPurge extends PurgeProcessBase {

  construct() {
    this({PLConfigParameters.InstrumentedWorkerInfoPurgeDaysOld.Value})
  }

  construct(daysOld : int, batchSize : int) {
    this({daysOld, batchSize})
  }
  
  private construct(arguments : Object[]) {
    super(TC_WorkQueueInstrumentationPurge, arguments)
  }

  override function getQueryToRetrieveOldEntries( daysOld : int ) : KeyableBeanQuery {
    return find(iwt in InstrumentedWorkerTask where iwt.EndTime < DateUtil.currentDate().addDays(- daysOld))
  }
}
