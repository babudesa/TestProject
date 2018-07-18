package util.gaic.EDW;

class EDWFunctionsFactory {

  private construct() {
  }

  static function getClaimFunctions() : EDWClaimFunctions {
    return EDWClaimFunctions.getInstance();
  }

  static function getFeatureFunctions() : EDWFeatureFunctions {
    return EDWFeatureFunctions.getInstance();
  }

  static function getPolicyFunctions() : EDWPolicyFunctions {
    return EDWPolicyFunctions.getInstance();
  }

  static function getRiskFunctions() : EDWRiskFunctions {
    return EDWRiskFunctions.getInstance();
  }

  static function getCoverageFunctions() : EDWCoverageFunctions {
    return EDWCoverageFunctions.getInstance();
  }

  static function getPartyFunctions() : EDWPartyFunctions {
    return EDWPartyFunctions.getInstance();
  }

  static function getActivityFunctions() : EDWActivityFunctions {
    return EDWActivityFunctions.getInstance();
  }

  static function getNoteFunctions() : EDWNoteFunctions {
    return EDWNoteFunctions.getInstance();
  }

  static function getUserFunctions() : EDWUserFunctions {
    return EDWUserFunctions.getInstance();
  }

  static function getFinancialFunctions() : EDWFinancialFunctions {
    return EDWFinancialFunctions.getInstance();
  }

  static function getClaimContactRoleFunctions() : EDWClaimContactRoleFunctions {
    return EDWClaimContactRoleFunctions.getInstance();
  }

  static function getClaimContactFunctions() : EDWClaimContactFunctions {
    return EDWClaimContactFunctions.getInstance();
  }

  static function getCatastropheFunctions() : EDWCatastropheFunctions {
    return EDWCatastropheFunctions.getInstance();
  }

  static function getCatOccurrenceFunctions() : EDWCatOccurrenceFunctions {
    return EDWCatOccurrenceFunctions.getInstance();
  }

  static function getEvaluationFunctions() : EDWEvaluationFunctions {
    return EDWEvaluationFunctions.getInstance();
  }

  static function getNegotiationFunctions() : EDWNegotiationFunctions {
    return EDWNegotiationFunctions.getInstance();
  }

  static function getAssociationFunctions() : EDWAssociationFunctions {
    return EDWAssociationFunctions.getInstance();
  }

  static function getSIUFunctions() : EDWSIUFunctions {
    return EDWSIUFunctions.getInstance();
  }
  
  static function getCommonFunctions() : EDWCommonFunctions {
    return EDWCommonFunctions.getInstance();
  }

  static function isEnabled() : boolean {
    var environment = gw.api.system.server.ServerUtil.getEnv()
    if (environment != null) {
      environment = environment.toLowerCase()
    }
    return (environment == "local"
	    or environment == "dev"
	    or environment == "dev2"
	    or environment == "dev3"
	    or environment == "dev4"
	    or environment == "dev5"
	    or environment == "dev6"
	    or environment == "dev7"
	    or environment == "dev8"
	    or environment == "dev9"
	    or environment == "int"
	    or environment == "int2"
	    or environment == "int3"
	    or environment == "uat"
	    or environment == "cert"
	    or environment == "prod");
  }
}
