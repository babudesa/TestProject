package util.gaic.EDW;
uses templates.messaging.edw.CheckPaymentDataEDW
uses templates.messaging.edw.ReserveDataEDW
uses templates.messaging.edw.RecoveryDataEDW
uses templates.messaging.edw.RecoveryReserveDataEDW
uses templates.messaging.edw.BulkInvoiceDataEDW
uses templates.messaging.edw.PaymentScheduleEDW

class EDWFinancialFunctions {
  
  private construct() {
  }
  
  static function getInstance() : EDWFinancialFunctions {
    return new EDWFinancialFunctions();
  }
  
  function sendCheckChanges(messageContext : MessageContext, msgCheck : Check) {
    if ((msgCheck.isFieldChanged("Status") || (msgCheck.Changed)) &&
        (msgCheck.Status == "pendingtransfer" || msgCheck.Status == "submitted" ||
        msgCheck.Status == "pendingvoid" || msgCheck.Status == "pendingstop" ||
        msgCheck.Status == "issued" || msgCheck.Status == "voided" ||
        msgCheck.Status == "stopped" || msgCheck.Status == "cleared" ||
        msgCheck.Status == "recoded" || msgCheck.Status == "transferred")) {
      
      if(msgCheck.ManualCheck) {
         // changed check status from pendingvoid to voided if Check is Manual
        if (msgCheck.Status == "pendingvoid") {
          msgCheck.Status = "voided"; 
        }            
        // changed check status from pendingstop to stopped if Check is Manual
        if (msgCheck.Status == "pendingstop") {
          msgCheck.Status = "stopped";
        }        
        // changed policy status from pendingtransfer to transffered for any pendingtransfer manual check
        if (msgCheck.Status == "pendingtransfer") {
          msgCheck.Status = "transferred";
          for (var thepolicy in msgCheck.Payments) {
             if (thepolicy.Status == "pendingtransfer") {
               thepolicy.Status = "transferred";
             }
          }
         }
      }
      
     // changed payment status from submitting to subtmitted when a check has been issued or transferred
      if (msgCheck.Status == "issued" || msgCheck.Status == "transferred" || msgCheck.Status =="cleared"
      || msgCheck.Status == "voided" || msgCheck.Status == "stopped") {
        for (var thepayment in msgCheck.Payments) {
          if (thepayment.Status == "submitting") {
            thepayment.Status = "submitted";
          }
        }
      }  
      
        if((!msgCheck.ManualCheck && msgCheck.Status != "pendingvoid"
          && msgCheck.Status != "pendingstop" && msgCheck.Status != "pendingtransfer")
        || (msgCheck.ManualCheck && !(msgCheck.Status == "issued" && msgCheck.Bulked == true))) {          
          createCheckPayload(messageContext, msgCheck, "C");
      }
    }
  }

  function sendPaymentChanges(messageContext : MessageContext, msgCheck : Check) {
    // send the check message when a payment has been recoded
    createCheckPayload(messageContext, msgCheck, "C");
  }
  
  function sendEscheatChanges(messageContext : MessageContext, msgCheck : Check) {
    // send the check message when escheat status or date has been changed
    if (!msgCheck.isFieldChanged("Status")) {
      createCheckPayload(messageContext, msgCheck, "C");
    }
  }
   
  function sendReserveChanges(messageContext : MessageContext, msgReserve : Reserve) {
    if (msgReserve.Status == "submitting" || msgReserve.Status == "submitted" ||
        msgReserve.Status == "voided" || msgReserve.Status == "stopped" ||
        msgReserve.Status == "recoded" || msgReserve.Status == "transferred") {
      if (msgReserve.Status == "submitting" and !(msgReserve.Status == "voided" || msgReserve.Status == "stopped")) {
        // Force submitted?
        msgReserve.Status = "submitted";
      }
      
      createReservePayload(messageContext, msgReserve, "C");
    }
  }
  
  function sendRecoveryChanges(messageContext : MessageContext, msgRecovery : Recovery) {
    if (msgRecovery.isFieldChanged("Status") &&
      (msgRecovery.Status == "submitting" || msgRecovery.Status == "pendingvoid" ||
      msgRecovery.Status == "submitted" || msgRecovery.Status == "voided" ||
      msgRecovery.Status == "stopped" || msgRecovery.Status == "recoded" ||
      msgRecovery.Status == "transferred")) {
      if (msgRecovery.Status == "submitting") {
        // Force submitted?
        msgRecovery.Status = "submitted";
      }
      if (msgRecovery.Status == "pendingvoid") {
        // Force voided?
        msgRecovery.Status = "voided";
      }
      
      createRecoveryPayload(messageContext, msgRecovery, "C");
    }
  }
  
  function sendRecoveryReserveChanges(messageContext : MessageContext, msgRecoveryReserve : RecoveryReserve) {
    if (msgRecoveryReserve.isFieldChanged("Status") &&
      (msgRecoveryReserve.Status == "submitting" || msgRecoveryReserve.Status == "submitted" ||
      msgRecoveryReserve.Status == "voided" || msgRecoveryReserve.Status == "stopped" ||
      msgRecoveryReserve.Status == "recoded" || msgRecoveryReserve.Status == "transferred")) {
      if (msgRecoveryReserve.Status == "submitting") {
        // Force submitted?
        msgRecoveryReserve.Status = "submitted";
      }
      
      createRecoveryReservePayload(messageContext, msgRecoveryReserve, "C");
    }
  }
  
