package gw.plugin.policy.impl
uses gw.plugin.policy.IPolicySystemNotificationPlugin
uses java.util.Calendar
uses gw.plugin.policy.PolicySystemRetryableException
uses gw.plugin.policy.PolicySystemAlreadyExecutedException
uses soap.pcnotification.api.ClaimToPolicySystemNotificationAPI
uses soap.pcnotification.fault.SOAPServerException
uses soap.pcnotification.fault.AlreadyExecutedException

/**
 * Implementation of IPolicySystemNotificationPlugin that uses web services to
 * notify Guidewire PolicyCenter
 */
@Export
class PCPolicySystemNotificationPlugin implements IPolicySystemNotificationPlugin {

  var _policySystemAPI : ClaimToPolicySystemNotificationAPI

  construct() {
    _policySystemAPI = new ClaimToPolicySystemNotificationAPI()
    _policySystemAPI.addGWAuthentication()
  }
  
  override function claimExceedsLargeLossThreshold(lossDate : Calendar,
          policyNumber : String, grossTotalIncurred : String, transactionId : String) {
    executeNotification(\ -> {
      _policySystemAPI.claimExceedsThreshold(lossDate, policyNumber, grossTotalIncurred, transactionId)
    })
  }
  
  private function executeNotification(notification()) {
    try {
      notification()
    } catch (e : SOAPServerException) {
      throw new PolicySystemRetryableException("SOAP error when contacting policy system", e)
    } catch (e : AlreadyExecutedException) {
      throw new PolicySystemAlreadyExecutedException("Policy system already processed this notification", e)
    }
  }

}
