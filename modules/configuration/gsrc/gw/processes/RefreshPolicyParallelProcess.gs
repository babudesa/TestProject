package gw.processes
uses com.gaic.claims.util.db.DatabaseUtil
uses gw.processes.BatchProcessBase
uses gw.policy.RefreshPolicy
uses gw.policy.RefreshPolicyParallel

uses java.sql.Connection
uses java.lang.Runtime


/**
 * Refresh the policy on the selected claims.
 * Refreshing the policy is used primarily to supplement the conversion of certain claims from the mainframe.
 * These claims do not have the reinsurance information when converted into ClaimCenter.
 * Refreshing the policy causes update of the reinsurance information on the claim.
 * This refreshing should not cause sending the changes to ISO as this is a technical step, not a business update.
 * A threaded version of the RefreshPolicy.gs for faster execution
 * It uses the threaded version only if there are more than one processors
 */
class RefreshPolicyParallelProcess extends BatchProcessBase{

 private var con:Connection = null
 private var _logger = com.guidewire.cc.system.logging.CCLoggerCategory.SERVER_BATCHPROCESS.Logger
 
 construct(batchProcessType:BatchProcessBase) {    
    this(batchProcessType)
 }
  
  construct() {
    super(BatchProcessType.TC_REFRESHPOLICY)
    con = DatabaseUtil.openConnectionToClaimCenterWithDefaultProperties()
    con.setAutoCommit(false)
  }

  /**
   * Where most of the action happens
   * Refresh the policy for the claims
   * use the parallel evaluation if there are more than one cores available
   */
  override function doWork() {
    _logger.info("RefreshPolicy called")
    var cores: int=Runtime.getRuntime().availableProcessors()
    _logger.info("Number of processors: "+cores)
    if (cores > 1) {
      _logger.info("RefreshPolicyParallel started")
      RefreshPolicyParallel.refreshClaimPolicy()
       _logger.info("RefreshPolicy completed")      
    }
    else {
       _logger.info("RefreshPolicy started")
       RefreshPolicy.refreshClaimPolicy()
       _logger.info("RefreshPolicy completed")
    }
  }
}
