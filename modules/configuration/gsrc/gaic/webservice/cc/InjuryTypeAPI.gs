package gaic.webservice.cc
uses util.gaic.billimport.injurytype.InjuryTypeUtil
uses util.WCHelper

@WebService
class InjuryTypeAPI {

  construct() {}
  
  @Param("claim", "An actual Claim object that will be used to determine injury type.")
  @Returns("WCInjuryTypeExt type code. Returns null if the passed in Claim is not WC or EL Loss Type.")
  function getInjuryTypeByClaim(claim : Claim) : WCInjuryTypeExt{
    if(WCHelper.isWCorELLossType(claim)){
      return InjuryTypeUtil.getInjuryType(claim)
    }else{
      return null 
    }
  }
  
  @Param("claimPublicID", "The PublicID String of the Claim that will be used to determine injury type.")
  @Returns("WCInjuryTypeExt type code. Returns null if the passed in Claim is not WC or EL Loss Type.")
  function getInjuryTypeByClaimPublicID(claimPublicID : String) : WCInjuryTypeExt{
    var claim = Claim(claimPublicID)
    return getInjuryTypeByClaim(claim)  
  }
  
}
