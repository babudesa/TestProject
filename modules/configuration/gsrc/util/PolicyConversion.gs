package util;

uses com.gaic.integration.cc.gscript.policyconversion.*;
uses com.gaic.claims.dto.PolicyConversionStatusDTO

class PolicyConversion {
  
  private static var polRequest : LegacyPolicyRequest = new LegacyPolicyRequest();
  private static var emptyList : PolicyConversionStatusDTO[] = new PolicyConversionStatusDTO[0]
  
  construct() {
  }
  
  static function getPolicy(polNum : String, polSymbol : String) : String{
    var retString : String = "";
    try{
      var polDTO = polRequest.getPolicyRequest(polNum, polSymbol);
      //modified conditions as per defect 5468 -tray2
      if(polDTO != null){
        //if(!"".equals(polDTO.getErrorMessage()) and !"SUCCESSFUL".equals(polDTO.getErrorMessage())){
          //retString = "Policy has already been selected for load from PRO, but has failed with the following error: " + polDTO.getErrorMessage() + ". Contact ClaimCenter Support (ClaimCenterSupport@gaig.com) for more information.";
		if(polDTO.getStatus() == "NEW") {
			retString = "Policy has already been selected for load from PRO."; 
		//}else if(polDTO.getStatus() == "FAILED"){
          //retString = "Policy has already been selected for load from PRO, but has failed. Contact ClaimCenter Support (ClaimCenterSupport@gaig.com) for more information."
		}else{
		//polDTO is not null and status is not failed and has empty error message
        //updatePolicyRequest is required
         //new routine, set the policy status new
          polRequest.updatePolicyRequest(polSymbol, polNum, "New", "")
          retString = "The requested policy will be available for use in 2 days: use Select Policy to build related claim at that time.";
        }
      }else{
        //polDTO is null
        polRequest.insertPolicyRequest(polNum, polSymbol, User.util.CurrentUser.getGeneralBusinessUnit(), "cc", User.util.CurrentUser.PublicID)
        //polRequest.insertPolicyRequest(polNum, User.util.CurrentUser.getGeneralBusinessUnit(), "cc", User.util.CurrentUser.PublicID)
      retString = "The requested policy will be available for use in 2 days: use Select Policy to build related claim at that time.";
      }
    }catch(e){
      var errorReason:String = "Policy Conversion PRO button routine has failed, reason: \n"
      retString = "Policy Conversion PRO button routine has failed!";
      errorReason = errorReason + e.fillInStackTrace() + "\n";
      for(val in e.StackTrace){
        errorReason = errorReason + val + "\n"
      }
      errorReason = errorReason + "\n\n--------------------------\n";
      errorReason = errorReason + "Original error: \n"
      errorReason = errorReason + e.fillInStackTrace() + "\n"
      for(val in e.StackTrace){
        errorReason = errorReason + val + "\n"
      }
      gw.api.util.Logger.logError( errorReason )
    }
    return retString;
  }
  
  static function getPolicyList(polNum : String, lob : String, status : String, start : DateTime, end : DateTime) : com.gaic.claims.dto.PolicyConversionStatusDTO[]{
    var retList : com.gaic.claims.dto.PolicyConversionStatusDTO[];
    var tempList : List<PolicyConversionStatusDTO>;
    try{
      var policy : String = "%"
      var lineOfBusiness : String = "%"
      var st : String = "%"
     
      if((start != null and end != null and start <= end) or (start == null or end == null)){
        if(polNum != null and !polNum.equals("")){
          policy = polNum
        }  
      
        if(lob != null and !lob.equals("")){
          lineOfBusiness = lob
        }
      
        if(status != null and !status.equals("")){
          st = status
        }
      
        if(start == null){
          start = new DateTime("01/01/0000")
        }
      
        if(end == null){
          end = new DateTime("12/31/9999")
        }
        
        tempList = polRequest.getFilteredPolicies(policy, lineOfBusiness, st, "CC", start, end)
        
        if(tempList.size() != 0){
            retList = tempList.toArray() as com.gaic.claims.dto.PolicyConversionStatusDTO[]
        }else{
            retList = emptyList
        }
      }
    }catch(e){
      var errorReason:String = "Policy Conversion PRO button routine has failed, reason: \n"
      errorReason = errorReason + e.fillInStackTrace() + "\n";
      for(val in e.StackTrace){
        errorReason = errorReason + val + "\n"
      }
      errorReason = errorReason + "\n\n--------------------------\n";
      errorReason = errorReason + "Original error: \n"
      errorReason = errorReason + e.fillInStackTrace() + "\n"
      for(val in e.StackTrace){
        errorReason = errorReason + val + "\n"
      }
      gw.api.util.Logger.logError( errorReason )
    }
    
    return retList;
  }
}
