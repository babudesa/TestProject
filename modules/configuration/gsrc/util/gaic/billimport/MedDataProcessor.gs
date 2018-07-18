package util.gaic.billimport
uses java.lang.Exception

class MedDataProcessor {
  
  private var _medData : MedImportRecordExt as MedData
  private var _claim : Claim as Claim
  
  construct(medImportRecord: MedImportRecordExt) {
    _medData = medImportRecord
    _claim = BillImportCommon.getClaim(_medData.ClaimNumber)
  }
  
  function process() : BillImportResultExt {
    var result = initResult() 
    
    try{
      if(!claimHasOnlyELFeature()){
        gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
          var treatment = new MedTreatmentPrescribedExt()
          treatment.AmtPaidExt = _medData.AmountDue
          treatment.DaysSupplyExt = _medData.SupplyDays
          treatment.DescriptionExt = _medData.DetailDescription
          treatment.InvoiceNumberExt = _medData.InvoiceNumber
          treatment.NDCNumExt = _medData.NDCNumber
          treatment.PrescriberIDExt = _medData.PrescriberID
          treatment.PrescriptionNumExt = _medData.PrescriptionNumber
          treatment.ProviderExt = _medData.Provider
          treatment.RefServiceProviderExt = _medData.ReferringProviderName
          treatment.RefServiceProvTaxIDExt = _medData.ReferringProviderTaxID
          treatment.RendServiceProviderExt = _medData.ServiceProviderName
          treatment.RendServiceProvTaxIDExt = _medData.ServiceProviderTaxID    
          treatment.ServiceFromDateExt = _medData.ServiceFromDate
          treatment.ServiceToDateExt = _medData.ServiceToDate
          
          var medExposure = getMedExposure()
          if(medExposure != null){
            medExposure.addToMedTreatmentsPrescribedExt(treatment) 
          }else{
            throw new Exception("Medical Exposure is null")             
          }
          result.Status = BillImportStatusExt.TC_PROCESSED
        })
      }else{
         result.Status = BillImportStatusExt.TC_EMPLIBONLYCLAIM
      }
    }catch(ex){
      result.Status = BillImportStatusExt.TC_EXCEPTION
      if(ex.Message.length > 4000){
        result.ErrorMessage = ex.Message.substring(0, 4000)
      }else{
        result.ErrorMessage = ex.Message 
      }            
    }
    
    return result
  }
  
  private function claimHasOnlyELFeature() : boolean{
    return !_claim.Exposures.hasMatch(\ e -> e.ExposureType != ExposureType.TC_WC_EMPLOYERS_LIABILITY) 
  }
  
  private function initResult() : BillImportResultExt {
    var result = new BillImportResultExt()
    result.ExternalLinkID = _medData.ExternalLinkID
    return result
  }
  
  private function getMedExposure() : Exposure{
    return _claim.Exposures.firstWhere(\ e -> e.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS) 
  }

}
