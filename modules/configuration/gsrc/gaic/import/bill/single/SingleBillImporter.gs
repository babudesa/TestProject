package gaic.import.bill.single

uses gw.api.util.DateUtil
uses gw.transaction.Transaction
uses java.text.SimpleDateFormat
uses java.util.ArrayList
uses gw.api.util.Logger
uses gw.api.database.Query
uses util.gaic.billimport.injurytype.InjuryTypeUtil
uses java.lang.Exception
uses gw.api.util.TypecodeMapper
uses util.gaic.billimport.BillImportCommon
uses util.gaic.billimport.BillProcessorCallBackHandler

abstract class SingleBillImporter {
  
  protected static final var WC_EXPENSE_CODE : String = "WCExpenseCode"
  protected var _check : Check
  protected var _claim : Claim
  protected var _exposure : Exposure
  protected var _payeeContact : ClaimContact
  protected var _bill : BillImportRecordExt
  protected var _result : BillImportResultExt
  protected var _mapper : TypecodeMapper= gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
  protected var _injuryType : WCInjuryTypeExt
  protected var _reserveLine : ReserveLine
  
  construct(bill : BillImportRecordExt) {
    this._bill = bill
    this._result = new BillImportResultExt()
    this._result.ExternalLinkID = _bill.ExternalLinkID
  }
  
  abstract property get VendorMCONamespace() : String
  abstract property get VendorDocNamespace() : String
  abstract property get CheckCategory() : CheckCategoryExt
  
  
  /**
   * This is the intended entry point for the processor called by a client API. It creates it's own bundle and adds
   * any objects needed to process the bill to that bundle. It then creates the check to pay the given bill, and commits
   * it to the database. If an error occurrs, an Exception status is set on the result object and the stack trace is logged
   * to the server console.
   */
  function processBill() : BillImportResultExt{
    try{    
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {        
        
        _claim = bundleBean(BillImportCommon.getClaim(_bill.ClaimNumber)) as Claim
        _exposure = bundleBean(BillImportCommon.getExposureToPay(_claim)) as Exposure
        createVendor(_bill.VendorTaxID)
        
        createCheckWithCreator()
        
        _result.Status = BillImportStatusExt.TC_PROCESSED    
        //add the line category description used to process the payment.  This is only so the batch job knows the description
        //for the reports if a different expense code is sent in with the invoice versus what was sent in for validation. 
        _result.LineCategoryDesc =  BillImportCommon.getLineCategoryDescription("WCExpenseCode", _bill.ExpenseCode)    
        
        var cbh = new BillProcessorCallBackHandler(_claim.PublicID, _injuryType, _reserveLine)
        bundle.addBundleTransactionCallback(cbh)

      }, getRequestingUser())
      
      _result.CheckNumber = _check.CheckNumber
      _result.ClaimClosedDate = _claim.CloseDate
      
    }catch(ex){
      //set error status on bill object 
      _result.Status = BillImportStatusExt.TC_EXCEPTION
      _result.ErrorMessage = ex.Message
      Logger.logInfo("Error importing bill with ExternalLinkID: " + _bill.ExternalLinkID)
      Logger.logInfo(ex.StackTraceAsString)
    }
    
