package util.gaic.billimport
uses java.lang.Exception

class BillProcessorCallBackHandler implements gw.transaction.BundleTransactionCallback {
  var _bundle : gw.transaction.Bundle
  var _claim : Claim
  var _injuryType : WCInjuryTypeExt
  var _resLine : ReserveLine
  
  construct(publicID : String, injuryType : WCInjuryTypeExt, resLine : ReserveLine) {
    _bundle = gw.transaction.Transaction.getCurrent()
    _claim = _bundle.loadByPublicId(Claim, publicID) as Claim
    _injuryType = injuryType
    _resLine = resLine  
  }

  override function afterBeanCallbacks() {
    for(res in _claim.getReservesIterator(true)){
      var reserve = res as Reserve
      if(reserve.ReserveLine == _resLine && reserve.WCInjuryTypeExt == null){
        reserve.WCInjuryTypeExt = _injuryType
        break
      }
    }
  }

  override function afterBundleCallbacksCleared(p0 : boolean) {

  }

  override function afterCommit() {

  }

  override function afterPreUpdate() {

  }

  override function afterSetIds() {

  }

  override function afterValidation() {

  }

  override function afterWriteToDatabase() {

  }

  override function beforeCommit() {

  }

  override function onCommitException(p0 : Exception) {

  }

}
