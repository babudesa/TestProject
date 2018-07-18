package util.gaic.claimexport

class ClaimExportFunctionsFactory {

  private construct() {

  }
  
  static function getClaimFunctions() : ClaimExportClaimFunctions {
    return ClaimExportClaimFunctions.getInstance();
  }
  
  static function getExposureFunctions() : ClaimExportExposureFunctions {
    return ClaimExportExposureFunctions.getInstance()
  }
  
  static function getClaimContactFunctions() : ClaimExportClaimContactFunctions {
    return ClaimExportClaimContactFunctions.getInstance()
  }
  
  static function getPolicyFunctions() : ClaimExportPolicyFunctions {
    return ClaimExportPolicyFunctions.getInstance()
  }

}//end ClaimExportFunctionsFactory
