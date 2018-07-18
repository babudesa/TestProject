package util.gaic.EDWPayloadGen
uses util.gaic.EDWPayloadGen.EDWPayloadGenNoteFunctions
uses util.gaic.EDWPayloadGen.EDWPayloadGenFinancialFunctions
uses util.gaic.EDWPayloadGen.EDWPayloadGenFeatureFunction
uses util.gaic.EDWPayloadGen.EDWPayloadGenClaimFunctions
uses util.gaic.EDWPayloadGen.EDWPayloadGenClaimContactRoleFunctions
uses util.gaic.EDWPayloadGen.EDWPayloadGenClaimContactFunction
uses util.gaic.EDWPayloadGen.EDWPayloadGenAssociationFunctions
uses util.gaic.EDWPayloadGen.EDWPayloadGenActivityFunctions

class EDWPayloadGenFunctionsFactory {

  construct() {
  }
  static function getClaimFunctions() : EDWPayloadGenClaimFunctions {
    return EDWPayloadGenClaimFunctions.getInstance();
  }
  static function getActivityFunctions() : EDWPayloadGenActivityFunctions {
    return EDWPayloadGenActivityFunctions.getInstance();
  }
   static function getClaimContactFunctions() : EDWPayloadGenClaimContactFunction {
    return EDWPayloadGenClaimContactFunction.getInstance();
  }
   static function getClaimContactContactFunctions() : EDWPayloadGenClaimContactFunction {
    return EDWPayloadGenClaimContactFunction.getInstance();
  }
  static function getFeatureFunctions() : EDWPayloadGenFeatureFunction {
    return EDWPayloadGenFeatureFunction.getInstance();
  }
  static function getNoteFunctions() : EDWPayloadGenNoteFunctions {
    return EDWPayloadGenNoteFunctions.getInstance();
  }
  static function getClaimContactRoleFunctions() : EDWPayloadGenClaimContactRoleFunctions {
    return EDWPayloadGenClaimContactRoleFunctions.getInstance();
  }
   static function getAssociationFunctions() : EDWPayloadGenAssociationFunctions {
    return EDWPayloadGenAssociationFunctions.getInstance();
  }
   static function getFinancialFunctionsFunctions() : EDWPayloadGenFinancialFunctions {
    return EDWPayloadGenFinancialFunctions.getInstance();
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
	    or environment == "int"
	    or environment == "int2"
	    or environment == "int3"
	    or environment == "uat"
	    or environment == "cert"
	    or environment == "prod");
  }
}
