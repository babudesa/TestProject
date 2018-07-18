package util.lvwrapper

uses gw.api.admin.AggregateLimitHelper

@Export
class CoverageLineLimitLVWrapper
{
  
  private var _aggregateLimitHelper : AggregateLimitHelper;
  private var _coverageLineLimit : CoverageLineLimit;
  
  construct(aggregateLimitHelper : AggregateLimitHelper, coverageLineLimit : CoverageLineLimit)
  {
    _aggregateLimitHelper = aggregateLimitHelper
    _coverageLineLimit = coverageLineLimit
  }
  
  property set CoverageType(cType : CoverageType){
    _aggregateLimitHelper.setCoverageType( _coverageLineLimit, cType)    
  }
  
  property get CoverageType() : CoverageType {
    return _coverageLineLimit.CoverageLine.CoverageType
  }
 
  property set CoverageLine(cLine : CoverageLine){
    _aggregateLimitHelper.setCoverageLine( _coverageLineLimit, cLine )
  }
  
  property get CoverageLine() : CoverageLine {
    return _coverageLineLimit.CoverageLine 
  }
  
}
