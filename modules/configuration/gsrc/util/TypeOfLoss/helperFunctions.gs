package util.TypeOfLoss;

class helperFunctions {
  construct() { }
  
  public static function getRiskState(exposure : Exposure) : State {
    var riskState : State
    if(exposure.Coverage.Subtype == "PolicyCoverage"){
      riskState = (exposure.Coverage as PolicyCoverage).State
    } else if(exposure.Coverage.Subtype == "PropertyCoverage"){
      riskState = (exposure.Coverage as PropertyCoverage).State
    } else if(exposure.Coverage.Subtype == "VehicleCoverage"){
      riskState = (exposure.Coverage as VehicleCoverage).State
    }
    return riskState
  }
  
  public static function getEDWParentCode(cov : CoverageType) : String {
    var edwPolicyMapping = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode("CoverageType", "policy", cov.Code)
    var edwParent = edwPolicyMapping!=null ? edwPolicyMapping : ""
    var parentIndex = edwParent.indexOf(" ") 
    
    if(parentIndex!=null and parentIndex!=-1){
      edwParent = edwPolicyMapping.substring(0, parentIndex)
    }
    
    return edwParent
  }
}