    return _result
  }
  
  
  /**
   * Searches AddressBook for a contact with the given tax ID and retrieves them if possible. Adds the vendor
   * to a claim if it isn't already there.  
   */
  @Param("String", "the tax ID to search for in AddressBook")
  @Returns("ClaimContact that was already on the claim or newly created")
  protected function createVendor(taxID : String){
    var abUID = BillImportCommon.searchForVendor(taxID).PublicID
    var abVendor : Contact
    
    //If vendor was found in search, retrieve them
    if(abUID != null){
      abVendor = BillImportCommon.retrieveVendor(abUID)
      var claimCon = _claim.Contacts.firstWhere(\ cc -> cc.Contact.TaxID == taxID && cc.Contact.CloseDateExt == null 
                                                                                  && cc.Contact.Linked)
      
      if(claimCon != null){
        _payeeContact = bundleBean(claimCon) as ClaimContact
        if(_payeeContact.Contact.Linked){
          //if the contact isn't synced, then sync it
          if(!_payeeContact.Contact.Synced){
            _payeeContact.Contact = _payeeContact.Contact.syncToAB() as Contact   
          }
        }else{
          throw new Exception("Unable to process bill because vendor with taxID " + taxID + " exists on claim but is not linked.")  //contact is not linked or synced; throw exception
        }
      }else{
        //vendor not found on claim, create it
        claimCon = new ClaimContact(gw.transaction.Transaction.getCurrent())
        claimCon.Claim = _claim
        claimCon.Contact = abVendor
        addAdditionalRole(claimCon)
        _payeeContact = claimCon
      }       
    }else{
      throw new Exception("Unable to locate vendor with tax ID " + taxID + " in AddressBook.")
    }
  }
  
  
  /**
   * Creates a check using the GW CheckCreator
   */
  protected function createCheckWithCreator(){
    
    var checkCreator =_exposure.CheckCreator
    var paymentType = getPaymentType()
    var lineCategory = getLineCategory()
    
    _injuryType = InjuryTypeUtil.getInjuryType(_claim)
    
    _check = checkCreator
      .withPayee(_payeeContact.Contact)
      .withPayeeRole(ContactRole.TC_VENDOR) 
      .withCheckAmount(_bill.FinalAmount)
      .withScheduledSendDate(DateUtil.currentDate().trimToMidnight())
      .withRequestingUser(_exposure.AssignedUser)
      .withLineCategory(lineCategory)
      .withCostCategory(CostCategory.TC_UNSPECIFIED)
      .withCostType(getCostType(lineCategory))
      .withPaymentType(paymentType)
      .withErodesReserves(paymentType == typekey.PaymentType.TC_SUPPLEMENT ? false : true)
      .withMailToAddress(getMailToAddress())
      .withMemo(getMemo())
      .withPayTo(_payeeContact.Contact.DisplayName)
      .withReportabilityType(ReportabilityType.TC_REPORTABLE)
      .createCheck()
    
    //populate fields that are not available on the creator    
    _check.VendorBillIDExt = _bill.VendorBillID 
    _check.GAIInvoiceRecDateExt = _bill.GAIReceivedDate  
    _check.CheckType = CheckType.TC_PRIMARY
    _check.InvoiceNumber = _bill.InvoiceNumber
    _check.PaymentMethod = PaymentMethod.TC_CHECK
    _check.BankAccount = BankAccount.TC_NATIONAL_CITY
    _check.CheckBatching = CheckBatching.TC_APDEFAULT
    _check.CheckInstructions = CheckHandlingInstructions.TC_DEFAULT
    setDeliveryDetails()   
    _check.ServicePdStart = _bill.ServiceFromDate
    _check.ServicePdEnd = _bill.ServiceToDate
    _check.CheckCategoryExt = CheckCategory
    _check.ex_PayToAddress = getMailToAddress()
    _check.UpdateCheckHistoryExt = true
    _check.Claimant = _exposure.Claimant
    _check.SourceSystemExt = _bill.SourceSystem    
    configureLineItem(lineCategory)
    setInjuryType() //injury type hierarchy
    setPayToLines() //breaks the name up onto several lines if necessary
    setVendorBillDetail() //populates details of the original invoice
    //addReserve(costType, injuryType) 
    checkCreator.prepareForCommit() //validates the check and updates taccounts      
  }
  
  protected function setDeliveryDetails(){
    _check.DeliveryMethod = DeliveryMethod.TC_SEND
    _check.ex_MailTo = _payeeContact.Contact
    _check.ex_MailToAddress = getMailToAddress()    
  }
  
  protected function configureLineItem(lineCategory : LineCategory){
    var lineItem = _check.Payments[0].FirstLineItem
    if(!lineItem.New){
      lineItem = bundleBean(lineItem) as TransactionLineItem 
    }
    lineItem.GrossAmountExt = _bill.FinalAmount
    lineItem.LineCategory = lineCategory
    //If the cost type is not Loss then set the Transaction Qualifier 
    if (this.getCostType(lineCategory)!= CostType.TC_CLAIMCOST) {
      lineItem.TransactionQualifierExt = TransactionQualifierExt.TC_ALLOCATED
    }
  }
  
  
  /**
   * Sets the injury type on the check's first and only payment. If this is the first payment for a particular
   * reserve line, then he injury type on the reserve will be set in a transaction pre-update rule.
   */
  protected function setInjuryType(){
    var payment = _check.Payments[0]
    payment.WCInjuryTypeExt = _injuryType
    _reserveLine = payment.ReserveLine
  }
  
  
  protected function setVendorBillDetail(){
    _check.VendorBillIDExt = _bill.VendorBillID
    _check.OrigBillAmtExt = _bill.OriginalAmount
    _check.OrigInvoiceDateExt = _bill.OriginalInvoiceDate
    _check.GAIInvoiceRecDateExt = _bill.GAIReceivedDate     
  }
  
  
  /**
   * If a certain LineCategory has both claimcost and expense cost types, then claimcost should take
   * precedence.
   */
  protected function getCostType(lineCategory : LineCategory) : CostType{
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
   * 
   */
  protected function getPaymentType() : PaymentType{
    if(_exposure.State == ExposureState.TC_OPEN || _exposure.State == ExposureState.TC_DRAFT){
      return PaymentType.TC_PARTIAL
    }else if(_exposure.State == ExposureState.TC_CLOSED){
      return PaymentType.TC_SUPPLEMENT
    }else{
      //throw exception? 
      return null
    }     
  }
  
  
  /**
   * typecodemapping.xml defines which 3 digit code maps to which LineCategory
   */
  protected function getLineCategory() : LineCategory{
    return _mapper.getInternalCodeByAlias("LineCategory", WC_EXPENSE_CODE, _bill.ExpenseCode)
  }
  
  
  /**
   * Hierarchy is Billing, Tax, or most recently updated Mailing
   */
  protected function getMailToAddress() : Address{       
    var addresses = _payeeContact.Contact.AllAddresses
    
    if(addresses.hasMatch(\ a -> a.AddressType == AddressType.TC_BILLING)){
      return addresses.where(\ a -> a.AddressType == AddressType.TC_BILLING).first()
    }else if(addresses.hasMatch(\ a -> a.AddressType == AddressType.TC_TAX)){
      return addresses.where(\ a -> a.AddressType == AddressType.TC_TAX).first()
    }else{
      return addresses.where(\ a -> a.AddressType == AddressType.TC_MAILING).maxBy(\ a -> a.UpdateTime)
    }
  }
  
  
  /**
   * The memo is called 'Statement of Account' in the A&D
   */
  protected function getMemo() : String {
    var sdf = new SimpleDateFormat("MM/dd/yyyy")
    var invoiceNumber = _bill.InvoiceNumber == null ? "" : _bill.InvoiceNumber

    return "Invoice Number " + invoiceNumber + ", "
      + "Date(s) of Service " + sdf.format(_bill.ServiceFromDate) + " - " + sdf.format(_bill.ServiceToDate)
  }
  
  
  /**
   * Convenience method to add beans to the current bundle
   */
  protected function bundleBean(bean : KeyableBean) : KeyableBean{
    return gw.transaction.Transaction.getCurrent().add(bean) 
  }
  
  
  /**
   * Each payee ClaimContact will get the CheckPayee role as a result of the checkCreator() function. However,
   * if the ClaimContact did not already exist on the claim we are required to add an additional role based off
   * the expense code. This function does that.
   */
  protected function addAdditionalRole(claimCon : ClaimContact) {
    if(_bill.ExpenseCode == null){
      throw new Exception("Expense Code is null on import object.")
    }
    
    var roleToAdd = ContactRole.TC_OTHER //init the role to 'Other' then hopefully make it more specific later
    
    var isCMFPerson = \ theContact : Contact -> theContact.CMFContactExt && typeof theContact == Person
    var isCMFCompany = \ theContact : Contact -> theContact.CMFContactExt && typeof theContact == Company
    
    //try and find a more specific role based off the vendor type
    if(typeof claimCon.Contact == MedicalCareOrg || isCMFCompany(claimCon.Contact)){
      roleToAdd = _mapper.getInternalCodeByAlias("ContactRole", getVendorMCONamespace(), _bill.ExpenseCode)
    }else if(typeof claimCon.Contact == Doctor || isCMFPerson(claimCon.Contact)){
      roleToAdd = _mapper.getInternalCodeByAlias("ContactRole", getVendorDocNamespace(), _bill.ExpenseCode) 
    }
    
    //add a new ClaimContactRole to the ClaimContact (payee)
    if(willRoleBeUnique(roleToAdd)){
      var ccr = new ClaimContactRole()
      ccr.ClaimContact = claimCon
      ccr.Role = roleToAdd
    }
  }
  
  protected function willRoleBeUnique(role : ContactRole) : boolean{
    if(_payeeContact.Roles != null){
      return !_payeeContact.Roles*.Role.contains(role)
    }    
    return true
  }
  
  
  /**
   * Returns the User object for a given username
   */
  protected function getRequestingUser() : User{
    return Query.make(User)
                .join("Credential")
                .compare("UserName", Equals, "batchsu" )
                .select()
                .AtMostOneRow
  } 
 
  
  //Completely taken from LitAdvisor - Refactor and move to util of its own?
  protected function setPayToLines(){
    var limit = 40
    var payToString = _payeeContact.Contact.DisplayName
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
    _check.PayToLine1Ext = iter.hasNext()? iter.next() : null
    _check.PayToLine2Ext = iter.hasNext()? iter.next() : null
    _check.PayToLine3Ext = iter.hasNext()? iter.next() : null
    _check.PayToLine4Ext = iter.hasNext()? iter.next() : null
    _check.PayToLine5Ext = iter.hasNext()? iter.next() : null
    _check.PayToLine6Ext = iter.hasNext()? iter.next() : null
    
  }  

}
