package gaic.import.bill.multi

uses gw.api.financials.CurrencyAmount
uses gw.api.database.Query
uses gw.api.util.DateUtil
uses java.math.BigDecimal
uses java.util.ArrayList
uses java.lang.Exception
uses gw.api.util.Logger
uses util.gaic.billimport.injurytype.InjuryTypeUtil
uses util.gaic.billimport.BillImportCommon
uses com.guidewire.pl.plugin.util.SequenceUtil
uses gw.api.util.TypecodeMapper


abstract class MultiBillImporter {
  
  protected var _fees : BillImportRecordExt[]
  protected var _sequenceUtil : SequenceUtil = SequenceUtil.getSequenceUtil()
  protected var _results : List<BillImportResultExt>
  protected var _mapper : TypecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
  protected var _payee : Contact 
  
  private static final var BI_SEQ_KEY = "BulkInvoiceSeqKey"
  private static final var BI_PREFIX = "BIV"
  private static final var BI_ITEM_SEQ_KEY = "BulkInvoiceItemSeqKey"
  private static final var BI_ITEM_PREFIX = "BII"
  private static final var BIN_SEQ_KEY = "Bulk"
  
  //namespaces for typecodemapping
  private static final var WC_EXPENSE_CODE = "WCExpenseCode" 
  
  construct(feeRecords : BillImportRecordExt[]) {
    _fees = feeRecords
    initResults()
  }
  
  abstract property get ThisBulkInvoiceType() : BulkInvoiceType
  abstract property get VendorMCONamespace() : String
  abstract property get VendorDocNamespace() : String
  
