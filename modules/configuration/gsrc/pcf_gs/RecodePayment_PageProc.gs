package pcf_gs
uses util.gaic.CMS.validation.*
uses com.guidewire.pl.web.controller.UserDisplayableException

class RecodePayment_PageProc {

  private var _payment : Payment
  private var _zeroPaymentAdded : boolean = false
  private var _newLineItem : TransactionLineItem
  private var _origPayment : Payment

  construct(pymt : Payment, origPayment : Payment) {
    _payment = pymt
    _origPayment = origPayment
  }
  
  function addZeroPayment() : void {    
    for(tq in _origPayment.LineItems index i){
      if(tq != _payment.LineItems[i]){
        if (!_zeroPaymentAdded and 
          !exists(field in _payment.ChangedFields where field=="PaymentType" or 
          field=="ReserveLine" or field=="Exposure" or field=="CostType") and 
          !exists(field in _payment.LineItems[i].ChangedFields where field=="LineCategory")) {
          _newLineItem = _payment.addNewLineItem(java.math.BigDecimal.ZERO, null, null)
          if (_newLineItem != null){        
            _zeroPaymentAdded = true
            break
          }
        }
      }
    }
  }

  function removeZeroPayment() : void {
    if (_zeroPaymentAdded) {
      for (item in _payment.LineItems index i) {
        if (_payment.LineItems[i].Amount == java.math.BigDecimal.ZERO) {
          _payment.LineItems[i].remove()
          _zeroPaymentAdded = false
          break         
        }
      }
    }
  }
  
  function validateRecode(){
    if(CMSValidationUtil.generalPrecondition(_payment.Exposure)){
      var cmsVal = new PaymentValidation(_payment)
      CMSValidationUtil.validate(cmsVal)  
      var validationMessage = cmsVal.ValidationMessage  
      if(validationMessage != ""){
        throw new UserDisplayableException(validationMessage)
      }
    }
  }
}
