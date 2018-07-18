package gw.entity
uses gw.api.financials.CancelCheckMethods

class CancelCheckMethodsImpl implements CancelCheckMethods {

  var _check : Check

  construct( check : Check ) {
    _check = check
  }

  override function voidCheck() {
    _check.unlinkDeductibles()
    try {
    _check.coreVoidCheck()
    } catch ( e ) {
    e.printStackTrace()
    throw e
    }
  }

  override function stopCheck() {
    _check.unlinkDeductibles()
    _check.coreStopCheck()
  }

  override function voidAndReissue( oldCheck : Check ) {
    // don't unlink deductibles, since the payments will be copied to the new check
    _check.coreVoidAndReissue( oldCheck )
  }

  override function stopAndReissue( oldCheck : Check ) {
    // don't unlink deductibles, since the payments will be copied to the new check
    _check.coreStopAndReissue( oldCheck )
  }

}