  protected abstract function getMemo(sourceSys : SourceSystemExt) : String   
  
  
  private function initResults(){
    _results = new ArrayList<BillImportResultExt>() 
    for(fee in _fees){
      var result = new BillImportResultExt()
      result.ExternalLinkID = fee.ExternalLinkID
      _results.add(result)
    }
  }
  
  
  function processFees() : BillImportResultExt[]{
    
    var binsList = new ArrayList<BillImportRecordExt[]>()
    binsList = this.splitBins(_fees, ScriptParameters.MaxBulkInvoiceImportSize)
    
    //for each bin array create a new bin! 
    for(binItemsArray in binsList) {
       
      try {
        gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
          var bi : BulkInvoice = createBulkInvoice(binItemsArray)
          var api = new gw.api.webservice.cc.financials.bulkpay.BulkInvoiceAPIImpl()
          bi = api.createBulkInvoice(bi)
          bi.validate()
        
          if(bi.Valid){
            bi.submitForApproval()
          }else{
            //refine how we want to pass this back to the batch job
            gw.api.util.Logger.logInfo(bi.ValidationAlerts) 
          }
        }, getRequestingUser())
      }catch(ex){
        Logger.logInfo("MultiBillImporter has encountered an exception...")
        Logger.logInfo(ex.StackTraceAsString)
        for(result in _results){
          result.Status = BillImportStatusExt.TC_EXCEPTION
          if(ex.Message.length > 4000){
            result.ErrorMessage = ex.Message.substring(0, 4000)
          }else{
            result.ErrorMessage = ex.Message 
          }
        }            
      }
    }
    
    return _results as entity.BillImportResultExt[]
  }
  
  
  /**
   * Split all bin items into multiple bin record arrays based on the given split size.
   */
  private function splitBins(binItemsToSplit : BillImportRecordExt[], splitSize: int) : ArrayList<BillImportRecordExt[]> {
    var binList = new ArrayList<BillImportRecordExt[]>()
    var nextBin = new ArrayList<BillImportRecordExt>()
    Logger.logInfo("Splitting Import Records List into BINs")
    Logger.logInfo("Split Size: " + splitSize + " Total Items to Split: " + binItemsToSplit.Count)
    for(item in binItemsToSplit index totalBinItemCount) {      
   
        //add the bin item from the main item list into
        //into the new bin item list
        nextBin.add(binItemsToSplit[totalBinItemCount])
      
        //if the bin is full then add it to the list 
        if(nextBin.Count == splitSize || binItemsToSplit.Count == (totalBinItemCount + 1)) {
          Logger.logInfo("Creating new BIN")
          binList.add(nextBin.toTypedArray())
          nextBin = new ArrayList<BillImportRecordExt>()
        }        
      }        
    return binList
  }
  
  
  function createBulkInvoice(binItemsArray : BillImportRecordExt[]) : BulkInvoice {
    _payee = createVendor(binItemsArray)
    var rptAmount = new CurrencyAmount()
    rptAmount.Currency = Currency.TC_USD
    rptAmount.Amount = BigDecimal.ZERO
    
    var bi = new BulkInvoice()
    bi.AutomatedInvoiceFlagExt = true    
    bi.BulkInvoiceTypeExt = BulkInvoiceType.TC_MITCHELL
    bi.SplitEqually = false
    bi.Payee = _payee
    
    for(fee in binItemsArray){
      Logger.logInfo("Attempting to create bulk invoice item for [InvoiceNumber:ExpenseCode]: " + "[" + fee.InvoiceNumber + ":" + fee.ExpenseCode + "]")
      if(fee.ExpenseCode == null) throw new Exception("Expense code for invoice " + fee.InvoiceNumber + " is null. Processing cannot continue.")
      var result = getResult(fee.ExternalLinkID)
      try{
        var item = createItem(fee, result)
        bi.addToInvoiceItems(item)
        rptAmount = rptAmount.Amount.add(fee.FinalAmount)
      }catch(ex){
        Logger.logInfo("MultiBillImporter unable to create bulk invoice item for Invoice Number: " + fee.InvoiceNumber)
        Logger.logInfo(ex.StackTraceAsString)
        result.Status = BillImportStatusExt.TC_EXCEPTION
        if(ex.Message.length > 4000){
          result.ErrorMessage = ex.Message.substring(0, 4000)
        }else{
          result.ErrorMessage = ex.Message 
        }
      }
    }
    
    bi.RequestingUser = getRequestingUser()
    bi.EscheatStatusExt = CheckEscheatStatusExt.TC_ESCHEATABLE
    //bi.PayeeAdditionalRoleExt = ContactRole.TC_COSTCONTROLVENDOR
    bi.Status = BulkInvoiceStatus.TC_DRAFT
    bi.BulkInvoiceTotal = rptAmount
    bi.ReportableAmount = rptAmount
    bi.DefaultCostCategory = CostCategory.TC_UNSPECIFIED
    bi.DefaultCostType = CostType.TC_EXPENSE
    bi.DefaultPaymentType = PaymentType.TC_PARTIAL
    bi.ApprovalStatus = ApprovalStatus.TC_UNAPPROVED
    bi.Memo = getMemo(binItemsArray[0].SourceSystem)
    bi.ScheduledSendDate = DateUtil.currentDate().trimToMidnight()
    bi.DeliveryMethod = DeliveryMethod.TC_SEND
    bi.CheckInstructions = CheckHandlingInstructions.TC_DEFAULT
    bi.CheckBatchingExt = CheckBatching.TC_BULKCHECK
    bi.BankAccountExt = BankAccount.TC_NATIONAL_CITY
    var mailingAddy = getMailToAddress(bi.Payee) 
    bi.MailToAddress = mailingAddy.toString()
    bi.MailToAddressExt = mailingAddy
    bi.PayToAddressExt = getMailToAddress(bi.Payee) //TODO same hierarchy is used for mailing/pay to but change method name
    bi.DateOfServiceFromExt = DateUtil.currentDate()
    bi.DateOfServiceToExt = DateUtil.currentDate()
    bi.PublicID = getPublicID(BI_PREFIX, BI_SEQ_KEY)    
    bi.BulkInvoiceIDExt = getNextBulkInvoiceNumber()
    bi.ex_MailTo = _payee
    bi.BulkInvoiceTypeExt = ThisBulkInvoiceType
    setPayToLines(bi)
    
    return bi
  }
  
  
  private function getPublicID(prefix : String, sequenceKey : String) : String{
    return prefix + _sequenceUtil.next(1, sequenceKey)
  }
  
  
  private function getNextBulkInvoiceNumber() : String{
    return "BIN" + getPaddedValue(_sequenceUtil.next(1, BIN_SEQ_KEY) as java.lang.String, "0", 10)
  }
  
  
  /**
   * 
   */
  private function getPaddedValue(value : String, padStr : String, len : int) :String{
    var valueLen = value.length()
    var pad = ""
    var i = 0
    while( (i < ((valueLen > len) ? 0 : len - valueLen))) {		  
      pad = pad.concat(padStr)
      i++
    }
    return pad.concat(value)
  }
  
  
   private function createItem(bill : BillImportRecordExt, result : BillImportResultExt) : BulkInvoiceItem{
    
    var item = new BulkInvoiceItem()
    
      var claim = BillImportCommon.getClaim(bill.ClaimNumber)
    
      item.Claim = claim
      item.Exposure = BillImportCommon.getExposureToPay(claim)
      item.CostCategory = CostCategory.TC_UNSPECIFIED
      item.PaymentType = item.Exposure.State == ExposureState.TC_OPEN ? PaymentType.TC_PARTIAL : PaymentType.TC_SUPPLEMENT
      item.Status = BulkInvoiceItemStatus.TC_DRAFT
      var currAmount = new CurrencyAmount()
      currAmount.Currency = Currency.TC_USD
      currAmount.Amount = bill.FinalAmount
      item.Amount = currAmount
      item.NonEroding = item.PaymentType == PaymentType.TC_SUPPLEMENT ? true : false
      item.PublicID = getPublicID(BI_ITEM_PREFIX, BI_ITEM_SEQ_KEY)
      item.LineCategoryExt = getLineCategory(bill)
      item.CostType = getCostType(item.LineCategoryExt)
      
      //This will enable the population of certain check fields such as Vendor Bill ID once the BI is approved
      buildHolder(bill, item, claim)
      
      result.Status = BillImportStatusExt.TC_PROCESSED
      
      //add the line category description used to process the payment.  This is only so the batch job knows the description
      //for the reports if a different expense code is sent in with the invoice versus what was sent in for validation. 
      result.LineCategoryDesc =  BillImportCommon.getLineCategoryDescription("WCExpenseCode", bill.ExpenseCode)  
    
    return item
  }
  
  
  protected function buildHolder(bill : BillImportRecordExt, item : BulkInvoiceItem, claim : Claim){
    var holder = new BillHolderExt()
    holder.VendorBillIDExt = bill.VendorBillID
    holder.OrigBillAmtExt = bill.OriginalAmount
    holder.OrigInvoiceDateExt = bill.OriginalInvoiceDate
    holder.GAIInvoiceRecDateExt = bill.GAIReceivedDate
    holder.InvoiceItem = item
    holder.SourceSystem = bill.SourceSystem
    holder.AdditionalRole = getAdditionalRole(bill)      
    holder.WCInjuryType = InjuryTypeUtil.getInjuryType(claim)    
  }
  
  
  /**
   * typecodemapping.xml defines which 3 digit code maps to which LineCategory
   */
  protected function getLineCategory(bill : BillImportRecordExt) : LineCategory{
    return _mapper.getInternalCodeByAlias("LineCategory", WC_EXPENSE_CODE, bill.ExpenseCode)
  }  
  
  
  protected function getAdditionalRole(bill : BillImportRecordExt) : ContactRole{
    var isCMFPerson = \ theContact : Contact -> theContact.CMFContactExt && typeof theContact == Person
    var isCMFCompany = \ theContact : Contact -> theContact.CMFContactExt && typeof theContact == Company
    
    if(typeof _payee == MedicalCareOrg || isCMFCompany(_payee)){
      return _mapper.getInternalCodeByAlias("ContactRole", getVendorMCONamespace(), bill.ExpenseCode)
    }else if(typeof _payee == Doctor || isCMFPerson(_payee)){
      return _mapper.getInternalCodeByAlias("ContactRole", getVendorDocNamespace(), bill.ExpenseCode) 
    }else{
      return ContactRole.TC_OTHER 
    }
  }    
  
  
  private function createVendor(binItemsArray : BillImportRecordExt[] ) : Contact {
    var abVendor : Contact
    if(binItemsArray.HasElements && binItemsArray[0].VendorTaxID != null){
      var taxID = binItemsArray[0].VendorTaxID
      var abUID = BillImportCommon.searchForVendor(taxID).LinkID
      
      if(abUID != null){
         abVendor = BillImportCommon.retrieveVendor(abUID)
      }
    }
    return abVendor
  }
  
  
  /**
   * Returns the User object for a given username
   */
  protected function getRequestingUser() : User{
    return Query.make(User)
                .join("Credential")
                .compare("UserName", Equals, "batchsu")
                .select()
                .AtMostOneRow
  }
  
  private function getResult(externalLinkID : String) : BillImportResultExt{
    return _results.firstWhere(\ b -> b.ExternalLinkID == externalLinkID)
  }
  
  /**
   * Hierarchy is Billing, Tax, or most recently updated Mailing
   */
   //Defect 9378 : select the Fees Address Type for the Mail To address on the bulk invoices 
  protected function getMailToAddress(payee : Contact) : Address{       
    var addresses = payee.AllAddresses
   
    if(addresses.hasMatch(\ a -> a.AddressType == AddressType.TC_FEES)){
      return addresses.where(\ a -> a.AddressType == AddressType.TC_FEES).first()
    }
    else if(addresses.hasMatch(\ a -> a.AddressType == AddressType.TC_BILLING)){
      return addresses.where(\ a -> a.AddressType == AddressType.TC_BILLING).first()
    }else if(addresses.hasMatch(\ a -> a.AddressType == AddressType.TC_TAX)){
      return addresses.where(\ a -> a.AddressType == AddressType.TC_TAX).first()
    }else{
      return addresses.where(\ a -> a.AddressType == AddressType.TC_MAILING).maxBy(\ a -> a.UpdateTime)
    }
  }  

  
  /**
   * TODO: This method is turning into quite a beast. Break it out into smaller sections based on functionality when time allows
   */
  public static function setBillDataOnPlaceholderCheck(placeholderCheckSet : CheckSet){
    var check = placeholderCheckSet.PrimaryCheck
    var bulkInvoice = check.BulkInvoiceItemInfo.BulkInvoiceItem.BulkInvoice
    var holder = check.BulkInvoiceItemInfo.BulkInvoiceItem.BillHolderExt
    
    check.ex_PayToAddress = bulkInvoice.PayToAddressExt
    
    check.VendorBillIDExt = holder.VendorBillIDExt
    check.OrigBillAmtExt = holder.OrigBillAmtExt
    check.OrigInvoiceDateExt = holder.OrigInvoiceDateExt
    check.GAIInvoiceRecDateExt = holder.GAIInvoiceRecDateExt
    check.SourceSystemExt = holder.SourceSystem

    var existingPayee = check.Claim.Contacts.firstWhere(\ c -> c.Contact.TaxID == check.Payees[0].ClaimContact.Contact.TaxID)
    if(existingPayee != null){ 
      
  // 02/08/2016 Defect#8269 schandanam : If vendor already exists with check payee role do not add other role      
    if(existingPayee.Roles.Count == 1 && existingPayee.Roles.first().Role == ContactRole.TC_CHECKPAYEE){
        var ccr = new ClaimContactRole()
        ccr.Role = holder.AdditionalRole
        existingPayee.addToRoles(ccr) 
      }
    }

    var payment = check.Payments[0]
    payment.WCInjuryTypeExt = holder.WCInjuryType
    var injuryType = payment.WCInjuryTypeExt
    //If the cost type is not Loss then set the Transaction Qualifier 
    if (getCostType(payment.LineItems[0].LineCategory)!= CostType.TC_CLAIMCOST) {
        payment.LineItems[0].TransactionQualifierExt = TransactionQualifierExt.TC_ALLOCATED
    }

    var bundle = gw.transaction.Transaction.getCurrent()
    bundle.addBundleTransactionCallback(new util.gaic.billimport.BillProcessorCallBackHandler(check.Claim.PublicID, 
                                                                                              injuryType, 
                                                                                              payment.ReserveLine))

    holder.remove()    
  }
  
  
  /**
   * If a certain LineCategory has both claimcost and expense cost types, then claimcost should take
   * precedence.
   */
  protected static function getCostType(lineCategory : LineCategory) : CostType{
    var costTypes = lineCategory.Categories.where(\ t -> typeof t == CostType)
    if(costTypes.contains(CostType.TC_CLAIMCOST)){
      return CostType.TC_CLAIMCOST 
    }else if(costTypes.contains(CostType.TC_EXPENSE)){
      return CostType.TC_EXPENSE
    }
    //unable to determine cost type, throw error?
    throw new Exception("Unable to determine CostType for lineCategory: " + lineCategory) 
  }
  
  /**
   * Sets the individual pay to lines, which are needed to properly build the message to checkwriter.
   */
  protected function setPayToLines(bi : BulkInvoice){
    var limit = 40
    var payToString = _payee.DisplayName
    var stringList = new ArrayList<String>()
    var stringToAdd = ""
    var payToStringArray : String[]
    var payToList = new ArrayList<String>()
    
    if(payToString != null){
      payToStringArray = payToString.split(" ")
    }
    
    for(payToStr in payToStringArray){
      payToList.add(payToStr) 
    }
    
    var payToIter = payToList.iterator()
    
    while(payToIter.hasNext()){
      var payTo = payToIter.next()
      if(payTo.length <= limit){
        var newString = stringToAdd + payTo + " "
        if(newString.length < limit){
          if(payToIter.hasNext()){
            stringToAdd = newString
          }else{
            stringList.add(newString)
            stringToAdd = "" 
          }
        }
        if(newString.length == limit){
          stringList.add(newString)
          stringToAdd = ""
        }
        if(newString.length > limit){
          stringList.add(stringToAdd)
          stringToAdd = payTo + " " 
        }
      }else{
        var longString = stringToAdd + payTo + " "
        while(longString != null){
          if(longString.length > limit){
            stringList.add(longString.substring(0, limit))
            longString = longString.substring(limit)
          }
          if(longString.length > 0 && longString.length <= limit){
            stringList.add(longString)
            longString = null 
          }
        }
      }//end else
    }//end while
    
    if(stringToAdd != null && !stringToAdd.Empty){
      stringList.add(stringToAdd) 
    }
    
    var iter = stringList.iterator()
    bi.PayToLine1Ext = iter.hasNext()? iter.next() : null
    bi.PayToLine2Ext = iter.hasNext()? iter.next() : null
    bi.PayToLine3Ext = iter.hasNext()? iter.next() : null
    bi.PayToLine4Ext = iter.hasNext()? iter.next() : null
    bi.PayToLine5Ext = iter.hasNext()? iter.next() : null
    bi.PayToLine6Ext = iter.hasNext()? iter.next() : null
    
  }   
}
