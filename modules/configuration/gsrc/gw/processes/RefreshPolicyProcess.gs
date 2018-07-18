package gw.processes
uses com.gaic.claims.util.db.DatabaseUtil
uses gw.processes.BatchProcessBase
uses gw.policy.RefreshPolicy

uses java.sql.Connection


/**
 * Refresh the policy on the selected claims.
 * Refreshing the policy is used primarily to supplement the conversion of certain claims from the mainframe.
 * These claims do not have the reinsurance information when converted into ClaimCenter.
 * Refreshing the policy causes update of the reinsurance information on the claim.
 * This refreshing should not cause sending the changes to ISO as this is a technical step, not a business update.
 */
class RefreshPolicyProcess extends BatchProcessBase{

 private var con:Connection = null
 private var _logger = com.guidewire.cc.system.logging.CCLoggerCategory.SERVER_BATCHPROCESS.Logger
 
 // the file with a claimNumber in each line
 // the policy for each claim will be refreshed
 // the file is located on the server under the /tmp directory
 private var claimFileName="cc_refresh_policy.txt"

 
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
   */
  override function doWork() {
    _logger.info("ClaimRefreshPolicy called")
    RefreshPolicy.refreshClaimPolicy(claimFileName)
    _logger.info("ClaimRefreshPolicy completed")
  }
  

}
