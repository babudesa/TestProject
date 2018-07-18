package libraries.PolicyCoverage_Entity

enhancement PolicyCoverageEnhancement : entity.PolicyCoverage {
  function isAssignablePolicyCoverage(includeRetired : boolean, expoType : ExposureType) : boolean {
    return CoverageSubtype.getTypeKeys(includeRetired).hasMatch(\ cst -> cst.hasCategory(this.Type) && expoType.hasCategory(cst))
  }
}
