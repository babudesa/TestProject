package util.gaic.EDW;

class EDWDataFunctions {

  private construct() {
  }

  // Sends LitAdvisor outbound message to CSC for any added or field changes listed in exposureFieldChanged() function
  // in an InSuit Feature.
  static function sendExposureChanges(messageContext : MessageContext, exposure : Exposure) {
    var invokeMessage = true;
    if (messageContext.EventName == "ExposureChanged" && exposure.Claim.Changed && exposure.Claim.Policy.Changed) {
      invokeMessage = false;
    }

    if (exposure.ex_InSuit && exposure.State != "draft" && invokeMessage) {
      if (anyFieldChanged(exposure)) {
        send(messageContext, exposure);
      }
    }
  }

  // Sends LitAdvisor outbound message to CSC for any field changes listed in claimFieldChanged() function
  // in a Claim that has InSuit Feature.
  static function sendClaimChanges(messageContext : MessageContext, claim : Claim) {
    var invokeMessage = false;

    for (exposure in claim.Exposures) {
      if (!exposure.New && exposure.ex_InSuit && exposure.State != "draft" && anyFieldChanged(exposure)) {
        invokeMessage = true;
      } else {
        invokeMessage = false;
      }

      if (invokeMessage) {
        send(messageContext, exposure);
      }
    }
  }

  // Sends LitAdvisor outbound message to CSC for any field changes listed in policyFieldChanged() function
  // in a Policy associated with the Claim that has InSuit Feature.
  static function sendPolicyChanges(messageContext : MessageContext, policy : Policy) {
    var isClaimNew = false;
    if (policy.Changed && policy.Claim.Changed) {
      isClaimNew = true;
    }

    for (exposure in policy.Claim.Exposures) {
      if (exposure.ex_InSuit && exposure.State != "draft" && anyFieldChanged(exposure) && !isClaimNew) {
        send(messageContext, exposure);
      }
    }
  }

  // Sends LitAdvisor outbound message to CSC for Loss payments in an InSuit Feature
  // if check status is 'issued' and if it is not an offset payment or if the check status is 'transferred'
  static function sendLossCheckChanges(messageContext : MessageContext, check : Check) {
    // the condition make sure that it will not go inside the loop only for these status
    // to avoid going into the loop every time the function is invoked
    if (check.Status == "issued" || check.Status == "pendingtransfer" || check.Status == "stopped" || check.Status == "voided") {
      for (exposure in check.Claim.Exposures) {
        if (exposure.ex_InSuit && exposure.State != "draft") {
          for (payment in check.Payments) {
            // check conditions above needs to be added again to include payment conditions
            if (!payment.New && payment.Exposure == exposure && payment.CostType == "claimcost"
            && (check.Status == "issued" || (check.Status == "pendingtransfer" && !payment.OffsetPayment)
            || check.Status == "stopped" || check.Status == "voided")) {
              send(messageContext, exposure);
              break;
            }
          }
        }
      }
    }
  }

  // Sends LitAdvisor outbound message to CSC for Loss reserves in an InSuit Feature if reserve status is 'submitted'
  static function sendLossReserveChanges(messageContext : MessageContext, reserve : Reserve) {
    if (reserve.CostType == "claimcost" && reserve.Status == "submitting"
    && reserve.Exposure.ex_InSuit && reserve.Exposure.State != "draft") {
      send(messageContext, reserve.Exposure);
    }
  }

  // Sends LitAdvisor outbound message to CSC for Loss payment that is recoded in an InSuit Feature
  static function sendLossPaymentChanges(messageContext : MessageContext, payment : Payment) {
    if (payment.Exposure.ex_InSuit && payment.Exposure.State != "draft" && payment.CostType == "claimcost"
    && (payment.Status == "pendingrecode" || (messageContext.EventName == "PaymentAdded"
    && payment.Status != "pendingtransfer"
    && !(payment.PaymentBeingOffset != null && (payment.PaymentBeingOffset.Status == "pendingrecode"
    || payment.PaymentBeingOffset.Status == "pendingtransfer" ))))) {
      send(messageContext, payment.Exposure);
    }
  }

  // Helper for anyFieldChanged; returns true if any claim fields of interest to LitAdvisor have changed
  private static function claimFieldChanged(claim : Claim) : boolean {
    var fields = new String[] {  "ClaimNumber", "LossDate", "ReportedDate", "DateRptdToAgent", "IncidentReport",
    "FirstNoticeSuit", "Description", "WeatherRelated_Ext", "EstimatedDamage_Ext", "Catastrophe", "LossCause",
    "ex_DetailLossCause", "LossType", "HowReported", "ex_LossLocation", "AssignmentDate", "Status", "JurisdictionState",
    "ClosedOutcome", "ReOpenedReason" };
    
    if (fieldFromListChanged(claim, fields)) {
      return true;
    }
    if (addressFieldChanged(claim.LossLocation)) {
      return true;
    }
    return false;
  }

  // Helper for anyFieldChanged; returns true if any policy fields of interest to LitAdvisor have changed
  private static function policyFieldChanged(policy : Policy) : boolean {
    return fieldFromListChanged(policy, new String[] { "PolicyNumber", "EffectiveDate", "ExpirationDate" });
  }

  // Helper for anyFieldChanged; returns true if any contact fields of interest to LitAdvisor have changed
  private static function contactFieldChanged(contact : Contact) : boolean {
    if ((contact typeis Person) && fieldFromListChanged(contact, new String[] { "LastName", "FirstName", "MiddleName" })) {
      return true;
    }
    if ((contact typeis Company) && fieldFromListChanged(contact, new String[] { "Name" })) {
      return true;
    }
    return false;
  }

  // Helper for anyFieldChanged; returns true if any exposure fields of interest to ISO have changed
  private static function exposureFieldChanged(exposure : Exposure) : boolean {
    if (fieldFromListChanged(exposure, new String[] {  "ex_InSuit", "AssignedUser" })) {
      return true;
    }

    if (exposure.isFieldChanged("ClaimantDenorm") || contactFieldChanged(exposure.ClaimantDenorm)) {
      return true;
    }
    return false;
  }

  // Helper for anyFieldChanged; returns true if any address fields of interest to ISO have changed
  private static function addressFieldChanged(address : Address) : boolean {
    return fieldFromListChanged(address, new String[] { "State" })
  }

  private static function send(messageContext : MessageContext, exposure : Exposure) {
    var message = messageContext.createMessage(exposure as java.lang.String);
    message.putEntityByName( "feature", exposure );
    if (message.Claim == null) {
      message.Claim = exposure.Claim;
    }
  }

  // Returns true if any field of interest to LitAdvisor has changed. This check is split into separate
  // functions which check the exposure, claim, policy etc.
  private static function anyFieldChanged(exposure : Exposure) : boolean {
    return exposureFieldChanged(exposure) || claimFieldChanged(exposure.Claim) || policyFieldChanged(exposure.Claim.Policy);
  }

  // Utility method, checks if any of the named fields of the given bean have changed
  private static function fieldFromListChanged(bean : KeyableBean, fields : String[]) : boolean {
    if (bean != null) {
      for (field in fields) {
        if (bean.isFieldChanged(field)) {
          return true;
        }
      }
    }
    return false;
  }
}
