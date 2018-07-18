package libraries.RUCoverage_Entity

enhancement RUCoverageEnhancement : entity.RUCoverage {
  function isAssignableRUCoverage(includeRetired : boolean, expoType : ExposureType) : boolean {
    return engineAndTrailerNull() && CoverageSubtype.getTypeKeys(includeRetired).hasMatch(\ cst -> cst.hasCategory(this.Type) && expoType.hasCategory(cst))
  }
  
  private function engineAndTrailerNull() : boolean {
    var engineAndTrailerNull = false
    if (this typeis VehicleCoverage) {
      engineAndTrailerNull = (this.EngineExt == null && this.TrailerExt == null)
    }
    
    return engineAndTrailerNull
  }
}
