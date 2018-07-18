package pcf_gs

/*
  tnewcomb 10/10/2011 - This is a UI helper class to correctly maintain the state of the TransactionQualiferExt field
                        on a transaction line item. See "Thinking in Gosu Volume 3" in the Knowledge Base for details on page process.
*/
class PaymentTransferLineItemsLV_PageProc {
  
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
            var originalExpenseType = (lineItem.OriginalVersion as TransactionLineItem).TransactionQualifierExt
            //if the qualifier had a previous value then use it, otherwise set the default value
            lineItem.TransactionQualifierExt = 
              originalExpenseType != null ? originalExpenseType : TransactionQualifierExt.TC_ALLOCATED
          }    
        }
      }
    }    
  }
}
