package util.gaic;

class LitAdvisorFunctions
{
  construct()
  {
  }
  
  // Sends LitAdvisor outbound message to CSC for any added or field changes listed in exposureFieldChanged() function
  // in an InSuit Feature.
  static function sendExposureChanges(messageContext : MessageContext, exposure : Exposure)
  {
    var useNewService = useNewService(exposure.Claim.LossType)
    
    if (exposure.State != "draft" && (exposure.State == "closed" || anyFieldChanged(exposure)))
    {
      if (exposure.LegalExpenseExt && useNewService){
        for(assignment in exposure.Claim.Matters*.MatterAssignmentsExt){
            if (assignment.AssignmentExposuresExt*.Exposure.contains(exposure)){
              sendNewMatter( messageContext, assignment );
            }
          }
      } else if (exposure.ex_InSuit) {
        send(messageContext, exposure);
      }
    }
  }

  // Sends LitAdvisor outbound message to CSC for any field changes listed in claimFieldChanged() function
  // in a Claim that has InSuit Feature.
  static function sendClaimChanges(messageContext : MessageContext, claim : Claim)
  {
    var useNewService : boolean = useNewService(claim.LossType);
    for (exposure in claim.Exposures)
    {
      if (!exposure.New && exposure.State != "draft" && anyFieldChanged(exposure))
      {
        if (exposure.LegalExpenseExt && useNewService){
          for(assignment in claim.Matters*.MatterAssignmentsExt){
            if (assignment.AssignmentExposuresExt*.Exposure.contains(exposure)){
              sendNewMatter( messageContext, assignment );
            }
          }
        } else if (exposure.ex_InSuit) {
          send(messageContext, exposure);
        }
      }
    }
  }
  
  static function sendToLSS(lossType : LossType) : boolean {
    var lssAdminInfo = find (admin in LSSAdminExt where admin.LossTypeExt ==lossType).AtMostOneRow
    return (lssAdminInfo == null) ? false : lssAdminInfo.EnableLSSExt
  }
  
  static function useNewService(lossType : LossType) : boolean {
    var lssAdminInfo = find (admin in LSSAdminExt where admin.LossTypeExt ==lossType).AtMostOneRow
    return (lssAdminInfo == null) ? 
    false : 
    (lssAdminInfo.EnableLSSExt && (lssAdminInfo.EffectiveDateExt == null || (lssAdminInfo.EffectiveDateExt.compareTo(now() as java.util.Date) < 1)))
  }

  static function sendNewMatter(messageContext : MessageContext, assignment : MatterAssignmentExt){
    if (!matterInError(assignment)) {      
      var message = messageContext.createMessage(assignment.toString())
      message.putEntityByName("MatterAssignmentExt", assignment)
      var lssAdminInfo = find (admin in LSSAdminExt where admin.LossTypeExt == assignment.Matter.Claim.LossType).AtMostOneRow
      message.putEntityByName("adminInfo", lssAdminInfo)
      message.putEntityByName( "feature", assignment.AssignmentExposuresExt[0].Exposure );
    }
  }
  
  static function closeLawError(assignment : MatterAssignmentExt) {
    if (assignment.AssignmentExposuresExt*.DispositionTypeExt.contains(DispositionTypeExt.TC_LAWFIRASSIGNEDINERROR)) {      
      assignment.MatterAssignmentStatusExt = MatterAssignmentStatus.TC_DISABLED
      assignment.StatusExt = typekey.AssignmentStatusExt.TC_CLOSED
      assignment.ClosedDate = new java.util.Date()
    } 
  }

  static  function matterInError(matterExt : MatterAssignmentExt) : boolean {
    var inError = false;
    for(aex in matterExt.AssignmentExposuresExt) { 
      if (aex.DispositionTypeExt == DispositionTypeExt.TC_LAWFIRASSIGNEDINERROR) {
        if (!aex.ChangedFields.contains("DispositionTypeExt")) {
          inError = true
        }
      }
    }
    return inError;
  }

