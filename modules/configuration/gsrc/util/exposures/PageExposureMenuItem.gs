package util.exposures;

class PageExposureMenuItem
{
  private var _coverage : Coverage;
  private var _coverageSubType : CoverageSubtype;
  private var _exposureType : ExposureType;
  construct()
  {
  }
  construct(c:Coverage, cs : CoverageSubtype, et : ExposureType){
    _coverage = c;
    _coverageSubType = cs;
    _exposureType = et;
  }
  
  property get Coverage() : Coverage{
    return _coverage; 
  }
  property get CoverageSubType() : CoverageSubtype{
    return _coverageSubType  
  }
  property get ExposureType() : ExposureType{
    return _exposureType; 
  }
}
