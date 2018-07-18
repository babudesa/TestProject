package gaic.import.bill.single
uses util.gaic.billimport.BillImportCommon
uses util.gaic.billimport.BillProcessorCallBackHandler
uses gw.transaction.Transaction
uses gw.api.util.Logger
uses gaic.import.TpaPaymentImportCommon
uses java.lang.Exception
uses util.WCHelper
uses gw.api.util.DateUtil
uses gw.api.databuilder.AddressBuilder
uses java.math.BigDecimal
uses java.util.Date
uses gw.api.financials.CheckCreator
uses java.util.ArrayList


/**
 * Default single importer for TPA payment integrations
 */
class TpaSinglePaymentImporter extends SingleBillImporter {
 
  protected static final var TPA_MCO_ROLE : String = "TpaPaymentMCORole"
  protected static final var TPA_DOC_ROLE : String = "TpaPaymentDocRole" 
  protected static final var TPA_PERSON_ROLE : String = "TpaPaymentPersonVendorRole"
  protected static final var TPA_COMPANY_ROLE : String = "TpaPaymentCompanyVendorRole"  
  protected static final var TPA_LAWFIRM_ROLE : String = "TpaPaymentLawFirmRole"  
  protected static final var TPA_ATTORNEY_ROLE : String = "TpaPaymentAttorneyRole"  
  protected static final var CHECK_TYPE_ISSUED : String = "issued"
  protected static final var CHECK_TYPE_REQTOPAY : String = "reqtopay"
 

  construct(payment : BillImportRecordExt) {
    super(payment)
  }

 /**
 * This is the intended entry point for the processor called by a client API. It creates it's own bundle and adds
 * any objects needed to process the payment to that bundle. It then creates the check, and commits
 * it to the database. If an error occurrs, an Exception status is set on the result object and the stack trace is logged
 * to the server console.
 */
  override function processBill() : BillImportResultExt{
    try{    
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {        
        
        super._claim = bundleBean(BillImportCommon.getClaim(_bill.ClaimNumber)) as Claim
        super._exposure = bundleBean(this.getExposureToPay()) as Exposure
        
        this.createVendor(_bill.VendorTaxID)        
        this.createCheckWithCreator()
        
        _result.Status = BillImportStatusExt.TC_PROCESSED    
        //add the line category description used to process the payment.  This is only so the batch job knows the description
        //for the reports if a different expense code is sent in with the invoice versus what was sent in for validation. 
        _result.LineCategoryDesc =  TpaPaymentImportCommon.getLineCategoryDesc(super._bill)  
        
        //if this is a WC claim we need to handle the injury type/reserve line callback
        if(WCHelper.isWCorELLossType(super._claim)) {
          var cbh = new BillProcessorCallBackHandler(super._claim.PublicID, super._injuryType, super._reserveLine)
          bundle.addBundleTransactionCallback(cbh)
        }

      }, getRequestingUser())
      
      _result.ClaimClosedDate = _claim.CloseDate
      
    }catch(ex){
      //set error status on bill object 
      _result.Status = BillImportStatusExt.TC_EXCEPTION
      _result.ErrorMessage = ex.Message
      Logger.logInfo("Error importing Payment with ExternalLinkID: " + _bill.ExternalLinkID)
      Logger.logInfo(ex.StackTraceAsString)
    }
    
