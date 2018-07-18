package util.gaic.billimport.approval
uses entity.Activity
uses java.util.List
uses entity.Contact
uses entity.Group
uses entity.User
uses typekey.BulkInvoiceType
uses typekey.GlobalParamNameExt
uses entity.BulkInvoice
uses gw.api.financials.CurrencyAmount
uses java.text.SimpleDateFormat
uses java.math.BigDecimal


/**
 */
class ApprovalUtil {

  public static var MITCHELL_APPROVER : User = util.GlobalParameters.ParameterFinder.getUserParameter(GlobalParamNameExt.TC_MITCHELL_BI_APPROVAL, null)  
  public static var HCS_APPROVER : User = util.GlobalParameters.ParameterFinder.getUserParameter(GlobalParamNameExt.TC_HCS_BI_APPROVAL, null)  
  public static var OCCM_APPROVER : User = util.GlobalParameters.ParameterFinder.getUserParameter(GlobalParamNameExt.TC_OCCM_BI_APPROVAL, null)
  public static var WC_BI_TYPES : List<BulkInvoiceType> = {BulkInvoiceType.TC_MITCHELL, BulkInvoiceType.TC_ONECALLCARE, BulkInvoiceType.TC_HEALTHSOLUTION}
  public static var APPROVER_LIMIT : CurrencyAmount = new CurrencyAmount(new BigDecimal(500000)) //could not convince the right people to make this a script param
  
  construct() {}

  /**
   * Returns the Claim Payments To Date - Expense limit for the given user
   */
  static function getApproverLimit(approver : User) : CurrencyAmount{
    return approver.getAuthorityLimit(AuthorityLimitType.TC_CPTD, null, CostType.TC_EXPENSE).LimitAmount
  }
  
  /**
   * Determine if approval can be skipped for a bulk invoice check created for one of the Workers Comp vendors. The checks
   * do not actually get created until the approval happens, so we cannot reliably use CheckCategory
   */
  static function canSkipWCUnverified(checkSet : CheckSet) : boolean{
    return checkSet.PrimaryCheck.Bulked && WC_BI_TYPES.contains(checkSet.PrimaryCheck.BulkInvoiceItem.BulkInvoice.BulkInvoiceTypeExt)
  }
  
  
  static function requireApproval(invoice : BulkInvoice){
    invoice.requireApproval("Bulk invoice for " + invoice.Payee.DisplayName + " requires approval.")
  }
  
  
  static function needsWCApproval(invoice : BulkInvoice) : boolean{
    return WC_BI_TYPES.contains(invoice.BulkInvoiceTypeExt)
  }
  
  static function setApprovingUser(invoice : BulkInvoice, approver : User){
    if(approver != null && approver.RootGroup != null){
      invoice.setApprovingUser(approver, approver.RootGroup) 
    }
    
    var emailAddy = gw.api.system.server.ServerUtil.getEnv() == "prod" ? approver.Contact.EmailAddress1 : "ClaimCenterTesting@gaig.com"
    
    gw.api.email.EmailUtil.sendEmailWithBody(null, emailAddy, "", "ClaimCenterSupport@gaig.com", "", buildEmailSubject(invoice), buildEmailBody(invoice))
  }
  
  static function buildEmailBody(invoice : BulkInvoice) : String{
    return "Check " + invoice.CheckNumber + " associated with Bulk Invoice (" + invoice.BulkInvoiceIDExt + ") for $" + invoice.BulkInvoiceTotal.Amount +
      " is awaiting approval."
  }
  
  
  static function buildEmailSubject(invoice : BulkInvoice) : String{
    var subject = ""

    switch(invoice.BulkInvoiceTypeExt){
      case BulkInvoiceType.TC_MITCHELL:
        var sourceSys = getSourceSys(invoice)
                
        if(sourceSys == SourceSystemExt.TC_MITCHELL_SA){
          subject = "Mitchell Handling Fees for $"
        }else if(sourceSys == SourceSystemExt.TC_MITCHELL_DATACARE_UR){
          subject = "Mitchell UR Fees for $"
        }else{
          subject = "Mitchell Fees for $" 
        }
        break
      case BulkInvoiceType.TC_ONECALLCARE:
        subject = "One Call Care Bulk Check for $"
        break
      case BulkInvoiceType.TC_HEALTHSOLUTION:
        subject = "Healthcare Solutions Check for $"
        break        
      default:
        break
    }
    
    subject += invoice.BulkInvoiceTotal.Amount
    subject += " for " + new SimpleDateFormat("MM/dd/yyyy").format(gw.api.util.DateUtil.currentDate())
    
    return subject
  }
  
  /**
   * Determines the source system for a bulk invoice
   */
  static function getSourceSys(invoice : BulkInvoice) : SourceSystemExt{
    var sourceSys : SourceSystemExt
    
    try{
      
      var firstInvoiceItemInfo = invoice.InvoiceItems[0].BulkInvoiceItemInfo
      sourceSys = firstInvoiceItemInfo.BulkInvoiceItem.BillHolderExt != null 
        ? firstInvoiceItemInfo.BulkInvoiceItem.BillHolderExt.SourceSystem
        : firstInvoiceItemInfo.Check.SourceSystemExt
        
    }catch(e){
      gw.api.util.Logger.logInfo("Exception while trying to determine source system for invoice: " + invoice.BulkInvoiceIDExt)
      e.printStackTrace() 
    }
    
    return sourceSys
  }
  
  /**
   * Returns true if the given invoice has some approval history and totals more than the designated or last approving user's limit.
   */
  static function needsEscalation(invoice : BulkInvoice) : boolean{
    switch(invoice.BulkInvoiceTypeExt){
      case BulkInvoiceType.TC_MITCHELL:
        return util.custom_Ext.ApprovalRules.hasApprovalHistory(invoice) &&
          (invoice.BulkInvoiceTotal > getApproverLimit(MITCHELL_APPROVER) || invoice.BulkInvoiceTotal > getApproverLimit(invoice.LastApprovingUser))
      case BulkInvoiceType.TC_HEALTHSOLUTION:
        return util.custom_Ext.ApprovalRules.hasApprovalHistory(invoice) &&
          (invoice.BulkInvoiceTotal > getApproverLimit(HCS_APPROVER) || invoice.BulkInvoiceTotal > getApproverLimit(invoice.LastApprovingUser))    
      case BulkInvoiceType.TC_ONECALLCARE:
        return util.custom_Ext.ApprovalRules.hasApprovalHistory(invoice) && 
          (invoice.BulkInvoiceTotal > getApproverLimit(OCCM_APPROVER) || invoice.BulkInvoiceTotal > getApproverLimit(invoice.LastApprovingUser))    
      default: return false
    }
  }            
}
