package util.gaic.LDM

class LDMFunctionsFactory {

  private construct() {    

  }
  
  static function getAssignmentExposureFunctions() : LDMAssignmentExposureFunctions {
    return LDMAssignmentExposureFunctions.getInstance();
  }
  
  static function getAttorneyRatingFunctions() : LDMAttorneyRatingFunctions {
    return LDMAttorneyRatingFunctions.getInstance();
  }
  
  static function getClaimFunctions() : LDMClaimFunctions {
    return LDMClaimFunctions.getInstance();
  }
  
  static function getContactFunctions() : LDMContactFunctions {
    return LDMContactFunctions.getInstance();
  }
  
  static function getExposureFunctions() : LDMExposureFunctions {
    return LDMExposureFunctions.getInstance();
  }  
  
  static function getMatterFunctions() : LDMMatterFunctions {
    return LDMMatterFunctions.getInstance();
  }
  
  static function getMatterAssignmentFunctions() : LDMMatterAssignmentFunctions {
    return LDMMatterAssignmentFunctions.getInstance();
  }
  
  static function getMatterMediatorFunctions() : LDMMatterMediatorFunctions {
    return LDMMatterMediatorFunctions.getInstance();
  }
  
  static function getPolicyFunctions() : LDMPolicyFunctions {
    return LDMPolicyFunctions.getInstance();
  }
  
  
}