    return _result
  }
  
  override property get VendorMCONamespace() : String {
    return TPA_MCO_ROLE
  }


  override property get VendorDocNamespace() : String {
    return TPA_DOC_ROLE
  }

  
  protected property get CompanyVendorNamespace() : String {
    return TPA_COMPANY_ROLE
  }

  
  protected property get PersonVendorNamespace() : String {
    return TPA_PERSON_ROLE
  }
  
  
  protected property get LawFirmNamespace() : String {
    return TPA_LAWFIRM_ROLE
  }
  

  protected property get AttorneyNamespace() : String {
    return TPA_ATTORNEY_ROLE
  }
  

  override property get CheckCategory() : CheckCategoryExt {
    return null // must be implemented with value in sub class.
  }
 
  
  override function getLineCategory() : LineCategory {    
    return TpaPaymentImportCommon.getLineCategory(super._bill)
  }
  
  protected function getExposureToPay() : Exposure {
    return TpaPaymentImportCommon.getMatchingATPFeaturesByType(super._claim, super._bill.FeatureType).first()
  }
  
  
  /**
   * If the payee is a vendor then we create the payee with
   * super class function otherwise we use non-vendor payee creation.
   */
  override function createVendor(taxID : String) {
    if(TpaPaymentImportCommon.getContactRoleFromPayeeType(super._bill) == ContactRole.TC_VENDOR) {
      super.createVendor(taxID)
    }else {
      this.createNonVendorPayee()
    }     
  }
  
  
  protected override function addAdditionalRole(claimCon : ClaimContact) {
    if(_bill.ExpenseCode == null){
      throw new Exception("Expense Code is null on import object.")
    }
  
    var roleToAdd : ContactRole
  
    //try and find a more specific role based off the vendor type
    if(typeof claimCon.Contact == MedicalCareOrg){
      roleToAdd = _mapper.getInternalCodeByAlias("ContactRole", getVendorMCONamespace(), _bill.ExpenseCode)
    }else if(typeof claimCon.Contact == Doctor){
      roleToAdd = _mapper.getInternalCodeByAlias("ContactRole", getVendorDocNamespace(), _bill.ExpenseCode) 
    }else if(typeof claimCon.Contact == LawFirm){
      roleToAdd = _mapper.getInternalCodeByAlias("ContactRole", getLawFirmNamespace(), _bill.ExpenseCode)
    }else if(typeof claimCon.Contact == Attorney){
      roleToAdd = _mapper.getInternalCodeByAlias("ContactRole", getAttorneyNamespace(), _bill.ExpenseCode)
    }else if(typeof claimCon.Contact == CompanyVendor){
      roleToAdd = _mapper.getInternalCodeByAlias("ContactRole", getCompanyVendorNamespace(), _bill.ExpenseCode)
    }else if(typeof claimCon.Contact == PersonVendor){
      roleToAdd = _mapper.getInternalCodeByAlias("ContactRole", getPersonVendorNamespace(), _bill.ExpenseCode)
    }
    
    // add default role of other to prevent errors if no specifica role is found
    if(roleToAdd == null) {
      //we will default to Other role rather than cause an unexpected error.
      roleToAdd = ContactRole.TC_OTHER
    }
  
    //add a new ClaimContactRole to the ClaimContact (payee)
    if(willRoleBeUnique(roleToAdd)){
      var ccr = new ClaimContactRole()
      ccr.ClaimContact = claimCon
      ccr.Role = roleToAdd
    }
  }
  

  /**
   * Create the non-vendor payee for the check.
   */
  protected function createNonVendorPayee() {
    var contactsToSearch = TpaPaymentImportCommon.getClaimLevelPayeeContacts(super._claim, super._bill)
    var nonVendorPayee : ClaimContact = TpaPaymentImportCommon.getNonVendorPayeeMatch(contactsToSearch, super._bill)
 
    //if the non vendor payee is found on the claim then use it, otherwise we theow exception
    if(nonVendorPayee != null){
       _payeeContact = super.bundleBean(nonVendorPayee) as ClaimContact
    }else{
      throw new Exception("Unable to locate non vendor claim contact. External ID: " + super._bill.ExternalLinkID + " on the Claim")
    }    
  }

  
  /**
   * Creates the checks
   */
  override function createCheckWithCreator() {
    var checkCreator = this.getCheckCreator()
    var paymentType = this.getPaymentType()
    var lineCategory = this.getLineCategory()    
    super._injuryType = this.getInjuryType()
    
    _check = checkCreator
      .withPayee(this.getPayeeContact())
      .withPayeeRole(this.getPayeeContactRole()) 
      .withCheckAmount(this.getCheckAmount())
      .withScheduledSendDate(this.getScheduleSendDate())
      .withRequestingUser(this.getCheckRequestingUser())
      .withLineCategory(lineCategory)
      .withCostCategory(this.getCostCategory())
      .withCostType(this.getCheckCostType())
      .withPaymentType(paymentType)
      .withErodesReserves(this.getWithErodeReserves(paymentType))
      .withMailToAddress(this.getMailToAddress())
      .withMemo(this.getStatementOfAccount())
      .withReportabilityType(this.getReportabilityType())
      .withPayTo(this.getPayToString())
      .createCheck()
    
    //populate fields that are not available on the creator    
    _check.InvoiceNumber = this.getInvoiceNumber()
    _check.CheckNumber = this.getCheckNumber()
    _check.PrefixExt = this.getCheckPrefix()
    _check.BankAccount = this.getBankAccount()
    _check.CheckBatching = this.getCheckBatching()
    _check.CheckInstructions = this.getCheckHandlingInstructions()
    _check.ex_ProducerCopy = this.getProducerCopy()
    _check.IssueDate = this.getCheckIssueDate()
    _check.ex_DatePrinted = this.getCheckPrintedDate()
    _check.DeliveryMethod = this.getDeliveryMethod()
    _check.ex_MailTo = this.getMailToContact()
    _check.ex_MailToAddress = this.getMailToAddress()     
    _check.ServicePdStart = this.getServiceFromDate()
    _check.ServicePdEnd = this.getServiceToDate()
    _check.CheckCategoryExt = this.CheckCategory
    _check.ex_PayToAddress = this.getPayToAddress()
    _check.UpdateCheckHistoryExt = this.getUpdatesCheckHistory()
    _check.Claimant = this.getClaimant()
    _check.SourceSystemExt = this.getSourceSystem()    
    _check.PaymentMethod = this.getPaymentMethod()
    _check.ex_ManualPaymentMethod = this.getManualPaymentMethod()
    this.configureLineItem(lineCategory)
    this.setInjuryType()
    _check.PayToLine1Ext = this.getPayToLine1()
    _check.PayToLine2Ext = this.getPayToLine2()
    _check.PayToLine3Ext = this.getPayToLine3()
    _check.PayToLine4Ext = this.getPayToLine4()
    _check.PayToLine5Ext = this.getPayToLine5()
    _check.PayToLine6Ext = this.getPayToLine6()
    
    super._exposure.MethodOfSettlementExt = this.getMethodOfSettlement()
    super._exposure.SettleMethod = this.getSettlementType()

    setVendorBillDetail() //populates details of the original invoice
    checkCreator.prepareForCommit() //validates the check and updates taccounts    
  }
    

  protected function getCheckCreator() : CheckCreator {
    return super._exposure.CheckCreator
  }
  
  
  /**
   * Gets the injury type
   */
  protected function getInjuryType() : WCInjuryTypeExt {
    var type : WCInjuryTypeExt
    //if this is a WC claim we need to set injury type    
    if(WCHelper.isWCorELLossType(super._claim)) {
      type = TpaPaymentImportCommon.getInjuryTypeFromImportRecord(super._bill)
    }
    return type
  }
  
  
  /**
  * Gets the payee contact
  */
  protected function getPayeeContact() : Contact {
    return super._payeeContact.Contact
  }
  
  
  /**
  * Gets the payee contact role
  */
  protected function getPayeeContactRole() : ContactRole {
    return TpaPaymentImportCommon.getContactRoleFromPayeeType(super._bill)
  }
  
  
  /**
  * Gets the check amount from the import record
  */
  protected function getCheckAmount() : BigDecimal {
    return super._bill.FinalAmount
  }
  
  
  /**
  * Gets the scheduled send date if this is a request 
  * to pay check
  */
  protected function getScheduleSendDate() : Date {
    var sendDate : Date
    if(super._bill.CheckType == CHECK_TYPE_REQTOPAY){
      sendDate = DateUtil.currentDate().trimToMidnight()
    }
    return sendDate
  }
  
  
  /**
  * Gets the requesting user
  */
  protected function getCheckRequestingUser() : User {
    return (super._exposure.AssignedUser)
  }
  
  
  /**
  * Gets the expesnse type
  */
  protected function getExpenseType() : TransactionQualifierExt {
    return TpaPaymentImportCommon.getExpenseTypeFromImportRecord(super._bill)
  }
  
  
  /**
  * Gets the cost category type
  */
  protected function getCostCategory() : CostCategory {
    return CostCategory.TC_UNSPECIFIED
  }
  
  
  /**
  * Gets the cost type
  */
  protected function getCheckCostType() : CostType {
    return TpaPaymentImportCommon.getCostTypeFromImportRecord(super._bill)
  }
 
  
  /**
  * Gets the errodes reserve flag
  */
  protected function getWithErodeReserves(paymentType : PaymentType) : boolean {
    return paymentType == typekey.PaymentType.TC_SUPPLEMENT ? false : true
  }
  
  
  /**
  * Gets the statement of account type
  */
  protected function getStatementOfAccount() : String {
      return super._bill.StatementOfAccount
  }
  
  /**
  * Gets the pay to string for check creator
  */
  protected function getPayToString() : String {
      return super._payeeContact.Contact.DisplayName
  }
  
  
  /**
  * Gets the reportability type.  If non vendor then
  * this is set to non-reportable.  There is a rule that sets
  * reportable for vendors based on other rules.
  */
  protected function getReportabilityType() : ReportabilityType {
    var payeeType : ContactRole = TpaPaymentImportCommon.getContactRoleFromPayeeType(super._bill)
    var reportType : ReportabilityType
    
    if(payeeType == ContactRole.TC_VENDOR) {
      reportType = ReportabilityType.TC_REPORTABLE
    }else {
      reportType = ReportabilityType.TC_NOTREPORTABLE    
    }
    
    return reportType
  }
  
  
  /**
  * Gets the invoice number
  */
  protected function getInvoiceNumber() : String {
      return super._bill.InvoiceNumber
  }
  
  
  /**
  * Gets the check number only uses check number from the import
  * record if the check is issued
  */
  protected function getCheckNumber() : String {
    var checkNumber : String
    if(super._bill.CheckType == CHECK_TYPE_ISSUED){
      return super._bill.CheckNumber
    }
    return checkNumber    
  }
    
    
  /**
  * Gets the check prefix
  */
  protected function getCheckPrefix() : CheckPrefixExt {
      return TpaPaymentImportCommon.getCheckPrefixFromImportRecord(super._bill)
  }
  
  
  /**
  * Gets the bank account
  */
  protected function getBankAccount() : BankAccount {
      return BankAccount.TC_NATIONAL_CITY
  }
  
  
  /**
  * Gets the check batching if the check is request 
  * to pay
  */
  protected function getCheckBatching() : CheckBatching {
    var batching : CheckBatching
    if(super._bill.CheckType == CHECK_TYPE_REQTOPAY){
      batching = CheckBatching.TC_APDEFAULT
    }      
    return batching
  }
  
  
  /**
  * Gets the check instructions if the check is request 
  * to pay
  */
  protected function getCheckHandlingInstructions() : CheckHandlingInstructions {
    var instructions : CheckHandlingInstructions
    if(super._bill.CheckType == CHECK_TYPE_REQTOPAY){
      instructions = CheckHandlingInstructions.TC_DEFAULT
    }      
    return instructions
  }


  /**
  * Gets the producer copy flag
  */
  protected function getProducerCopy() : YesNo {
      return YesNo.TC_NO
  }
  
  
  /**
  * Gets the check Issue date if the check is
  * issued
  */
  protected function getCheckIssueDate() : Date {
    var date : Date
    if(super._bill.CheckType == CHECK_TYPE_ISSUED){
      date = super._bill.CheckIssueDate
    }      
    return date      
  }
  
  
  /**
  * Gets the check print date if the check is
  * issued. The same value as the check issue date
  */
  protected function getCheckPrintedDate() : Date {
    var date : Date
    if(super._bill.CheckType == CHECK_TYPE_ISSUED){
      date = super._bill.CheckIssueDate
    }      
    return date      
  }
  
  
  /**
  * Gets the delivery method
  */
  protected function getDeliveryMethod() : DeliveryMethod {
      return DeliveryMethod.TC_SEND
  }
  
  
  /**
  * Gets the mail to contact.  If the payee data is not the 
  * same as the mail data on the record then we will search
  * claim / policy contacts for the mail to contact.  If payee / mail to
  * data is the same then we return the payee contact as the mail
  * to contact.  
  */
  protected function getMailToContact() : Contact {
    var mailToContact : ClaimContact
    var contactsToSearch : ArrayList<ClaimContact> = new ArrayList<ClaimContact>()
    //add claim contacts
    contactsToSearch.addAll(super._claim.ClaimContactsForAllRoles as java.util.ArrayList<entity.ClaimContact>)
    //add policy contacts
    contactsToSearch.addAll(super._claim.Policy.ClaimContactsForAllRoles as java.util.ArrayList<entity.ClaimContact>)
    
    if(TpaPaymentImportCommon.isPayeeSameAsMailTo(super._bill)){
      mailToContact = super._payeeContact
    }else{
      mailToContact = TpaPaymentImportCommon.getMailToContactMatch(contactsToSearch, super._bill)
    }      
    
    return mailToContact.Contact
  }
  
  
  /**
  * Gets the service from date
  */
  protected function getServiceFromDate() : Date {
    return super._bill.ServiceFromDate     
  }
  
  /**
  * Gets the service to date
  */
  protected function getServiceToDate() : Date {
    return super._bill.ServiceToDate     
  }
  
  
  /**
  * Gets the update check history flag
  */
  protected function getUpdatesCheckHistory() : boolean {
    return true 
  }
  
  
  /**
  * Gets the claimant
  */
  protected function getClaimant() : Contact {
    return super._exposure.Claimant
  }
  

  /**
  * Gets the source system
  */
  protected function getSourceSystem() : SourceSystemExt {    
    return super._bill.SourceSystem
  }
  
  
  /**
  * Gets the payment method for the check.  If import request is
  * is issued then set to manual, if request to pay then the 
  * type is check 
  */
  protected function getPaymentMethod() : PaymentMethod {
    var method : PaymentMethod
    if(super._bill.CheckType == CHECK_TYPE_ISSUED){
      method = PaymentMethod.TC_MANUAL
    } else if(super._bill.CheckType == CHECK_TYPE_REQTOPAY){
      method = PaymentMethod.TC_CHECK
    }
    return method
  }
  
  
  /**
  * Gets manual payment method given the value
  * on the import record.
  */
  protected function getManualPaymentMethod() : ManualPaymentMethod {
    var method : ManualPaymentMethod
    if(super._bill.CheckType == CHECK_TYPE_ISSUED){
      method = TpaPaymentImportCommon.getManualPaymentMethodFromImportRecord(super._bill)
    } 
    return method
  }
  
  
  /**
   * Set injury type will only be executed if 
   * this record is associated with a WC claim.
   */
  override function setInjuryType() {
    if(WCHelper.isWCorELLossType(super._claim)){
      super.setInjuryType()
    }  
  }
  
  
  /**
  * Gets the pay to line 1 from import record
  */
  protected function getPayToLine1() : String {
    return super._bill.PayToTheOrderOfLine1  
  }
  
  
  /**
  * Gets the pay to line 2 from import record
  */
  protected function getPayToLine2() : String {
    return super._bill.PayToTheOrderOfLine2 
  }
  

  /**
  * Gets the pay to line 3 from import record
  */
  protected function getPayToLine3() : String {
    return super._bill.PayToTheOrderOfLine3 
  }  
  

  /**
  * Gets the pay to line 4 from import record
  */
  protected function getPayToLine4() : String {
    return super._bill.PayToTheOrderOfLine4 
  }
 

  /**
  * Gets the pay to line 5 from import record
  */
  protected function getPayToLine5() : String {
    return super._bill.PayToTheOrderOfLine5 
  }


  /**
  * Gets the pay to line 6 from import record
  */
  protected function getPayToLine6() : String {
    return super._bill.PayToTheOrderOfLine6 
  }
  
  
  /**
   * Gets the method of settlement given the
   * type on the import record
   */
  protected function getMethodOfSettlement() : MethodOfSettlement {
    return TpaPaymentImportCommon.getMethodOfSettlementFromImportRecord(super._bill)
  }
  
  
  /**
  * Gets the settlement type  given the
  * type on the import record
  */
  protected function getSettlementType() : SettleMethod {
    return TpaPaymentImportCommon.getSettlementTypeFromImportRecord(super._bill)
  }
  
  
  override function configureLineItem(lineCategory : LineCategory){
    var lineItem = _check.Payments[0].FirstLineItem
    if(!lineItem.New){
      lineItem = super.bundleBean(lineItem) as TransactionLineItem 
    }
    lineItem.GrossAmountExt = super._bill.FinalAmount
    lineItem.LineCategory = lineCategory
    lineItem.TransactionQualifierExt = this.getExpenseType()
  }
   
  
  /**
   * We create the maile to address object from the data in the import record
   */ 
  override function getMailToAddress() : Address{       
    var address : Address = new AddressBuilder()
                                 .asType(AddressType.TC_MAILING)
                                 .withAddressLine1(super._bill.MailToAddLine1)
                                 .withAddressLine2(super._bill.MailToAddLine2)
                                 .withCity(super._bill.MailToCity)
                                 .withState(State.get(super._bill.MailToState))
                                 .withPostalCode(super._bill.MailToZip)                                 
                                 .create()
    return address
  }
  
  
  /**
  * We create the pay to address object from the data in the import record
  */ 
  protected function getPayToAddress() : Address {       
    var address : Address = new AddressBuilder()
                                 .asType(AddressType.TC_MAILING)
                                 .withAddressLine1(super._bill.PayToAddLine1)
                                 .withAddressLine2(super._bill.PayToAddLine2)
                                 .withCity(super._bill.PayToCity)
                                 .withState(State.get(super._bill.PayToState))
                                 .withPostalCode(super._bill.MailToZip)                                 
                                 .create()
    return address
  }
  
 

}//End Class
