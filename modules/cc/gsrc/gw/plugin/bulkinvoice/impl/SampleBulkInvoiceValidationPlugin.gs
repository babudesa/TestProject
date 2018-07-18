package gw.plugin.bulkinvoice.impl;

uses gw.plugin.financials.IBulkInvoiceValidationPlugin

@Export
class SampleBulkInvoiceValidationPlugin implements IBulkInvoiceValidationPlugin
{
  construct()
  {
  }

  public override function validateBulkInvoice(bulkInvoice : BulkInvoice) : BIValidationAlert[] {
    // you have full access to the BulkInvoice's fields and the contained BulkInvoiceItems
    // i.e., var items = bulkInvoice.InvoiceItems;
    
    // to help with testing, we'll check the InvoiceNumber.  If it contains the substring "fail", 
    // then we generated 2 Validation Alerts
    
    var invoiceNumber = bulkInvoice.InvoiceNumber;
    
    if (invoiceNumber == null) {
      invoiceNumber = "";
    }
    invoiceNumber = invoiceNumber.toUpperCase();
    if ( invoiceNumber.indexOf( "FAIL" ) != -1) {    
      // for each validation failure, add to the bulk invoice
      // this is the default AlertType - no need to set unless you want a different value
      // The BIValidationAlertType typelist is customer extendable
      // The message will preferrably be meaningful to someone viewing it in the UI.
      bulkInvoice.addValidationAlert( "unspecified", "1st Test Failure" )
      bulkInvoice.addValidationAlert( null, "2nd Test Failure" )
     
      // Return all generated Alerts as an array
      return bulkInvoice.ValidationAlerts
    } else {
      // OR - if the validation has succeeded, return NULL or an empty array
      // return null;
      //   or
      return new BIValidationAlert[0];
    }
  }
}
