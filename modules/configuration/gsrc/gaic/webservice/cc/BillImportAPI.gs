package gaic.webservice.cc

uses gaic.import.bill.validation.BillImportValidator
uses gaic.import.bill.validation.MitchellBillImportValidator
uses util.gaic.billimport.BillImportCommon
uses util.gaic.billimport.MedDataProcessor
uses util.gaic.claimexport.ClaimExportUtil
uses gaic.import.bill.single.HcsSingleBillImporter
uses gaic.import.bill.single.MitchellSingleBillImporter
uses gaic.import.bill.single.OccmSingleBillImporter
uses gaic.import.bill.single.SingleBillImporter
uses gaic.import.bill.multi.MultiBillImporter
uses gaic.import.bill.multi.HcsMultiBillImporter
uses gaic.import.bill.multi.MitchellMultiBillImporter
uses gaic.import.bill.multi.OccmMultiBillImporter
uses gaic.import.bill.validation.AthensTpaPaymentImportValidator
uses gaic.import.bill.single.AthensTpaSinglePaymentImporter



/**
 * 
 */
@WebService
class BillImportAPI {

  construct() {}
  
  
  /**
   * Validate
   */
  function getBillImportErrors(billImportRecord : BillImportRecordExt) : BillImportResultExt{
    var validator : BillImportValidator
    
    switch(billImportRecord.SourceSystem){
      case SourceSystemExt.TC_MITCHELL_SA: validator = new MitchellBillImportValidator(billImportRecord); break
      case SourceSystemExt.TC_ATHENS_PAYMENT: validator = new AthensTpaPaymentImportValidator(billImportRecord); break
      default: validator = new BillImportValidator(billImportRecord)
    }

    return validator.validateAll()    
  }
  
  
  /**
   * Creates checks for true provider/vendor payments. Initially designed for Mitchell re-priced bills,
   * use of this function has been expanded for HCS and OCCM reimbursement payments on claims that
   * have been closed for more than 90 days. Usage has been expanded to include Athens TPA Payments.
   */
  function processBill(billImportRecord : BillImportRecordExt) : BillImportResultExt{
    var importer : SingleBillImporter
    
    switch(billImportRecord.SourceSystem){
      case SourceSystemExt.TC_HCS: importer = new HcsSingleBillImporter(billImportRecord); break
      case SourceSystemExt.TC_MITCHELL_SA:  importer = new MitchellSingleBillImporter(billImportRecord); break
      case SourceSystemExt.TC_OCCM: importer = new OccmSingleBillImporter(billImportRecord); break
      case SourceSystemExt.TC_ATHENS_PAYMENT: importer = new AthensTpaSinglePaymentImporter(billImportRecord); break
      default:
        var errorResult = new BillImportResultExt()
        errorResult.ErrorMessage = "Unable to process bill. No importer has been implemented for " + billImportRecord.SourceSystem.DisplayName
        errorResult.Status = BillImportStatusExt.TC_EXCEPTION
        return errorResult
    }
    
    return importer.processBill()
  }
  
  
   /**
   * Creates Bulk Invoices for vendor fees (Mitchell, OCCM, HCS)
   */
  function processFees(billImportRecords : BillImportRecordExt[]) : BillImportResultsHolder {
    var resultHolder : BillImportResultsHolder = new BillImportResultsHolder()
    var importer : MultiBillImporter
    
    switch(billImportRecords[0].SourceSystem){
      case SourceSystemExt.TC_HCS: importer = new HcsMultiBillImporter(billImportRecords); break
      case SourceSystemExt.TC_MITCHELL_SA_HDL_FEE: importer = new MitchellMultiBillImporter(billImportRecords); break
      case SourceSystemExt.TC_MITCHELL_DATACARE_UR: importer = new MitchellMultiBillImporter(billImportRecords); break
      case SourceSystemExt.TC_OCCM: importer = new OccmMultiBillImporter(billImportRecords); break
      default: 
        resultHolder.addToResults(buildErrorResult(billImportRecords[0].SourceSystem))
        return resultHolder
    }
    
    resultHolder.Results = importer.processFees()
    
    return resultHolder
  }
  
  
  /**
   * Imports Med data that comes along with bills for OCCM and HCS
   */
  function processMedData(medRecord : MedImportRecordExt) : BillImportResultExt{
    var processor = new MedDataProcessor(medRecord)
    
    //if claim is null after instantiating the processor, return claim not found status
    if(processor.Claim == null){
      var result = new BillImportResultExt()
      result.Status = BillImportStatusExt.TC_CLAIMNOTFOUND
      return result 
    }
    
    return processor.process()
  }
  
  
  /**
   * Retrieve extra claims data needed for the bill import record
   */
  function retrieveExtraClaimsData(billImportRecord : BillImportRecordExt) : BillImportResultExt {
    var result = new BillImportResultExt()
    var validator = new BillImportValidator(billImportRecord)
    var status : BillImportStatusExt = validator.validateClaimExists()
    
    if(status == BillImportStatusExt.TC_VALID) {
      var claim = BillImportCommon.getClaim(billImportRecord.ClaimNumber)
      result.LineCategoryDesc = BillImportCommon.getLineCategoryDescription("WCExpenseCode", billImportRecord.ExpenseCode)
      result.BusinessUnitCode = ClaimExportUtil.getWCBusinessUnitCode(claim).Code
      result.BusinessUnitName = ClaimExportUtil.getWCBusinessUnitCode(claim).DisplayName
      result.ClaimantName = BillImportCommon.getClaimantFullName(claim)
      result.DateOfLoss = BillImportCommon.getLossDate(claim)
    }
    
    if(status == BillImportStatusExt.TC_CLAIMNOTFOUND || status == BillImportStatusExt.TC_EXCEPTION) {
      result.LineCategoryDesc = BillImportCommon.getLineCategoryDescription("WCExpenseCode", billImportRecord.ExpenseCode)
    }
    result.Status = status
    result.ExternalLinkID = billImportRecord.ExternalLinkID
    return result
  }
  
  private function buildErrorResult(sourceSys : SourceSystemExt) : BillImportResultExt {
    var errorResult = new BillImportResultExt()
    errorResult.ErrorMessage = "Unable to process bill. No importer has been implemented for " + sourceSys.DisplayName
    errorResult.Status = BillImportStatusExt.TC_EXCEPTION
    return errorResult     
  }
  
}