  // Sends LitAdvisor outbound message to CSC for any field changes listed on the exposures
  static function sendChangesToLSS(messageContext : MessageContext, exposures : Exposure[])
  {
    for (exposure in exposures)
    {
      if (exposure.State != "draft" && anyFieldChanged(exposure))
      {
          if (useNewService(exposure.Claim.LossType) && exposure.LegalExpenseExt){
            for(assignment in exposure.Claim.Matters*.MatterAssignmentsExt){
              if (assignment.AssignmentExposuresExt*.Exposure.contains(exposure)){
                util.gaic.LitAdvisorFunctions.sendNewMatter( messageContext, assignment );
              }
            }
          } else if (exposure.ex_InSuit) {
            send(messageContext, exposure);
          }
      }
    }
  }

  // Sends LitAdvisor outbound message to CSC for Loss payments in an InSuit Feature
  // if check status is 'issued' and if it is not an offset payment or if the check status is 'transferred'
  static function sendLossCheckChanges(messageContext : MessageContext, check : Check)
  {
    //var sendMessage = false;
    
    // the condition make sure that it will not go inside the loop only for these status
    // to avoid going into the loop every time the function is invoked
    if (check.Status == "issued" || check.Status == "pendingtransfer"
        || check.Status == "stopped" || check.Status == "voided")
    {
      for (exposure in check.Claim.Exposures)
      {
        if (exposure.State == "draft") continue;

        for (payment in check.Payments)
        {
          // check conditions above needs to be added again to include payment conditions
          if (!payment.New && payment.Exposure == exposure && payment.CostType == "claimcost"
              && (check.Status == "issued" || (check.Status == "pendingtransfer" && !payment.OffsetPayment)
              || check.Status == "stopped" || check.Status == "voided"))
          {
            if (useNewService(exposure.Claim.LossType) && exposure.LegalExpenseExt){
              for(assignment in exposure.Claim.Matters*.MatterAssignmentsExt){
                if (assignment.AssignmentExposuresExt*.Exposure.contains(exposure)){
                  util.gaic.LitAdvisorFunctions.sendNewMatter( messageContext, assignment );
                }
              }
              break;
            } else if (exposure.ex_InSuit) {
              send(messageContext, exposure);
              break;
            }
          }
        }
      }
    }
  }

  // Sends LitAdvisor outbound message to CSC for Loss reserves in an InSuit Feature if reserve status is 'submitted'
  static function sendLossReserveChanges(messageContext : MessageContext, reserve : Reserve)
  {
    if (reserve.CostType == "claimcost" && reserve.Status == "submitting"
        && reserve.Exposure.State != "draft")
    {
        if (useNewService(reserve.Exposure.Claim.LossType) && reserve.Exposure.LegalExpenseExt){
          for(assignment in reserve.Exposure.Claim.Matters*.MatterAssignmentsExt){
            if (assignment.AssignmentExposuresExt*.Exposure.contains(reserve.Exposure)){
              util.gaic.LitAdvisorFunctions.sendNewMatter( messageContext, assignment );
            }
          }
        } else if (reserve.Exposure.ex_InSuit) {
          send(messageContext, reserve.Exposure);
        }
    }
  }

  // Sends LitAdvisor outbound message to CSC for Loss payment that is recoded in an InSuit Feature
  static function sendLossPaymentChanges(messageContext : MessageContext, payment : Payment)
  {
    if (payment.Exposure.State != "draft" && payment.CostType == "claimcost"
        && (payment.Status == "pendingrecode" || (messageContext.EventName == "PaymentAdded"
        && payment.Status != "pendingtransfer"
        && !(payment.PaymentBeingOffset != null && (payment.PaymentBeingOffset.Status == "pendingrecode"
            || payment.PaymentBeingOffset.Status == "pendingtransfer" )))))
    {
      if (useNewService(payment.Exposure.Claim.LossType) && payment.Exposure.LegalExpenseExt){
        for(assignment in payment.Exposure.Claim.Matters*.MatterAssignmentsExt){
          if (assignment.AssignmentExposuresExt*.Exposure.contains(payment.Exposure)){
            util.gaic.LitAdvisorFunctions.sendNewMatter( messageContext, assignment );
          }
        }
      } else if (payment.Exposure.ex_InSuit) {
        send(messageContext, payment.Exposure);
      }
    }
  }

