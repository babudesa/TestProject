package util.gaic.CMS.orm

class ORMHelper {
  
  private var _values : ORMValues as ORMValues
  
  construct(exposures : List<Exposure>, contactISO : ContactISOMedicareExt) {
    _values = new ORMValues()
  }
  
  class ORMValues{
    private var _indicator : boolean as Indicator = false
    private var _editable : boolean as Editable = true
  
    construct() {
  
    }  
  }
  
  function init(claim : Claim, contactISO : ContactISOMedicareExt) {
    
    var claimant = contactISO.Contact as Person //safe because ContactISOMedicareExt objects only get created for People
    
    
  }
  
  private function expoCond(expo : Exposure) : boolean {
    return (expo.MedicareExposureExt || expo.IsMedicareExposureExt) && expo.IsORMExposure    
  }
  
  private function newExpoCond(claim : Claim, expo : Exposure) : boolean {
    return claim.Exposures.hasMatch(\ e -> expoCond(e) && e.Claimant == expo.Claimant)    
  }  
}
