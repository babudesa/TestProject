package gw.api.databuilder

class CoverageLineBuilder extends CCDataBuilder<CoverageLine, CoverageLineBuilder> {
  construct()
  {
    super( entity.CoverageLine );
  }
  
  public function withCoverageSubtype(coverageSubtype : typekey.Coverage) : CoverageLineBuilder {
    set(CoverageLine.Type.TypeInfo.getProperty( "CoverageSubtype" ), coverageSubtype)
    return this
  }
  
  public function withCoverageType(coverageType : CoverageType) : CoverageLineBuilder {
    set(CoverageLine.Type.TypeInfo.getProperty( "CoverageType" ), coverageType)
    return this
  }
  
  public function withCoverage(coverage : LineCoverage) : CoverageLineBuilder {
    withCoverage(wrapBean(coverage))
    return this
  }
  
  public function withCoverage(coverage : ValueGenerator<? extends LineCoverage>) : CoverageLineBuilder {
    addArrayElement(CoverageLine.Type.TypeInfo.getProperty("Coverages"), coverage);
    return this;
  }
  
  
  public function withExposureUnitNumber(exposureUnitNumber : int) : CoverageLineBuilder {
    set(CoverageLine.Type.TypeInfo.getProperty( "ExposureUnitNumber" ), exposureUnitNumber)
    return this
  }
  
  public function onPolicyPeriod(policyPeriod : ValueGenerator<? extends PolicyPeriod>) : CoverageLineBuilder {
    set(CoverageLine.Type.TypeInfo.getProperty( "PolicyPeriod" ), policyPeriod)
    return this
  }

  public function onPolicyPeriod(policyPeriod : PolicyPeriod) : CoverageLineBuilder {
    onPolicyPeriod(wrapBean(policyPeriod))
    return this
  }
}
