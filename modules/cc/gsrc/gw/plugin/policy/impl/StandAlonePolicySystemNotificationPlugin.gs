package gw.plugin.policy.impl
uses gw.plugin.policy.IPolicySystemNotificationPlugin
uses java.util.Calendar

/**
 * Skeleton implementation of IPolicySystemNotificationPlugin, implements the
 * interface but all methods are empty.
 */
@Export
class StandAlonePolicySystemNotificationPlugin implements IPolicySystemNotificationPlugin {

  override function claimExceedsLargeLossThreshold(lossDate : Calendar,
          policyNumber : String, grossTotalIncurred : String, transactionId : String) {
  }

}
