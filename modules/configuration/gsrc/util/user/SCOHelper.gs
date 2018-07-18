package util.user
uses java.util.HashSet


class SCOHelper {

  construct() {

  }
  
  private static final var CCONE_PARAM = "cc1"
  private static final var CCTWO_PARAM = "cc2"
  private static final var MANUAL_BIN_APPROVER_PARAM = "manualbinapproval"
 
  
  public static property get CorpClaimsOneUser() : User {
    return util.GlobalParameters.ParameterFinder.getUserParameter(CCONE_PARAM, null) 
  }
  
  public static property get CorpClaimsTwoUser() : User {
    return util.GlobalParameters.ParameterFinder.getUserParameter(CCTWO_PARAM, null) 
  }
  
  public static property get ManualBulkInvoiceApproverUser() : User {
    return util.GlobalParameters.ParameterFinder.getUserParameter( MANUAL_BIN_APPROVER_PARAM, null)
  }

  /**
  * Set of all SCO GlobalParameterExt entities
  */
  public static property get AllSCOGlobalParams() : HashSet <GlobalParameterExt> {

    var scoGlobalParams = new HashSet <GlobalParameterExt>()
    scoGlobalParams.addAll(find(param in GlobalParameterExt where 
                                param.FieldNameExt == GlobalParamNameExt.TC_CCAUTO ||
                                param.FieldNameExt == GlobalParamNameExt.TC_CCPROPERTY ||
                                param.FieldNameExt == GlobalParamNameExt.TC_CCLIABILITY).toSet())

      return scoGlobalParams
  }  
  
  /**
  * Checks the set of SCO Global Parameters to see if the user is in the AllSCOGlobalParams Set
  * If so, then we have determined this user is an SCO
  */
  @Returns("is this user an SCO")
  public static function isAnSCO(user : User) : boolean {
    return exists(param in AllSCOGlobalParams where param.UserExt == user)
  }  
  
  /**
  * Gets the SCO user given the Loss Type.  Currently each LossType can only have
  * one SCO.
  */
  @Returns("the SCO user for the given Loss Type")
  public static function getSCOUser(type : LossType) : User {
    
    var scoUserParam = AllSCOGlobalParams.firstWhere(\ g -> g.LossTypeExt == type)
    var scoUser : User
    
    if(scoUserParam != null) {
      scoUser = scoUserParam.UserExt
    }else{
      scoUser = null
    }
    return scoUser
  }
  
  
}//End SCOHelper
