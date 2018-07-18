package gw.policy.notification
uses gw.plugin.policy.IPolicySystemNotificationPlugin
uses gw.api.util.CurrencyUtil
uses gw.api.financials.FinancialsCalculationUtil

/**
 * Policy system notification for large losses. This notification fires if the
 * the gross total incurred on a claim rises above a configurable threshold.
 * <p>
 * This is a singleton strategy object; the rest of the policy notification
 * framework calls this singleton at stages during the delivery of a large loss
 * notification to the policy system.
 */
@Export
class LargeLossPolicySystemNotification extends PolicySystemNotificationBase {

  /** The event name for this notification */
  public static final var EVENT_NAME : String = "ClaimExceedsLargeLoss"
  
  /** Singleton instance of this notification strategy */
  public static final var INSTANCE : LargeLossPolicySystemNotification = new LargeLossPolicySystemNotification()

  private construct() {
    super(EVENT_NAME)
  }

  override function createMessage(context : MessageContext) {
    var claim = context.Root as Claim
    var amt = FinancialsCalculationUtil.getTotalIncurredGross().getAmount(claim)
    var renderedAmt = CurrencyUtil.renderAsCurrency(amt)
    var msg = context.createMessage(renderedAmt)
    msg.MessageRoot = claim
    claim.LargeLossNotificationStatus = "InQueue"
  }

  override function send(plugin : IPolicySystemNotificationPlugin, message : Message, transformedPayload : String) {
    var claim = message.Claim
    plugin.claimExceedsLargeLossThreshold(claim.LossDate.toCalendar(),
            claim.Policy.PolicyNumber, transformedPayload, message.PublicID)
  }

  override function afterSend(message : Message, status : MessageStatus) {
    if (status == GOOD) {
      message.Claim.LargeLossNotificationStatus = "Sent"
    } else if (status == NON_RETRYABLE_ERROR){
      message.Claim.LargeLossNotificationStatus = "None"
    }
  }
  
  override property get MessageResyncBehavior() : MessageResyncBehavior {
    return COPY_LAST
  }
}
