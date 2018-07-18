package pcf_gs

class MedicareExposureHelper {
  
  var _medicareExposure : ExposureISOMedicareExt as Exposure
  var _eligibleExposures : Exposure[] as Exposures
  //var _exposures : List<Exposure>

  construct(expos : List<Exposure>) {
  
    _medicareExposure = new ExposureISOMedicareExt()
    _eligibleExposures = expos
    
  }
  
  construct(exposureISO: ExposureISOMedicareExt){
     
     _medicareExposure = exposureISO 
    
  }
 

  
  property set selectedMedicareClaimant(claimant : Contact) {
   
     _eligibleExposures = _medicareExposure.Exposure.Claim.Exposures.where(\ e -> e.Claimant == claimant)
     
     if(_eligibleExposures.Count == 1)
       _medicareExposure.Exposure = _eligibleExposures.first()
    
  }
  
  
  function setPrimaryClaimant(){
    
     _medicareExposure.PrimaryClaimantExt = true 
    
  }
  

}
