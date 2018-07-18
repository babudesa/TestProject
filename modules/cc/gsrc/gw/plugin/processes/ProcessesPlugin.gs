package gw.plugin.processes
uses gw.plugin.processing.IProcessesPlugin
uses gw.processes.BatchProcess
uses gw.util.ClaimHealthCalculatorBatch
uses gw.util.PurgeMessageHistory
uses gw.util.CatastropheClaimFinderBatch

@Export
class ProcessesPlugin implements IProcessesPlugin {

  construct() {
  }

  override function createBatchProcess(type : BatchProcessType, arguments : Object[]) : BatchProcess {
    switch(type) {
      case BatchProcessType.TC_CLAIMHEALTHCALC:
        return new ClaimHealthCalculatorBatch();
      case BatchProcessType.TC_PURGEMESSAGEHISTORY:
        return new PurgeMessageHistory(arguments);
      case BatchProcessType.TC_CATASTROPHECLAIMFINDER:
        return new CatastropheClaimFinderBatch();
      default:
        return null
    }
  }

}
