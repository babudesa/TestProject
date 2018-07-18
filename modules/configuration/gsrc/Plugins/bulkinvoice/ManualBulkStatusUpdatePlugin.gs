package Plugins.bulkinvoice

uses com.gaic.claims.util.messagequeue.MessageQueueAlertAPI
uses com.gaic.claims.util.messagequeue.alert.AlertType
uses gw.plugin.messaging.MessageTransport
uses gw.plugin.InitializablePlugin
uses java.util.Map

/**
 * This class is used by the event fired rules in order to process the intercepted
 * BulkInvoiceStatusChanged event for Manual Check Option Bulk Invoices.  This plugin
 * handles the issuing, voiding, and stopping of this type of Bulk Invoice since we do not send these out
 * to be processed.
 */
class ManualBulkStatusUpdatePlugin implements MessageTransport, InitializablePlugin {

  private var _messageQueueAlertAPI : MessageQueueAlertAPI
  private static final var QUEUE_NAME = "Manual Check Bulk Invoice Status Updater"

    construct() {
    this._messageQueueAlertAPI = new MessageQueueAlertAPI()
  }

  override function setParameters(p0 : Map < Object, Object > ) {}

  override function resume() {}

  override function setDestinationID(id : int) {}

  override function shutdown() {}

  /**
  * Handles the suspend even of the plugin by sending an email
  * out using the message queue alert API
  */
  override function suspend() {
  var environment = gw.api.system.server.ServerUtil.getEnv()
  	if(environment != "local"){
    	_messageQueueAlertAPI.sendQueueSuspendedAlert(QUEUE_NAME, AlertType.EMAIL)
    }
  }

  /**
  * Handles the "sending" of the message
  */
  override function send(message : Message, payload : String) {

    try {

      var bulkInvoice = message.MessageRoot as BulkInvoice

        switch (bulkInvoice.Status) {
        case (BulkInvoiceStatus.TC_PENDINGSTOP):
          this.stopBulkInvoice(bulkInvoice)
          break
        case (BulkInvoiceStatus.TC_PENDINGVOID):
          this.voidBulkInvoice(bulkInvoice)
          break
        case (BulkInvoiceStatus.TC_AWAITINGSUBMISSION):
          this.issueBulkInvoice(bulkInvoice)
          break
        default:
          break
        }
        message.reportAck()
    } catch (e) {
      message.reportError()
      _messageQueueAlertAPI.sendQueueErrorAlert(message, QUEUE_NAME, AlertType.EMAIL)
    }
  }

  /**
  * Performs the actions to issue an manual check option
  * Bulk Invoice.
  * 1. Sets the status to Issued
  * 2. Sets all Line Item Statuses to Submitted
  * 3. Triggers the BulkInvoiceStatusChanged event
  */
  @ Param("bulkInvoice", "The Bulk Invoice to be Issued")
  private function issueBulkInvoice(bulkInvoice : BulkInvoice) {

    bulkInvoice.Status = BulkInvoiceStatus.TC_ISSUED
      bulkInvoice.InvoiceItems.each( \ item->{
        item.Status = BulkInvoiceItemStatus.TC_SUBMITTED
      })
      bulkInvoice.addEvent("BulkInvoiceStatusChanged")
  }

  /**
  * Performs the actions to stop an manual check option
  * Bulk Invoice.
  * 1. Sets the status to Stopped
  * 2. Triggers the BulkInvoiceStatusChanged event
  */
  @ Param("bulkInvoice", "The Bulk Invoice to be Stopped")
  private function stopBulkInvoice(bulkInvoice : BulkInvoice) {

    bulkInvoice.Status = BulkInvoiceStatus.TC_STOPPED
      bulkInvoice.addEvent("BulkInvoiceStatusChanged")
  }

  /**
  * Performs the actions to void an manual check option
  * Bulk Invoice.
  * 1. Sets the status to Voided
  * 2. Triggers the BulkInvoiceStatusChanged event
  */
  @ Param("bulkInvoice", "The Bulk Invoice to be Voided")
  private function voidBulkInvoice(bulkInvoice : BulkInvoice) {

    bulkInvoice.Status = BulkInvoiceStatus.TC_VOIDED
      bulkInvoice.addEvent("BulkInvoiceStatusChanged")

  }

} //End ManualBulkInvoiceStatusUpdater
