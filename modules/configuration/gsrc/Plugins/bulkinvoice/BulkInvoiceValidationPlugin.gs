package Plugins.bulkinvoice;
uses java.util.List;
uses java.util.ArrayList;

class BulkInvoiceValidationPlugin implements gw.plugin.financials.IBulkInvoiceValidationPlugin
{
  construct() {
  }
  
  public override function validateBulkInvoice(bulkInvoice : BulkInvoice) : BIValidationAlert[] {
    var allAlerts : List = new ArrayList();
    var alert : BIValidationAlert
    var isValidVendor : boolean = false;

    //********************************************
    //NOTE: Alert Messages must not exceed 255 characters!!
    //********************************************

    //CHECK FOR DUPLICATE BULK INVOICE NUMBERS
    var query = find (bulkInv in BulkInvoice where bulkInv.BulkInvoiceIDExt==bulkInvoice.BulkInvoiceIDExt)
    if(bulkInvoice.BulkInvoiceIDExt!=null and query.getCount()>1){
      alert = new BIValidationAlert(bulkInvoice);
      alert.AlertMsg = "Cannot have two or more invoices with the same invoice number"
      allAlerts.add(alert)
    }
    
    //CHECK IF THE SUM OF THE INVOICE TOTAL MATCHES THE BULK INVOICE NET CHECK SUM
    var sumOfDetail:double = 0
    for(item in bulkInvoice.InvoiceItems) {
      sumOfDetail = sumOfDetail + item.Amount.Amount as double
    }
    if(bulkInvoice.BulkInvoiceTotal != sumOfDetail){
      alert = new BIValidationAlert( bulkInvoice );
      alert.AlertMsg = "The bulk invoice total does not match the sum of the invoice items"
      allAlerts.add(alert)
    }
    
    //TRANSACTION VALIDATIONS
    if(exists(item in bulkInvoice.InvoiceItems where item.Amount==null)){
      alert = new BIValidationAlert(bulkInvoice)
      alert.AlertMsg = "Line Items on the invoice must have a valid payable amount"
      allAlerts.add(alert)
    }
    
    //CHECK TO MAKE SURE THE DATE OF SERVICE TO IS GREATER THAN FROM
    if(bulkInvoice.DateOfServiceFromExt > bulkInvoice.DateOfServiceToExt){
      alert = new BIValidationAlert(bulkInvoice)
      alert.AlertMsg = "Date of Service End must occur on the same date or after Date of Service Start"
      allAlerts.add(alert)
    }
    
    //IF IS A MEDICAL PAYMENT AND THE CODE IS "COST CONTROL VENDORS,"
    //IT MUST BE BOOKED AS AN EXPENSES.
    for(item in bulkInvoice.InvoiceItems){
      if(item.Exposure.IsMedicalPaymentExt && item.LineCategoryExt == LineCategory.TC_COST_CONTROL_VENDORS 
         && (item.CostType != CostType.TC_EXPENSE && item.CostType != CostType.TC_GAIASTPAEXPENSE)) {
            alert = new BIValidationAlert(bulkInvoice)
            alert.AlertMsg = "Cost Control services must be entered as an expense. See item " +
                              item.Exposure + " from claim: " + item.Exposure.Claim
            allAlerts.add(alert)        
      }
    }
    
    //CHECK IF THE LINE ITEM CLAIMS ARE AT ABILITY TO PAY
    var claimNumbers : List = new ArrayList()
    for(item in bulkInvoice.InvoiceItems){
      if(item.Claim.ValidationLevel!="payment"){
        if(!exists(num in claimNumbers where num.toString()==item.ClaimNumber)){
          claimNumbers.add(item.Claim.ClaimNumber)
          alert = new BIValidationAlert(bulkInvoice)
          alert.AlertMsg = "Claim " + item.Claim.ClaimNumber + " is not at Ability to Pay"
          allAlerts.add( alert )
        }
      }
    }
    claimNumbers.clear()
    
    
    //CHECK IF THE VENDOR SELECTED IS PAYABLE
    if(typeof bulkInvoice.Payee == PersonVendor){
      isValidVendor = true
      if((bulkInvoice.Payee as PersonVendor).PayableExt==false){
        alert = new BIValidationAlert(bulkInvoice)
        alert.AlertMsg = "The vendor you have chosen is not payable."
        allAlerts.add(alert)
      }
    } else if (typeof bulkInvoice.Payee == CompanyVendor){
      isValidVendor = true
      if((bulkInvoice.Payee as CompanyVendor).PayableExt==false){
        alert = new BIValidationAlert(bulkInvoice)
        alert.AlertMsg = "The vendor you have chosen is not payable."
        allAlerts.add(alert)
      }
    }
    
    //CHECK IF THE VENDOR SELECTED IS LINKED AND SYNCED, AND IF IT IS, IN FACT, A VENDOR
    var payee = bulkInvoice.Payee
    if(isValidVendor){
      if(payee.generateLinkStatus().Linked and !payee.generateLinkStatus().Synced){
        alert = new BIValidationAlert(bulkInvoice)
        alert.AlertMsg = "The payee you have chosen is out of sync."
        allAlerts.add(alert)
      }
    }
    
    if(bulkInvoice.isForeignVendorSubtype(payee)){
      alert = new BIValidationAlert(bulkInvoice)
      alert.AlertMsg = "You cannot pay a Foreign Vendor."
      allAlerts.add(alert)
    }
    
    //CHECK IF THE VENDOR SELECTED HAS A TAX LEVY OR BACKUP WITHHOLDING STATUS - CANNOT PAY THESE VENDORS
    if(payee.Ex_TaxStatusCode=="B"){
      alert = new BIValidationAlert(bulkInvoice)
      alert.AlertMsg = "You cannot use Bulk Invoice to pay a vendor that has Backup Withholding."
      allAlerts.add(alert)
    }
    
    if(payee.Ex_TaxStatusCode=="T"){
      alert = new BIValidationAlert(bulkInvoice)
      alert.AlertMsg = "You cannot use Bulk Invoice to pay a vendor that has a Tax Levy."
      allAlerts.add(alert)
    }
        
    //Defect 1087 - METHOD OF SETTLEMENT
    //METHOD OF SETTLEMENT IS REQUIRED ON A BODILY INJURY FEATURE ONCE THERE IS A LOSS PAYMENT AND THE FEATURE
    //IS FINANCIALLY CLOSED (update 11/09 - Only required if the feature is closed)
    var msg = "Method of Settlement is required: "
    //var methodRequired = false
    for(item in bulkInvoice.InvoiceItems){
      if(item.Exposure.IsBodilyInjuryFeature and item.Exposure.MethodOfSettlementExt==null and
         item.Exposure.ValidationLevel== ValidationLevel.TC_PAYMENT and 
         item.CostType== CostType.TC_CLAIMCOST and (item.PaymentType==PaymentType.TC_SUPPLEMENT|| item.PaymentType==PaymentType.TC_FINAL)){
           alert = new BIValidationAlert(bulkInvoice)
           alert.AlertMsg = msg + item.Exposure + " (" + item.ClaimNumber + ")"
           allAlerts.add(alert)
      }
    }
    
    //Defect 1386 - TOTAL LOSS INDICATOR
    //TOTAL LOSS INDICATOR IS REQUIRED ON A FIRST-PARTY PHYSICAL DAMAGE OR PROPERTY FEATURE ONCE THERE IS A LOSS 
    //PAYMENT AND THE FEATURE IS FINANCIALLY CLOSED
    //3/26/10 erawe - defect 2894 - no longer need to check if a features' financial status is 'closed' for TLI
    var msg2 = displaykey.Rules.Validation.Exposure.TotalLossIndicator.Message
    var totalLossRequired = false
    for(item in bulkInvoice.InvoiceItems){
      if(item.Exposure.totalLossNeededForPymt() and item.Exposure.TotalLossIndExt==null and
         item.Exposure.ValidationLevel=="payment"){

        if(totalLossRequired){
          alert = new BIValidationAlert(bulkInvoice)
          alert.AlertMsg = msg2 + item.Exposure + " (" + item.ClaimNumber + ")"
          allAlerts.add(alert)
        } else {
          if(item.CostType=="claimcost" and (item.PaymentType=="final" || item.PaymentType=="supplement")){
            alert = new BIValidationAlert(bulkInvoice)
            alert.AlertMsg = msg2 + item.Exposure + " (" + item.ClaimNumber + ")"
            allAlerts.add(alert)
          }
        }
      }
    }
    
    //MAKE FOR (MEMO) REQUIRED FOR STATEMENT OF ACCOUNT
    var msgMemo = "FOR is required for an accurate Statement of Account"
    if(bulkInvoice.Memo==null){
      alert = new BIValidationAlert(bulkInvoice)
      alert.AlertMsg = msgMemo
      allAlerts.add(alert)
    }
    
    //***********************************************
    //RETURN RESULTS
    if(allAlerts!=null){
      return allAlerts as BIValidationAlert[];
    } else {
      return new BIValidationAlert[0];
    }
    //***********************************************
  }
}

