package gaic.import.bill.validation
uses gw.api.util.TypecodeMapperUtil

class MitchellBillImportValidator extends BillImportValidator{

  construct(billImportRecord : BillImportRecordExt) {
    super(billImportRecord)
  }
  
  
  protected override function validateClaim() : BillImportStatusExt{  
    if(Claim == null){
      return BillImportStatusExt.TC_CLAIMNOTFOUND
    }else if(!isExpenseCodeValid()){
      return BillImportStatusExt.TC_INVALIDEXPENSECODE
    }else if(Claim.checkDisconnectedFeatures()){
      return BillImportStatusExt.TC_FEATUREDISCONNECT
    }else if(!doesClaimHaveATPFeature()){
      return BillImportStatusExt.TC_FEATURENOTATP
    }else if(doesClaimHavePaymentsPendingApproval()){
      return BillImportStatusExt.TC_FINALPAYMENTPENDING
    }else {
      return BillImportStatusExt.TC_VALID
    }    
  }
  
  
  protected function isExpenseCodeValid() : boolean{    
    var util = TypecodeMapperUtil.getTypecodeMapper()
    var internalCode = util.getInternalCodeByAlias("LineCategory", "WCExpenseCode", Bill.ExpenseCode) 
    
    return internalCode != null
  }

}
