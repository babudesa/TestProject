package pcf_gs

class EditableTPOCLineItemLV_PageProc {
  
  var _exposure : ExposureISOMedicareExt as Exposure

  construct(exposureISO : ExposureISOMedicareExt) {
    
    _exposure = exposureISO
    
    
  }

}


/*

package pcf_gs

class EditablePaymentLineItemsLV_PageProc {

  private var _trans : Transaction
  
  construct(trans : Transaction) {
    _trans = trans
    initExpenseType()
  }  
  
  private function initExpenseType(){
    if(_trans typeis Payment){
      if(_trans.CostType == CostType.TC_CLAIMCOST){
        for(lineItem in _trans.LineItems){
          //the Transaction cost type has been switched to cost, null out the qualifier
          lineItem.TransactionQualifierExt = null 
        }
      }else{
        for(lineItem in _trans.LineItems){
          if(lineItem.TransactionQualifierExt == null){
            //set the default value for the qualifier
            lineItem.TransactionQualifierExt = TransactionQualifierExt.TC_ALLOCATED 
          }
        }
      }
    }    
  }
}