  //
  // Helper for anyFieldChanged; returns true if any exposure fields of interest to ISO have changed
  //
  private static function exposureFieldChanged(exposure : Exposure) : boolean
  {
    if (fieldFromListChanged(exposure, new String[] {  "ex_InSuit", "AssignedUser" }))
    {
      return true;
    }
    
    if (exposure.isFieldChanged("ClaimantDenorm") || contactFieldChanged(exposure.ClaimantDenorm))
    {
      return true;
    }
    return false;
  }

  //
  // Helper for anyFieldChanged; returns true if any claim fields of interest to LitAdvisor have changed
  //
  private static function claimFieldChanged(claim : Claim) : boolean
  {
    if (fieldFromListChanged(claim, new String[] {  "Policy", "ClaimNumber", "ReportedDate", "LossDate", "Description", "AssignedUser" }))
    {
      return true;
    }
    if (addressFieldChanged(claim.LossLocation))
    {
      return true;
    }
    if (claim.isFieldChanged("InsuredDenorm") || contactFieldChanged(claim.InsuredDenorm) || contactFieldChanged(claim.Insured))
    {
      return true;
    }
    if (claim.isFieldChanged("ClaimantDenorm") || contactFieldChanged(claim.ClaimantDenorm) || contactFieldChanged(claim.claimant))
    {
      return true;
    }
    return false;
  }

  //
  // Helper for anyFieldChanged; returns true if any policy fields of interest to LitAdvisor have changed
  //
  private static function policyFieldChanged(policy : Policy) : boolean
  {
    return fieldFromListChanged(policy, new String[] { "PolicyNumber", "EffectiveDate", "ExpirationDate" });
  }

  //
  // Helper for anyFieldChanged; returns true if any contact fields of interest to LitAdvisor have changed
  //
  private static function contactFieldChanged(contact : Contact) : boolean
  {
    if ((contact typeis Person) && fieldFromListChanged(contact, new String[] { "LastName", "FirstName", "MiddleName" }))
    {
      return true;
    }
    if ((contact typeis Company) && fieldFromListChanged(contact, new String[] { "Name" }))
    {
      return true;
    }
    return false;
  }

  //
  // Helper for anyFieldChanged; returns true if any address fields of interest to ISO have changed
  //
  private static function addressFieldChanged(address : Address) : boolean
  {
    return fieldFromListChanged(address, new String[] { "State" })
  }

  private static function send(messageContext : MessageContext, exposure : Exposure)
  {
    var message = messageContext.createMessage(exposure.toString())
    message.putEntityByName( "feature", exposure );
    if (message.Claim == null)
    {
      message.Claim = exposure.Claim;
    }
    var lssAdminInfo = find (admin in LSSAdminExt where admin.LossTypeExt == message.Claim.LossType).AtMostOneRow
    message.putEntityByName("adminInfo", lssAdminInfo)
  }

  //
  // Returns true if any field of interest to LitAdvisor has changed. This check is split into separate
  // functions which check the exposure, claim, policy etc.
  //
  private static function anyFieldChanged(exposure : Exposure) : boolean
  {
    return exposureFieldChanged(exposure) || claimFieldChanged(exposure.Claim) || policyFieldChanged(exposure.Claim.Policy);
  }

  //
  // Utility method, checks if any of the named fields of the given bean have changed
  //
  private static function fieldFromListChanged(bean : KeyableBean, fields : String[]) : boolean
  {
    if (bean != null)
    {
      for (field in fields)
      {
        var prop =  bean.IntrinsicType.TypeInfo.getProperty(field) as java.lang.String;
        if (bean.isFieldChanged(prop))
        // as com.guidewire.commons.entity.type.EntityPropertyInfo))
        {
          return true;
        }
      }
    }
    return false;
  }
}
