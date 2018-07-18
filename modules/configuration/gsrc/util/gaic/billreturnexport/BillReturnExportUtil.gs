package util.gaic.billreturnexport

uses java.util.Date
uses java.text.SimpleDateFormat

class BillReturnExportUtil {

  construct() {

  }
  
  
  /**
   * Generates a bill return export message
   */
  @Returns("the bill return export message XML string")
  static function buildBillReturnExportMessage(check : Check) : String {
    
    var exportBillReturn = new util.gaic.billreturnexport.gaigbillreturnexport.BillReturn()
    
    exportBillReturn.RecType = "BH"    
    exportBillReturn.GlobalBillReturnID = check.VendorBillIDExt
    exportBillReturn.PaidAmount = check.GrossAmountExt
    exportBillReturn.CheckNumber = check.CheckNumber
    exportBillReturn.ClaimID = check.Claim.ClaimNumber
    exportBillReturn.BillPaidDate = convertDateToMitchellDateFormat(check.IssueDate)

    return exportBillReturn.asUTFString()
  }
  
  
  /**
  * Sends the message to CC External
  * 
  * @param messageContext the context of the message.
  * @param messageContent the message.
  */
  static function sendMessage(messageContext : MessageContext, messageContent : String) {
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, messageContent);   
  }
  
  /**
  * Converts a date to the Mitchell formatted date string
  * 
  * @param date
  * @return date formatted in Mitchell format
  */
   private static function convertDateToMitchellDateFormat(date : Date) : String {
      var formatter = new SimpleDateFormat("yyyyMMdd")
      return formatter.format(date).toString()
   }
  
  
}//end BillReturnExportUtil class
