package gaic.import.bill.validation

uses gw.api.database.*
uses soap.abintegration.api.IContactAPI
uses soap.abintegration.entity.ABContactSearchCriteria
uses soap.abintegration.entity.ABContactSearchResultSpec
uses gw.api.soap.GWAuthenticationHandler
uses soap.abintegration.entity.ABContact
uses java.util.Date
uses util.gaic.claimexport.ClaimExportUtil
uses util.gaic.billimport.BillImportCommon


/**
 * Generic Validation class used to ensure that a payment can be created for an incoming bill/claim payment due.
 * 
 * Can be subclassed if validation requirements vary by vendor
 */
class BillImportValidator{
  
  private var _bill : BillImportRecordExt
  private var _claim : Claim
  private var _result : BillImportResultExt
  
    
  construct(billImportRecord : BillImportRecordExt){
    _bill = billImportRecord
    initResult()
    _claim = BillImportCommon.getClaim(_bill.ClaimNumber)
  }
  
  private function initResult(){
    _result = new BillImportResultExt()
    _result.ExternalLinkID = _bill.ExternalLinkID    
  }
  
  
  protected property get Bill() : BillImportRecordExt {return this._bill}
  protected property get Claim() : Claim {return this._claim}
  protected property get Result() : BillImportResultExt {return this._result}
  
  
  function validateAll() : BillImportResultExt{
        
    try{
      var validationResult : BillImportStatusExt = validateClaim()
      
      if(validationResult != BillImportStatusExt.TC_CLAIMNOTFOUND) {
        getExtraClaimsData()
      } else if(validationResult == BillImportStatusExt.TC_CLAIMNOTFOUND) {
        _result.LineCategoryDesc = BillImportCommon.getLineCategoryDescription("WCExpenseCode", _bill.ExpenseCode)
      }
      
      if(validationResult != BillImportStatusExt.TC_VALID) {
        _result.Status = validationResult 
      } else {
        _result.Status = validateVendor()
      }
      
      //check to see if the claim has been closed over 90 days after all other validation.
      //we dont want to return this unless other validation passes and this fails
      if(_result.Status == BillImportStatusExt.TC_VALID && 
          (_bill.SourceSystem == SourceSystemExt.TC_HCS || _bill.SourceSystem == SourceSystemExt.TC_OCCM) &&
          hasClaimBeenClosedFor90Days()){
           
         _result.Status = BillImportStatusExt.TC_CLAIMCLOSED90DAYS
      }
    }catch(e){
      gw.api.util.Logger.logInfo("Unexpected error during bill validation for [InvoiceNumber:ExpenseCode]: " + "[" + _bill.InvoiceNumber + ":" + _bill.ExpenseCode + "]")
      _result.Status = BillImportStatusExt.TC_EXCEPTION
      if(e.Message.length > 4000) {
        _result.ErrorMessage = e.Message.substring(0, 4000)   
      } else {
        _result.ErrorMessage = e.Message
      }
    }
 
    return _result
  }
  
  
  /*** Claim Related functions ***/

  protected function validateClaim() : BillImportStatusExt{
    
    if(_claim == null){
      return BillImportStatusExt.TC_CLAIMNOTFOUND
    }else if(_claim.checkDisconnectedFeatures()){
      return BillImportStatusExt.TC_FEATUREDISCONNECT
    }else if(!doesClaimHaveATPFeature()){
      return BillImportStatusExt.TC_FEATURENOTATP
    }else if(doesClaimHavePaymentsPendingApproval()){
      return BillImportStatusExt.TC_FINALPAYMENTPENDING
    }else {
      return BillImportStatusExt.TC_VALID
    }    
  }
  
  
  protected function doesClaimHaveATPFeature() : boolean{
    return BillImportCommon.hasAnyATPExposure(_claim)
  }
  
  
  protected function doesClaimHavePaymentsPendingApproval() : boolean{
    
    var paymentIDs = Query.make(Payment)
                          .compare("Claim", Relop.Equals, _claim)
                          .compare("Status", Relop.Equals, TransactionStatus.TC_PENDINGAPPROVAL)
                          .compare("PaymentType", Relop.Equals, PaymentType.TC_FINAL)
                          .select(\ pmtRow -> pmtRow.PublicID)
                                   
    return !paymentIDs.Empty
  }
  