  function sendBulkInvoiceChanges(messageContext : MessageContext, bi : BulkInvoice) {
    //code added by Kamesh Gopalan on 02/19/2010
    //Check template should go before bulk invoice template bcoz bulk invoice 
    //referring payments for line items.
    if (bi.Status == "issued") {
       for(theInvoice in bi.InvoiceItems) {
         if (theInvoice.BulkInvoiceItemInfo.Check.Status == "issued") {
             createCheckPayload(messageContext, theInvoice.BulkInvoiceItemInfo.Check, "C");
         }
       }
    }
    //code ends here
    
    if ((bi.isFieldChanged("Status") || (bi.Changed)) && (bi.Status == "voided"
    || bi.Status == "stopped" || bi.Status == "issued" || bi.Status == "cleared")) {
      var objStatus = "";
      
      if (messageContext.EventName == "BulkInvoiceAdded") {
        objStatus = "A";
      } else if ((messageContext.EventName == "BulkInvoiceChanged")
      || (messageContext.EventName == "BulkInvoiceStatusChanged")) {
        objStatus = "C";
      }
      
      createBulkInvoicePayload(messageContext, bi, objStatus);
    }
  }
  
  function sendCheckRecurrenceAdd(messageContext : MessageContext, msgCheck : Check) {
    
      createCheckRecurrencePayload(messageContext, msgCheck, "A");
  }
    
  function sendCheckRecurrenceChanges(messageContext : MessageContext, msgCheck : Check) {
    
      createCheckRecurrencePayload(messageContext, msgCheck, "C");
  }
  
  protected function createCheckPayload(messageContext : MessageContext, theCheck : Check, objStatus : String) {
    var aPayment = theCheck.Payments != null ? theCheck.Payments[0] : null;
    var messageContent = CheckPaymentDataEDW.renderToString(theCheck, aPayment, objStatus, messageContext.EventName);
    var message = util.gaic.CommonFunctions.sendTemplateMessage(messageContext, messageContent);
    message.MessageCode = theCheck.PublicID;
  }
  
  protected function createReservePayload(messageContext : MessageContext, thereserve : Reserve, objStatus : String) {
    var eventName = messageContext.EventName;
    if(messageContext.EventName.equals("CheckStatusChanged")) {
      eventName = "ReserveStatusChanged";
    }
    var messageContent = ReserveDataEDW.renderToString(thereserve, objStatus, messageContext.EventName);
    var message = util.gaic.CommonFunctions.sendTemplateMessage(messageContext, messageContent);
    message.MessageCode = thereserve.PublicID;
    if (thereserve.Status == "submitted") {
      message.submittingTransaction( thereserve );
    }
  }

  protected function createRecoveryPayload(messageContext : MessageContext, therecovery : Recovery, objStatus : String) {
    var templateData = RecoveryDataEDW.renderToString(therecovery, objStatus, messageContext.EventName);
    var message = util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
    message.MessageCode = therecovery.PublicID;
    if (therecovery.Status == "submitted") {
      message.submittingTransaction( therecovery );
    } else if (therecovery.Status == "voided") {
      message.voidingRecovery( therecovery );
    }
  }
  
  protected function createRecoveryReservePayload(messageContext : MessageContext, therecoveryreserve : RecoveryReserve, objStatus : String) {
    var templateData = RecoveryReserveDataEDW.renderToString(therecoveryreserve, objStatus, messageContext.EventName);
    var message = util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
    message.MessageCode = therecoveryreserve.PublicID;
    if (therecoveryreserve.Status == "submitted") {
      message.submittingTransaction( therecoveryreserve );
    }
  }
  
  protected function createBulkInvoicePayload(messageContext : MessageContext, bi : BulkInvoice, objStatus : String) {
    var templateData = BulkInvoiceDataEDW.renderToString(bi, objStatus);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  }
  
  protected function createCheckRecurrencePayload(messageContext : MessageContext, chk : Check, objStatus : String) {
    var templateData = PaymentScheduleEDW.renderToString(chk, objStatus);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  }
  
  function isEscheatmentDateChanged(msgCheck : Check) : boolean {
    if (msgCheck != null && msgCheck.DateEscheatedExt != null && msgCheck.isFieldChanged("DateEscheatedExt")) {
      return true;
    }
    return false;
  }
  
  function isEscheatmentDateChanged(msgBI : BulkInvoice) : boolean {
    if (msgBI != null && msgBI.DateEscheatedExt != null && msgBI.isFieldChanged("DateEscheatedExt")) {
      return true;
    }
    return false;
  }
  
  function isEscheatStatusChanged(msgCheck : Check) : boolean {
    if (msgCheck != null && msgCheck.EscheatStatusExt != null && msgCheck.isFieldChanged("EscheatStatusExt")) {
      return true;
    }
    return false;
  }
  
  function isEscheatStatusChanged(msgBI : BulkInvoice) : boolean {
    if (msgBI != null && msgBI.EscheatStatusExt != null && msgBI.isFieldChanged("EscheatStatusExt")) {
      return true;
    }
    return false;
  }
}