  /**
   * If a claim has been closed for 90 days or longer, return a special status so that the bill can be handled
   * differently.
   */
  protected function hasClaimBeenClosedFor90Days() : boolean{
    return _claim.State == ClaimState.TC_CLOSED && _claim.CloseDate <= gw.api.util.DateUtil.currentDate().addDays(-90)
  }
  
  
  /*** Vendor related functions ***/
  
  protected function validateVendor() : BillImportStatusExt{
    
    var vendor = getVendor(_bill.VendorTaxID)
    
    if(vendor == null){
      return BillImportStatusExt.TC_VENDORNOTINAB
    }else if(!isVendorPayable(vendor)){
      return BillImportStatusExt.TC_VENDORNOTPAYABLE
    }else if(vendor.CloseDateExt != null){
      return BillImportStatusExt.TC_CLOSEDVENDOR
    }else if(hasForeignVendorTaxID(vendor.TaxID)){
      return BillImportStatusExt.TC_FOREIGNVENDOR
    }else {
      return BillImportStatusExt.TC_VALID
    }
  }
  
  
  protected function hasForeignVendorTaxID(taxID : String) : boolean{
    return taxID != null && taxID.startsWith("FV")
  }
  
  
  protected function isVendorPayable(vendor : ABContact) : boolean {
    var hasPayable = (typeof vendor).TypeInfo.Properties.hasMatch(\ propInfo -> propInfo.Name == "PayableExt")
    
    return hasPayable ? (vendor["PayableExt"] as boolean) 
                      : false
  }
  
  /**
   * Caller must be able to safely handle a null return value, in case no results are found.
   */
  private function getVendor(taxID : String) : soap.abintegration.entity.ABContact {
    var searchCriteria = new ABContactSearchCriteria()
    searchCriteria.ContactSubtype = soap.abintegration.enums.ABContact.TC_ABContact
    searchCriteria.TaxID = taxID
    
    var searchSpec = new ABContactSearchResultSpec()
    searchSpec.IncludeTotal = true
    searchSpec.MaxResults = 100
    
    var contactAPI = new soap.abintegration.api.IContactAPI()
    contactAPI.addHandler(new GWAuthenticationHandler("su", "gw"))
    
    var results = contactAPI.searchContact(searchCriteria, searchSpec).Results
    
    if(results.Count == 0){
      return null //if there no results, return null
    }else if(results.Count == 1){
      return results.first()  //if there is exactly one result, return it. If the vendor is closed then this should be handled by the caller 
    }else{
      return results.firstWhere(\ a -> a.CloseDateExt == null)  //return the first open vendor
    }
  }
 
  
  public function validateClaimExists() : BillImportStatusExt {
     var status : BillImportStatusExt = null
     if(_claim == null) {
       status = BillImportStatusExt.TC_CLAIMNOTFOUND
     }else {
       status = BillImportStatusExt.TC_VALID
     }
     return status
  }
 

  /**
   * Get the extra claims data needed for the reports (BusinessUnit, Claimant Name, Line Category description)
   */
  private function getExtraClaimsData(){
    var businessUnit : BusinessUnitExt = null
    var lineCategoryDescription : String = null
    var claimantName : String = null
    var lossDate : Date = null
    
    businessUnit = BillImportCommon.getClaimBusinessUnit(_claim)
    lineCategoryDescription = BillImportCommon.getLineCategoryDescription("WCExpenseCode", _bill.ExpenseCode)
    claimantName = BillImportCommon.getClaimantFullName(_claim)
    lossDate = BillImportCommon.getLossDate(_claim)
    
    _result.BusinessUnitCode = ClaimExportUtil.getWCBusinessUnitCode(_claim).Code
    _result.BusinessUnitName = ClaimExportUtil.getWCBusinessUnitCode(_claim).DisplayName
    _result.LineCategoryDesc = lineCategoryDescription
    _result.ClaimantName = claimantName
    _result.DateOfLoss = lossDate
  }
  
  
    
}